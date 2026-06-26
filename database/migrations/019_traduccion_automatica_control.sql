-- Migración 019: Motor de traducción automática de contenidos y control de sobreescritura manual

BEGIN;

-- 1. AGREGAR COLUMNAS DE CONTROL EN TABLA ASOCIACIONES
ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS descripcion_manual_gl BOOLEAN DEFAULT false;
ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS descripcion_manual_en BOOLEAN DEFAULT false;

ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS historia_manual_gl BOOLEAN DEFAULT false;
ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS historia_manual_en BOOLEAN DEFAULT false;

ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS finalidades_manual_gl BOOLEAN DEFAULT false;
ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS finalidades_manual_en BOOLEAN DEFAULT false;


-- 2. AGREGAR COLUMNAS DE CONTROL EN TABLA ASOCIACIONES_NOTICIAS
ALTER TABLE asociaciones_noticias ADD COLUMN IF NOT EXISTS titulo_manual_gl BOOLEAN DEFAULT false;
ALTER TABLE asociaciones_noticias ADD COLUMN IF NOT EXISTS titulo_manual_en BOOLEAN DEFAULT false;

ALTER TABLE asociaciones_noticias ADD COLUMN IF NOT EXISTS contenido_manual_gl BOOLEAN DEFAULT false;
ALTER TABLE asociaciones_noticias ADD COLUMN IF NOT EXISTS contenido_manual_en BOOLEAN DEFAULT false;


-- 3. AGREGAR COLUMNAS DE CONTROL EN TABLA EVENTOS
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS titulo_manual_gl BOOLEAN DEFAULT false;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS titulo_manual_en BOOLEAN DEFAULT false;

ALTER TABLE eventos ADD COLUMN IF NOT EXISTS descripcion_manual_gl BOOLEAN DEFAULT false;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS descripcion_manual_en BOOLEAN DEFAULT false;


-- 4. FUNCIÓN TRIGGER PARA DETECTAR CAMBIOS EN EL ORIGINAL Y RESETEAR BLOQUEOS
CREATE OR REPLACE FUNCTION trg_fn_reset_translations_on_original_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- A. Tabla asociaciones
  IF TG_TABLE_NAME = 'asociaciones' THEN
    IF (OLD.descripcion_es IS DISTINCT FROM NEW.descripcion_es) THEN
      NEW.descripcion_manual_gl := false;
      NEW.descripcion_manual_en := false;
    END IF;
    IF (OLD.historia_es IS DISTINCT FROM NEW.historia_es) THEN
      NEW.historia_manual_gl := false;
      NEW.historia_manual_en := false;
    END IF;
    IF (OLD.finalidades_es IS DISTINCT FROM NEW.finalidades_es) THEN
      NEW.finalidades_manual_gl := false;
      NEW.finalidades_manual_en := false;
    END IF;
  END IF;

  -- B. Tabla asociaciones_noticias
  IF TG_TABLE_NAME = 'asociaciones_noticias' THEN
    IF (OLD.titulo_es IS DISTINCT FROM NEW.titulo_es) THEN
      NEW.titulo_manual_gl := false;
      NEW.titulo_manual_en := false;
    END IF;
    IF (OLD.contenido_es IS DISTINCT FROM NEW.contenido_es) THEN
      NEW.contenido_manual_gl := false;
      NEW.contenido_manual_en := false;
    END IF;
  END IF;

  -- C. Tabla eventos
  IF TG_TABLE_NAME = 'eventos' THEN
    IF (OLD.titulo_es IS DISTINCT FROM NEW.titulo_es) THEN
      NEW.titulo_manual_gl := false;
      NEW.titulo_manual_en := false;
    END IF;
    IF (OLD.descripcion_es IS DISTINCT FROM NEW.descripcion_es) THEN
      NEW.descripcion_manual_gl := false;
      NEW.descripcion_manual_en := false;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;


-- 5. CREACIÓN DE TRIGGERS
DROP TRIGGER IF EXISTS trg_asociaciones_reset_translations ON asociaciones;
CREATE TRIGGER trg_asociaciones_reset_translations
  BEFORE UPDATE ON asociaciones
  FOR EACH ROW EXECUTE FUNCTION trg_fn_reset_translations_on_original_change();

DROP TRIGGER IF EXISTS trg_noticias_reset_translations ON asociaciones_noticias;
CREATE TRIGGER trg_noticias_reset_translations
  BEFORE UPDATE ON asociaciones_noticias
  FOR EACH ROW EXECUTE FUNCTION trg_fn_reset_translations_on_original_change();

DROP TRIGGER IF EXISTS trg_eventos_reset_translations ON eventos;
CREATE TRIGGER trg_eventos_reset_translations
  BEFORE UPDATE ON eventos
  FOR EACH ROW EXECUTE FUNCTION trg_fn_reset_translations_on_original_change();

COMMIT;
