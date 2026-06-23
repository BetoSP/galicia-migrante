import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>

        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo} aria-label="Galicia Migrante">
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <rect width="36" height="36" rx="8" fill="#4A90B8"/>
              <path d="M4 22 Q9 18 14 22 Q19 26 24 22 Q29 18 32 22" stroke="#C8A96E" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M4 26 Q9 22 14 26 Q19 30 24 26 Q29 22 32 26" stroke="#ffffff60" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M18 8 V16 M14 12 H22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span>Galicia Migrante</span>
          </Link>
          <p className={styles.tagline}>
            Preservar, reconstruir y transmitir<br />
            la memoria de la diáspora gallega.
          </p>
        </div>

        {/* Links */}
        <nav className={styles.linksGrid} aria-label="Links del footer">
          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Portal</h3>
            <ul>
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/quienes-somos">Quiénes somos</Link></li>
              <li><Link href="/asociaciones">Asociaciones</Link></li>
              <li><Link href="/agenda">Agenda</Link></li>
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Módulos</h3>
            <ul>
              <li><a href="https://galicia-migrante.vercel.app">Árbol genealógico</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><span className={styles.disabledLink}>Tu lugar en Galicia <span className="badge-soon">Pronto</span></span></li>
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Institucional</h3>
            <ul>
              <li><Link href="/xunta">Xunta de Galicia</Link></li>
              <li><Link href="/gobierno-espana">Gobierno de España</Link></li>
            </ul>
          </div>
        </nav>

      </div>

      <div className={styles.bottom}>
        <span>© {year} Galicia Migrante. Todos los derechos reservados.</span>
        <span className={styles.madeWith}>
          Hecho con ❤️ para la diáspora gallega
        </span>
      </div>
    </footer>
  );
}
