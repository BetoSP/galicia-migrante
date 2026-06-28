-- Migration 023 — Flag de traducción manual en blog_post_translations
-- Permite a traductores humanos editar traducciones sin que sean sobreescritas
-- en futuras re-aprobaciones del post.

BEGIN;

ALTER TABLE blog_post_translations
  ADD COLUMN IF NOT EXISTS es_manual BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN blog_post_translations.es_manual IS
  'true = editada por traductor humano; el flujo de aprobación automática no la sobreescribe';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_post_translations' AND column_name = 'es_manual'
  ) THEN
    RAISE EXCEPTION 'Verificación fallida: columna es_manual no existe';
  END IF;
  RAISE NOTICE 'Migration 023 OK — es_manual agregada a blog_post_translations.';
END $$;

COMMIT;
