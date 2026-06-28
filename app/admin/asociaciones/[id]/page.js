import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import AssocCMS from './components/AssocCMS';
import styles from '@/app/admin/components/admin.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `CMS Asociación — Admin` };
}

export default async function AssocPage({ params }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: isAdmin } = await supabase.rpc('es_admin_general');

  const { data: assoc } = await supabase
    .from('asociaciones')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!assoc) notFound();
  if (!isAdmin && assoc.admin_id !== user.id) redirect('/dashboard');

  const [directivosRes, noticiasRes] = await Promise.all([
    supabase.from('asociaciones_directivos').select('*').eq('asociacion_id', id).order('orden'),
    supabase.from('asociaciones_noticias').select('*').eq('asociacion_id', id).order('created_at', { ascending: false }),
  ]);

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/asociaciones" className={styles.backLink}>← Volver a Asociaciones</Link>
        <h1 className={styles.pageTitle}>{assoc.nombre}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          CMS del micrositio — todos los cambios son en tiempo real.
        </p>
      </div>

      <AssocCMS
        assoc={assoc}
        initialDirectivos={directivosRes.data || []}
        initialNoticias={noticiasRes.data || []}
      />
    </>
  );
}
