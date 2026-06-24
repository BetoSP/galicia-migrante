'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function RecuperarPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'Ocurrió un error al enviar el correo.');
    } finally {
      setLoading(false);
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
          <h1 className={styles.title}>Recuperar Cuenta</h1>
          <p className={styles.subtitle}>Enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
        
        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
            <div className={styles.successMsg}>
              ¡Enlace enviado! Hemos remitido un enlace de restablecimiento a <strong>{email}</strong>.
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              Revisa tu bandeja de entrada y correo no deseado (SPAM) para completar el proceso.
            </p>
            <Link href="/auth" className={styles.btnSubmit} style={{ textDecoration: 'none' }}>
              Volver al Ingreso
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email registrado</label>
              <input 
                type="email" 
                className={styles.input} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="correo@ejemplo.com"
                required 
              />
            </div>

            <button type="submit" disabled={loading} className={styles.btnSubmit}>
              {loading ? 'Enviando...' : 'Enviar Enlace'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Link href="/auth" className={styles.link}>Volver a iniciar sesión</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
