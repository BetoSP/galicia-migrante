-- Migration 022 — Pre-traducciones de posts del blog
-- Almacena las traducciones de posts al momento de publicación para servir
-- a visitantes no autenticados sin consumir cuota de API por visita.
-- Ejecutar en Supabase SQL Editor.

BEGIN;

CREATE TABLE IF NOT EXISTS blog_post_translations (
  post_id      UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  lang         TEXT NOT NULL CHECK (lang IN ('gl', 'en', 'fr', 'de', 'it')),
  titulo       TEXT,
  extracto     TEXT,
  contenido    TEXT,
  traducido_en TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (post_id, lang)
);

ALTER TABLE blog_post_translations ENABLE ROW LEVEL SECURITY;

-- Cualquier visitante (anon + auth) puede leer traducciones de posts publicados
CREATE POLICY "blog_translations_select_published"
  ON blog_post_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = blog_post_translations.post_id
        AND blog_posts.estado = 'publicado'
    )
  );

-- Solo admins pueden insertar/actualizar/eliminar traducciones
CREATE POLICY "blog_translations_write_admin"
  ON blog_post_translations FOR ALL
  USING (public.es_admin_general())
  WITH CHECK (public.es_admin_general());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'blog_post_translations'
  ) THEN
    RAISE EXCEPTION 'Verificación fallida: tabla blog_post_translations no existe';
  END IF;
  RAISE NOTICE 'Migration 022 OK — blog_post_translations creada con RLS.';
END $$;

COMMIT;
