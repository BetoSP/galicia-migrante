-- ═══════════════════════════════════════════════════════════════
-- Migración 003 — Trigger para auto-crear registro en usuarios
--
-- Problema: sitios_familiares.propietario_id referencia usuarios.id
-- (FK), pero Supabase Auth crea el usuario en auth.users y no en
-- public.usuarios automáticamente. Si el registro en usuarios no
-- existe, el INSERT en sitios_familiares falla con FK violation.
--
-- Solución: trigger AFTER INSERT ON auth.users que crea el registro
-- en public.usuarios con ON CONFLICT DO NOTHING (idempotente).
-- También se hace backfill de auth.users existentes sin registro.
-- ═══════════════════════════════════════════════════════════════

-- ── Función del trigger ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nombre, apellido)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre',   ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ── Trigger en auth.users ─────────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ── Backfill: registros faltantes en public.usuarios ─────────────
-- Crea registros para auth.users que no tienen fila en public.usuarios
INSERT INTO public.usuarios (id, email, nombre, apellido)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'nombre',   ''),
  COALESCE(au.raw_user_meta_data->>'apellido', '')
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.usuarios u WHERE u.id = au.id
);
