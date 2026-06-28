import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import styles from '@/app/admin/components/admin.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Asociaciones — Admin' };

export default async function AsociacionesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: isAdmin } = await supabase.rpc('es_admin_general');

  // admin_general ve todas; otros solo ven las que administran
  let query = supabase.from('asociaciones').select('id, nombre, pais, ciudad, logo_url, admin_id').order('nombre');
  if (!isAdmin) query = query.eq('admin_id', user.id);

  const { data: asociaciones } = await query;

  if (!isAdmin && (!asociaciones || asociaciones.length === 0)) redirect('/dashboard');

  // Redirigir si solo tiene una asociación (sin necesidad de lista)
  if (!isAdmin && asociaciones?.length === 1) {
    redirect(`/admin/asociaciones/${asociaciones[0].id}`);
  }

  return (
    <>
      <h1 className={styles.pageTitle}>Asociaciones</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>
        {isAdmin
          ? 'Gestiona los micrositios de todas las asociaciones del portal.'
          : 'Gestiona el micrositio de tu asociación.'}
      </p>

      <div className={styles.sectionCard} style={{ padding: 0, overflow: 'hidden' }}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Asociación</th>
              <th>Ciudad</th>
              <th>País</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {(asociaciones || []).length === 0 && (
              <tr><td colSpan={4} className={styles.emptyState}>Sin asociaciones.</td></tr>
            )}
            {(asociaciones || []).map((a) => (
              <tr key={a.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {a.logo_url && (
                      <img src={a.logo_url} alt="" style={{ width: 28, height: 28, borderRadius: '4px', objectFit: 'cover' }} />
                    )}
                    <strong>{a.nombre}</strong>
                  </div>
                </td>
                <td>{a.ciudad || '—'}</td>
                <td>{a.pais || '—'}</td>
                <td>
                  <Link href={`/admin/asociaciones/${a.id}`} className={styles.btnRow}>
                    Gestionar →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
