import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import DelegacionForm from './components/DelegacionForm';
import styles from '@/app/admin/components/admin.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Delegación de Roles — Admin' };

export default async function DelegacionPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: isAdmin } = await supabase.rpc('es_admin_general');
  if (!isAdmin) redirect('/dashboard');

  return (
    <>
      <h1 className={styles.pageTitle}>Delegación de Roles</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>
        Asigna el rol <strong>Traductor Delegado</strong> a colaboradores externos para que puedan editar los textos de interfaz (i18n) sin acceso al resto del panel.
      </p>
      <DelegacionForm />
    </>
  );
}
