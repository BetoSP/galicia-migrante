import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getPostTranslationsAdmin } from '@/lib/blog/posts';
import TranslationEditor from './components/TranslationEditor';
import styles from '@/app/admin/components/admin.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `Traducciones: ${slug} — Admin` };
}

export default async function TranslationsPage({ params }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('id, titulo, extracto, contenido, slug, estado')
    .eq('slug', slug)
    .maybeSingle();

  if (!post || post.estado !== 'publicado') notFound();

  const translations = await getPostTranslationsAdmin(post.id);

  return (
    <>
      <div className={styles.translationsHeader}>
        <Link href="/admin/blog" className={styles.backLink}>← Volver al panel</Link>
        <h1 className={styles.pageTitle}>Traducciones</h1>
        <p className={styles.translationsSubtitle}>{post.titulo}</p>
      </div>

      <TranslationEditor
        postId={post.id}
        original={{ titulo: post.titulo, extracto: post.extracto, contenido: post.contenido }}
        initialTranslations={translations}
      />
    </>
  );
}
