# Galicia Migrante — Product Requirements Document (PRD)
### Qué es el producto, para quién es y qué hace
**Versión:** 2.2 — 20 de mayo de 2026
**Estado:** Borrador de trabajo
**Autores:** Equipo Galicia Migrante

---

## Índice

1. [Visión general](#1-visión-general)
2. [Principios de diseño del producto](#2-principios-de-diseño-del-producto)
3. [Audiencia objetivo y estrategia generacional](#3-audiencia-objetivo-y-estrategia-generacional)
4. [Secciones del portal](#4-secciones-del-portal)
5. [Menú principal y estructura de navegación](#5-menú-principal-y-estructura-de-navegación)
6. [Membresías, planes y medios de pago](#6-membresías-planes-y-medios-de-pago)
7. [Módulos por etapa](#7-módulos-por-etapa)
8. [Micrositios de asociaciones](#8-micrositios-de-asociaciones)
9. [Métricas de éxito](#9-métricas-de-éxito)
10. [Marco legal y privacidad](#10-marco-legal-y-privacidad)
11. [Seguridad](#11-seguridad)
12. [Glosario](#12-glosario)
13. [Referencias de producto — análisis competitivo](#13-referencias-de-producto--análisis-competitivo)

---

## 1. Visión general

### 1.1 Descripción

**Galicia Migrante** es un ecosistema digital integral destinado a preservar, reconstruir, revitalizar y transmitir la cultura gallega entre las comunidades de la diáspora y sus descendientes.

El portal es la puerta de entrada al ecosistema. La genealogía es el servicio estrella del MVP — el más emocional y el que más engancha — pero es uno de los muchos servicios que el ecosistema ofrecerá. El sistema se irá definiendo y reconfigurando continuamente.

```
GALICIA MIGRANTE — Portal / Ecosistema digital
  ├── Genealogía (Tu árbol genealógico)       ← servicio estrella del MVP
  ├── Territorio (Tu lugar en Galicia)
  ├── Comunidad (Asociaciones, micrositios)
  ├── Cultura (Biblioteca, memoria oral, tradiciones)
  ├── Investigación (Registros históricos, repositorio propio)
  ├── Trámites (Xunta, Gobierno de España)
  └── [Lo que todavía no sabemos que va a existir]
```

Galicia Migrante complementa —sin reemplazar— a los centros gallegos tradicionales presentes en Argentina y el mundo.

### 1.2 Misión

Crear un ecosistema digital moderno que permita a descendientes gallegos de todo el mundo reconectarse con sus raíces, su territorio, su historia, su comunidad, su cultura y su identidad.

### 1.3 Visión

Convertirse en la principal infraestructura digital de referencia para la preservación y reconstrucción de la memoria histórica, cultural y genealógica de la diáspora gallega.

### 1.4 Propuesta de valor

- Para el **descendiente de gallegos**: un lugar donde encontrar sus raíces, construir su árbol genealógico, conocer la Galicia de sus ancestros y conectar con la comunidad.
- Para las **asociaciones gallegas**: presencia digital profesional sin necesidad de conocimientos técnicos, con micrositio propio dentro del portal.
- Para la **comunidad en general**: agenda cultural, directorio de instituciones y acceso a trámites y programas de la Xunta de Galicia y el Gobierno de España.

### 1.5 Identidad del ecosistema

**Qué es:**
- Plataforma cultural
- Infraestructura patrimonial
- Sistema genealógico
- Red de memoria migratoria
- Ecosistema digital gallego
- Archivo vivo de la diáspora
- Proyecto de reconstrucción colaborativa — los usuarios no solo consumen, contribuyen a reconstruir la memoria colectiva

**Qué NO es:**
- Una red social genérica
- Una copia de Ancestry
- Un clon de MyHeritage
- Un reemplazo de FamilySearch

**Diferencial principal:** la reconstrucción contextual de la experiencia migratoria gallega, con el nivel de detalle territorial (parroquia, aldea) que ninguna otra plataforma ofrece.

---

## 2. Principios de diseño del producto

- **El portal es la puerta de entrada:** la genealogía es el servicio estrella del MVP, no el núcleo del ecosistema. El sistema crece en todas las direcciones que la comunidad necesite.

- **El ecosistema se reconfigura continuamente:** cada decisión de arquitectura, schema, stack y código debe evaluarse no solo contra lo que el sistema hace hoy, sino contra su capacidad de incorporar lo que todavía no sabemos que va a necesitar hacer.

- **Complementar, nunca reemplazar:** el portal existe para potenciar los centros gallegos tradicionales, no para competir con ellos.

- **Modularidad:** cada sección es independiente — se puede agregar, modificar o desactivar sin afectar el resto.

- **Escalabilidad evolutiva:** el producto crece sin reescribir lo que ya funciona.

- **Multiidioma desde el inicio:** español argentino, gallego e inglés. Agregar un nuevo idioma no requiere tocar el código.

- **Mobile-first:** la experiencia prioriza dispositivos móviles. La tercera y cuarta generación — los jóvenes que el proyecto necesita atraer — viven en el móvil.

- **Galicia como eje central:** la territorialidad gallega (autonomía, provincia, comarca, ayuntamiento, parroquia, aldea) es esencial para comprender genealogía y migración.

- **Preservación cultural activa:** el proyecto no debe representar Galicia exclusivamente como pasado o nostalgia. La cultura gallega se muestra como dinámica, contemporánea, creativa, intergeneracional y global.

- **Respeto histórico:** la genealogía exige evidencia verificable, fuentes trazables e historial de cambios. La IA nunca inventa evidencia ni falsifica parentescos.

- **Interoperabilidad:** GEDCOM, GEDCOM X, FamilySearch OAuth, APIs territoriales oficiales.

- **El camino más corto termina siendo el más largo:** las decisiones se toman correctamente desde el principio. No se hacen parches temporales.

---

## 3. Audiencia objetivo y estrategia generacional

### 3.1 Segmentos

| Segmento | Descripción | Acceso |
|---|---|---|
| Visitante anónimo | Cualquier persona interesada en la comunidad gallega | Público |
| Descendiente registrado | Persona con apellidos o ascendencia gallega, registrada en el portal | Login gratuito |
| Asociado | Descendiente con membresía paga, acceso completo al portal | Login + plan |
| Asociación | Centro gallego registrado con micrositio propio | Login + plan asociación |
| Administrador | Equipo de Galicia Migrante | Login + rol admin |

### 3.2 Estrategia generacional

El ecosistema debe atender las necesidades distintas de cada generación de la diáspora:

| Generación | Necesidad principal | Estrategia |
|---|---|---|
| Primera generación | Conservación de memoria directa | Historia oral, testimonios, biografías |
| Segunda generación | Reconexión familiar y territorial | Árbol genealógico, territorio gallego |
| Tercera y cuarta generación | Descubrimiento identitario y reconstrucción cultural | Exploración, gamificación, comunidad, narrativa visual |

Las nuevas generaciones responden especialmente a: exploración, identidad, narrativa, visualización, interacción, comunidad y descubrimiento personal.

### 3.3 Objetivo emocional

El sistema debe lograr que el usuario sienta: **"Galicia tiene algo que ver conmigo."**

---

## 4. Secciones del portal

| Sección | Acceso | Estado |
|---|---|---|
| Landing page | Público | ✅ MVP |
| Agenda de la colectividad | Público | ✅ MVP (estático) |
| Directorio de asociaciones | Público | ✅ MVP (estático) |
| Micrositios de asociaciones | Login (asociación) | 🔜 Segunda etapa |
| Tu árbol genealógico | Login (membresía) | ✅ MVP (datos reales vía Supabase) |
| Tu lugar en Galicia | Público | 🔜 Segunda etapa |
| Xunta de Galicia | Público | ✅ MVP (estático) → API segunda etapa |
| Gobierno de España | Público | ✅ MVP (estático) → API segunda etapa |
| Biblioteca digital | Login (membresía) | 🔜 Segunda etapa |
| Historia oral y testimonios | Login (membresía) | 🔜 Segunda etapa |
| Publicidad / banners | Público | ✅ MVP (placeholder) |
| Panel de administración general | Admin | ✅ MVP |

---

## 5. Menú principal y estructura de navegación

### 5.1 Principios de navegación

- La versión en español es la referencia para definir estructura y orden.
- Las traducciones GL/EN se agregan sin tocar la estructura ni el código.
- Agregar un nuevo idioma solo requiere agregar un bloque al objeto `I18N`.
- Los ítems de segunda etapa reservan su lugar pero se muestran deshabilitados.
- "Tu árbol genealógico" requiere login. Si el usuario no está logueado, se lo lleva al formulario de auth.
- Lo que se agrega al portal no borra lo ya hecho — puede reorganizarlo y reubicarlo.

### 5.2 Traducciones del menú principal

| Español | Galego | English |
|---|---|---|
| Inicio | Inicio | Home |
| Quiénes somos | Quen somos | About us |
| Servicios | Servizos | Services |
| Asociaciones | Asociacións | Associations |
| Agenda | Axenda | Events |
| Tus orígenes | ¿E ti, de quen vés siendo? | Your Origins |
| Tu árbol genealógico | A túa árbore xenealóxica | Your family tree |
| Tu lugar en Galicia | O teu lugar en Galicia | Your place in Galicia |
| Xunta de Galicia | Xunta de Galicia | Xunta de Galicia |
| Gobierno de España | Goberno de España | Government of Spain |
| Biblioteca | Biblioteca | Library |
| Ingresar | Entrar | Sign in |
| Registrarse | Rexistrarse | Sign up |

### 5.3 Estructura completa del menú

```
MENÚ PRINCIPAL — Galicia Migrante

── MVP ─────────────────────────────────────────────────────────

1. Inicio

2. Quiénes somos

3. Servicios

4. Asociaciones
   4.1. Directorio de asociaciones
   4.2. Registrar mi asociación

5. Agenda

6. Tus orígenes
   6.1. Tu árbol genealógico   ← requiere login
      6.1.1. Inicio
         6.1.1.1. Eventos familiares
         6.1.1.2. Estadísticas familiares
         6.1.1.3. Miembros del sitio
      6.1.2. Árbol
         6.1.2.1. Mi árbol
         6.1.2.2. Mis fotos
         6.1.2.3. Administrar árboles
         6.1.2.4. Imprimir gráficos y libros
         6.1.2.5. Línea de tiempo
         6.1.2.6. Mapa familiar
         6.1.2.7. Informe de relaciones
         6.1.2.8. Fuentes
      6.1.3. Descubrimientos
         6.1.3.1. Coincidencias por persona
         6.1.3.2. Coincidencias por fuente
      6.1.4. Fotos y documentos
         6.1.4.1. Mis fotos
         6.1.4.2. Mis documentos
         6.1.4.3. Análisis de documentos con IA
      6.1.5. Investigación
         6.1.5.1. Explorar registros históricos
         6.1.5.2. Catálogo de la colección
         6.1.5.3. Nacimiento, matrimonio y defunción
         6.1.5.4. Censos y padrones de votantes
         6.1.5.5. Árboles genealógicos
         6.1.5.6. Periódicos
         6.1.5.7. Registros de inmigración

── SEGUNDA ETAPA — lugar reservado ─────────────────────────────

   6.2. Tu lugar en Galicia   ← segunda etapa
      (referencias geográficas, fotográficas, demográficas,
      escudos, banderas, aldeas, parroquias, concellos,
      comarcas, provincias y la autonomía de Galicia)

7. Xunta de Galicia   ← tentativo, sujeto a cambios
   7.1. Programas y ayudas
   7.2. Retorno a Galicia
   7.3. Galicia Aberta
   7.4. Delegaciones
   (estático MVP — API + acuerdos institucionales segunda etapa)

8. Gobierno de España   ← tentativo, sujeto a cambios
   8.1. Trámites consulares
   8.2. Nacionalidad española
   8.3. Ayudas y pensiones
   8.4. Servicios para españoles en el exterior
   (estático MVP — API + acuerdos institucionales segunda etapa)

9. Biblioteca   ← segunda etapa
   (libros y documentos sobre emigración gallega)

── AUTH ────────────────────────────────────────────────────────

10. Ingresar / Registrarse
```

### 5.4 Referencias de diseño

El módulo "Tu árbol genealógico" toma como referencia funcional a MyHeritage. El análisis completo de funcionalidades de MyHeritage está documentado en `myheritage.md`. Los links de referencia son solo para entender la funcionalidad a replicar — no hay integración real con MyHeritage planificada. Las decisiones tomadas a partir de ese análisis (qué replicar, qué mejorar, qué no implementar) están documentadas en la sección 13 de este documento y en `LEGAJO_FUTURO.md`.

---

## 6. Membresías, planes y medios de pago

### 6.1 Planes (precios a definir)

| Plan | Período | Acceso | Límite personas árbol | Storage | Micrositio |
|---|---|---|---|---|---|
| Gratuito | Siempre | Agenda, directorio | 0 | 0 | No |
| Asociado | Mensual | Todo el portal | 50 | 1 GB fotos + 500 MB docs | No |
| Asociación | Mensual | Todo el portal | 200 | 5 GB fotos + 2 GB docs | Sí |

> Los precios y límites están en la base de datos — se modifican desde el panel admin sin tocar código.

### 6.2 Features por plan

| Feature | Gratuito | Asociado | Asociación |
|---|---|---|---|
| Agenda de eventos | ✅ | ✅ | ✅ |
| Directorio de asociaciones | ✅ | ✅ | ✅ |
| Tu árbol genealógico | — | ✅ | ✅ |
| Fotos y documentos históricos | — | ✅ | ✅ |
| Historia oral (audio) | — | ✅ | ✅ |
| Biblioteca digital | — | ✅ | ✅ |
| Trámites Xunta & España | — | ✅ | ✅ |
| Micrositio de asociación | — | — | ✅ |
| Soporte prioritario | — | ✅ | ✅ |

### 6.3 Medios de pago

**Argentina:**
- MercadoPago — tarjetas, débito, saldo MP, cuotas
- QR interoperable BCRA — funciona con Modo, Naranja X, Ualá, MercadoPago y todos los bancos (un solo QR por regulación del BCRA)
- Transferencia bancaria via CBU/CVU/Alias
- Ualá

**Internacional:**
- Stripe — tarjetas internacionales, Apple Pay, Google Pay
- PayPal — usuarios en España, Cuba, Venezuela
- Transferencias SEPA — usuarios en España y Europa

> Los medios de pago se activan en segunda etapa junto con el backend Node.

---

## 7. Módulos por etapa

### 7.1 MVP — Primera etapa ✅ COMPLETO

| Módulo | Descripción | Estado |
|---|---|---|
| Landing page | Presentación del portal, multiidioma, menú reestructurado con 8 secciones y dropdowns | ✅ commit f87dd28 |
| Auth | Registro, login, logout, recuperación de contraseña | ✅ |
| Tu árbol genealógico | Genealogía con árbol visual Cytoscape.js + dagre, modal completo, CRUD completo, motor DAG con soporte de ciclos | ✅ Datos reales vía Supabase |
| Importación/exportación | GEDCOM tolerante (pipeline 6 capas), CSV, Excel, JSON, plantilla descargable | ✅ commit f79be95 |
| Eventos familiares | Auto-generados + manuales | ✅ commit 0a53c15 |
| Estadísticas familiares | Gráficos reales desde Supabase | ✅ commit 4179ffd |
| Miembros del sitio | Datos reales, filtros, gestión | ✅ commit 4179ffd |
| Asociaciones | Directorio y registro | ✅ estático |
| Agenda | Eventos de la colectividad | ✅ estático |
| Xunta de Galicia | Información institucional | ✅ estático |
| Gobierno de España | Información institucional | ✅ estático |
| Panel de administración general | 4 tabs: usuarios, roles, planes, actividad | ✅ commit dadbf87 |
| Asistente genealógico con IA | Conversacional — evaluar en MVP avanzado | ⏳ Postergado a segunda etapa |

**Base de datos:** 37 tablas, RLS, migraciones 001–008 aplicadas.

### 7.2 Segunda etapa

**Migración técnica conjunta (antes de iniciar esta etapa):**
React + Vite → Next.js | JavaScript → TypeScript | Express → NestJS | CSS-in-JS → TailwindCSS
Supabase no cambia. Neo4j no entra en esta etapa.

| Módulo | Descripción | Origen de la decisión |
|---|---|---|
| **Multi-árbol** | Un usuario puede tener N árboles independientes. El total de personas en todos sus árboles no puede superar el límite de su plan. Dropdown en el header para cambiar entre árboles y crear nuevos. ✅ Implementado 22/05/2026 | Decisión arquitectónica 22/05/2026 |
| **Feature flags por plan** | Sistema de permisos basado en tablas `features`, `plan_features`, `usuario_features`. Agregar un servicio nuevo = insertar filas en BD sin tocar código. Admin general con overrides ilimitados. ✅ Implementado 22/05/2026 | Decisión arquitectónica 22/05/2026 |
| **Gestión de planes desde admin general** | El admin general puede crear planes, modificar parámetros (límites, features, precios) y dar de baja planes con migración de usuarios afectados al plan de reemplazo. | Decisión de producto 22/05/2026 |
| **Vinculación entre árboles** | Personas compartidas entre árboles independientes con icono 🔗. Una persona vive en su árbol natural y aparece como referencia en otros. Mecanismo manual: "buscar en otros árboles" al agregar pareja/familiar. Descendencia compartida pertenece a ambos árboles. | Decisión de producto 22/05/2026 |
| Tu lugar en Galicia | Territorio gallego navegable: parroquias, aldeas, concellos, comarcas. Seed IGE (~3.800 parroquias). SGC propio como fuente de contenido — sin dependencia de Wikipedia. Ver `SGC_TU_LUGAR_EN_GALICIA.md` | Roadmap original + decisión arquitectónica 21/05/2026 |
| **Perfil extendido de persona** | Emigración/inmigración como evento destacado (barco, puerto, fecha, destino), bautismo + padrinos + madrinas, servicio militar, múltiples ocupaciones con período, educación con institución y título | Análisis MyHeritage — diferencial GM |
| **Galería de fotos** | Fotos adjuntas al perfil de persona, fotos etiquetadas, álbumes por sitio familiar, privacidad individual por foto | Análisis MyHeritage |
| **Campos territoriales gallegos** | Parroquia + aldea + concello como campos estructurados con dropdown desde seed IGE (~3.800 parroquias). Reemplaza texto libre de lugar de nacimiento. | Análisis MyHeritage — diferencial GM |
| **Consistency Checker** | Verificación lógica de fechas, edades y relaciones. Se ejecuta post-importación GEDCOM y bajo demanda. Condición previa para matching entre árboles. | Análisis MyHeritage — alta prioridad |
| **Fan View — vista de abanico** | Vista del árbol como semicírculo con identidad visual de GM (azul/dorado). Exportable y compartible en redes sociales — herramienta de adquisición orgánica. | Análisis MyHeritage |
| **Línea de tiempo familiar** | Cronología de eventos del árbol. Segunda etapa: básica. Tercera etapa: con superposición de contexto histórico gallego. | Análisis MyHeritage |
| **Informe de relaciones** | Calcula el parentesco entre dos personas del árbol y muestra el camino completo generación a generación. | Análisis MyHeritage |
| FamilySearch OAuth | Login con cuenta FamilySearch, importación de árboles, búsqueda de registros parroquiales gallegos | Roadmap original — ⚠️ requiere registro previo |
| GEDCOM X | Versión moderna de GEDCOM — mayor riqueza de datos | Roadmap original |
| Backend Node → NestJS | Pagos, emails transaccionales, webhooks | Roadmap original |
| Pagos | MercadoPago + QR BCRA + CBU/Alias + Stripe + PayPal + SEPA | Roadmap original |
| Historia oral | Carga y reproducción de testimonios en audio y video | Roadmap original |
| Notificaciones push | Cumpleaños, aniversarios, nuevos matches — requiere backend activo. Punto de extensión marcado en EventosFamiliares.jsx | Roadmap original |
| Mensajería interna | Entre miembros del mismo sitio familiar, entre usuarios con ancestros en común | Roadmap original |
| Google OAuth / Apple OAuth | Login social | Roadmap original |
| 2FA / TOTP | Autenticación de dos factores para usuarios admin | Roadmap original |
| Dashboard de métricas | En panel admin general | Roadmap original |
| Asistente genealógico con IA | Conversacional — ayuda a estructurar datos y detectar inconsistencias | Postergado desde MVP |

**Funcionalidades postergadas al Legajo para el Futuro:** ver `LEGAJO_FUTURO.md` para el detalle de ideas que no entran en esta etapa (colorización de fotos, Photo Storyteller, gamificación, comunidades de parroquias, app móvil, y otras).

### 7.3 Tercera etapa

| Módulo | Descripción |
|---|---|
| App móvil nativa | React Native — misma API del backend. Casos de uso móviles: notificaciones, cámara para documentos, mapa familiar, compartir descubrimientos. Seguridad biométrica (Face ID / Touch ID). |
| Repositorio propio de registros históricos | Base de datos curada de registros gallegos (archivos diocesanos, Arquivo de Galicia) y de la diáspora (AGN Argentina, CEMLA). API propia como primera fuente de consulta. |
| Neo4j — redes migratorias | Grafos de relaciones entre árboles, barcos, puertos, rutas migratorias. Capa 3 del ecosistema. |
| Mapas migratorios familiares | Visualización de trayectorias familiares en el tiempo y el espacio |
| Comunidades de parroquias y apellidos | Microcomunidades identitarias que conectan usuarios por origen territorial o apellido |
| Reconstrucción colaborativa | Indexación y recuperación colectiva de memoria — usuarios contribuyen a transcribir y validar documentos históricos |
| Agente de investigación autónomo | Busca en repositorio propio, FamilySearch y archivos digitalizados para un ancestro específico |
| NLP gallego | Procesamiento de nombres, topónimos y documentos en gallego histórico |

### 7.4 Cuarta etapa y futura

| Módulo | Descripción |
|---|---|
| API de contenido territorial propio | Historias migratorias por parroquia, fotografías históricas, memoria oral, demografía histórica, tradiciones locales |
| Integración institucional completa | Xunta de Galicia API + Gobierno de España API + acuerdos institucionales |
| Biblioteca digital | Libros y documentos sobre emigración gallega |
| Actividades presenciales | Encuentros de descendientes jóvenes, talleres genealógicos, viajes de reconexión a Galicia, festivales híbridos — coordinados desde el portal |

---

## 8. Micrositios de asociaciones

### 8.1 Concepto

El micrositio es un **CMS simple integrado dentro del portal**. Cada asociación registrada tiene su propia página pública en:

```
galicia-migrante.vercel.app/asociaciones/[slug-asociacion]
```

**Principios:**
- Es un CMS de contenido, no una plataforma genealógica — no incluye árbol ni funciones de genealogía
- El admin de la asociación gestiona sus contenidos de forma autónoma, sin asistencia técnica
- El admin de la asociación **no tiene acceso al resto del portal**
- Cada asociación ve y edita únicamente sus propios datos (aislamiento por RLS)
- El contenido público es visible sin login para cualquier visitante
- Se construye en Next.js — primer módulo 100% público con rutas dinámicas

### 8.2 Vista pública del micrositio

| Sección | Contenido |
|---|---|
| **Inicio** | Hero con foto de portada, nombre, descripción institucional, historia breve |
| **Autoridades** | Comisión directiva: foto, nombre y cargo de cada integrante |
| **Agenda** | Eventos propios de la asociación con fecha, lugar y descripción |
| **Galería** | Fotos de actividades, eventos e instalaciones |
| **Noticias** | Novedades, comunicados y artículos |
| **Contacto** | Dirección física, teléfono, email, redes sociales y formulario de contacto |

### 8.3 Estructura de URLs

```
/asociaciones/                              → Directorio público (MVP, estático)
/asociaciones/[slug]                        → Inicio del micrositio
/asociaciones/[slug]/autoridades            → Comisión directiva
/asociaciones/[slug]/agenda                 → Eventos de la asociación
/asociaciones/[slug]/galeria                → Galería de fotos
/asociaciones/[slug]/noticias               → Novedades
/asociaciones/[slug]/contacto               → Contacto y formulario
/asociaciones/[slug]/admin                  → Panel admin (requiere login + rol)
/asociaciones/[slug]/admin/inicio           → Editar datos generales
/asociaciones/[slug]/admin/autoridades      → Gestionar comisión directiva
/asociaciones/[slug]/admin/agenda           → Gestionar eventos
/asociaciones/[slug]/admin/fotos            → Gestionar galería
/asociaciones/[slug]/admin/noticias         → Gestionar noticias
```

### 8.4 Panel de administración de la asociación

**Acceso:** exclusivo del usuario con rol `admin_asociacion` asignado a esa asociación.
**Seguridad:** 2FA obligatorio via TOTP (app móvil). Sesión de máximo 4 horas.

**Puede:**
- Editar todos los contenidos del micrositio
- Subir y gestionar fotos (galería, logo, foto de portada)
- Publicar, editar y eliminar eventos propios
- Publicar, editar y eliminar noticias y comunicados
- Gestionar la lista de autoridades

**No puede:**
- Ver ni editar datos de otras asociaciones
- Acceder al árbol genealógico ni a datos de usuarios del portal
- Gestionar usuarios generales o planes del portal
- Acceder al panel de administración general

### 8.5 Base de datos

| Tabla | Estado |
|---|---|
| `asociaciones` | ✅ Ya existe |
| `asociaciones_directivos` | ✅ Ya existe |
| `asociaciones_noticias` | ✅ Ya existe |
| `eventos` | ✅ Ya existe |
| `fotos_asociacion` | 🔜 Segunda etapa |

### 8.6 Roles y permisos

| Rol | Permisos sobre micrositios |
|---|---|
| `admin_asociacion` | Gestión completa de **su propio** micrositio. Sin acceso al resto del portal. |
| `admin_general` | Ve y puede editar **cualquier** micrositio. Moderación global. |
| Visitante anónimo | Lectura del micrositio público. Sin login. |

---

## 9. Métricas de éxito

El éxito no se mide únicamente por cantidad de usuarios, árboles o visitas. También se mide por participación comunitaria, continuidad generacional y revitalización cultural.

### 9.1 Métricas MVP — tracción

| Métrica | Qué mide |
|---|---|
| Usuarios registrados | Volumen base |
| Usuarios activos mensuales (MAU) | Retención real |
| Árboles con al menos 5 personas | Adopción real del servicio genealógico |
| Tasa de conversión gratuito → pago | Viabilidad económica |
| Tiempo promedio en el árbol por sesión | Engagement |

### 9.2 Métricas segunda etapa — comunidad

| Métrica | Qué mide |
|---|---|
| Sitios familiares compartidos (2+ miembros) | Uso colaborativo |
| Coincidencias aceptadas entre árboles | Valor del matching |
| Distribución etaria de usuarios activos | Alcance generacional |
| Micrositios con contenido publicado en últimos 30 días | Actividad de asociaciones |

### 9.3 Métricas de misión

| Métrica | Cómo medirla |
|---|---|
| Continuidad generacional | Usuarios menores de 35 años activos y su crecimiento |
| Reconexión territorial | Ancestros vinculados a parroquia específica |
| Memoria preservada | Personas con biografía, fotos y documentos adjuntos |
| Colaboración familiar | Promedio de miembros por sitio familiar activo |

---

## 10. Marco legal y privacidad

### 10.1 Marcos legales aplicables

- **GDPR (Europa)** — aplica por usuarios en España/Galicia. Requiere consentimiento explícito, derecho al olvido, portabilidad de datos, notificación de brechas en 72hs.
- **Ley 25.326 (Argentina)** — protección de datos personales. Requiere registro ante la AAIP.
- **Ley de Servicios de la Sociedad de la Información (España)** — aplica para el portal accesible desde España.
- **Derechos de autor** — documentos históricos subidos por usuarios pueden tener derechos vigentes.

### 10.2 Documentos legales requeridos (antes del lanzamiento público)

- Términos y Condiciones
- Política de Privacidad (GDPR + Argentina)
- Política de Cookies
- Consentimiento para datos de terceros vivos en el árbol
- Condiciones específicas para asociaciones
- Aviso y política para datos de menores de edad

### 10.3 Personas vivas en el árbol

Cuando un usuario agrega a su árbol a una persona viva, esa persona nunca consintió. Política aplicada:
- Personas marcadas como `vivo = TRUE` tienen datos restringidos — solo el propietario del árbol puede verlos completos
- No aparecen en búsquedas públicas ni en matchings sin consentimiento explícito
- Los menores de edad tienen restricciones adicionales

### 10.4 Acciones pendientes (equipo)

- Contratar asesoría legal especializada en protección de datos antes del lanzamiento
- Registrar la base de datos ante la AAIP (Argentina)
- Registrar dominio y servicios críticos a nombre de una entidad, no de una persona física

---

## 11. Seguridad

### 11.1 Niveles de seguridad por rol

| Rol | Autenticación | Sesión |
|---|---|---|
| Usuario regular | Email + contraseña | Persistente (SDK Supabase) |
| Admin de sección | Email + contraseña fuerte + **2FA TOTP móvil** obligatorio | 4hs sin actividad |
| Admin general | Email + contraseña larga (20+ chars) + **YubiKey física** obligatoria | 2hs máximo |

### 11.2 Sucesión y continuidad

El sistema nunca debe depender de un único administrador general.

**Estructura recomendada:**
```
Admin general primario    ← operación diaria
Admin general secundario  ← respaldo activo, acceso completo idéntico
Admin general emergencia  ← credenciales físicas en sobre cerrado,
                            se activa solo si los dos anteriores fallan
```

El sobre de emergencia contiene credenciales, URLs, instrucciones paso a paso y contactos de todos los proveedores. Se guarda en caja de seguridad bancaria o con abogado de confianza. Revisión anual obligatoria.

**Regla de oro:** ningún servicio crítico (GitHub, Vercel, Supabase, dominio) registrado solo a nombre de una persona física.

### 11.3 Seguridad biométrica

- **App móvil (tercera etapa):** Face ID / Touch ID para login y confirmación de transacciones
- **Web:** no aplica de forma estándar — la biometría es complemento del dispositivo, no reemplaza la autenticación del servidor

---

## 12. Glosario

| Término | Definición |
|---|---|
| **Portal** | El sistema completo de Galicia Migrante |
| **Ecosistema** | El conjunto de servicios, comunidades y plataformas de Galicia Migrante |
| **Módulo** | Una sección independiente del portal |
| **Micrositio** | La página propia de una asociación dentro del portal |
| **Tu árbol genealógico** | El servicio genealógico — estrella del MVP |
| **Tu lugar en Galicia** | El submódulo geográfico/demográfico sobre Galicia (segunda etapa) |
| **Sitio familiar** | El árbol genealógico de una familia dentro del módulo |
| **GEDCOM** | Genealogical Data Communication — formato estándar genealógico |
| **GEDCOM X** | Versión moderna de GEDCOM con soporte para datos más ricos |
| **FamilySearch** | Base de datos genealógica global gratuita operada por la Iglesia SUD |
| **MVP** | Minimum Viable Product — primera etapa funcional |
| **Emigrante** | Persona nacida en Galicia que emigró (tipo en el árbol) |
| **Diáspora** | Persona nacida fuera de Galicia con ascendencia gallega |
| **Plan** | Nivel de membresía con precio y permisos definidos |
| **Asociado** | Usuario registrado con membresía de pago |
| **Suscripción** | Relación activa entre un usuario y un plan |
| **Xunta** | Xunta de Galicia — gobierno autónomo de Galicia, España |
| **GaliciaAberta** | Red oficial de centros gallegos en el mundo (Xunta de Galicia) |
| **Concello / Ayuntamiento** | Municipio gallego |
| **Parroquia** | División administrativa menor que el concello en Galicia — unidad de identidad territorial |
| **Comarca** | Agrupación de concellos con características comunes |
| **Diócesis** | División eclesiástica gallega — organiza los archivos de libros sacramentales históricos |
| **Polyglot persistence** | Uso de múltiples bases de datos especializadas (PostgreSQL + Neo4j) para distintos casos de uso |
| **2FA / TOTP** | Autenticación de dos factores — requiere contraseña más código temporal de app móvil |
| **YubiKey** | Dispositivo físico de seguridad para autenticación de máxima seguridad |
| **GDPR** | Reglamento General de Protección de Datos — regulación europea de privacidad |
| **RLS** | Row Level Security — políticas de Supabase que garantizan aislamiento de datos por usuario |
| **IGE** | Instituto Galego de Estatística — fuente oficial de datos territoriales de Galicia |
| **CEMLA** | Centro de Estudios Migratorios Latinoamericanos — fuente de registros de inmigración |

---

---

## 13. Referencias de producto — análisis competitivo

### 13.1 MyHeritage — referencia funcional principal

El árbol genealógico de Galicia Migrante toma a MyHeritage como referencia funcional. El análisis completo está en `myheritage.md`.

**Decisiones tomadas a partir del análisis (sesión del 20/05/2026):**

| Decisión | Tipo |
|---|---|
| Perfil extendido con emigración como evento destacado | ✅ Implementar en segunda etapa |
| Educación en el perfil (institución, título, período) | ✅ Implementar en segunda etapa |
| Galería de fotos adjunta al perfil y al sitio familiar | ✅ Implementar en segunda etapa |
| Campos territoriales gallegos estructurados (parroquia/aldea/concello) | ✅ Implementar en segunda etapa |
| Consistency Checker post-importación y bajo demanda | ✅ Implementar en segunda etapa |
| Fan View con identidad visual de GM | ✅ Implementar en segunda etapa |
| Línea de tiempo familiar | ✅ Implementar en segunda etapa |
| Informe de relaciones | ✅ Implementar en segunda etapa |
| Padrinos y madrinas como campos estructurados (texto libre primero) | ✅ Implementar en segunda etapa |
| Smart Matching entre árboles | 🔜 Tercera etapa — requiere masa crítica |
| Record Matches con registros históricos | 🔜 Tercera etapa — requiere repositorio propio |
| Mapa de migraciones familiares | 🔜 Tercera etapa — requiere Neo4j |
| Colorización y restauración de fotos con IA | 🔜 Tercera etapa — requiere microservicio Python |
| Gamificación cultural | 🔜 Tercera etapa — requiere contenido suficiente |
| Comunidades de parroquias y apellidos | 🔜 Tercera etapa — requiere masa crítica |
| DNA matching | ❌ No implementar — fuera del diferencial de GM |

**Lo que MyHeritage no hace que GM sí hará:**
- Territorialidad gallega a nivel parroquia/aldea como campo de primera clase (no texto libre)
- Evento de emigración/inmigración destacado visualmente con datos específicos (barco, puerto, compañía)
- Padrinos y madrinas vinculables como personas reales del árbol (tercera etapa)
- Línea de tiempo con superposición de contexto histórico gallego (tercera etapa)
- Fan View con identidad visual gallega exportable para redes sociales

### 13.2 Legajo para el Futuro

Las ideas que no implementaremos por ahora están documentadas en `LEGAJO_FUTURO.md` con contexto suficiente para retomar cada una cuando llegue su momento. El legajo incluye 30 entradas en 7 categorías.

---

*Documento actualizado el 20 de mayo de 2026. Versión 2.2*
*Cambios v2.0: reencuadre conceptual (portal como ecosistema), estrategia generacional, mobile-first, métricas, marco legal, seguridad, medios de pago, storage, roadmap 4 etapas, FamilySearch, GEDCOM X, repositorio propio, Wikipedia API, Neo4j, gamificación, historia oral, redes sociales, agentes IA, glosario.*
*Cambios v2.1: panel de administración general marcado ✅ MVP. Lista pendientes MVP completada. Secciones del portal actualizadas.*
*Cambios v2.2: MVP marcado como completo (37 tablas, migraciones 001–008, todos los módulos). Segunda etapa enriquecida con decisiones del análisis de MyHeritage: perfil extendido, campos territoriales gallegos, Consistency Checker, Fan View, línea de tiempo, informe de relaciones. Sección 13 agregada con análisis competitivo y decisiones. Referencia a LEGAJO_FUTURO.md.*
