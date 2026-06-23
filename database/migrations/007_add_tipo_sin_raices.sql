-- Migration 007: Add 'sin_raices' to personas_arbol.tipo CHECK constraint
-- Applies to: Supabase (PostgreSQL)
-- Run: node backend/scripts/run-migration.js 007_add_tipo_sin_raices.sql

BEGIN;

DO $$
BEGIN
  -- Drop existing constraint (auto-named by PostgreSQL on inline CHECK)
  ALTER TABLE personas_arbol
    DROP CONSTRAINT IF EXISTS personas_arbol_tipo_check;

  -- Re-add with sin_raices included
  ALTER TABLE personas_arbol
    ADD CONSTRAINT personas_arbol_tipo_check
    CHECK (tipo IN ('galicia','emigrante','diaspora','retornado','sin_raices'));

  RAISE NOTICE 'Migration 007: tipo CHECK constraint updated — sin_raices added';
END $$;

COMMIT;
