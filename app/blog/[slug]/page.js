'use client';

import React, { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import styles from './post.module.css';
import AdSlot from '../components/AdSlot';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/components/LanguageContext';

export default function PostPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { slug } = params;
  const { locale, t } = useTranslation();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translatedContent, setTranslatedContent] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await supabase
          .from('blog_posts')
          .select('slug, autor_nombre, titulo, extracto, contenido, categoria, tags, estado, fecha_publicacion')
          .eq('slug', slug)
          .maybeSingle();

        if (data) {
          setPost({
            slug: data.slug,
            title: data.titulo,
            date: data.fecha_publicacion || '',
            excerpt: data.extracto || '',
            author: data.autor_nombre || 'Galicia Migrante',
            tags: data.tags || [],
            category: data.categoria || 'general',
            status: data.estado || 'publicado',
            content: data.contenido || '',
          });
        }
      } catch (err) {
        console.warn('Error fetching post detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  // Autotraducción en caliente del contenido del post
  useEffect(() => {
    if (!post) return;
    if (locale === 'es-AR') {
      setTranslatedContent({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content
      });
      return;
    }

    const translatePostData = async () => {
      const langCode = locale.split('-')[0];
      try {
        const resTitle = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: post.title, targetLangs: [langCode] })
        });
        const dTitle = await resTitle.json();
        const transTitle = dTitle?.translations?.[langCode] || post.title;

        const resExcerpt = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: post.excerpt, targetLangs: [langCode] })
        });
        const dExcerpt = await resExcerpt.json();
        const transExcerpt = dExcerpt?.translations?.[langCode] || post.excerpt;

        const resContent = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: post.content, targetLangs: [langCode] })
        });
        const dContent = await resContent.json();
        const transContent = dContent?.translations?.[langCode] || post.content;

        setTranslatedContent({
          title: transTitle,
          excerpt: transExcerpt,
          content: transContent
        });
      } catch (err) {
        console.warn('Error hot-translating post detail:', err);
        setTranslatedContent({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content
        });
      }
    };

    translatePostData();
  }, [locale, post]);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
        {t('common.loading') || 'Cargando...'}
      </div>
    );
  }

  if (!post || !translatedContent) notFound();

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        {post.status === 'provisorio' && (
          <div className={styles.provisionalWarning}>
            ⚠️ <strong>{t('blog.provisional_title') || 'Publicación Provisional:'}</strong> {t('blog.provisional_desc') || 'Este artículo ha sido publicado de forma provisoria y se encuentra en revisión de cumplimiento de pautas editoriales y éticas.'}
          </div>
        )}

        <header className={styles.header}>
          <div className={styles.meta}>
            <time className={styles.date}>{formatDate(post.date, locale)}</time>
            {post.author && (
              <span className={styles.author}>{t('blog.by') || 'por'} {post.author}</span>
            )}
          </div>

          <h1 className={styles.title}>{translatedContent.title}</h1>

          {translatedContent.excerpt && (
            <p className={styles.excerpt}>{translatedContent.excerpt}</p>
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
          <MDXRemote source={translatedContent.content} />
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
