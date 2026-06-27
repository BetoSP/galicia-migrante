# Manual del Blog — Galicia Migrante
**Versión 1.0 · Actualizado: 2026-06-27**

---

## Índice

1. [Para usuarios: Escribir y publicar](#1-para-usuarios-escribir-y-publicar)
2. [Para administradores: Moderar el blog](#2-para-administradores-moderar-el-blog)
3. [Para visitantes: Leer y navegar](#3-para-visitantes-leer-y-navegar)
4. [Traducción automática de idiomas](#4-traducción-automática-de-idiomas)
5. [Guía de Markdown para escritores](#5-guía-de-markdown-para-escritores)
6. [Preguntas Frecuentes (FAQ)](#6-preguntas-frecuentes-faq)
7. [Referencia técnica](#7-referencia-técnica)

---

## 1. Para usuarios: Escribir y publicar

### ¿Quién puede escribir?
Cualquier usuario registrado en el portal puede crear artículos. El rol mínimo requerido es **visor** (el rol por defecto al registrarse).

### Flujo completo de publicación

```
Usuario escribe → Guarda borrador → Envía a revisión → Admin aprueba → Publicado
                                                      ↘ Admin rechaza → Rechazado (editable)
```

### Crear un artículo nuevo

1. Ingresá a tu cuenta y andá a **Mi Panel → Mis artículos**
2. Hacé click en **+ Nuevo artículo**
3. Completá los campos:
   - **Título** *(obligatorio)* — Máx. 200 caracteres
   - **Extracto** *(obligatorio para enviar a revisión)* — Resumen breve que aparece en la lista del blog. Máx. 400 caracteres.
   - **Categoría** — Elegí entre: General, Historia, Literatura, Trámites
   - **Etiquetas** — Palabras clave separadas por coma. Se guardan en minúsculas. Ejemplo: `galicia, emigracion, historia`
   - **Contenido** *(obligatorio)* — Escribí en Markdown (ver [Guía de Markdown](#5-guía-de-markdown-para-escritores))

4. Usá los botones de la barra de herramientas para insertar formato:
   - **B** → negrita
   - *I* → cursiva
   - **H2** / **H3** → encabezados de sección
   - **❝** → cita en bloque
   - **•** → lista con viñeta
   - **—** → separador horizontal
   - **🔗** → enlace

5. La columna derecha muestra la vista previa en tiempo real mientras escribís.

### Guardar borrador

Hacé click en **Guardar borrador** para guardar el trabajo sin enviarlo a revisión. Podés volver a editarlo cuando quieras. No es visible para otros usuarios.

### Enviar a revisión

Cuando el artículo esté listo, hacé click en **Enviar para revisión →**. El equipo editorial revisará tu trabajo y lo publicará o te enviará feedback. Vas a poder ver el estado en **Mis artículos**.

> **Nota:** El extracto es obligatorio para enviar a revisión. Si no lo completaste, el sistema te avisará.

### Editar un artículo

Podés editar artículos en estado **Borrador**, **En revisión** o **Rechazado**.

- Andá a **Mis artículos**
- Hacé click en **Editar** junto al artículo
- Todos los campos se cargan pre-completados
- Guardá como borrador o volvé a enviar a revisión

> **Atención:** Los artículos **Publicados** no pueden editarse directamente. Contactá al administrador si necesitás corregir un artículo ya publicado.

### Eliminar un artículo

Podés eliminar artículos que no estén publicados. Esta acción **no se puede deshacer**.

- En **Mis artículos**, hacé click en **Eliminar** junto al artículo
- Confirmá la acción en el diálogo
- El artículo se borra permanentemente

### Estados de un artículo

| Estado | Visible para | Editable | Descripción |
|--------|-------------|----------|-------------|
| `Borrador` | Solo vos | ✅ | Guardado pero no enviado |
| `En revisión` | Solo vos + admin | ✅ | Enviado, esperando moderación |
| `Publicado` | Todos | ❌ | Aprobado y visible en el blog |
| `Rechazado` | Solo vos | ✅ | El admin indicó el motivo |
| `Bloqueado` | Solo admin | ❌ | Bloqueado por incumplimiento |

---

## 2. Para administradores: Moderar el blog

### Acceder al panel de moderación

Andá a **Admin → Blog** (`/admin/blog`). Solo los usuarios con rol `admin_general` pueden acceder. Si intentás entrar sin ese rol, serás redirigido al inicio.

### Panel de estadísticas

En la parte superior verás los contadores:
- **En revisión** — artículos esperando aprobación
- **Publicados** — artículos visibles al público
- **Borradores** — artículos guardados por usuarios (no enviados)
- **Rechazados** — artículos devueltos con feedback

> Los contadores se actualizan al recargar la página. No se actualizan en tiempo real.

### Aprobar un artículo

1. En la sección **Pendientes de aprobación**, buscá el artículo
2. Hacé click en **✓ Aprobar**
3. El artículo pasa a estado `publicado` y desaparece de la cola
4. El post queda visible inmediatamente en `/blog`

Podés hacer click en **Previsualizar →** para ver el artículo antes de aprobar.

### Rechazar un artículo

1. Hacé click en **Rechazar** junto al artículo
2. Se abre un campo de texto donde podés escribir el motivo (opcional pero recomendado)
3. Hacé click en **Confirmar rechazo**
4. El artículo pasa a estado `rechazado` y el usuario verá el motivo en **Mis artículos**

> **Buena práctica:** Siempre explicá el motivo de rechazo. El autor lo verá exactamente como lo escribís.

### ¿Qué puede y no puede hacer el admin?

| Acción | Admin | Usuario |
|--------|-------|---------|
| Ver todos los posts (cualquier estado) | ✅ | Solo los propios |
| Aprobar posts | ✅ | ❌ |
| Rechazar posts | ✅ | ❌ |
| Bloquear posts | ✅ | ❌ |
| Eliminar cualquier post | ✅ | Solo los propios (no publicados) |
| Editar posts de otros | ❌ | ❌ |

---

## 3. Para visitantes: Leer y navegar

### Acceder al blog

Andá a `/blog` o hacé click en **Blog** en el menú de navegación. No necesitás estar registrado para leer.

### Filtrar por categoría

En la parte superior del blog encontrás pestañas para filtrar:
- **Todos** — muestra todos los artículos publicados
- **General** — noticias y anuncios de la comunidad
- **Historia** — crónicas históricas sobre la diáspora gallega
- **Literatura** — poesía, relatos y ensayos
- **Trámites** — guías prácticas sobre consulados, nacionalidad y retorno

### Leer un artículo

Hacé click en **Leer más →** en cualquier tarjeta para abrir el artículo completo. Verás:
- Fecha de publicación y autor
- Título y extracto
- Contenido completo renderizado (con headings, negritas, listas, etc.)
- Etiquetas relacionadas

### Cambiar el idioma del contenido

El blog soporta traducción automática al **Galego** y al **English**. Hacé click en el botón **🌐 ES** en la barra de navegación y seleccioná el idioma deseado.

> **Importante:** La traducción automática requiere tener una sesión iniciada. Si sos visitante sin cuenta, el contenido se mostrará en español.

---

## 4. Traducción automática de idiomas

### Cómo funciona

El sistema de traducción tiene tres capas:

1. **Selección de idioma** — El botón 🌐 en la navbar abre un dropdown con Español (AR), Galego, English. La elección se guarda en `localStorage` y persiste entre visitas.

2. **Ruta `/api/translate`** — Cuando se selecciona un idioma distinto al español, el componente `PostContent` envía el texto (título, extracto y contenido por separado) a esta ruta interna de Next.js. La ruta requiere autenticación para evitar abuso de la API gratuita.

3. **MyMemory API** — La ruta llama a la API pública de MyMemory (`api.mymemory.translated.net`) con el par de idiomas `es|gl` o `es|en`. El resultado se devuelve al cliente y se cachea en `sessionStorage`.

4. **Protección de Markdown** — Antes de enviar el texto a MyMemory, el sistema reemplaza los tokens de Markdown (`##`, `**`, `- `) con etiquetas XML (`<mk0/>`, `<mk1/>`, etc.) que los motores de traducción preservan por diseño (los tratan como HTML/XML). Al recibir la traducción, las etiquetas se restauran al Markdown original.

5. **Caché por sesión** — Las traducciones se cachean en `sessionStorage` con la clave `post_trans_v1_{slug}_{lang}_{fecha}`. No se vuelve a llamar a la API en la misma sesión para el mismo artículo e idioma.

### Limitaciones conocidas

| Limitación | Descripción | Impacto |
|-----------|-------------|---------|
| Requiere autenticación | La API solo se llama si hay sesión activa | Visitantes no registrados no reciben traducción |
| Calidad de traducción | MyMemory es una API gratuita de calidad moderada | Algunas frases pueden sonar poco naturales |
| Reformateo de contenido | MyMemory puede insertar saltos de línea en oraciones largas con bold | Un bullet largo ocasionalmente muestra `**` literal |
| Cuota diaria | 10,000 palabras/día con email registrado | Suficiente para el volumen actual; puede crecer |
| Caching solo en sesión | Al cerrar el tab, se necesita re-traducir | Sin impacto en UX (rápido) |

---

### API de traducción: MyMemory

**¿Qué es MyMemory?**
MyMemory es el motor de traducción automática gratuito más grande del mundo basado en memoria de traducción. Combina traducciones humanas profesionales de organismos como la Unión Europea y las Naciones Unidas con traducciones automáticas de Google y Microsoft.

**URL del servicio:**
```
https://api.mymemory.translated.net/get?q={texto}&langpair={desde}|{hasta}&de={email}
```

**Configuración actual del portal:**
- Email registrado: `galiciamigrante2026@gmail.com`
- Par de idiomas: `es|gl` (español → gallego) y `es|en` (español → inglés)
- Límite por request: ~5,000 caracteres
- Cuota diaria: 10,000 palabras con email registrado (vs. 1,000 sin email)
- Costo: **Gratuito**

**Prestaciones actuales:**
- ✅ Traducción español ↔ gallego
- ✅ Traducción español ↔ inglés
- ✅ Preservación de HTML/XML (via nuestro sistema de protección Markdown)
- ✅ Caché via `next: { revalidate: 3600 }` (reutilización en SSR por 1 hora)
- ✅ Sin API key requerida (solo email para cuota extendida)

**Prestaciones NO disponibles en la configuración actual:**
- ❌ Traducción en tiempo real durante la escritura
- ❌ Memoria de traducción personalizada del portal
- ❌ Glosario técnico (ej. "diáspora" → "diáspora" siempre, no "dispersión")
- ❌ Detección automática de idioma origen
- ❌ Traducción de más de 70+ idiomas (solo usamos 2)

---

### Alternativas de API disponibles

#### 1. DeepL API ⭐ Recomendada para producción

| Característica | Valor |
|---------------|-------|
| Calidad | Mejor del mercado |
| Soporte Galego | ✅ Desde 2023 |
| Preservación HTML | ✅ Nativo (`tag_handling=html`) |
| Costo | Gratuito hasta 500,000 chars/mes; luego €5.49/M chars |
| API key | Requerida (registro gratuito) |
| Documentación | [developers.deepl.com](https://developers.deepl.com) |

**Por qué es la mejor alternativa:** DeepL preserva nuestro sistema de etiquetas XML de forma nativa, genera traducciones de mucha mejor calidad en gallego, y el plan gratuito es más que suficiente para el volumen actual del portal. La migración sería mínima: cambiar el URL y el formato del request en `/api/translate/route.js`.

```javascript
// Ejemplo de llamada a DeepL (cambio mínimo en route.js)
const url = 'https://api-free.deepl.com/v2/translate';
const body = new URLSearchParams({
  auth_key: process.env.DEEPL_API_KEY,
  text: protectedText,
  source_lang: 'ES',
  target_lang: targetLang.toUpperCase(),
  tag_handling: 'xml',           // Preserva nuestras etiquetas <mk0/> nativamente
  ignore_tags: 'mk',             // No traduce el contenido de las etiquetas mk*
});
```

#### 2. Google Cloud Translation API

| Característica | Valor |
|---------------|-------|
| Calidad | Excelente |
| Soporte Galego | ✅ (`gl`) |
| Preservación HTML | ✅ (`format=html`) |
| Costo | Gratuito hasta 500,000 chars/mes; luego $20/M chars |
| API key | Requiere cuenta Google Cloud con billing |
| Documentación | cloud.google.com/translate |

**Contra:** Requiere configurar Google Cloud, añadir tarjeta de crédito (aunque el free tier es suficiente), y la gestión de credenciales es más compleja.

#### 3. Microsoft Azure Translator

| Característica | Valor |
|---------------|-------|
| Calidad | Excelente |
| Soporte Galego | ✅ (`gl`) |
| Preservación HTML | ✅ (`textType=html`) |
| Costo | **Gratuito hasta 2,000,000 chars/mes** |
| API key | Requiere cuenta Azure (puede ser con cuenta Microsoft existente) |
| Documentación | azure.microsoft.com/products/ai-services/translator |

**Ventaja clave:** El plan gratuito de Azure (2M chars/mes) es el más generoso de los tres. Si el portal escala a muchos usuarios, esta es la opción más económica. Soporte nativo para gallego confirmado.

#### 4. LibreTranslate (self-hosted)

| Característica | Valor |
|---------------|-------|
| Calidad | Moderada (similar a MyMemory) |
| Soporte Galego | ⚠️ Limitado (depende del modelo instalado) |
| Costo | Gratuito (self-hosted) o instancias públicas |
| Privacidad | Total (no envía datos a terceros) |
| Infraestructura | Requiere servidor propio |

**Para cuándo:** Si el portal crece a volumen muy alto y el costo de DeepL/Google se vuelve significativo, LibreTranslate auto-hosteado en Vercel/Railway es la alternativa más económica a largo plazo.

#### Comparativa resumen

| API | Calidad Gallego | Costo | Complejidad setup | Recomendación |
|-----|----------------|-------|-------------------|--------------|
| MyMemory (actual) | ⭐⭐ | Gratis | Ninguna | Dev / bajo volumen |
| **DeepL** | **⭐⭐⭐⭐⭐** | **Gratis 500K** | **Baja** | **Producción** |
| Google Translate | ⭐⭐⭐⭐ | Gratis 500K | Media | Alternativa sólida |
| Azure Translator | ⭐⭐⭐⭐ | Gratis 2M | Media | Escala alta |
| LibreTranslate | ⭐⭐ | Gratis | Alta | Privacy-first |

---

## 5. Guía de Markdown para escritores

El editor del blog usa **Markdown**, un formato de texto simple donde los símbolos definen el estilo visual.

### Elementos disponibles

#### Headings (Títulos)
```markdown
# Título principal (H1) — usar solo una vez al inicio
## Sección principal (H2)
### Subsección (H3)
```

#### Énfasis
```markdown
**texto en negrita**
*texto en cursiva*
***negrita y cursiva***
```

#### Listas
```markdown
- Primer elemento
- Segundo elemento
- Tercer elemento

1. Primer paso
2. Segundo paso
3. Tercer paso
```

#### Citas en bloque
```markdown
> Esta es una cita memorable de alguien importante.
> Puede ocupar varias líneas.
```

#### Separadores
```markdown
---
```
(Línea horizontal — útil para separar secciones)

#### Enlaces
```markdown
[Texto del enlace](https://url-del-destino.com)
```

#### Imágenes
```markdown
![Texto alternativo](https://url-de-la-imagen.jpg)
```
> Nota: Las imágenes deben estar alojadas en una URL externa. El portal no tiene upload de imágenes propio aún.

### Ejemplo de artículo bien estructurado

```markdown
# El viaje de mis abuelos desde Lugo a Buenos Aires

En 1923, Ramón García Vidal dejó su aldea en la provincia de Lugo con una maleta de cuero y **el sueño de una vida mejor** en el otro lado del Atlántico.

## Los primeros años en Argentina

La comunidad gallega en Buenos Aires ya era numerosa cuando Ramón llegó al puerto...

### El Centro Gallego de Buenos Aires

> "El centro no era solo un lugar de reunión. Era Galicia misma, trasplantada al Río de la Plata."
> — Testimonio de un descendiente de la segunda generación

Los servicios que ofrecía incluían:

- Asistencia médica y jurídica para recién llegados
- Clases de español para los hijos nacidos en Argentina
- Biblioteca con publicaciones en gallego
- Sala de fiestas para bodas y celebraciones comunitarias

## La herencia que dejaron

---

*Este artículo fue escrito con base en los archivos del Centro Gallego de Buenos Aires y testimonios familiares.*
```

---

## 6. Preguntas Frecuentes (FAQ)

### Para usuarios registrados

**¿Puedo publicar sin ser aprobado?**
No. Todos los artículos pasan por revisión editorial antes de publicarse. El equipo de Galicia Migrante revisa que el contenido respete las pautas de la comunidad.

**¿Cuánto tiempo tarda en aprobarse mi artículo?**
No hay un plazo garantizado. El equipo revisa la cola periódicamente. En general, los artículos se procesan en 24 a 72 horas durante días hábiles.

**¿Por qué rechazaron mi artículo?**
El motivo de rechazo aparece en **Mis artículos**, debajo del título. Los motivos más comunes son: contenido que no respeta las pautas editoriales, falta de extracto, Markdown mal formateado, o contenido que no tiene relación con la diáspora gallega.

**Envié mi artículo a revisión y quiero editarlo antes de que lo aprueben. ¿Puedo?**
Sí. Los artículos en estado `En revisión` siguen siendo editables. Si lo editás y guardás como borrador, volverá a estado `Borrador` y deberás enviarlo a revisión nuevamente.

**¿Por qué no puedo editar mi artículo publicado?**
Una vez publicado, el artículo es parte del registro público del portal. Si necesitás corregir un error, escribile al administrador describiendo la corrección necesaria.

**¿Puedo eliminar un artículo que ya fue publicado?**
No. Los artículos publicados no pueden eliminarse desde el panel de usuario. Contactá al admin.

**El editor no me deja usar imágenes desde mi computadora. ¿Cómo las subo?**
El portal no tiene hosting de imágenes propio aún. Podés subir tus imágenes a un servicio externo gratuito (como Imgur, Cloudinary, o Google Photos) y pegar la URL en el editor así: `![descripción](https://url-de-tu-imagen.jpg)`.

**¿Puedo escribir en gallego directamente?**
¡Sí, y lo alentamos! Si escribís tu artículo en gallego, el sistema de auto-traducción puede traducirlo al español e inglés para los demás lectores (la función de traducción desde gallego está planificada para versiones futuras).

**¿Mis artículos se guardan automáticamente?**
No. El editor no tiene auto-guardado. Guardá el borrador manualmente cada tanto haciendo click en **Guardar borrador**.

---

### Sobre la traducción

**¿Por qué no se traduce el blog si no estoy registrado?**
La traducción usa una API externa que tiene una cuota diaria limitada. Para proteger ese límite de posibles bots y abuso masivo, la traducción solo se activa para usuarios autenticados.

**¿La traducción al gallego es perfecta?**
No. Es una traducción automática de calidad moderada (MyMemory API). Para contenido oficial o literario de alta calidad, la traducción manual siempre será superior. El sistema es útil para la comprensión general del contenido.

**¿Se traduce también el título y el extracto?**
Sí. Los tres elementos se traducen: título, extracto y contenido del artículo.

**La traducción al gallego no se parece al gallego estándar. ¿Por qué?**
La API de MyMemory usa memorias de traducción de múltiples fuentes. La variedad gallega puede variar. Estamos evaluando migrar a DeepL (que tiene mejor calidad para el gallego) en el futuro.

**¿Si cambio de idioma y vuelvo al español, se pierde la traducción?**
No. Las traducciones se guardan en la sesión del navegador (sessionStorage). Mientras no cierres la pestaña, no se vuelve a llamar a la API.

---

### Para administradores

**¿Puedo editar el artículo de un usuario antes de aprobarlo?**
No directamente desde el panel admin. La política del portal es que el contenido publicado sea del autor. Si necesitás correcciones, rechazá el artículo con el motivo específico para que el autor lo corrija.

**¿Cómo bloqueo un post que ya fue publicado?**
Actualmente, el cambio de estado a `bloqueado` debe hacerse directamente en Supabase (Dashboard → blog_posts → editar la fila). La interfaz admin de cambio de estado para posts publicados está pendiente de implementación.

**Los contadores de estadísticas no se actualizaron después de aprobar un artículo.**
Los contadores se calculan al cargar la página. Recargá `/admin/blog` para ver los números actualizados. No se actualizan en tiempo real (no hay polling activo).

**Abrí el formulario de rechazo para un artículo y accidentalmente hice click en Rechazar de otro. ¿El motivo se mezcló?**
No. Desde la versión actual (commit `da51f12`), el campo de motivo se limpia automáticamente cada vez que abrís el formulario para un artículo diferente.

---

## 7. Referencia técnica

### Stack del módulo

| Capa | Tecnología |
|------|-----------|
| Lista de posts | Server Component (`force-dynamic`) |
| Post individual | Server Component + Client Component (`PostContent`) |
| Editor Markdown | Client Component (`PostEditor`) |
| Panel admin | Server Component + Client Component (`ModerationQueue`) |
| Renderizado Markdown | `react-markdown` |
| Base de datos | Supabase (PostgreSQL + RLS) |
| Autenticación | Supabase Auth (SSR) |
| Traducción | `/api/translate` → MyMemory API |
| Caché de traducción | `sessionStorage` del navegador |
| Protección de rutas | Next.js Middleware |

### Estructura de archivos

```
app/
├── blog/
│   ├── page.js                        # Lista pública de posts
│   ├── [slug]/
│   │   ├── page.js                    # Post individual
│   │   └── components/
│   │       ├── PostContent.js         # Cliente: renderizado + traducción
│   │       └── post.module.css
│   └── components/
│       ├── BlogList.js                # Filtrado por categoría
│       ├── AdSlot.js                  # Slot publicitario (desactivado)
│       └── blog.module.css
├── admin/
│   └── blog/
│       ├── page.js                    # Panel de moderación
│       └── components/
│           └── ModerationQueue.js     # Cola de aprobación
└── dashboard/
    └── posts/
        ├── page.js                    # Lista de mis artículos
        ├── nuevo/page.js              # Crear artículo
        ├── [slug]/editar/page.js      # Editar artículo
        └── components/
            ├── PostEditor.js          # Editor con preview Markdown
            └── posts.module.css

app/api/
└── translate/
    └── route.js                       # Endpoint de traducción

lib/blog/
├── posts.js                           # Queries a Supabase
└── categories.js                      # Definición de categorías

locales/
├── es-AR.json                         # Traducciones de interfaz (español)
├── gl.json                            # Traducciones de interfaz (gallego)
└── en.json                            # Traducciones de interfaz (inglés)
```

### Tabla de estados de posts (blog_posts.estado)

```sql
CHECK (estado IN ('borrador', 'en_revision', 'publicado', 'rechazado', 'bloqueado'))
```

### Políticas RLS activas

| Política | Operación | Condición |
|----------|-----------|-----------|
| `blog_posts_select_published` | SELECT | `estado = 'publicado'` (cualquiera, incluso anónimo) |
| `blog_posts_select_own_or_admin` | SELECT | `autor_id = usuario_actual` OR `es_admin_general()` |
| `blog_posts_insert_auth` | INSERT | Usuario autenticado, `autor_id` propio, estado válido |
| `blog_posts_update_own` | UPDATE | Autor en estados editables, OR admin |
| `blog_posts_delete_own_or_admin` | DELETE | Autor (no publicados) OR admin |

### Variables de entorno requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=          # URL del proyecto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Clave anon pública
```

La clave de la API de traducción (MyMemory) no requiere variable de entorno — el email de registro se incluye en el URL de la request.

---

*Manual generado con Claude Code · Galicia Migrante 2026*
