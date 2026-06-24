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

  // Sincronizar tokens en las cookies
  const syncCookies = (sessionObj) => {
    if (sessionObj) {
      document.cookie = `sb-access-token=${sessionObj.access_token}; path=/; max-age=604800; SameSite=Lax; Secure`;
      document.cookie = `sb-refresh-token=${sessionObj.refresh_token}; path=/; max-age=604800; SameSite=Lax; Secure`;
    } else {
      document.cookie = 'sb-access-token=; path=/; max-age=0; SameSite=Lax; Secure';
      document.cookie = 'sb-refresh-token=; path=/; max-age=0; SameSite=Lax; Secure';
    }
  };

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
      syncCookies(activeSession);
      if (activeSession?.user) {
        fetchProfileAndRoles(activeSession.user.id);
      }
      setLoading(false);
    });

    // 2. Suscribirse a cambios de estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      syncCookies(newSession);

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
    syncCookies(null);
    setLoading(false);
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
    return data;
  };

  // Simulación / Esqueleto de Biometría / Passkeys (WebAuthn)
  const registerPasskey = async () => {
    if (!window.PublicKeyCredential) {
      throw new Error('Las llaves de acceso (Passkeys) no están soportadas en este navegador.');
    }
    
    // En Supabase real, esto inicia el flujo MFA WebAuthn o usa credenciales de navegador
    // Para esta fase, simularemos el registro exitoso guardándolo en la metadata del usuario
    alert('Registrando Passkey biométrica con Windows Hello / FaceID / TouchID...');
    
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) throw new Error('Debes iniciar sesión para registrar una Passkey.');

    const { data, error } = await supabase.auth.updateUser({
      data: {
        has_passkey: true,
        passkey_registered_at: new Date().toISOString(),
      }
    });

    if (error) throw error;
    
    // Refrescar perfil local
    if (profile) {
      setProfile({ ...profile, has_passkey: true });
    }
    return data;
  };

  const loginWithPasskey = async (email) => {
    if (!window.PublicKeyCredential) {
      throw new Error('Las llaves de acceso (Passkeys) no están soportadas en este navegador.');
    }

    // Flujo simulado de login rápido
    alert(`Iniciando sesión biométrica para ${email}...`);
    
    // En producción se usaría:
    // await supabase.auth.signInWithSSO(...) o signInWithOtp con passkey
    
    // Obtenemos un usuario simulado o hacemos un login directo con credencial otp / mockup
    // Para demo/desarrollo local usaremos una cuenta demo existente
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'PasskeySuperSecureMockupPassword123!',
    });

    if (error) {
      throw new Error('No se encontró una Passkey registrada para este email o falló la verificación.');
    }
    return data;
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
