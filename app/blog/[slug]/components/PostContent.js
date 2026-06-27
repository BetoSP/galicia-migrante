'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import AdSlot from '@/app/blog/components/AdSlot';
import { useTranslation } from '@/components/LanguageContext';
import styles from './post.module.css';

export default function PostContent({ post }) {
  const { locale, t } = useTranslation();
  const [display, setDisplay] = useState(null);

  useEffect(() => {
    if (locale === 'es-AR') {
      setDisplay({ title: post.title, excerpt: post.excerpt, content: post.content });
      return;
    }

    const langCode = locale.split('-')[0];
    const cacheKey = `post_trans_v1_${post.slug}_${langCode}_${post.date}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        setDisplay(JSON.parse(cached));
        return;
      } catch (_) {}
    }

    let cancelled = false;

    async function translate() {
      try {
        const [resTitle, resExcerpt, resContent] = await Promise.all([
          fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: post.title, targetLangs: [langCode] }),
          }),
          fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: post.excerpt, targetLangs: [langCode] }),
          }),
          fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: post.content, targetLangs: [langCode] }),
          }),
        ]);

        const [dTitle, dExcerpt, dContent] = await Promise.all([
          resTitle.json(),
          resExcerpt.json(),
          resContent.json(),
        ]);

        const translated = {
          title: dTitle?.translations?.[langCode] || post.title,
          excerpt: dExcerpt?.translations?.[langCode] || post.excerpt,
          content: dContent?.translations?.[langCode] || post.content,
        };

        if (!cancelled) {
          sessionStorage.setItem(cacheKey, JSON.stringify(translated));
          setDisplay(translated);
        }
      } catch (_) {
        if (!cancelled) {
          setDisplay({ title: post.title, excerpt: post.excerpt, content: post.content });
        }
      }
    }

    translate();
    return () => { cancelled = true; };
  }, [locale, post]);

  if (!display) {
    return <div className={styles.loading}>{t('common.loading') || 'Cargando...'}</div>;
  }

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        {post.status === 'provisorio' && (
          <div className={styles.provisionalWarning}>
            ⚠️{' '}
            <span>
              <strong>
                {t('blog.provisional_title') || 'Publicación Provisional:'}
              </strong>{' '}
              {t('blog.provisional_desc') ||
                'Este artículo ha sido publicado de forma provisoria y se encuentra en revisión de cumplimiento de pautas editoriales y éticas.'}
            </span>
          </div>
        )}

        <header className={styles.header}>
          <div className={styles.meta}>
            <time className={styles.date}>{formatDate(post.date, locale)}</time>
            {post.author && (
              <span className={styles.author}>{post.author}</span>
            )}
          </div>

          <h1 className={styles.title}>{display.title}</h1>

          {display.excerpt && (
            <p className={styles.excerpt}>{display.excerpt}</p>
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
          <ReactMarkdown>{display.content}</ReactMarkdown>
        </div>

        <AdSlot id="blog-post-bottom" />
      </article>
    </div>
  );
}

function formatDate(dateStr, locale = 'es-AR') {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
