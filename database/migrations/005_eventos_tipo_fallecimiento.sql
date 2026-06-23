BEGIN;

DO $$
BEGIN
  ALTER TABLE eventos_familiares DROP CONSTRAINT IF EXISTS eventos_familiares_tipo_check;
  ALTER TABLE eventos_familiares
    ADD CONSTRAINT eventos_familiares_tipo_check
    CHECK (tipo IN ('cumpleanos','aniversario','fallecimiento_aniv','otro'));

  RAISE NOTICE 'Migration 005: fallecimiento_aniv added to eventos_familiares.tipo CHECK';
END $$;

COMMIT;
