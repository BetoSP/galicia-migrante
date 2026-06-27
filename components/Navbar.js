'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { useTranslation } from '@/components/LanguageContext';
import { useTheme } from '@/components/ThemeContext';
import { useAuth } from '@/components/AuthProvider';

const ARBOL_URL = '/arbol';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { locale, setLocale, t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user, logout, roles } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [origenesOpen, setOrigenesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setOrigenesOpen(false);
    setLangOpen(false);
    setThemeOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeAll();
  };

  const isAdmin = roles.some(r => r.es_admin || r.nombre === 'admin_general');

  return (
    <nav className={`${styles.nav} ${(scrolled || !isHome) ? styles.scrolled : ''}`} role="navigation" aria-label="Navegación principal">
      <div className={styles.inner}>

        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeAll} aria-label="Galicia Migrante — Inicio">
          <Image
            src="/trisquel.svg"
            alt=""
            aria-hidden="true"
            width={48}
            height={34}
            className={styles.logoImg}
            priority
          />
          <span className={styles.logoText}>
            <span className={styles.logoMain}>GALICIA</span>
            <span className={styles.logoSub}>MIGRANTE</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className={styles.links} role="list">
          <li><Link href="/" className={styles.link} onClick={closeAll}>{t('nav.inicio')}</Link></li>
          <li><Link href="/quienes-somos" className={styles.link} onClick={closeAll}>{t('nav.quienes_somos')}</Link></li>
          <li><Link href="/asociaciones" className={styles.link} onClick={closeAll}>{t('nav.asociaciones')}</Link></li>
          <li><Link href="/agenda" className={styles.link} onClick={closeAll}>{t('nav.agenda')}</Link></li>
          <li><Link href="/blog" className={styles.link} onClick={closeAll}>{t('nav.blog')}</Link></li>

          {/* Dropdown Tus orígenes */}
          <li
            className={styles.dropdown}
            onMouseEnter={() => setOrigenesOpen(true)}
            onMouseLeave={() => setOrigenesOpen(false)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOrigenesOpen(false); }}
            onKeyDown={(e) => { if (e.key === 'Escape') setOrigenesOpen(false); }}
          >
            <button
              className={`${styles.link} ${styles.dropdownTrigger}`}
              aria-haspopup="true"
              aria-expanded={origenesOpen}
              onFocus={() => setOrigenesOpen(true)}
            >
              {t('nav.origenes')}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {origenesOpen && (
              <div className={styles.dropdownMenu} role="menu">
                <Link href={ARBOL_URL} className={styles.dropdownItem} role="menuitem">
                  <span className={styles.dropdownIcon}>🌳</span>
                  <div>
                    <div className={styles.dropdownTitle}>{t('nav.arbol')}</div>
                    <div className={styles.dropdownDesc}>{t('nav.arbol_desc')}</div>
                  </div>
                </Link>
                <Link href="/lugar-galicia" className={styles.dropdownItem} role="menuitem" onClick={closeAll}>
                  <span className={styles.dropdownIcon}>📍</span>
                  <div>
                    <div className={styles.dropdownTitle}>{t('nav.lugar')}</div>
                    <div className={styles.dropdownDesc}>{t('nav.lugar_desc')}</div>
                  </div>
                </Link>
              </div>
            )}
          </li>

          <li>
            <Link href="/xunta" className={styles.link} onClick={closeAll}>
              {t('nav.xunta')}
            </Link>
          </li>
        </ul>

        {/* Language Selector & Auth buttons */}
        <div className={styles.auth}>
          {/* Selector de idiomas para Escritorio */}
          <div
            className={styles.langDropdown}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setLangOpen(false); }}
            onKeyDown={(e) => { if (e.key === 'Escape') setLangOpen(false); }}
          >
            <button className={styles.langBtn} onClick={() => setLangOpen(!langOpen)} onFocus={() => setLangOpen(true)} aria-haspopup="true" aria-expanded={langOpen}>
              🌐 {locale === 'es-AR' ? 'ES' : locale === 'gl' ? 'GL' : 'EN'}
            </button>
            {langOpen && (
              <div className={styles.langMenu} role="menu">
                <button 
                  className={locale === 'es-AR' ? styles.langMenuActive : ''}
                  onClick={() => { setLocale('es-AR'); setLangOpen(false); }}
                >
                  Español (AR)
                </button>
                <button 
                  className={locale === 'gl' ? styles.langMenuActive : ''}
                  onClick={() => { setLocale('gl'); setLangOpen(false); }}
                >
                  Galego
                </button>
                <button 
                  className={locale === 'en' ? styles.langMenuActive : ''}
                  onClick={() => { setLocale('en'); setLangOpen(false); }}
                >
                  English
                </button>
              </div>
            )}
          </div>

          {/* Selector de Tema */}
          <div
            className={styles.themeDropdown}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setThemeOpen(false); }}
            onKeyDown={(e) => { if (e.key === 'Escape') setThemeOpen(false); }}
          >
            <button className={styles.themeBtn} onClick={() => { setThemeOpen(!themeOpen); setLangOpen(false); }} onFocus={() => setThemeOpen(true)} aria-label="Cambiar tema" aria-haspopup="true" aria-expanded={themeOpen}>
              {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '⚙️'}
            </button>
            {themeOpen && (
              <div className={styles.themeMenu} role="menu">
                <button 
                  className={theme === 'light' ? styles.themeMenuActive : ''}
                  onClick={() => { setTheme('light'); setThemeOpen(false); }}
                >
                  ☀️ Claro
                </button>
                <button 
                  className={theme === 'dark' ? styles.themeMenuActive : ''}
                  onClick={() => { setTheme('dark'); setThemeOpen(false); }}
                >
                  🌙 Oscuro
                </button>
                <button 
                  className={theme === 'auto' ? styles.themeMenuActive : ''}
                  onClick={() => { setTheme('auto'); setThemeOpen(false); }}
                >
                  ⚙️ Auto
                </button>
              </div>
            )}
          </div>

          {user ? (
            <div
              className={styles.profileDropdown}
              onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setProfileDropdownOpen(false); }}
              onKeyDown={(e) => { if (e.key === 'Escape') setProfileDropdownOpen(false); }}
            >
              <button
                className={styles.profileBtn}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                onFocus={() => setProfileDropdownOpen(true)}
                aria-haspopup="true"
                aria-expanded={profileDropdownOpen}
              >
                👤 {user.user_metadata?.nombre || user.email.split('@')[0]}
              </button>
              {profileDropdownOpen && (
                <div className={styles.profileMenu} role="menu">
                  <Link href="/dashboard" className={styles.profileMenuItem} onClick={closeAll} role="menuitem">
                    📊 Mi Perfil
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className={styles.profileMenuItem} onClick={closeAll} role="menuitem">
                      🛡️ Panel Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className={styles.profileMenuItem} role="menuitem">
                    🚪 Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth" className={styles.btnLogin} id="nav-login-btn">{t('nav.ingresar')}</Link>
              <Link href="/auth?mode=register" className={styles.btnRegister} id="nav-register-btn">{t('nav.registrarse')}</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? t('nav.cerrar_menu') : t('nav.abrir_menu')}
          aria-expanded={menuOpen}
          id="mobile-menu-toggle"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu} role="dialog" aria-label="Menú de navegación">
          {/* Selector de idioma para móvil */}
          <div className={styles.mobileLang}>
            <button 
              className={`${styles.mobileLangBtn} ${locale === 'es-AR' ? styles.mobileLangBtnActive : ''}`}
              onClick={() => setLocale('es-AR')}
            >
              ES
            </button>
            <button 
              className={`${styles.mobileLangBtn} ${locale === 'gl' ? styles.mobileLangBtnActive : ''}`}
              onClick={() => setLocale('gl')}
            >
              GL
            </button>
            <button 
              className={`${styles.mobileLangBtn} ${locale === 'en' ? styles.mobileLangBtnActive : ''}`}
              onClick={() => setLocale('en')}
            >
              EN
            </button>
          </div>

          {/* Selector de tema para móvil */}
          <div className={styles.mobileTheme}>
            <button 
              className={`${styles.mobileThemeBtn} ${theme === 'light' ? styles.mobileThemeBtnActive : ''}`}
              onClick={() => setTheme('light')}
            >
              ☀️ Claro
            </button>
            <button 
              className={`${styles.mobileThemeBtn} ${theme === 'dark' ? styles.mobileThemeBtnActive : ''}`}
              onClick={() => setTheme('dark')}
            >
              🌙 Oscuro
            </button>
            <button 
              className={`${styles.mobileThemeBtn} ${theme === 'auto' ? styles.mobileThemeBtnActive : ''}`}
              onClick={() => setTheme('auto')}
            >
              ⚙️ Auto
            </button>
          </div>

          <ul>
            <li><Link href="/" onClick={closeAll} className={styles.mobileLink}>{t('nav.inicio')}</Link></li>
            <li><Link href="/quienes-somos" onClick={closeAll} className={styles.mobileLink}>{t('nav.quienes_somos')}</Link></li>
            <li><Link href="/asociaciones" onClick={closeAll} className={styles.mobileLink}>{t('nav.asociaciones')}</Link></li>
            <li><Link href="/agenda" onClick={closeAll} className={styles.mobileLink}>{t('nav.agenda')}</Link></li>
            <li><Link href="/blog" onClick={closeAll} className={styles.mobileLink}>{t('nav.blog')}</Link></li>
            <li>
              <span className={styles.mobileSectionLabel}>{t('nav.origenes')}</span>
              <Link href={ARBOL_URL} onClick={closeAll} className={`${styles.mobileLink} ${styles.mobileSubLink}`}>🌳 {t('nav.arbol')}</Link>
              <Link href="/lugar-galicia" onClick={closeAll} className={`${styles.mobileLink} ${styles.mobileSubLink}`}>📍 {t('nav.lugar')}</Link>
            </li>
            <li><Link href="/xunta" onClick={closeAll} className={styles.mobileLink}>{t('nav.xunta')}</Link></li>
          </ul>
          <div className={styles.mobileAuth}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <Link href="/dashboard" className={styles.mobileLink} onClick={closeAll}>📊 Mi Perfil</Link>
                {isAdmin && <Link href="/admin" className={styles.mobileLink} onClick={closeAll}>🛡️ Panel Admin</Link>}
                <button onClick={handleLogout} className={styles.mobileLink} style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                  🚪 Cerrar Sesión
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth" className={styles.btnLogin} onClick={closeAll} id="mobile-login-btn">{t('nav.ingresar')}</Link>
                <Link href="/auth?mode=register" className={styles.btnRegister} onClick={closeAll} id="mobile-register-btn">{t('nav.registrarse')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
