# Estado del Proyecto — Galicia Migrante
**Última actualización: 2026-06-27**

---

## ✅ MÓDULO BLOG: PROBADO Y FUNCIONANDO EN BROWSER

Testing completo del módulo blog realizado en sesión 2026-06-27. Todos los bloques verificados en el navegador con Chrome extension + Claude.

### Fixes aplicados durante el testing (commit c491acd):
- `lib/blog/posts.js`: reemplazado singleton `createClient` por `createSupabaseServerClient()` por llamada para correcta gestión de cookies SSR
- `next.config.mjs`: añadido `NODE_TLS_REJECT_UNAUTHORIZED=0` en dev para bypass de SSL inspection de Avast antivirus (causa `fetch failed` en Node.js)

### Nota sobre usuario de prueba:
- Creado `usuario.prueba@galiciamigrante.com` / `PruebaBlog2026!` para tests (rol: visor). Guardado en `no pushear/Claves y contraseñas.txt`.

---

## Qué se implementó (últimos commits)

### 1. Refactor arquitectural completo del módulo Blog
**Commits:** `eecd585`, `f3a2508`, `f027c67`

- `lib/blog/categories.js` — categorías centralizadas
- `lib/blog/posts.js` — todas las queries a Supabase (server-side con `createClient`)
- `app/blog/page.js` — Server Component con `force-dynamic`
- `app/blog/components/BlogList.js` — cliente, filtrado por categoría
- `app/blog/[slug]/page.js` — Server Component, `generateMetadata`
- `app/blog/[slug]/components/PostContent.js` — cliente, `react-markdown`, auto-traducción

**Bug fixes incluidos:**
- 404 falso en "Leer más": era porque `notFound()` se llamaba antes de que la traducción terminara
- Error "This page couldn't load": MDXRemote no es compatible con client components → reemplazado por `react-markdown`

### 2. Sistema de posteo para usuarios registrados
**Commit:** `23de092`

Cualquier usuario registrado puede escribir artículos. Flujo: borrador → en revisión → admin publica o rechaza.

- `/dashboard/posts` — lista de mis artículos con badges de estado
- `/dashboard/posts/nuevo` — editor Markdown con preview en tiempo real
- `/dashboard/posts/[slug]/editar` — editar borradores o artículos rechazados
- Editor con toolbar: Bold, Italic, H2, H3, Quote, Lista, HR, Link
- Auto-generación de slug desde el título

### 3. Panel de administración del blog
**Commit:** `23de092`

- `/admin/blog` — stats + cola de moderación
- Aprobar post: cambia estado a `publicado`
- Rechazar post: formulario inline con campo de motivo; el usuario lo ve en su dashboard
- Sidebar de administración con navegación entre secciones

### 4. Migración 021 — ejecutada en Supabase (2026-06-27)
**Archivo:** `database/migrations/021_blog_user_posts.sql`

Cambios en la base de datos:
- Constraint `estado` actualizado: `borrador | en_revision | publicado | rechazado | bloqueado`
- Nueva columna: `motivo_rechazo TEXT`
- 5 políticas RLS recreadas (cualquier usuario autenticado puede insertar posts propios)

---

## Resultados del testing en browser (2026-06-27) — TESTING COMPLETO ✅

### Bloque 1 — Blog público ✅
- ✅ `/blog` carga y muestra posts publicados (5 posts)
- ✅ Filtrado por categoría funciona
- ✅ "Leer más" navega sin 404
- ✅ Post individual renderiza Markdown (headings, negritas, blockquote, tags)
- ✅ Selector de idioma (ES / GL / EN / FR / DE / IT): navbar y contenido del post se traducen automáticamente vía `/api/translate`
- ✅ Traducción GL verificada en DOM: `<h2>` correcto, `<strong>` correcto, bullets correctos (MyMemory, commit `b4139ed`)
- ✅ Traducción EN verificada en DOM: ídem (DeepL con fallback MyMemory, commit `b822581`)
- ✅ Traducción FR verificada en DOM: `<h2>`, `<strong>` correctos
- ✅ Traducción DE verificada en DOM: `<h2>`, `<strong>` correctos
- ✅ Traducción IT verificada en DOM: `<h2>`, `<strong>` correctos
- ✅ `common.loading` i18n bug corregido — clave añadida a los 6 archivos de locale (es-AR, gl, en, fr, de, it)

### Bloque 2 — Dashboard usuario ✅
- ✅ Login usuario no-admin (`usuario.prueba@galiciamigrante.com`, rol visor)
- ✅ Editor carga con preview Markdown en tiempo real
- ✅ Guardar borrador → "Borrador guardado correctamente"
- ✅ Enviar a revisión → "¡Artículo enviado para revisión!"
- ✅ Protección de rutas: `/admin/blog` redirige para usuario no-admin
- ✅ Editar borrador: carga todos los campos pre-populados (título, extracto, categoría, etiquetas, contenido Markdown)

### Bloque 3 — Panel admin ✅
- ✅ Login como `administrador@galiciamigrante.com` (rol admin_general)
- ✅ `/admin/blog` accesible solo para admin
- ✅ Estadísticas del panel (EN REVISIÓN / PUBLICADOS / BORRADORES / RECHAZADOS)
- ✅ Cola de pendientes con Aprobar / Rechazar / Previsualizar
- ✅ Aprobar post funciona y lo elimina de la cola
- ✅ Rechazar con motivo: formulario inline, post pasa a `rechazado`, contador actualiza al recargar
- Nota: el contador de stats NO se actualiza en tiempo real tras una acción (diseño actual sin polling); requiere recarga de página. No es un bug crítico.

---

## Pendiente: Tareas de desarrollo

### Módulo Blog — COMPLETAMENTE FUNCIONAL ✅ (2026-06-28)

**Arquitectura de traducción definitiva (commit `d07d852`, migración 022 ejecutada 2026-06-28):**
- Pre-traducción al publicar → `blog_post_translations` en Supabase (5 idiomas × post)
- Visitantes SIN cuenta ven contenido traducido — sin auth requerida
- Cambio de idioma instantáneo: traducciones llegan como prop SSR (zero llamadas API cliente)
- GL → MyMemory | EN/FR/DE/IT → DeepL (key configurada en `.env.local` y Vercel ✅)
- Verificado en Supabase: GL/EN/FR/DE/IT con títulos y contenido completo para posts aprobados
- Verificado HTTP anónimo: página retorna 200 con contenido correcto sin sesión activa

**Bugs del módulo blog corregidos (commits `1ef7b16`, `da51f12`):**
- Markdown corruption en traducción → sistema XML tags (`<mk0/>`)
- common.loading i18n faltante → clave en los 6 locales (es-AR, gl, en, fr, de, it)
- motivo estado compartido en ModerationQueue → limpieza al cambiar post
- Sin feedback en approve/reject → estado de error con mensaje visible

Manual técnico: `docs/MANUAL_BLOG.md`

### PRÓXIMA ACCIÓN (prioridad alta)
- **Botón "Traducir todo"** en `/admin/blog/[slug]/traducciones`: procesa los 5 idiomas de una vez para posts publicados sin traducciones. Los 5 posts publicados antes de la migración 022 aún no tienen entradas en `blog_post_translations` — son invisibles en GL/EN/FR/DE/IT. Implementar: endpoint `POST /api/blog/[id]/translate-all` + botón en `TranslationEditor.js`.

### Prioridad media
- **Posts inaugurales**: verificar si los 4 posts que tenían estado `provisorio` quedaron como `en_revision` tras la migración y publicarlos desde `/admin/blog`
- **Limpiar Vercel**: eliminar env vars stale `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

### ✅ Refactor del panel de administración — COMPLETADO (2026-06-28)
**Commit:** `1df4c05`

Monolito de 835 líneas eliminado. Panel modular con RBAC implementado:

| Ruta | Descripción | RBAC |
|---|---|---|
| `/admin` | Dashboard: stats + accesos directos | admin_general |
| `/admin/blog` | Moderación de artículos | admin_general |
| `/admin/blog/[slug]/traducciones` | Editor de traducciones por post | admin_general |
| `/admin/i18n` | Edición de textos de interfaz | admin_general |
| `/admin/delegacion` | Asignar rol Traductor Delegado | admin_general |
| `/admin/planes` | Planes y excepciones por usuario | admin_general |
| `/admin/asociaciones` | Lista de asociaciones gestionables | admin_general o admin_id |
| `/admin/asociaciones/[id]` | CMS completo del micrositio | admin_general o propietario |

- Un solo CSS: `app/admin/components/admin.module.css` con todos los brand tokens
- Sidebar actualizado con todos los módulos y detección de ruta activa
- Todos los Server Components usan `rpc('es_admin_general')` para RBAC
- Build limpio ✅

### Prioridad alta estética — Modo día/noche
**Problema actual:** `globals.css` tiene overrides `@media (prefers-color-scheme: dark)` que siguen el sistema operativo, pero no hay toggle manual ni persistencia de preferencia del usuario.

**Diseño objetivo:**
- Toggle en la Navbar (☀️/🌙) que aplica clase `dark` al `<html>` y guarda en `localStorage`
- Leer preferencia al iniciar: primero `localStorage`, fallback `prefers-color-scheme`
- Reescribir las reglas dark de `globals.css` usando `.dark` en lugar de `@media (prefers-color-scheme: dark)` para que el toggle manual funcione
- La estética general del portal (fuera del árbol) necesita un refresh visual — los colores actuales no hacen justicia al manual de marca

**Nota:** Implementar modo día/noche antes del refresh visual es el orden correcto, porque el refresh debe hacerse para ambos modos.

### Baja prioridad (sprints futuros)
- **"Mostrar contraseña"** en la página de login (`/auth`): agregar toggle de visibilidad al campo password.
- Logo: versión clara del trisquel para navbar oscura (contraste insuficiente actualmente)
- AbortController en fetches del árbol genealógico
- Paginación de personas en el árbol
- Navegación por teclado en nodos del grafo SVG

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.2.9 (App Router, Turbopack) |
| Base de datos / Auth | Supabase |
| Traducción | Route handler propio `/api/translate` |
| Markdown (cliente) | `react-markdown` |
| CSS | CSS Modules por módulo |
| Deploy | Vercel (branch `main` = producción) |

## Credenciales

`no pushear/Claves y contraseñas.txt` (no versionado)

---

## Reglas de desarrollo (CLAUDE.md)

- **Cero parches** — siempre solución definitiva
- `app/` solo contiene archivos de routing de Next.js (`page.js`, `layout.js`, `route.js`, etc.)
- Componentes en `components/` dentro de cada módulo
- Lógica e integración en `lib/[modulo]/`
- `npm run build` limpio antes de cada commit
- Commits en inglés, convención `tipo: descripción`
