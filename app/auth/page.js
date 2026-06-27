'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useTranslation } from '@/components/LanguageContext';
import { useToast } from '@/components/Toast';
import styles from './auth.module.css';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, register, loginWithPasskey } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [aceptoPrivacidad, setAceptoPrivacidad] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
        setSuccessMsg(t('auth.success_msg') || '¡Ingreso exitoso! Redirigiendo...');
        setTimeout(() => router.push(redirectPath), 1000);
      } else {
        if (!nombre || !apellido) {
          throw new Error(t('auth.error_name_required') || 'Por favor completa tu nombre y apellido.');
        }
        if (!aceptoTerminos || !aceptoPrivacidad) {
          throw new Error(t('auth.error_accept_terms') || 'Debes aceptar los términos y condiciones y las políticas de privacidad.');
        }

        if (password !== confirmPassword) {
          throw new Error(t('auth.error_passwords_mismatch') || 'Las contraseñas no coinciden. Por favor verifica.');
        }

        // Validación de complejidad de contraseña (mínimo 10 caracteres, una mayúscula, una minúscula, un número y un caracter especial)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/;
        if (!passwordRegex.test(password)) {
          throw new Error(t('auth.error_password_complexity') || 'La contraseña debe tener al menos 10 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.');
        }
        
        await register(email, password, {
          nombre,
          apellido,
          aceptoTerminos,
          aceptoPrivacidad,
          turnstileToken,
        });

        setSuccessMsg(t('auth.register_success') || '¡Registro completado! Por favor revisa tu correo electrónico para confirmar tu cuenta.');
        setSubmitting(false);
      }
    } catch (err) {
      setErrorMsg(err.message || t('auth.error_generic') || 'Ocurrió un error en el proceso.');
      setSubmitting(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!email) {
      setErrorMsg(t('auth.error_email_biometric') || 'Por favor ingresa tu email para iniciar sesión con biometría.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await loginWithPasskey(email);
      setSuccessMsg(t('auth.biometric_success') || '¡Identidad biométrica confirmada! Redirigiendo...');
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/trisquel.png"
              alt="Trisquel de las Dos Orillas — Galicia Migrante"
              style={{ height: '72px', width: 'auto' }}
            />
          </div>
          <h1 className={styles.title}>
            <span style={{ fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)", fontWeight: 700, letterSpacing: '0.04em' }}>GALICIA</span>
            {' '}
            <span style={{ fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)", fontWeight: 300, letterSpacing: '0.18em' }}>MIGRANTE</span>
          </h1>
          <p className={styles.subtitle}>
            {mode === 'login' 
              ? (t('auth.welcome_back') || 'Bienvenido de nuevo a tu portal') 
              : (t('auth.create_account') || 'Crea tu cuenta de diáspora hoy')}
          </p>
        </div>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tabBtn} ${mode === 'login' ? styles.tabBtnActive : ''}`}
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); setConfirmPassword(''); }}
          >
            {t('nav.ingresar') || 'Iniciar Sesión'}
          </button>
          <button 
            className={`${styles.tabBtn} ${mode === 'register' ? styles.tabBtnActive : ''}`}
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); setConfirmPassword(''); }}
          >
            {t('nav.registrarse') || 'Registrarse'}
          </button>
        </div>

        {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
        {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'register' && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t('auth.first_name') || 'Nombre'}</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  placeholder={t('auth.first_name_placeholder') || 'Tu nombre'}
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t('auth.last_name') || 'Apellido'}</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={apellido} 
                  onChange={(e) => setApellido(e.target.value)} 
                  placeholder={t('auth.last_name_placeholder') || 'Tu apellido'}
                  required 
                />
              </div>
            </>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input 
              type="text" 
              className={styles.input} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="correo@ejemplo.com"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('auth.password') || 'Contraseña'}</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {mode === 'register' && (
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('auth.confirm_password') || 'Confirmar contraseña'}</label>
              <input
                type="password"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {mode === 'login' ? (
            <div className={styles.row}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox} 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                /> {t('auth.remember_me') || 'Recordarme'}
              </label>
              <Link href="/auth/recuperar" className={styles.link}>{t('auth.forgot_password') || '¿Olvidaste tu contraseña?'}</Link>
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
                <span>{t('auth.accept') || 'Acepto los'} <Link href="/terminos" className={styles.link} target="_blank">{t('auth.terms_service') || 'Términos de Servicio'}</Link></span>
              </label>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox} 
                  checked={aceptoPrivacidad} 
                  onChange={(e) => setAceptoPrivacidad(e.target.checked)} 
                  required
                />
                <span>{t('auth.accept') || 'Acepto las'} <Link href="/privacidad" className={styles.link} target="_blank">{t('auth.privacy_policy') || 'Políticas de Privacidad'}</Link></span>
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
                  <span>{t('auth.turnstile_verified') || 'Verificado por Cloudflare Turnstile (Protección bots)'}</span>
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={submitting} className={styles.btnSubmit}>
            {submitting ? (t('auth.processing') || 'Procesando...') : mode === 'login' ? (t('nav.ingresar') || 'Ingresar') : (t('auth.create_btn') || 'Crear Cuenta')}
          </button>
        </form>

        <div className={styles.divider}>{t('auth.fast_access') || 'o accede de forma rápida'}</div>

        <button onClick={handleBiometricLogin} className={styles.btnSocial} style={{ borderColor: 'var(--gm-gold)', color: 'var(--gm-gold)' }}>
          🔑 {t('auth.biometric_btn') || 'Iniciar Sesión con Huella o Rostro (Passkey)'}
        </button>

        <button
          onClick={() => toast(t('auth.google_notice') || 'La autenticación con Google requiere configurar credenciales OAuth en el panel de Supabase.', { type: 'info', duration: 6000 })}
          className={styles.btnSocial}
          style={{ marginTop: '10px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.386-2.876-6.386-6.386 0-3.51 2.876-6.386 6.386-6.386 1.54 0 2.98.55 4.12 1.48L21.1 4.4C18.78 2.24 15.68 1 12 1 5.925 1 1 5.925 1 12s4.925 11 11 11c5.523 0 10-4.477 10-10 0-.66-.08-1.3-.23-1.92H12.24z" fill="white"/>
          </svg>
          {t('auth.google_btn') || 'Ingresar con Google'}
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
