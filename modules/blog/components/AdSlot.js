'use client';

import { useState, useEffect } from 'react';
import styles from './AdSlot.module.css';

export default function AdSlot({ id, active = false, fallbackText = 'Publicidad' }) {
  const [hasAd, setHasAd] = useState(active);

  // In the future, this can fetch from Supabase based on the slot 'id'
  useEffect(() => {
    setHasAd(active);
  }, [active]);

  if (!hasAd) {
    // Collapses completely with display none and zero dimensions
    return <div className={styles.collapsed} aria-hidden="true" />;
  }

  return (
    <div className={styles.adContainer} data-slot-id={id}>
      <span className={styles.adLabel}>{fallbackText}</span>
      <div className={styles.adContent}>
        {/* Placeholder banner mockup following Galicia Migrante aesthetics */}
        <div className={styles.adBannerMockup}>
          <div className={styles.adLogo}>GM</div>
          <div className={styles.adText}>
            <h4>Espacio Publicitario Disponible</h4>
            <p>Conecta con la mayor comunidad de la diáspora gallega.</p>
          </div>
          <button className={styles.adBtn}>Saber más</button>
        </div>
      </div>
    </div>
  );
}
