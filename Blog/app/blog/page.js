import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import styles from './blog.module.css';

export const metadata = {
  title: 'Blog',
  description: 'Historias, cultura e identidad de la diáspora gallega.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>
          Historias, cultura e identidad de la diáspora gallega en el mundo.
        </p>
      </header>

      <main className={styles.main}>
        {posts.length === 0 ? (
          <p className={styles.empty}>No hay publicaciones todavía.</p>
        ) : (
          <ul className={styles.postList}>
            {posts.map((post) => (
              <li key={post.slug} className={styles.postCard}>
                <Link href={`/blog/${post.slug}`} className={styles.postLink}>
                  <article>
                    <div className={styles.postMeta}>
                      <time className={styles.date}>{formatDate(post.date)}</time>
                      {post.tags.length > 0 && (
                        <div className={styles.tags}>
                          {post.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.excerpt}>{post.excerpt}</p>
                    <span className={styles.readMore}>Leer más →</span>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
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
