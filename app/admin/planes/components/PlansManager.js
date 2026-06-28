'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from '@/app/admin/components/admin.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PlansManager({ planes }) {
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [limits, setLimits] = useState({ limite_personas: 50, habilitar_gedcom: false });
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    setSearching(true);
    setSelectedUser(null);
    setFeedback(null);
    try {
      const { data: profile } = await supabase
        .from('usuarios')
        .select('id, email, nombre')
        .eq('email', searchEmail.trim().toLowerCase())
        .maybeSingle();

      if (!profile) { setFeedback({ ok: false, msg: 'Usuario no encontrado.' }); return; }

      const { data: features } = await supabase
        .from('usuario_features')
        .select('*')
        .eq('usuario_id', profile.id);

      const resolved = { limite_personas: 50, habilitar_gedcom: false };
      (features || []).forEach((f) => {
        if (f.feature_key === 'limite_personas') resolved.limite_personas = f.limite_valor ?? 50;
        if (f.feature_key === 'gedcom') resolved.habilitar_gedcom = !!f.habilitado;
      });

      setSelectedUser(profile);
      setLimits(resolved);
    } catch (err) {
      setFeedback({ ok: false, msg: err.message });
    } finally {
      setSearching(false);
    }
  }

  async function handleSave() {
    if (!selectedUser) return;
    setSaving(true);
    setFeedback(null);
    try {
      await Promise.all([
        supabase.from('usuario_features').upsert(
          { usuario_id: selectedUser.id, feature_key: 'limite_personas', limite_valor: limits.limite_personas, habilitado: true },
          { onConflict: 'usuario_id,feature_key' }
        ),
        supabase.from('usuario_features').upsert(
          { usuario_id: selectedUser.id, feature_key: 'gedcom', habilitado: limits.habilitar_gedcom },
          { onConflict: 'usuario_id,feature_key' }
        ),
      ]);
      setFeedback({ ok: true, msg: `Excepciones aplicadas a ${selectedUser.email}.` });
    } catch (err) {
      setFeedback({ ok: false, msg: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.twoCol}>
      {/* Planes */}
      <div className={styles.sectionCard}>
        <h2>Planes disponibles</h2>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Plan</th>
              <th>Precio ARS</th>
              <th>Límite árbol</th>
              <th>Miembros</th>
            </tr>
          </thead>
          <tbody>
            {planes.length === 0 && (
              <tr><td colSpan={4} className={styles.emptyState}>Sin planes configurados.</td></tr>
            )}
            {planes.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.nombre}</strong></td>
                <td>${p.precio_ars?.toLocaleString('es-AR') ?? 0}</td>
                <td>{p.limite_personas === 0 ? 'Ilimitado' : `${p.limite_personas} personas`}</td>
                <td>{p.limite_miembros ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Excepciones por usuario */}
      <div className={styles.sectionCard}>
        <h2>Excepciones individuales</h2>
        <p>Aplica límites especiales a un usuario por encima de su plan.</p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <input
            type="email"
            placeholder="usuario@ejemplo.com"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className={styles.formInput}
            style={{ flex: 1 }}
            required
          />
          <button type="submit" className={styles.btnPrimary} disabled={searching} style={{ whiteSpace: 'nowrap' }}>
            {searching ? '…' : 'Buscar'}
          </button>
        </form>

        {feedback && !selectedUser && (
          <div className={`${styles.statusMsg} ${feedback.ok ? styles.statusMsgOk : styles.statusMsgError}`}>
            {feedback.msg}
          </div>
        )}

        {selectedUser && (
          <div className={styles.infoBox}>
            <h4>{selectedUser.nombre || selectedUser.email}</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>{selectedUser.email}</p>

            <div className={styles.formGroup} style={{ marginBottom: '12px' }}>
              <label className={styles.formLabel}>Límite de personas en el árbol</label>
              <input
                type="number"
                className={styles.formInput}
                value={limits.limite_personas}
                onChange={(e) => setLimits((l) => ({ ...l, limite_personas: parseInt(e.target.value) || 0 }))}
                min={0}
              />
            </div>

            <label className={styles.checkboxRow} style={{ marginBottom: '20px' }}>
              <input
                type="checkbox"
                checked={limits.habilitar_gedcom}
                onChange={(e) => setLimits((l) => ({ ...l, habilitar_gedcom: e.target.checked }))}
              />
              Habilitar importador / exportador GEDCOM
            </label>

            <button onClick={handleSave} className={styles.btnPrimary} disabled={saving}>
              {saving ? 'Guardando…' : 'Aplicar excepciones'}
            </button>

            {feedback && (
              <div className={`${styles.statusMsg} ${feedback.ok ? styles.statusMsgOk : styles.statusMsgError}`}>
                {feedback.msg}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
