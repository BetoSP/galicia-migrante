'use client';

import Link from 'next/link';
import styles from './Footer.module.css';
import { useTranslation } from '@/components/LanguageContext';

const ARBOL_URL = 'https://galicia-migrante.vercel.app';

export default function Footer() {
  const { t } = useTranslation();
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
            {t('footer.tagline')}
          </p>
        </div>

        {/* Links */}
        <nav className={styles.linksGrid} aria-label="Links del footer">
          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>{t('footer.seccion_portal')}</h3>
            <ul>
              <li><Link href="/">{t('nav.inicio')}</Link></li>
              <li><Link href="/quienes-somos">{t('nav.quienes_somos')}</Link></li>
              <li><Link href="/asociaciones">{t('nav.asociaciones')}</Link></li>
              <li><Link href="/agenda">{t('nav.agenda')}</Link></li>
              <li><Link href="/xunta">{t('nav.xunta')}</Link></li>
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>{t('footer.seccion_modulos')}</h3>
            <ul>
              <li><a href={ARBOL_URL}>{t('nav.arbol')}</a></li>
              <li><Link href="/blog">{t('nav.blog')}</Link></li>
              <li><span className={styles.disabledLink}>{t('nav.lugar')} <span className="badge-soon">{t('nav.pronto')}</span></span></li>
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>{t('footer.seccion_institucional')}</h3>
            <ul>
              <li><Link href="/xunta">{t('footer.xunta_galicia')}</Link></li>
              <li><Link href="/xunta">{t('footer.gobierno_espana')}</Link></li>
            </ul>
          </div>
        </nav>

      </div>

      <div className={styles.bottom}>
        <span>© {year} Galicia Migrante. {t('footer.derechos')}</span>
        <span className={styles.madeWith}>
          {t('footer.hecho_con')}
        </span>
      </div>
    </footer>
  );
}
