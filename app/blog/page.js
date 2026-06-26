'use client';

import React, { useEffect, useState } from 'react';
import styles from './blog.module.css';
import AdSlot from './components/AdSlot';
import BlogList from './components/BlogList';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/components/LanguageContext';

export default function BlogPage() {
  const { locale, t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translatedPosts, setTranslatedPosts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await supabase
          .from('blog_posts')
          .select('slug, autor_nombre, titulo, extracto, categoria, tags, estado, fecha_publicacion')
          .order('fecha_publicacion', { ascending: false });

        if (data) {
          const mapped = data.map(post => ({
            slug: post.slug,
            title: post.titulo,
            date: post.fecha_publicacion || '',
            excerpt: post.extracto || '',
            author: post.autor_nombre || 'Galicia Migrante',
            tags: post.tags || [],
            category: post.categoria || 'general',
            status: post.estado || 'publicado',
          }));
          setPosts(mapped);
        }
      } catch (err) {
        console.warn('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Traducción en caliente de posts
  useEffect(() => {
    if (posts.length === 0 || locale === 'es-AR') return;
    const langCode = locale.split('-')[0];

    posts.forEach(async (post) => {
      // Buscar en Supabase para ver si ya están traducidos (se asume que blog_posts tiene campos titulo_gl, titulo_en si se requiere, pero si no se autotraduce al vuelo en el state local del cliente para evitar romper el schema de BD)
      // Si la BD no los tiene aún (nuestro schema tiene 'titulo', 'extracto', 'contenido' genérico),
      // podemos usar traducción al vuelo en caliente del state
      const cacheKey = `${post.slug}_${langCode}`;
      if (translatedPosts[cacheKey]) return;

      try {
        const resTitle = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: post.title, targetLangs: [langCode] })
        });
        const dTitle = await resTitle.json();
        const transTitle = dTitle?.translations?.[langCode];

        const resExcerpt = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: post.excerpt, targetLangs: [langCode] })
        });
        const dExcerpt = await resExcerpt.json();
        const transExcerpt = dExcerpt?.translations?.[langCode];

        if (transTitle || transExcerpt) {
          setTranslatedPosts(prev => ({
            ...prev,
            [cacheKey]: {
              title: transTitle || post.title,
              excerpt: transExcerpt || post.excerpt
            }
          }));
        }
      } catch (err) {
        console.warn('Hot translating blog list error:', err);
      }
    });
  }, [locale, posts]);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
        {t('common.loading') || 'Cargando...'}
      </div>
    );
  }

  const localizedPosts = posts.map(post => {
    const langCode = locale.split('-')[0];
    const translation = translatedPosts[`${post.slug}_${langCode}`];
    return {
      ...post,
      title: translation?.title || post.title,
      excerpt: translation?.excerpt || post.excerpt
    };
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('nav.blog') || 'Blog'}</h1>
        <p className={styles.subtitle}>
          {t('home.servicios.blog.desc') || 'Historias, cultura e identidad de la diáspora gallega en el mundo.'}
        </p>
      </header>

      <AdSlot id="blog-listing-top" />

      <BlogList posts={localizedPosts} />
    </div>
  );
}
