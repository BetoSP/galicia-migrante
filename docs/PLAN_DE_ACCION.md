# GALICIA MIGRANTE — PLAN DE ACCIÓN
### De la visión al producto: qué construir, en qué orden y por qué
**Versión:** 1.0 — 28 de junio de 2026
**Lee primero:** `docs/VISION.md` — este plan no tiene sentido sin la visión que lo gobierna.

---

## ESTADO DE PARTIDA (hoy, 28/06/2026)

### Lo que ya funciona ✅
- Auth completa (registro, login, recuperación, toggle contraseña)
- Árbol genealógico (CRUD, árbol visual, importación GEDCOM/CSV/Excel, estadísticas, eventos)
- Blog completo (posteo de usuarios, moderación admin, traducciones a 5 idiomas pre-generadas)
- Panel de admin modular con RBAC
- Sistema de i18n (ES/GL/EN/FR/DE/IT)
- Deploy en Vercel, base en Supabase, 37+ tablas

### Lo que falta para ser el "centro gallego del siglo XXI"
- **La primera impresión no cumple la visión** — la landing page y la estética general no producen el "momento mágico" en 10 segundos.
- **No hay modo día/noche** — sin eso no se puede hacer el refresh visual.
- **La Mediateca no existe** — no hay espacio cultural (biblioteca, música, fotos históricas, etc.).
- **"Tu lugar en Galicia" no existe** — la conexión territorial es clave para el árbol.
- **No hay comunidad activa** — el blog tiene infraestructura pero no contenido inaugural.
- **Las asociaciones son un placeholder** — el directorio es estático.
- **No hay pagos** — el modelo de negocio no está operativo.

---

## PRINCIPIO RECTOR DEL PLAN

**La primera impresión lo es todo.**

El portal puede tener 50 módulos excelentes. Si la landing page no produce emoción en 10 segundos, el usuario se va y no vuelve. Por eso el refresh visual y la landing van primero — no porque sean lo más complejo, sino porque son la puerta.

Cada fase se construye sobre la anterior. No se avanza a la siguiente sin que la actual esté completa y probada.

---

## FASE 0 — DEUDA TÉCNICA Y PRUEBAS PENDIENTES
**Duración estimada:** 1-2 días
**Objetivo:** Cerrar todo lo que quedó pendiente de prueba antes de avanzar.

### Tareas

| Tarea | Descripción | Cómo verificar |
|---|---|---|
| Probar "Traducir todo" | Ir a `/admin/blog/[slug]/traducciones` en los 5 posts sin traducciones, presionar el botón | El botón traduce los 5 idiomas y actualiza todos los tabs |
| Probar toggle contraseña | Ir a `/auth`, verificar que el ojo aparece y funciona en ambos campos | Hacer clic en el ícono cambia el tipo del input entre password/text |
| Posts inaugurales | Verificar que los 4 posts con estado `provisorio` quedaron como `en_revision` tras la migración | `/admin/blog` — si están en cola, aprobar y publicar |
| Limpiar Vercel | Eliminar env vars stale `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` | Dashboard de Vercel → Settings → Environment Variables |
| Verificar build limpio | `npm run build` sin warnings ni errores | Output sin errores |

---

## FASE 1 — FUNDACIÓN VISUAL
**Duración estimada:** 1 semana
**Objetivo:** Que el portal se vea y sienta como el "centro gallego del siglo XXI" antes de seguir construyendo módulos.

> **Por qué primero:** Todo lo que construyamos después va a heredar la estética. Si construimos módulos sobre un diseño que no está bien, tenemos que redeseñar dos veces.

### 1.1 Modo día/noche (prerequisito del refresh)

El refresh visual debe hacerse para ambos modos desde el inicio. Por eso el toggle va antes.

- Toggle ☀️/🌙 en la Navbar
- Aplica clase `.dark` al `<html>` + persiste en `localStorage`
- Al iniciar: lee `localStorage`, fallback a `prefers-color-scheme`
- Reescribir reglas dark de `globals.css` con `.dark` en lugar de `@media (prefers-color-scheme: dark)`
- Verificar que árbol, blog, auth y admin se ven bien en ambos modos

### 1.2 Refresh de la landing page

La landing es la puerta. Debe superar las cuatro pruebas de VISION.md en los primeros 10 segundos.

**Hero section:**
- Titular con impacto emocional (no descripción de features)
- Subtítulo que contextualice quién es la audiencia
- CTA primario → árbol genealógico
- CTA secundario → blog/comunidad
- Fotografía documental con overlay (no stock genérico)
- Tagline en gallego como elemento de alma: *"De onde vés, non é o de menos."*

**Sección de propuesta de valor:**
- No listar features — mostrar el beneficio emocional de cada uno
- Árbol genealógico: "Encontrá el pueblo de tu bisabuelo en el mapa"
- Blog: "Historias de la diáspora contadas por la diáspora"
- La Mediateca (futuro): "La música, los libros y las fotos que definen lo que somos"

**Sección de comunidad (prueba social):**
- Estadísticas reales: cuántos usuarios, cuántas personas en árboles, cuántos posts
- Testimonios reales cuando haya usuarios activos

**Footer:**
- Limpio, con navegación clara, idioma y acceso a auth

### 1.3 Refresh general de componentes

Una vez que la landing está bien, extender el sistema de diseño al resto:
- Navbar: logo con buen contraste en modo oscuro, toggle de idioma más limpio
- Tipografía: aplicar Playfair Display a headings donde corresponda
- Botones: jerarquía visual clara (primario / secundario / peligro)
- Cards del blog: más impacto visual, foto de portada si existe
- Formularios del árbol: consistencia con el sistema de diseño nuevo

---

## FASE 2 — CONTENIDO INAUGURAL Y COMUNIDAD ACTIVA
**Duración estimada:** 2-3 semanas (incluye producción de contenido)
**Objetivo:** Que cuando alguien llegue al portal, no lo encuentre vacío.

> **Por qué segundo:** El mejor diseño no sirve si el centro está desierto. La primera experiencia de un nuevo usuario define si vuelve.

### 2.1 Posts inaugurales del blog

Publicar al menos 6-8 artículos con los que el portal abra sus puertas:

| Artículo | Por qué este primero |
|---|---|
| "¿Qué es Galicia Migrante y para qué existe?" | La presentación del proyecto en voz propia |
| "Cómo empezar tu árbol genealógico (aunque no sepas nada)" | Tutorial que baja la barrera de entrada |
| "El barco que trajo a los gallegos a Argentina" | Historia documental con impacto emocional |
| "Las parroquias de Galicia: por qué no alcanza saber el apellido" | Contextualiza el módulo territorial |
| "5 canciones que definen la música gallega contemporánea" | Introduce la futura Musicoteca + comparte en redes |
| "Los centros gallegos de Buenos Aires: historia y presente" | Conecta con las asociaciones |
| "Entroido, Magosto y San Xoán: las fiestas que viajaron con la diáspora" | Cultura viva, compartible |
| "Cómo contribuir a Galicia Migrante: tu historia también es nuestra" | Convoca a la comunidad a participar |

### 2.2 Página de "Quiénes somos"

La sección existe pero necesita contenido real:
- La historia del proyecto (por qué existe, quién lo construye)
- La visión en lenguaje accesible (versión resumida de VISION.md)
- Cómo participar y contribuir
- Contacto

### 2.3 Seed de la agenda

Cargar al menos 10-15 eventos reales de la colectividad gallega para que la sección no esté vacía al lanzar:
- Eventos de centros gallegos en Argentina
- Fiestas patronales
- Eventos de GaliciaAberta (Xunta)

---

## FASE 3 — TU LUGAR EN GALICIA
**Duración estimada:** 3-4 semanas
**Objetivo:** La conexión territorial — el segundo momento mágico más poderoso.

> **Por qué tercero:** Cuando alguien ya construyó parte de su árbol y conoce el pueblo de su bisabuelo, la siguiente pregunta es "¿dónde queda eso exactamente, cómo es ese lugar?" Este módulo responde esa pregunta.

### Lo que incluye

**Vista pública de una parroquia:**
- Mapa interactivo de la localización
- Datos básicos: concello, comarca, provincia, ayuntamiento
- Foto representativa del territorio
- Cuántos usuarios de GM tienen ancestros de esa parroquia (privado hasta masa crítica)

**Integración con el árbol:**
- Al agregar lugar de nacimiento en el árbol → campo estructurado parroquia/aldea/concello
- Desde el perfil de una persona → link a su página de parroquia
- Desde la página de parroquia → "X personas de tu árbol vienen de aquí"

**Contenido a largo plazo (segunda iteración):**
- Historia breve de la parroquia
- Apellidos característicos del territorio
- Hechos históricos (emigración en masa, eventos locales)

### Fuente de datos
- Seed del IGE: ~3.800 parroquias con datos estructurados (ya documentado en PRD)
- Enriquecimiento progresivo con contenido propio

---

## FASE 4 — LA MEDIATECA
**Duración estimada:** 4-6 semanas (diseño + seed inicial de contenido)
**Objetivo:** Convertir el portal en un destino cultural, no solo en una herramienta genealógica.

> **Por qué cuarto:** La Mediateca es la sala del centro gallego donde la gente se queda más tiempo. Pero necesita contenido para funcionar. Sin contenido inicial es una sala vacía — por eso va después de que el blog y la agenda están activos y generando comunidad.

### Arquitectura de la Mediateca

**URL principal:** `/mediateca`

**Salas:**

| Sala | URL | Contenido inicial mínimo |
|---|---|---|
| Biblioteca | `/mediateca/biblioteca` | 20-30 libros/documentos digitalizados sobre emigración gallega |
| Hemeroteca | `/mediateca/hemeroteca` | Colección de tapas o artículos de prensa gallega histórica |
| Musicoteca | `/mediateca/musica` | 50-100 canciones/álbumes con ficha de artista y contexto |
| Fototeca | `/mediateca/fotos` | Colección de fotos históricas de la diáspora (dominio público) |
| Fonoteca | `/mediateca/testimonios` | Primeros testimonios orales (grabaciones propias o externas) |

**Nota sobre la Fonoteca / Historia oral:** Es el activo más valioso a largo plazo. Requiere un protocolo de contribución claro — quién puede subir, con qué formato, cómo se modera. Diseñar ese flujo es tan importante como la UI.

### Modelo de contribución

- **Curado por el equipo:** la base inicial. Controla la calidad y el tono.
- **Aportes de la comunidad:** fotos familiares históricas, grabaciones de relatos orales, libros de la diáspora. Con moderación y atribución.
- **Colaboración con instituciones:** CEMLA, Arquivo de Galicia, Xunta (segunda etapa institucional).

### Interconexión con otros módulos

La Mediateca no es una isla. Cada elemento tiene contexto:
- Una foto de 1920 en Buenos Aires → conectada con el árbol de quien aparece en ella
- Una canción gallega → conectada con la parroquia donde nació el artista
- Un libro sobre la emigración → conectado con los eventos históricos del período
- Un testimonio oral → vinculado al árbol de quien lo da

---

## FASE 5 — MICROSITIOS DE ASOCIACIONES
**Duración estimada:** 3-4 semanas
**Objetivo:** Activar la red de asociaciones gallegas como nodos del centro virtual.

> **Por qué quinto:** Las asociaciones son el puente entre el mundo digital y el físico, entre los mayores (que las frecuentan) y los jóvenes (que no van). Pero para que funcionen, el portal ya tiene que tener valor propio — no puede depender de que las asociaciones lo validen.

### Lo que incluye
- Micrositio público por asociación (ver PRD sección 8)
- CMS simple para que cada asociación gestione su contenido sin asistencia técnica
- Integración de la agenda de cada asociación en la agenda global del portal
- Directorio actualizado con datos reales

---

## FASE 6 — MODELO DE NEGOCIO
**Duración estimada:** 2-3 semanas (técnica) + tiempo de validación con usuarios
**Objetivo:** Activar los pagos y hacer el portal económicamente sostenible.

> **Por qué sexto:** El portal necesita ser sostenible. Pero activar pagos antes de tener usuarios que quieran pagar es el orden incorrecto. Primero hay que construir valor, luego monetizarlo.

### Lo que incluye
- Backend de pagos: MercadoPago (Argentina) + Stripe (internacional)
- Activación de planes con feature flags reales
- Emails transaccionales (bienvenida, pago, vencimiento)
- Dashboard de suscripciones en el panel admin
- Página de planes clara con comparativa de features

---

## FASE 7 — HISTORIA ORAL Y COMUNIDAD PROFUNDA
**Duración estimada:** continua
**Objetivo:** Convertir el portal en el archivo vivo más completo de la diáspora gallega.

Esta fase no tiene fecha de cierre — es el horizonte del proyecto. Incluye:
- Historia oral activa: protocolo de grabación y contribución
- Matching entre árboles (cuando haya masa crítica)
- Comunidades de parroquias y apellidos
- Eventos presenciales coordinados desde el portal
- Neo4j para redes migratorias (tercera etapa del PRD)

---

## RESUMEN DE FASES Y PRIORIDADES

```
FASE 0 — Deuda técnica          1-2 días    ← AHORA
FASE 1 — Fundación visual       1 semana    ← Semana 1
FASE 2 — Contenido inaugural    2-3 semanas ← Semana 2-4
FASE 3 — Tu lugar en Galicia    3-4 semanas ← Mes 2
FASE 4 — La Mediateca           4-6 semanas ← Mes 2-3
FASE 5 — Asociaciones           3-4 semanas ← Mes 3-4
FASE 6 — Pagos                  2-3 semanas ← Mes 4-5
FASE 7 — Historia oral          continua    ← Horizonte
```

---

## CRITERIOS DE PASO ENTRE FASES

Una fase no está completa hasta que pasa las cuatro pruebas de `VISION.md`:

1. **Prueba del joven** — ¿Un joven de 28 años sin contexto previo entiende y se emociona?
2. **Prueba del mayor** — ¿Una persona de 60 años con poca experiencia digital puede usarlo?
3. **Prueba del centro gallego** — ¿Une o solo informa?
4. **Prueba de la cultura viva** — ¿Muestra Galicia como algo que existe hoy?

Y los criterios técnicos de siempre:
- Build limpio (`npm run build` sin errores)
- Probado en browser en los flujos principales
- Commit y push con mensaje descriptivo
- `ESTADO_PROYECTO.md` actualizado

---

## LO QUE NO ESTÁ EN ESTE PLAN (Y POR QUÉ)

| Módulo | Por qué no está aquí |
|---|---|
| App móvil nativa | Tercera etapa — primero validar la web |
| Neo4j / redes migratorias | Tercera etapa — requiere masa crítica de datos |
| DNA matching | Fuera del diferencial de GM (ver PRD) |
| Agente genealógico con IA | Postergado — requiere repositorio propio de registros |
| Integración FamilySearch OAuth | Segunda etapa avanzada — requiere registro y aprobación |
| Repositorio propio de registros históricos | Tercera etapa — proyecto en sí mismo |

---

*Documento creado el 28 de junio de 2026.*
*Gobierna la secuencia de construcción del portal. Se actualiza al completar cada fase.*
*Documento padre: `docs/VISION.md`. Documento técnico de referencia: `docs/PRD.md`.*
