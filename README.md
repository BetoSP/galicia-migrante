# Módulo Árbol Genealógico — Galicia Migrante

## 📌 Descripción

Módulo genealógico profesional para construir, visualizar y explorar árboles familiares complejos. Diseñado para estar a la altura de las soluciones más avanzadas del mercado (MyHeritage, FamilySearch, Ancestry) con el objetivo de superarlas.

Este módulo es el **corazón emocional** del ecosistema Galicia Migrante — el primer módulo en nacer y el que sienta las bases técnicas compartidas del portal.

---

## 🌐 Contexto del ecosistema

```
galicia-migrante/
├── portal/              ← compartido por todos los módulos
│   ├── auth/
│   ├── design-system/
│   ├── payments/
│   └── i18n/
├── modulos/
│   ├── arbol/           ← ESTE MÓDULO
│   ├── territorio/      ← futuro
│   ├── comunidad/       ← futuro
│   └── ...
```

Al integrarse al portal expone un único componente raíz:

```jsx
<ArbolGenealogico user={user} plan={plan} />
```

---

## 🖥️ Navegación del módulo

Una sola barra con dos filas, presente en todas las secciones:

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo GM]  [Nombre del árbol ▾] [controles]   [👤 Usuario] [...]  │
├──────────────────────────────────────────────────────────────────┤
│   Genealogía | Mi Árbol | Fotos | Administrar | Estadísticas     │
└──────────────────────────────────────────────────────────────────┘
```

- **Logo GM** → único para todo el portal y sus módulos
- **Genealogía** → página de inicio del módulo (dashboard)
- **Usuario** → solo informativo; login y cuenta se gestionan desde el portal

---

## 🎯 Objetivo

Construir el módulo genealógico más completo, eficiente y profesional posible. Cada decisión está tomada con escala de miles de registros en cientos de árboles en mente desde el primer día.

---

## ⚙️ Stack tecnológico

- React + Vite
- CSS Variables (design system compatible con portal futuro)
- Supabase (PostgreSQL)
- GitHub: https://github.com/BetoSP/Clon_de_My_Heritage (branch: master)

---

## 🧩 Modelo del sistema

```
people        → nodos base (personas)
relationships → edges base (relaciones)
union nodes   → nodos derivados en runtime (vínculos de pareja)
child_of      → edges derivados cuando ambos padres son pareja
derived_relationships → tabla precalculada (pendiente)
```

Supabase es la única fuente de verdad. El frontend solo transforma y visualiza.

---

## 🗄️ Tipos de relación

### Vínculos de pareja (COUPLE_TYPES)
```
married, partner, co_parent, separated, divorced, widowed, unknown
```

### Vínculos parentales (PARENT_TYPES)
```
father, mother, adoptive_father, adoptive_mother,
stepfather, stepmother, foster_father, foster_mother
```

### Fraternales
```
brother, sister
```

---

## ⚙️ Estado funcional actual

✔ CRUD completo de personas (incluyendo name_2) y relaciones
✔ Motor de grafo con displayName, displaySurnames, dateDisplay, hasHiddenParents
✔ Layout engine bottom-up con espaciado simétrico
✔ Visualización SVG con pan & zoom
✔ Barra de género en nodo (franja vertical por género)
✔ Símbolos genealógicos (* nacimiento, † fallecimiento)
✔ Abreviación progresiva del nombre (5 niveles)
✔ Bloqueo automático de género en modal
✔ Nodos fantasma con detección de todos los PARENT_TYPES
✔ Click en nodo → foco: centra vista + barra de contexto
✔ Badge de vinculación con lógica correcta
✔ get_subgraph con hermanos, sin ancestros de cónyuges
✔ Design system con variables CSS — cero valores hardcodeados
✔ Footer minimalista

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── GraphView.jsx
│   ├── PersonModal.jsx
│   ├── AddRelativeModal.jsx
│   ├── RelationshipModal.jsx     — pendiente BUG-01
│   ├── TopNavBar.jsx             — reemplazar por ModuleNavBar
│   ├── TreeContextBar.jsx
│   ├── TreeControlPanel.jsx
│   └── FooterBar.jsx
├── graph/
│   ├── buildFamilyGraph.js
│   ├── layoutFamilyGraph.js
│   ├── geometry.js
│   └── relationshipTypes.js
├── services/
│   ├── peopleService.js
│   └── relationshipService.js
├── utils/
│   └── personUtils.js
├── lib/
│   └── supabase.js
├── App.jsx
├── App.css
└── index.css
```

---

## 📚 Documentación interna

- `DECISIONS.md` — decisiones de arquitectura (incluye [034]-[038]: name_2, abreviación, barra del módulo, menú)
- `ENGINE_RULES.md` — reglas del motor de grafo
- `PROJECT_CONTEXT.md` — estado actual, esquema de DB y pendientes
- `LEGADO_FUTURO.md` — deuda técnica y funcionalidades futuras
- `CLAUDE.md` — instrucciones base para Claude Code
- `myheritage.md` — referencia técnica completa v3.0

---

## 🚀 Instalación local

```powershell
cd arbol
npm install
npm run dev
```

Crear `arbol/.env`:
```env
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_KEY=tu_key
```
