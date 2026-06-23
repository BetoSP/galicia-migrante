# Galicia Migrante — Especificación Técnica (SPEC)
### Cómo está construido el proyecto
**Versión:** 2.0 — 14 de mayo de 2026
**Estado:** Borrador de trabajo
**Autores:** Equipo Galicia Migrante

---

## Índice

1. [Stack tecnológico](#1-stack-tecnológico)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Estructura de archivos del proyecto](#3-estructura-de-archivos-del-proyecto)
4. [Base de datos — esquema completo](#4-base-de-datos--esquema-completo)
5. [Sistema de roles y permisos (RBAC)](#5-sistema-de-roles-y-permisos-rbac)
6. [Multiidioma (i18n)](#6-multiidioma-i18n)
7. [Variables CSS globales](#7-variables-css-globales)
8. [Convenciones de código](#8-convenciones-de-código)
9. [Despliegue: GitHub + Vercel](#9-despliegue-github--vercel)
10. [Decisiones de arquitectura y razonamiento](#10-decisiones-de-arquitectura-y-razonamiento)
11. [Credenciales y URLs del proyecto](#11-credenciales-y-urls-del-proyecto)
12. [Estado del proyecto y próximos pasos](#12-estado-del-proyecto-y-próximos-pasos)
13. [Apéndice: Archivos generados por sesión](#13-apéndice-archivos-generados-por-sesión)

---

## 1. Stack tecnológico

### 1.1 Frontend — MVP (activo)

| Tecnología | Uso | Justificación |
|---|---|---|
| **React + Vite** | Framework principal | Componentes reutilizables, escalabilidad, ecosistema |
| **@supabase/supabase-js** | Auth + datos directos desde el frontend | Elimina la necesidad de backend propio en MVP |
| **CSS-in-JS** (string template) | Estilos | Variables CSS configurables, sin dependencias adicionales |
| **i18n propio** | Multiidioma | Objeto `I18N` centralizado, sin librerías externas en MVP |
| **Playfair Display + Lato** | Tipografía | Google Fonts — elegancia editorial con legibilidad |

> **Nota:** migrar i18n a `react-i18next` cuando el número de cadenas justifique el overhead de configuración.

### 1.2 Frontend — Segunda etapa (migración conjunta)

Antes de construir los micrositios de asociaciones se realiza una migración conjunta del stack completo. Un solo movimiento, Claude Code se hace cargo:

| De | A | Justificación |
|---|---|---|
| React + Vite | **Next.js** | SSR/SSG para páginas públicas (micrositios, directorio). SEO real. File-based routing para `/asociaciones/[slug]`. |
| JavaScript | **TypeScript** | Modelo de datos complejo (40+ campos, relaciones, territorio). Múltiples capas que se comunican. Proyecto de larga duración. |
| CSS-in-JS | **TailwindCSS** | Velocidad de desarrollo, consistencia de diseño, incluido por defecto en Next.js. |
| Express | **NestJS** | Arquitectura modular para backend complejo. TypeScript nativo. Ecosistema integrado (JWT, Passport, Prisma). |

Supabase no cambia en esta migración. Neo4j no entra en esta etapa.

### 1.3 Backend Node.js — INACTIVO EN MVP

> El backend Node.js está en el repo pero inactivo. Se reactiva en segunda etapa reescrito en NestJS + TypeScript para pagos y emails. El frontend conecta directamente a Supabase mediante el SDK JS.

| Tecnología MVP | Tecnología segunda etapa | Uso |
|---|---|---|
| Node.js + Express | **Node.js + NestJS** | API REST |
| JavaScript | **TypeScript** | Lenguaje |
| JWT + cookie HttpOnly | JWT + cookie HttpOnly | Tokens de sesión |
| Nodemailer | Nodemailer | Emails transaccionales |

### 1.4 Backend Python — Tercera etapa

Para IA y procesamiento de lenguaje natural. Node.js no tiene ecosistema comparable.

| Tecnología | Uso |
|---|---|
| **Python + FastAPI** | Microservicio de IA |
| **spaCy** | NLP gallego |
| **Tesseract** | OCR de documentos históricos |
| **transformers** | Matching semántico, búsqueda semántica |

Arquitectura backend en etapas avanzadas:
```
NestJS (Node.js)   → API principal, auth, CMS, genealogía
FastAPI (Python)   → microservicio de IA: OCR, NLP, matching, búsqueda semántica
```

### 1.5 Autenticación (Supabase Auth SDK)

| Método | Estado |
|---|---|
| Email + contraseña (Supabase Auth) | ✅ Implementado |
| Persistencia de sesión automática (localStorage) | ✅ Manejada por SDK |
| `onAuthStateChange` en App.jsx | ✅ Implementado |
| Reset de contraseña por email | ✅ Implementado |
| Confirmación de email | ⏳ Desactivada temporalmente (reactivar en Supabase dashboard) |
| Google OAuth | ⏳ Segunda etapa |
| Apple OAuth | ⏳ Segunda etapa |
| FamilySearch OAuth | 🔜 Segunda etapa |
| 2FA / TOTP (admin de sección) | 🔜 Segunda etapa — obligatorio |
| YubiKey (admin general) | 🔜 Segunda etapa — obligatorio |
| reCAPTCHA v3 invisible | 🔜 Cuando haya volumen de registros |
| Biometría (Face ID / Touch ID) | 🔜 Tercera etapa (app móvil) |

### 1.6 Infraestructura

| Servicio | Uso | Estado |
|---|---|---|
| **GitHub** | Control de versiones | ✅ github.com/BetoSP/galicia-migrante |
| **Vercel** | Hosting frontend, deploy automático | ✅ galicia-migrante.vercel.app |
| **Supabase** | Base de datos + Auth + Storage + RLS | ✅ Migraciones 001-003 aplicadas |
| **Railway / Render** | Hosting backend NestJS | 🔜 Segunda etapa |
| **MercadoPago** | Pagos Argentina + QR BCRA | 🔜 Segunda etapa |
| **Stripe** | Pagos internacionales | 🔜 Segunda etapa |
| **PayPal** | España, Cuba, Venezuela | 🔜 Segunda etapa |
| **Cloudflare Stream / Mux** | Streaming de video (testimonios) | 🔜 Segunda etapa |
| **GitHub Actions** | CI/CD, tests automáticos, dependency scanning | 🔜 Segunda etapa |
| **Docker** | Containerización (cuando haya múltiples servicios) | 🔜 Tercera etapa |
| **Cloudflare** | CDN, protección DDoS | 🔜 Cuando el tráfico lo justifique |
| **Neo4j AuraDB** | Grafos de redes migratorias | 🔜 Tercera etapa |

### 1.7 Árbol genealógico

| Tecnología | Uso |
|---|---|
| **SVG nativo** | Visualización actual del árbol |
| **Motor bipartito custom (`genealogyLayout.js`)** | Motor de layout genealógico — diseño propio, internalizado en el repo, sin dependencias externas. Reemplazó Cytoscape.js + dagre (bugs estructurales) y family-chart (no mostraba todos los nodos). Diamantes ◆ como nodos de unión entre parejas. | ✅ En uso desde 21/05/2026 |
| **D3.js / Sigma.js** | Visualización de grafos y redes (tercera etapa — redes migratorias) |
| **Mapbox** | Mapas migratorios familiares (tercera etapa) |
| **GEDCOM** | Importación/exportación genealógica | ✅ Implementado — commit f79be95 |
| **GEDCOM X** | Versión moderna de GEDCOM — FamilySearch (segunda etapa) |

### 1.8 Storage de archivos

| Tipo | Servicio | Límite por plan |
|---|---|---|
| Imágenes | Supabase Storage | Asociado: 1 GB / Asociación: 5 GB |
| Documentos PDF | Supabase Storage | Asociado: 500 MB / Asociación: 2 GB |
| Audio (testimonios) | Supabase Storage | Asociado: 200 MB / Asociación: 1 GB |
| Video | Cloudflare Stream o Mux | Asociación: 10 videos |

Los límites exactos viven en la tabla `planes` — modificables desde el panel admin.

---

## 2. Arquitectura del sistema

### 2.1 Diagrama de alto nivel (MVP)

```
┌─────────────────────────────────────────────────────┐
│                   CLIENTE (React + Vite)             │
│  Landing │ Auth │ Orígenes │ Micrositios             │
│  @supabase/supabase-js (anon key + RLS)             │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / Supabase REST + WebSocket
┌──────────────────────▼──────────────────────────────┐
│                   SUPABASE                           │
│  PostgreSQL + RLS │ Auth │ Storage                   │
│  Región: South America (São Paulo)                   │
└─────────────────────────────────────────────────────┘

  Backend Node.js — INACTIVO en MVP
  ┌───────────────────────────────────────────────────┐
  │  Node.js + Express → reescribir en NestJS         │
  │  Activar para: pagos, emails, webhooks            │
  └───────────────────────────────────────────────────┘
```

### 2.2 Diagrama segunda etapa

```
┌─────────────────────────────────────────────────────┐
│              CLIENTE (Next.js + TypeScript)          │
│  SSR páginas públicas │ CSR páginas privadas         │
│  @supabase/supabase-js │ TailwindCSS                │
└──────────┬──────────────────────┬───────────────────┘
           │                      │
┌──────────▼──────────┐  ┌────────▼────────────────────┐
│      SUPABASE        │  │    BACKEND NestJS            │
│  PostgreSQL + RLS    │  │  /api/pagos │ /api/emails    │
│  Auth │ Storage      │  │  MercadoPago │ Stripe        │
└─────────────────────┘  └─────────────────────────────┘
```

### 2.3 Diagrama tercera etapa (polyglot persistence)

```
┌─────────────────────────────────────────────────────┐
│              CLIENTE (Next.js + TypeScript)          │
└──────────┬───────────────────────┬──────────────────┘
           │                       │
┌──────────▼──────────┐  ┌─────────▼──────────────────┐
│      SUPABASE        │  │    BACKEND NestJS + FastAPI  │
│  PostgreSQL + RLS    │  │  NestJS: API principal       │
│  Auth │ Storage      │  │  FastAPI: OCR, NLP, matching │
└─────────────────────┘  └──────────┬─────────────────┘
                                     │
                          ┌──────────▼──────────┐
                          │       NEO4J          │
                          │  Redes migratorias   │
                          │  Grafos familiares   │
                          └─────────────────────┘
```

### 2.4 Flujo de autenticación (Supabase Auth SDK)

```
Login:
  → supabase.auth.signInWithPassword({ email, password })
    → Supabase Auth valida credenciales
      → SDK guarda sesión en localStorage automáticamente
        → onAuthStateChange dispara con SIGNED_IN
          → App.jsx actualiza estado → navega a Orígenes

Al recargar la página (F5):
  → onAuthStateChange dispara con INITIAL_SESSION
    → Si hay sesión en localStorage: → estado "raices"
    → Si no: → estado "landing"

Logout:
  → supabase.auth.signOut()
    → SDK limpia localStorage
      → onAuthStateChange dispara con SIGNED_OUT
        → App.jsx → estado "landing"
```

### 2.5 Acceso a datos (RLS directo)

```
Frontend solicita datos con la anon key
  → Supabase verifica sesión JWT del usuario
    → Aplica políticas RLS (migración 002_rls_policies.sql)
      → Cada usuario ve y modifica solo sus propios datos
        → sitios_familiares: propietario_id = auth.uid()
        → personas_arbol: vía sitios_familiares propietario
        → actividad: vía sitios_familiares propietario
```

---

## 3. Estructura de archivos del proyecto

```
galicia-migrante/                    ← F:\galicia-migrante\
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js              ← login, registro, logout, verificarSesion
│   │   │   ├── raices.js            ← sitio familiar, personas, miembros, actividad
│   │   │   └── admin.js             ← usuarios, roles, planes, actividad global
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── BadgeTipo.jsx    ← badge de tipo de persona (compartido)
│   │   │   │   ├── BadgeRol.jsx     ← badge de rol de usuario (compartido)
│   │   │   │   └── MvpPlaceholder.jsx ← placeholder para secciones MVP (compartido)
│   │   │   └── layout/
│   │   │       ├── LoadingScreen.jsx
│   │   │       └── PortalHeader.jsx ← barra oscura superior del portal
│   │   ├── i18n/                    ← textos en es/gl/en (→ tabla traducciones en 2ª etapa)
│   │   ├── config/
│   │   │   └── tipos.js             ← enum de tipos de persona (= CHECK constraint de personas_arbol.tipo)
│   │   ├── lib/
│   │   │   └── supabase.js          ← cliente Supabase JS SDK (≠ database/)
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Landing/
│   │   │   ├── Admin/
│   │   │   │   └── index.jsx        ← panel de administración general
│   │   │   └── Origenes/
│   │   │       ├── index.jsx        ← contenedor del módulo — estado compartido + shell
│   │   │       ├── ArbolGenealogico/
│   │   │       │   ├── index.jsx
│   │   │       │   ├── constants.js ← TIPOS, NAV
│   │   │       │   ├── mockData.js  ← fallback cuando Supabase no responde
│   │   │       │   ├── NavBar.jsx   ← navegación de secciones del módulo
│   │   │       │   ├── ModalPersona.jsx
│   │   │       │   ├── PrimerUso.jsx
│   │   │       │   └── sections/
│   │   │       │       ├── MiArbol.jsx
│   │   │       │       ├── AdminArboles.jsx
│   │   │       │       └── ...otras secciones
│   │   │       └── TuLugarEnGalicia/ ← segunda etapa
│   │   ├── styles/
│   │   │   ├── variables.js         ← variables CSS centralizadas — respetar siempre
│   │   │   └── portal.js            ← estilos del portal completo
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vercel.json
│   ├── .env.local                   ← NO en git
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                         ← INACTIVO en MVP
│   ├── src/
│   │   ├── middleware/auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── raices.js            ← PERSONA_FIELDS debe mantenerse sincronizado
│   │   │   ├── portal.js
│   │   │   ├── planes.js
│   │   │   └── admin.js
│   │   └── app.js
│   ├── scripts/
│   │   ├── run-migration.js
│   │   └── configure-supabase-auth.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── database/
│   ├── schema.sql                   ← fuente de verdad — siempre sincronizar
│   └── migrations/
│       ├── 001_expand_personas_arbol.sql       ← ✅ aplicada
│       ├── 002_rls_policies.sql               ← ✅ aplicada
│       ├── 003_auto_create_usuario_trigger.sql ← ✅ aplicada
│       ├── 004_schema_expansion.sql           ← ✅ aplicada (14/05/2026) — commit de917b7
│       ├── 005_eventos_tipo_fallecimiento.sql  ← ✅ aplicada (17/05/2026) — commit 0a53c15
│       ├── 006_gedcom_tolerant_import.sql      ← ✅ aplicada (17/05/2026)
│       ├── 007_add_tipo_sin_raices.sql          ← ✅ aplicada (17/05/2026)
│       ├── 008_admin_rls.sql                   ← ✅ aplicada (19/05/2026)
│       └── 009_arbol_config.sql                ← ✅ aplicada (21/05/2026)
│
├── CLAUDE.md
├── PRD.md
├── README.md
└── SPEC.md
```

---

## 4. Base de datos — esquema completo

### 4.1 Tablas actuales (post migración 004 — 37 tablas, RLS habilitado)

```
usuarios              ← Extiende auth.users de Supabase
roles                 ← 8 roles del sistema
permisos              ← 16 permisos granulares
roles_permisos        ← Muchos a muchos: roles ↔ permisos
usuarios_roles        ← Muchos a muchos: usuarios ↔ roles
planes                ← Membresías con precios y límites como datos
planes_permisos       ← Permisos incluidos en cada plan
suscripciones         ← Historial de suscripciones
sitios_familiares     ← Sitio genealógico de cada familia
sitios_miembros       ← Miembros de cada sitio familiar
personas_arbol        ← Personas en el árbol genealógico
eventos_familiares    ← Cumpleaños, aniversarios, etc.
asociaciones          ← Centros gallegos registrados
asociaciones_directivos ← Comisión directiva
asociaciones_noticias ← Noticias de cada asociación
eventos               ← Agenda pública de la colectividad
modulos               ← Módulos del portal
traducciones          ← Textos de la interfaz
actividad             ← Log de acciones de usuarios
```

### 4.2 Migración 004 — schema expansion (✅ APLICADA 14/05/2026)

Esta migración crea el schema completo antes de que haya datos reales de usuarios. Incluye 18 tablas nuevas y modificaciones a 6 tablas existentes.

#### Tablas nuevas

**Relaciones genealógicas (reemplaza columnas fijas):**
```sql
CREATE TABLE relaciones_persona (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sitio_id     UUID REFERENCES sitios_familiares(id) ON DELETE CASCADE,
  persona_a    UUID REFERENCES personas_arbol(id) ON DELETE CASCADE,
  persona_b    UUID REFERENCES personas_arbol(id) ON DELETE CASCADE,
  tipo         TEXT NOT NULL CHECK (tipo IN (
                 'padre','madre','hijo','hija',
                 'conyugue','pareja','hermano','hermana',
                 'adoptivo','padrastro','madrastra'
               )),
  fecha_inicio TEXT,
  fecha_fin    TEXT,
  notas        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

**Sistema territorial global (catálogo sincronizable via API):**
```sql
CREATE TABLE paises (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  nombre_en      TEXT,
  codigo_iso2    TEXT UNIQUE,  -- AR, ES, UY...
  codigo_iso3    TEXT UNIQUE,
  codigo_externo TEXT,
  fuente         TEXT,
  ultima_sync    TIMESTAMPTZ,
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7)
);

CREATE TABLE divisiones_1 (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pais_id        UUID REFERENCES paises(id),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  nombre_en      TEXT,
  tipo           TEXT,  -- 'provincia', 'estado', 'comunidad_autonoma'
  codigo_iso     TEXT,
  codigo_externo TEXT,
  fuente         TEXT,  -- 'IGE', 'INDEC', 'GeoNames'
  ultima_sync    TIMESTAMPTZ,
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7)
);

CREATE TABLE divisiones_2 (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  division_1_id  UUID REFERENCES divisiones_1(id),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  nombre_en      TEXT,
  tipo           TEXT,  -- 'comarca', 'departamento'
  codigo_externo TEXT,
  fuente         TEXT,
  ultima_sync    TIMESTAMPTZ,
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7)
);

CREATE TABLE municipios (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  division_1_id  UUID REFERENCES divisiones_1(id),
  division_2_id  UUID REFERENCES divisiones_2(id),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  nombre_en      TEXT,
  tipo           TEXT,  -- 'ayuntamiento', 'municipio', 'ciudad'
  codigo_externo TEXT,
  fuente         TEXT,
  ultima_sync    TIMESTAMPTZ,
  activo         BOOLEAN DEFAULT TRUE,
  fusionado_en   UUID REFERENCES municipios(id),  -- apunta al nuevo si fue fusionado
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7)
);

CREATE TABLE diocesis (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  pais_id        UUID REFERENCES paises(id),
  sede           TEXT,
  codigo_externo TEXT,
  fuente         TEXT,
  ultima_sync    TIMESTAMPTZ
);

CREATE TABLE parroquias (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  municipio_id   UUID REFERENCES municipios(id),
  diocesis_id    UUID REFERENCES diocesis(id),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  tipo           TEXT DEFAULT 'civil',  -- 'civil', 'eclesiastica'
  codigo_externo TEXT,
  fuente         TEXT DEFAULT 'IGE',
  ultima_sync    TIMESTAMPTZ,
  activo         BOOLEAN DEFAULT TRUE,
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7)
);

CREATE TABLE localidades (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  municipio_id   UUID REFERENCES municipios(id),
  parroquia_id   UUID REFERENCES parroquias(id),
  nombre_es      TEXT NOT NULL,
  nombre_gl      TEXT,
  tipo           TEXT,  -- 'aldea', 'barrio', 'lugar', 'entidad'
  codigo_externo TEXT,
  fuente         TEXT,
  ultima_sync    TIMESTAMPTZ,
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7)
);

CREATE TABLE codigos_postales (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo         TEXT NOT NULL,
  pais_id        UUID REFERENCES paises(id),
  municipio_id   UUID REFERENCES municipios(id),
  parroquia_id   UUID REFERENCES parroquias(id),
  localidad_id   UUID REFERENCES localidades(id),
  codigo_externo TEXT,
  fuente         TEXT,
  ultima_sync    TIMESTAMPTZ,
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7),
  UNIQUE (codigo, pais_id)
);

CREATE TABLE direcciones (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entidad_tipo   TEXT NOT NULL,  -- 'persona', 'asociacion', 'puerto'
  entidad_id     UUID NOT NULL,
  pais_id        UUID REFERENCES paises(id),
  division_1_id  UUID REFERENCES divisiones_1(id),
  division_2_id  UUID REFERENCES divisiones_2(id),
  municipio_id   UUID REFERENCES municipios(id),
  parroquia_id   UUID REFERENCES parroquias(id),
  localidad_id   UUID REFERENCES localidades(id),
  cp_id          UUID REFERENCES codigos_postales(id),
  nombre_casa    TEXT,   -- rural gallego
  numero_casa    TEXT,   -- rural gallego
  calle          TEXT,   -- urbano
  numero         TEXT,
  piso           TEXT,
  departamento   TEXT,
  direccion_libre TEXT,  -- fallback para lugares no catalogados
  tipo           TEXT DEFAULT 'actual',  -- 'actual', 'origen', 'historica'
  desde          TEXT,
  hasta          TEXT,
  principal      BOOLEAN DEFAULT TRUE,
  notas          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_direcciones_entidad ON direcciones(entidad_tipo, entidad_id);
CREATE INDEX IF NOT EXISTS idx_direcciones_parroquia ON direcciones(parroquia_id);
```

**Redes migratorias:**
```sql
CREATE TABLE puertos (
  id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre  TEXT NOT NULL,
  ciudad  TEXT,
  pais_id UUID REFERENCES paises(id),
  lat     DECIMAL(10,7),
  lng     DECIMAL(10,7)
);

CREATE TABLE barcos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      TEXT NOT NULL,
  compania    TEXT,
  bandera     TEXT,
  anio_inicio INTEGER,
  anio_fin    INTEGER,
  notas       TEXT
);

CREATE TABLE eventos_migratorios (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona_id     UUID REFERENCES personas_arbol(id) ON DELETE CASCADE,
  barco_id       UUID REFERENCES barcos(id),
  puerto_origen  UUID REFERENCES puertos(id),
  puerto_destino UUID REFERENCES puertos(id),
  fecha          TEXT,
  clase          TEXT,  -- 'primera', 'segunda', 'tercera', 'cubierta'
  documentos     JSONB DEFAULT '[]',
  notas          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
```

**Documentos históricos:**
```sql
CREATE TABLE documentos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sitio_id    UUID REFERENCES sitios_familiares(id) ON DELETE CASCADE,
  persona_id  UUID REFERENCES personas_arbol(id) ON DELETE SET NULL,
  tipo        TEXT CHECK (tipo IN (
                'acta_nacimiento','acta_matrimonio','acta_defuncion',
                'bautismo','partida','censo','padron',
                'pasaporte','visa','carta','fotografia',
                'testamento','otro'
              )),
  titulo      TEXT,
  descripcion TEXT,
  url_archivo TEXT,
  fecha_aprox TEXT,
  lugar_aprox TEXT,
  fuente      TEXT,
  verificado  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**Historia oral:**
```sql
CREATE TABLE testimonios (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona_id   UUID REFERENCES personas_arbol(id) ON DELETE SET NULL,
  sitio_id     UUID REFERENCES sitios_familiares(id) ON DELETE CASCADE,
  tipo         TEXT CHECK (tipo IN ('audio','video','texto','foto')),
  titulo       TEXT,
  descripcion  TEXT,
  url_media    TEXT,
  duracion_seg INTEGER,
  fecha_aprox  TEXT,
  lugar_aprox  TEXT,
  idioma       TEXT DEFAULT 'es',
  publicado    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

**Storage centralizado:**
```sql
CREATE TABLE archivos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sitio_id      UUID REFERENCES sitios_familiares(id) ON DELETE CASCADE,
  persona_id    UUID REFERENCES personas_arbol(id) ON DELETE SET NULL,
  subido_por    UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  tipo          TEXT CHECK (tipo IN ('foto','documento','audio','video')),
  nombre        TEXT NOT NULL,
  descripcion   TEXT,
  url           TEXT NOT NULL,
  storage_bytes INTEGER,
  duracion_seg  INTEGER,
  mime_type     TEXT,
  publico       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

**Auditoría genealógica:**
```sql
CREATE TABLE personas_arbol_historial (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona_id    UUID REFERENCES personas_arbol(id) ON DELETE CASCADE,
  usuario_id    UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  datos_antes   JSONB NOT NULL,
  datos_despues JSONB NOT NULL,
  motivo        TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historial_persona_id
  ON personas_arbol_historial(persona_id);
CREATE INDEX IF NOT EXISTS idx_historial_created_at
  ON personas_arbol_historial(created_at DESC);
```

**Log de auditoría admin (inmutable — sin UPDATE ni DELETE):**
```sql
CREATE TABLE admin_audit_log (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id    UUID REFERENCES usuarios(id),
  accion        TEXT NOT NULL,
  entidad_tipo  TEXT,
  entidad_id    UUID,
  datos_antes   JSONB,
  datos_despues JSONB,
  ip            TEXT,
  dispositivo   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### Modificaciones a tablas existentes

```sql
-- personas_arbol: eliminar columnas de relaciones fijas
ALTER TABLE personas_arbol
  DROP COLUMN IF EXISTS padre_id,
  DROP COLUMN IF EXISTS madre_id,
  DROP COLUMN IF EXISTS conyugue_id;

-- personas_arbol: agregar referencias territoriales y campo vivo
ALTER TABLE personas_arbol
  ADD COLUMN IF NOT EXISTS parroquia_origen_id UUID REFERENCES parroquias(id),
  ADD COLUMN IF NOT EXISTS localidad_origen_id UUID REFERENCES localidades(id),
  ADD COLUMN IF NOT EXISTS vivo BOOLEAN DEFAULT TRUE;
  -- lugar_nac y lugar_fall se mantienen como fallback histórico

-- actividad: nuevos tipos de eventos para métricas
-- (modificar el CHECK constraint)

-- usuarios: consentimiento legal y sucesión admin
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS acepto_terminos       BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS acepto_terminos_fecha  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS acepto_privacidad      BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS acepto_privacidad_fecha TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS es_admin_emergencia    BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS admin_respaldo_de      UUID REFERENCES usuarios(id),
  ADD COLUMN IF NOT EXISTS contacto_emergencia_email TEXT,
  ADD COLUMN IF NOT EXISTS contacto_emergencia_nombre TEXT;

-- planes: límites de storage
ALTER TABLE planes
  ADD COLUMN IF NOT EXISTS limite_documentos  INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS limite_storage_mb  INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS limite_audio_mb    INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS limite_video_min   INTEGER DEFAULT 0;
```

### 4.3 Tipos de personas en el árbol

| Tipo | Color | Descripción |
|---|---|---|
| `galicia` | 🔵 Azul `#4A90B8` | Nacido en Galicia, nunca emigró |
| `emigrante` | 🟡 Dorado `#C8A96E` | Nacido en Galicia, emigró |
| `diaspora` | 🟢 Verde `#5BAF7A` | Nacido fuera de Galicia, descendiente de gallegos |
| `retornado` | 🟣 Púrpura `#8C5CBF` | Nacido fuera de Galicia, retornó a Galicia |
| `sin_raices` | ◻️ Blanco/borde gris `#E0E0E0` | Sin ascendencia gallega conocida — parte del árbol familiar pero excluido de estadísticas de la diáspora |

**Nota:** el tipo `sin_raices` aplica a personas que forman parte del árbol familiar pero no tienen raíces gallegas — cónyuges, familiares políticos, adoptivos de otra cultura, etc. Se muestran en el árbol pero no se contabilizan en las estadísticas de la diáspora gallega.

### 4.4 APIs territoriales — fuentes de sincronización

| Territorio | Fuente | Tipo |
|---|---|---|
| Galicia — parroquias, concellos, comarcas | IGE (Instituto Galego de Estatística) | Dataset descargable + API |
| Galicia — coordenadas, límites, CP | IGN España | API |
| Argentina — provincias, municipios, localidades | API Georef Argentina (oficial, gratuita) | API REST |
| Argentina — demografía | INDEC | Dataset |
| Mundo | GeoNames | API (gratuita con registro) |
| Mundo alternativo | OpenStreetMap / Nominatim | API open source |

Todas las tablas territoriales incluyen `codigo_externo`, `fuente` y `ultima_sync`.
Cuando un concello se fusiona: `activo = FALSE`, `fusionado_en` apunta al nuevo. Las referencias históricas de personas quedan intactas.

### 4.5 Configuración de Supabase Auth

- **Confirm email:** desactivado temporalmente (reactivar al configurar SMTP)
- **Allow new users to sign up:** activado
- **Site URL:** `https://galicia-migrante.vercel.app`
- **Redirect URLs:** `https://galicia-migrante.vercel.app`, `http://localhost:5173`
- **Región:** South America (São Paulo)

### 4.6 Migraciones ejecutadas y pendientes

| Archivo | Descripción | Estado |
|---|---|---|
| `001_expand_personas_arbol.sql` | 30+ columnas en personas_arbol + tabla actividad | ✅ Aplicada |
| `002_rls_policies.sql` | Políticas RLS para acceso directo desde el frontend | ✅ Aplicada |
| `003_auto_create_usuario_trigger.sql` | Trigger auth.users → public.usuarios + backfill | ✅ Aplicada |
| `004_schema_expansion.sql` | 18 tablas nuevas + modificaciones (ver sección 4.2) | ✅ Aplicada 14/05/2026 |
| `005_eventos_tipo_fallecimiento.sql` | Agrega `fallecimiento_aniv` al CHECK constraint de `eventos_familiares.tipo` | ✅ Aplicada 17/05/2026 ⚠️ archivo ausente del repo — recrear |
| `006_gedcom_tolerant_import.sql` | Agrega `gedcom_raw TEXT` y `gedcom_warnings JSONB DEFAULT '[]'` a `personas_arbol` | ✅ Aplicada 17/05/2026 |
| `007_add_tipo_sin_raices.sql` | Agrega `sin_raices` al CHECK constraint de `personas_arbol.tipo` | ✅ Aplicada 17/05/2026 |
| `008_admin_rls.sql` | Roles, RLS para tablas admin, función `es_admin_general()` | ✅ Aplicada 19/05/2026 |

---

## 5. Sistema de roles y permisos (RBAC)

### 5.1 Roles

| Rol | `es_admin` | Descripción | Seguridad |
|---|---|---|---|
| `admin_general` | ✅ | Administrador total del portal | YubiKey + sesión 2hs |
| `admin_contenido` | — | Gestiona agenda, noticias y contenido | 2FA TOTP + sesión 4hs |
| `admin_asociaciones` | — | Gestiona registro y aprobación de asociaciones | 2FA TOTP + sesión 4hs |
| `admin_soporte` | — | Soporte técnico de usuarios | 2FA TOTP + sesión 4hs |
| `asociado_raices` | — | Acceso al módulo de genealogía | Estándar |
| `asociado_basico` | — | Acceso al portal general | Estándar |
| `asociacion` | — | Admin del micrositio de una asociación | 2FA TOTP + sesión 4hs |
| `visor` | — | Solo lectura — asignado al registrarse | Estándar |

### 5.2 Permisos (16 permisos)

| Módulo | Código | Descripción |
|---|---|---|
| `portal` | `ver_agenda` | Ver eventos de la colectividad |
| `portal` | `crear_evento` | Crear y editar eventos |
| `portal` | `ver_directorio` | Ver directorio de asociaciones |
| `portal` | `ver_tramites` | Ver sección de trámites Xunta / España |
| `raices` | `ver_raices` | Acceder al módulo árbol genealógico |
| `raices` | `crear_personas` | Agregar personas al árbol |
| `raices` | `editar_personas` | Editar datos de personas existentes |
| `raices` | `eliminar_personas` | Eliminar personas del árbol |
| `raices` | `importar_gedcom` | Importar árbol desde archivo GEDCOM |
| `raices` | `exportar_gedcom` | Exportar árbol a formato GEDCOM |
| `raices` | `gestionar_miembros` | Invitar / gestionar miembros del sitio familiar |
| `asociaciones` | `gestionar_microsite` | Crear y editar contenido del micrositio propio |
| `admin` | `admin_usuarios` | Gestionar cuentas de usuario |
| `admin` | `admin_planes` | Gestionar planes y precios |
| `admin` | `admin_roles` | Asignar roles a usuarios |
| `admin` | `admin_total` | Acceso completo sin restricciones |

### 5.3 Estructura de administración y sucesión

```
Admin general primario    ← operación diaria (YubiKey + 2hs sesión)
Admin general secundario  ← respaldo activo, acceso completo idéntico
Admin general emergencia  ← credenciales físicas en sobre cerrado,
                            activar solo si los dos anteriores fallan
```

El sobre de emergencia contiene credenciales, URLs del panel, instrucciones paso a paso y contactos de todos los proveedores. Se guarda en caja de seguridad bancaria o con abogado de confianza. Revisión anual obligatoria.

**Regla de oro:** ningún servicio crítico (GitHub, Vercel, Supabase, dominio) registrado solo a nombre de una persona física — siempre con co-owner o a nombre de entidad.

### 5.4 Usuario principal del portal

| Campo | Valor |
|---|---|
| Email | `alberto.sanchez.p@hotmail.com` |
| UUID | `ee7ab6c3-384b-4db2-a756-c471467b388e` |
| Rol | `admin_general` ★ |

### 5.5 Cómo asignar roles

```sql
-- SQL directo en Supabase SQL Editor
INSERT INTO usuarios_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u, roles r
WHERE u.email = 'email@ejemplo.com'
  AND r.nombre = 'admin_general'
ON CONFLICT DO NOTHING;
```

O via script: `node backend/scripts/assign-admin-role.js` (requiere `SUPABASE_SERVICE_KEY`).

---

## 6. Multiidioma (i18n)

### 6.1 Idiomas soportados

| Código | Idioma | Estado |
|---|---|---|
| `es` | Español (Argentina) | ✅ Completo |
| `gl` | Galego | ✅ Completo |
| `en` | English | ✅ Completo |

### 6.2 Implementación actual

```javascript
const I18N = {
  es: { clave: "Valor en español", ... },
  gl: { clave: "Valor en galego",  ... },
  en: { clave: "Value in English", ... },
};
const t = I18N[idioma];
<h1>{t.clave}</h1>
```

### 6.3 Reglas

- Nunca hardcodear texto visible al usuario — siempre `t.clave`
- Todas las cadenas nuevas deben agregarse en los 3 idiomas simultáneamente
- Claves con patrón: `modulo_elemento` (ej: `nav_inicio`, `hero_title`)
- El idioma preferido se guarda en `usuarios.idioma`
- Migrar a `react-i18next` cuando supere 500 cadenas o se agregue un 4º idioma

### 6.4 Evolución planificada — segunda etapa

Los textos viven hoy como objetos JS estáticos en `frontend/src/i18n/`. La tabla `traducciones` ya existe en el schema (migración 004) con columnas `clave`, `es`, `gl`, `en`. En segunda etapa:

- Los textos se migran de archivos JS a la tabla `traducciones`
- El frontend los carga al iniciar en lugar de importar los archivos estáticos
- El panel admin incluye una sección para editar traducciones inline sin necesidad de deploy
- Se puede exportar/importar un CSV o JSON con todas las claves (para trabajo offline de traductores)
- Agregar un idioma nuevo no requiere tocar código

**Condición previa:** todos los textos visibles deben pasar por `I18N` sin excepción. La migración es un cambio en un único punto (`I18N[idioma]` carga desde Supabase en vez de un archivo) — los componentes no cambian.

---

## 7. Variables CSS globales

```css
:root {
  --primary:       #4A90B8;
  --primary-dark:  #2C6A8A;
  --primary-light: #A8CEDD;
  --primary-bg:    #EBF5FA;
  --accent:        #C8A96E;
  --accent-dark:   #9A7A40;
  --gray-100: #F0F2F4;
  --gray-200: #D6E4EC;
  --gray-400: #C0CDD6;
  --gray-600: #5A6870;
  --gray-800: #3D5260;
  --gray-900: #1E2D35;
  --white:    #FFFFFF;
  --success:  #4CAF82;
  --warning:  #E8A838;
  --danger:   #D95C5C;
  --galicia:      #4A90B8;  --galicia-bg:   #E3F1F8;
  --emigrante:    #C8A96E;  --emigrante-bg: #F7F0E0;
  --diaspora:     #5BAF7A;  --diaspora-bg:  #E3F4EA;
  --nav-top-bg:   #2C2C2C;
  --nav-top-text: #E0E0E0;
  --radius:    6px;
  --radius-lg: 12px;
  --radius-xl: 20px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.07);
  --shadow:    0 4px 20px rgba(0,0,0,0.10);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.13);
  --max-w:     1100px;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body:    'Lato', system-ui, sans-serif;
}
```

> **CRÍTICO:** Todo CSS nuevo debe respetar estas variables. No inventar valores de color, espaciado o tipografía fuera del sistema. En la migración a Next.js + TailwindCSS estas variables se trasladarán al sistema de tokens de Tailwind.

---

## 8. Convenciones de código

### 8.1 Nombrado

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes React | PascalCase | `NavBar`, `ModalPersona` |
| Funciones/hooks | camelCase | `useAuth`, `handleSubmit` |
| Variables CSS | `--kebab-case` | `--primary-dark` |
| Claves i18n | `modulo_elemento` | `nav_inicio`, `hero_title` |
| IDs en BD | snake_case | `usuario_id`, `created_at` |
| Endpoints API | kebab-case | `/api/auth/login` |

### 8.2 Reglas generales

- Nunca hardcodear texto visible al usuario — siempre `t.clave`
- Nunca hardcodear precios, límites o permisos en el frontend
- La sesión de Supabase Auth se gestiona automáticamente por el SDK — no manejar tokens manualmente
- Siempre manejar estados de carga y error en llamadas a la API
- Siempre agregar claves i18n en los 3 idiomas
- Siempre entregar archivos completos para reemplazar, nunca parches parciales
- Todo código nuevo debe estar limpio y fácilmente tipable para la futura migración a TypeScript
- No usar `credentials: "include"` hasta que se reactive el backend Node

### 8.3 Regla de sincronización del backend

Cada vez que se modifique el schema, actualizar también:
- `backend/src/routes/raices.js` — constante `PERSONA_FIELDS`
- `database/schema.sql` — fuente de verdad
- `backend/.env.example` — plantilla de variables de entorno

### 8.4 Seguridad en el código

- Nunca credenciales en el código
- Nunca datos sensibles en logs
- Sanitizar todos los inputs del usuario
- La anon key de Supabase es pública por diseño — la seguridad real está en las RLS

### 8.5 Manejo de errores — estándar del sistema

El sistema aplica un estándar obligatorio de manejo de errores en todo el código. El estándar completo está en **CLAUDE.md sección "Manejo de errores"** — es la fuente operativa que Claude Code consulta.

Resumen de los principios técnicos:

**Frontend — funciones de API:** toda función en `frontend/src/api/` retorna `{ data, error }`. Nunca lanza excepciones al componente. Siempre usa try/catch y loguea con formato `[módulo/función] mensaje { contexto }`.

**Frontend — componentes:** todo componente que carga datos remotos maneja tres estados explícitos: cargando, error, datos. Nunca muestra pantalla en blanco. Los mensajes de error al usuario nunca son técnicos — siempre usan claves i18n.

**Operaciones de escritura:** el botón se deshabilita mientras la operación está en curso. El usuario recibe feedback inmediato de éxito o error.

**Operaciones destructivas:** confirmación explícita obligatoria antes de ejecutar cualquier eliminación o modificación irreversible.

**Migraciones SQL:** siempre envueltas en `BEGIN`/`COMMIT`, con `IF NOT EXISTS`/`IF EXISTS` en todas las sentencias, y con bloque de verificación `DO $$ ... END $$` dentro de la transacción.

**Deuda técnica:** el código anterior al 14/05/2026 no aplica este estándar consistentemente. Se corrige incrementalmente — cada vez que se modifica un archivo existente, aplicar el estándar en las funciones tocadas.

---

## 9. Despliegue: GitHub + Vercel

### 9.1 Repositorio

- **URL:** https://github.com/BetoSP/galicia-migrante
- **Rama principal:** `main`
- **Deploy automático:** cada push a `main` dispara un deploy en Vercel

### 9.2 Variables de entorno

**Frontend** (`frontend/.env.local`):
```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://[PROYECTO].supabase.co
VITE_SUPABASE_ANON_KEY=[REDACTED — ver .env.local del proyecto legacy]
```

**Backend** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://[PROYECTO].supabase.co
SUPABASE_SERVICE_KEY=[REDACTED]
SUPABASE_DB_PASSWORD=[REDACTED]
SUPABASE_PAT=[REDACTED]
JWT_SECRET=[REDACTED]
JWT_EXPIRES_IN=1h
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
```

> **Encoding:** usar Python pipe al ingresar vars en Vercel para evitar BOM/CRLF. Ver lección aprendida en CLAUDE.md.

### 9.3 Configuración de Vercel

- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **URL producción:** https://galicia-migrante.vercel.app

### 9.4 Iniciar el proyecto localmente

```powershell
# MVP — solo frontend necesario
cd F:\galicia-migrante\frontend
npm run dev
# http://localhost:5173
```

---

## 10. Decisiones de arquitectura y razonamiento

### 10.1 ¿Por qué Supabase?
PostgreSQL robusto sin administrar servidor, Auth integrado, Storage integrado, tier gratuito generoso, panel visual.

### 10.2 ¿Por qué RBAC con permisos granulares?
El portal tiene múltiples tipos de usuarios con necesidades muy diferentes. RBAC permite agregar módulos sin tocar el código de autorización y cambiar permisos desde la base de datos.

### 10.3 ¿Por qué los precios y límites en base de datos?
Para que cualquier admin pueda actualizarlos sin necesidad de un deploy.

### 10.4 ¿Por qué los tres colores en el árbol genealógico?
- 🔵 **Azul:** la Galicia de origen
- 🟡 **Dorado:** los que cruzaron el océano
- 🟢 **Verde:** los nacidos en tierra nueva

### 10.5 ¿Por qué Supabase directo en MVP (sin backend Node)?
Elimina una capa completa de infraestructura. Las RLS garantizan el aislamiento de datos por usuario sin escribir middleware.

### 10.6 ¿Por qué React + Vite ahora y Next.js después?
Lo construido es casi todo páginas privadas (árbol, auth) donde el SEO no importa. Lo que viene (micrositios) es 100% público — primer módulo que justifica SSR/SSG. El momento natural para migrar es antes de construir los micrositios. Reescribir ahora es semanas de trabajo sin agregar funcionalidad.

### 10.7 ¿Por qué TypeScript y NestJS en la migración y no ahora?
El backend está inactivo y hay poco código frontend que refactorizar. El costo de TypeScript es marginal cuando ya se está reescribiendo el frontend en Next.js. Un solo movimiento conjunto es más eficiente que dos migraciones separadas.

### 10.8 ¿Por qué TailwindCSS en la migración?
Next.js lo incluye por defecto. Reescribir los estilos es parte inevitable de migrar los componentes. Costo adicional marginal.

### 10.9 ¿Por qué tabla `relaciones_persona` en lugar de columnas fijas?
Las columnas `padre_id`, `madre_id`, `conyugue_id` en `personas_arbol` impedían: segundas nupcias, padres adoptivos, padre biológico vs. registrado, múltiples cónyuges históricos. La tabla de relaciones permite casos reales y prepara los datos para exportación a Neo4j — cada fila es directamente una arista del grafo.

### 10.10 ¿Por qué sistema territorial como catálogo sincronizable?
El territorio gallego cambia — fusiones de concellos, cambios de límites. Con `codigo_externo`, `fuente` y `ultima_sync` el sistema puede actualizarse desde APIs oficiales (IGE, API Georef) sin romper referencias internas. Cuando un concello se fusiona, el registro antiguo se marca `activo = FALSE` y `fusionado_en` apunta al nuevo — las referencias históricas de personas quedan intactas.

### 10.11 ¿Por qué polyglot persistence (PostgreSQL + Neo4j)?
La genealogía familiar privada (árbol de cada usuario) es un árbol — PostgreSQL lo maneja perfectamente. Las redes migratorias compartidas (quién viajó con quién, en qué barco, desde qué puerto, cruces entre árboles de distintos usuarios) son un grafo real donde Neo4j gana. No es migración sino adición — Supabase sigue haciendo lo suyo.

### 10.12 ¿Por qué FamilySearch y no solo el repositorio propio?
FamilySearch ya tiene digitalizados prácticamente todos los libros sacramentales de Galicia desde el siglo XVI. Integrarlo en segunda etapa da acceso inmediato a ese acervo. El repositorio propio (tercera etapa) complementa con el diferencial específico de la diáspora gallega que FamilySearch no tiene.

### 10.13 ¿Por qué los micrositios dentro del portal?
Para retener tráfico, dar presencia web a asociaciones sin conocimientos técnicos, y generar propuesta de valor monetizable.

### 10.15 ¿Por qué la reconstrucción colaborativa es tercera etapa y no antes?
La reconstrucción colaborativa — usuarios que indexan y validan documentos históricos colectivamente, similar al programa de FamilySearch — requiere dos condiciones que no existen en el MVP: una masa crítica de usuarios comprometidos y un repositorio propio de registros históricos contra el cual indexar. Sin esas dos cosas, la colaboración no tiene objeto. El momento natural es junto con el repositorio propio en tercera etapa, cuando haya comunidad suficiente para sostener el esfuerzo colectivo.
Es la única página 100% pública que existe hoy. Una mejora con fotografía real de Galicia y el sistema cromático bien aplicado es posible dentro del stack actual sin esperar a Next.js. El árbol, el panel admin y los formularios esperan a la migración.

---

## 11. Credenciales y URLs del proyecto

| Recurso | Valor |
|---|---|
| Repositorio GitHub | https://github.com/BetoSP/galicia-migrante-legacy |
| Sitio público (Vercel — LEGACY) | https://galicia-migrante.vercel.app |
| Panel Vercel | [REDACTED] |
| Supabase URL | [REDACTED — proyecto legacy] |
| Supabase Publishable key | [REDACTED] |
| Supabase Secret key | [REDACTED] |
| Supabase DB Password | [REDACTED] |
| Proyecto local | F:\galicia-migrante\ (legacy) |

**ADVERTENCIA:** Este documento contiene credenciales reales. No compartir públicamente ni subir a GitHub.

---

## 12. Estado del proyecto y próximos pasos

### 12.1 Estado al 19/05/2026

```
✅ Base de datos — 37 tablas en Supabase con RLS y seed data
✅ Migraciones aplicadas:
     ✅ 001_expand_personas_arbol.sql
     ✅ 002_rls_policies.sql
     ✅ 003_auto_create_usuario_trigger.sql
✅ Arquitectura MVP: frontend → Supabase directo
✅ Auth completo (login, registro, logout, reset, persistencia)
✅ Árbol genealógico visual con SVG, nodos interactivos, modal 10 pestañas
✅ CRUD completo de personas vía Supabase
✅ Backend Node.js — inactivo, disponible en repo
✅ GitHub + Vercel con deploy automático desde main

✅ Migración 004 — schema expansion aplicada (14/05/2026) — 37 tablas totales, commit de917b7
⏳ Agregar padre/madre al menú contextual del árbol
✅ EventosFamiliares — completado 17/05/2026 — commit 0a53c15
✅ MiembrosSitio — completado 17/05/2026 — commit 4179ffd
✅ EstadisticasFamiliares — completado 17/05/2026 — commit 4179ffd
✅ Importación/exportación multi-formato — completado 17/05/2026 — commit f79be95
✅ Reorganizar menú de la landing — completado 19/05/2026 — commit f87dd28
✅ Panel de administración general — completado 19/05/2026 — commit dadbf87 — migración 008
✅ Reorganización de carpetas frontend — sesión 8 — components/common/, PortalHeader, Admin/, ArbolGenealogico/ assets, styles/portal.js
⏳ Asistente genealógico con IA (evaluar para MVP avanzado)

🔜 Segunda etapa (migración conjunta Next.js + TypeScript + NestJS + TailwindCSS):
     Micrositios de asociaciones
     Tu lugar en Galicia + Wikipedia API
     FamilySearch OAuth + GEDCOM X
     Backend NestJS para pagos y emails
     Pagos: MercadoPago + QR BCRA + CBU + Stripe + PayPal + SEPA
     Historia oral (audio/video)
     Fotos con IA + OCR documentos históricos
     Matching semántico entre árboles
     Generación de contenido para redes sociales
     Seed data territorial (IGE + API Georef Argentina)
     Gamificación cultural
     Google OAuth + 2FA/TOTP

🔜 Tercera etapa:
     App móvil React Native (con biometría)
     Repositorio propio de registros históricos + API propia
     Neo4j para redes migratorias
     Mapas migratorios familiares
     Comunidades de parroquias y apellidos
     Reconstrucción colaborativa
     Agente de investigación autónomo
     Python + FastAPI para NLP gallego

🔜 Cuarta etapa:
     API de contenido territorial propio
     Integración institucional completa (Xunta API, España API)
     Biblioteca digital
```

### 12.2 Próximos pasos en orden de prioridad

1. ~~**Ejecutar migración 004**~~ ✅ completada 14/05/2026 — commit de917b7 — 37 tablas
2. **Auditoría de manejo de errores** — aplicar estándar de CLAUDE.md a `raices.js`, `auth.js` y componentes existentes
3. **Auditoría de estado real del proyecto** — ejecutar `PROMPT_AUDITORIA_ESTADO.md` antes de continuar con tareas nuevas. Ver regla de auditoría periódica en CLAUDE.md
3. ~~**Actualizar árbol visual**~~ ✅ completado 17/05/2026 — commits 990c720, ec7a9f6, b833c46
4. Agregar padre/madre al menú contextual del árbol
5. ~~EventosFamiliares~~ ✅ completado 17/05/2026 — commit 0a53c15
6. ~~MiembrosSitio~~ ✅ completado 17/05/2026 — commit 4179ffd
7. Estadísticas — implementar con gráficos reales
8. ~~Importación/exportación multi-formato~~ ✅ completado 17/05/2026 — commit f79be95
9. Reorganizar menú de la landing
10. Panel de administración general (usuarios, roles, planes, métricas)
11. **Segunda etapa:** migración conjunta del stack + micrositios

### 12.3 Acciones externas pendientes (equipo)

- Registrarse como desarrollador en FamilySearch ⚠️ urgente — aprobación toma semanas
- Agregar co-owner a GitHub, Vercel y Supabase
- Contratar asesoría legal antes del lanzamiento público
- Registrar base de datos ante la AAIP (Argentina)
- Designar admin general secundario
- Preparar sobre de emergencia con credenciales físicas
- Registrar dominio y servicios a nombre de entidad, no persona física
- Adquirir YubiKey para admin general (segunda etapa)

---

## 13. Apéndice: Archivos generados por sesión

### Sesión 10/05/2026
| Archivo | Estado |
|---|---|
| `frontend/src/pages/Landing/index.jsx` | ✅ |
| `frontend/src/pages/Auth/index.jsx` | ✅ |
| `database/schema.sql` | ✅ |

### Sesión 11/05/2026
| Archivo | Estado |
|---|---|
| `backend/src/app.js` | ✅ |
| `frontend/src/pages/Origenes/` | ✅ Refactorizado |
| `frontend/src/styles/variables.js` | ✅ |

### Sesión 12/05/2026
| Archivo | Estado |
|---|---|
| `MiArbol.jsx` — prop `onSavePersona` | ✅ |
| `AdminArboles.jsx` — props delegados a API | ✅ |

### Sesión 13/05/2026
| Archivo | Estado |
|---|---|
| `frontend/src/lib/supabase.js` | ✅ |
| `frontend/src/api/auth.js` | ✅ Reescritura Supabase Auth SDK |
| `frontend/src/api/raices.js` | ✅ Reescritura queries directas |
| `frontend/src/App.jsx` | ✅ onAuthStateChange |
| `database/migrations/001-003` | ✅ Aplicadas |
| `PRD.md` | ✅ v1.1 |
| `SPEC.md` | ✅ v1.6 |
| `CLAUDE.md` | ✅ |

### Sesión 14/05/2026 — Análisis de arquitectura y decisiones estratégicas
| Documento | Estado |
|---|---|
| `SESION_ANALISIS_14052026.md` | ✅ Registro completo de la sesión |
| `PRD.md` | ✅ v2.0 — reencuadre conceptual completo |
| `SPEC.md` | ✅ v2.0 — stack de segunda etapa, migración 004, decisiones de arquitectura |
| `CLAUDE.md` | ✅ v2.0 |
| `database/migrations/004_schema_expansion.sql` | ✅ Aplicada 14/05/2026 — commit de917b7 |

---

*Documento actualizado el 14 de mayo de 2026. Versión 2.0*
*Cambios v2.0: stack de segunda etapa (Next.js, TypeScript, NestJS, TailwindCSS), migración 004 completa, sistema territorial sincronizable, redes migratorias, documentos, testimonios, auditoría, seguridad por rol, sucesión admin, storage por plan, roadmap extendido a 4 etapas, decisiones de arquitectura 10.6-10.14.*

### Sesión 14/05/2026 — Migración 004 ejecutada

| Archivo | Descripción | Estado |
|---|---|---|
| `database/migrations/004_schema_expansion.sql` | 18 tablas nuevas + modificaciones a 6 tablas existentes | ✅ Aplicada — commit de917b7 |
| `database/backups/backup_pre_004_2026-05-14T14-50-44.json` | Backup previo en JSON via API Supabase (ver lección aprendida #5 en CLAUDE.md) | ✅ |
| `database/schema.sql` | Reescrito completo — 37 tablas en orden de dependencias | ✅ |
| `backend/src/routes/raices.js` | PERSONA_FIELDS sin columnas eliminadas, con nuevas columnas | ✅ |
| `ModalPersona.jsx` | TODOs marcados líneas 206-207, 241-244, 443-444, 459 | ⏳ Próxima tarea |
| `MiArbol.jsx` | TODOs marcados líneas 78-79, 86, 97-102, 346-350, 454-456 | ⏳ Próxima tarea |
| `EstadisticasFamiliares.jsx` | Creado en commit 990c720 — cuenta parejas desde relaciones_persona | ✅ |

### Sesión 14/05/2026 — Árbol visual migrado a relaciones_persona

| Archivo | Cambio | Estado |
|---|---|---|
| `frontend/src/api/raices.js` | `obtenerRelaciones` + `crearRelacion` con patrón `{data, error}` | ✅ |
| `frontend/src/pages/Origenes/index.jsx` | Carga relaciones en paralelo; `guardarPersona` retorna persona guardada; `guardarRelacion`; pasa nuevos props | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/index.jsx` | Acepta y distribuye `relaciones` y `onCrearRelacion` | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/MiArbol.jsx` | Layout reescrito con mapas de relaciones; NodeMenu con padre/madre; flujo pendingRels → guardar persona → crear relaciones; popup lee desde mapas | ✅ |
| `frontend/src/pages/Origenes/ModalPersona.jsx` | Tab Familia: aviso readonly + elimina selectores obsoletos + mantiene datos de casamiento | ✅ |
| `frontend/src/pages/Origenes/EstadisticasFamiliares.jsx` | Cuenta parejas desde relaciones, no desde columnas inexistentes — archivo creado | ✅ |

**Commit:** 990c720
**Pendientes resueltos:** #2 (árbol visual) y #4 (padre/madre en menú contextual) del CLAUDE.md
**Nota:** `EstadisticasFamiliares.jsx` fue creado en esta tarea — no existía previamente.

### Sesión 17/05/2026 — EventosFamiliares funcional

| Archivo | Cambio | Estado |
|---|---|---|
| `database/migrations/005_eventos_tipo_fallecimiento.sql` | Agrega `'fallecimiento_aniv'` al CHECK constraint de `eventos_familiares.tipo` | ✅ |
| `frontend/src/api/raices.js` | `obtenerEventosFamiliares`, `crearEventoFamiliar`, `eliminarEventoFamiliar` | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/index.jsx` | Pasa `personas` y `sitio` a `EventosFamiliares` | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/EventosFamiliares.jsx` | Reescritura completa — auto-eventos + manuales, vista mes/año, modal agregar, confirmación eliminar | ✅ |

**Commit:** 0a53c15
**Decisiones tomadas:** tipo `'fallecimiento_aniv'` agregado via migración 005 (Opción B). Aniversarios de matrimonio no implementados como auto-eventos — `mat_fecha` es texto libre sin día/mes. Notificaciones marcadas como punto de extensión futuro para segunda etapa.

### Sesión 17/05/2026 — Importación y exportación multi-formato

| Archivo | Cambio | Estado |
|---|---|---|
| `frontend/src/api/raices.js` | `importarPersonasBatch` — inserción batch con mapa gedcom_id → UUID | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/index.jsx` | Pasa `personas`, `relaciones`, `sitio`, `onSavePersona`, `onCrearRelacion`, `onImportCompleto` a GedcomSection | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/GedcomSection.jsx` | Reescritura completa | ✅ |

**Commit:** f79be95

**Formatos implementados:**
- Importación: GEDCOM 5.5/5.5.1/5.5.5 (archivo + textarea paste), CSV, Excel, JSON
- Exportación: GEDCOM 5.5.1, CSV, Excel, JSON
- GEDCOM X: diferido — spec complejo, adopción mínima, sin librería browser madura

**Características:**
- Barra de progreso en 4 fases: parse (indeterminada) → personas (contada) → relaciones (contada) → finalizado
- Preview antes de insertar: contadores + warnings + duplicados expandibles
- Mapper manual para CSV/Excel con columnas no reconocibles
- Detección de duplicados: nombre + apellido + año de nacimiento vs. personas existentes
- `onImportCompleto` hace append en estado sin reload — árbol actualizado inmediatamente
- Todo el procesamiento ocurre en el browser, sin enviar archivos al servidor

**Pendiente como próxima tarea:**
- Plantilla descargable Excel/CSV con columnas correctas pre-nombradas
- Vista previa del mapeo de columnas con reasignación manual antes de procesar

### Sesión 17/05/2026 — Mejoras importación CSV/Excel

| Archivo | Cambio | Estado |
|---|---|---|
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/GedcomSection.jsx` | Plantilla descargable + mapper siempre visible para CSV/Excel | ✅ |

**Commit:** 186cc3b

**Cambios:**
- Plantilla descargable: botones "Plantilla CSV vacía" / "Plantilla Excel vacía" con 13 headers correctos, visibles solo cuando el formato activo es CSV o Excel
- Mapper invariable para CSV/Excel: flujo archivo → mapper → preview → importar
- Mapper muestra todas las columnas con dropdown pre-cargado y badges: `✓ detectado` (verde), `✎` editado (azul), `sin asignar` (gris)

### Sesión 17/05/2026 — Importador GEDCOM tolerante a errores

| Archivo | Cambio | Estado |
|---|---|---|
| `database/migrations/006_gedcom_tolerant_import.sql` | `gedcom_raw TEXT`, `gedcom_warnings JSONB DEFAULT '[]'` en `personas_arbol` | ✅ Aplicada 17/05/2026 |
| `database/schema.sql` | Columnas `gedcom_raw` y `gedcom_warnings` agregadas a `personas_arbol` | ✅ |
| `frontend/src/api/raices.js` | `catalogarArchivo()` — cataloga refs multimedia GEDCOM a tabla `archivos` | ✅ |
| `backend/src/routes/raices.js` | `gedcom_raw`, `gedcom_warnings` agregados a `PERSONA_FIELDS` | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/GedcomSection.jsx` | Reescritura completa — pipeline 6 capas, categorías válidos/revisión/corruptos | ✅ |

**Commit:** 94860f4 (GedcomSection.jsx, raices.js, schema.sql, migración 006) + 2fa6a9c (migración 006 aplicada en Supabase)

**Pipeline implementado:**
1. **Preprocesamiento** — elimina BOM, normaliza CRLF/CR a LF
2. **Parser** — `parse-gedcom` (named export `parse`), captura excepción de parse a nivel archivo
3. **Extracción tolerante** — cada registro INDI en try/catch individual; errores de campo no abortan el registro
4. **Autocorrección** — HTML en notas (MyHeritage) stripteado silenciosamente; tags propietarios `_*` ignorados
5. **Clasificación** — validaciones producen errores `severidad: "alto"|"bajo"`. Sin errores alto → válido; con errores alto → revisión; excepción de registro → corrupto
6. **Importación incremental** — 5 fases con barra de progreso real

**Tres categorías de registros:**
- **Válidos** (`estado` normal) — importados automáticamente sin `gedcom_raw/warnings`
- **En revisión** (`estado='borrador'`) — tienen errores recuperables; `gedcom_warnings` almacena detalle; editables desde "Administrar árboles"
- **Corruptos** (`estado='cuarentena'`) — texto GEDCOM original en `gedcom_raw`; `nombre='[gedcom_id]'`; `tipo='diaspora'` (requerido NOT NULL)

**Multimedia:**
- Detectado en tags OBJE/FILE dentro de INDI y en registros OBJE top-level
- Clasificado en: `remota` (URL http/https), `local` (ruta de archivo), `propietaria` (refs con `:` o `%`)
- `remota` y `local` → catalogadas en tabla `archivos` via `catalogarArchivo()`
- `propietaria` → solo mostrada en preview, no catalogada
- Clasificación de tipo por extensión: jpg/png/gif/webp → foto, mp3/wav → audio, mp4/avi → video, resto → documento

**Quirks de proveedores manejados:**
- MyHeritage: HTML en notas (`<br>`, `<p>`, `&amp;`, etc.) → `stripHtml()`
- MyHeritage: `_MHFAMILY`, `_MHUID`, `_MHREL` → ignorados silenciosamente
- Ancestry: `_APID` → ignorado silenciosamente
- FTM: `_FREL`, `_MREL` → ignorados (relaciones ya se leen de FAM records)
- GEDCOM X: diferido — sin librería browser madura, adopción mínima
- Fechas futuras: detectadas como error `severidad: "alto"` → registro va a revisión

**Compatibilidad backward:**
- CSV/Excel/JSON preview normalizado a `{validas, revision:[], corruptas:[], multimedia:[], relaciones, warnings, autocorrecciones:[], duplicados}`
- `handleImportar` usa path tabular para `preview.tipo === 'tabular'`, path tolerante para `preview.tipo === 'gedcom'`
- Funcionalidades de exportación y plantillas descargables sin cambios

**Limitaciones diferidas:**
- OCR de documentos → tercera etapa (Python + FastAPI)
- GEDCOM X → diferido
- Descarga automática de multimedia referenciada → no permitida (CSP + privacidad)
- Deduplicación durante import → solo detección, sin merge automático

### Sesión 17/05/2026 — Fix importador GEDCOM: HTML en notas MyHeritage

| Archivo | Cambio | Estado |
|---|---|---|
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/GedcomSection.jsx` | Preprocesador `limpiarHtmlEnNotes()` antes de `parse-gedcom` + fallback `parsearGedcomManual()` | ✅ |

**Commit:** 12f8a23

**Causa raíz:** MyHeritage embebe HTML literal en tags NOTE. Los caracteres `<` y `>` rompían `parse-gedcom` antes de que el pipeline pudiera limpiarlos.

**Solución — 3 cambios en el pipeline:**
1. `limpiarHtmlEnNotes()` — limpia HTML línea a línea del texto plano **antes** de pasarlo a `parse-gedcom`
2. `parsearGedcomManual()` — fallback activado si `parse-gedcom` lanza excepción incluso después de la limpieza; parser propio que ignora líneas malformadas sin abortar
3. `procesarIndividuoTolerante()` — `stripHtml()` sigue aplicándose para entidades HTML residuales

**Invariante:** ningún archivo GEDCOM puede rechazarse completamente sin intentar al menos el fallback manual.

### Sesión 17/05/2026 — MiembrosSitio + EstadisticasFamiliares

| Archivo | Cambio | Estado |
|---|---|---|
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/MiembrosSitio.jsx` | Reescritura completa — datos reales, tabs Todos/Activos/Pendientes, cambio de rol optimista, eliminación con confirmación inline, modal invitar MVP | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/EstadisticasFamiliares.jsx` | Correcciones schema: `nac_anio`, `biografia`; agrega `retornado`, `vivos`/`fallecidos`; estado vacío; i18n | ✅ |
| `frontend/src/api/raices.js` | `cambiarRolMiembro` + `eliminarMiembro` | ✅ |

**Commit:** 4179ffd

**Notas:**
- Invitación de miembros requiere backend activo — modal muestra explicación clara al usuario (segunda etapa)
- Rol `admin` bloqueado — no editable desde la UI

### Sesión 17/05/2026 — Fix bugs post-importación GEDCOM

| Archivo | Cambio | Estado |
|---|---|---|
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/GedcomSection.jsx` | `parsearNombreGedcom` fix `//` vacío + `NOMBRES_PLACEHOLDER` para detección de placeholders | ✅ |
| `frontend/src/api/raices.js` | `sanitizarPayload()` — consolida campos JSONB; `agregarPersona`/`editarPersona` con `{data,error}` | ✅ |
| `frontend/src/pages/Origenes/index.jsx` | `guardarPersona` propaga error correctamente, retorna `{saved, error}` | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/AdminArboles.jsx` | Manejo de error en guardar + `[Persona desconocida]` en tabla y popup | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/MiArbol.jsx` | `PersonNode` con placeholder en itálica/borde punteado cuando nombre vacío | ✅ |

**Commit:** caa9a52

**Bugs resueltos:**
1. `//` residual — regex fix en `parsearNombreGedcom`
2. Placeholders (Anónimo/Padre/Madre) — `NOMBRES_PLACEHOLDER` nullea nombre/apellido al importar
3. Cambios no persisten — `sanitizarPayload()` resuelve campos JSONB que Supabase rechazaba silenciosamente
4. Nodos vacíos — `PersonNode` detecta nombre vacío y muestra placeholder diferenciado

**Limitación conocida:** personas ya importadas con `//` en Supabase necesitan reimportarse para reflejar la corrección.

### Sesión 17/05/2026 — Fix árbol + sin_raices + modal familia + logos

| Archivo | Cambio | Estado |
|---|---|---|
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/MiArbol.jsx` | Líneas SVG con `style={}` en lugar de atributos de presentación; stem de parejas desde `ty+NH/2`; `padresMap` defensivo desde hijo/hija; tipo `sin_raices` en colores y leyenda | ✅ |
| `database/migrations/007_add_tipo_sin_raices.sql` | Agrega `sin_raices` al CHECK constraint de `personas_arbol.tipo` | ✅ Aplicada |
| `frontend/src/pages/Origenes/ModalPersona.jsx` | `tipo_relacion` 8 opciones; `mat_fecha` y `bautismo_fecha` con día/mes/año; sección "Datos de la ceremonia" con rito, testigos, padrino, madrina; `prefijo`/`sufijo` como selects | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/EstadisticasFamiliares.jsx` | Fila `sin_raices` en distribución | ✅ |
| `frontend/src/pages/Landing/components/Navbar.jsx` | Logo SVG compacto-claro | ✅ |
| `frontend/src/pages/Origenes/NavBar.jsx` | Logo compacto-oscuro en nav-top, compacto-claro en nav-main | ✅ |
| `frontend/src/pages/Auth/components/AuthLeft.jsx` | Logo compacto-claro height=60 | ✅ |
| `frontend/public/favicon.svg` | Ícono olas+cruz en fondo azul 32×32 | ✅ |

**Commit:** b833c46

**Notas:**
- `icons.svg` no modificado — es sprite de iconos sociales
- Los 4 SVGs del logo en `frontend/public/logos/`
- Migración 007 aplicada en Supabase

### Sesión 18/05/2026 — Correcciones post-auditoría

| Archivo | Cambio | Estado |
|---|---|---|
| `database/migrations/005_eventos_tipo_fallecimiento.sql` | Recreado y commiteado — faltaba en el repo | ✅ |
| `database/schema.sql` | Sincronizado: `sin_raices` en personas_arbol.tipo + `fallecimiento_aniv` en eventos_familiares.tipo | ✅ |
| `frontend/src/pages/Origenes/constants.js` | `sin_raices` agregado a TIPOS | ✅ |
| `frontend/src/styles.js` | `.badge-sin_raices` agregado | ✅ |
| `frontend/src/api/auth.js` | Reescritura completa — todas las funciones retornan `{data,error}` | ✅ |
| `frontend/src/pages/Auth/LoginForm.jsx` | Caller actualizado para nuevo patrón auth.js | ✅ |
| `frontend/src/pages/Auth/RegistroForm.jsx` | Caller actualizado | ✅ |
| `frontend/src/pages/Auth/ResetForm.jsx` | Caller actualizado | ✅ |
| `frontend/src/api/raices.js` | 6 funciones viejas migradas a `{data,error}`: obtenerSitio, crearSitio, obtenerPersonas, eliminarPersona, obtenerMiembros, obtenerActividad | ✅ |
| `frontend/src/pages/Origenes/index.jsx` | Caller actualizado | ✅ |
| `frontend/src/pages/Origenes/PrimerUso.jsx` | Caller actualizado | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/MiArbol.jsx` | Bug 6a: `laidOut` Set previene doble layout; Bug 6b: fallback a persona más conectada + ancestros del cónyuge; log diagnóstico en computeFragment | ✅ |

**Commit:** 947fb14

**Gaps resueltos de la auditoría:** [D], [E], [F], [G], [H]
**Pendiente:** aplicar migración 005 en Supabase (archivo ya existe en repo)

### Sesión 18/05/2026 — Mejoras visuales árbol v3

| Archivo | Cambio | Estado |
|---|---|---|
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/MiArbol.jsx` | 6 mejoras visuales — ver detalle abajo | ✅ |

**Commit:** 1a76bca

**Mejoras implementadas:**
1. Líneas de filiación: `cdrop` llega al centro del nodo hijo (`p1cx`), no al gap entre hijo y cónyuge
2. Cross-links: curvas SVG eliminadas; reemplazadas por badge `×2` rojo (top-left) + badge 🔗 azul (top-right) con tooltip y navegación al click
3. Tipo de pareja: línea azul sólida (activo) / gris punteada (ex/separado/divorciado) / gris fina (viudo) — leído desde `relaciones_persona.tipo`
4. Fallecidos: triángulo negro diagonal en esquina superior derecha via CSS border-trick — sin overlay ni opacidad
5. Cumpleaños: cálculo exacto de días, constante `DIAS_ALERTA_EVENTO = 30`, solo personas vivas
6. Slider de generaciones (1–5/Todas) en toolbar — filtra via `computeFragment`

### Sesión 18/05/2026 — Fix definitivo algoritmo árbol + edición de relaciones

| Archivo | Cambio | Estado |
|---|---|---|
| `frontend/src/pages/Origenes/ArbolGenealogico/sections/MiArbol.jsx` | Bug 1: `visitedAnc`/`visitedDesc` como `Map<pid→minGen>` en lugar de Set; Bug 2: single-ownership en `childCouples`; Bug 3: `crossPersonMap` unidireccional; Limpieza de logs de diagnóstico | ✅ |
| `frontend/src/api/raices.js` | `editarRelacion` y `eliminarRelacion` con patrón `{data,error}` | ✅ |
| `frontend/src/pages/Origenes/ModalPersona.jsx` | Pestaña Familia: lista de relaciones actuales con ✏️ editar tipo y 🗑️ eliminar con confirmación | ✅ |

**Commit:** 1ec34a1

**Bugs resueltos:**
1. Expansión prematura — `Map<pid→minGen>` permite re-explorar nodos por caminos más cortos
2. Cross-links espurios — single-ownership elimina doble reclamación de Antonio+Camila
3. Badge ×2 en nodo incorrecto — `crossPersonMap` unidireccional, badge solo en el "cruzado"
4. Edición/eliminación de relaciones desde pestaña Familia del modal

### Sesión 21/05/2026 — Tabla arbol_config (migración 009 pendiente)

**Principio:** nada configurable va hardcodeado en el código. Todo valor que pueda variar por usuario, por sitio o por política del portal vive en la base de datos.

**Tabla `arbol_config`:**
```sql
CREATE TABLE arbol_config (
  clave           text PRIMARY KEY,
  valor           text NOT NULL,
  tipo_valor      text CHECK (tipo_valor IN ('decimal', 'integer', 'boolean', 'text')),
  modificable_por text CHECK (modificable_por IN ('admin_general', 'admin_seccion', 'usuario')),
  descripcion_es  text,
  descripcion_gl  text,
  descripcion_en  text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);
```

**Valores por defecto (solo modificables por admin_general):**

| Clave | Valor default | Descripción |
|---|---|---|
| `costo_sangre_directa` | 1.0 | Costo BFS para ancestros/descendientes directos y hermanos |
| `costo_afinidad_directa` | 1.5 | Costo para cónyuge/pareja actual o ex del foco |
| `costo_sangre_colateral` | 2.0 | Costo para primos, cónyuges de primos, hijos de primos |
| `costo_afinidad_indirecta` | 2.5 | Suegros — solo visibles cuando el cónyuge es el foco |
| `generaciones_default` | 5 | Default del slider de generaciones (5 = todas) |
| `dias_alerta_evento` | 30 | Días de anticipación para alertas de cumpleaños/aniversarios |
| `rama_default` | 'ambas' | Rama visible por defecto: 'materna', 'paterna', 'ambas' |

**Jerarquía de permisos:**
- `admin_general` → puede modificar cualquier clave
- `admin_seccion` → puede modificar configuración de su sitio familiar
- `usuario` → puede modificar sus preferencias visuales propias

**Migración:** 009_arbol_config.sql — ✅ aplicada 21/05/2026 — 12 filas insertadas, RLS activo

**Archivos nuevos de esta sesión:**
- `frontend/src/pages/Origenes/ArbolGenealogico/ArbolToolbar.jsx` — barra de herramientas completa del árbol
- `frontend/src/pages/Origenes/ArbolGenealogico/ArbolConfigPanel.jsx` — panel de configuración ⚙
- `frontend/src/pages/Origenes/ArbolGenealogico/sections/genealogyLayout.js` — motor bipartito custom

**Selector de rama (nuevo — ArbolToolbar):**
- Opciones: Ambas ramas (default) / Solo materna / Solo paterna
- Lee y escribe `arbol_config.rama_default` según permisos del usuario
- Filtra el BFS para incluir solo la rama seleccionada

**Historial de motores:**
1. ~~Algoritmo SVG custom~~ → bugs estructurales irresolubles
2. ~~Cytoscape.js + dagre~~ → problema conocido con alineación de cónyuges, dagre semi-abandonado
3. ~~family-chart~~ → solo mostraba nodos alcanzables desde `main_id`, no todos los del árbol
4. **Motor bipartito custom (`genealogyLayout.js`)** → solución actual ✅

**Decisión final:** motor propio internalizado en el repo, sin dependencias externas. Usa diamantes ◆ como nodos de unión entre parejas — cada matrimonio/unión tiene su propio nodo de intersección.

**Arquitectura:**
```
genealogyLayout.js    → calcula posiciones (X,Y) y edges del grafo
React HTML            → renderiza PersonNode con foto, badges, botones
SVG overlay           → renderiza conectores, diamantes, líneas de filiación
```

**Filosofía del motor genealógico:**
Un árbol genealógico NO es un árbol clásico — es un DAG con ciclos potenciales (endogamia), múltiples matrimonios, adopciones, hubs familiares y relaciones cruzadas. El motor debe tolerar y representar correctamente todas estas situaciones sin limitaciones artificiales.

**Reglas visuales del motor (intocables sin aprobación):**
- Los hijos **siempre** cuelgan del diamante ◆ — nunca del nodo de ningún padre
- Pareja activa (casado/pareja/concubino/novios): conector lleno azul
- Ex pareja (separado/divorciado/ex): conector punteado gris — aplica al conector horizontal, línea al diamante Y línea a hijos
- Una sola pareja: formato estándar (izquierda — diamante — derecha)
- Múltiples parejas: persona en el centro, ex parejas a la izquierda (orden cronológico), pareja actual a la derecha
- Triángulo negro diagonal en esquina superior derecha → fallecido — intocable

**Preparado para futuro:**
- Web Workers — mover genealogyLayout a worker thread para no bloquear UI
- Virtualización — renderizar solo nodos visibles en el viewport con índice espacial (R-tree)
- Canvas/WebGL — renderer alternativo para árboles masivos (>500 nodos)

**Commits:** 0c71611, c33d157, c5d2051, 8a3ec26 (sesión 12) + fixes sesión actual

### Sesión 19/05/2026 — Reorganización de carpetas frontend

| Archivo / Carpeta | Cambio | Estado |
|---|---|---|
| `frontend/src/components/common/BadgeTipo.jsx` | Nuevo — movido de `Origenes/helpers.jsx` | ✅ |
| `frontend/src/components/common/BadgeRol.jsx` | Nuevo — movido de `Origenes/helpers.jsx` | ✅ |
| `frontend/src/components/common/MvpPlaceholder.jsx` | Nuevo — movido de `Origenes/helpers.jsx` | ✅ |
| `frontend/src/components/layout/PortalHeader.jsx` | Nuevo — split de NavBar (barra oscura superior del portal) | ✅ |
| `frontend/src/pages/Admin/index.jsx` | Nuevo — movido de `ArbolGenealogico/sections/AdminPanel.jsx` | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/NavBar.jsx` | Movido desde `Origenes/NavBar.jsx` | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/constants.js` | Movido desde `Origenes/constants.js` | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/mockData.js` | Movido desde `Origenes/mockData.js` | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/ModalPersona.jsx` | Movido desde `Origenes/ModalPersona.jsx` | ✅ |
| `frontend/src/pages/Origenes/ArbolGenealogico/PrimerUso.jsx` | Movido desde `Origenes/PrimerUso.jsx` | ✅ |
| `frontend/src/styles/portal.js` | Movido desde `Origenes/styles.js` | ✅ |
| `Origenes/helpers.jsx`, `constants.js`, `mockData.js`, `ModalPersona.jsx`, `PrimerUso.jsx`, `NavBar.jsx`, `styles.js` | Eliminados | ✅ |
| `ArbolGenealogico/sections/AdminPanel.jsx` | Eliminado (movido a `pages/Admin/`) | ✅ |

**Principios arquitectónicos documentados:**
- `components/common/` — compartido entre todos los módulos del portal
- `components/layout/` — shell del portal (PortalHeader + LoadingScreen)
- `pages/Admin/` — panel de administración a nivel portal
- `Origenes/index.jsx` — contenedor del módulo (no es una página): posee el estado compartido (personas, relaciones, sitio) y renderiza el shell (PortalHeader + NavBar) que envuelve todos los sub-módulos de Orígenes
- `styles/portal.js` + `styles/variables.js` — todos los estilos del portal en un lugar
