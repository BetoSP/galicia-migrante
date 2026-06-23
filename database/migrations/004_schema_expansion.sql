-- ═══════════════════════════════════════════════════════════════
-- Migración 004 — Schema expansion
-- Galicia Migrante — 14 de mayo de 2026
--
-- IMPORTANTE: Esta migración es parcialmente destructiva.
-- Elimina padre_id, madre_id, conyugue_id de personas_arbol.
-- Verificar backup antes de ejecutar.
--
-- Envuelta en transacción explícita: si cualquier sentencia falla,
-- Postgres hace rollback automático. La BD queda intacta.
-- ═══════════════════════════════════════════════════════════════

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ════════════════════════════════════════════════════════════════
-- 1. RELACIONES GENEALÓGICAS
-- Reemplaza las columnas fijas padre_id, madre_id, conyugue_id
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS relaciones_persona (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sitio_id     UUID REFERENCES sitios_familiares(id) ON DELETE CASCADE,
  persona_a    UUID REFERENCES personas_arbol(id) ON DELETE CASCADE,
  persona_b    UUID REFERENCES personas_arbol(id) ON DELETE CASCADE,
  tipo         TEXT NOT NULL CHECK (tipo IN (
                 'padre','madre','hijo','hija',
                 'conyugue','pareja','hermano','hermana',
                 'adoptivo','padrastro','madrastra'
               )),
  fecha_inicio TEXT,
  fecha_fin    TEXT,
  notas        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_relaciones_sitio_id    ON relaciones_persona(sitio_id);
CREATE INDEX IF NOT EXISTS idx_relaciones_persona_a   ON relaciones_persona(persona_a);
CREATE INDEX IF NOT EXISTS idx_relaciones_persona_b   ON relaciones_persona(persona_b);

-- ════════════════════════════════════════════════════════════════
-- 2. SISTEMA TERRITORIAL GLOBAL
-- Catálogo sincronizable via IGE, Georef Argentina, GeoNames
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS paises (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  nombre_en      TEXT,
  codigo_iso2    TEXT UNIQUE,
  codigo_iso3    TEXT UNIQUE,
  codigo_externo TEXT,
  fuente         TEXT,
  ultima_sync    TIMESTAMPTZ,
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7)
);

CREATE INDEX IF NOT EXISTS idx_paises_codigo_iso2 ON paises(codigo_iso2);

CREATE TABLE IF NOT EXISTS divisiones_1 (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pais_id        UUID REFERENCES paises(id),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  nombre_en      TEXT,
  tipo           TEXT,
  codigo_iso     TEXT,
  codigo_externo TEXT,
  fuente         TEXT,
  ultima_sync    TIMESTAMPTZ,
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7)
);

CREATE INDEX IF NOT EXISTS idx_divisiones_1_pais_id ON divisiones_1(pais_id);

CREATE TABLE IF NOT EXISTS divisiones_2 (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  division_1_id  UUID REFERENCES divisiones_1(id),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  nombre_en      TEXT,
  tipo           TEXT,
  codigo_externo TEXT,
  fuente         TEXT,
  ultima_sync    TIMESTAMPTZ,
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7)
);

CREATE INDEX IF NOT EXISTS idx_divisiones_2_division_1_id ON divisiones_2(division_1_id);

CREATE TABLE IF NOT EXISTS municipios (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  division_1_id  UUID REFERENCES divisiones_1(id),
  division_2_id  UUID REFERENCES divisiones_2(id),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  nombre_en      TEXT,
  tipo           TEXT,
  codigo_externo TEXT,
  fuente         TEXT,
  ultima_sync    TIMESTAMPTZ,
  activo         BOOLEAN DEFAULT TRUE,
  fusionado_en   UUID REFERENCES municipios(id),
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7)
);

CREATE INDEX IF NOT EXISTS idx_municipios_division_1_id ON municipios(division_1_id);
CREATE INDEX IF NOT EXISTS idx_municipios_division_2_id ON municipios(division_2_id);

CREATE TABLE IF NOT EXISTS diocesis (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  pais_id        UUID REFERENCES paises(id),
  sede           TEXT,
  codigo_externo TEXT,
  fuente         TEXT,
  ultima_sync    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS parroquias (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  municipio_id   UUID REFERENCES municipios(id),
  diocesis_id    UUID REFERENCES diocesis(id),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  tipo           TEXT DEFAULT 'civil',
  codigo_externo TEXT,
  fuente         TEXT DEFAULT 'IGE',
  ultima_sync    TIMESTAMPTZ,
  activo         BOOLEAN DEFAULT TRUE,
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7)
);

CREATE INDEX IF NOT EXISTS idx_parroquias_municipio_id ON parroquias(municipio_id);
CREATE INDEX IF NOT EXISTS idx_parroquias_diocesis_id  ON parroquias(diocesis_id);

CREATE TABLE IF NOT EXISTS localidades (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  municipio_id   UUID REFERENCES municipios(id),
  parroquia_id   UUID REFERENCES parroquias(id),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  tipo           TEXT,
  codigo_externo TEXT,
  fuente         TEXT,
  ultima_sync    TIMESTAMPTZ,
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7)
);

CREATE INDEX IF NOT EXISTS idx_localidades_municipio_id ON localidades(municipio_id);
CREATE INDEX IF NOT EXISTS idx_localidades_parroquia_id ON localidades(parroquia_id);

CREATE TABLE IF NOT EXISTS codigos_postales (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo         TEXT NOT NULL,
  pais_id        UUID REFERENCES paises(id),
  municipio_id   UUID REFERENCES municipios(id),
  parroquia_id   UUID REFERENCES parroquias(id),
  localidad_id   UUID REFERENCES localidades(id),
  codigo_externo TEXT,
  fuente         TEXT,
  ultima_sync    TIMESTAMPTZ,
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7),
  UNIQUE (codigo, pais_id)
);

CREATE TABLE IF NOT EXISTS direcciones (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entidad_tipo    TEXT NOT NULL,
  entidad_id      UUID NOT NULL,
  pais_id         UUID REFERENCES paises(id),
  division_1_id   UUID REFERENCES divisiones_1(id),
  division_2_id   UUID REFERENCES divisiones_2(id),
  municipio_id    UUID REFERENCES municipios(id),
  parroquia_id    UUID REFERENCES parroquias(id),
  localidad_id    UUID REFERENCES localidades(id),
  cp_id           UUID REFERENCES codigos_postales(id),
  nombre_casa     TEXT,
  numero_casa     TEXT,
  calle           TEXT,
  numero          TEXT,
  piso            TEXT,
  departamento    TEXT,
  direccion_libre TEXT,
  tipo            TEXT DEFAULT 'actual',
  desde           TEXT,
  hasta           TEXT,
  principal       BOOLEAN DEFAULT TRUE,
  notas           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_direcciones_entidad   ON direcciones(entidad_tipo, entidad_id);
CREATE INDEX IF NOT EXISTS idx_direcciones_parroquia ON direcciones(parroquia_id);

-- ════════════════════════════════════════════════════════════════
-- 3. REDES MIGRATORIAS
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS puertos (
  id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre  TEXT NOT NULL,
  ciudad  TEXT,
  pais_id UUID REFERENCES paises(id),
  lat     DECIMAL(10,7),
  lng     DECIMAL(10,7)
);

CREATE TABLE IF NOT EXISTS barcos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      TEXT NOT NULL,
  compania    TEXT,
  bandera     TEXT,
  anio_inicio INTEGER,
  anio_fin    INTEGER,
  notas       TEXT
);

CREATE TABLE IF NOT EXISTS eventos_migratorios (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona_id     UUID REFERENCES personas_arbol(id) ON DELETE CASCADE,
  barco_id       UUID REFERENCES barcos(id),
  puerto_origen  UUID REFERENCES puertos(id),
  puerto_destino UUID REFERENCES puertos(id),
  fecha          TEXT,
  clase          TEXT,
  documentos     JSONB DEFAULT '[]',
  notas          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eventos_migratorios_persona_id ON eventos_migratorios(persona_id);

-- ════════════════════════════════════════════════════════════════
-- 4. DOCUMENTOS HISTÓRICOS
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS documentos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sitio_id    UUID REFERENCES sitios_familiares(id) ON DELETE CASCADE,
  persona_id  UUID REFERENCES personas_arbol(id) ON DELETE SET NULL,
  tipo        TEXT CHECK (tipo IN (
                'acta_nacimiento','acta_matrimonio','acta_defuncion',
                'bautismo','partida','censo','padron',
                'pasaporte','visa','carta','fotografia',
                'testamento','otro'
              )),
  titulo      TEXT,
  descripcion TEXT,
  url_archivo TEXT,
  fecha_aprox TEXT,
  lugar_aprox TEXT,
  fuente      TEXT,
  verificado  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documentos_sitio_id   ON documentos(sitio_id);
CREATE INDEX IF NOT EXISTS idx_documentos_persona_id ON documentos(persona_id);

-- ════════════════════════════════════════════════════════════════
-- 5. HISTORIA ORAL
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS testimonios (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona_id   UUID REFERENCES personas_arbol(id) ON DELETE SET NULL,
  sitio_id     UUID REFERENCES sitios_familiares(id) ON DELETE CASCADE,
  tipo         TEXT CHECK (tipo IN ('audio','video','texto','foto')),
  titulo       TEXT,
  descripcion  TEXT,
  url_media    TEXT,
  duracion_seg INTEGER,
  fecha_aprox  TEXT,
  lugar_aprox  TEXT,
  idioma       TEXT DEFAULT 'es',
  publicado    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonios_sitio_id   ON testimonios(sitio_id);
CREATE INDEX IF NOT EXISTS idx_testimonios_persona_id ON testimonios(persona_id);

-- ════════════════════════════════════════════════════════════════
-- 6. STORAGE CENTRALIZADO
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS archivos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sitio_id      UUID REFERENCES sitios_familiares(id) ON DELETE CASCADE,
  persona_id    UUID REFERENCES personas_arbol(id) ON DELETE SET NULL,
  subido_por    UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  tipo          TEXT CHECK (tipo IN ('foto','documento','audio','video')),
  nombre        TEXT NOT NULL,
  descripcion   TEXT,
  url           TEXT NOT NULL,
  storage_bytes INTEGER,
  duracion_seg  INTEGER,
  mime_type     TEXT,
  publico       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_archivos_sitio_id   ON archivos(sitio_id);
CREATE INDEX IF NOT EXISTS idx_archivos_persona_id ON archivos(persona_id);

-- ════════════════════════════════════════════════════════════════
-- 7. AUDITORÍA GENEALÓGICA
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS personas_arbol_historial (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona_id    UUID REFERENCES personas_arbol(id) ON DELETE CASCADE,
  usuario_id    UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  datos_antes   JSONB NOT NULL,
  datos_despues JSONB NOT NULL,
  motivo        TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historial_persona_id
  ON personas_arbol_historial(persona_id);
CREATE INDEX IF NOT EXISTS idx_historial_created_at
  ON personas_arbol_historial(created_at DESC);

-- ════════════════════════════════════════════════════════════════
-- 8. LOG DE AUDITORÍA ADMIN
-- INMUTABLE — sin UPDATE ni DELETE sobre esta tabla
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id    UUID REFERENCES usuarios(id),
  accion        TEXT NOT NULL,
  entidad_tipo  TEXT,
  entidad_id    UUID,
  datos_antes   JSONB,
  datos_despues JSONB,
  ip            TEXT,
  dispositivo   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_usuario_id  ON admin_audit_log(usuario_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at  ON admin_audit_log(created_at DESC);

-- ════════════════════════════════════════════════════════════════
-- 9. MODIFICACIONES A TABLAS EXISTENTES
-- ════════════════════════════════════════════════════════════════

-- personas_arbol: PRIMERO eliminar columnas de relaciones fijas
ALTER TABLE personas_arbol
  DROP COLUMN IF EXISTS padre_id,
  DROP COLUMN IF EXISTS madre_id,
  DROP COLUMN IF EXISTS conyugue_id;

-- personas_arbol: LUEGO agregar referencias territoriales y campo vivo
ALTER TABLE personas_arbol
  ADD COLUMN IF NOT EXISTS parroquia_origen_id UUID REFERENCES parroquias(id),
  ADD COLUMN IF NOT EXISTS localidad_origen_id UUID REFERENCES localidades(id),
  ADD COLUMN IF NOT EXISTS vivo BOOLEAN DEFAULT TRUE;
  -- lugar_nac y lugar_fall se mantienen como fallback histórico

-- usuarios: consentimiento legal y sucesión admin
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS acepto_terminos            BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS acepto_terminos_fecha      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS acepto_privacidad          BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS acepto_privacidad_fecha    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS es_admin_emergencia        BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS admin_respaldo_de          UUID REFERENCES usuarios(id),
  ADD COLUMN IF NOT EXISTS contacto_emergencia_email  TEXT,
  ADD COLUMN IF NOT EXISTS contacto_emergencia_nombre TEXT;

-- planes: límites de storage
ALTER TABLE planes
  ADD COLUMN IF NOT EXISTS limite_documentos INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS limite_storage_mb INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS limite_audio_mb   INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS limite_video_min  INTEGER DEFAULT 0;

-- ════════════════════════════════════════════════════════════════
-- 10. VERIFICACIÓN POST-MIGRACIÓN (dentro de la transacción)
-- Si algo falla aquí, el COMMIT no se ejecuta y todo se revierte
-- ════════════════════════════════════════════════════════════════

DO $$
DECLARE
  tabla   TEXT;
  columna TEXT;
  tablas_esperadas TEXT[] := ARRAY[
    'relaciones_persona','paises','divisiones_1','divisiones_2',
    'municipios','diocesis','parroquias','localidades','codigos_postales',
    'direcciones','puertos','barcos','eventos_migratorios',
    'documentos','testimonios','archivos','personas_arbol_historial',
    'admin_audit_log'
  ];
  columnas_eliminadas TEXT[] := ARRAY['padre_id','madre_id','conyugue_id'];
  columnas_agregadas  TEXT[] := ARRAY['parroquia_origen_id','localidad_origen_id','vivo'];
BEGIN
  -- Verificar tablas nuevas
  FOREACH tabla IN ARRAY tablas_esperadas LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = tabla
    ) THEN
      RAISE EXCEPTION 'VERIFICACIÓN FALLIDA — tabla faltante: %', tabla;
    END IF;
  END LOOP;

  -- Verificar columnas eliminadas de personas_arbol
  FOREACH columna IN ARRAY columnas_eliminadas LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'personas_arbol' AND column_name = columna
    ) THEN
      RAISE EXCEPTION 'VERIFICACIÓN FALLIDA — columna no eliminada: personas_arbol.%', columna;
    END IF;
  END LOOP;

  -- Verificar columnas agregadas a personas_arbol
  FOREACH columna IN ARRAY columnas_agregadas LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'personas_arbol' AND column_name = columna
    ) THEN
      RAISE EXCEPTION 'VERIFICACIÓN FALLIDA — columna no agregada: personas_arbol.%', columna;
    END IF;
  END LOOP;

  RAISE NOTICE 'Migración 004 verificada correctamente — todas las tablas y columnas en orden';
END $$;

COMMIT;
