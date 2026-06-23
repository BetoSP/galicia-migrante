-- ═══════════════════════════════════════════════════════════════
-- Migración 006 — Importador GEDCOM tolerante
-- Galicia Migrante — 17 de mayo de 2026
-- ═══════════════════════════════════════════════════════════════
-- Agrega dos columnas a personas_arbol para soportar el importador
-- GEDCOM tolerante con recuperación de errores:
--
--   gedcom_raw      TEXT     — Bloque GEDCOM original para registros
--                              en cuarentena (acceso manual posterior)
--   gedcom_warnings JSONB    — Array de advertencias/errores detectados
--                              durante el parseo
--
-- Nota: el campo estado (TEXT DEFAULT 'vivo') ya existe sin CHECK
-- constraint. Los valores 'borrador' y 'cuarentena' se usan para
-- registros importados con errores — no requieren cambio de schema.
-- ═══════════════════════════════════════════════════════════════

BEGIN;

ALTER TABLE personas_arbol
  ADD COLUMN IF NOT EXISTS gedcom_raw      TEXT;

ALTER TABLE personas_arbol
  ADD COLUMN IF NOT EXISTS gedcom_warnings JSONB DEFAULT '[]';

-- ── Verificación dentro de la transacción ────────────────────────
DO $$
DECLARE
  col_raw  BOOLEAN;
  col_warn BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'personas_arbol' AND column_name = 'gedcom_raw'
  ) INTO col_raw;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'personas_arbol' AND column_name = 'gedcom_warnings'
  ) INTO col_warn;

  IF NOT col_raw  THEN RAISE EXCEPTION 'Migración 006 fallida: gedcom_raw no se creó'; END IF;
  IF NOT col_warn THEN RAISE EXCEPTION 'Migración 006 fallida: gedcom_warnings no se creó'; END IF;

  RAISE NOTICE '✅ Migración 006 OK — gedcom_raw + gedcom_warnings añadidos a personas_arbol';
END $$;

COMMIT;
