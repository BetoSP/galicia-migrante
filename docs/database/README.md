# Base de datos — Galicia Migrante

Esta carpeta contiene el esquema completo de la base de datos del portal y todas las migraciones de Supabase.

## Origen

Las migraciones `001`–`012` fueron rescatadas del repositorio legacy (`galicia-migrante-legacy`) 
el 23 de junio de 2026. El proyecto legacy nunca llegó a producción real, pero tenía un esquema 
de base de datos muy completo y bien diseñado.

## Estado de las migraciones

| Migración | Descripción | Estado en el nuevo proyecto |
|---|---|---|
| `001_expand_personas_arbol` | Campos extendidos del modal de persona (nombres, fechas granulares) | ⏳ Pendiente de aplicar |
| `002_rls_policies` | Políticas RLS para acceso directo desde frontend sin backend | ⏳ Pendiente de aplicar |
| `003_auto_create_usuario_trigger` | Trigger que crea `public.usuarios` al registrarse en Supabase Auth | ⏳ Pendiente de aplicar |
| `004_schema_expansion` | Sistema territorial (parroquias, municipios, divisiones), relaciones flexibles, redes migratorias (puertos, barcos) | ⏳ Pendiente de aplicar |
| `005_eventos_tipo_fallecimiento` | Agrega tipo `fallecimiento` a eventos familiares | ⏳ Pendiente de aplicar |
| `006_gedcom_tolerant_import` | Columnas para importación GEDCOM tolerante con cuarentena | ⏳ Pendiente de aplicar |
| `007_add_tipo_sin_raices` | Agrega tipo `sin_raices` a `personas_arbol.tipo` | ⏳ Pendiente de aplicar |
| `008_admin_rls` | Políticas RLS para panel de administración | ⏳ Pendiente de aplicar |
| `009_arbol_config` | Tabla de configuración por árbol (layout, display) | ⏳ Pendiente de aplicar |
| `010_feature_flags` | Feature flags por usuario y global | ⏳ Pendiente de aplicar |
| `011_portal_config` | Configuración global del portal | ⏳ Pendiente de aplicar |
| `012_grants` | Grants de permisos a roles anon/authenticated | ⏳ Pendiente de aplicar |

## Notas importantes

### ⚠️ Migración 004 — Orden crítico
La migración `004` es la más compleja. Crea ~18 tablas nuevas y **elimina las columnas 
`padre_id`, `madre_id`, `conyugue_id`** de `personas_arbol`. Verificar que no haya 
datos en esas columnas antes de aplicar, o adaptar el script de migración de datos.

### ✅ El motor de renderizado del árbol NO viene del legacy
El motor actual (`Arbol Genealogico/arbol/src/graph/`) fue escrito desde cero en el 
proyecto actual. El motor legacy (`genealogyLayout.js`) tenía un bug estructural 
irresolvible con "hub persons" y fue descartado por completo.

### 📋 Flujo para aplicar en Supabase
1. Crear proyecto nuevo en Supabase (o usar el existente)
2. Aplicar migraciones en orden estricto: `001` → `002` → ... → `012`
3. Aplicar via SQL Editor de Supabase o via `psql` con la connection string

## Archivos

- `schema.sql` — Esquema completo (fuente de verdad, post migración 012)
- `PRD_legacy.md` — PRD del proyecto legacy (referencia histórica)
- `migrations/` — Scripts SQL numerados, aplicar en orden
