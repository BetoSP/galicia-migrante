'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { BLOG_CATEGORIES } from '@/lib/blog/categories';
import styles from './editor.module.css';

const CATEGORIES_WITHOUT_TODOS = BLOG_CATEGORIES.filter((c) => c.id !== 'todos');

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export default function PostEditor({ initialData = null }) {
  const router = useRouter();
  const { user } = useAuth();
  const textareaRef = useRef(null);
  const isEditing = Boolean(initialData);

  const [titulo, setTitulo] = useState(initialData?.title || '');
  const [extracto, setExtracto] = useState(initialData?.excerpt || '');
  const [categoria, setCategoria] = useState(initialData?.category || 'general');
  const [tags, setTags] = useState((initialData?.tags || []).join(', '));
  const [contenido, setContenido] = useState(initialData?.content || '');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const insertMarkdown = useCallback((before, after = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = contenido.slice(start, end);
    const newContent =
      contenido.slice(0, start) + before + selected + after + contenido.slice(end);
    setContenido(newContent);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  }, [contenido]);

  async function handleSubmit(estado) {
    if (!titulo.trim()) {
      setStatusMsg({ type: 'error', text: 'El título es obligatorio.' });
      return;
    }
    if (!contenido.trim()) {
      setStatusMsg({ type: 'error', text: 'El contenido no puede estar vacío.' });
      return;
    }
    if (estado === 'en_revision' && !extracto.trim()) {
      setStatusMsg({ type: 'error', text: 'El extracto es obligatorio para enviar a revisión.' });
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    const slug = initialData?.slug || slugify(titulo) + '-' + Date.now().toString(36);
    const tagsArray = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      slug,
      autor_id: user.id,
      autor_nombre:
        `${user.user_metadata?.nombre || ''} ${user.user_metadata?.apellido || ''}`.trim() ||
        user.email,
      titulo: titulo.trim(),
      extracto: extracto.trim(),
      contenido: contenido.trim(),
      categoria,
      tags: tagsArray,
      estado,
      fecha_publicacion: new Date().toISOString().split('T')[0],
    };

    let error;
    if (isEditing) {
      ({ error } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('slug', initialData.slug)
        .eq('autor_id', user.id));
    } else {
      ({ error } = await supabase.from('blog_posts').insert(payload));
    }

    setSubmitting(false);

    if (error) {
      setStatusMsg({ type: 'error', text: `Error: ${error.message}` });
      return;
    }

    if (estado === 'en_revision') {
      setStatusMsg({
        type: 'success',
        text: '¡Artículo enviado para revisión! Te avisaremos cuando sea aprobado.',
      });
      setTimeout(() => router.push('/dashboard/posts'), 2000);
    } else {
      setStatusMsg({ type: 'success', text: 'Borrador guardado correctamente.' });
      setTimeout(() => router.push('/dashboard/posts'), 1500);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {isEditing ? 'Editar artículo' : 'Nuevo artículo'}
        </h1>
        <p className={styles.subtitle}>
          Escribí en Markdown. La columna derecha muestra la vista previa en tiempo real.
        </p>
      </header>

      <div className={styles.form}>
        <div className={styles.group}>
          <label className={styles.label}>Título *</label>
          <input
            className={styles.input}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="El título de tu artículo"
            maxLength={200}
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Extracto *</label>
          <textarea
            className={styles.textarea}
            style={{ minHeight: '80px', resize: 'vertical' }}
            value={extracto}
            onChange={(e) => setExtracto(e.target.value)}
            placeholder="Un párrafo breve que resuma el artículo (aparece en la lista del blog)"
            maxLength={400}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label className={styles.label}>Categoría</label>
            <select
              className={styles.select}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {CATEGORIES_WITHOUT_TODOS.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Etiquetas</label>
            <input
              className={styles.input}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="galicia, emigracion, historia (separadas por coma)"
            />
            <span className={styles.hint}>Separadas por coma · Se normalizan a minúsculas</span>
          </div>
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Contenido (Markdown) *</label>
          <div className={styles.editorWrapper}>
            <div className={styles.editorPane}>
              <div className={styles.toolbar}>
                <button className={styles.toolBtn} type="button" onClick={() => insertMarkdown('**', '**')} title="Negrita">B</button>
                <button className={styles.toolBtn} type="button" onClick={() => insertMarkdown('*', '*')} title="Cursiva" style={{ fontStyle: 'italic' }}>I</button>
                <button className={styles.toolBtn} type="button" onClick={() => insertMarkdown('## ')} title="Encabezado">H2</button>
                <button className={styles.toolBtn} type="button" onClick={() => insertMarkdown('### ')} title="Sub-encabezado">H3</button>
                <button className={styles.toolBtn} type="button" onClick={() => insertMarkdown('> ')} title="Cita">❝</button>
                <button className={styles.toolBtn} type="button" onClick={() => insertMarkdown('- ')} title="Lista">•</button>
                <button className={styles.toolBtn} type="button" onClick={() => insertMarkdown('\n---\n')} title="Separador">—</button>
                <button className={styles.toolBtn} type="button" onClick={() => insertMarkdown('[texto](', ')')} title="Enlace">🔗</button>
              </div>
              <textarea
                ref={textareaRef}
                className={styles.editorTextarea}
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder={'# Mi artículo\n\nEscribí aquí tu contenido en Markdown...\n\n## Sección\n\nPárrafo de ejemplo.'}
                spellCheck
              />
            </div>
            <div className={styles.previewPane}>
              <div className={styles.paneLabel}>Vista previa</div>
              <div className={styles.preview}>
                {contenido.trim() ? (
                  <ReactMarkdown>{contenido}</ReactMarkdown>
                ) : (
                  <p className={styles.previewEmpty}>
                    La vista previa aparece aquí mientras escribís.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnDraft}
            onClick={() => handleSubmit('borrador')}
            disabled={submitting}
          >
            {submitting ? 'Guardando...' : 'Guardar borrador'}
          </button>
          <button
            type="button"
            className={styles.btnSubmit}
            onClick={() => handleSubmit('en_revision')}
            disabled={submitting}
          >
            {submitting ? 'Enviando...' : 'Enviar para revisión →'}
          </button>
          {statusMsg && (
            <span className={`${styles.statusMsg} ${styles[statusMsg.type]}`}>
              {statusMsg.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
