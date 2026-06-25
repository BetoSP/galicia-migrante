import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getAllPostSlugs } from '../lib/posts';
import styles from './post.module.css';
import AdSlot from '../components/AdSlot';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        {post.status === 'provisorio' && (
          <div className={styles.provisionalWarning}>
            ⚠️ <strong>Publicación Provisional:</strong> Este artículo ha sido publicado de forma provisoria y se encuentra en revisión de cumplimiento de pautas editoriales y éticas.
          </div>
        )}

        <header className={styles.header}>
          <div className={styles.meta}>
            <time className={styles.date}>{formatDate(post.date)}</time>
            {post.author && (
              <span className={styles.author}>por {post.author}</span>
            )}
          </div>

          <h1 className={styles.title}>{post.title}</h1>

          {post.excerpt && (
            <p className={styles.excerpt}>{post.excerpt}</p>
          )}

          {post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </header>

        <div className={styles.content}>
          <MDXRemote source={post.content} />
        </div>

        <AdSlot id="blog-post-bottom" />
      </article>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
