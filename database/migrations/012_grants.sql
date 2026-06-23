-- Migration 012 — GRANTs explícitos para todas las tablas del schema public
-- Supabase requiere GRANTs explícitos a partir del 30/10/2026 para tablas nuevas.
-- Esta migración los aplica a las 42 tablas existentes y a la vista usuario_permisos.
-- Los GRANTs habilitan el acceso desde supabase-js/PostgREST.
-- Las políticas RLS (migraciones 002 y 008) controlan qué puede hacer cada rol.
-- Aplicar en Supabase SQL Editor o con: cd backend && node scripts/run-migration.js

BEGIN;

-- ── Datos de usuario: genealogía ──────────────────────────────────

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

-- ── Datos de usuario: actividad y auditoría ───────────────────────

GRANT SELECT ON actividad TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON actividad TO authenticated;

GRANT SELECT ON admin_audit_log TO authenticated;
-- admin_audit_log: sin escritura directa desde PostgREST (solo INSERT por triggers/RPC)

-- ── Datos de usuario: suscripciones y permisos ───────────────────

GRANT SELECT ON suscripciones TO authenticated;
GRANT INSERT, UPDATE, DELETE ON suscripciones TO authenticated;

GRANT SELECT ON usuario_features TO authenticated;
GRANT INSERT, UPDATE, DELETE ON usuario_features TO authenticated;

-- Vista de permisos efectivos (plan activo + overrides individuales)
GRANT SELECT ON usuario_permisos TO authenticated;

-- ── RBAC ─────────────────────────────────────────────────────────

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

-- ── Planes y features ────────────────────────────────────────────

GRANT SELECT ON planes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON planes TO authenticated;

GRANT SELECT ON planes_permisos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON planes_permisos TO authenticated;

GRANT SELECT ON features TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON features TO authenticated;

GRANT SELECT ON plan_features TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON plan_features TO authenticated;

-- ── Configuración ─────────────────────────────────────────────────

GRANT SELECT ON arbol_config TO anon, authenticated;
GRANT INSERT, UPDATE ON arbol_config TO authenticated;

GRANT SELECT ON portal_config TO anon, authenticated;
GRANT INSERT, UPDATE ON portal_config TO authenticated;

-- ── Asociaciones y portal ────────────────────────────────────────

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

-- ── Datos de referencia: territorial (solo lectura) ───────────────

GRANT SELECT ON paises TO anon, authenticated;
GRANT SELECT ON divisiones_1 TO anon, authenticated;
GRANT SELECT ON divisiones_2 TO anon, authenticated;
GRANT SELECT ON municipios TO anon, authenticated;
GRANT SELECT ON diocesis TO anon, authenticated;
GRANT SELECT ON parroquias TO anon, authenticated;
GRANT SELECT ON localidades TO anon, authenticated;
GRANT SELECT ON codigos_postales TO anon, authenticated;

-- ── Datos de referencia: redes migratorias (solo lectura) ─────────

GRANT SELECT ON barcos TO anon, authenticated;
GRANT SELECT ON puertos TO anon, authenticated;
GRANT SELECT ON eventos_migratorios TO anon, authenticated;

-- ── Verificación ──────────────────────────────────────────────────
DO $$
BEGIN
  RAISE NOTICE 'Migration 012 OK — GRANTs aplicados a 42 tablas y vista usuario_permisos';
END $$;

COMMIT;
