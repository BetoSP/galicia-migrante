import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import I18nEditor from './components/I18nEditor';
import styles from '@/app/admin/components/admin.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'i18n Customizer — Admin' };

export default async function I18nPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: isAdmin } = await supabase.rpc('es_admin_general');
  if (!isAdmin) redirect('/dashboard');

  const { data: rows } = await supabase
    .from('traducciones_interfaz')
    .select('id, clave, idioma, texto_por_defecto, texto_custom, es_manual')
    .order('clave', { ascending: true });

  return (
    <>
      <h1 className={styles.pageTitle}>Interfaz i18n</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>
        Personaliza los textos de la interfaz del portal. Los cambios en Galego e Inglés se marcan como manuales y quedan protegidos de la traducción automática.
      </p>
      <I18nEditor initialRows={rows || []} />
    </>
  );
}
