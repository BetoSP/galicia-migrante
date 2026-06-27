'use client';

import { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import PostEditor from '../../components/PostEditor';

export default function EditarPostPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { slug } = params;
  const { user } = useAuth();
  const [post, setPost] = useState(undefined);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('blog_posts')
      .select('id, slug, autor_id, titulo, extracto, contenido, categoria, tags, estado')
      .eq('slug', slug)
      .eq('autor_id', user.id)
      .maybeSingle()
      .then(({ data }) => setPost(data || null));
  }, [slug, user]);

  if (post === undefined) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', justifyContent: 'center', alignItems: 'center', color: 'var(--color-text-secondary)' }}>
        Cargando...
      </div>
    );
  }

  if (post === null) notFound();

  return (
    <PostEditor
      initialData={{
        slug: post.slug,
        title: post.titulo,
        excerpt: post.extracto || '',
        content: post.contenido || '',
        category: post.categoria || 'general',
        tags: post.tags || [],
        status: post.estado,
      }}
    />
  );
}
