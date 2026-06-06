# Legado Futuro — Módulo Árbol Genealógico / Galicia Migrante

> Este archivo documenta deuda técnica conocida, funcionalidades pendientes e ideas para el futuro.
> NO describe decisiones activas — esas van en DECISIONS.md.

---

## 🎯 Objetivo del módulo

Construir el módulo genealógico más completo, eficiente y profesional posible — a la altura o por encima de MyHeritage, FamilySearch y Ancestry — listo para integrarse al ecosistema Galicia Migrante cuando alcance madurez.

---

## 🌐 Contexto del ecosistema

```
galicia-migrante/
├── portal/              ← compartido (auth, design-system, payments, i18n)
├── modulos/
│   ├── arbol/           ← ESTE MÓDULO
│   ├── territorio/      ← Tu lugar en Galicia
│   ├── comunidad/       ← Asociaciones, micrositios
│   ├── cultura/         ← Biblioteca, memoria oral
│   └── investigacion/   ← Registros históricos
```

---

## 🐛 Bugs conocidos

### [BUG-01] CRUD de relaciones inaccesible desde la UI
Diferido a la implementación del sidebar completo al estilo MyHeritage.

### [BUG-02] Edición de relaciones y disolución de pareja sin UI
`DissolveCell` definido pero nunca renderizado. Se implementará en el sidebar de persona.

### [BUG-03] Pérdida de filiación visual — hijos casados como secundarios (líneas diagonales)
**Causa raíz:** `isSecondaryInGroup` en `layoutFamilyGraph.js` → `getSortedChildren()`.
**Fix correcto:** refactorizar `placeSubtree`. Alcance: 1–2 sesiones dedicadas.

### [BUG-04] Nodos fantasma con coordenadas negativas ocultos
Nodos fantasma parcialmente ocultos cuando el nodo activo está cerca del borde izquierdo.

### [BUG-05] Slider de generaciones no filtra sin foco activo
El slider existe en la UI pero no tiene efecto sin foco activo.

---

## 🖥️ Menú del módulo — items NO-MVP

Los siguientes ítems del menú están reservados pero no implementados en MVP. Aparecen deshabilitados con badge "Próximamente":

### Vista de abanico (Mi Árbol)
Vista del árbol en semicírculo concéntrico. Ver especificación en `myheritage.md` sección 43.

### Vista de lista (Mi Árbol)
Vista tabular de todas las personas del árbol con filtros avanzados.

### Descubrimientos (sección completa)
- Coincidencias por persona (SmartMatch)
- Coincidencias por fuente (RecordMatch)
Requiere Smart Matching — tercera etapa.

### Análisis con IA (Fotos y Documentos)
Pipeline de IA para fotos: mejorar nitidez, colorear, animar rostros.
Ver especificación completa en `myheritage.md` sección 47. Tercera etapa.

### Investigación (sección completa)
- Explorar registros históricos
- Catálogo de la colección
- Nacimiento, matrimonio y defunción
- Censos y padrones
- Árboles genealógicos
- Periódicos
- Registros de inmigración
Requiere repositorio propio de registros históricos — tercera etapa.

---

## 🔧 Mejoras de base de datos — pendientes

### Trigger de integridad genealógica en Supabase
Función PL/pgSQL que verifica antes de cada INSERT en `relationships`:
- Una persona no puede ser padre/madre de sí misma
- Una persona no puede ser su propio ancestro

### Auditoría de índices en Supabase
- `idx_relationships_person_a` sobre `person_a_id`
- `idx_relationships_person_b` sobre `person_b_id`
- `idx_relationships_type` sobre `type`
- `idx_people_surname_1` sobre `surname_1`
- `idx_people_birth_year` sobre `birth_year`
- `idx_people_birth_place` sobre `birth_place`

### birth_order en relaciones hijo
Campo `birth_order INTEGER` en `relationships` para ordenar hijos explícitamente.

### Migración del campo `adopted`
Obsoleto — ver DECISIONS [027]. Migrar a tipos de relación explícitos.

---

## 📊 Tabla derived_relationships

```sql
CREATE TABLE derived_relationships (
  person_a_id       bigint,
  person_b_id       bigint,
  relationship_type text,
  distance          int,
  path              jsonb,
  calculated_at     timestamp
);
```

Permite búsquedas multi-salto eficientes a escala.

---

## 🖥️ Sidebar de persona (ProfileDrawer) — próximo bloque de trabajo

Especificación completa en `myheritage.md` sección 45.

**Detonador:** click simple en zona neutra de la tarjeta de persona.

**Contenido:**
- Encabezado: foto 120x120px, nombre, edad, botones [Árbol] y [Editar]
- Datos biográficos con edición inline
- Matrimonios con link al cónyuge
- Familia inmediata navegable
- Eventos de vida cronológicos
- Fuentes y documentos vinculados

**Resuelve:** BUG-01 y BUG-02.

---

## 👤 Sistema de foco completo

- Badge `xN` → popup con lista de contextos → navegar (pendiente)
- Filtro generacional con foco activo (pendiente)

---

## 🌳 Layout avanzado

- Algoritmo Reingold-Tilford completo
- Manejo de ciclos genealógicos (primos que se casan)
- Vista hourglass centrada en una persona
- BranchExtender: botón `+N` para expandir/colapsar ramas

---

## 📥 GEDCOM import/export

- Importación GEDCOM 5.5/5.5.1 tolerante a errores
- Exportación GEDCOM
- Importación/exportación CSV, Excel, JSON

---

## 👤 Perfil extendido de persona

- Evento de emigración/inmigración (barco, puerto, fecha, destino)
- Bautismo + padrinos + madrinas
- Servicio militar
- Múltiples ocupaciones con período
- Educación con institución y título

---

## 🗺️ Campos territoriales gallegos

- Parroquia + aldea + concello como campos estructurados
- Dropdown desde seed IGE (~3.800 parroquias)
- **Identificación por lugar de origen:** "Manuel de Soutolongo" en el nodo

---

## 📅 Precisión de fechas persistida

Columnas `*_date_precision` en `people`. Soportar fechas aproximadas "Circa 1930".

---

## 🖼️ Avatar con fallback diferenciado por género

- MALE → silueta azul-pizarra
- FEMALE → silueta rosa-pastel
- UNKNOWN → silueta gris neutra

---

## 🔍 Búsqueda avanzada

- Full-text search sobre nombres, apellidos, lugares
- Búsqueda fuzzy para variantes ortográficas
- Navegación multi-salto usando `derived_relationships`

---

## ✅ Consistency Checker

Verificación lógica de fechas imposibles, edades implausibles y relaciones circulares.

---

## 🖼️ Fotos de personas

- Almacenamiento en Supabase Storage
- FaceTaggerOverlay con efecto cruzado bidireccional

---

## 🤖 Pipeline de IA para fotos (tercera etapa)

Ver `myheritage.md` sección 47.

---

## 🔗 Vinculación entre árboles

Una persona en múltiples árboles aparece con badge de vinculación. Smart Matching automático — tercera etapa.

---

## 🔍 Smart Matching (tercera etapa)

```
S_confianza = w1·S_nombre + w2·S_fecha_nacimiento + w3·S_coincidencia_padres
```
Umbral: 85%. Double Metaphone / Soundex adaptado al español y gallego histórico.

---

## 🏗️ Onboarding Wizard (segunda etapa)

Flujo de registro ligado a la creación del primer núcleo familiar. Ver `myheritage.md` sección 49.

---

## 💰 Paywall (segunda etapa)

Límite configurable de personas por plan. Blur + modal al alcanzar el límite. Ver `myheritage.md` sección 50.

---

## ⚡ Performance a escala

- React.memo en PersonNode
- Web Workers para cálculo de layout
- Virtualización para árboles masivos

---

## 📊 Registro de conteo de tokens por prompt

Explorar automatización del registro de consumo de tokens por sesión de Claude Code.

---

## 🔐 Autenticación (portal)

El módulo hereda Supabase Auth con roles y feature flags por plan. Recibe `user` y `plan` como props.

---

## 📦 Duplicación de personas

Algoritmo de similitud + UI de confirmación y fusión.

---

## 🌐 Integración al ecosistema Galicia Migrante

**Condición para integrar:** barra del módulo, página de inicio, sidebar, GEDCOM, tipos parentales completos, perfil extendido, campos territoriales básicos.

**Módulos futuros:**
- Tu lugar en Galicia
- Comunidad (asociaciones, micrositios)
- Cultura (biblioteca, memoria oral)
- Investigación (registros históricos)
- Neo4j para redes migratorias (tercera etapa)
