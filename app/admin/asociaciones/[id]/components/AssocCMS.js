'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from '@/app/admin/components/admin.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function autoTranslate(text, lang) {
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLangs: [lang] }),
    });
    const data = await res.json();
    return data?.translations?.[lang] || '';
  } catch { return ''; }
}

const TABS = [
  { key: 'perfil',    label: 'Perfil y contacto' },
  { key: 'directivos', label: 'Comisión directiva' },
  { key: 'noticias',  label: 'Novedades' },
];

export default function AssocCMS({ assoc, initialDirectivos, initialNoticias }) {
  const [tab, setTab] = useState('perfil');

  // ── Perfil state ──────────────────────────────────────────────
  const [details, setDetails] = useState({
    nombre:             assoc.nombre || '',
    fundacion:          assoc.fundacion || 1980,
    descripcion_es:     assoc.descripcion_es || '',
    descripcion_gl:     assoc.descripcion_gl || '',
    descripcion_en:     assoc.descripcion_en || '',
    descripcion_manual_gl: assoc.descripcion_manual_gl || false,
    descripcion_manual_en: assoc.descripcion_manual_en || false,
    historia_es:        assoc.historia_es || '',
    historia_gl:        assoc.historia_gl || '',
    historia_en:        assoc.historia_en || '',
    historia_manual_gl: assoc.historia_manual_gl || false,
    historia_manual_en: assoc.historia_manual_en || false,
    finalidades_es:     assoc.finalidades_es || '',
    finalidades_gl:     assoc.finalidades_gl || '',
    finalidades_en:     assoc.finalidades_en || '',
    finalidades_manual_gl: assoc.finalidades_manual_gl || false,
    finalidades_manual_en: assoc.finalidades_manual_en || false,
    email:              assoc.email || '',
    telefono:           assoc.telefono || '',
    direccion:          assoc.direccion || '',
    ciudad:             assoc.ciudad || '',
    pais:               assoc.pais || 'Argentina',
    logo_url:           assoc.logo_url || '',
    banner_url:         assoc.banner_url || '',
  });
  const [savingPerfil, setSavingPerfil] = useState(false);
  const [perfilMsg, setPerfilMsg] = useState(null);

  // ── Directivos state ──────────────────────────────────────────
  const [directivos, setDirectivos] = useState(initialDirectivos);
  const [newDir, setNewDir] = useState({ nombre: '', cargo: '', orden: 5 });
  const [savingDir, setSavingDir] = useState(false);

  // ── Noticias state ────────────────────────────────────────────
  const [noticias, setNoticias] = useState(initialNoticias);
  const [newNoticia, setNewNoticia] = useState({ titulo_es: '', contenido_es: '' });
  const [savingNoticia, setSavingNoticia] = useState(false);

  // ── Perfil handlers ───────────────────────────────────────────
  function setField(key, val) {
    setDetails((d) => ({ ...d, [key]: val }));
  }

  function markManual(fieldBase, lang) {
    setDetails((d) => ({ ...d, [`${fieldBase}_manual_${lang}`]: true }));
  }

  async function handleSavePerfil(e) {
    e.preventDefault();
    setSavingPerfil(true);
    setPerfilMsg(null);
    try {
      const update = { ...details };

      // Auto-translate fields not marked manual if the Spanish source changed
      for (const fieldBase of ['descripcion', 'historia', 'finalidades']) {
        for (const lang of ['gl', 'en']) {
          const manualKey = `${fieldBase}_manual_${lang}`;
          const esKey = `${fieldBase}_es`;
          const targetKey = `${fieldBase}_${lang}`;
          if (!update[manualKey] && update[esKey]) {
            const translated = await autoTranslate(update[esKey], lang);
            if (translated) { update[targetKey] = translated; update[manualKey] = false; }
          }
        }
      }

      const { error } = await supabase.from('asociaciones').update(update).eq('id', assoc.id);
      if (error) throw error;
      setPerfilMsg({ ok: true, msg: 'Perfil guardado correctamente.' });
    } catch (err) {
      setPerfilMsg({ ok: false, msg: err.message });
    } finally {
      setSavingPerfil(false);
    }
  }

  // ── Directivos handlers ───────────────────────────────────────
  async function handleAddDirectivo(e) {
    e.preventDefault();
    if (!newDir.nombre || !newDir.cargo) return;
    setSavingDir(true);
    try {
      const { data, error } = await supabase
        .from('asociaciones_directivos')
        .insert({ asociacion_id: assoc.id, nombre: newDir.nombre, cargo: newDir.cargo, orden: parseInt(newDir.orden) || 5 })
        .select()
        .single();
      if (error) throw error;
      setDirectivos((d) => [...d, data].sort((a, b) => a.orden - b.orden));
      setNewDir({ nombre: '', cargo: '', orden: 5 });
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSavingDir(false);
    }
  }

  async function handleDeleteDirectivo(id) {
    if (!confirm('¿Eliminar este miembro?')) return;
    const { error } = await supabase.from('asociaciones_directivos').delete().eq('id', id);
    if (!error) setDirectivos((d) => d.filter((x) => x.id !== id));
  }

  // ── Noticias handlers ─────────────────────────────────────────
  async function handleAddNoticia(e) {
    e.preventDefault();
    if (!newNoticia.titulo_es || !newNoticia.contenido_es) return;
    setSavingNoticia(true);
    try {
      const { data, error } = await supabase
        .from('asociaciones_noticias')
        .insert({ asociacion_id: assoc.id, titulo_es: newNoticia.titulo_es, contenido_es: newNoticia.contenido_es, publicado: true })
        .select()
        .single();
      if (error) throw error;
      setNoticias((n) => [data, ...n]);
      setNewNoticia({ titulo_es: '', contenido_es: '' });
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSavingNoticia(false);
    }
  }

  async function handleDeleteNoticia(id) {
    if (!confirm('¿Eliminar esta novedad?')) return;
    const { error } = await supabase.from('asociaciones_noticias').delete().eq('id', id);
    if (!error) setNoticias((n) => n.filter((x) => x.id !== id));
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div>
      {/* Tab nav */}
      <div className={styles.translationTabs} style={{ marginBottom: '24px' }}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles.translationTab} ${tab === key ? styles.translationTabActive : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Perfil tab ── */}
      {tab === 'perfil' && (
        <form onSubmit={handleSavePerfil}>
          {/* Datos básicos */}
          <div className={styles.sectionCard}>
            <h2>Datos básicos</h2>
            <div className={styles.twoCol}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre de la asociación</label>
                <input type="text" className={styles.formInput} value={details.nombre} onChange={(e) => setField('nombre', e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Año de fundación</label>
                <input type="number" className={styles.formInput} value={details.fundacion} onChange={(e) => setField('fundacion', parseInt(e.target.value) || 1980)} />
              </div>
            </div>
          </div>

          {/* Descripción de bienvenida */}
          <div className={styles.sectionCard}>
            <h2>Descripción de bienvenida</h2>
            <div className={styles.fieldGroup}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Español (referencia principal)</label>
                <textarea className={styles.formTextarea} rows={3} value={details.descripcion_es} onChange={(e) => setField('descripcion_es', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Galego {details.descripcion_manual_gl && <span style={{ color: 'var(--gm-gold)', fontSize: '11px' }}>MANUAL</span>}</label>
                <textarea className={styles.formTextarea} rows={3} value={details.descripcion_gl} onChange={(e) => { setField('descripcion_gl', e.target.value); markManual('descripcion', 'gl'); }} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>English {details.descripcion_manual_en && <span style={{ color: 'var(--gm-gold)', fontSize: '11px' }}>MANUAL</span>}</label>
                <textarea className={styles.formTextarea} rows={3} value={details.descripcion_en} onChange={(e) => { setField('descripcion_en', e.target.value); markManual('descripcion', 'en'); }} />
              </div>
            </div>
          </div>

          {/* Historia */}
          <div className={styles.sectionCard}>
            <h2>Nuestra historia</h2>
            <div className={`${styles.fieldGroup} ${styles.fieldGroupBlue}`}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Español</label>
                <textarea className={styles.formTextarea} rows={4} value={details.historia_es} onChange={(e) => setField('historia_es', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Galego {details.historia_manual_gl && <span style={{ color: 'var(--gm-gold)', fontSize: '11px' }}>MANUAL</span>}</label>
                <textarea className={styles.formTextarea} rows={4} value={details.historia_gl} onChange={(e) => { setField('historia_gl', e.target.value); markManual('historia', 'gl'); }} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>English {details.historia_manual_en && <span style={{ color: 'var(--gm-gold)', fontSize: '11px' }}>MANUAL</span>}</label>
                <textarea className={styles.formTextarea} rows={4} value={details.historia_en} onChange={(e) => { setField('historia_en', e.target.value); markManual('historia', 'en'); }} />
              </div>
            </div>
          </div>

          {/* Finalidades */}
          <div className={styles.sectionCard}>
            <h2>Finalidades y objetivos</h2>
            <div className={`${styles.fieldGroup} ${styles.fieldGroupGreen}`}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Español</label>
                <textarea className={styles.formTextarea} rows={3} value={details.finalidades_es} onChange={(e) => setField('finalidades_es', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Galego {details.finalidades_manual_gl && <span style={{ color: 'var(--gm-gold)', fontSize: '11px' }}>MANUAL</span>}</label>
                <textarea className={styles.formTextarea} rows={3} value={details.finalidades_gl} onChange={(e) => { setField('finalidades_gl', e.target.value); markManual('finalidades', 'gl'); }} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>English {details.finalidades_manual_en && <span style={{ color: 'var(--gm-gold)', fontSize: '11px' }}>MANUAL</span>}</label>
                <textarea className={styles.formTextarea} rows={3} value={details.finalidades_en} onChange={(e) => { setField('finalidades_en', e.target.value); markManual('finalidades', 'en'); }} />
              </div>
            </div>
          </div>

          {/* Contacto y media */}
          <div className={styles.sectionCard}>
            <h2>Contacto y medios</h2>
            <div className={styles.twoCol}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email de contacto</label>
                <input type="email" className={styles.formInput} value={details.email} onChange={(e) => setField('email', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Teléfono</label>
                <input type="tel" className={styles.formInput} value={details.telefono} onChange={(e) => setField('telefono', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Dirección</label>
                <input type="text" className={styles.formInput} value={details.direccion} onChange={(e) => setField('direccion', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ciudad</label>
                <input type="text" className={styles.formInput} value={details.ciudad} onChange={(e) => setField('ciudad', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>País</label>
                <input type="text" className={styles.formInput} value={details.pais} onChange={(e) => setField('pais', e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>URL del logotipo</label>
                <input type="url" className={styles.formInput} value={details.logo_url} onChange={(e) => setField('logo_url', e.target.value)} placeholder="https://…" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>URL del banner de cabecera</label>
                <input type="url" className={styles.formInput} value={details.banner_url} onChange={(e) => setField('banner_url', e.target.value)} placeholder="https://…" />
              </div>
            </div>
          </div>

          <div className={styles.actionRow}>
            <button type="submit" className={styles.btnPrimary} disabled={savingPerfil}>
              {savingPerfil ? 'Guardando…' : '✓ Guardar perfil'}
            </button>
            {perfilMsg && (
              <span className={perfilMsg.ok ? styles.successMsg : styles.errorMsg}>
                {perfilMsg.msg}
              </span>
            )}
          </div>
        </form>
      )}

      {/* ── Directivos tab ── */}
      {tab === 'directivos' && (
        <div className={styles.twoCol}>
          <div className={styles.sectionCard}>
            <h2>Añadir miembro</h2>
            <form onSubmit={handleAddDirectivo} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre completo</label>
                <input type="text" className={styles.formInput} value={newDir.nombre} onChange={(e) => setNewDir((d) => ({ ...d, nombre: e.target.value }))} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Cargo</label>
                <input type="text" className={styles.formInput} value={newDir.cargo} onChange={(e) => setNewDir((d) => ({ ...d, cargo: e.target.value }))} placeholder="Presidente, Tesorero…" required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Orden de aparición</label>
                <input type="number" className={styles.formInput} value={newDir.orden} onChange={(e) => setNewDir((d) => ({ ...d, orden: parseInt(e.target.value) || 5 }))} min={1} />
              </div>
              <button type="submit" className={styles.btnPrimary} disabled={savingDir}>
                {savingDir ? 'Añadiendo…' : '+ Añadir miembro'}
              </button>
            </form>
          </div>

          <div className={styles.sectionCard}>
            <h2>Comisión actual</h2>
            {directivos.length === 0 && <p className={styles.emptyState}>Sin miembros cargados.</p>}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {directivos.map((d) => (
                <li key={d.id} className={styles.publishedRow} style={{ padding: '10px 14px' }}>
                  <div>
                    <strong style={{ fontSize: '14px' }}>{d.nombre}</strong>
                    <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--gm-gold)', fontWeight: 600 }}>{d.cargo}</span>
                  </div>
                  <button onClick={() => handleDeleteDirectivo(d.id)} className={styles.btnRowDanger}>Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── Noticias tab ── */}
      {tab === 'noticias' && (
        <div className={styles.twoCol}>
          <div className={styles.sectionCard}>
            <h2>Publicar novedad</h2>
            <form onSubmit={handleAddNoticia} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Título</label>
                <input type="text" className={styles.formInput} value={newNoticia.titulo_es} onChange={(e) => setNewNoticia((n) => ({ ...n, titulo_es: e.target.value }))} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Contenido</label>
                <textarea className={styles.formTextarea} rows={5} value={newNoticia.contenido_es} onChange={(e) => setNewNoticia((n) => ({ ...n, contenido_es: e.target.value }))} required />
              </div>
              <button type="submit" className={styles.btnPrimary} disabled={savingNoticia}>
                {savingNoticia ? 'Publicando…' : '+ Publicar novedad'}
              </button>
            </form>
          </div>

          <div className={styles.sectionCard}>
            <h2>Novedades publicadas</h2>
            {noticias.length === 0 && <p className={styles.emptyState}>Sin novedades publicadas.</p>}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {noticias.map((n) => (
                <li key={n.id} className={styles.publishedRow} style={{ alignItems: 'flex-start', padding: '12px 16px', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <strong style={{ fontSize: '14px' }}>{n.titulo_es}</strong>
                    <button onClick={() => handleDeleteNoticia(n.id)} className={styles.btnRowDanger}>Eliminar</button>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    {n.contenido_es.length > 120 ? n.contenido_es.substring(0, 120) + '…' : n.contenido_es}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
