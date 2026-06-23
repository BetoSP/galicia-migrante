-- ═══════════════════════════════════════════════════════════════
-- Migración 002 — Políticas RLS para acceso directo desde el frontend
-- Arquitectura: React → Supabase JS SDK (sin backend Node en el medio)
-- Ejecutar en Supabase SQL Editor o via script Node run-migration.js
-- ═══════════════════════════════════════════════════════════════

-- ── Habilitar RLS ────────────────────────────────────────────────
ALTER TABLE usuarios          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sitios_familiares ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas_arbol    ENABLE ROW LEVEL SECURITY;
ALTER TABLE sitios_miembros   ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividad         ENABLE ROW LEVEL SECURITY;

-- ── usuarios — solo puede ver y editar su propio registro ─────────
DROP POLICY IF EXISTS "usuarios_self_select" ON usuarios;
DROP POLICY IF EXISTS "usuarios_self_insert" ON usuarios;
DROP POLICY IF EXISTS "usuarios_self_update" ON usuarios;

CREATE POLICY "usuarios_self_select" ON usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "usuarios_self_insert" ON usuarios
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "usuarios_self_update" ON usuarios
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── sitios_familiares — solo el dueño puede ver y editar ──────────
DROP POLICY IF EXISTS "sitios_propietario_all" ON sitios_familiares;

CREATE POLICY "sitios_propietario_all" ON sitios_familiares
  FOR ALL
  USING (auth.uid() = propietario_id)
  WITH CHECK (auth.uid() = propietario_id);

-- ── personas_arbol — solo miembros del sitio pueden ver/editar ────
DROP POLICY IF EXISTS "personas_miembro_all" ON personas_arbol;

CREATE POLICY "personas_miembro_all" ON personas_arbol
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sitios_familiares sf
      WHERE sf.id = personas_arbol.sitio_id
        AND sf.propietario_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sitios_familiares sf
      WHERE sf.id = personas_arbol.sitio_id
        AND sf.propietario_id = auth.uid()
    )
  );

-- ── sitios_miembros — el dueño y el miembro propio pueden ver ─────
DROP POLICY IF EXISTS "miembros_select" ON sitios_miembros;

CREATE POLICY "miembros_select" ON sitios_miembros
  FOR SELECT USING (
    usuario_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM sitios_familiares sf
      WHERE sf.id = sitios_miembros.sitio_id
        AND sf.propietario_id = auth.uid()
    )
  );

-- ── actividad — el dueño del sitio puede ver e insertar ──────────
DROP POLICY IF EXISTS "actividad_select" ON actividad;
DROP POLICY IF EXISTS "actividad_insert" ON actividad;

CREATE POLICY "actividad_select" ON actividad
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sitios_familiares sf
      WHERE sf.id = actividad.sitio_id
        AND sf.propietario_id = auth.uid()
    )
  );

CREATE POLICY "actividad_insert" ON actividad
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sitios_familiares sf
      WHERE sf.id = actividad.sitio_id
        AND sf.propietario_id = auth.uid()
    )
  );
