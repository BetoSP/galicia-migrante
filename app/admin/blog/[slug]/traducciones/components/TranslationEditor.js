'use client';

import { useState } from 'react';
import styles from '@/app/admin/components/admin.module.css';

const LANGS = [
  { code: 'gl', label: 'Galego' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
];

const FIELDS = [
  { key: 'titulo',   label: 'Título' },
  { key: 'extracto', label: 'Extracto' },
  { key: 'contenido', label: 'Contenido', multiline: true },
];

function buildMap(rows) {
  const map = {};
  rows.forEach((r) => { map[r.lang] = { ...r }; });
  return map;
}

export default function TranslationEditor({ postId, original, initialTranslations }) {
  const [activeLang, setActiveLang] = useState('gl');
  const [data, setData] = useState(buildMap(initialTranslations));
  const [editing, setEditing] = useState({});   // { lang_field: value }
  const [saving, setSaving] = useState(null);   // 'gl_titulo' | 'gl_reset' | 'all' | null
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});

  const current = data[activeLang] || { titulo: '', extracto: '', contenido: '', es_manual: false };

  function fieldEditKey(field) { return `${activeLang}_${field}`; }

  function startEdit(field) {
    setEditing((e) => ({ ...e, [fieldEditKey(field)]: current[field] || '' }));
  }

  function cancelEdit(field) {
    setEditing((e) => {
      const next = { ...e };
      delete next[fieldEditKey(field)];
      return next;
    });
  }

  async function saveField(field) {
    const key = fieldEditKey(field);
    const value = editing[key];
    setSaving(key);
    setErrors((e) => ({ ...e, [key]: null }));

    const res = await fetch(`/api/blog/${postId}/translations`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang: activeLang, [field]: value }),
    });

    if (res.ok) {
      setData((d) => ({
        ...d,
        [activeLang]: { ...d[activeLang], [field]: value, es_manual: true },
      }));
      setEditing((e) => { const n = { ...e }; delete n[key]; return n; });
      setSuccess((s) => ({ ...s, [key]: true }));
      setTimeout(() => setSuccess((s) => ({ ...s, [key]: false })), 3000);
    } else {
      const body = await res.json();
      setErrors((e) => ({ ...e, [key]: body.error || 'Error al guardar' }));
    }
    setSaving(null);
  }

  async function resetToAuto() {
    const key = `${activeLang}_reset`;
    setSaving(key);
    setErrors((e) => ({ ...e, reset: null }));

    const res = await fetch(`/api/blog/${postId}/translations`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang: activeLang, resetManual: true }),
    });

    if (res.ok) {
      const body = await res.json();
      setData((d) => ({
        ...d,
        [activeLang]: {
          lang:      activeLang,
          titulo:    body.titulo,
          extracto:  body.extracto,
          contenido: body.contenido,
          es_manual: false,
        },
      }));
      setEditing({});
      setSuccess((s) => ({ ...s, reset: true }));
      setTimeout(() => setSuccess((s) => ({ ...s, reset: false })), 3000);
    } else {
      const body = await res.json();
      setErrors((e) => ({ ...e, reset: body.error || 'Error al re-traducir' }));
    }
    setSaving(null);
  }

  async function translateAll() {
    setSaving('all');
    setErrors((e) => ({ ...e, all: null }));

    const res = await fetch(`/api/blog/${postId}/translate-all`, { method: 'POST' });

    if (res.ok) {
      const body = await res.json();
      setData((d) => {
        const next = { ...d };
        LANGS.forEach(({ code }) => {
          if (body.translations?.[code]) {
            next[code] = {
              ...next[code],
              lang:      code,
              titulo:    body.translations[code].titulo,
              extracto:  body.translations[code].extracto,
              contenido: body.translations[code].contenido,
              es_manual: false,
            };
          }
        });
        return next;
      });
      setEditing({});
      setSuccess((s) => ({ ...s, all: true }));
      setTimeout(() => setSuccess((s) => ({ ...s, all: false })), 4000);
    } else {
      const body = await res.json().catch(() => ({}));
      setErrors((e) => ({ ...e, all: body.error || 'Error al traducir' }));
    }
    setSaving(null);
  }

  return (
    <div className={styles.translationEditor}>
      {/* Traducir todo */}
      <div className={styles.translateAllBar}>
        <button
          className={styles.btnTranslateAll}
          onClick={translateAll}
          disabled={saving !== null}
        >
          {saving === 'all' ? 'Traduciendo los 5 idiomas...' : '🌐 Traducir todo (5 idiomas)'}
        </button>
        {success.all && <span className={styles.successMsg}>✓ Todos los idiomas traducidos</span>}
        {errors.all && <span className={styles.errorMsg}>{errors.all}</span>}
      </div>

      {/* Language tabs */}
      <div className={styles.translationTabs}>
        {LANGS.map(({ code, label }) => {
          const isManual = data[code]?.es_manual;
          const hasData  = !!data[code]?.titulo;
          return (
            <button
              key={code}
              className={`${styles.translationTab} ${activeLang === code ? styles.translationTabActive : ''}`}
              onClick={() => { setActiveLang(code); setEditing({}); }}
            >
              {label}
              {isManual && <span className={styles.manualDot} title="Traducción manual">✏️</span>}
              {!hasData && <span className={styles.missingDot} title="Sin traducción">⚠️</span>}
            </button>
          );
        })}
      </div>

      {/* Manual badge + reset button */}
      <div className={styles.translationMeta}>
        {current.es_manual ? (
          <span className={styles.manualBadge}>✏️ Traducción manual</span>
        ) : (
          <span className={styles.autoBadge}>🤖 Traducción automática</span>
        )}
        <button
          className={styles.btnRetranslate}
          onClick={resetToAuto}
          disabled={saving !== null}
        >
          {saving === `${activeLang}_reset` ? 'Re-traduciendo...' : '↺ Restablecer automático'}
        </button>
        {success.reset && <span className={styles.successMsg}>✓ Re-traducido</span>}
        {errors.reset && <span className={styles.errorMsg}>{errors.reset}</span>}
      </div>

      {/* Fields */}
      {FIELDS.map(({ key, label, multiline }) => {
        const editKey = fieldEditKey(key);
        const isEditing = editKey in editing;
        const isSaving = saving === editKey;

        return (
          <div key={key} className={styles.translationField}>
            <div className={styles.translationFieldHeader}>
              <span className={styles.translationLabel}>{label}</span>
              <div className={styles.translationFieldActions}>
                {!isEditing ? (
                  <button className={styles.btnEditField} onClick={() => startEdit(key)}>
                    Editar
                  </button>
                ) : (
                  <>
                    <button
                      className={styles.btnSaveField}
                      onClick={() => saveField(key)}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button className={styles.btnCancelEdit} onClick={() => cancelEdit(key)}>
                      Cancelar
                    </button>
                  </>
                )}
                {success[editKey] && <span className={styles.successMsg}>✓ Guardado</span>}
              </div>
            </div>

            {/* Original (Spanish) for reference */}
            <div className={styles.translationOriginal}>
              <span className={styles.originalLabel}>ES:</span>
              <span className={styles.originalText}>{original[key]}</span>
            </div>

            {/* Translation — editable or display */}
            {isEditing ? (
              multiline ? (
                <textarea
                  className={styles.translationTextarea}
                  value={editing[editKey]}
                  onChange={(e) => setEditing((ed) => ({ ...ed, [editKey]: e.target.value }))}
                  rows={12}
                />
              ) : (
                <input
                  className={styles.translationInput}
                  value={editing[editKey]}
                  onChange={(e) => setEditing((ed) => ({ ...ed, [editKey]: e.target.value }))}
                />
              )
            ) : (
              <div className={`${styles.translationValue} ${multiline ? styles.translationValueMulti : ''}`}>
                {current[key] || <em className={styles.noTranslation}>Sin traducción</em>}
              </div>
            )}

            {errors[editKey] && <p className={styles.errorMsg}>{errors[editKey]}</p>}
          </div>
        );
      })}
    </div>
  );
}
