'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import styles from './auth.module.css';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, register, loginWithPasskey } = useAuth();

  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [aceptoPrivacidad, setAceptoPrivacidad] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Turnstile Simulado/Real
  const [turnstileToken, setTurnstileToken] = useState('mock-turnstile-token');

  useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, router, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        setSuccessMsg('¡Ingreso exitoso! Redirigiendo...');
        setTimeout(() => router.push(redirectPath), 1000);
      } else {
        if (!nombre || !apellido) {
          throw new Error('Por favor completa tu nombre y apellido.');
        }
        if (!aceptoTerminos || !aceptoPrivacidad) {
          throw new Error('Debes aceptar los términos y condiciones y las políticas de privacidad.');
        }
        
        await register(email, password, {
          nombre,
          apellido,
          aceptoTerminos,
          aceptoPrivacidad,
          turnstileToken,
        });

        setSuccessMsg('¡Registro completado! Por favor revisa tu correo electrónico para confirmar tu cuenta.');
        setSubmitting(false);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Ocurrió un error en el proceso.');
      setSubmitting(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!email) {
      setErrorMsg('Por favor ingresa tu email para iniciar sesión con biometría.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await loginWithPasskey(email);
      setSuccessMsg('¡Identidad biométrica confirmada! Redirigiendo...');
      setTimeout(() => router.push(redirectPath), 1500);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <svg width="44" height="44" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="8" fill="#4A90B8"/>
              <path d="M4 22 Q9 18 14 22 Q19 26 24 22 Q29 18 32 22" stroke="#C8A96E" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M18 8 V16 M14 12 H22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className={styles.title}>Galicia Migrante</h1>
          <p className={styles.subtitle}>
            {mode === 'login' ? 'Bienvenido de nuevo a tu portal' : 'Crea tu cuenta de diáspora hoy'}
          </p>
        </div>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tabBtn} ${mode === 'login' ? styles.tabBtnActive : ''}`}
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`${styles.tabBtn} ${mode === 'register' ? styles.tabBtnActive : ''}`}
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Registrarse
          </button>
        </div>

        {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
        {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'register' && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nombre</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  placeholder="Tu nombre"
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Apellido</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={apellido} 
                  onChange={(e) => setApellido(e.target.value)} 
                  placeholder="Tu apellido"
                  required 
                />
              </div>
            </>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input 
              type="email" 
              className={styles.input} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="correo@ejemplo.com"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Contraseña</label>
            <input 
              type="password" 
              className={styles.input} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          {mode === 'login' ? (
            <div className={styles.row}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} /> Recordarme
              </label>
              <Link href="/auth/recuperar" className={styles.link}>¿Olvidaste tu contraseña?</Link>
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox} 
                  checked={aceptoTerminos} 
                  onChange={(e) => setAceptoTerminos(e.target.checked)} 
                  required
                />
                <span>Acepto los <Link href="/terminos" className={styles.link} target="_blank">Términos de Servicio</Link></span>
              </label>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox} 
                  checked={aceptoPrivacidad} 
                  onChange={(e) => setAceptoPrivacidad(e.target.checked)} 
                  required
                />
                <span>Acepto las <Link href="/privacidad" className={styles.link} target="_blank">Políticas de Privacidad</Link></span>
              </label>
              
              {/* Turnstile Captcha Widget mock/visual representation */}
              <div className={styles.turnstileContainer}>
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'rgba(255,255,255,0.6)'
                }}>
                  <input type="checkbox" checked readOnly style={{ accentColor: '#2ec4b6' }} />
                  <span>Verificado por Cloudflare Turnstile (Protección bots)</span>
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={submitting} className={styles.btnSubmit}>
            {submitting ? 'Procesando...' : mode === 'login' ? 'Ingresar' : 'Crear Cuenta'}
          </button>
        </form>

        <div className={styles.divider}>o accede de forma rápida</div>

        <button onClick={handleBiometricLogin} className={styles.btnSocial} style={{ borderColor: 'var(--gm-gold)', color: 'var(--gm-gold)' }}>
          🔑 Iniciar Sesión con Huella o Rostro (Passkey)
        </button>

        <button 
          onClick={() => alert('Autenticación de Google requiere configurar credenciales OAuth en consola Supabase.')} 
          className={styles.btnSocial}
          style={{ marginTop: '10px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.386-2.876-6.386-6.386 0-3.51 2.876-6.386 6.386-6.386 1.54 0 2.98.55 4.12 1.48L21.1 4.4C18.78 2.24 15.68 1 12 1 5.925 1 1 5.925 1 12s4.925 11 11 11c5.523 0 10-4.477 10-10 0-.66-.08-1.3-.23-1.92H12.24z" fill="white"/>
          </svg>
          Ingresar con Google
        </button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', background: '#0d1b2a', color: 'white' }}>Cargando portal de acceso...</div>}>
      <AuthContent />
    </Suspense>
  );
}
