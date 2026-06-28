'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from '@/app/admin/components/admin.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function groupRows(rows) {
  const map = {};
  rows.forEach((r) => {
    if (!map[r.clave]) map[r.clave] = { clave: r.clave, es: '', gl: '', en: '', manual: { gl: false, en: false } };
    if (r.idioma === 'es') map[r.clave].es = r.texto_por_defecto || '';
    if (r.idioma === 'gl') { map[r.clave].gl = r.texto_custom || r.texto_por_defecto || ''; map[r.clave].manual.gl = !!r.es_manual; }
    if (r.idioma === 'en') { map[r.clave].en = r.texto_custom || r.texto_por_defecto || ''; map[r.clave].manual.en = !!r.es_manual; }
  });
  return Object.values(map);
}

export default function I18nEditor({ initialRows }) {
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [editVals, setEditVals] = useState({ es: '', gl: '', en: '' });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const grouped = useMemo(() => groupRows(rows), [rows]);
  const filtered = useMemo(() =>
    grouped.filter((t) =>
      t.clave.toLowerCase().includes(search.toLowerCase()) ||
      t.es.toLowerCase().includes(search.toLowerCase())
    ),
    [grouped, search]
  );

  function startEdit(entry) {
    setEditingKey(entry.clave);
    setEditVals({ es: entry.es, gl: entry.gl, en: entry.en });
    setFeedback(null);
  }

  function cancelEdit() { setEditingKey(null); }

  async function saveEdit(clave) {
    setSaving(true);
    setFeedback(null);
    try {
      const ops = [
        supabase.from('traducciones_interfaz').upsert({ clave, idioma: 'es', texto_por_defecto: editVals.es }, { onConflict: 'clave,idioma' }),
        supabase.from('traducciones_interfaz').upsert({ clave, idioma: 'gl', texto_custom: editVals.gl, es_manual: true }, { onConflict: 'clave,idioma' }),
        supabase.from('traducciones_interfaz').upsert({ clave, idioma: 'en', texto_custom: editVals.en, es_manual: true }, { onConflict: 'clave,idioma' }),
      ];
      const results = await Promise.all(ops);
      const err = results.find((r) => r.error)?.error;
      if (err) throw err;

      setRows((prev) => {
        const next = prev.filter((r) => r.clave !== clave);
        return [
          ...next,
          { clave, idioma: 'es', texto_por_defecto: editVals.es, texto_custom: null, es_manual: false },
          { clave, idioma: 'gl', texto_por_defecto: '', texto_custom: editVals.gl, es_manual: true },
          { clave, idioma: 'en', texto_por_defecto: '', texto_custom: editVals.en, es_manual: true },
        ];
      });
      setEditingKey(null);
      setFeedback({ ok: true, msg: `"${clave}" guardado.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback({ ok: false, msg: e.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Buscar por clave o texto en Español…"
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {feedback && (
        <div className={`${styles.statusMsg} ${feedback.ok ? styles.statusMsgOk : styles.statusMsgError}`}>
          {feedback.msg}
        </div>
      )}

      <div className={styles.sectionCard} style={{ padding: 0, overflow: 'hidden' }}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Clave</th>
              <th style={{ width: '26%' }}>Español</th>
              <th style={{ width: '22%' }}>Galego</th>
              <th style={{ width: '22%' }}>English</th>
              <th style={{ width: '8%' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className={styles.emptyState}>Sin resultados.</td></tr>
            )}
            {filtered.map((t) =>
              editingKey === t.clave ? (
                <tr key={t.clave}>
                  <td><code>{t.clave}</code></td>
                  <td><input className={styles.inlineInput} value={editVals.es} onChange={(e) => setEditVals((v) => ({ ...v, es: e.target.value }))} /></td>
                  <td><input className={styles.inlineInput} value={editVals.gl} onChange={(e) => setEditVals((v) => ({ ...v, gl: e.target.value }))} /></td>
                  <td><input className={styles.inlineInput} value={editVals.en} onChange={(e) => setEditVals((v) => ({ ...v, en: e.target.value }))} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className={styles.btnRowSuccess} onClick={() => saveEdit(t.clave)} disabled={saving}>
                        {saving ? '…' : 'OK'}
                      </button>
                      <button className={styles.btnRow} onClick={cancelEdit}>✕</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={t.clave}>
                  <td><code>{t.clave}</code></td>
                  <td style={{ color: 'var(--text-primary)' }}>{t.es}</td>
                  <td>
                    {t.gl}
                    {t.manual.gl && <span className={styles.badge} style={{ marginLeft: '6px', color: '#7a4f0a', background: 'rgba(200,169,110,0.13)', border: '1px solid rgba(200,169,110,0.3)' }}>MANUAL</span>}
                  </td>
                  <td>
                    {t.en}
                    {t.manual.en && <span className={styles.badge} style={{ marginLeft: '6px', color: '#7a4f0a', background: 'rgba(200,169,110,0.13)', border: '1px solid rgba(200,169,110,0.3)' }}>MANUAL</span>}
                  </td>
                  <td>
                    <button className={styles.btnRow} onClick={() => startEdit(t)}>✏️</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
