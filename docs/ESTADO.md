# ESTADO — Galicia Migrante
### Estado del desarrollo del ecosistema
**Versión:** 1.1 — 24 de junio de 2026
**Mantenimiento:** actualizar después de cada sesión de trabajo significativa.

---

## Arquitectura Unificada (Next.js App Router)

A partir del 24 de junio de 2026, la arquitectura basada en workspaces npm (`modules/` y `shared/`) fue eliminada. Toda la funcionalidad (Portal, Blog, Árbol Genealógico y placeholders de módulos) fue consolidada en una única aplicación Next.js.

```
Portal Galicia Migrante/            ← Next.js App
├── app/                            ← Rutas del Portal y Módulos
│   ├── arbol/                      ← Módulo Árbol Genealógico
│   ├── biblioteca/                 ← Placeholder del módulo Biblioteca
│   ├── blog/                       ← Módulo Blog dinámico
│   ├── investigacion/              ← Placeholder del módulo Investigación
│   ├── lugar-galicia/              ← Placeholder de "Tu lugar en Galicia"
│   ├── quienes-somos/              ← Quiénes somos
│   ├── xunta/                      ← Trámites Xunta
│   └── ...                         ← Layouts, estilos y páginas globales
├── components/                     ← Componentes compartidos del portal (Navbar, Footer, etc.)
│   └── arbol/                      ← Componentes del Árbol Genealógico
├── content/
│   └── posts/                      ← Artículos en MDX (Blog)
├── database/
│   └── migrations/                 ← Migraciones de base de datos
├── docs/                           ← Documentación centralizada
├── lib/
│   ├── arbol/                      ← Lógica, utilidades y servicios del Árbol Genealógico
│   ├── posts.js                    ← Lógica de lectura MDX
│   └── supabase.js                 ← Cliente Supabase centralizado
├── public/                         ← Activos estáticos públicos
├── locales/                        ← Archivos de internacionalización (GL, ES, EN)
└── package.json                    ← Dependencias consolidadas (Next.js 16 + React 19 + Supabase + MDX)
```

---

## ✅ PROBLEMA CRÍTICO RESUELTO: Duplicación raíz / portal

**Descripción:** La duplicación entre la raíz y la carpeta `portal/` ha sido resuelta. El módulo `portal/` fue completamente eliminado e integrado en la raíz del proyecto. El portal ahora corre directamente desde la raíz usando Next.js. Las dependencias fueron consolidadas en el `package.json` raíz.

---

## Sub-proyecto 1: Portal Público

**Stack:** Next.js 16 · React 19 · CSS Modules · Vanilla CSS
**Dominio configurado:** `portal.galiciamigrante.com`

### Rutas implementadas

| Ruta | Datos | Estado |
|---|---|---|
| `/` | 3 eventos y 6 servicios hardcodeados | ✅ Estático |
| `/quienes-somos` | Estático | ✅ |
| `/asociaciones` | 6 asociaciones hardcodeadas | ✅ Estático |
| `/agenda` | 4 eventos hardcodeados | ✅ Estático |
| `/xunta` | 4 items Xunta + 4 items España | ✅ Estático |

### Rutas faltantes o rotas

| Ruta | Problema |
|---|---|
| `/blog` | Integrado correctamente en el portal en la raíz |
| `/gobierno-espana` | **Resuelto** — redirección a `/xunta` operativa |
| Auth (login/registro) | Solo existe en el árbol — no integrada al portal |

### Componentes del portal
- **Navbar:** scroll-aware, dropdown "Tus orígenes", auth buttons hacia el árbol, menú móvil, enlace al `/blog` unificado.
- **Footer:** 3 columnas de links — corregido el enlace que apuntaba a `/gobierno-espana` hacia `/xunta`.

### Pendientes del portal

- ☐ Conectar agenda a Supabase (dejar de ser estática)
- ☐ Conectar asociaciones a Supabase (dejar de ser estáticas)
- ☐ Integrar auth desde el portal
- ☐ Multiidioma GL/EN (solo ES implementado)

---

## Sub-proyecto 2: Blog

**Stack:** Next.js 16 · MDX · gray-matter · next-mdx-remote · React 19
**Estado:** ✅ Completado, diseñado con tipografía premium e integrado con AdSlot colapsable.

### Rutas
```
/blog          → listado de posts
/blog/[slug]   → post individual (ruta dinámica)
```

### Librerías MDX
`@mdx-js/loader`, `@mdx-js/react`, `@next/mdx`, `gray-matter`, `next-mdx-remote`

### Estado del contenido
- `content/posts/bienvenidos.mdx` — Bienvenidos al Blog de Galicia Migrante
- `content/posts/historia-del-centro-gallego-de-buenos-aires.mdx` — La Epopeya del Centro Gallego de Buenos Aires
- `content/posts/guia-ley-nietos-nacionalidad-espanola.mdx` — Guía Práctica de la Ley de Nietos

### Pendientes del Blog
- [x] Crear posts reales de contenido de prueba para validación.
- [x] Diseñar interfaces premium de listado y lectura (Outfit + Lora) con variables del monorepo.
- [x] Integrar anuncios colapsables `<AdSlot />` en la cabecera y el pie de los artículos.

---

## Sub-proyecto 3: Árbol Genealógico

**Stack:** React 19 · Vite 8 · Supabase (PostgreSQL + RLS) · TailwindCSS 4
**Repo GitHub:** `BetoSP/Clon_de_My_Heritage` (branch: master)
**Documentación propia:** `Arbol Genealogico/PROJECT_CONTEXT.md`, `DECISIONS.md`, `LEGADO_FUTURO.md`

### Estado funcional — lo que funciona

| Funcionalidad | Estado |
|---|---|
| Motor de grafo (`buildFamilyGraph` + `layoutFamilyGraph`) | ✅ |
| Visualización SVG con pan & zoom | ✅ |
| CRUD completo personas + relaciones | ✅ |
| 7 COUPLE_TYPES + 8 PARENT_TYPES | ✅ |
| Subgrafo por foco via RPC `get_subgraph` | ✅ |
| ProfileDrawer (sidebar 420px, margen izquierdo) | ✅ |
| Edición inline biográfica + familia navegable en el drawer | ✅ |
| Disolución y eliminación de pareja | ✅ |
| ResizeObserver → variables CSS dinámicas de layout | ✅ |
| PersonModal rediseñado (prefijo/sufijo, precisión de fechas, autocompletado) | ✅ |
| `migration_condition` en tabla people + UI | ✅ |
| Fondo del nodo por condición migratoria | ✅ |
| Banda diagonal en nodo para fallecidos | ✅ |
| ModuleNavBar (2 filas, selector de árbol, panel ♿) | ✅ |
| ModuleHomePage (dashboard: eventos, stats, miembros) | ✅ |
| GEDCOM import tolerante (pipeline 6 capas) | ✅ |

### Bugs abiertos

| ID | Descripción | Prioridad |
|---|---|---|
| BUG-03 | Líneas diagonales en hijos casados | Alta |
| BUG-04 | Nodos fantasma con coordenadas negativas | Media |
| BUG-05 | Slider de generaciones sin foco activo | Media |
| BUG-06 | Botón de cierre del ghost mode no visible | Media |
| BUG-07 | Nodos fantasma aparecen lejos del nodo activo | Media |
| BUG-08 | Doble estado visual violeta inconsistente | Media |
| BUG-09 | Indicador visual de foco — solución definitiva pendiente | Baja |
| BUG-10 | Línea punteada de selección eliminada temporalmente | Baja |

### Deuda técnica importante del árbol

| Item | Descripción |
|---|---|
| `TopNavBar.jsx` huérfano | Componente sin uso — pendiente eliminar |
| `testGraph.js` desactualizado | Usa tipos legacy (`spouse`, `biological_father`) vs actuales (`married`, `father`) |
| `tree_id` no conectado | La tabla `trees` existe pero `people` y `relationships` no tienen `tree_id` — multi-árbol no funcional |
| `derived_relationships` | Tabla de relaciones precalculadas — marcada pendiente en DECISIONS [028] |
| Edición ampliada | PROMPT_016 referenciado en DECISIONS [047] pero no existe en código |
| Campo `adopted` obsoleto | Debe migrarse a tipos de relación explícitos (DECISIONS [027]) |
| Panel ♿ no aplica al SVG | El tamaño de fuente del DOM no se propaga al canvas SVG |

### Condición de integración al portal

El módulo se integra cuando tenga todos estos items:
- ✅ CRUD completo
- ✅ Barra del módulo
- ✅ Página de inicio
- ✅ ProfileDrawer (sidebar)
- ✅ GEDCOM import
- ⚠️ Tipos parentales completos (en Supabase — parcial)
- ❌ Perfil extendido (emigración, educación)
- ❌ Campos territoriales gallegos estructurados

---

## Base de datos

**Migraciones aplicadas:** 12 (001–012)
**Schema completo:** `database/schema.sql` (924 líneas)

> ⚠️ **NOTA IMPORTANTE:** El `schema.sql` de `database/` documenta el schema del portal integrado futuro (tablas: `personas_arbol`, `relaciones_persona`, `sitios_familiares`). La app del árbol en Supabase usa un schema propio simplificado (`people`, `relationships`, `trees`). Son dos schemas distintos — el `schema.sql` no refleja exactamente la DB real del árbol.

### Grupos de tablas

| Grupo | Tablas |
|---|---|
| Auth/usuarios | `usuarios`, `roles`, `permisos`, `roles_permisos`, `usuarios_roles` |
| Planes y features | `planes`, `suscripciones`, `features`, `plan_features`, `usuario_features` + vista `usuario_permisos` |
| Genealogía | `sitios_familiares`, `personas_arbol`, `relaciones_persona`, `eventos_familiares`, `documentos`, `testimonios`, `archivos`, `personas_arbol_historial` |
| Territorial | `paises`, `divisiones_1`, `divisiones_2`, `municipios`, `diocesis`, `parroquias`, `localidades`, `codigos_postales`, `direcciones` |
| Redes migratorias | `puertos`, `barcos`, `eventos_migratorios` |
| Portal | `asociaciones`, `asociaciones_directivos`, `asociaciones_noticias`, `eventos`, `modulos`, `traducciones`, `actividad`, `admin_audit_log` |
| Config | `arbol_config`, `portal_config` |

### Seed data
- **8 roles**, **16 permisos**, **3 planes** (Gratuito, Asociado, Asociación), **7 módulos**

---

## Lista maestra de pendientes

### 🔴 Urgente — deuda activa
- [x] Resolver duplicación raíz vs `portal/` — unificado en la raíz y eliminado módulo redundante.
- [x] Corregir enlace roto `/gobierno-espana` en Footer del portal.

> [!NOTE]
> **Decisión de Planificación:** Todas las tareas técnicas pendientes que afecten exclusivamente al módulo del Árbol Genealógico (tanto deuda activa como features de integración) se han aplazado formalmente para cuando se retome de forma exclusiva el desarrollo de dicho módulo.

### 🟡 Diferidos (Módulo Árbol Genealógico — Pendiente reanudar desarrollo)
- ☐ Actualizar `testGraph.js` para usar tipos de relación actuales (`married`, `father`, etc.)
- ☐ Eliminar `TopNavBar.jsx` (huérfano)
- ☐ Conectar `tree_id` en tablas `people` y `relationships` (multi-árbol real)
- ☐ Implementar edición ampliada de persona (PROMPT_016)
- ☐ Submenús desplegables en el menú del módulo
- ☐ Avatar con fallback diferenciado por género (3 siluetas)
- ☐ Perfil extendido (emigración, bautismo, servicio militar)
- ☐ Campos territoriales gallegos (parroquia + aldea + concello estructurados)
- ☐ Consistency Checker
- ☐ Tabla `derived_relationships` (DECISIONS [028])
- ☐ Migrar campo `adopted` a tipos de relación (DECISIONS [027])

- ☐ Responsividad del árbol (tablet primero, luego mobile)

### 🟢 Siguiente Fase: Portal, Blog & Administración Dinámica
- [x] **Internacionalización Trilingüe:** Configurar el sistema multiidioma (ES-AR, GL, EN) para el portal y sus módulos.
- [x] **Componente AdSlot:** Implementar contenedor de anuncios colapsable y estético.
- [x] **Tema dinámico:** Selección de modo Claro/Oscuro/Auto con soporte para el sensor de luz ambiental (`AmbientLightSensor` API) y `@media prefers-color-scheme`.
- [x] **Tabla traducciones_interfaz:** Crear esquema en base de datos para anulaciones (overrides) dinámicas de traducción.
- [x] **Seguridad y Moderación del Blog (RLS):** Crear la tabla `blog_posts` en Supabase con semillas de ejemplo y definir las políticas RLS por autoría, membresía y moderación administrativa.
- [x] **Finalizar Módulo Blog:** Taxonomía, lector/listado premium, posts iniciales interactivos y conexión dinámica a Supabase.
- [x] **Personalización de i18n y Delegación (Mini-App):** Permitir al administrador editar traducciones y delegar permisos a traductores externos.
- [x] **Cero Hardcoding (Portal Dinámico):** Conectar `/agenda` y `/asociaciones` a las tablas correspondientes en Supabase.
- [x] **Panel de Administración Centralizado (`/admin`):** Diseñar y construir el panel con tabs de gestión para cada módulo (general, blog, agenda, asociaciones, usuarios).
- [x] **Desarrollo de Micrositios de Asociaciones:** Ruta dinámica `/asociaciones/[slug]`.
- [x] **i18n en base de datos:** Conectar la tabla `traducciones` de Supabase con los listados dinámicos.

---

*Documento creado el 23/06/2026 a partir del análisis completo del repositorio.*
*Actualizar después de cada sesión de trabajo significativa.*
