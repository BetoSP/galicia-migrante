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

  // Traducción en caliente de posts — un request por post, con caché en sessionStorage.
  useEffect(() => {
    if (posts.length === 0 || locale === 'es-AR') return;
    const langCode = locale.split('-')[0];

    const translatePending = async () => {
      const pending = posts.filter((post) => {
        const cacheKey = `blog_trans_${post.slug}_${langCode}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          try {
            setTranslatedPosts(prev => ({ ...prev, [`${post.slug}_${langCode}`]: JSON.parse(cached) }));
          } catch {}
          return false;
        }
        return !translatedPosts[`${post.slug}_${langCode}`];
      });

      // Traduce de uno en uno para respetar la cuota de MyMemory
      for (const post of pending) {
        const cacheKey = `blog_trans_${post.slug}_${langCode}`;
        const SEPARATOR = '\n|||SPLIT|||\n';
        const combined = [post.title, post.excerpt].join(SEPARATOR);
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: combined, targetLangs: [langCode] }),
          });
          const data = await res.json();
          const translated = data?.translations?.[langCode] ?? '';
          const [transTitle, transExcerpt] = translated.split(SEPARATOR);
          const entry = {
            title: transTitle?.trim() || post.title,
            excerpt: transExcerpt?.trim() || post.excerpt,
          };
          sessionStorage.setItem(cacheKey, JSON.stringify(entry));
          setTranslatedPosts(prev => ({ ...prev, [`${post.slug}_${langCode}`]: entry }));
        } catch (err) {
          console.warn('Error traduciendo post del blog:', err);
        }
      }
    };

    translatePending();
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
