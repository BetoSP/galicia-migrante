-- Migration 009 — arbol_config
-- Tabla de configuración del árbol genealógico.
-- Todos los valores configurables del árbol (costos BFS, defaults, umbrales) viven aquí.
-- Nunca se hardcodean en el frontend.
-- Aplicar en Supabase SQL Editor.

BEGIN;

CREATE TABLE IF NOT EXISTS arbol_config (
  clave           TEXT PRIMARY KEY,
  valor           TEXT NOT NULL,
  tipo_valor      TEXT CHECK (tipo_valor IN ('decimal', 'integer', 'boolean', 'text')),
  modificable_por TEXT CHECK (modificable_por IN ('admin_general', 'admin_seccion', 'usuario')),
  descripcion_es  TEXT,
  descripcion_gl  TEXT,
  descripcion_en  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Valores por defecto del árbol
INSERT INTO arbol_config (clave, valor, tipo_valor, modificable_por, descripcion_es, descripcion_gl, descripcion_en) VALUES
  ('costo_sangre_directa',    '1.0',   'decimal', 'admin_general',
    'Costo BFS para línea sanguínea directa (ancestros, descendientes, hermanos, tíos)',
    'Custo BFS para liña sanguínea directa (ancestros, descendentes, irmáns, tíos)',
    'BFS cost for direct blood line (ancestors, descendants, siblings, aunts/uncles)'),

  ('costo_afinidad_directa',  '1.5',   'decimal', 'admin_general',
    'Costo BFS para cónyuge/pareja actual o ex del foco, y parejas de sus hijos',
    'Custo BFS para cónxuxe/parella actual ou ex do foco, e parellas dos seus fillos',
    'BFS cost for current/ex spouse of focal person and spouses of their children'),

  ('costo_sangre_colateral',  '2.0',   'decimal', 'admin_general',
    'Costo BFS para primos sanguíneos del foco, sus cónyuges e hijos',
    'Custo BFS para primos sanguíneos do foco, os seus cónxuxes e fillos',
    'BFS cost for blood cousins of focal person, their spouses and children'),

  ('costo_afinidad_indirecta','2.5',   'decimal', 'admin_general',
    'Costo BFS para suegros — solo visibles cuando el cónyuge es el foco',
    'Custo BFS para sogros — só visibles cando o cónxuxe é o foco',
    'BFS cost for in-laws — only visible when the spouse is the focal person'),

  -- Mapeo slider → umbral BFS (lo que ve el usuario vs. costo interno)
  -- El slider 1-5 del frontend mapea a estos umbrales
  ('umbral_slider_1',         '1.0',   'decimal', 'admin_general',
    'Umbral BFS para slider en posición 1 — solo línea directa de sangre',
    'Limiar BFS para slider en posición 1 — só liña directa de sangue',
    'BFS threshold for slider position 1 — direct blood line only'),

  ('umbral_slider_2',         '1.5',   'decimal', 'admin_general',
    'Umbral BFS para slider en posición 2 — agrega cónyuge/pareja del foco',
    'Limiar BFS para slider en posición 2 — engade cónxuxe/parella do foco',
    'BFS threshold for slider position 2 — adds focal person spouse/partner'),

  ('umbral_slider_3',         '2.0',   'decimal', 'admin_general',
    'Umbral BFS para slider en posición 3 — agrega primos y sus familias',
    'Limiar BFS para slider en posición 3 — engade primos e as súas familias',
    'BFS threshold for slider position 3 — adds cousins and their families'),

  ('umbral_slider_4',         '2.5',   'decimal', 'admin_general',
    'Umbral BFS para slider en posición 4 — agrega afinidad indirecta',
    'Limiar BFS para slider en posición 4 — engade afinidade indirecta',
    'BFS threshold for slider position 4 — adds indirect affinity'),

  ('umbral_slider_5',         '999',   'decimal', 'admin_general',
    'Umbral BFS para slider en posición 5+ — sin límite, todos los nodos',
    'Limiar BFS para slider en posición 5+ — sen límite, todos os nodos',
    'BFS threshold for slider position 5+ — no limit, all nodes'),

  ('generaciones_default',    '5',     'integer', 'admin_general',
    'Valor predeterminado del slider de generaciones al abrir el árbol (5 = todas)',
    'Valor predeterminado do slider de xeracións ao abrir a árbore (5 = todas)',
    'Default value of the generations slider when opening the tree (5 = all)'),

  ('dias_alerta_evento',      '30',    'integer', 'admin_general',
    'Días de anticipación para mostrar alertas de cumpleaños y aniversarios',
    'Días de anticipación para mostrar alertas de aniversarios e aniversarios',
    'Days in advance to show birthday and anniversary alerts'),

  ('rama_default',            'ambas', 'text',    'admin_general',
    'Rama visible por defecto: materna, paterna, ambas',
    'Rama visible por defecto: materna, paterna, ambas',
    'Default visible branch: materna, paterna, ambas')

ON CONFLICT (clave) DO NOTHING;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_arbol_config_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_arbol_config_updated_at ON arbol_config;
CREATE TRIGGER trg_arbol_config_updated_at
  BEFORE UPDATE ON arbol_config
  FOR EACH ROW EXECUTE FUNCTION update_arbol_config_updated_at();

-- RLS
ALTER TABLE arbol_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "arbol_config_lectura_publica" ON arbol_config;
CREATE POLICY "arbol_config_lectura_publica"
  ON arbol_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "arbol_config_escritura_admin" ON arbol_config;
CREATE POLICY "arbol_config_escritura_admin"
  ON arbol_config FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_roles ur
      JOIN roles r ON ur.rol_id = r.id
      WHERE ur.usuario_id = auth.uid()
        AND r.nombre IN ('admin_general', 'admin_seccion')
    )
  );

-- Verificación
DO $$
DECLARE
  n INTEGER;
BEGIN
  SELECT COUNT(*) INTO n FROM arbol_config;
  IF n < 12 THEN
    RAISE EXCEPTION 'arbol_config debería tener al menos 12 filas, tiene %', n;
  END IF;
  RAISE NOTICE 'Migration 009 OK — arbol_config tiene % filas', n;
END $$;

COMMIT;
