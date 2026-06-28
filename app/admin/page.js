import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import styles from './components/admin.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Panel de Administración — Galicia Migrante',
};

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: isAdmin } = await supabase.rpc('es_admin_general');
  if (!isAdmin) redirect('/dashboard');

  // Stats paralelas
  const [postsRes, usuariosRes, asociacionesRes] = await Promise.all([
    supabase.from('blog_posts').select('estado'),
    supabase.from('usuarios').select('id', { count: 'exact', head: true }),
    supabase.from('asociaciones').select('id', { count: 'exact', head: true }),
  ]);

  const posts = postsRes.data || [];
  const stats = posts.reduce((acc, p) => { acc[p.estado] = (acc[p.estado] || 0) + 1; return acc; }, {});

  const MODULES = [
    {
      href: '/admin/blog',
      icon: '✍️',
      title: 'Blog',
      desc: 'Moderar artículos, aprobar o rechazar envíos, gestionar traducciones.',
      badge: stats.en_revision || 0,
      badgeLabel: 'pendientes',
    },
    {
      href: '/admin/i18n',
      icon: '🌐',
      title: 'Interfaz i18n',
      desc: 'Editar textos de la interfaz en Español, Galego e Inglés.',
    },
    {
      href: '/admin/delegacion',
      icon: '🔑',
      title: 'Delegación',
      desc: 'Asignar el rol de Traductor Delegado a colaboradores externos.',
    },
    {
      href: '/admin/planes',
      icon: '👑',
      title: 'Planes y Límites',
      desc: 'Ver planes disponibles y aplicar excepciones por usuario.',
    },
    {
      href: '/admin/asociaciones',
      icon: '🏛️',
      title: 'Asociaciones',
      desc: 'Gestionar los micrositios (CMS) de las asociaciones.',
    },
  ];

  return (
    <>
      <h1 className={styles.pageTitle}>Panel de Administración</h1>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {[
          { label: 'En revisión',  value: stats.en_revision || 0, color: '#d69e2e' },
          { label: 'Publicados',   value: stats.publicado   || 0, color: '#00875a' },
          { label: 'Usuarios',     value: usuariosRes.count  || 0, color: 'var(--gm-blue)' },
          { label: 'Asociaciones', value: asociacionesRes.count || 0, color: 'var(--gm-gold)' },
        ].map(({ label, value, color }) => (
          <div key={label} className={styles.statCard}>
            <div className={styles.statLabel}>{label}</div>
            <div className={styles.statValue} style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Módulos de administración</h2>
      <div className={styles.moduleGrid}>
        {MODULES.map(({ href, icon, title, desc, badge, badgeLabel }) => (
          <Link key={href} href={href} className={styles.moduleCard}>
            <span className={styles.moduleIcon}>{icon}</span>
            <span className={styles.moduleCardTitle}>
              {title}
              {badge > 0 && (
                <span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 700, color: '#d69e2e' }}>
                  {badge} {badgeLabel}
                </span>
              )}
            </span>
            <span className={styles.moduleCardDesc}>{desc}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
