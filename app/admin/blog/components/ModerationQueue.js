'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from '@/app/admin/components/admin.module.css';

const STATUS_LABEL = {
  borrador: 'Borrador', en_revision: 'En revisión',
  publicado: 'Publicado', rechazado: 'Rechazado', bloqueado: 'Bloqueado',
};

export default function ModerationQueue({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [working, setWorking] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [motivo, setMotivo] = useState('');

  async function approve(id) {
    setWorking(id);
    const { error } = await supabase
      .from('blog_posts')
      .update({ estado: 'publicado', motivo_rechazo: null })
      .eq('id', id);
    if (!error) setPosts((p) => p.filter((post) => post.id !== id));
    setWorking(null);
  }

  async function reject(id) {
    setWorking(id);
    const { error } = await supabase
      .from('blog_posts')
      .update({ estado: 'rechazado', motivo_rechazo: motivo || null })
      .eq('id', id);
    if (!error) {
      setPosts((p) => p.filter((post) => post.id !== id));
      setRejectingId(null);
      setMotivo('');
    }
    setWorking(null);
  }

  function formatDate(str) {
    if (!str) return '';
    const [y, m, d] = str.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  if (posts.length === 0) {
    return (
      <div className={styles.queueEmpty}>
        ✅ No hay artículos pendientes de revisión.
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className={styles.postCard}>
          <div className={styles.postCardHeader}>
            <div>
              <div className={styles.postTitle}>{post.titulo}</div>
              <div className={styles.postMeta}>
                <span>{post.autor_nombre}</span>
                <span>·</span>
                <span>{post.categoria}</span>
                <span>·</span>
                <span>{formatDate(post.created_at)}</span>
                <span className={`${styles.badge} ${styles[post.estado]}`}>
                  {STATUS_LABEL[post.estado]}
                </span>
              </div>
            </div>
          </div>

          {post.extracto && (
            <p className={styles.postExcerpt}>{post.extracto}</p>
          )}

          <div className={styles.postActions}>
            <button
              className={styles.btnApprove}
              onClick={() => approve(post.id)}
              disabled={working === post.id}
            >
              {working === post.id ? '...' : '✓ Aprobar'}
            </button>
            <button
              className={styles.btnReject}
              onClick={() => setRejectingId(rejectingId === post.id ? null : post.id)}
              disabled={working === post.id}
            >
              Rechazar
            </button>
            <Link
              href={`/blog/${post.slug}`}
              className={styles.btnPreview}
              target="_blank"
            >
              Previsualizar →
            </Link>
          </div>

          {rejectingId === post.id && (
            <div className={styles.rejectForm}>
              <input
                className={styles.rejectInput}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Motivo del rechazo (opcional — el autor lo verá)"
              />
              <button
                className={styles.btnRejectConfirm}
                onClick={() => reject(post.id)}
                disabled={working === post.id}
              >
                Confirmar rechazo
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
