'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import styles from './Toast.module.css';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, { type = 'info', duration = 4000 } = {}) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type: 'confirm', resolve }]);
    });
  }, []);

  return (
    <ToastContext.Provider value={{ toast, confirm, dismiss }}>
      {children}
      <div className={styles.container} aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const handleConfirm = (result) => {
    toast.resolve(result);
    onDismiss(toast.id);
  };

  if (toast.type === 'confirm') {
    return (
      <div
        ref={ref}
        className={`${styles.toast} ${styles.confirm}`}
        role="alertdialog"
        aria-modal="true"
        aria-label="Confirmación requerida"
        tabIndex={-1}
        onKeyDown={(e) => { if (e.key === 'Escape') handleConfirm(false); }}
      >
        <p className={styles.message}>{toast.message}</p>
        <div className={styles.confirmActions}>
          <button className={styles.btnConfirm} onClick={() => handleConfirm(true)} autoFocus>
            Confirmar
          </button>
          <button className={styles.btnCancel} onClick={() => handleConfirm(false)}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.toast} ${styles[toast.type]}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.message}>{toast.message}</span>
      <button
        className={styles.close}
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
