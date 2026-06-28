'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from '@/app/admin/components/admin.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function DelegacionForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // { ok, msg }
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const { data: userProfile } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (!userProfile) throw new Error('No se encontró un usuario con ese email.');

      let { data: rol } = await supabase
        .from('roles')
        .select('id')
        .eq('nombre', 'traductor_delegado')
        .maybeSingle();

      if (!rol) {
        const { data: newRol, error } = await supabase
          .from('roles')
          .insert({ nombre: 'traductor_delegado', descripcion: 'Traductor delegado de interfaz', es_admin: false })
          .select()
          .single();
        if (error) throw error;
        rol = newRol;
      }

      const { error } = await supabase
        .from('usuarios_roles')
        .upsert({ usuario_id: userProfile.id, rol_id: rol.id }, { onConflict: 'usuario_id,rol_id' });
      if (error) throw error;

      setStatus({ ok: true, msg: `Rol de Traductor Delegado asignado a ${email}.` });
      setEmail('');
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.sectionCard} style={{ maxWidth: '520px' }}>
      <h2>Asignar Traductor Delegado</h2>
      <p>El colaborador podrá editar textos de interfaz pero no tendrá acceso a moderación ni configuración del sistema.</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email del colaborador</label>
          <input
            type="email"
            className={styles.formInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colaborador@ejemplo.com"
            required
          />
        </div>
        <div className={styles.actionRow}>
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Procesando…' : 'Asignar rol'}
          </button>
        </div>
      </form>

      {status && (
        <div className={`${styles.statusMsg} ${status.ok ? styles.statusMsgOk : styles.statusMsgError}`}>
          {status.msg}
        </div>
      )}
    </div>
  );
}
