'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './admin.module.css';

const NAV = [
  {
    label: 'General',
    items: [
      { href: '/admin', icon: '📊', label: 'Dashboard', exact: true },
    ],
  },
  {
    label: 'Contenido',
    items: [
      { href: '/admin/blog',        icon: '✍️', label: 'Blog' },
      { href: '/admin/i18n',        icon: '🌐', label: 'Interfaz i18n' },
      { href: '/admin/delegacion',  icon: '🔑', label: 'Delegación' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/admin/planes',       icon: '👑', label: 'Planes y límites' },
      { href: '/admin/asociaciones', icon: '🏛️', label: 'Asociaciones' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href, exact) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <div className={styles.sidebarTitle}>Panel Admin</div>
        <div className={styles.sidebarSubtitle}>Galicia Migrante</div>
      </div>

      {NAV.map((section) => (
        <div key={section.label} className={styles.navSection}>
          <div className={styles.navLabel}>{section.label}</div>
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive(item.href, item.exact) ? styles.navLinkActive : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </aside>
  );
}
