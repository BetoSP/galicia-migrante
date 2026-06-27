'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import styles from './admin.module.css';

export default function AdminPage() {
  const { user, roles } = useAuth();
  const [activeTab, setActiveTab] = useState('blog');
  const [loading, setLoading] = useState(true);

  // Tab 1: Moderación de Blog
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Tab 2: Mini-App de i18n
  const [traducciones, setTraducciones] = useState([]);
  const [searchI18n, setSearchI18n] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [editValEs, setEditValEs] = useState('');
  const [editValGl, setEditValGl] = useState('');
  const [editValEn, setEditValEn] = useState('');

  // Tab 3: Delegación
  const [delegationEmail, setDelegationEmail] = useState('');
  const [delegationStatus, setDelegationStatus] = useState('');

  // Tab 4: Membresías y Planes
  const [planes, setPlanes] = useState([]);
  const [searchUserEmail, setSearchUserEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLimits, setUserLimits] = useState({
    limite_personas: 100,
    habilitar_gedcom: true,
  });

  // Tab 5: Mi Asociación (CMS)
  const [myAssociations, setMyAssociations] = useState([]);
  const [selectedAssocId, setSelectedAssocId] = useState('');
  const [originalAssocData, setOriginalAssocData] = useState(null);
  const [assocDetails, setAssocDetails] = useState({
    nombre: '',
    fundacion: 1980,
    descripcion_es: '',
    descripcion_gl: '',
    descripcion_en: '',
    descripcion_manual_gl: false,
    descripcion_manual_en: false,
    historia_es: '',
    historia_gl: '',
    historia_en: '',
    historia_manual_gl: false,
    historia_manual_en: false,
    finalidades_es: '',
    finalidades_gl: '',
    finalidades_en: '',
    finalidades_manual_gl: false,
    finalidades_manual_en: false,
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: 'Argentina',
    logo_url: '',
    banner_url: ''
  });
  const [assocDirectivos, setAssocDirectivos] = useState([]);
  const [newDirectivo, setNewDirectivo] = useState({ nombre: '', cargo: '', orden: 5 });
  const [assocNoticias, setAssocNoticias] = useState([]);
  const [newNoticia, setNewNoticia] = useState({ titulo_es: '', contenido_es: '', publicado: true });

  const { toast, confirm } = useToast();
  const isGeneralAdmin = roles.some(r => r.es_admin || r.nombre === 'admin_general');

  useEffect(() => {
    loadAllData();
  }, [user, roles]);

  const loadAllData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Cargar posts del blog
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (postsData) setPosts(postsData);

      // 2. Cargar traducciones de interfaz
      const { data: tradData } = await supabase
        .from('traducciones_interfaz')
        .select('id, clave, idioma, texto_por_defecto, texto_custom, es_manual')
        .order('clave', { ascending: true });
      if (tradData) setTraducciones(tradData);

      // 3. Cargar catálogo de planes
      const { data: planesData } = await supabase
        .from('planes')
        .select('*');
      if (planesData) setPlanes(planesData);

      // 4. Cargar asociaciones gestionables
      let assocQuery = supabase.from('asociaciones').select('*');
      if (!isGeneralAdmin) {
        // Solo asociaciones administradas por el usuario actual
        assocQuery = assocQuery.eq('admin_id', user.id);
      }
      
      const { data: assocList } = await assocQuery;
      if (assocList && assocList.length > 0) {
        setMyAssociations(assocList);
        setSelectedAssocId(assocList[0].id);
        loadAssocSubDetails(assocList[0].id, assocList[0]);
      }

    } catch (err) {
      console.warn('Error loading admin data: ', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAssocSubDetails = async (assocId, baseObj = null) => {
    try {
      let base = baseObj;
      if (!base) {
        const { data } = await supabase
          .from('asociaciones')
          .select('*')
          .eq('id', assocId)
          .single();
        base = data;
      }

      if (base) {
        setOriginalAssocData(base);
        setAssocDetails({
          nombre: base.nombre || '',
          fundacion: base.fundacion || 1980,
          descripcion_es: base.descripcion_es || '',
          descripcion_gl: base.descripcion_gl || '',
          descripcion_en: base.descripcion_en || '',
          descripcion_manual_gl: base.descripcion_manual_gl || false,
          descripcion_manual_en: base.descripcion_manual_en || false,
          historia_es: base.historia_es || '',
          historia_gl: base.historia_gl || '',
          historia_en: base.historia_en || '',
          historia_manual_gl: base.historia_manual_gl || false,
          historia_manual_en: base.historia_manual_en || false,
          finalidades_es: base.finalidades_es || '',
          finalidades_gl: base.finalidades_gl || '',
          finalidades_en: base.finalidades_en || '',
          finalidades_manual_gl: base.finalidades_manual_gl || false,
          finalidades_manual_en: base.finalidades_manual_en || false,
          email: base.email || '',
          telefono: base.telefono || '',
          direccion: base.direccion || '',
          ciudad: base.ciudad || '',
          pais: base.pais || 'Argentina',
          logo_url: base.logo_url || '',
          banner_url: base.banner_url || ''
        });
      }

      // Cargar directivos
      const { data: dir } = await supabase
        .from('asociaciones_directivos')
        .select('*')
        .eq('asociacion_id', assocId)
        .order('orden', { ascending: true });
      if (dir) setAssocDirectivos(dir);

      // Cargar noticias
      const { data: not } = await supabase
        .from('asociaciones_noticias')
        .select('*')
        .eq('asociacion_id', assocId)
        .order('created_at', { ascending: false });
      if (not) setAssocNoticias(not);

    } catch (err) {
      console.warn('Error loading sub details of association:', err);
    }
  };

  useEffect(() => {
    if (selectedAssocId) {
      loadAssocSubDetails(selectedAssocId);
    }
  }, [selectedAssocId]);

  // --- ACCIONES BLOG ---
  const handleUpdatePostStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ estado: status })
        .eq('id', id);

      if (error) throw error;
      toast(`Post actualizado a: ${status}`, { type: 'success' });
      setPosts(posts.map(p => p.id === id ? { ...p, estado: status } : p));
    } catch (err) {
      toast('Error: ' + err.message, { type: 'error' });
    }
  };

  // --- ACCIONES I18N ---
  // Guarda una traducción editada manualmente en traducciones_interfaz.
  // gl/en van a texto_custom con es_manual=true (protección humana).
  // es va a texto_por_defecto (es el texto canónico de referencia).
  const handleSaveTranslation = async (key) => {
    try {
      const updates = [
        { idioma: 'es', texto_por_defecto: editValEs, is_default_change: true },
        { idioma: 'gl', texto_custom: editValGl, es_manual: true },
        { idioma: 'en', texto_custom: editValEn, es_manual: true },
      ];

      for (const update of updates) {
        const { idioma, is_default_change, ...fields } = update;
        const payload = is_default_change
          ? { clave: key, idioma, texto_por_defecto: fields.texto_por_defecto }
          : { clave: key, idioma, texto_custom: fields.texto_custom, es_manual: fields.es_manual };

        const { error } = await supabase
          .from('traducciones_interfaz')
          .upsert(payload, { onConflict: 'clave,idioma' });
        if (error) throw error;
      }

      toast('Traducción guardada.', { type: 'success' });
      setEditingKey(null);
      loadAllData();
    } catch (err) {
      toast('Error al guardar: ' + err.message, { type: 'error' });
    }
  };

  // --- ACCIONES DELEGACIÓN ---
  const handleDelegarTraductor = async (e) => {
    e.preventDefault();
    setDelegationStatus('Procesando...');
    try {
      const { data: userProfile } = await supabase.from('usuarios').select('id').eq('email', delegationEmail).maybeSingle();
      if (!userProfile) throw new Error('Usuario no encontrado.');

      let { data: rol } = await supabase.from('roles').select('id').eq('nombre', 'traductor_delegado').maybeSingle();
      if (!rol) {
        const { data: newRol } = await supabase.from('roles').insert({ nombre: 'traductor_delegado', descripcion: 'Traductor delegado', es_admin: false }).select().single();
        rol = newRol;
      }

      await supabase.from('usuarios_roles').upsert({ usuario_id: userProfile.id, rol_id: rol.id });
      setDelegationStatus(`✓ Rol asignado a ${delegationEmail}`);
      setDelegationEmail('');
    } catch (err) {
      setDelegationStatus(`❌ Error: ${err.message}`);
    }
  };

  // --- ACCIONES EXCEPCIONES ---
  const handleSearchUser = async (e) => {
    e.preventDefault();
    try {
      const { data: userProfile } = await supabase.from('usuarios').select('*').eq('email', searchUserEmail).maybeSingle();
      if (!userProfile) {
        toast('Usuario no encontrado.', { type: 'warning' });
        return;
      }
      setSelectedUser(userProfile);
      const { data: features } = await supabase.from('usuario_features').select('*').eq('usuario_id', userProfile.id);
      const limits = { limite_personas: 50, habilitar_gedcom: false };
      if (features) {
        features.forEach(f => {
          if (f.feature_key === 'limite_personas') limits.limite_personas = f.limite_valor;
          if (f.feature_key === 'gedcom') limits.habilitar_gedcom = f.habilitado;
        });
      }
      setUserLimits(limits);
    } catch (err) {
      toast(err.message, { type: 'error' });
    }
  };

  const handleSaveUserException = async () => {
    if (!selectedUser) return;
    try {
      await supabase.from('usuario_features').upsert({ usuario_id: selectedUser.id, feature_key: 'limite_personas', limite_valor: userLimits.limite_personas, habilitado: true }, { onConflict: 'usuario_id, feature_key' });
      await supabase.from('usuario_features').upsert({ usuario_id: selectedUser.id, feature_key: 'gedcom', habilitado: userLimits.habilitar_gedcom }, { onConflict: 'usuario_id, feature_key' });
      toast('Excepciones aplicadas.', { type: 'success' });
    } catch (err) {
      toast(err.message, { type: 'error' });
    }
  };

  // Auxiliar para llamar a la API de traducción
  const getAutoTranslation = async (text, lang) => {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLangs: [lang] })
      });
      const data = await res.json();
      return data?.translations?.[lang] || '';
    } catch {
      return '';
    }
  };

  // --- ACCIONES CMS ASOCIACIÓN ---
  const handleSaveAssocDetails = async (e) => {
    e.preventDefault();
    if (!selectedAssocId || !originalAssocData) return;

    try {
      // 1. Clonar estado local para preparar actualización
      const updatedData = { ...assocDetails };

      // 2. Determinar si los campos en gallego/inglés han sido sobreescritos manualmente
      // Si el valor ingresado es diferente de la versión original y diferente de lo vacío,
      // y además es diferente de la autotraducción que generaría el sistema, se marca como manual.
      
      const checkManualFlag = async (fieldBase, lang) => {
        const currentVal = updatedData[`${fieldBase}_${lang}`] || '';
        const prevVal = originalAssocData[`${fieldBase}_${lang}`] || '';
        
        // Si el usuario modificó manualmente el campo y no está vacío
        if (currentVal && currentVal !== prevVal) {
          updatedData[`${fieldBase}_manual_${lang}`] = true;
        }
      };

      await checkManualFlag('descripcion', 'gl');
      await checkManualFlag('descripcion', 'en');
      await checkManualFlag('historia', 'gl');
      await checkManualFlag('historia', 'en');
      await checkManualFlag('finalidades', 'gl');
      await checkManualFlag('finalidades', 'en');

      // 3. Traducir automáticamente los campos no modificados manualmente si el original cambió
      const autoTranslateFieldIfClean = async (fieldBase, lang) => {
        const isManual = updatedData[`${fieldBase}_manual_${lang}`];
        const originalText = updatedData[`${fieldBase}_es`] || '';
        const prevOriginalText = originalAssocData[`${fieldBase}_es`] || '';

        // Si el texto en español cambió y NO está marcado como manual, forzamos traducción del sistema
        if (originalText && (!isManual || originalText !== prevOriginalText)) {
          const autoTranslated = await getAutoTranslation(originalText, lang);
          if (autoTranslated) {
            updatedData[`${fieldBase}_${lang}`] = autoTranslated;
            // Si el original cambió, el trigger de BD se encarga de resetear manual a false,
            // pero lo aseguramos también en el envío.
            updatedData[`${fieldBase}_manual_${lang}`] = false;
          }
        }
      };

      await autoTranslateFieldIfClean('descripcion', 'gl');
      await autoTranslateFieldIfClean('descripcion', 'en');
      await autoTranslateFieldIfClean('historia', 'gl');
      await autoTranslateFieldIfClean('historia', 'en');
      await autoTranslateFieldIfClean('finalidades', 'gl');
      await autoTranslateFieldIfClean('finalidades', 'en');

      const { error } = await supabase
        .from('asociaciones')
        .update(updatedData)
        .eq('id', selectedAssocId);

      if (error) throw error;
      toast('Perfil de asociación guardado.', { type: 'success' });
      loadAssocSubDetails(selectedAssocId);
    } catch (err) {
      toast('Error al guardar perfil: ' + err.message, { type: 'error' });
    }
  };

  const handleAddDirectivo = async (e) => {
    e.preventDefault();
    if (!selectedAssocId || !newDirectivo.nombre || !newDirectivo.cargo) return;
    try {
      const { error } = await supabase
        .from('asociaciones_directivos')
        .insert({
          asociacion_id: selectedAssocId,
          nombre: newDirectivo.nombre,
          cargo: newDirectivo.cargo,
          orden: parseInt(newDirectivo.orden) || 5
        });

      if (error) throw error;
      toast('Directivo añadido.', { type: 'success' });
      setNewDirectivo({ nombre: '', cargo: '', orden: 5 });
      loadAssocSubDetails(selectedAssocId);
    } catch (err) {
      toast('Error: ' + err.message, { type: 'error' });
    }
  };

  const handleDeleteDirectivo = async (dirId) => {
    const ok = await confirm('¿Estás seguro de eliminar este directivo?');
    if (!ok) return;
    try {
      const { error } = await supabase
        .from('asociaciones_directivos')
        .delete()
        .eq('id', dirId);

      if (error) throw error;
      toast('Directivo eliminado.', { type: 'success' });
      loadAssocSubDetails(selectedAssocId);
    } catch (err) {
      toast('Error: ' + err.message, { type: 'error' });
    }
  };

  const handleAddNoticia = async (e) => {
    e.preventDefault();
    if (!selectedAssocId || !newNoticia.titulo_es || !newNoticia.contenido_es) return;
    try {
      const { error } = await supabase
        .from('asociaciones_noticias')
        .insert({
          asociacion_id: selectedAssocId,
          titulo_es: newNoticia.titulo_es,
          contenido_es: newNoticia.contenido_es,
          publicado: newNoticia.publicado
        });

      if (error) throw error;
      toast('Noticia publicada.', { type: 'success' });
      setNewNoticia({ titulo_es: '', contenido_es: '', publicado: true });
      loadAssocSubDetails(selectedAssocId);
    } catch (err) {
      toast('Error: ' + err.message, { type: 'error' });
    }
  };

  const handleDeleteNoticia = async (notId) => {
    const ok = await confirm('¿Estás seguro de eliminar esta noticia?');
    if (!ok) return;
    try {
      const { error } = await supabase
        .from('asociaciones_noticias')
        .delete()
        .eq('id', notId);

      if (error) throw error;
      toast('Noticia eliminada.', { type: 'success' });
      loadAssocSubDetails(selectedAssocId);
    } catch (err) {
      toast('Error: ' + err.message, { type: 'error' });
    }
  };

  // Agrupar filas de traducciones_interfaz por clave.
  // Cada fila es una (clave, idioma). Mostramos texto_custom si existe, si no texto_por_defecto.
  const groupedTranslations = traducciones.reduce((acc, t) => {
    if (!acc[t.clave]) acc[t.clave] = { clave: t.clave, es: '', gl: '', en: '', manual: { gl: false, en: false } };
    const displayed = t.texto_custom || t.texto_por_defecto || '';
    acc[t.clave][t.idioma] = displayed;
    if (t.idioma === 'gl' || t.idioma === 'en') {
      acc[t.clave].manual[t.idioma] = t.es_manual || false;
    }
    return acc;
  }, {});

  const filteredI18n = Object.values(groupedTranslations).filter(t =>
    t.clave.toLowerCase().includes(searchI18n.toLowerCase()) ||
    t.es.toLowerCase().includes(searchI18n.toLowerCase())
  );

  return (
    <div className={styles.adminPage}>
      <header className={styles.adminHeader}>
        <h1>Panel de Administración</h1>
        <p>Gestiona contenidos, traducciones, asociaciones y permisos del Portal Galicia Migrante</p>
      </header>

      {/* Tabs Menu */}
      <div className={styles.adminTabs}>
        <button onClick={() => setActiveTab('blog')} className={`${styles.tabLink} ${activeTab === 'blog' ? styles.tabLinkActive : ''}`}>
          📰 Moderación de Blog
        </button>
        <button onClick={() => setActiveTab('i18n')} className={`${styles.tabLink} ${activeTab === 'i18n' ? styles.tabLinkActive : ''}`}>
          🌐 i18n Customizer
        </button>
        <button onClick={() => setActiveTab('delegation')} className={`${styles.tabLink} ${activeTab === 'delegation' ? styles.tabLinkActive : ''}`}>
          🔑 Delegar i18n
        </button>
        {isGeneralAdmin && (
          <button onClick={() => setActiveTab('memberships')} className={`${styles.tabLink} ${activeTab === 'memberships' ? styles.tabLinkActive : ''}`}>
            👑 Planes y Excepciones
          </button>
        )}
        {(myAssociations.length > 0) && (
          <button onClick={() => setActiveTab('cms')} className={`${styles.tabLink} ${activeTab === 'cms' ? styles.tabLinkActive : ''}`}>
            🏛️ Mi Asociación (CMS)
          </button>
        )}
      </div>

      <div className={styles.tabContent}>
        {loading ? (
          <div className={styles.spinner}>Cargando datos administrativos...</div>
        ) : (
          <>
            {/* TABS DE MODERACIÓN DE BLOG */}
            {activeTab === 'blog' && (
              <div className={styles.sectionPanel}>
                <h2>Moderación de Artículos del Blog</h2>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Autor</th>
                      <th>Categoría</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: 'center' }}>No se encontraron posts.</td></tr>
                    ) : (
                      posts.map(post => (
                        <tr key={post.id}>
                          <td>{post.titulo}</td>
                          <td>{post.autor_nombre || 'Desconocido'}</td>
                          <td>{post.categoria}</td>
                          <td><span className={`${styles.statusBadge} ${styles['status_' + post.estado]}`}>{post.estado}</span></td>
                          <td style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => setSelectedPost(post)} className={styles.btnTable}>👁️ Ver</button>
                            <button onClick={() => handleUpdatePostStatus(post.id, 'publicado')} className={styles.btnTableApprove} disabled={post.estado === 'publicado'}>Aprobar</button>
                            <button onClick={() => handleUpdatePostStatus(post.id, 'bloqueado')} className={styles.btnTableBlock} disabled={post.estado === 'bloqueado'}>Bloquear</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB MINI APP DE TRADUCCIÓN */}
            {activeTab === 'i18n' && (
              <div className={styles.sectionPanel}>
                <h2>Mini-App de i18n Customizer</h2>
                <div style={{ margin: '16px 0' }}>
                  <input type="text" placeholder="Buscar clave o texto en Español..." className={styles.inputSearch} value={searchI18n} onChange={(e) => setSearchI18n(e.target.value)} />
                </div>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Clave</th>
                      <th>Español</th>
                      <th>Galego</th>
                      <th>English</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredI18n.map(t => (
                      <tr key={t.clave}>
                        <td><code>{t.clave}</code></td>
                        <td>{editingKey === t.clave ? <input value={editValEs} onChange={(e) => setEditValEs(e.target.value)} className={styles.inputTable} /> : t.es}</td>
                        <td>
                          {editingKey === t.clave
                            ? <input value={editValGl} onChange={(e) => setEditValGl(e.target.value)} className={styles.inputTable} />
                            : <span>{t.gl}{t.manual.gl && <span title="Edición manual — protegida del automático" style={{ marginLeft: '6px', color: 'var(--gm-gold)', fontSize: '10px', fontWeight: 700 }}>MANUAL</span>}</span>
                          }
                        </td>
                        <td>
                          {editingKey === t.clave
                            ? <input value={editValEn} onChange={(e) => setEditValEn(e.target.value)} className={styles.inputTable} />
                            : <span>{t.en}{t.manual.en && <span title="Edición manual — protegida del automático" style={{ marginLeft: '6px', color: 'var(--gm-gold)', fontSize: '10px', fontWeight: 700 }}>MANUAL</span>}</span>
                          }
                        </td>
                        <td>
                          {editingKey === t.clave ? (
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button onClick={() => handleSaveTranslation(t.clave)} className={styles.btnTableApprove}>Guardar</button>
                              <button onClick={() => setEditingKey(null)} className={styles.btnTable}>Cancelar</button>
                            </div>
                          ) : (
                            <button onClick={() => { setEditingKey(t.clave); setEditValEs(t.es); setEditValGl(t.gl); setEditValEn(t.en); }} className={styles.btnTable}>✏️ Editar</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB DELEGACIÓN */}
            {activeTab === 'delegation' && (
              <div className={styles.sectionPanel} style={{ maxWidth: '600px' }}>
                <h2>Delegar Permisos de Traducción</h2>
                <form onSubmit={handleDelegarTraductor} className={styles.formDelegation}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email del Colaborador</label>
                    <input type="email" className={styles.input} value={delegationEmail} onChange={(e) => setDelegationEmail(e.target.value)} placeholder="colaborador@ejemplo.com" required />
                  </div>
                  <button type="submit" className={styles.btnSubmit}>Asignar Rol de Traductor</button>
                </form>
                {delegationStatus && <div style={{ marginTop: '20px', padding: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }}>{delegationStatus}</div>}
              </div>
            )}

            {/* TAB MEMBRESÍAS Y EXCEPCIONES */}
            {activeTab === 'memberships' && isGeneralAdmin && (
              <div className={styles.sectionPanel}>
                <h2>Consola de Membresías y Límites</h2>
                <div className={styles.adminGrid}>
                  <div>
                    <h3>Planes Disponibles</h3>
                    <table className={styles.adminTable} style={{ marginTop: '10px' }}>
                      <thead>
                        <tr><th>Nombre</th><th>Precio (ARS)</th><th>Límite Árbol</th><th>Miembros</th></tr>
                      </thead>
                      <tbody>
                        {planes.map(p => (
                          <tr key={p.id}>
                            <td><strong>{p.nombre}</strong></td>
                            <td>${p.precio_ars}</td>
                            <td>{p.limite_personas === 0 ? 'Sin límite' : `${p.limite_personas} personas`}</td>
                            <td>{p.limite_miembros}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h3>Particular Conditions (Excepciones)</h3>
                    <form onSubmit={handleSearchUser} style={{ display: 'flex', gap: '8px', margin: '16px 0' }}>
                      <input type="email" placeholder="usuario@ejemplo.com" value={searchUserEmail} onChange={(e) => setSearchUserEmail(e.target.value)} className={styles.input} style={{ flex: 1 }} required />
                      <button type="submit" className={styles.btnSubmit} style={{ margin: 0, width: 'auto' }}>Buscar</button>
                    </form>
                    {selectedUser && (
                      <div className={styles.userOverrideBox}>
                        <h4>Modificar límites para: {selectedUser.email}</h4>
                        <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                          <label className={styles.label}>Límite de personas en el árbol</label>
                          <input type="number" className={styles.input} value={userLimits.limite_personas} onChange={(e) => setUserLimits({ ...userLimits, limite_personas: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                          <label className={styles.checkboxLabel}>
                            <input type="checkbox" checked={userLimits.habilitar_gedcom} onChange={(e) => setUserLimits({ ...userLimits, habilitar_gedcom: e.target.checked })} />
                            <span>Habilitar Importador / Exportador GEDCOM</span>
                          </label>
                        </div>
                        <button onClick={handleSaveUserException} className={styles.btnSubmit}>Guardar Excepciones</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB MI ASOCIACIÓN (CMS COMPLETO) */}
            {activeTab === 'cms' && myAssociations.length > 0 && (
              <div className={styles.sectionPanel}>
                <h2>Gestión de Micrositio (CMS de la Asociación)</h2>
                <p>Todos los contenidos del micrositio de tu asociación son 100% editables en tiempo real aquí.</p>

                {isGeneralAdmin && myAssociations.length > 1 && (
                  <div className={styles.formGroup} style={{ marginBottom: '24px', maxWidth: '300px' }}>
                    <label className={styles.label}>Seleccionar Asociación a Administrar:</label>
                    <select 
                      value={selectedAssocId} 
                      onChange={(e) => setSelectedAssocId(e.target.value)}
                      className={styles.input}
                    >
                      {myAssociations.map(a => (
                        <option key={a.id} value={a.id}>{a.nombre}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className={styles.adminGrid}>
                  
                  {/* Detalles Básicos y Perfil */}
                  <div>
                    <h3>Perfil y Contactos</h3>
                    <form onSubmit={handleSaveAssocDetails} className={styles.formDelegation} style={{ marginTop: '16px' }}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Nombre de la Asociación</label>
                        <input type="text" className={styles.input} value={assocDetails.nombre} onChange={(e) => setAssocDetails({ ...assocDetails, nombre: e.target.value })} required />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Año de Fundación</label>
                        <input type="number" className={styles.input} value={assocDetails.fundacion} onChange={(e) => setAssocDetails({ ...assocDetails, fundacion: parseInt(e.target.value) || 1980 })} required />
                      </div>

                      {/* Descripción de Bienvenida */}
                      <div className={styles.formGroup} style={{ borderLeft: '3px solid var(--gm-gold)', paddingLeft: '12px', margin: '12px 0' }}>
                        <label className={styles.label}>Descripción de Bienvenida [Español]</label>
                        <textarea className={styles.input} style={{ minHeight: '80px' }} value={assocDetails.descripcion_es} onChange={(e) => setAssocDetails({ ...assocDetails, descripcion_es: e.target.value })} required />
                        <label className={styles.label} style={{ marginTop: '8px' }}>Descripción de Bienvenida [Galego]</label>
                        <textarea className={styles.input} style={{ minHeight: '80px' }} value={assocDetails.descripcion_gl} onChange={(e) => setAssocDetails({ ...assocDetails, descripcion_gl: e.target.value })} placeholder="Traducción ao galego..." />
                        <label className={styles.label} style={{ marginTop: '8px' }}>Descripción de Bienvenida [English]</label>
                        <textarea className={styles.input} style={{ minHeight: '80px' }} value={assocDetails.descripcion_en} onChange={(e) => setAssocDetails({ ...assocDetails, descripcion_en: e.target.value })} placeholder="English translation..." />
                      </div>

                      {/* Nuestra Historia */}
                      <div className={styles.formGroup} style={{ borderLeft: '3px solid #2ec4b6', paddingLeft: '12px', margin: '12px 0' }}>
                        <label className={styles.label}>Nuestra Historia [Español]</label>
                        <textarea className={styles.input} style={{ minHeight: '100px' }} value={assocDetails.historia_es} onChange={(e) => setAssocDetails({ ...assocDetails, historia_es: e.target.value })} />
                        <label className={styles.label} style={{ marginTop: '8px' }}>Nuestra Historia [Galego]</label>
                        <textarea className={styles.input} style={{ minHeight: '100px' }} value={assocDetails.historia_gl} onChange={(e) => setAssocDetails({ ...assocDetails, historia_gl: e.target.value })} placeholder="Traducción ao galego..." />
                        <label className={styles.label} style={{ marginTop: '8px' }}>Nuestra Historia [English]</label>
                        <textarea className={styles.input} style={{ minHeight: '100px' }} value={assocDetails.historia_en} onChange={(e) => setAssocDetails({ ...assocDetails, historia_en: e.target.value })} placeholder="English translation..." />
                      </div>

                      {/* Finalidades y Objetivos */}
                      <div className={styles.formGroup} style={{ borderLeft: '3px solid #4a90b8', paddingLeft: '12px', margin: '12px 0' }}>
                        <label className={styles.label}>Finalidades y Objetivos [Español]</label>
                        <textarea className={styles.input} style={{ minHeight: '80px' }} value={assocDetails.finalidades_es} onChange={(e) => setAssocDetails({ ...assocDetails, finalidades_es: e.target.value })} />
                        <label className={styles.label} style={{ marginTop: '8px' }}>Finalidades y Objetivos [Galego]</label>
                        <textarea className={styles.input} style={{ minHeight: '80px' }} value={assocDetails.finalidades_gl} onChange={(e) => setAssocDetails({ ...assocDetails, finalidades_gl: e.target.value })} placeholder="Traducción ao galego..." />
                        <label className={styles.label} style={{ marginTop: '8px' }}>Finalidades y Objetivos [English]</label>
                        <textarea className={styles.input} style={{ minHeight: '80px' }} value={assocDetails.finalidades_en} onChange={(e) => setAssocDetails({ ...assocDetails, finalidades_en: e.target.value })} placeholder="English translation..." />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>Email de Contacto</label>
                        <input type="email" className={styles.input} value={assocDetails.email} onChange={(e) => setAssocDetails({ ...assocDetails, email: e.target.value })} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Teléfono</label>
                        <input type="text" className={styles.input} value={assocDetails.telefono} onChange={(e) => setAssocDetails({ ...assocDetails, telefono: e.target.value })} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Dirección</label>
                        <input type="text" className={styles.input} value={assocDetails.direccion} onChange={(e) => setAssocDetails({ ...assocDetails, direccion: e.target.value })} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Logotipo URL</label>
                        <input type="text" className={styles.input} value={assocDetails.logo_url} onChange={(e) => setAssocDetails({ ...assocDetails, logo_url: e.target.value })} placeholder="https://..." />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Banner de Cabecera URL</label>
                        <input type="text" className={styles.input} value={assocDetails.banner_url} onChange={(e) => setAssocDetails({ ...assocDetails, banner_url: e.target.value })} placeholder="https://..." />
                      </div>
                      
                      <button type="submit" className={styles.btnSubmit}>✓ Guardar Perfil de Asociación</button>
                    </form>
                  </div>

                  {/* directivos y Noticias */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* Sección Directivos */}
                    <div className={styles.userOverrideBox}>
                      <h3>Comisión Directiva</h3>
                      
                      <form onSubmit={handleAddDirectivo} style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
                        <input type="text" placeholder="Nombre completo" className={styles.input} value={newDirectivo.nombre} onChange={(e) => setNewDirectivo({ ...newDirectivo, nombre: e.target.value })} required />
                        <input type="text" placeholder="Cargo (ej: Presidente, Tesorero)" className={styles.input} value={newDirectivo.cargo} onChange={(e) => setNewDirectivo({ ...newDirectivo, cargo: e.target.value })} required />
                        <button type="submit" className={styles.btnSubmit}>+ Añadir Miembro</button>
                      </form>

                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {assocDirectivos.map((d) => (
                          <li key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.15)', padding: '10px 14px', borderRadius: '4px', fontSize: '13px' }}>
                            <div><strong>{d.nombre}</strong> — <span style={{ color: 'var(--gm-gold)' }}>{d.cargo}</span></div>
                            <button onClick={() => handleDeleteDirectivo(d.id)} className={styles.btnTableBlock}>Eliminar</button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sección Noticias / Actividades */}
                    <div className={styles.userOverrideBox}>
                      <h3>Novedades y Anuncios</h3>

                      <form onSubmit={handleAddNoticia} style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
                        <input type="text" placeholder="Título del anuncio" className={styles.input} value={newNoticia.titulo_es} onChange={(e) => setNewNoticia({ ...newNoticia, titulo_es: e.target.value })} required />
                        <textarea placeholder="Contenido o detalles del anuncio..." className={styles.input} style={{ minHeight: '80px' }} value={newNoticia.contenido_es} onChange={(e) => setNewNoticia({ ...newNoticia, contenido_es: e.target.value })} required />
                        <button type="submit" className={styles.btnSubmit}>+ Publicar Anuncio</button>
                      </form>

                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {assocNoticias.map((n) => (
                          <li key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0,0,0,0.15)', padding: '12px 14px', borderRadius: '4px', fontSize: '13px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <strong>{n.titulo_es}</strong>
                              <button onClick={() => handleDeleteNoticia(n.id)} className={styles.btnTableBlock}>Eliminar</button>
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineText: '1.4' }}>{n.contenido_es.substring(0, 100)}...</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL DE PREVISUALIZACIÓN BLOG */}
      {selectedPost && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button onClick={() => setSelectedPost(null)} className={styles.closeBtn}>×</button>
            <h2 className={styles.modalTitle}>{selectedPost.titulo}</h2>
            <p className={styles.modalSubtitle}>Autor: {selectedPost.autor_nombre} · Categoría: {selectedPost.categoria}</p>
            <div className={styles.postBodyPreview}>
              <strong>Extracto:</strong>
              <p>{selectedPost.extracto}</p>
              <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />
              <strong>Contenido:</strong>
              <p style={{ whiteSpace: 'pre-wrap' }}>{selectedPost.contenido}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button onClick={() => handleUpdatePostStatus(selectedPost.id, 'publicado')} className={styles.btnSubmit}>✓ Aprobar Publicación</button>
              <button onClick={() => handleUpdatePostStatus(selectedPost.id, 'bloqueado')} className={styles.btnLogout}>⚠ Bloquear Contenido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
