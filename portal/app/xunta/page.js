import styles from './page.module.css';

export const metadata = {
  title: 'Xunta de Galicia & Gobierno de España',
  description: 'Información sobre programas de la Xunta de Galicia, Galicia Aberta, trámites consulares y ayudas para la diáspora gallega.',
};

const XUNTA_ITEMS = [
  { icon: '🏛️', title: 'Galicia Aberta', desc: 'Red oficial de centros gallegos en el mundo. Programas de apoyo institucional y financiamiento.', link: 'https://www.xunta.gal' },
  { icon: '✈️', title: 'Retorno a Galicia', desc: 'Programas para emigrantes que desean regresar. Ayudas económicas y asesoramiento integral.', link: 'https://www.xunta.gal' },
  { icon: '💶', title: 'Programas y ayudas', desc: 'Becas, subvenciones y programas educativos para descendientes gallegos en el exterior.', link: 'https://www.xunta.gal' },
  { icon: '🤝', title: 'Delegaciones', desc: 'Delegaciones de la Xunta de Galicia en América Latina. Atención presencial y gestiones.', link: 'https://www.xunta.gal' },
];

const ESPAÑA_ITEMS = [
  { icon: '🪪', title: 'Nacionalidad española', desc: 'Proceso para recuperar o adquirir la nacionalidad española por descendencia. Ley de Nietos y Ley de Memoria Democrática.', link: 'https://www.exteriores.gob.es' },
  { icon: '🏦', title: 'Ayudas y pensiones', desc: 'Prestaciones para españoles en el exterior. Pensiones asistenciales y ayudas de emergencia social.', link: 'https://www.exteriores.gob.es' },
  { icon: '📄', title: 'Trámites consulares', desc: 'Pasaporte, DNI, inscripción consular, certificados de vida y otros documentos para españoles en Argentina.', link: 'https://www.exteriores.gob.es' },
  { icon: '📋', title: 'Servicios en el exterior', desc: 'Registro de ciudadanos en el exterior (CERA), derecho al voto, asistencia consular.', link: 'https://www.exteriores.gob.es' },
];

export default function XuntaPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Institucional</p>
          <h1 className={styles.title}>Xunta de Galicia<br />& Gobierno de España</h1>
          <p className={styles.subtitle}>
            Información sobre programas, trámites y servicios para la comunidad gallega en el exterior.
          </p>
        </div>
      </section>

      {/* Xunta */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.blockHeader}>
            <div className={styles.blockFlag}>🏴󠁥󠁳󠁧󠁡󠁿</div>
            <div>
              <h2 className={styles.h2}>Xunta de Galicia</h2>
              <p className={styles.blockDesc}>Gobierno autónomo de Galicia. Programas para la diáspora gallega en el mundo.</p>
            </div>
          </div>
          <div className={styles.grid}>
            {XUNTA_ITEMS.map((item, i) => (
              <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className={styles.card}>
                <div className={styles.cardIcon}>{item.icon}</div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
                <span className={styles.cardExternal}>Visitar sitio oficial →</span>
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
              <h2 className={styles.h2}>Gobierno de España</h2>
              <p className={styles.blockDesc}>Servicios consulares y programas para ciudadanos españoles en Argentina.</p>
            </div>
          </div>
          <div className={styles.grid}>
            {ESPAÑA_ITEMS.map((item, i) => (
              <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className={styles.card}>
                <div className={styles.cardIcon}>{item.icon}</div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
                <span className={styles.cardExternal}>Visitar sitio oficial →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.disclaimer}>
        <div className={styles.container}>
          <p>⚠️ Esta información es de referencia general. Los programas y requisitos cambian con frecuencia. Consultá siempre las fuentes oficiales antes de iniciar cualquier trámite.</p>
        </div>
      </div>
    </div>
  );
}
