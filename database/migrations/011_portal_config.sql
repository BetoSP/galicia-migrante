-- Migration 011 — portal_config
-- Tabla de configuración global del portal Galicia Migrante.
-- Misma estructura que arbol_config — valores editables por admin_general.
-- Aplicar en Supabase SQL Editor.

BEGIN;

CREATE TABLE IF NOT EXISTS portal_config (
  clave           TEXT PRIMARY KEY,
  valor           TEXT NOT NULL,
  tipo_valor      TEXT CHECK (tipo_valor IN ('decimal', 'integer', 'boolean', 'text')),
  descripcion_es  TEXT,
  descripcion_gl  TEXT,
  descripcion_en  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO portal_config (clave, valor, tipo_valor, descripcion_es, descripcion_gl, descripcion_en) VALUES
  ('portal_nombre',          'Galicia Migrante',                     'text',    'Nombre del portal',                         'Nome do portal',                          'Portal name'),
  ('portal_tagline',         'Portal de la diáspora gallega',         'text',    'Tagline visible en la landing',             'Tagline visible na landing',              'Tagline visible on landing'),
  ('email_soporte',          'soporte@galiciamigrante.com',           'text',    'Email de soporte visible al usuario',       'Email de soporte visible ao usuario',     'Support email visible to user'),
  ('registro_abierto',       'true',                                  'boolean', '¿El registro de nuevos usuarios está abierto?', '¿O rexistro de novos usuarios está aberto?', 'Is new user registration open?'),
  ('plan_default',           'gratuito',                              'text',    'Nombre del plan asignado al registrarse',   'Nome do plan asignado ao rexistrarse',    'Plan name assigned on registration'),
  ('max_sitios_usuario',     '3',                                     'integer', 'Máximo de sitios por usuario (0 = ilimitado)', 'Máximo de sitios por usuario (0 = ilimitado)', 'Max sites per user (0 = unlimited)'),
  ('modo_mantenimiento',     'false',                                 'boolean', 'Modo mantenimiento activo — bloquea el acceso', 'Modo mantemento activo — bloquea o acceso', 'Maintenance mode active — blocks access')
ON CONFLICT (clave) DO NOTHING;

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_portal_config_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_portal_config_updated_at ON portal_config;
CREATE TRIGGER trg_portal_config_updated_at
  BEFORE UPDATE ON portal_config
  FOR EACH ROW EXECUTE FUNCTION update_portal_config_updated_at();

-- RLS: solo admin_general puede leer y escribir
ALTER TABLE portal_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "portal_config_admin_general" ON portal_config;
CREATE POLICY "portal_config_admin_general"
  ON portal_config FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_roles ur
      JOIN roles r ON ur.rol_id = r.id
      WHERE ur.usuario_id = auth.uid()
        AND r.nombre = 'admin_general'
    )
  );

-- Verificación
DO $$
DECLARE
  n INTEGER;
BEGIN
  SELECT COUNT(*) INTO n FROM portal_config;
  IF n < 7 THEN
    RAISE EXCEPTION 'portal_config debería tener al menos 7 filas, tiene %', n;
  END IF;
  RAISE NOTICE 'Migration 011 OK — portal_config tiene % filas', n;
END $$;

COMMIT;
