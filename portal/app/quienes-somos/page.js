import styles from './page.module.css';

export const metadata = {
  title: 'Quiénes somos',
  description: 'Conocé la misión, visión y equipo detrás de Galicia Migrante — el ecosistema digital de la diáspora gallega.',
};

export default function QuienesSomosPage() {
  return (
    <div className={styles.page}>

      {/* Hero interno */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>El proyecto</p>
          <h1 className={styles.title}>Quiénes somos</h1>
          <p className={styles.subtitle}>
            Galicia Migrante nació para darle a la diáspora gallega una infraestructura digital a la altura de su historia.
          </p>
        </div>
      </section>

      {/* Misión */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.twoCol}>
            <div>
              <h2 className={styles.h2}>Nuestra misión</h2>
              <p className={styles.body}>
                Crear un ecosistema digital moderno que permita a descendientes gallegos de todo el mundo
                reconectarse con sus raíces, su territorio, su historia, su comunidad, su cultura y su identidad.
              </p>
              <p className={styles.body}>
                Galicia Migrante complementa —sin reemplazar— a los centros gallegos tradicionales presentes
                en Argentina y el mundo.
              </p>
            </div>
            <div>
              <h2 className={styles.h2}>Nuestra visión</h2>
              <p className={styles.body}>
                Convertirnos en la principal infraestructura digital de referencia para la preservación y
                reconstrucción de la memoria histórica, cultural y genealógica de la diáspora gallega.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <h2 className={styles.h2Light}>Nuestros principios</h2>
          <div className={styles.valuesGrid}>
            {[
              { icon: '🧩', t: 'Modularidad', d: 'Cada sección es independiente — se puede agregar, modificar o desactivar sin afectar el resto.' },
              { icon: '📱', t: 'Mobile-first', d: 'La tercera y cuarta generación viven en el móvil. La experiencia prioriza dispositivos móviles.' },
              { icon: '🌐', t: 'Multiidioma', d: 'Español argentino, gallego e inglés desde el inicio. Agregar un idioma no requiere tocar código.' },
              { icon: '🗺️', t: 'Galicia como eje', d: 'La territorialidad gallega — parroquia, aldea, concello — es esencial para entender la genealogía y la migración.' },
              { icon: '🤝', t: 'Complementar', d: 'El portal existe para potenciar los centros gallegos tradicionales, no para competir con ellos.' },
              { icon: '🔒', t: 'Respeto histórico', d: 'La genealogía exige evidencia verificable, fuentes trazables e historial de cambios.' },
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
              <h2 className={styles.h2}>✅ Qué es</h2>
              <ul className={styles.list}>
                {['Plataforma cultural', 'Infraestructura patrimonial', 'Sistema genealógico', 'Red de memoria migratoria', 'Ecosistema digital gallego', 'Archivo vivo de la diáspora'].map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className={styles.isNotCard}>
              <h2 className={styles.h2}>❌ Qué NO es</h2>
              <ul className={styles.list}>
                {['Una red social genérica', 'Una copia de Ancestry', 'Un clon de MyHeritage', 'Un reemplazo de FamilySearch'].map(i => <li key={i}>{i}</li>)}
              </ul>
              <p className={styles.differentialNote}>
                <strong>Diferencial principal:</strong> la reconstrucción contextual de la experiencia migratoria gallega,
                con el nivel de detalle territorial (parroquia, aldea) que ninguna otra plataforma ofrece.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
