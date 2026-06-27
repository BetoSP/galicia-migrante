# Estado del Proyecto — Galicia Migrante
**Última actualización: 2026-06-27**

---

## ⚠️ ATENCIÓN: Código implementado pero SIN PROBAR en el navegador

Todo el bloque de trabajo del módulo blog fue implementado, el build compila limpio y la migración SQL fue ejecutada. **Pero las funcionalidades nuevas NO fueron probadas manualmente en el navegador.** La próxima sesión debe comenzar por ahí.

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

## Pendiente: Pruebas requeridas en el navegador

### Bloque 1 — Blog público
- [ ] `/blog` carga y muestra posts publicados
- [ ] Filtrado por categoría funciona
- [ ] "Leer más" no da 404
- [ ] Post individual renderiza Markdown correctamente
- [ ] Selector de idioma (ES / GL / PT) funciona y traduce

### Bloque 2 — Dashboard usuario
- [ ] Crear nuevo artículo como usuario NO admin
- [ ] Guardar borrador → aparece con badge "Borrador"
- [ ] Enviar a revisión → badge cambia a "En revisión"
- [ ] Editar borrador carga los datos existentes
- [ ] Usuario NO puede ver artículos de otros usuarios

### Bloque 3 — Panel admin
- [ ] Iniciar sesión como `administrador@galiciamigrante.com`
- [ ] Post en revisión aparece en cola de moderación
- [ ] Aprobar → aparece en `/blog`
- [ ] Rechazar con motivo → usuario ve el motivo en su dashboard

---

## Pendiente: Tareas de desarrollo

### Prioridad media
- **Posts inaugurales**: verificar si los 4 posts que tenían estado `provisorio` quedaron como `en_revision` tras la migración y publicarlos desde `/admin/blog`
- **Refactorizar `app/admin/page.js`**: 835 líneas monolíticas → separar en sub-componentes (no urgente, no bloquea)
- **Limpiar Vercel**: eliminar env vars stale `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

### Baja prioridad (sprints futuros)
- Logo: versión clara del trisquel para navbar oscura (contraste insuficiente actualmente)
- Admin sub-panels: Usuarios, Asociaciones (habilitarlos en AdminSidebar)
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
