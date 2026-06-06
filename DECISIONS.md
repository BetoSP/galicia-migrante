# Decisiones de arquitectura — Módulo Árbol Genealógico / Galicia Migrante

Registro de decisiones técnicas tomadas durante el desarrollo.
Cada entrada responde: qué se decidió, por qué, qué se descartó y qué impacto tiene en el sistema.

> **Principio rector:** el sistema debe estar a la altura de las soluciones genealógicas más profesionales conocidas (MyHeritage, FamilySearch, Ancestry) con el objetivo de superarlas. Cada decisión de arquitectura debe ser evaluada con escala de miles de registros en cientos de árboles desde el primer día.

---

## [001] TEXT + CHECK en lugar de ENUM para relationship_type

**Decisión:** usar `TEXT` con constraint `CHECK (type IN (...))` en la tabla `relationships`.

**Razón:**
- Agregar un nuevo tipo con ENUM requiere `ALTER TYPE` (problemático en PostgreSQL)
- Con TEXT + CHECK se puede modificar el constraint sin dependencias fuertes
- Compatible con Supabase/PostgREST sin fricción

**Descartado:** `CREATE TYPE relationship_type AS ENUM (...)`

---

## [002] — SUPERSEDIDA por [025]

**Estado:** la decisión original de usar solo `spouse` + `until_year` fue revertida.
Ver decisión [025] para el modelo actual de tipos de relación de pareja.

---

## [003] Orden canónico en relaciones simétricas de pareja

**Decisión:** para todos los tipos de `COUPLE_TYPES`, siempre almacenar:
- `person_a_id < person_b_id`

**Razón:**
- Evita duplicación de parejas invertidas (A–B vs B–A)
- Garantiza unicidad estructural del grafo
- Simplifica queries y generación de union nodes

**Implementación:** `relationshipService.js` aplica `min/max` para todos los `COUPLE_TYPES`.

---

## [004] Arquitectura modular — árbol como módulo del portal

**Decisión:** el árbol genealógico se desarrolla como módulo independiente pero preparado para integrarse al ecosistema Galicia Migrante.

**Estructura del ecosistema:**
```
galicia-migrante/
├── portal/            ← compartido por todos los módulos
│   ├── auth/
│   ├── design-system/
│   ├── payments/
│   └── i18n/
├── modulos/
│   ├── arbol/         ← este módulo
│   ├── territorio/    ← futuro
│   └── ...
```

**Regla de integración:**
- Si el portal ya tiene el componente → el árbol lo hereda
- Si no existe → el árbol lo crea en `portal/` para que lo compartan los módulos futuros

**Lo que hereda del portal:** auth, design system, payments, i18n
**Lo que es propio:** motor de grafo, visualización SVG, servicios de datos, modales genealógicos, barra del módulo

**Interfaz de integración:**
```jsx
<ArbolGenealogico user={user} plan={plan} />
```

---

## [005] Relaciones padre → hijo son direccionales

**Decisión:**
- `person_a_id` = progenitor
- `person_b_id` = hijo

---

## [006] Modelo temporal de relaciones

**Decisión:** todas las relaciones son temporales:
- `since_year` = inicio (NULL = desconocido)
- `until_year` = fin (NULL = activo)
- `end_reason` = causa del fin (ver [026])

---

## [007] — SUPERSEDIDA por [025]

---

## [008] Union nodes como entidades derivadas

**Decisión:** los vínculos de pareja NO existen como entidades persistidas. Se generan en runtime para todos los tipos en `COUPLE_TYPES`.

---

## [009] Modelo de grafo como núcleo del sistema

**Decisión:** el sistema se basa en un grafo dirigido:
- `people` → nodos base
- `relationships` → edges base
- `union nodes` → nodos derivados en runtime
- `child_of` → edges derivados desde union nodes cuando aplica

---

## [010] Absorción de relaciones parentales en union nodes

**Decisión:** cuando existe una pareja (cualquier `COUPLE_TYPE`), las relaciones parentales duales se reemplazan por `union node → child` (`child_of`).

---

## [011] Fechas en columnas separadas (día, mes, año)

**Decisión:** almacenar fechas en tres columnas separadas. Permite fechas parciales.

**Descartado:** columna única de tipo DATE.

---

## [012] CRUD completo en servicios

**Decisión:** los servicios exponen operaciones completas. Los componentes nunca llaman a Supabase directamente.

---

## [013] Modales en lugar de formularios en vista principal

**Decisión:** los formularios de carga son modales flotantes. El árbol siempre es el protagonista de la UI.

---

## [014] Nodos fantasma para agregar familiares

**Decisión:** al hacer click en `+`, aparecen nodos fantasma mostrando solo las relaciones vacantes.

---

## [015] Design system heredado del portal

**Decisión:** el módulo árbol no define colores, tipografía ni espaciado propios. Hereda todo del `portal/design-system/`. Mientras el portal no exista, las variables CSS viven en `index.css`.

---

## [016] — SUPERSEDIDA por [027]

---

## [017] — SUPERSEDIDA por [027]

---

## [018] Apellidos como campo único — SUPERSEDIDA por [020]

---

## [019] Separación de nombre y apellidos

**Decisión:** campos separados: `name`, `name_2`, `surname_1`, `surname_2`, `surname_married`, `surnames` (calculado).

---

## [020] Apellidos estructurados en tres campos

**Decisión:** `surname_1`, `surname_2`, `surname_married` en la tabla `people`. `surnames` es calculado en frontend.

---

## [021] Cálculo automático de surnames en frontend

**Decisión:**
- Mujer con `surname_married`: `surname_1 + " " + surname_2 + " de " + surname_married`
- Todos los demás: `surname_1 + " " + surname_2`

---

## [022] Sugerencia automática de apellidos

**Decisión:** al agregar un hijo/hija:
- `surname_1` del hijo = `surname_1` del padre
- `surname_2` del hijo = `surname_1` de la madre

---

## [023] Nivelación de generaciones de cónyuges en layout

**Decisión:** si dos personas en `COUPLE_TYPES` están en generaciones distintas, ambas se elevan a la mayor.

---

## [024] Layout bottom-up con grupos

**Decisión:** el layout usa dos pasadas: bottom-up (anchos) y top-down (posiciones X). Padres centrados sobre sus hijos.

---

## [025] Tipos de vínculo de pareja explícitos en DB

**Decisión:**
```
married, partner, co_parent, separated, divorced, widowed, unknown
```

**Migración:** `UPDATE relationships SET type = 'married' WHERE type = 'spouse';`

---

## [026] Campo end_reason en relationships

**Decisión:** `end_reason TEXT CHECK (end_reason IN ('death', 'divorce', 'separation', 'annulment'))`.

---

## [027] Tipos de relación parental explícitos en DB

**Decisión:**
```
father, mother, adoptive_father, adoptive_mother,
stepfather, stepmother, foster_father, foster_mother
```

**Impacto:** el campo `adopted` en `people` queda obsoleto.

---

## [028] Tabla derived_relationships para búsquedas escalables

**Pendiente de implementación.**

---

## [029] Foco por defecto al cargar

**Decisión:** foco automático en la primera persona. `focusInitialized` y `focusWasCleared` como `useRef` en `App.jsx`.

---

## [030] Desarrollo independiente con integración planificada

**Decisión:** el módulo árbol se desarrolla hasta madurez completa antes de integrarse al portal.

---

## [031] Display de apellidos en nodos del grafo

**Decisión:**
- Si existe `surname_1` → mostrar `surname_1 + " " + surname_2`
- Si no hay `surname_1` pero hay `surname_married` → mostrar `de surname_married`

**Tipografía:** nombre y apellidos con `fontWeight="700"` — misma tipografía y peso.

---

## [032] getVacantSlots detecta padre/madre usando PARENT_TYPES

**Decisión:** usar `PARENT_TYPES.has(e.type) && e.type.includes("father/mother")` en lugar de strings literales.

---

## [033] Edición de relaciones y disolución de pareja — diferidas al sidebar

**Decisión:** se implementarán como parte del sidebar de persona al estilo MyHeritage.

**Descartado:** click en union node → modal de relación.

---

## [034] Nombre en dos campos separados

**Decisión:** separar el nombre de pila en dos campos:
- `name` → primer nombre de pila
- `name_2` → segundo nombre de pila (opcional)

**Razón:** consistencia con el modelo de apellidos estructurados. Permite abreviación progresiva independiente de cada campo.

**Migración Supabase:**
```sql
ALTER TABLE people ADD COLUMN IF NOT EXISTS name_2 text;
```

---

## [035] Abreviación progresiva del nombre en el nodo

**Decisión:** cuando el nombre completo desborda el ancho del nodo, se abrevia progresivamente en este orden:

```
Nivel 0: María Concepción Sánchez González   (completo)
Nivel 1: María Concepción Sánchez G.         (abreviar surname_2)
Nivel 2: María Concepción S. G.              (abreviar surname_1)
Nivel 3: María C. S. G.                      (abreviar name_2)
Nivel 4: M. C. S. G.                         (abreviar name)
Nivel 5: M. C. S…                            (truncar — último recurso)
```

**Razón:** más elegante que truncar con ellipsis — preserva información hasta el último momento.

**Implementación:** función `computeAbbreviatedName` en `personUtils.js`. Calculado en `buildFamilyGraph.js` como `node.data.displayName`.

---

## [036] Barra del módulo genealógico — estructura de dos filas

**Decisión:** el módulo genealógico tiene una sola barra con dos filas, presente en todas las secciones del módulo:

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo GM]  [Nombre del árbol ▾] [controles]    [👤 Usuario] [utilidades] │
├─────────────────────────────────────────────────────────────────┤
│    Genealogía | Mi Árbol | Fotos | Administrar | Estadísticas   │
└─────────────────────────────────────────────────────────────────┘
```

**Fila 1:**
- Logo GM (isologotipo único para todo el portal y sus módulos)
- Selector de árbol activo con nombre definido por el usuario + dropdown para cambiar entre árboles
- Controles del árbol (sincronizar, privacidad, etc.)
- Nombre del usuario logueado (solo informativo — login y cuenta se gestionan desde el portal)
- Utilidades (mensajes, ayuda, idioma)

**Fila 2 — Menú de navegación del módulo:**
- Genealogía → página de inicio del módulo
- Mi Árbol → vista de linaje (árbol tradicional)
- Fotos → galería de fotos y documentos
- Administrar → mis árboles, miembros, importar/exportar, configuración
- Estadísticas → estadísticas del árbol

**Razón:**
- Un solo menú evita confusión entre contextos
- El logo lleva siempre al portal
- "Genealogía" lleva al inicio del módulo — nombre propio sin ambigüedad con "Inicio" del portal
- El usuario es solo informativo — toda la gestión de cuenta es del portal

**Items NO-MVP** (reservan lugar en el menú, aparecen deshabilitados con badge "Próximamente"):
- Vista de abanico
- Vista de lista
- Descubrimientos (SmartMatch, RecordMatch)
- Análisis con IA en fotos
- Investigación (registros históricos)

---

## [037] Página de inicio del módulo genealógico

**Decisión:** la página de inicio del módulo (accedida desde "Genealogía" en el menú) sigue el modelo de MyHeritage:

**Contenido:**
- Nombre del árbol (definido por el usuario, campo de texto libre con límite de caracteres)
- Dueño del árbol + estadísticas: total de personas, total de fotos
- Espacio para banner (publicitario propio o de terceros — colapsa si no hay contenido)
- Eventos familiares próximos (cumpleaños, aniversarios en los próximos 30 días)
- Últimas actividades del árbol
- Coincidencias encontradas (SmartMatches pendientes — segunda etapa)

**El nombre del árbol** es definido por el usuario y puede ser cualquier texto (ej: "Sanchez Web Site", "Familia García", "Mi árbol"). El límite de caracteres lo define el plan del usuario.

**Razón:** el dashboard de inicio contextualiza al usuario dentro de su árbol y le muestra las acciones más relevantes.

---

## [038] Menú del módulo genealógico — estructura completa

**Decisión:** estructura completa del menú con indicación de MVP vs futuro:

```
Módulo Genealógico
│
├── Genealogía (inicio del módulo — dashboard)       ← MVP
│
├── Mi Árbol
│   ├── Vista de linaje (árbol tradicional)          ← MVP
│   ├── Vista de abanico                             ← NO MVP
│   └── Vista de lista                               ← NO MVP
│
├── Fotos y Documentos
│   ├── Mis fotos                                    ← MVP
│   ├── Mis documentos                               ← MVP
│   └── Análisis con IA                              ← NO MVP
│
├── Descubrimientos                                  ← NO MVP
│   ├── Coincidencias por persona (SmartMatch)
│   └── Coincidencias por fuente (RecordMatch)
│
├── Investigación                                    ← NO MVP
│   ├── Explorar registros históricos
│   ├── Catálogo de la colección
│   ├── Nacimiento, matrimonio y defunción
│   ├── Censos y padrones
│   ├── Árboles genealógicos
│   ├── Periódicos
│   └── Registros de inmigración
│
├── Administrar
│   ├── Mis árboles                                  ← MVP
│   ├── Miembros del sitio                           ← MVP
│   ├── Importar / Exportar                          ← MVP
│   └── Configuración del árbol                     ← MVP
│
└── Estadísticas                                     ← MVP
```

Los ítems NO-MVP aparecen en el menú pero deshabilitados con badge "Próximamente".

---

## 📌 Regla general del archivo

Este archivo contiene únicamente decisiones técnicas ya tomadas o en proceso de implementación.
Cada decisión debe poder rastrearse en código existente o en SQL ejecutado.
