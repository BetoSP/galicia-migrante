'use client';

import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const ARBOL_URL = 'https://galicia-migrante.vercel.app';
const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || '';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [origenesOpen, setOrigenesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeAll = () => { setMenuOpen(false); setOrigenesOpen(false); };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} role="navigation" aria-label="Navegación principal">
      <div className={styles.inner}>

        {/* Logo */}
        <a href={`${PORTAL_URL}/`} className={styles.logo} onClick={closeAll} aria-label="Galicia Migrante — Inicio">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="#4A90B8"/>
            {/* Olas */}
            <path d="M4 22 Q9 18 14 22 Q19 26 24 22 Q29 18 32 22" stroke="#C8A96E" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M4 26 Q9 22 14 26 Q19 30 24 26 Q29 22 32 26" stroke="#ffffff60" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* Cruz de Santiago */}
            <path d="M18 8 V16 M14 12 H22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className={styles.logoText}>
            <span className={styles.logoMain}>Galicia</span>
            <span className={styles.logoSub}>Migrante</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className={styles.links} role="list">
          <li><a href={`${PORTAL_URL}/`} className={styles.link}>Inicio</a></li>
          <li><a href={`${PORTAL_URL}/quienes-somos`} className={styles.link}>Quiénes somos</a></li>
          <li><a href={`${PORTAL_URL}/asociaciones`} className={styles.link}>Asociaciones</a></li>
          <li><a href={`${PORTAL_URL}/agenda`} className={styles.link}>Agenda</a></li>

          {/* Dropdown Tus orígenes */}
          <li
            className={styles.dropdown}
            onMouseEnter={() => setOrigenesOpen(true)}
            onMouseLeave={() => setOrigenesOpen(false)}
          >
            <button className={`${styles.link} ${styles.dropdownTrigger}`} aria-haspopup="true" aria-expanded={origenesOpen}>
              Tus orígenes
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {origenesOpen && (
              <div className={styles.dropdownMenu} role="menu">
                <a href={ARBOL_URL} className={styles.dropdownItem} role="menuitem">
                  <span className={styles.dropdownIcon}>🌳</span>
                  <div>
                    <div className={styles.dropdownTitle}>Tu árbol genealógico</div>
                    <div className={styles.dropdownDesc}>Construye y explora tu historia familiar</div>
                  </div>
                </a>
                <div className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`} role="menuitem" aria-disabled="true">
                  <span className={styles.dropdownIcon}>📍</span>
                  <div>
                    <div className={styles.dropdownTitle}>Tu lugar en Galicia <span className="badge-soon">Próximamente</span></div>
                    <div className={styles.dropdownDesc}>Parroquias, aldeas y concellos de tus ancestros</div>
                  </div>
                </div>
              </div>
            )}
          </li>

          <li>
            <a href={`${PORTAL_URL}/xunta`} className={styles.link}>
              Xunta & España
            </a>
          </li>
        </ul>

        {/* Auth buttons */}
        <div className={styles.auth}>
          <a href={`${ARBOL_URL}/auth`} className={styles.btnLogin} id="nav-login-btn">Ingresar</a>
          <a href={`${ARBOL_URL}/auth?mode=register`} className={styles.btnRegister} id="nav-register-btn">Registrarse</a>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          id="mobile-menu-toggle"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu} role="dialog" aria-label="Menú de navegación">
          <ul>
            <li><a href={`${PORTAL_URL}/`} onClick={closeAll} className={styles.mobileLink}>Inicio</a></li>
            <li><a href={`${PORTAL_URL}/quienes-somos`} onClick={closeAll} className={styles.mobileLink}>Quiénes somos</a></li>
            <li><a href={`${PORTAL_URL}/asociaciones`} onClick={closeAll} className={styles.mobileLink}>Asociaciones</a></li>
            <li><a href={`${PORTAL_URL}/agenda`} onClick={closeAll} className={styles.mobileLink}>Agenda</a></li>
            <li>
              <span className={styles.mobileSectionLabel}>Tus orígenes</span>
              <a href={ARBOL_URL} onClick={closeAll} className={`${styles.mobileLink} ${styles.mobileSubLink}`}>🌳 Tu árbol genealógico</a>
              <span className={`${styles.mobileLink} ${styles.mobileSubLink} ${styles.mobileDisabled}`}>📍 Tu lugar en Galicia <span className="badge-soon">Pronto</span></span>
            </li>
            <li><a href={`${PORTAL_URL}/xunta`} onClick={closeAll} className={styles.mobileLink}>Xunta & España</a></li>
          </ul>
          <div className={styles.mobileAuth}>
            <a href={`${ARBOL_URL}/auth`} className={styles.btnLogin} onClick={closeAll} id="mobile-login-btn">Ingresar</a>
            <a href={`${ARBOL_URL}/auth?mode=register`} className={styles.btnRegister} onClick={closeAll} id="mobile-register-btn">Registrarse</a>
          </div>
        </div>
      )}
    </nav>
  );
}
