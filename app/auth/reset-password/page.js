'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // En Next.js, tras pulsar en el correo, Supabase redirecciona con hash tokens, los cuales
  // el SDK lee automáticamente e inicia la sesión en segundo plano.
  // Por ende, la sesión ya está activa y solo debemos actualizar la contraseña del usuario.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'Error al restablecer la contraseña. Es posible que el enlace haya expirado.');
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
          <h1 className={styles.title}>Nueva Contraseña</h1>
          <p className={styles.subtitle}>Introduce tu nueva contraseña segura</p>
        </div>

        {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
        
        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
            <div className={styles.successMsg}>
              ¡Contraseña restablecida correctamente! Ya puedes acceder con tus nuevas credenciales.
            </div>
            <Link href="/auth" className={styles.btnSubmit} style={{ textDecoration: 'none' }}>
              Iniciar Sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nueva Contraseña</label>
              <input 
                type="password" 
                className={styles.input} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Confirmar Contraseña</label>
              <input 
                type="password" 
                className={styles.input} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>

            <button type="submit" disabled={loading} className={styles.btnSubmit}>
              {loading ? 'Guardando...' : 'Restablecer Contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
