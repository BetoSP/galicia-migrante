'use client';

import styles from './page.module.css';
import { useTranslation } from '@/components/LanguageContext';

export default function XuntaPage() {
  const { t } = useTranslation();

  const XUNTA_ITEMS = [
    { icon: '🏛️', title: t('xunta.item1_title') || 'Galicia Aberta', desc: t('xunta.item1_desc') || 'Red oficial de centros gallegos en el mundo. Programas de apoyo institucional y financiamiento.', link: 'https://www.xunta.gal' },
    { icon: '✈️', title: t('xunta.item2_title') || 'Retorno a Galicia', desc: t('xunta.item2_desc') || 'Programas para emigrantes que desean regresar. Ayudas económicas y asesoramiento integral.', link: 'https://www.xunta.gal' },
    { icon: '💶', title: t('xunta.item3_title') || 'Programas y ayudas', desc: t('xunta.item3_desc') || 'Becas, subvenciones y programas educativos para descendientes gallegos en el exterior.', link: 'https://www.xunta.gal' },
    { icon: '🤝', title: t('xunta.item4_title') || 'Delegaciones', desc: t('xunta.item4_desc') || 'Delegaciones de la Xunta de Galicia en América Latina. Atención presencial y gestiones.', link: 'https://www.xunta.gal' },
  ];

  const ESPAÑA_ITEMS = [
    { icon: '🪪', title: t('xunta.spain1_title') || 'Nacionalidad española', desc: t('xunta.spain1_desc') || 'Proceso para recuperar o adquirir la nacionalidad española por descendencia. Ley de Nietos y Ley de Memoria Democrática.', link: 'https://www.exteriores.gob.es' },
    { icon: '🏦', title: t('xunta.spain2_title') || 'Ayudas y pensiones', desc: t('xunta.spain2_desc') || 'Prestaciones para españoles en el exterior. Pensiones asistenciales y ayudas de emergencia social.', link: 'https://www.exteriores.gob.es' },
    { icon: '📄', title: t('xunta.spain3_title') || 'Trámites consulares', desc: t('xunta.spain3_desc') || 'Pasaporte, DNI, inscripción consular, certificados de vida y otros documentos para españoles en Argentina.', link: 'https://www.exteriores.gob.es' },
    { icon: '📋', title: t('xunta.spain4_title') || 'Servicios en el exterior', desc: t('xunta.spain4_desc') || 'Registro de ciudadanos en el exterior (CERA), derecho al voto, asistencia consular.', link: 'https://www.exteriores.gob.es' },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{t('xunta.eyebrow') || 'Institucional'}</p>
          <h1 className={styles.title}>{t('xunta.title') || 'Xunta de Galicia & Gobierno de España'}</h1>
          <p className={styles.subtitle}>
            {t('xunta.subtitle') || 'Información sobre programas, trámites y servicios para la comunidad gallega en el exterior.'}
          </p>
        </div>
      </section>

      {/* Xunta */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.blockHeader}>
            <div className={styles.blockFlag}>🏴󠁥󠁳󠁧󠁡󠁿</div>
            <div>
              <h2 className={styles.h2}>{t('xunta.section1_title') || 'Xunta de Galicia'}</h2>
              <p className={styles.blockDesc}>{t('xunta.section1_desc') || 'Gobierno autónomo de Galicia. Programas para la diáspora gallega en el mundo.'}</p>
            </div>
          </div>
          <div className={styles.grid}>
            {XUNTA_ITEMS.map((item, i) => (
              <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className={styles.card}>
                <div className={styles.cardIcon}>{item.icon}</div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
                <span className={styles.cardExternal}>{t('xunta.visit_official') || 'Visitar sitio oficial →'}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* España */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.blockHeader}>
            <div className={styles.blockFlag}>🇪🇸</div>
            <div>
              <h2 className={styles.h2}>{t('xunta.section2_title') || 'Gobierno de España'}</h2>
              <p className={styles.blockDesc}>{t('xunta.section2_desc') || 'Servicios consulares y programas para ciudadanos españoles en Argentina.'}</p>
            </div>
          </div>
          <div className={styles.grid}>
            {ESPAÑA_ITEMS.map((item, i) => (
              <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className={styles.card}>
                <div className={styles.cardIcon}>{item.icon}</div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
                <span className={styles.cardExternal}>{t('xunta.visit_official') || 'Visitar sitio oficial →'}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.disclaimer}>
        <div className={styles.container}>
          <p>⚠️ {t('xunta.disclaimer') || 'Esta información es de referencia general. Los programas y requisitos cambian con frecuencia. Consultá siempre las fuentes oficiales antes de iniciar cualquier trámite.'}</p>
        </div>
      </div>
    </div>
  );
}
