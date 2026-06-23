-- ═══════════════════════════════════════════════════════════════
-- Migración 008 — Admin RLS + seed de roles + asignación admin
-- Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

BEGIN;

-- ── 1. Seed de roles (idempotente) ───────────────────────────────
INSERT INTO roles (nombre, descripcion, es_admin) VALUES
  ('admin_general',      'Administrador general del portal — acceso total', TRUE),
  ('admin_contenido',    'Administrador de contenido editorial',             TRUE),
  ('admin_asociaciones', 'Administrador de micrositios de asociaciones',     TRUE),
  ('admin_soporte',      'Administrador de soporte técnico',                 FALSE),
  ('asociado_raices',    'Acceso completo al módulo de genealogía',          FALSE),
  ('asociado_basico',    'Acceso al portal general',                         FALSE),
  ('asociacion',         'Administrador del micrositio de su asociación',    FALSE),
  ('visor',              'Solo lectura — asignado al registrarse',           FALSE)
ON CONFLICT (nombre) DO NOTHING;

-- ── 2. Habilitar RLS en roles y junction tables ───────────────────
ALTER TABLE roles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE planes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE suscripciones ENABLE ROW LEVEL SECURITY;

-- ── 3. Política: roles — lectura pública para usuarios autenticados
DROP POLICY IF EXISTS "roles_authenticated_select" ON roles;
CREATE POLICY "roles_authenticated_select" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');

-- ── 4. Política: usuarios_roles — cada usuario ve sus propios roles
DROP POLICY IF EXISTS "usuarios_roles_self_select" ON usuarios_roles;
CREATE POLICY "usuarios_roles_self_select" ON usuarios_roles
  FOR SELECT USING (usuario_id = auth.uid());

-- ── 5. Políticas: planes — lectura pública, escritura admin
DROP POLICY IF EXISTS "planes_public_select" ON planes;
CREATE POLICY "planes_public_select" ON planes
  FOR SELECT USING (true);

-- ── 6. Política: suscripciones — usuario ve las propias
DROP POLICY IF EXISTS "suscripciones_self_select" ON suscripciones;
CREATE POLICY "suscripciones_self_select" ON suscripciones
  FOR SELECT USING (usuario_id = auth.uid());

-- ── 7. Función SECURITY DEFINER para chequeo de admin_general ─────
-- Corre con privilegios del definer (postgres/supabase_admin)
-- → puede leer usuarios_roles aunque tenga RLS habilitado
CREATE OR REPLACE FUNCTION public.es_admin_general()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.usuarios_roles ur
    JOIN public.roles r ON r.id = ur.rol_id
    WHERE ur.usuario_id = auth.uid()
      AND r.nombre = 'admin_general'
  );
$$;

-- ── 8. Políticas admin en todas las tablas con RLS ─────────────────

-- usuarios: admin puede leer y actualizar todos
DROP POLICY IF EXISTS "usuarios_admin_select" ON usuarios;
CREATE POLICY "usuarios_admin_select" ON usuarios
  FOR SELECT USING (public.es_admin_general());

DROP POLICY IF EXISTS "usuarios_admin_update" ON usuarios;
CREATE POLICY "usuarios_admin_update" ON usuarios
  FOR UPDATE USING (public.es_admin_general());

-- sitios_familiares: admin puede leer todos
DROP POLICY IF EXISTS "sitios_admin_select" ON sitios_familiares;
CREATE POLICY "sitios_admin_select" ON sitios_familiares
  FOR SELECT USING (public.es_admin_general());

-- personas_arbol: admin puede leer todas
DROP POLICY IF EXISTS "personas_admin_select" ON personas_arbol;
CREATE POLICY "personas_admin_select" ON personas_arbol
  FOR SELECT USING (public.es_admin_general());

-- actividad: admin puede leer toda
DROP POLICY IF EXISTS "actividad_admin_select" ON actividad;
CREATE POLICY "actividad_admin_select" ON actividad
  FOR SELECT USING (public.es_admin_general());

-- usuarios_roles: admin puede leer y gestionar todos
DROP POLICY IF EXISTS "usuarios_roles_admin_all" ON usuarios_roles;
CREATE POLICY "usuarios_roles_admin_all" ON usuarios_roles
  FOR ALL USING (public.es_admin_general())
  WITH CHECK (public.es_admin_general());

-- planes: admin puede editar
DROP POLICY IF EXISTS "planes_admin_all" ON planes;
CREATE POLICY "planes_admin_all" ON planes
  FOR ALL USING (public.es_admin_general())
  WITH CHECK (public.es_admin_general());

-- ── 9. Asignar admin_general al propietario del portal ────────────
-- Idempotente: ON CONFLICT DO NOTHING
INSERT INTO public.usuarios_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM public.usuarios u, public.roles r
WHERE u.email = 'alberto.sanchez.p@hotmail.com'
  AND r.nombre = 'admin_general'
ON CONFLICT DO NOTHING;

COMMIT;
