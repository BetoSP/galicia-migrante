# Galicia Migrante

Ecosistema digital integral para preservar, reconstruir y transmitir la cultura gallega entre las comunidades de la diáspora y sus descendientes.

El portal es la puerta de entrada. La genealogía es el servicio estrella del MVP — uno de los muchos servicios que el ecosistema ofrecerá.

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

## Arquitectura actual (MVP)

```
Frontend (React + Vite)
  └── @supabase/supabase-js
        └── Supabase (PostgreSQL + Auth + RLS + Storage)
              └── galicia-migrante.vercel.app
```

El frontend conecta directamente a Supabase. El backend Node.js está en el repositorio pero inactivo — se retomará en segunda etapa reescrito en NestJS + TypeScript para pagos y emails.

## Stack por etapa

| Etapa | Frontend | Backend | Base de datos |
|---|---|---|---|
| **MVP (ahora)** | React + Vite + JavaScript | Inactivo | Supabase (PostgreSQL) |
| **Segunda etapa** | Next.js + TypeScript + TailwindCSS | NestJS + TypeScript | Supabase (sin cambios) |
| **Tercera etapa** | Next.js | NestJS + FastAPI (Python) | Supabase + Neo4j |

## Estructura del proyecto

```
galicia-migrante/
├── frontend/          ← React + Vite (MVP — lo único que se ejecuta en local)
├── backend/           ← Node.js + Express (inactivo en MVP)
├── database/
│   ├── schema.sql     ← fuente de verdad — siempre sincronizar
│   └── migrations/
│       ├── 001_expand_personas_arbol.sql       ← ✅ aplicada
│       ├── 002_rls_policies.sql               ← ✅ aplicada
│       ├── 003_auto_create_usuario_trigger.sql ← ✅ aplicada
│       ├── 004_schema_expansion.sql           ← ✅ aplicada (14/05/2026)
│       ├── 005_eventos_tipo_fallecimiento.sql  ← ✅ aplicada (17/05/2026)
│       ├── 006_gedcom_tolerant_import.sql      ← ✅ aplicada (17/05/2026)
│       ├── 007_add_tipo_sin_raices.sql          ← ✅ aplicada (17/05/2026)
│       └── 008_admin_rls.sql                   ← ✅ aplicada (19/05/2026)
├── PRD.md             ← Qué es el ecosistema y para quién (v2.0)
├── SPEC.md            ← Especificación técnica completa (v2.0)
└── CLAUDE.md          ← Instrucciones operativas para Claude Code (v2.1)
```

## Instalación local (solo frontend)

```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

## Variables de entorno

Crear `frontend/.env.local`:

```env
VITE_SUPABASE_URL=https://vrtqtltkiifconviaiwf.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_iBvVLZRRZKLRS6obeB3XJg_mmpEBid5
```

> El archivo `.env.local` está en `.gitignore` — nunca se sube a GitHub.

## Deploy

- **Frontend:** Vercel — deploy automático en cada push a `main`
- **Base de datos:** Supabase — región São Paulo
- **URL producción:** https://galicia-migrante.vercel.app

## Migraciones de base de datos

```bash
cd backend
npm install
node scripts/run-migration.js
```

Requiere `SUPABASE_DB_PASSWORD` en `backend/.env`. Ver `SPEC.md` sección 9.4.

## Idiomas soportados

- Español (Argentina) — `es`
- Galego — `gl`
- English — `en`

## Documentación

- **PRD.md** — visión del ecosistema, secciones, membresías, roadmap, métricas, legal, seguridad, análisis competitivo (v2.2)
- **SPEC.md** — stack, arquitectura, base de datos, decisiones técnicas, migraciones 001-008 (v2.0)
- **CLAUDE.md** — instrucciones operativas para Claude Code (v2.4)
- **myheritage.md** — referencia completa de MyHeritage: funcionalidades, arquitectura técnica, UI detallada y decisiones para GM (v2.0 — unificado)
- **LEGAJO_FUTURO.md** — ideas bien documentadas que no implementamos por ahora (31 entradas)

## Licencia

Todos los derechos reservados — Galicia Migrante 2026
