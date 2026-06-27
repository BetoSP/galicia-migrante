import { createSupabaseServerClient } from '@/lib/supabase-server';
import ModerationQueue from './components/ModerationQueue';
import styles from '@/app/admin/components/admin.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Moderación de Blog — Admin',
};

export default async function AdminBlogPage() {
  const supabase = await createSupabaseServerClient();

  const { data: pending } = await supabase
    .from('blog_posts')
    .select('id, slug, autor_id, autor_nombre, titulo, extracto, categoria, estado, created_at')
    .eq('estado', 'en_revision')
    .order('created_at', { ascending: true });

  const { data: all, count } = await supabase
    .from('blog_posts')
    .select('estado', { count: 'exact', head: false });

  const stats = (all || []).reduce((acc, p) => {
    acc[p.estado] = (acc[p.estado] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <h1 className={styles.pageTitle}>Blog — Moderación</h1>

      <div className={styles.statsGrid}>
        {[
          { label: 'En revisión', key: 'en_revision', color: '#d69e2e' },
          { label: 'Publicados',  key: 'publicado',   color: '#00875a' },
          { label: 'Borradores',  key: 'borrador',    color: '#718096' },
          { label: 'Rechazados',  key: 'rechazado',   color: '#e53e3e' },
        ].map(({ label, key, color }) => (
          <div key={key} className={styles.statCard}>
            <div className={styles.statLabel}>{label}</div>
            <div className={styles.statValue} style={{ color }}>{stats[key] || 0}</div>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Pendientes de aprobación</h2>
      <ModerationQueue initialPosts={pending || []} />
    </>
  );
}
