-- ═══════════════════════════════════════════════════════════════
-- Migración 001 — Expandir personas_arbol con campos del modal expandido
-- Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE personas_arbol
  -- Nombre extendido
  ADD COLUMN IF NOT EXISTS primer_nombre     TEXT,
  ADD COLUMN IF NOT EXISTS segundo_nombre    TEXT,
  ADD COLUMN IF NOT EXISTS apellido_paterno  TEXT,
  ADD COLUMN IF NOT EXISTS apellido_materno  TEXT,
  ADD COLUMN IF NOT EXISTS genero            TEXT DEFAULT 'desconocido',
  ADD COLUMN IF NOT EXISTS prefijo           TEXT,
  ADD COLUMN IF NOT EXISTS sufijo            TEXT,

  -- Fechas granulares
  ADD COLUMN IF NOT EXISTS nac_dia           TEXT,
  ADD COLUMN IF NOT EXISTS nac_mes           TEXT,
  ADD COLUMN IF NOT EXISTS nac_anio          TEXT,
  ADD COLUMN IF NOT EXISTS fall_dia          TEXT,
  ADD COLUMN IF NOT EXISTS fall_mes          TEXT,
  ADD COLUMN IF NOT EXISTS fall_anio         TEXT,
  ADD COLUMN IF NOT EXISTS bautismo_fecha    TEXT,
  ADD COLUMN IF NOT EXISTS bautismo_lugar    TEXT,
  ADD COLUMN IF NOT EXISTS estado            TEXT DEFAULT 'vivo',

  -- Familia
  ADD COLUMN IF NOT EXISTS relacion_padres   TEXT DEFAULT 'legitimo',
  ADD COLUMN IF NOT EXISTS tipo_relacion     TEXT DEFAULT 'casado',
  ADD COLUMN IF NOT EXISTS mat_fecha         TEXT,
  ADD COLUMN IF NOT EXISTS mat_lugar         TEXT,
  ADD COLUMN IF NOT EXISTS testigos          TEXT,

  -- Migración (jsonb para mantener todos los campos juntos)
  ADD COLUMN IF NOT EXISTS migracion         JSONB DEFAULT '{}',

  -- Biografía
  ADD COLUMN IF NOT EXISTS biografia         TEXT,

  -- Contacto
  ADD COLUMN IF NOT EXISTS direccion         TEXT,
  ADD COLUMN IF NOT EXISTS direccion2        TEXT,
  ADD COLUMN IF NOT EXISTS ciudad            TEXT,
  ADD COLUMN IF NOT EXISTS pais              TEXT,
  ADD COLUMN IF NOT EXISTS provincia         TEXT,
  ADD COLUMN IF NOT EXISTS cp               TEXT,
  ADD COLUMN IF NOT EXISTS telefonos         JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS emails            JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS redes             JSONB DEFAULT '{}',

  -- Trabajo y educación
  ADD COLUMN IF NOT EXISTS trabajos          JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS educaciones       JSONB DEFAULT '[]',

  -- Favoritos e info personal (agrupados en jsonb)
  ADD COLUMN IF NOT EXISTS favoritos         JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS info_personal     JSONB DEFAULT '{}';

-- Asegurar que la tabla actividad existe (por si no fue creada antes)
CREATE TABLE IF NOT EXISTS actividad (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sitio_id    UUID REFERENCES sitios_familiares(id) ON DELETE CASCADE,
  usuario_id  UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  tipo        TEXT CHECK (tipo IN ('agrego','actualizo','foto','album','invito','gedcom','otro')),
  descripcion TEXT NOT NULL,
  objeto      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_actividad_sitio_id ON actividad(sitio_id);
CREATE INDEX IF NOT EXISTS idx_actividad_created_at ON actividad(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_personas_arbol_sitio_id ON personas_arbol(sitio_id);
