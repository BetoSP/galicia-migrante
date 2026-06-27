'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import styles from './components/posts.module.css';

const STATUS_LABEL = {
  borrador:    'Borrador',
  en_revision: 'En revisión',
  publicado:   'Publicado',
  rechazado:   'Rechazado',
  bloqueado:   'Bloqueado',
};

export default function MisPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('blog_posts')
      .select('id, slug, titulo, extracto, categoria, estado, motivo_rechazo, fecha_publicacion, created_at')
      .eq('autor_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data || []);
        setLoading(false);
      });
  }, [user]);

  async function handleDelete(slug) {
    if (!confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return;
    setDeleting(slug);
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('slug', slug)
      .eq('autor_id', user.id);
    if (!error) setPosts((prev) => prev.filter((p) => p.slug !== slug));
    setDeleting(null);
  }

  function formatDate(str) {
    if (!str) return '';
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', justifyContent: 'center', alignItems: 'center', color: 'var(--color-text-secondary)' }}>
        Cargando tus artículos...
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mis artículos</h1>
        <Link href="/dashboard/posts/nuevo" className={styles.btnNew}>
          + Nuevo artículo
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Todavía no escribiste nada</p>
          <p className={styles.emptyDesc}>
            Compartí tu historia, una crónica familiar, un poema o una guía de trámites.
          </p>
          <Link href="/dashboard/posts/nuevo" className={styles.btnNew}>
            Escribir mi primer artículo
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => {
            const canEdit = ['borrador', 'en_revision', 'rechazado'].includes(post.estado);
            return (
              <div key={post.slug} className={styles.card}>
                <div className={styles.cardBody}>
                  <div className={styles.cardTitle}>{post.titulo}</div>
                  <div className={styles.cardMeta}>
                    <span className={`${styles.badge} ${styles[post.estado]}`}>
                      {STATUS_LABEL[post.estado] || post.estado}
                    </span>
                    <span>{post.categoria}</span>
                    <span>{formatDate(post.fecha_publicacion || post.created_at?.split('T')[0])}</span>
                  </div>
                  {post.estado === 'rechazado' && post.motivo_rechazo && (
                    <div className={styles.motivoRechazo}>
                      Motivo: {post.motivo_rechazo}
                    </div>
                  )}
                </div>
                <div className={styles.cardActions}>
                  {canEdit && (
                    <Link href={`/dashboard/posts/${post.slug}/editar`} className={styles.btnEdit}>
                      Editar
                    </Link>
                  )}
                  {post.estado === 'publicado' && (
                    <Link href={`/blog/${post.slug}`} className={styles.btnEdit} target="_blank">
                      Ver →
                    </Link>
                  )}
                  {post.estado !== 'publicado' && (
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDelete(post.slug)}
                      disabled={deleting === post.slug}
                    >
                      {deleting === post.slug ? '...' : 'Eliminar'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
