import { getAllPosts } from '@/lib/posts';
import styles from './blog.module.css';
import AdSlot from '@/components/AdSlot';
import BlogList from '@/components/BlogList';

export const metadata = {
  title: 'Blog',
  description: 'Historias, cultura e identidad de la diáspora gallega.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>
          Historias, cultura e identidad de la diáspora gallega en el mundo.
        </p>
      </header>

      <AdSlot id="blog-listing-top" />

      <BlogList posts={posts} />
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
