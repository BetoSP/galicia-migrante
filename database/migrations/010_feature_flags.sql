-- ═══════════════════════════════════════════════════════════════
-- Migración 010 — Feature Flags por Plan
-- Fecha: 22 de mayo de 2026
--
-- Crea tres tablas:
--   features          catálogo de servicios/capacidades del portal
--   plan_features     qué tiene habilitado cada plan y con qué límites
--   usuario_features  overrides por usuario (admin_general, casos especiales)
--
-- Vista usuario_permisos — permisos efectivos por usuario
--   Usa la tabla `suscripciones` (no usuarios_planes, que no existe en este schema)
--   para determinar el plan activo de cada usuario.
--
-- IMPORTANTE: aplicar con un usuario que tenga permisos de DDL en Supabase.
-- ═══════════════════════════════════════════════════════════════

BEGIN;

-- ─── Catálogo de features ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS features (
  key           text PRIMARY KEY,
  nombre_es     text NOT NULL,
  nombre_gl     text,
  nombre_en     text,
  descripcion   text,
  modulo        text,  -- 'arbol', 'biblioteca', 'lugar_galicia', 'enciclopedia', 'micrositios'
  activo        boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

-- Features iniciales
INSERT INTO features (key, nombre_es, modulo) VALUES
  ('arbol_genealogico',   'Árbol genealógico',       'arbol'),
  ('multiples_arboles',   'Múltiples árboles',        'arbol'),
  ('personas_max',        'Límite de personas',       'arbol'),
  ('arboles_max',         'Límite de árboles',        'arbol'),
  ('biblioteca',          'Biblioteca',               'biblioteca'),
  ('lugar_galicia',       'Tu lugar en Galicia',      'lugar_galicia'),
  ('enciclopedia',        'Enciclopedia gallega',     'enciclopedia'),
  ('micrositios',         'Micrositios asociaciones', 'micrositios'),
  ('fotos_max',           'Límite de fotos',          'arbol'),
  ('storage_mb',          'Almacenamiento (MB)',      'arbol'),
  ('miembros_max',        'Límite de miembros',       'arbol')
ON CONFLICT (key) DO NOTHING;

-- ─── Qué tiene cada plan y con qué límites ────────────────────────────────────
CREATE TABLE IF NOT EXISTS plan_features (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id       uuid NOT NULL REFERENCES planes(id) ON DELETE CASCADE,
  feature_key   text NOT NULL REFERENCES features(key),
  habilitado    boolean DEFAULT true,
  limite_valor  integer,  -- NULL = ilimitado
  created_at    timestamptz DEFAULT now(),
  UNIQUE(plan_id, feature_key)
);

-- ─── Overrides por usuario ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuario_features (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  feature_key   text NOT NULL REFERENCES features(key),
  habilitado    boolean DEFAULT true,
  limite_valor  integer,  -- NULL = ilimitado
  created_at    timestamptz DEFAULT now(),
  UNIQUE(usuario_id, feature_key)
);

-- ─── Migrar datos existentes de planes a plan_features ────────────────────────
-- Nota: los valores reales en la BD son:
--   Gratuito:   personas=0,  fotos=0,   miembros=0
--   Asociado:   personas=50, fotos=200, miembros=20
--   Asociación: personas=200,fotos=1000,miembros=100
-- limite_valor=NULL significa ilimitado; 0 = bloqueado

INSERT INTO plan_features (plan_id, feature_key, habilitado, limite_valor)
SELECT id, 'personas_max', true, NULLIF(limite_personas, 0)
FROM planes
ON CONFLICT DO NOTHING;

INSERT INTO plan_features (plan_id, feature_key, habilitado, limite_valor)
SELECT id, 'fotos_max', true, NULLIF(limite_fotos, 0)
FROM planes
ON CONFLICT DO NOTHING;

INSERT INTO plan_features (plan_id, feature_key, habilitado, limite_valor)
SELECT id, 'miembros_max', true, NULLIF(limite_miembros, 0)
FROM planes
ON CONFLICT DO NOTHING;

-- arbol_genealogico: todos los planes (Gratuito lo incluye en modo básico)
INSERT INTO plan_features (plan_id, feature_key, habilitado)
SELECT id, 'arbol_genealogico', true FROM planes
ON CONFLICT DO NOTHING;

-- biblioteca: solo planes no-Gratuito
INSERT INTO plan_features (plan_id, feature_key, habilitado)
SELECT id, 'biblioteca', (nombre != 'Gratuito') FROM planes
ON CONFLICT DO NOTHING;

-- lugar_galicia: todos los planes
INSERT INTO plan_features (plan_id, feature_key, habilitado)
SELECT id, 'lugar_galicia', true FROM planes
ON CONFLICT DO NOTHING;

-- micrositios: solo plan Asociación
INSERT INTO plan_features (plan_id, feature_key, habilitado)
SELECT id, 'micrositios', (nombre = 'Asociación') FROM planes
ON CONFLICT DO NOTHING;

-- ─── Vista: permisos efectivos por usuario ────────────────────────────────────
-- Resolución de permisos (prioridad de mayor a menor):
--   1. usuario_features (override explícito por usuario)
--   2. plan_features (lo que corresponde al plan activo)
--   3. false (sin acceso por defecto)
--
-- El plan activo es la suscripción más reciente en estado 'activa'.
-- Si no tiene suscripción activa, no tiene plan → solo lo que sea habilitado sin plan.
CREATE OR REPLACE VIEW usuario_permisos AS
SELECT
  u.id                                          AS usuario_id,
  f.key                                         AS feature_key,
  COALESCE(uf.habilitado, pf.habilitado, false) AS habilitado,
  COALESCE(uf.limite_valor, pf.limite_valor)    AS limite_valor
FROM usuarios u
CROSS JOIN features f
LEFT JOIN LATERAL (
  SELECT s.plan_id
  FROM suscripciones s
  WHERE s.usuario_id = u.id
    AND s.estado = 'activa'
  ORDER BY s.created_at DESC
  LIMIT 1
) sub ON true
LEFT JOIN plan_features pf
  ON pf.plan_id = sub.plan_id
  AND pf.feature_key = f.key
LEFT JOIN usuario_features uf
  ON uf.usuario_id = u.id
  AND uf.feature_key = f.key
WHERE f.activo = true;

-- ─── Índices ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_plan_features_plan      ON plan_features(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_features_feature   ON plan_features(feature_key);
CREATE INDEX IF NOT EXISTS idx_usuario_features_usuario ON usuario_features(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuario_features_feature ON usuario_features(feature_key);
CREATE INDEX IF NOT EXISTS idx_sitios_propietario       ON sitios_familiares(propietario_id);
CREATE INDEX IF NOT EXISTS idx_suscripciones_usuario    ON suscripciones(usuario_id);

-- ─── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE features         ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features    ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario_features ENABLE ROW LEVEL SECURITY;

-- features y plan_features: lectura pública (catálogo)
CREATE POLICY "features_lectura_publica"
  ON features FOR SELECT USING (true);

CREATE POLICY "plan_features_lectura_publica"
  ON plan_features FOR SELECT USING (true);

-- usuario_features: cada usuario lee los propios
CREATE POLICY "usuario_features_lectura_propia"
  ON usuario_features FOR SELECT
  USING (usuario_id = auth.uid());

-- usuario_features: admin_general puede hacer todo
CREATE POLICY "usuario_features_admin"
  ON usuario_features FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM usuarios_roles ur
      JOIN roles r ON ur.rol_id = r.id
      WHERE ur.usuario_id = auth.uid()
        AND r.nombre = 'admin_general'
    )
  );

-- ─── Verificación ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_features    integer;
  v_pf          integer;
  v_uf_exists   boolean;
BEGIN
  SELECT count(*) INTO v_features FROM features;
  SELECT count(*) INTO v_pf       FROM plan_features;
  SELECT EXISTS(SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'usuario_features') INTO v_uf_exists;

  RAISE NOTICE 'features: %, plan_features: %, usuario_features exists: %',
    v_features, v_pf, v_uf_exists;

  IF v_features < 11 THEN
    RAISE EXCEPTION 'Error: features no se insertaron correctamente (esperados >=11, obtenidos %)', v_features;
  END IF;
END $$;

COMMIT;
