import styles from './page.module.css';

export const metadata = {
  title: 'Asociaciones gallegas',
  description: 'Directorio de centros gallegos en Argentina y el mundo. Encontrá tu asociación y registrá la tuya.',
};

const ASOCIACIONES = [
  { id: 1, nombre: 'Centro Gallego de Buenos Aires', ciudad: 'Buenos Aires', pais: 'Argentina', fundacion: 1907, web: '#' },
  { id: 2, nombre: 'Sociedad Gallega de Socorros Mutuos', ciudad: 'Rosario', pais: 'Argentina', fundacion: 1892, web: '#' },
  { id: 3, nombre: 'Casa de Galicia', ciudad: 'Montevideo', pais: 'Uruguay', fundacion: 1921, web: '#' },
  { id: 4, nombre: 'Irmandade Galega', ciudad: 'Córdoba', pais: 'Argentina', fundacion: 1934, web: '#' },
  { id: 5, nombre: 'Centro Galego de São Paulo', ciudad: 'São Paulo', pais: 'Brasil', fundacion: 1903, web: '#' },
  { id: 6, nombre: 'Asociación Galicia', ciudad: 'Mendoza', pais: 'Argentina', fundacion: 1945, web: '#' },
];

export default function AsociacionesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Comunidad</p>
          <h1 className={styles.title}>Asociaciones gallegas</h1>
          <p className={styles.subtitle}>
            Los centros gallegos son el corazón de nuestra comunidad. Encontrá tu asociación y conectá con tu colectividad.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.topBar}>
            <p className={styles.count}>{ASOCIACIONES.length} asociaciones registradas</p>
            <a href="mailto:hola@galiciamigrante.com" className={styles.btnRegister}>
              + Registrar mi asociación
            </a>
          </div>
          <div className={styles.grid}>
            {ASOCIACIONES.map(a => (
              <div key={a.id} className={styles.card}>
                <div className={styles.cardAvatar}>
                  {a.nombre.charAt(0)}
                </div>
                <div className={styles.cardInfo}>
                  <h2 className={styles.cardTitle}>{a.nombre}</h2>
                  <p className={styles.cardMeta}>📍 {a.ciudad}, {a.pais}</p>
                  <p className={styles.cardMeta}>📅 Fundada en {a.fundacion}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.notice}>
            <p>¿Tu asociación no aparece? <a href="mailto:hola@galiciamigrante.com">Contactanos para registrarla gratuitamente →</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
