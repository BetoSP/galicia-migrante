import React from 'react';
import styles from './admin.module.css';

export const metadata = {
  title: 'Panel de Administración',
  description: 'Consola de gestión administrativa del Portal Galicia Migrante',
};

export default function AdminLayout({ children }) {
  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>🛡️ Consola Admin</div>
        </div>
        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>MENÚ PRINCIPAL</div>
          <div className={styles.sidebarNavItemActive}>📊 Dashboard General</div>
          <a href="/dashboard" className={styles.sidebarNavItem}>👤 Volver a Mi Perfil</a>
          <a href="/" className={styles.sidebarNavItem}>🏠 Volver al Inicio</a>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
