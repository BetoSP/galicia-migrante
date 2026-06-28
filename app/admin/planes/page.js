import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import PlansManager from './components/PlansManager';
import styles from '@/app/admin/components/admin.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Planes y Límites — Admin' };

export default async function PlanesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: isAdmin } = await supabase.rpc('es_admin_general');
  if (!isAdmin) redirect('/dashboard');

  const { data: planes } = await supabase
    .from('planes')
    .select('*')
    .order('precio_ars', { ascending: true });

  return (
    <>
      <h1 className={styles.pageTitle}>Planes y Límites</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>
        Consulta los planes disponibles y aplica excepciones individuales de límites para usuarios específicos.
      </p>
      <PlansManager planes={planes || []} />
    </>
  );
}
