-- ═══════════════════════════════════════════════════════════════
-- Galicia Migrante — Schema completo de base de datos
-- Fuente de verdad — refleja el estado tras migraciones 001-004
-- Versión: 004 — 14 de mayo de 2026 — 37 tablas
-- ═══════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════
-- PARTE 1 — TABLAS BASE (sin dependencias complejas)
-- ═══════════════════════════════════════════════════════════════

-- ─── USUARIOS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id                           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                        TEXT NOT NULL UNIQUE,
  nombre                       TEXT,
  apellido                     TEXT,
  avatar_url                   TEXT,
  idioma                       TEXT DEFAULT 'es' CHECK (idioma IN ('es', 'gl', 'en')),
  -- Consentimiento legal
  acepto_terminos              BOOLEAN DEFAULT FALSE,
  acepto_terminos_fecha        TIMESTAMPTZ,
  acepto_privacidad            BOOLEAN DEFAULT FALSE,
  acepto_privacidad_fecha      TIMESTAMPTZ,
  -- Sucesión admin
  es_admin_emergencia          BOOLEAN DEFAULT FALSE,
  admin_respaldo_de            UUID REFERENCES usuarios(id),
  contacto_emergencia_email    TEXT,
  contacto_emergencia_nombre   TEXT,
  created_at                   TIMESTAMP DEFAULT NOW(),
  updated_at                   TIMESTAMP DEFAULT NOW()
);

-- ─── ROLES ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  es_admin    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─── PERMISOS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS permisos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo      TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  modulo      TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- PARTE 2 — SISTEMA TERRITORIAL GLOBAL
-- Dependencias: paises → divisiones_1 → divisiones_2 → municipios
--               paises → diocesis → parroquias
-- ═══════════════════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════════════════
-- PARTE 3 — PLANES Y RBAC (depende de roles y permisos)
-- ═══════════════════════════════════════════════════════════════

-- ─── ROLES_PERMISOS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roles_permisos (
  rol_id      UUID REFERENCES roles(id) ON DELETE CASCADE,
  permiso_id  UUID REFERENCES permisos(id) ON DELETE CASCADE,
  PRIMARY KEY (rol_id, permiso_id)
);

-- ─── USUARIOS_ROLES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios_roles (
  usuario_id   UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  rol_id       UUID REFERENCES roles(id) ON DELETE CASCADE,
  asignado_en  TIMESTAMP DEFAULT NOW(),
  asignado_por UUID REFERENCES usuarios(id),
  PRIMARY KEY (usuario_id, rol_id)
);

-- ─── PLANES ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS planes (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre           TEXT NOT NULL,
  descripcion      TEXT,
  precio_ars       DECIMAL(10,2) DEFAULT 0,
  precio_eur       DECIMAL(10,2) DEFAULT 0,
  precio_usd       DECIMAL(10,2) DEFAULT 0,
  periodo          TEXT DEFAULT 'mensual' CHECK (periodo IN ('mensual','anual','unico','gratuito')),
  limite_personas  INTEGER DEFAULT 50,
  limite_fotos     INTEGER DEFAULT 100,
  limite_miembros  INTEGER DEFAULT 10,
  -- Storage (migración 004)
  limite_documentos INTEGER DEFAULT 0,
  limite_storage_mb INTEGER DEFAULT 0,
  limite_audio_mb   INTEGER DEFAULT 0,
  limite_video_min  INTEGER DEFAULT 0,
  activo           BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- ─── PLANES_PERMISOS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS planes_permisos (
  plan_id    UUID REFERENCES planes(id) ON DELETE CASCADE,
  permiso_id UUID REFERENCES permisos(id) ON DELETE CASCADE,
  PRIMARY KEY (plan_id, permiso_id)
);

-- ─── SUSCRIPCIONES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS suscripciones (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id       UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  plan_id          UUID REFERENCES planes(id),
  estado           TEXT DEFAULT 'activa' CHECK (estado IN ('activa','pausada','cancelada','vencida')),
  inicio           TIMESTAMP DEFAULT NOW(),
  vencimiento      TIMESTAMP,
  metodo_pago      TEXT,
  referencia_pago  TEXT,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- PARTE 4 — GENEALOGÍA
-- personas_arbol FK-referencia parroquias y localidades (migración 004)
-- ═══════════════════════════════════════════════════════════════

-- ─── SITIOS FAMILIARES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sitios_familiares (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  propietario_id  UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre          TEXT NOT NULL,
  descripcion     TEXT,
  visibilidad     TEXT DEFAULT 'privado' CHECK (visibilidad IN ('privado','miembros','publico')),
  limite_personas INTEGER DEFAULT 50,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ─── SITIOS_MIEMBROS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sitios_miembros (
  sitio_id   UUID REFERENCES sitios_familiares(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  rol_sitio  TEXT DEFAULT 'visor' CHECK (rol_sitio IN ('admin','editor','visor')),
  estado     TEXT DEFAULT 'pendiente' CHECK (estado IN ('activo','pendiente','rechazado')),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (sitio_id, usuario_id)
);

-- ─── PERSONAS_ARBOL ──────────────────────────────────────────────
-- Schema completo incluyendo migraciones 001 y 004
-- Migración 001: 30+ columnas nuevas
-- Migración 004: elimina padre_id, madre_id, conyugue_id
--               agrega parroquia_origen_id, localidad_origen_id, vivo
CREATE TABLE IF NOT EXISTS personas_arbol (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sitio_id         UUID REFERENCES sitios_familiares(id) ON DELETE CASCADE,

  -- Nombre completo
  nombre           TEXT NOT NULL,
  apellido         TEXT,
  primer_nombre    TEXT,
  segundo_nombre   TEXT,
  apellido_paterno TEXT,
  apellido_materno TEXT,
  prefijo          TEXT,
  sufijo           TEXT,

  -- Tipo y estado
  tipo             TEXT NOT NULL CHECK (tipo IN ('galicia','emigrante','diaspora','retornado','sin_raices')),
  genero           TEXT DEFAULT 'desconocido',
  estado           TEXT DEFAULT 'vivo',
  vivo             BOOLEAN DEFAULT TRUE,

  -- Nacimiento
  nacimiento       TEXT,
  lugar_nac        TEXT,
  nac_dia          TEXT,
  nac_mes          TEXT,
  nac_anio         TEXT,

  -- Fallecimiento
  fallecimiento    TEXT,
  lugar_fall       TEXT,
  fall_dia         TEXT,
  fall_mes         TEXT,
  fall_anio        TEXT,

  -- Bautismo
  bautismo_fecha   TEXT,
  bautismo_lugar   TEXT,

  -- Origen territorial (migración 004 — reemplaza padre_id/madre_id/conyugue_id)
  parroquia_origen_id UUID REFERENCES parroquias(id),
  localidad_origen_id UUID REFERENCES localidades(id),

  -- Datos de matrimonio (sin FK fija — ver relaciones_persona)
  relacion_padres  TEXT DEFAULT 'legitimo',
  tipo_relacion    TEXT DEFAULT 'casado',
  mat_fecha        TEXT,
  mat_lugar        TEXT,
  testigos         TEXT,

  -- Migración
  migracion        JSONB DEFAULT '{}',

  -- Contacto (legacy texto libre — ver también tabla direcciones)
  direccion        TEXT,
  direccion2       TEXT,
  ciudad           TEXT,
  pais             TEXT,
  provincia        TEXT,
  cp               TEXT,
  telefonos        JSONB DEFAULT '[]',
  emails           JSONB DEFAULT '[]',
  redes            JSONB DEFAULT '{}',

  -- Trabajo y educación
  trabajos         JSONB DEFAULT '[]',
  educaciones      JSONB DEFAULT '[]',

  -- Personalidad y favoritos
  favoritos        JSONB DEFAULT '{}',
  info_personal    JSONB DEFAULT '{}',

  -- Fotos y notas
  foto_url         TEXT,
  notas            TEXT,
  fuentes          TEXT,
  biografia        TEXT,

  -- Importador GEDCOM tolerante (migración 006)
  gedcom_raw      TEXT,    -- Bloque GEDCOM original para registros en cuarentena
  gedcom_warnings JSONB DEFAULT '[]',  -- Errores detectados durante el parseo

  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_personas_arbol_sitio_id ON personas_arbol(sitio_id);

-- ─── RELACIONES_PERSONA ──────────────────────────────────────────
-- Reemplaza las columnas fijas padre_id, madre_id, conyugue_id
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

CREATE INDEX IF NOT EXISTS idx_relaciones_sitio_id  ON relaciones_persona(sitio_id);
CREATE INDEX IF NOT EXISTS idx_relaciones_persona_a ON relaciones_persona(persona_a);
CREATE INDEX IF NOT EXISTS idx_relaciones_persona_b ON relaciones_persona(persona_b);

-- ─── EVENTOS_FAMILIARES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eventos_familiares (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sitio_id    UUID REFERENCES sitios_familiares(id) ON DELETE CASCADE,
  persona_id  UUID REFERENCES personas_arbol(id) ON DELETE CASCADE,
  tipo        TEXT CHECK (tipo IN ('cumpleanos','aniversario','fallecimiento_aniv','otro')),
  descripcion TEXT,
  fecha_mes   INTEGER CHECK (fecha_mes BETWEEN 1 AND 12),
  fecha_dia   INTEGER CHECK (fecha_dia BETWEEN 1 AND 31),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─── DOCUMENTOS HISTÓRICOS ───────────────────────────────────────
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

-- ─── TESTIMONIOS (historia oral) ─────────────────────────────────
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

-- ─── ARCHIVOS (storage centralizado) ─────────────────────────────
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

-- ─── AUDITORÍA GENEALÓGICA ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS personas_arbol_historial (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona_id    UUID REFERENCES personas_arbol(id) ON DELETE CASCADE,
  usuario_id    UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  datos_antes   JSONB NOT NULL,
  datos_despues JSONB NOT NULL,
  motivo        TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historial_persona_id ON personas_arbol_historial(persona_id);
CREATE INDEX IF NOT EXISTS idx_historial_created_at ON personas_arbol_historial(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- PARTE 5 — SISTEMA TERRITORIAL ADICIONAL
-- ═══════════════════════════════════════════════════════════════

-- ─── DIRECCIONES ─────────────────────────────────────────────────
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

-- ═══════════════════════════════════════════════════════════════
-- PARTE 6 — REDES MIGRATORIAS
-- ═══════════════════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════════════════
-- PARTE 7 — ASOCIACIONES Y PORTAL
-- ═══════════════════════════════════════════════════════════════

-- ─── ASOCIACIONES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS asociaciones (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id       UUID REFERENCES usuarios(id),
  nombre         TEXT NOT NULL,
  nombre_gl      TEXT,
  nombre_en      TEXT,
  fundacion      INTEGER,
  descripcion_es TEXT,
  descripcion_gl TEXT,
  descripcion_en TEXT,
  email          TEXT,
  telefono       TEXT,
  direccion      TEXT,
  ciudad         TEXT,
  pais           TEXT DEFAULT 'Argentina',
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7),
  logo_url       TEXT,
  web_propia     TEXT,
  plan_id        UUID REFERENCES planes(id),
  activa         BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);

-- ─── ASOCIACIONES_DIRECTIVOS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS asociaciones_directivos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asociacion_id UUID REFERENCES asociaciones(id) ON DELETE CASCADE,
  nombre        TEXT NOT NULL,
  cargo         TEXT,
  email         TEXT,
  foto_url      TEXT,
  orden         INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ─── ASOCIACIONES_NOTICIAS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS asociaciones_noticias (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asociacion_id UUID REFERENCES asociaciones(id) ON DELETE CASCADE,
  titulo_es     TEXT,
  titulo_gl     TEXT,
  titulo_en     TEXT,
  contenido_es  TEXT,
  contenido_gl  TEXT,
  contenido_en  TEXT,
  imagen_url    TEXT,
  publicado     BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- ─── EVENTOS (agenda pública) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS eventos (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asociacion_id  UUID REFERENCES asociaciones(id) ON DELETE SET NULL,
  titulo_es      TEXT NOT NULL,
  titulo_gl      TEXT,
  titulo_en      TEXT,
  descripcion_es TEXT,
  descripcion_gl TEXT,
  descripcion_en TEXT,
  tipo           TEXT CHECK (tipo IN ('cultura','musica','reunion','taller','deportes','gastronomia','otro')),
  fecha_inicio   TIMESTAMP NOT NULL,
  fecha_fin      TIMESTAMP,
  lugar          TEXT,
  ciudad         TEXT,
  online         BOOLEAN DEFAULT FALSE,
  url_evento     TEXT,
  imagen_url     TEXT,
  publicado      BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);

-- ─── MODULOS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS modulos (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo     TEXT NOT NULL UNIQUE,
  nombre_es  TEXT,
  nombre_gl  TEXT,
  nombre_en  TEXT,
  activo     BOOLEAN DEFAULT TRUE,
  es_mvp     BOOLEAN DEFAULT FALSE,
  orden      INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── TRADUCCIONES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS traducciones (
  id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clave   TEXT NOT NULL,
  idioma  TEXT NOT NULL CHECK (idioma IN ('es','gl','en')),
  valor   TEXT NOT NULL,
  modulo  TEXT,
  UNIQUE (clave, idioma)
);

-- ─── ACTIVIDAD ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS actividad (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sitio_id    UUID REFERENCES sitios_familiares(id) ON DELETE CASCADE,
  usuario_id  UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  tipo        TEXT CHECK (tipo IN ('agrego','actualizo','foto','album','invito','gedcom','otro')),
  descripcion TEXT NOT NULL,
  objeto      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_actividad_sitio_id   ON actividad(sitio_id);
CREATE INDEX IF NOT EXISTS idx_actividad_created_at ON actividad(created_at DESC);

-- ─── ADMIN AUDIT LOG (inmutable — sin UPDATE ni DELETE) ───────────
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

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_usuario_id ON admin_audit_log(usuario_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA — Datos iniciales
-- ═══════════════════════════════════════════════════════════════

-- Roles (8)
INSERT INTO roles (nombre, descripcion, es_admin) VALUES
  ('admin_general',      'Administrador total del portal',                    TRUE),
  ('admin_contenido',    'Gestiona agenda, noticias y contenido editorial',   FALSE),
  ('admin_asociaciones', 'Gestiona registro y aprobación de asociaciones',    FALSE),
  ('admin_soporte',      'Soporte técnico de usuarios',                       FALSE),
  ('asociado_basico',    'Asociado con acceso al portal general',             FALSE),
  ('asociado_raices',    'Asociado con acceso al módulo de genealogía',       FALSE),
  ('asociacion',         'Administrador del micrositio de una asociación',    FALSE),
  ('visor',              'Acceso de solo lectura a contenido público',        FALSE)
ON CONFLICT (nombre) DO NOTHING;

-- Permisos (16)
INSERT INTO permisos (codigo, descripcion, modulo) VALUES
  ('ver_agenda',          'Ver agenda de eventos',                     'portal'),
  ('crear_evento',        'Crear y editar eventos',                    'portal'),
  ('ver_directorio',      'Ver directorio de asociaciones',            'portal'),
  ('ver_tramites',        'Acceder a trámites Xunta y España',         'portal'),
  ('ver_raices',          'Acceder al módulo Tus Raíces',              'raices'),
  ('crear_personas',      'Agregar personas al árbol',                 'raices'),
  ('editar_personas',     'Editar datos de personas',                  'raices'),
  ('eliminar_personas',   'Eliminar personas del árbol',               'raices'),
  ('importar_gedcom',     'Importar archivos GEDCOM',                  'raices'),
  ('exportar_gedcom',     'Exportar árbol a GEDCOM',                   'raices'),
  ('gestionar_miembros',  'Gestionar miembros del sitio familiar',     'raices'),
  ('gestionar_microsite', 'Administrar micrositio de asociación',      'asociaciones'),
  ('admin_usuarios',      'Gestionar usuarios del portal',             'admin'),
  ('admin_planes',        'Gestionar planes y precios',                'admin'),
  ('admin_roles',         'Gestionar roles y permisos',                'admin'),
  ('admin_total',         'Acceso total al panel de administración',   'admin')
ON CONFLICT (codigo) DO NOTHING;

-- Planes (3)
INSERT INTO planes (nombre, descripcion, precio_ars, precio_eur, periodo, limite_personas, limite_fotos, limite_miembros, activo) VALUES
  ('Gratuito',   'Acceso al portal y agenda',            0, 0, 'gratuito', 0,   0,   0,   TRUE),
  ('Asociado',   'Acceso completo incluyendo Raíces',    0, 0, 'mensual',  50,  200, 20,  TRUE),
  ('Asociación', 'Para centros gallegos con micrositio', 0, 0, 'mensual',  200, 1000,100, TRUE)
ON CONFLICT DO NOTHING;

-- Módulos (7)
INSERT INTO modulos (codigo, nombre_es, nombre_gl, nombre_en, activo, es_mvp, orden) VALUES
  ('landing',       'Inicio',         'Inicio',         'Home',         TRUE,  TRUE,  1),
  ('raices',        'Tus Raíces',     'As Túas Raíces', 'Your Roots',   TRUE,  TRUE,  2),
  ('asociaciones',  'Asociaciones',   'Asociacións',    'Associations', TRUE,  TRUE,  3),
  ('agenda',        'Agenda',         'Axenda',         'Events',       TRUE,  TRUE,  4),
  ('xunta',         'Xunta & España', 'Xunta & España', 'Xunta & Spain',TRUE,  TRUE,  5),
  ('biblioteca',    'Biblioteca',     'Biblioteca',     'Library',      FALSE, FALSE, 6),
  ('investigacion', 'Investigación',  'Investigación',  'Research',     FALSE, FALSE, 7)
ON CONFLICT (codigo) DO NOTHING;

-- ─── FEATURE FLAGS — migración 010 ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS features (
  key           text PRIMARY KEY,
  nombre_es     text NOT NULL,
  nombre_gl     text,
  nombre_en     text,
  descripcion   text,
  modulo        text,
  activo        boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plan_features (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id       uuid NOT NULL REFERENCES planes(id) ON DELETE CASCADE,
  feature_key   text NOT NULL REFERENCES features(key),
  habilitado    boolean DEFAULT true,
  limite_valor  integer,
  created_at    timestamptz DEFAULT now(),
  UNIQUE(plan_id, feature_key)
);

CREATE TABLE IF NOT EXISTS usuario_features (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  feature_key   text NOT NULL REFERENCES features(key),
  habilitado    boolean DEFAULT true,
  limite_valor  integer,
  created_at    timestamptz DEFAULT now(),
  UNIQUE(usuario_id, feature_key)
);

-- Vista: permisos efectivos por usuario (plan activo + overrides individuales)
-- Nota: usa suscripciones para determinar el plan activo del usuario.
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
  WHERE s.usuario_id = u.id AND s.estado = 'activa'
  ORDER BY s.created_at DESC LIMIT 1
) sub ON true
LEFT JOIN plan_features pf ON pf.plan_id = sub.plan_id AND pf.feature_key = f.key
LEFT JOIN usuario_features uf ON uf.usuario_id = u.id AND uf.feature_key = f.key
WHERE f.activo = true;

CREATE INDEX IF NOT EXISTS idx_plan_features_plan       ON plan_features(plan_id);
CREATE INDEX IF NOT EXISTS idx_usuario_features_usuario ON usuario_features(usuario_id);

-- ─── ÁRBOL CONFIG ─────────────────────────────────────────────────────────
-- Configuración del árbol genealógico: costos BFS, umbrales, defaults.
-- Ningún valor configurable se hardcodea en el frontend — todo vive aquí.
-- Aplicada en: migración 009_arbol_config.sql
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

-- ─── PORTAL CONFIG ────────────────────────────────────────────────────────
-- Configuración global del portal. Solo admin_general puede leer y escribir.
-- Aplicada en: migración 011_portal_config.sql
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

-- ═══════════════════════════════════════════════════════════════
-- GRANTS — migración 012
-- Habilita el acceso desde supabase-js/PostgREST a todas las tablas.
-- Las políticas RLS (migraciones 002 y 008) son la capa de seguridad real.
-- ═══════════════════════════════════════════════════════════════

-- Genealogía
GRANT SELECT ON sitios_familiares TO authenticated;
GRANT INSERT, UPDATE, DELETE ON sitios_familiares TO authenticated;
GRANT SELECT ON sitios_miembros TO authenticated;
GRANT INSERT, UPDATE, DELETE ON sitios_miembros TO authenticated;
GRANT SELECT ON personas_arbol TO authenticated;
GRANT INSERT, UPDATE, DELETE ON personas_arbol TO authenticated;
GRANT SELECT ON personas_arbol_historial TO authenticated;
GRANT INSERT ON personas_arbol_historial TO authenticated;
GRANT SELECT ON relaciones_persona TO authenticated;
GRANT INSERT, UPDATE, DELETE ON relaciones_persona TO authenticated;
GRANT SELECT ON eventos_familiares TO authenticated;
GRANT INSERT, UPDATE, DELETE ON eventos_familiares TO authenticated;
GRANT SELECT ON documentos TO authenticated;
GRANT INSERT, UPDATE, DELETE ON documentos TO authenticated;
GRANT SELECT ON testimonios TO authenticated;
GRANT INSERT, UPDATE, DELETE ON testimonios TO authenticated;
GRANT SELECT ON archivos TO authenticated;
GRANT INSERT, UPDATE, DELETE ON archivos TO authenticated;
GRANT SELECT ON direcciones TO authenticated;
GRANT INSERT, UPDATE, DELETE ON direcciones TO authenticated;

-- Actividad y auditoría
GRANT SELECT ON actividad TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON actividad TO authenticated;
GRANT SELECT ON admin_audit_log TO authenticated;

-- Suscripciones y features por usuario
GRANT SELECT ON suscripciones TO authenticated;
GRANT INSERT, UPDATE, DELETE ON suscripciones TO authenticated;
GRANT SELECT ON usuario_features TO authenticated;
GRANT INSERT, UPDATE, DELETE ON usuario_features TO authenticated;
GRANT SELECT ON usuario_permisos TO authenticated;

-- RBAC
GRANT SELECT ON roles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON roles TO authenticated;
GRANT SELECT ON permisos TO authenticated;
GRANT INSERT, UPDATE, DELETE ON permisos TO authenticated;
GRANT SELECT ON roles_permisos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON roles_permisos TO authenticated;
GRANT SELECT ON usuarios TO authenticated;
GRANT INSERT, UPDATE ON usuarios TO authenticated;
GRANT SELECT ON usuarios_roles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON usuarios_roles TO authenticated;

-- Planes y features
GRANT SELECT ON planes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON planes TO authenticated;
GRANT SELECT ON planes_permisos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON planes_permisos TO authenticated;
GRANT SELECT ON features TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON features TO authenticated;
GRANT SELECT ON plan_features TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON plan_features TO authenticated;

-- Configuración
GRANT SELECT ON arbol_config TO anon, authenticated;
GRANT INSERT, UPDATE ON arbol_config TO authenticated;
GRANT SELECT ON portal_config TO anon, authenticated;
GRANT INSERT, UPDATE ON portal_config TO authenticated;

-- Asociaciones y portal
GRANT SELECT ON asociaciones TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON asociaciones TO authenticated;
GRANT SELECT ON asociaciones_directivos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON asociaciones_directivos TO authenticated;
GRANT SELECT ON asociaciones_noticias TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON asociaciones_noticias TO authenticated;
GRANT SELECT ON eventos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON eventos TO authenticated;
GRANT SELECT ON modulos TO anon, authenticated;
GRANT SELECT ON traducciones TO anon, authenticated;
GRANT INSERT, UPDATE ON traducciones TO authenticated;

-- Referencia territorial (solo lectura)
GRANT SELECT ON paises TO anon, authenticated;
GRANT SELECT ON divisiones_1 TO anon, authenticated;
GRANT SELECT ON divisiones_2 TO anon, authenticated;
GRANT SELECT ON municipios TO anon, authenticated;
GRANT SELECT ON diocesis TO anon, authenticated;
GRANT SELECT ON parroquias TO anon, authenticated;
GRANT SELECT ON localidades TO anon, authenticated;
GRANT SELECT ON codigos_postales TO anon, authenticated;

-- Redes migratorias (solo lectura)
GRANT SELECT ON barcos TO anon, authenticated;
GRANT SELECT ON puertos TO anon, authenticated;
GRANT SELECT ON eventos_migratorios TO anon, authenticated;
