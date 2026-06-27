export const dynamic = 'force-dynamic';

import { getAllPosts } from '@/lib/blog/posts';
import BlogList from './components/BlogList';
import AdSlot from './components/AdSlot';
import styles from './components/blog.module.css';

export const metadata = {
  title: 'Blog — Galicia Migrante',
  description:
    'Historias, crónicas, literatura y guías de trámites para la diáspora gallega en el mundo.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Blog de la Diáspora</h1>
        <p className={styles.pageSubtitle}>
          Historias, memoria, literatura y orientación práctica para la comunidad gallega en el mundo.
        </p>
      </header>

      <BlogList posts={posts} />

      <AdSlot id="blog-list-bottom" />
    </div>
  );
}
