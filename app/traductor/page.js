'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import styles from './traductor.module.css';

const IDIOMAS = ['gl', 'en'];
const IDIOMA_LABELS = { gl: 'Galego', en: 'English' };

export default function TraductorPage() {
  const { user, roles } = useAuth();

  // Notificaciones
  const [notifs, setNotifs] = useState([]);

  // Traducciones de interfaz
  const [interfazRows, setInterfazRows] = useState([]);

  // Estado general
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('interfaz');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIdioma, setFilterIdioma] = useState('gl');
  const [filterPendiente, setFilterPendiente] = useState(false);

  // Editor inline
  const [editingId, setEditingId] = useState(null); // "clave|idioma"
  const [editVal, setEditVal] = useState('');
  const [saving, setSaving] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);

  const isAdmin = roles.some(r => r.nombre === 'admin_general' || r.es_admin);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [notifsRes, interfazRes] = await Promise.all([
        supabase
          .from('notificaciones')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(30),
        supabase
          .from('traducciones_interfaz')
          .select('id, clave, idioma, texto_por_defecto, texto_custom, es_manual, updated_at')
          .order('clave', { ascending: true }),
      ]);

      if (notifsRes.data) {
        // Marcar cuáles el usuario ya leyó
        const { data: leidas } = await supabase
          .from('notificaciones_leidas')
          .select('notificacion_id')
          .eq('usuario_id', user.id);
        const leidasSet = new Set((leidas || []).map(l => l.notificacion_id));
        setNotifs(notifsRes.data.map(n => ({ ...n, leida: leidasSet.has(n.id) })));
      }

      if (interfazRes.data) setInterfazRows(interfazRes.data);
    } catch (err) {
      console.error('Error cargando datos del panel traductor:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Marcar notificación como leída ────────────────
  const handleMarcarLeida = async (notifId) => {
    const { error } = await supabase
      .from('notificaciones_leidas')
      .insert({ notificacion_id: notifId, usuario_id: user.id });
    if (!error) {
      setNotifs(prev => prev.map(n => n.id === notifId ? { ...n, leida: true } : n));
    }
  };

  // ── Auto-traducción vía /api/translate ───────────
  const handleAutoTraducir = async (textoBase, idioma) => {
    if (!textoBase) return;
    setAutoLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textoBase, targetLangs: [idioma] }),
      });
      const data = await res.json();
      if (data?.translations?.[idioma]) {
        setEditVal(data.translations[idioma]);
      }
    } catch (err) {
      console.error('Error auto-traduciendo:', err);
    } finally {
      setAutoLoading(false);
    }
  };

  // ── Guardar traducción manual ─────────────────────
  const handleGuardar = async (clave, idioma) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('traducciones_interfaz')
        .upsert(
          { clave, idioma, texto_custom: editVal, es_manual: true },
          { onConflict: 'clave,idioma' }
        );
      if (error) throw error;
      setEditingId(null);
      setEditVal('');
      await loadData();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Filtrado de filas de interfaz ─────────────────
  const filteredInterfaz = interfazRows.filter(row => {
    if (row.idioma !== filterIdioma) return false;
    if (filterPendiente && (row.es_manual || !row.texto_por_defecto)) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        row.clave.toLowerCase().includes(term) ||
        (row.texto_por_defecto || '').toLowerCase().includes(term) ||
        (row.texto_custom || '').toLowerCase().includes(term)
      );
    }
    return true;
  });

  const notifsNoLeidas = notifs.filter(n => !n.leida);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Panel del Traductor</h1>
        <p>Gestión de traducciones manuales del portal · Galicia Migrante</p>
      </header>

      {/* ── Notificaciones pendientes ── */}
      {notifsNoLeidas.length > 0 && (
        <div className={styles.notifBanner}>
          <h3>Avisos de desbloqueo ({notifsNoLeidas.length})</h3>
          <div className={styles.notifList}>
            {notifsNoLeidas.map(n => (
              <div key={n.id} className={styles.notifItem}>
                <div className={styles.notifMeta}>
                  <span className={styles.notifTitulo}>{n.titulo}</span>
                  <span className={styles.notifMensaje}>{n.mensaje}</span>
                  <span className={styles.notifFecha}>
                    {new Date(n.created_at).toLocaleString('es-AR')}
                  </span>
                </div>
                <button
                  className={styles.btnMarcarLeida}
                  onClick={() => handleMarcarLeida(n.id)}
                >
                  Marcar leída
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'interfaz' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('interfaz')}
        >
          Interfaz del portal
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'historial' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('historial')}
        >
          Historial de avisos
          {notifs.length > 0 && (
            <span style={{ marginLeft: '6px', background: 'rgba(212,175,55,0.2)', color: 'var(--gm-gold)', borderRadius: '10px', padding: '1px 7px', fontSize: '0.72rem', fontWeight: 700 }}>
              {notifs.length}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className={styles.spinner}>Cargando datos...</div>
      ) : (
        <>
          {/* ── TAB: Interfaz ── */}
          {activeTab === 'interfaz' && (
            <>
              <div className={styles.filters}>
                <input
                  type="text"
                  placeholder="Buscar por clave o texto..."
                  className={styles.inputSearch}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <select
                  className={styles.selectFilter}
                  value={filterIdioma}
                  onChange={e => setFilterIdioma(e.target.value)}
                >
                  {IDIOMAS.map(l => (
                    <option key={l} value={l}>{IDIOMA_LABELS[l]}</option>
                  ))}
                </select>
                <select
                  className={styles.selectFilter}
                  value={filterPendiente ? 'pendiente' : 'todas'}
                  onChange={e => setFilterPendiente(e.target.value === 'pendiente')}
                >
                  <option value="todas">Todas las claves</option>
                  <option value="pendiente">Solo sin edición manual</option>
                </select>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: '25%' }}>Clave</th>
                      <th style={{ width: '30%' }}>Español (referencia)</th>
                      <th style={{ width: '35%' }}>{IDIOMA_LABELS[filterIdioma]}</th>
                      <th style={{ width: '10%' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInterfaz.length === 0 ? (
                      <tr>
                        <td colSpan={4} className={styles.empty}>
                          No hay claves para mostrar con los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      filteredInterfaz.map(row => {
                        const editKey = `${row.clave}|${row.idioma}`;
                        const isEditing = editingId === editKey;
                        const displayedText = row.texto_custom || row.texto_por_defecto || '';
                        const esBase = interfazRows.find(r => r.clave === row.clave && r.idioma === 'es');

                        return (
                          <React.Fragment key={editKey}>
                            <tr className={isEditing ? styles.editorRow : ''}>
                              <td>
                                <span className={styles.claveCode}>{row.clave}</span>
                              </td>
                              <td style={{ color: 'rgba(255,255,255,0.55)', lineHeight: '1.4' }}>
                                {esBase?.texto_por_defecto || esBase?.texto_custom || '—'}
                              </td>
                              <td style={{ lineHeight: '1.4' }}>
                                {isEditing ? (
                                  <div className={styles.editorBlock}>
                                    <span className={styles.editorLabel}>{IDIOMA_LABELS[row.idioma]}</span>
                                    <textarea
                                      className={styles.textarea}
                                      value={editVal}
                                      onChange={e => setEditVal(e.target.value)}
                                      autoFocus
                                    />
                                    <div className={styles.editorActions}>
                                      <button
                                        className={styles.btnGuardar}
                                        onClick={() => handleGuardar(row.clave, row.idioma)}
                                        disabled={saving}
                                      >
                                        {saving ? 'Guardando...' : 'Guardar'}
                                      </button>
                                      <button
                                        className={styles.btnAutotraducir}
                                        onClick={() => handleAutoTraducir(esBase?.texto_por_defecto || '', row.idioma)}
                                        disabled={autoLoading}
                                      >
                                        {autoLoading ? '...' : 'Auto-traducir'}
                                      </button>
                                      <button
                                        className={styles.btnCancelar}
                                        onClick={() => { setEditingId(null); setEditVal(''); }}
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {displayedText || <span style={{ color: 'rgba(255,255,255,0.25)' }}>Sin traducción</span>}
                                    {row.es_manual && <span className={styles.manualBadge}>MANUAL</span>}
                                  </>
                                )}
                              </td>
                              <td>
                                {!isEditing && (
                                  <button
                                    className={styles.btnEditar}
                                    onClick={() => {
                                      setEditingId(editKey);
                                      setEditVal(displayedText);
                                    }}
                                  >
                                    Editar
                                  </button>
                                )}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── TAB: Historial de avisos ── */}
          {activeTab === 'historial' && (
            <div className={styles.notifList}>
              {notifs.length === 0 ? (
                <div className={styles.empty}>No hay avisos registrados.</div>
              ) : (
                notifs.map(n => (
                  <div key={n.id} className={`${styles.notifItem} ${n.leida ? styles.leida : ''}`}>
                    <div className={styles.notifMeta}>
                      <span className={styles.notifTitulo}>{n.titulo}</span>
                      <span className={styles.notifMensaje}>{n.mensaje}</span>
                      <span className={styles.notifFecha}>
                        {new Date(n.created_at).toLocaleString('es-AR')}
                        {n.leida && ' · Leída'}
                      </span>
                    </div>
                    {!n.leida && (
                      <button
                        className={styles.btnMarcarLeida}
                        onClick={() => handleMarcarLeida(n.id)}
                      >
                        Marcar leída
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
