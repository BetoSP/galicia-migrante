-- Migration 021 — Blog: flujo completo de posts de usuario
-- Amplía estados, actualiza RLS para permitir a cualquier usuario autenticado crear posts,
-- y agrega columna motivo_rechazo para feedback editorial.
-- Ejecutar en Supabase SQL Editor.

BEGIN;

-- ── 1. Ampliar estados permitidos ────────────────────────────────────────────
-- El CHECK original solo admitía: 'provisorio', 'publicado', 'bloqueado'
-- Nuevo modelo:
--   borrador     → el usuario guardó pero no envió
--   en_revision  → el usuario envió para aprobación
--   publicado    → el admin aprobó
--   rechazado    → el admin rechazó (con motivo opcional)
--   bloqueado    → el admin bloqueó por incumplimiento de normas

ALTER TABLE blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_estado_check;

ALTER TABLE blog_posts
  ADD CONSTRAINT blog_posts_estado_check
    CHECK (estado IN ('borrador', 'en_revision', 'publicado', 'rechazado', 'bloqueado'));

-- Migrar posts con estado 'provisorio' al nuevo estado 'en_revision'
UPDATE blog_posts SET estado = 'en_revision' WHERE estado = 'provisorio';

-- ── 2. Columna para motivo de rechazo ────────────────────────────────────────
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS motivo_rechazo TEXT;

-- ── 3. Actualizar políticas RLS ───────────────────────────────────────────────

-- 3a. Eliminar políticas antiguas
DROP POLICY IF EXISTS "blog_posts_select_published"    ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_select_own_or_admin" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_insert_auth"         ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_update_own"          ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_delete_own_or_admin" ON blog_posts;

-- 3b. SELECT: posts publicados → cualquiera (anon + auth)
CREATE POLICY "blog_posts_select_published"
  ON blog_posts FOR SELECT
  USING (estado = 'publicado');

-- 3c. SELECT: propios (cualquier estado) + admin ve todo
CREATE POLICY "blog_posts_select_own_or_admin"
  ON blog_posts FOR SELECT
  USING (
    auth.uid() = autor_id
    OR public.es_admin_general()
  );

-- 3d. INSERT: cualquier usuario autenticado puede crear posts propios
--     El estado inicial solo puede ser 'borrador' o 'en_revision'
CREATE POLICY "blog_posts_insert_auth"
  ON blog_posts FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = autor_id
    AND estado IN ('borrador', 'en_revision')
  );

-- 3e. UPDATE: el autor puede editar sus borradores y posts en revisión
--     El admin puede cambiar estado a cualquier valor (incluyendo publicado/rechazado)
CREATE POLICY "blog_posts_update_own"
  ON blog_posts FOR UPDATE
  USING (
    (auth.uid() = autor_id AND estado IN ('borrador', 'en_revision', 'rechazado'))
    OR public.es_admin_general()
  )
  WITH CHECK (
    (auth.uid() = autor_id AND estado IN ('borrador', 'en_revision', 'rechazado'))
    OR public.es_admin_general()
  );

-- 3f. DELETE: el autor puede borrar sus propios posts no publicados; el admin borra cualquiera
CREATE POLICY "blog_posts_delete_own_or_admin"
  ON blog_posts FOR DELETE
  USING (
    (auth.uid() = autor_id AND estado != 'publicado')
    OR public.es_admin_general()
  );

-- ── 4. Verificación ──────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'motivo_rechazo'
  ) THEN
    RAISE EXCEPTION 'Verificación fallida: columna motivo_rechazo no existe';
  END IF;
  RAISE NOTICE 'Migration 021 OK — Estados ampliados, RLS actualizado, motivo_rechazo agregado.';
END $$;

COMMIT;
