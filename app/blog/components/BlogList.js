'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './blog.module.css';
import { BLOG_CATEGORIES } from '@/lib/blog/categories';

export default function BlogList({ posts }) {
  const [selectedCat, setSelectedCat] = useState('todos');

  const activeCategory =
    BLOG_CATEGORIES.find((c) => c.id === selectedCat) || BLOG_CATEGORIES[0];

  const filteredPosts =
    selectedCat === 'todos'
      ? posts
      : posts.filter((p) => p.category.toLowerCase() === selectedCat);

  return (
    <div className={styles.main}>
      <nav className={styles.tabsContainer} aria-label="Categorías del blog">
        <ul className={styles.tabs}>
          {BLOG_CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <button
                className={`${styles.tabBtn} ${selectedCat === cat.id ? styles.tabBtnActive : ''}`}
                onClick={() => setSelectedCat(cat.id)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.categoryInfo}>
        <p className={styles.categoryDesc}>{activeCategory.description}</p>
      </div>

      {filteredPosts.length === 0 ? (
        <p className={styles.empty}>No hay publicaciones en esta categoría todavía.</p>
      ) : (
        <ul className={styles.postList}>
          {filteredPosts.map((post) => (
            <li key={post.slug} className={styles.postCard}>
              <Link href={`/blog/${post.slug}`} className={styles.postLink}>
                <article>
                  <div className={styles.postMeta}>
                    <time className={styles.date}>{formatDate(post.date)}</time>
                    {post.status === 'provisorio' && (
                      <span className={styles.provisionalBadge}>Provisorio</span>
                    )}
                    <span className={styles.categoryBadge}>{post.category}</span>
                  </div>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.excerpt}>{post.excerpt}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.readMore}>Leer más →</span>
                    {post.tags.length > 0 && (
                      <div className={styles.tags}>
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
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
