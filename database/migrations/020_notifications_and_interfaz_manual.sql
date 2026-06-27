-- Migración 020: Sistema de notificaciones y control manual de traducciones de interfaz
-- Extiende el sistema de banderas _manual a traducciones_interfaz y crea la
-- infraestructura de notificaciones para admin_general y traductor_delegado.

BEGIN;

-- ── 1. COLUMNA es_manual EN traducciones_interfaz ────────────────────────────
ALTER TABLE traducciones_interfaz
  ADD COLUMN IF NOT EXISTS es_manual BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN traducciones_interfaz.es_manual IS
  'true = la traducción fue editada manualmente. El automático no puede sobreescribirla hasta que cambie texto_por_defecto.';


-- ── 2. TABLA DE NOTIFICACIONES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notificaciones (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  destinatario_rol  TEXT        NOT NULL
                    CHECK (destinatario_rol IN ('admin_general', 'traductor_delegado')),
  tipo              TEXT        NOT NULL
                    CHECK (tipo IN ('traduccion_desbloqueada')),
  titulo            TEXT        NOT NULL,
  mensaje           TEXT        NOT NULL,
  referencia_tabla  TEXT        NOT NULL,
  referencia_id     TEXT        NOT NULL,
  referencia_campo  TEXT,
  idioma            TEXT        CHECK (idioma IN ('gl', 'en')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de lecturas: una fila por usuario que leyó la notificación
CREATE TABLE IF NOT EXISTS notificaciones_leidas (
  notificacion_id   UUID        NOT NULL REFERENCES notificaciones (id) ON DELETE CASCADE,
  usuario_id        UUID        NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
  leida_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (notificacion_id, usuario_id)
);

-- Índices de acceso frecuente
CREATE INDEX IF NOT EXISTS idx_notificaciones_rol_created
  ON notificaciones (destinatario_rol, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notificaciones_leidas_usuario
  ON notificaciones_leidas (usuario_id);

-- RLS
ALTER TABLE notificaciones          ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones_leidas   ENABLE ROW LEVEL SECURITY;

-- Lectura: solo usuarios cuyo rol coincide con destinatario_rol
CREATE POLICY "notificaciones_select_by_role"
  ON notificaciones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_roles ur
      JOIN roles r ON ur.rol_id = r.id
      WHERE ur.usuario_id = auth.uid()
        AND r.nombre = notificaciones.destinatario_rol
    )
  );

-- Inserción: solo el service role vía triggers (no desde el cliente)
CREATE POLICY "notificaciones_insert_service"
  ON notificaciones FOR INSERT
  WITH CHECK (false);

-- notificaciones_leidas: cada usuario gestiona sus propias marcas de lectura
CREATE POLICY "notificaciones_leidas_own"
  ON notificaciones_leidas FOR ALL
  USING (usuario_id = auth.uid())
  WITH CHECK (usuario_id = auth.uid());

GRANT SELECT ON notificaciones        TO authenticated;
GRANT SELECT, INSERT ON notificaciones_leidas TO authenticated;


-- ── 3. FUNCIÓN AUXILIAR: crear notificaciones para admin + traductor ──────────
CREATE OR REPLACE FUNCTION fn_crear_notificacion_traduccion(
  p_titulo          TEXT,
  p_mensaje         TEXT,
  p_referencia_tabla TEXT,
  p_referencia_id   TEXT,
  p_referencia_campo TEXT,
  p_idioma          TEXT
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO notificaciones
    (destinatario_rol, tipo, titulo, mensaje,
     referencia_tabla, referencia_id, referencia_campo, idioma)
  VALUES
    ('admin_general',      'traduccion_desbloqueada', p_titulo, p_mensaje,
     p_referencia_tabla, p_referencia_id, p_referencia_campo, p_idioma),
    ('traductor_delegado', 'traduccion_desbloqueada', p_titulo, p_mensaje,
     p_referencia_tabla, p_referencia_id, p_referencia_campo, p_idioma);
END;
$$;


-- ── 4. EXTENDER TRIGGER 019: notificar cuando se resetean banderas ─────────────
-- Reemplaza la función existente para agregar las notificaciones.
CREATE OR REPLACE FUNCTION trg_fn_reset_translations_on_original_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- A. Tabla asociaciones
  IF TG_TABLE_NAME = 'asociaciones' THEN
    IF OLD.descripcion_es IS DISTINCT FROM NEW.descripcion_es THEN
      IF NEW.descripcion_manual_gl THEN
        NEW.descripcion_manual_gl := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: descripción en gallego',
          format('El texto original en español de la asociación "%s" cambió. La traducción al gallego (editada manualmente) fue desbloqueada.', NEW.nombre),
          'asociaciones', NEW.id::TEXT, 'descripcion', 'gl');
      END IF;
      IF NEW.descripcion_manual_en THEN
        NEW.descripcion_manual_en := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: descripción en inglés',
          format('El texto original en español de la asociación "%s" cambió. La traducción al inglés (editada manualmente) fue desbloqueada.', NEW.nombre),
          'asociaciones', NEW.id::TEXT, 'descripcion', 'en');
      END IF;
    END IF;
    IF OLD.historia_es IS DISTINCT FROM NEW.historia_es THEN
      IF NEW.historia_manual_gl THEN
        NEW.historia_manual_gl := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: historia en gallego',
          format('La historia de la asociación "%s" cambió. La traducción al gallego fue desbloqueada.', NEW.nombre),
          'asociaciones', NEW.id::TEXT, 'historia', 'gl');
      END IF;
      IF NEW.historia_manual_en THEN
        NEW.historia_manual_en := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: historia en inglés',
          format('La historia de la asociación "%s" cambió. La traducción al inglés fue desbloqueada.', NEW.nombre),
          'asociaciones', NEW.id::TEXT, 'historia', 'en');
      END IF;
    END IF;
    IF OLD.finalidades_es IS DISTINCT FROM NEW.finalidades_es THEN
      IF NEW.finalidades_manual_gl THEN
        NEW.finalidades_manual_gl := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: finalidades en gallego',
          format('Las finalidades de la asociación "%s" cambiaron. La traducción al gallego fue desbloqueada.', NEW.nombre),
          'asociaciones', NEW.id::TEXT, 'finalidades', 'gl');
      END IF;
      IF NEW.finalidades_manual_en THEN
        NEW.finalidades_manual_en := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: finalidades en inglés',
          format('Las finalidades de la asociación "%s" cambiaron. La traducción al inglés fue desbloqueada.', NEW.nombre),
          'asociaciones', NEW.id::TEXT, 'finalidades', 'en');
      END IF;
    END IF;
  END IF;

  -- B. Tabla asociaciones_noticias
  IF TG_TABLE_NAME = 'asociaciones_noticias' THEN
    IF OLD.titulo_es IS DISTINCT FROM NEW.titulo_es THEN
      IF NEW.titulo_manual_gl THEN
        NEW.titulo_manual_gl := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: título de noticia en gallego',
          format('El título de una noticia cambió. La traducción al gallego fue desbloqueada. ID: %s', NEW.id),
          'asociaciones_noticias', NEW.id::TEXT, 'titulo', 'gl');
      END IF;
      IF NEW.titulo_manual_en THEN
        NEW.titulo_manual_en := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: título de noticia en inglés',
          format('El título de una noticia cambió. La traducción al inglés fue desbloqueada. ID: %s', NEW.id),
          'asociaciones_noticias', NEW.id::TEXT, 'titulo', 'en');
      END IF;
    END IF;
    IF OLD.contenido_es IS DISTINCT FROM NEW.contenido_es THEN
      IF NEW.contenido_manual_gl THEN
        NEW.contenido_manual_gl := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: contenido de noticia en gallego',
          format('El contenido de una noticia cambió. La traducción al gallego fue desbloqueada. ID: %s', NEW.id),
          'asociaciones_noticias', NEW.id::TEXT, 'contenido', 'gl');
      END IF;
      IF NEW.contenido_manual_en THEN
        NEW.contenido_manual_en := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: contenido de noticia en inglés',
          format('El contenido de una noticia cambió. La traducción al inglés fue desbloqueada. ID: %s', NEW.id),
          'asociaciones_noticias', NEW.id::TEXT, 'contenido', 'en');
      END IF;
    END IF;
  END IF;

  -- C. Tabla eventos
  IF TG_TABLE_NAME = 'eventos' THEN
    IF OLD.titulo_es IS DISTINCT FROM NEW.titulo_es THEN
      IF NEW.titulo_manual_gl THEN
        NEW.titulo_manual_gl := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: título de evento en gallego',
          format('El título del evento "%s" cambió. La traducción al gallego fue desbloqueada.', OLD.titulo_es),
          'eventos', NEW.id::TEXT, 'titulo', 'gl');
      END IF;
      IF NEW.titulo_manual_en THEN
        NEW.titulo_manual_en := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: título de evento en inglés',
          format('El título del evento "%s" cambió. La traducción al inglés fue desbloqueada.', OLD.titulo_es),
          'eventos', NEW.id::TEXT, 'titulo', 'en');
      END IF;
    END IF;
    IF OLD.descripcion_es IS DISTINCT FROM NEW.descripcion_es THEN
      IF NEW.descripcion_manual_gl THEN
        NEW.descripcion_manual_gl := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: descripción de evento en gallego',
          format('La descripción del evento "%s" cambió. La traducción al gallego fue desbloqueada.', NEW.titulo_es),
          'eventos', NEW.id::TEXT, 'descripcion', 'gl');
      END IF;
      IF NEW.descripcion_manual_en THEN
        NEW.descripcion_manual_en := false;
        PERFORM fn_crear_notificacion_traduccion(
          'Traducción desbloqueada: descripción de evento en inglés',
          format('La descripción del evento "%s" cambió. La traducción al inglés fue desbloqueada.', NEW.titulo_es),
          'eventos', NEW.id::TEXT, 'descripcion', 'en');
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;


-- ── 5. TRIGGER PARA traducciones_interfaz ────────────────────────────────────
-- Cuando texto_por_defecto cambia y es_manual = true: desbloquear y notificar.
CREATE OR REPLACE FUNCTION trg_fn_interfaz_reset_on_default_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.texto_por_defecto IS DISTINCT FROM NEW.texto_por_defecto
     AND NEW.es_manual = true THEN
    NEW.es_manual := false;
    PERFORM fn_crear_notificacion_traduccion(
      format('Traducción de interfaz desbloqueada: %s [%s]', NEW.clave, NEW.idioma),
      format('El texto base de la clave "%s" cambió. La traducción manual en "%s" fue desbloqueada y será regenerada automáticamente.', NEW.clave, NEW.idioma),
      'traducciones_interfaz', NEW.id::TEXT, NEW.clave, NEW.idioma);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_interfaz_reset_on_default_change ON traducciones_interfaz;
CREATE TRIGGER trg_interfaz_reset_on_default_change
  BEFORE UPDATE ON traducciones_interfaz
  FOR EACH ROW EXECUTE FUNCTION trg_fn_interfaz_reset_on_default_change();


-- ── 6. VERIFICACIÓN ──────────────────────────────────────────────────────────
DO $$
DECLARE
  has_manual_col     BOOLEAN;
  has_notif_table    BOOLEAN;
  has_leidas_table   BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'traducciones_interfaz'
      AND column_name = 'es_manual'
  ) INTO has_manual_col;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'notificaciones'
  ) INTO has_notif_table;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'notificaciones_leidas'
  ) INTO has_leidas_table;

  IF NOT has_manual_col THEN
    RAISE EXCEPTION 'Fallo: columna es_manual no fue creada en traducciones_interfaz';
  END IF;
  IF NOT has_notif_table THEN
    RAISE EXCEPTION 'Fallo: tabla notificaciones no fue creada';
  END IF;
  IF NOT has_leidas_table THEN
    RAISE EXCEPTION 'Fallo: tabla notificaciones_leidas no fue creada';
  END IF;

  RAISE NOTICE 'Migración 020 OK — es_manual, notificaciones y triggers verificados.';
END $$;

COMMIT;
