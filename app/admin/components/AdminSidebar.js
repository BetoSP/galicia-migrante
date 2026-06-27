'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './admin.module.css';

const NAV = [
  {
    label: 'General',
    items: [
      { href: '/admin', icon: '📊', label: 'Panel principal' },
    ],
  },
  {
    label: 'Contenido',
    items: [
      { href: '/admin/blog', icon: '✍️', label: 'Blog' },
    ],
  },
  {
    label: 'Comunidad',
    items: [
      { href: '/admin/usuarios', icon: '👥', label: 'Usuarios', disabled: true },
      { href: '/admin/asociaciones', icon: '🏛️', label: 'Asociaciones', disabled: true },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <div className={styles.sidebarTitle}>Panel Admin</div>
        <div className={styles.sidebarSubtitle}>Galicia Migrante</div>
      </div>

      {NAV.map((section) => (
        <div key={section.label} className={styles.navSection}>
          <div className={styles.navLabel}>{section.label}</div>
          {section.items.map((item) =>
            item.disabled ? (
              <span
                key={item.href}
                className={styles.navLink}
                style={{ opacity: 0.4, cursor: 'default' }}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </Link>
            )
          )}
        </div>
      ))}
    </aside>
  );
}
