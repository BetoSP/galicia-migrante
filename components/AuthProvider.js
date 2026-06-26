'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  roles: [],
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  registerPasskey: async () => {},
  loginWithPasskey: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchProfileAndRoles = async (userId) => {
    try {
      // 1. Obtener perfil de usuario
      const { data: profileData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();
      
      setProfile(profileData);

      // 2. Obtener roles asignados
      const { data: rolesData } = await supabase
        .from('usuarios_roles')
        .select('rol_id, roles (nombre, es_admin)')
        .eq('usuario_id', userId);
      
      if (rolesData) {
        const userRoles = rolesData.map((ur) => ({
          id: ur.rol_id,
          nombre: ur.roles?.nombre || '',
          es_admin: ur.roles?.es_admin || false,
        }));
        setRoles(userRoles);
      }
    } catch (err) {
      console.error('Error fetching user roles/profile:', err);
    }
  };

  useEffect(() => {
    // 1. Obtener sesión activa inicial
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      setUser(activeSession?.user ?? null);
      if (activeSession?.user) {
        fetchProfileAndRoles(activeSession.user.id);
      }
      setLoading(false);
    });

    // 2. Suscribirse a cambios de estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === 'SIGNED_IN' && newSession?.user) {
        fetchProfileAndRoles(newSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setRoles([]);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoading(false);
      throw error;
    }
    return data;
  };

  const register = async (email, password, { nombre, apellido, aceptoTerminos, aceptoPrivacidad, turnstileToken }) => {
    setLoading(true);
    
    // Si hay token de Turnstile, lo podríamos validar en el backend (o Next.js API route)
    // Para desarrollo de frontend, asumimos la llamada directa de registro
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          apellido,
          acepto_terminos: aceptoTerminos,
          acepto_privacidad: aceptoPrivacidad,
        },
      },
    });

    if (error) {
      setLoading(false);
      throw error;
    }

    // Insertar perfil en la tabla 'usuarios' si el disparador automático no lo hace
    // Opcionalmente podemos forzar la escritura de rol de visor por defecto
    if (data?.user) {
      try {
        await supabase.from('usuarios').insert({
          id: data.user.id,
          email: data.user.email,
          nombre,
          apellido,
          acepto_terminos: aceptoTerminos,
          acepto_terminos_fecha: new Date().toISOString(),
          acepto_privacidad: aceptoPrivacidad,
          acepto_privacidad_fecha: new Date().toISOString(),
        });

        // Rol por defecto: visor
        const { data: roleData } = await supabase
          .from('roles')
          .select('id')
          .eq('nombre', 'visor')
          .single();

        if (roleData) {
          await supabase.from('usuarios_roles').insert({
            usuario_id: data.user.id,
            rol_id: roleData.id,
          });
        }
      } catch (err) {
        console.warn('El perfil de usuario ya existía o fue manejado por trigger:', err);
      }
    }

    setLoading(false);
    return data;
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setRoles([]);
    setLoading(false);
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
    return data;
  };

  // Passkeys / WebAuthn — pendiente de implementación real (segunda etapa)
  // Ver: https://supabase.com/docs/guides/auth/auth-mfa y WebAuthn API
  const registerPasskey = async () => {
    throw new Error('El registro de Passkeys estará disponible en la próxima etapa del portal.');
  };

  const loginWithPasskey = async () => {
    throw new Error('El login con Passkey estará disponible en la próxima etapa del portal.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        roles,
        loading,
        login,
        register,
        logout,
        resetPassword,
        registerPasskey,
        loginWithPasskey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
