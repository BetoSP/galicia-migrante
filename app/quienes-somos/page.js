'use client';

import styles from './page.module.css';
import { useTranslation } from '@/components/LanguageContext';

export default function QuienesSomosPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>

      {/* Hero interno */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{t('about.eyebrow') || 'El proyecto'}</p>
          <h1 className={styles.title}>{t('about.title') || 'Quiénes somos'}</h1>
          <p className={styles.subtitle}>
            {t('about.subtitle') || 'Galicia Migrante nació para darle a la diáspora gallega una infraestructura digital a la altura de su historia.'}
          </p>
        </div>
      </section>

      {/* Misión */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.twoCol}>
            <div>
              <h2 className={styles.h2}>{t('about.mission_title') || 'Nuestra misión'}</h2>
              <p className={styles.body}>
                {t('about.mission_desc1') || 'Crear un ecosistema digital moderno que permita a descendientes gallegos de todo el mundo reconectarse con sus raíces, su territorio, su historia, su comunidad, su cultura y su identidad.'}
              </p>
              <p className={styles.body}>
                {t('about.mission_desc2') || 'Galicia Migrante complementa —sin reemplazar— a los centros gallegos tradicionales presentes en Argentina y el mundo.'}
              </p>
            </div>
            <div>
              <h2 className={styles.h2}>{t('about.vision_title') || 'Nuestra visión'}</h2>
              <p className={styles.body}>
                {t('about.vision_desc') || 'Convertirnos en la principal infraestructura digital de referencia para la preservación y reconstrucción de la memoria histórica, cultural y genealógica de la diáspora gallega.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <h2 className={styles.h2Light}>{t('about.principles_title') || 'Nuestros principios'}</h2>
          <div className={styles.valuesGrid}>
            {[
              { icon: '🧩', t: t('about.principle1_title') || 'Modularidad', d: t('about.principle1_desc') || 'Cada sección es independiente — se puede agregar, modificar o desactivar sin afectar el resto.' },
              { icon: '📱', t: t('about.principle2_title') || 'Mobile-first', d: t('about.principle2_desc') || 'La tercera y cuarta generación viven en el móvil. La experiencia prioriza dispositivos móviles.' },
              { icon: '🌐', t: t('about.principle3_title') || 'Multiidioma', d: t('about.principle3_desc') || 'Español argentino, gallego e inglés desde el inicio. Agregar un idioma no requiere tocar código.' },
              { icon: '🗺️', t: t('about.principle4_title') || 'Galicia como eje', d: t('about.principle4_desc') || 'La territorialidad gallega — parroquia, aldea, concello — es esencial para entender la genealogía y la migración.' },
              { icon: '🤝', t: t('about.principle5_title') || 'Complementar', d: t('about.principle5_desc') || 'El portal existe para potenciar los centros gallegos tradicionales, no para competir con ellos.' },
              { icon: '🔒', t: t('about.principle6_title') || 'Respeto histórico', d: t('about.principle6_desc') || 'La genealogía exige evidencia verificable, fuentes trazables e historial de cambios.' },
            ].map((v, i) => (
              <div key={i} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3 className={styles.valueTitle}>{v.t}</h3>
                <p className={styles.valueDesc}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué es y qué no es */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.twoCol}>
            <div className={styles.isCard}>
              <h2 className={styles.h2}>{t('about.is_title') || '✅ Qué es'}</h2>
              <ul className={styles.list}>
                {[(t('about.is_item1') || 'Plataforma cultural'), (t('about.is_item2') || 'Infraestructura patrimonial'), (t('about.is_item3') || 'Sistema genealógico'), (t('about.is_item4') || 'Red de memoria migratoria'), (t('about.is_item5') || 'Ecosistema digital gallego'), (t('about.is_item6') || 'Archivo vivo de la diáspora')].map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className={styles.isNotCard}>
              <h2 className={styles.h2}>{t('about.isnot_title') || '❌ Qué NO es'}</h2>
              <ul className={styles.list}>
                {[(t('about.isnot_item1') || 'Una red social genérica'), (t('about.isnot_item2') || 'Una copia de Ancestry'), (t('about.isnot_item3') || 'Un clon de MyHeritage'), (t('about.isnot_item4') || 'Un reemplazo de FamilySearch')].map(i => <li key={i}>{i}</li>)}
              </ul>
              <p className={styles.differentialNote}>
                <strong>{t('about.differential_label') || 'Diferencial principal:'}</strong> {t('about.differential_desc') || 'la reconstrucción contextual de la experiencia migratoria gallega, con el nivel de detalle territorial (parroquia, aldea) que ninguna otra plataforma ofrece.'}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

