'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, roles, logout, registerPasskey } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [planLimits, setPlanLimits] = useState({
    nombre: 'Gratuito',
    limite_personas: 50,
    limite_fotos: 100,
    limite_miembros: 10,
    precio: 'Gratis'
  });
  const [loadingDb, setLoadingDb] = useState(true);
  const [currentUsage, setCurrentUsage] = useState({
    personas: 12,
    fotos: 4,
    miembros: 1,
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [processingUpgrade, setProcessingUpgrade] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadPlanAndUsage = async () => {
      try {
        // 1. Cargar suscripción activa
        const { data: subData } = await supabase
          .from('suscripciones')
          .select('*, planes (*)')
          .eq('usuario_id', user.id)
          .eq('estado', 'activa')
          .order('created_at', { ascending: false })
          .maybeSingle();

        if (subData) {
          setSubscription(subData);
          if (subData.planes) {
            setPlanLimits({
              nombre: subData.planes.nombre,
              limite_personas: subData.planes.limite_personas,
              limite_fotos: subData.planes.limite_fotos,
              limite_miembros: subData.planes.limite_miembros,
              precio: `$${subData.planes.precio_ars} ARS / €${subData.planes.precio_eur} EUR`
            });
          }
        }

        // 2. Simular/obtener recuento de personas creadas en el árbol
        // En un escenario real consultaríamos la tabla personas_arbol
        // Para la demo, dejamos un recuento fijo o consultamos si hay datos
        const { count } = await supabase
          .from('personas_arbol')
          .select('*', { count: 'exact', head: true });
        
        setCurrentUsage((prev) => ({
          ...prev,
          personas: count || 12
        }));

      } catch (err) {
        console.warn('Error fetching plan limits (using fallback defaults):', err);
      } finally {
        setLoadingDb(false);
      }
    };

    loadPlanAndUsage();
  }, [user]);

  const handleRegisterBiometrics = async () => {
    try {
      await registerPasskey();
      toast('Dispositivo biométrico registrado con éxito.', { type: 'success' });
    } catch (err) {
      toast(err.message, { type: 'error' });
    }
  };

  const handleUpgradePlan = async (planName) => {
    setProcessingUpgrade(true);
    // Simular retraso de pasarela de pago (Stripe / Mercado Pago checkout)
    setTimeout(async () => {
      try {
        // Insertar suscripción simulada
        const { data: planes } = await supabase
          .from('planes')
          .select('id')
          .eq('nombre', planName)
          .single();

        if (planes) {
          // Desactivar anteriores suscripciones
          await supabase
            .from('suscripciones')
            .update({ estado: 'cancelada' })
            .eq('usuario_id', user.id);

          // Crear nueva
          const { error } = await supabase
            .from('suscripciones')
            .insert({
              usuario_id: user.id,
              plan_id: planes.id,
              estado: 'activa',
              metodo_pago: 'Mercado Pago (Simulado)',
              referencia_pago: 'MP-' + Math.random().toString(36).substring(3).toUpperCase()
            });

          if (error) throw error;

          toast(`Suscripción al plan ${planName} activada con éxito.`, { type: 'success' });
          router.refresh();
        }
      } catch (err) {
        toast('Error al actualizar el plan: ' + err.message, { type: 'error' });
      } finally {
        setProcessingUpgrade(false);
        setShowUpgradeModal(false);
      }
    }, 1500);
  };

  if (!user) {
    return <div className={styles.loadingContainer}>Cargando perfil de usuario...</div>;
  }

  const primaryRole = roles[0]?.nombre || 'visor';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.welcome}>
          <span className={styles.badge}>Mi Panel</span>
          <h1 className={styles.title}>Hola, {profile?.nombre || user.email.split('@')[0]} 👋</h1>
          <p className={styles.subtitle}>{user.email} · Rol: <strong style={{ color: 'var(--gm-gold)' }}>{primaryRole}</strong></p>
        </div>
        <button onClick={() => logout()} className={styles.btnLogout}>Cerrar Sesión</button>
      </div>

      <div className={styles.grid}>
        
        {/* Card 1: Membresía */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>👑</div>
            <div>
              <h2 className={styles.cardTitle}>Plan Actual: {planLimits.nombre}</h2>
              <p className={styles.cardSubtitle}>{planLimits.precio}</p>
            </div>
          </div>
          
          <div className={styles.limits}>
            <div className={styles.limitRow}>
              <div className={styles.limitInfo}>
                <span>Personas en el Árbol</span>
                <span>{currentUsage.personas} / {planLimits.limite_personas === 0 ? 'Sin límite' : planLimits.limite_personas}</span>
              </div>
              <div className={styles.progressContainer}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${Math.min(100, planLimits.limite_personas === 0 ? 0 : (currentUsage.personas / planLimits.limite_personas) * 100)}%` }}
                />
              </div>
            </div>

            <div className={styles.limitRow}>
              <div className={styles.limitInfo}>
                <span>Archivos & Fotografías</span>
                <span>{currentUsage.fotos} / {planLimits.limite_fotos === 0 ? 'Sin límite' : planLimits.limite_fotos}</span>
              </div>
              <div className={styles.progressContainer}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${Math.min(100, planLimits.limite_fotos === 0 ? 0 : (currentUsage.fotos / planLimits.limite_fotos) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <button onClick={() => setShowUpgradeModal(true)} className={styles.btnAction}>
            ⚡ Mejorar Membresía
          </button>
        </div>

        {/* Card 2: Seguridad & Biométricos */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>🔒</div>
            <div>
              <h2 className={styles.cardTitle}>Seguridad Biométrica</h2>
              <p className={styles.cardSubtitle}>Accede sin contraseña usando FaceID o Huella</p>
            </div>
          </div>

          <p className={styles.cardText}>
            Registra tu dispositivo actual (computadora o celular) para iniciar sesión instantáneamente 
            utilizando el lector de huellas dactilares o el reconocimiento facial nativo.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
            <button onClick={handleRegisterBiometrics} className={styles.btnActionSecondary}>
              🔑 Configurar Passkey (FaceID / Huella)
            </button>
            {user.user_metadata?.has_passkey && (
              <span className={styles.statusSuccess}>
                ✓ Dispositivo registrado el {new Date(user.user_metadata.passkey_registered_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* MODAL DE UPGRADE SIMULADO */}
      {showUpgradeModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button onClick={() => setShowUpgradeModal(false)} className={styles.closeBtn}>×</button>
            <h2 className={styles.modalTitle}>Elige tu nueva Membresía</h2>
            <p className={styles.modalSubtitle}>Suscripción simulada interactiva con Mercado Pago</p>
            
            <div className={styles.plansContainer}>
              <div className={styles.planCard}>
                <h3>Asociado (Premium)</h3>
                <p className={styles.planPrice}>$4.500 ARS / mes</p>
                <ul>
                  <li>✓ Árboles familiares sin límites</li>
                  <li>✓ Importación/Exportación GEDCOM</li>
                  <li>✓ 200 fotos y audio histórico</li>
                </ul>
                <button 
                  onClick={() => handleUpgradePlan('Asociado')} 
                  disabled={processingUpgrade}
                  className={styles.btnAction}
                >
                  {processingUpgrade ? 'Procesando...' : 'Adquirir con Mercado Pago'}
                </button>
              </div>

              <div className={styles.planCard} style={{ borderColor: 'var(--gm-gold)' }}>
                <h3>Asociación (Institucional)</h3>
                <p className={styles.planPrice}>$12.000 ARS / mes</p>
                <ul>
                  <li>✓ Micrositio propio para Centro Gallego</li>
                  <li>✓ Gestión de junta directiva pública</li>
                  <li>✓ Agenda ilimitada y noticias</li>
                </ul>
                <button 
                  onClick={() => handleUpgradePlan('Asociación')} 
                  disabled={processingUpgrade}
                  className={styles.btnAction}
                  style={{ background: 'var(--gm-gold)', color: 'var(--gm-navy)' }}
                >
                  {processingUpgrade ? 'Procesando...' : 'Adquirir con Mercado Pago'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
