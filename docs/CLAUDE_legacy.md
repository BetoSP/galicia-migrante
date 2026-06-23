# CLAUDE.md — Instrucciones operativas para Claude Code
### Galicia Migrante — Leer antes de cualquier acción
**Versión:** 2.4 — 20 de mayo de 2026

---

## Documentos del proyecto

### Documentos que guían la construcción del sitio

Leer **completos** y en este orden antes de comenzar cualquier tarea:

1. **PRD.md** — qué es el ecosistema, para quién, qué hace, roadmap completo
2. **SPEC.md** — stack, arquitectura, base de datos, decisiones técnicas
3. **Este archivo (CLAUDE.md)** — reglas operativas, estándares de código y estado del proyecto

### Documentos de referencia (no para construir — para consultar)

- **myheritage.md** — ingeniería inversa de MyHeritage: funcionalidades, arquitectura técnica y UI detallada. Se consulta para entender el *por qué* de las decisiones de producto, no para copiar. Antes de proponer una feature del árbol o del perfil, verificar la sección 42 para saber si ya fue evaluada y en qué etapa cae.
- **LEGAJO_FUTURO.md** — ideas bien documentadas que no implementamos por ahora. Se consulta para no volver a proponer algo que ya fue postergado conscientemente. Si una idea nueva encaja con una entrada existente, actualizar esa entrada en lugar de implementar.

---

## Principio rector permanente

**El portal es la puerta de entrada. La genealogía es uno de los servicios.**

El ecosistema se irá definiendo y reconfigurando continuamente. Cada decisión de arquitectura, schema, stack y código debe evaluarse no solo contra lo que el sistema hace hoy, sino contra su capacidad de incorporar lo que todavía no sabemos que va a necesitar hacer.

No hacer parches. No improvisar. No dejar "para arreglar después". **El camino más corto termina siendo el más largo.**

---

## Regla fundamental

Antes de escribir una línea de código:
1. Entender completamente qué hay que hacer
2. Planificar la solución completa
3. Mostrar el plan antes de ejecutar
4. Ejecutar correctamente desde el principio

---

## Auditoría periódica de estado — PRÁCTICA OBLIGATORIA

Antes de iniciar cualquier bloque de tareas nuevas, y siempre que el usuario lo solicite, ejecutar una auditoría de estado real del proyecto usando `PROMPT_AUDITORIA_ESTADO.md`.

La auditoría verifica que el estado documentado en este archivo y en SPEC.md refleja la realidad del código — sin asumir, sin saltear ítems, solo lectura.

**Cuándo ejecutarla obligatoriamente:**
- Al inicio de cada nueva sesión de desarrollo después de una pausa prolongada
- Antes de iniciar una etapa nueva (segunda etapa, tercera etapa)
- Cuando el usuario lo solicite explícitamente
- Cuando haya dudas sobre el estado real de algún componente

El reporte de auditoría debe compartirse con el usuario antes de continuar con cualquier tarea nueva.

---

## Reglas de Git — SIEMPRE

- Después de cada conjunto de cambios, hacer commit y push automáticamente
- El mensaje del commit debe ser descriptivo y en inglés
- Formato: `tipo: descripción breve` (ej: `feat: add relaciones_persona table`, `fix: auth cookie`)
- Nunca esperar a que el usuario pida el commit — hacerlo siempre
- Nunca subir `.env`, `node_modules/` ni archivos de credenciales

---

## Reglas de archivos — SIEMPRE

- Nunca borrar archivos sin antes mostrar el plan completo y esperar aprobación
- Siempre entregar archivos completos para reemplazar — nunca parches parciales
- Lo que se agrega no borra lo ya hecho — puede reorganizarlo y reubicarlo
- Antes de crear un archivo nuevo, verificar que no existe uno similar

---

## Reglas de código

- Nunca hardcodear texto visible al usuario — siempre usar el objeto `I18N`
- Nunca hardcodear precios, límites o permisos en el frontend
- La sesión Supabase se guarda automáticamente en localStorage vía el SDK — no manejar tokens manualmente
- Siempre manejar estados de carga y error en llamadas a la API (ver sección Manejo de errores)
- Siempre agregar claves i18n en los 3 idiomas (es, gl, en) simultáneamente
- Usar `credentials: "include"` solo si se reactiva el backend Node (segunda etapa)
- Todo código nuevo debe estar limpio y fácilmente tipable — preparado para la futura migración a TypeScript
- Nunca credenciales en el código. Nunca datos sensibles en logs.

## Regla de CSS — CRÍTICA

Todo CSS nuevo debe respetar las variables definidas en `frontend/src/styles/variables.js`.
**No inventar nuevos valores** de color, espaciado o tipografía fuera del sistema existente.
El sistema cromático azul/dorado/verde se respeta siempre — es la identidad visual del proyecto.
En la migración a Next.js + TailwindCSS estas variables se trasladarán al sistema de tokens de Tailwind.

## Regla de sincronización del backend

El backend Node está inactivo en el MVP pero debe mantenerse sincronizado con todos los cambios del proyecto. Cada vez que se modifique el schema de la base de datos, actualizar también:

- `backend/src/routes/raices.js` — lista de campos aceptados (`PERSONA_FIELDS`)
- `database/schema.sql` — definición completa de tablas (fuente de verdad)
- `backend/.env.example` — plantilla con todas las variables de entorno necesarias

---

## Manejo de errores — ESTÁNDAR OBLIGATORIO

**Un error no manejado es peor que un error visible.** El sistema nunca falla silenciosamente. El usuario siempre sabe qué pasó. El desarrollador siempre puede diagnosticar qué falló.

### Patrón estándar para todas las llamadas a Supabase

Toda función en `frontend/src/api/` sigue este patrón sin excepción:

```javascript
// ✅ CORRECTO
async function obtenerPersonas(sitioId) {
  try {
    const { data, error } = await supabase
      .from('personas_arbol')
      .select('*')
      .eq('sitio_id', sitioId);

    if (error) throw error;
    return { data, error: null };

  } catch (error) {
    console.error('[raices/obtenerPersonas]', error.message, { sitioId });
    return { data: null, error: error.message };
  }
}

// ❌ INCORRECTO — nunca ignorar el campo error
async function obtenerPersonas(sitioId) {
  const { data } = await supabase.from('personas_arbol').select('*');
  return data; // puede ser null sin que nadie lo sepa
}
```

Las funciones de API **nunca lanzan excepciones al componente** — siempre retornan `{ data, error }`. El componente decide qué hacer.

### Estados de UI obligatorios en todo componente que carga datos

```javascript
const [cargando, setCargando] = useState(true);
const [error, setError]       = useState(null);
const [datos, setDatos]       = useState(null);

if (cargando) return <EstadoCargando />;
if (error)    return <EstadoError mensaje={error} onReintentar={cargar} />;
if (!datos)   return <EstadoVacio />;
return <ContenidoReal datos={datos} />;
```

**Nunca mostrar una pantalla en blanco.** Siempre hay un estado que comunicar.

### Mensajes de error al usuario

- **Nunca mostrar mensajes técnicos** — no `PGRST116`, no stack traces, no SQL
- **Siempre usar claves i18n** — los errores también se traducen a los 3 idiomas
- **Siempre ofrecer una acción** — "Reintentar", "Volver", "Contactar soporte"

```javascript
// Claves i18n mínimas para errores — agregar en es/gl/en
error_cargar_personas:  "No se pudieron cargar las personas del árbol"
error_guardar_persona:  "No se pudo guardar la persona"
error_eliminar_persona: "No se pudo eliminar la persona"
error_sesion_expirada:  "Tu sesión expiró. Ingresá nuevamente."
error_sin_conexion:     "Sin conexión. Verificá tu internet e intentá nuevamente."
error_inesperado:       "Ocurrió un error inesperado. Intentá nuevamente."
error_sin_permiso:      "No tenés permiso para realizar esta acción."
```

### Clasificación de errores de Supabase

| Código | Causa | Acción |
|---|---|---|
| `PGRST116` | 0 filas encontradas | No es error — retornar array vacío |
| `42501` | Sin permiso (RLS) | Sesión expirada — redirigir a login |
| `23505` | Violación de unicidad | Mostrar mensaje específico al usuario |
| `23503` | Violación de FK | Loguear y mostrar error genérico |
| `PGRST301` | JWT expirado | Refrescar sesión o redirigir a login |
| Network error | Sin conexión | Mensaje de conexión + opción reintentar |

### Formato del log de errores

```javascript
// Siempre: módulo, función, mensaje, contexto (sin datos sensibles)
console.error('[raices/crearSitio]', error.message, { usuarioId, nombreSitio });
```

Siempre `console.error` para errores — nunca `console.log`.

### Operaciones de escritura — feedback inmediato

```javascript
const [guardando, setGuardando] = useState(false);

async function handleGuardar() {
  setGuardando(true);
  const { error } = await api.guardarPersona(datos);
  setGuardando(false);
  if (error) { mostrarError(t.error_guardar_persona); return; }
  mostrarExito(t.persona_guardada);
}

// El botón se deshabilita mientras opera
<button disabled={guardando} onClick={handleGuardar}>
  {guardando ? t.guardando : t.guardar}
</button>
```

**Ningún botón de acción queda habilitado mientras su operación está en curso.**

### Barra de progreso — OBLIGATORIA en operaciones de importación

Toda operación de importación de datos debe mostrar una barra de progreso visible al usuario, **independientemente de la cantidad de registros** — desde 1 hasta infinitos. No es opcional ni condicional. El usuario siempre sabe cuánto avanzó y cuánto falta.

Cuando la operación tiene pasos contables (ej: insertar N personas), la barra muestra progreso real: "Importando persona 45 de 250". Cuando no es contable, muestra al menos un indicador de actividad con el paso actual: "Procesando archivo...", "Creando relaciones...".

Esta regla aplica a: importación GEDCOM, importación CSV/Excel/JSON, cualquier operación batch futura.

### Operaciones destructivas — confirmación obligatoria

Toda operación que elimine o modifique datos de forma irreversible requiere confirmación explícita antes de ejecutar:
- Eliminar persona del árbol
- Eliminar sitio familiar
- Eliminar documento o archivo
- Cambiar propietario de un sitio
- Cualquier acción marcada como "peligrosa" en el panel admin

### Código existente — deuda técnica de manejo de errores

El código escrito antes de esta política (`raices.js`, `auth.js`, componentes del árbol) no aplica este estándar de forma consistente. Hay que auditarlo y corregirlo — ver pendiente #3 más abajo.

**Cuando se modifique cualquier archivo existente por cualquier motivo, aprovechar para aplicar el estándar en las funciones que se toquen.** Se corrige incrementalmente, no todo de una vez.

### Migraciones de base de datos — manejo de errores

Toda migración SQL debe:
- Estar envuelta en `BEGIN` / `COMMIT` — rollback automático si algo falla
- Usar `IF NOT EXISTS` / `IF EXISTS` — idempotencia
- Incluir bloque `DO $$ ... END $$` de verificación dentro de la transacción
- Ir precedida de backup verificado

### Checklist antes de entregar cualquier función que interactúa con datos

- [ ] ¿Tiene try/catch o maneja el campo `error` de Supabase?
- [ ] ¿Retorna `{ data, error }` estructurado?
- [ ] ¿El componente muestra estado de carga?
- [ ] ¿El componente muestra mensaje de error si falla?
- [ ] ¿El mensaje de error está en i18n (3 idiomas)?
- [ ] ¿Las operaciones destructivas piden confirmación?
- [ ] ¿Los botones se deshabilitan durante la operación?
- [ ] ¿El log incluye módulo, función y contexto?

---

## Convenciones de nombrado

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes React | PascalCase | `NavBar`, `ModalPersona` |
| Funciones/hooks | camelCase | `useAuth`, `handleSubmit` |
| Variables CSS | `--kebab-case` | `--primary-dark` |
| Claves i18n | `modulo_elemento` | `nav_inicio`, `hero_title` |
| IDs en BD | snake_case | `usuario_id`, `created_at` |
| Endpoints API | kebab-case | `/api/auth/login` |

---

## Stack tecnológico actual (MVP)

- **Frontend:** React + Vite, CSS-in-JS, i18n propio, `@supabase/supabase-js`
- **Backend Node.js:** inactivo en MVP — Express + JavaScript
- **Base de datos:** Supabase (PostgreSQL + Auth + RLS + Storage), región São Paulo
- **Deploy:** GitHub → Vercel (frontend automático)
- **Local:** Solo frontend en puerto 5173 es suficiente para el MVP

## Stack tecnológico — Segunda etapa (migración conjunta)

Antes de construir los micrositios de asociaciones se realiza una migración conjunta completa. Un solo movimiento, Claude Code se hace cargo. El usuario no necesita aprender ninguna de estas tecnologías.

```
React + Vite   → Next.js
JavaScript     → TypeScript
Express        → NestJS
CSS-in-JS      → TailwindCSS
Supabase       → Supabase (sin cambios)
Neo4j          → No entra en esta etapa
```

---

## Autenticación

- Usar **Supabase Auth SDK** directamente desde el frontend
- `supabase.auth.signInWithPassword()` para login
- `supabase.auth.signUp()` para registro
- `supabase.auth.signOut()` para logout
- `supabase.auth.onAuthStateChange()` en App.jsx para escuchar cambios de sesión
- La sesión se persiste automáticamente en localStorage (manejada por el SDK)
- **Backend Node inactivo en MVP** — no usar `credentials: "include"`

---

## Base de datos

- **Supabase** — tablas con RLS habilitado
- Tablas principales: `usuarios`, `sitios_familiares`, `personas_arbol`, `relaciones_persona`, `sitios_miembros`, `actividad`
- El **frontend** usa `VITE_SUPABASE_ANON_KEY` con RLS para acceso seguro
- Las migraciones están en `database/migrations/` y se ejecutan con `node backend/scripts/run-migration.js`
- Los datos mock en `ArbolGenealogico/mockData.js` sirven como fallback cuando Supabase no responde

### Relaciones entre personas — IMPORTANTE

Las relaciones familiares NO están en columnas de `personas_arbol`.
Están en la tabla `relaciones_persona` con campos `persona_a`, `persona_b`, `tipo`.

**NO usar** `padre_id`, `madre_id`, `conyugue_id` — esas columnas fueron eliminadas en la migración 004.
**USAR** `relaciones_persona` para todas las relaciones familiares.

### Enums de base de datos en el frontend

Los valores de columnas con `CHECK` constraint en la BD tienen su espejo en `frontend/src/config/`. Ejemplo: `personas_arbol.tipo` → `config/tipos.js`. Esta carpeta crece a medida que se necesiten más catálogos compartidos entre módulos.

### Personas vivas

El campo `vivo BOOLEAN` en `personas_arbol` determina restricciones de visibilidad.
Personas con `vivo = TRUE` solo son visibles para el propietario del sitio — nunca en búsquedas públicas ni matchings.

---

## RBAC — Roles, permisos y seguridad

**Roles disponibles:**
- `admin_general` ★ — YubiKey obligatoria + sesión 2hs máximo
- `admin_contenido` — 2FA TOTP obligatorio + sesión 4hs
- `admin_asociaciones` — 2FA TOTP obligatorio + sesión 4hs
- `admin_soporte` — 2FA TOTP obligatorio + sesión 4hs
- `asociado_raices` — acceso al módulo de genealogía
- `asociado_basico` — acceso al portal general
- `asociacion` — admin del micrositio de su propia asociación — 2FA TOTP obligatorio
- `visor` — solo lectura (asignado al registrarse)

**Usuario principal del portal:**
- Email: `alberto.sanchez.p@hotmail.com`
- Rol: `admin_general` ★

**Administración y sucesión:**
El sistema debe tener siempre al menos un admin general secundario como respaldo. Las credenciales del admin de emergencia se guardan físicamente fuera del sistema. Ver SPEC.md sección 5.3.

---

## Estructura del proyecto

```
F:\galicia-migrante\
├── frontend/src/
│   ├── api/
│   │   ├── auth.js
│   │   ├── raices.js
│   │   └── admin.js
│   ├── config/
│   │   └── tipos.js                 ← enum de tipos de persona (= CHECK constraint BD)
│   ├── lib/supabase.js              ← cliente Supabase JS SDK (≠ database/)
│   ├── components/
│   │   ├── common/
│   │   │   ├── BadgeTipo.jsx        ← compartido entre módulos
│   │   │   ├── BadgeRol.jsx
│   │   │   └── MvpPlaceholder.jsx
│   │   └── layout/
│   │       ├── LoadingScreen.jsx
│   │       └── PortalHeader.jsx     ← barra oscura superior del portal
│   ├── i18n/                        ← textos en es/gl/en (→ tabla traducciones en 2ª etapa)
│   ├── pages/
│   │   ├── Auth/
│   │   ├── Landing/
│   │   ├── Admin/
│   │   │   └── index.jsx            ← panel de administración general
│   │   └── Origenes/
│   │       ├── index.jsx            ← contenedor del módulo — estado compartido + shell
│   │       ├── ArbolGenealogico/
│   │       │   ├── index.jsx
│   │       │   ├── constants.js     ← TIPOS, NAV
│   │       │   ├── mockData.js      ← fallback cuando Supabase no responde
│   │       │   ├── NavBar.jsx       ← navegación de secciones del módulo
│   │       │   ├── ModalPersona.jsx
│   │       │   ├── ModalCrearSitio.jsx ← modal para crear nuevo árbol familiar
│   │       │   ├── PrimerUso.jsx
│   │       │   └── sections/
│   │       │       ├── MiArbol.jsx              ← canvas del árbol genealógico
│   │       │       ├── ArbolToolbar.jsx         ← barra de herramientas del árbol
│   │       │       ├── ArbolConfigPanel.jsx     ← panel ⚙ configuración (lee/escribe arbol_config)
│   │       │       ├── AdminArboles.jsx         ← vista admin: lista de personas del árbol
│   │       │       ├── ConfigSitio.jsx          ← configuración del sitio familiar
│   │       │       ├── InicioHome.jsx           ← dashboard de inicio del sitio
│   │       │       ├── EventosFamiliares.jsx    ← eventos familiares
│   │       │       ├── EstadisticasFamiliares.jsx ← estadísticas del árbol
│   │       │       ├── MiembrosSitio.jsx        ← gestión de miembros del sitio
│   │       │       ├── GedcomSection.jsx        ← importación/exportación GEDCOM
│   │       │       ├── Descubrimientos.jsx      ← placeholder con mock data (segunda etapa)
│   │       │       └── GaleriaFotos.jsx         ← placeholder con mock data (segunda etapa)
│   │       └── TuLugarEnGalicia/    ← segunda etapa
│   ├── styles/
│   │   ├── variables.js             ← tokens CSS — respetar siempre
│   │   └── portal.js                ← estilos del portal completo
│   └── App.jsx
├── backend/                         ← INACTIVO en MVP
├── database/
│   ├── schema.sql                   ← fuente de verdad
│   └── migrations/
│       ├── 001_expand_personas_arbol.sql       ← ✅ aplicada
│       ├── 002_rls_policies.sql               ← ✅ aplicada
│       ├── 003_auto_create_usuario_trigger.sql ← ✅ aplicada
│       ├── 004_schema_expansion.sql           ← ✅ aplicada (14/05/2026)
│       ├── 005_eventos_tipo_fallecimiento.sql  ← ✅ aplicada (17/05/2026)
│       ├── 006_gedcom_tolerant_import.sql      ← ✅ aplicada (17/05/2026)
│       ├── 007_add_tipo_sin_raices.sql          ← ✅ aplicada (17/05/2026)
│       └── 008_admin_rls.sql                   ← ✅ aplicada (19/05/2026)
│       ├── 009_arbol_config.sql                ← ✅ aplicada (21/05/2026)
│       ├── 010_feature_flags.sql               ← ✅ aplicada (22/05/2026) — features, plan_features, usuario_features, vista usuario_permisos
│       ├── 011_portal_config.sql               ← ✅ aplicada (22/05/2026)
│       └── 012_grants.sql                      ← ✅ aplicada (27/05/2026) — GRANTs explícitos para todas las tablas
├── CLAUDE.md
├── PRD.md
├── SPEC.md
└── README.md
```

---

## Micrositios de asociaciones (segunda etapa)

Ver especificación completa en PRD.md sección 8 y SPEC.md.

- Se construyen en **Next.js** — primer módulo que justifica la migración
- URL pública: `/asociaciones/[slug]`
- Panel admin: `/asociaciones/[slug]/admin` — 2FA TOTP obligatorio
- No incluye genealogía — es un CMS de contenido puro

---

## Reconstrucción colaborativa — concepto clave (tercera etapa)

No confundir con el árbol genealógico colaborativo (compartir un sitio familiar entre miembros). La reconstrucción colaborativa es un módulo separado donde usuarios indexan y validan documentos históricos del repositorio propio — similar al programa de indexación voluntaria de FamilySearch. Requiere masa crítica de usuarios y repositorio propio. **No implementar antes de tercera etapa.**

---

## Pendientes críticos — en orden de prioridad

### Inmediatos (antes de continuar el desarrollo)
1. ~~**Ejecutar migración 004**~~ ✅ completada 14/05/2026 — commit de917b7 — 37 tablas en Supabase
2. ~~**Actualizar árbol visual**~~ ✅ completado 14/05/2026 — commit 990c720 — 6 archivos modificados
3. ~~**Auditoría de manejo de errores**~~ ✅ completado 18/05/2026 — commit 947fb14 — auth.js reescrito, 6 funciones raices.js migradas
4. **Auditoría de estado real del proyecto** — ejecutar `PROMPT_AUDITORIA_ESTADO.md` para verificar que la documentación refleja la realidad del código antes de continuar

### MVP en curso
4. ~~Agregar padre/madre al menú contextual del árbol~~ ✅ resuelto en commit 990c720
5. ~~EventosFamiliares — implementar sección funcional~~ ✅ completado 17/05/2026 — commit 0a53c15
6. ~~MiembrosSitio — implementar con datos reales y filtros~~ ✅ completado 17/05/2026 — commit 4179ffd
7. ~~Estadísticas — implementar con gráficos reales~~ ✅ completado 17/05/2026 — commit 4179ffd
8. ~~Importación/exportación multi-formato~~ ✅ completado 17/05/2026 — commit f79be95 — GEDCOM, CSV, Excel, JSON
9. ~~Mejoras importación/exportación~~ ✅ completado 17/05/2026 — commit 186cc3b — plantilla descargable CSV/Excel + mapper siempre visible con badges de estado
10. ~~Importador GEDCOM tolerante a errores~~ ✅ completado 17/05/2026 — migración 006 + GedcomSection.jsx reescrito — pipeline 6 capas, 3 categorías de registros, catálogo multimedia
11. ~~**Aplicar migración 006 en Supabase**~~ ✅ completado 17/05/2026 — `gedcom_raw` + `gedcom_warnings` confirmadas en `personas_arbol`
12. ~~Reorganizar menú de la landing con nueva estructura del PRD~~ ✅ completado 19/05/2026 — commit f87dd28 — 8 secciones, dropdowns, breakpoint 1100px
13. ~~Panel de administración general~~ ✅ completado 19/05/2026 — commit dadbf87 — migración 008, AdminPanel.jsx 4 tabs, admin API, NavBar condicional
14. ~~**Ejecutar migración 008 en Supabase**~~ ✅ completado 19/05/2026 — roles, RLS, es_admin_general function

**Motor genealógico — estado actual (21/05/2026):**
- ~~Motor manual~~ → ~~Cytoscape.js + dagre~~ → ~~family-chart~~ → **Motor bipartito custom (`genealogyLayout.js`)** ✅
- Diamantes ◆ como nodos de unión entre parejas
- Internalizado en el repo — sin dependencias externas
- Ver SPEC.md sección "Sesión 21/05/2026 — motor bipartito" para detalles

**Pendientes árbol — completados en sesión 21/05/2026:**
- ~~Posicionamiento de múltiples parejas~~ ✅ commit 7e02f5e — exes izquierda, actual derecha, persona central
- ~~Nodo placeholder "Posible hijo/a"~~ ✅ commit 3e7facd
- ~~Lógica de renderizado por consanguinidad (BFS ponderado)~~ ✅ commit 89f300f — costos desde arbol_config
- ~~Migración 009 — tabla arbol_config~~ ✅ aplicada — 12 filas, RLS activo
- ~~Migración 010 — feature flags~~ ✅ aplicada — features, plan_features, usuario_features, suscripciones como relación usuario↔plan
- ~~Multi-árbol~~ ✅ commit d629e75 — obtenerMisSitios, sitio activo en localStorage, cambiarSitio
- ~~PortalHeader funcional~~ ✅ commit deb6abe — dropdown árbol, dropdown usuario, iconos funcionales
- ~~Modal crear sitio~~ ✅ commit fa4d196
- ~~InicioHome plan con feature flags~~ ✅ commit 836ff7f
- ~~Doble barra de herramientas~~ ✅ commit 9876498 — ArbolToolbar completo
- ~~Panel ⚙ configuración~~ ✅ commit 6f6440d — lee/escribe arbol_config por permisos
- ~~Selector de rama materna/paterna/ambas~~ ✅ incorporado en ArbolToolbar
- ~~Aprobación centering focal, gender bar, anillo focal~~ ✅ aprobados y activos

**Sistema de permisos — feature flags (22/05/2026):**
- La relación usuario↔plan vive en la tabla `suscripciones` (usuario_id, plan_id, estado)
- Mientras no se implemente pagos (segunda etapa), los usuarios no tienen suscripciones activas
- Los permisos efectivos se leen desde la vista `usuario_permisos` (plan + overrides de `usuario_features`)
- El admin_general tiene overrides ilimitados en `usuario_features` — se aplican automáticamente al asignar el rol desde AdminPanel
- API: `frontend/src/api/permisos.js` — `tieneAcceso(featureKey)`, `obtenerLimite(featureKey)`, `obtenerMisPermisos()`
- Para agregar un servicio nuevo: insertar filas en `features` y `plan_features` — sin tocar código
Ningún valor configurable (costos BFS, generaciones default, días alerta, rama default, umbrales de render) puede estar hardcodeado en el código. Todo va en la tabla `arbol_config`. El panel ⚙ es la UI para leer y escribir esa tabla según permisos.

### MVP — árbol genealógico (bugs y mejoras pendientes — sesión 20/05/2026)

**Bugs críticos a resolver antes de continuar:**

- ~~**Pan se corta al salir del canvas**~~ ✅ resuelto — commit dafeafb (closure-based listeners)
- ~~**Nodos faltantes en layout (múltiples matrimonios)**~~ ✅ resuelto — commit 3b7724a (childCouples + orphan pass)
- **Eliminar persona no funciona** — el botón existe en ModalPersona pero el flujo onDeletePersona está cortado en algún punto de la cadena (ModalPersona → MiArbol → ArbolGenealogico/index → Origenes/index)
- **Nodos huérfanos sin vínculo visible** — personas como ex-parejas aparecen en el canvas sin ninguna línea de conexión (el orphan pass las ubica pero sin edge)
- **Padres no visibles ni editables desde el modal** — ModalPersona no muestra ni permite editar las relaciones de parentesco existentes (padre, madre, hermanos)

**Mejoras a implementar en esta etapa:**

- **Visualización de múltiples matrimonios** — al estilo MyHeritage: cada unión con su propio conector horizontal, hijos de cada unión claramente debajo de la pareja que los tuvo, persona compartida (quien se casó dos veces) conectada a ambas uniones sin duplicarse
- **Editor de vínculos** — desde el modal de una persona: ver todas sus relaciones existentes, editar el tipo (ej: casado → divorciado, padre → padrastro), eliminar un vínculo, agregar vínculo a persona ya existente en el árbol
- **Filtro mostrar/ocultar personas no consanguíneas** — toggle en la barra del árbol para ocultar cónyuges/parejas/ex del canvas sin eliminarlos de la BD ni de ningún otro módulo
- **Padres y hermanos visibles y editables desde el modal** — sección en ModalPersona que muestre padre, madre y hermanos con opción de editar o desvincular

### Bugs resueltos — sesión 22/05/2026

1. ~~**Fecha de nacimiento no se guarda**~~ ✅ resuelto commit `05658fe`
2. ~~**Contador de fotos muestra 24 incorrecto**~~ ✅ resuelto commit `c9cb22b`
3. ~~**Flujo post-login va al árbol**~~ ✅ resuelto commit `0f9b555` — nuevo Portal/index.jsx

### Decisiones de producto — sesión 22/05/2026

**Planes:**
- Plan Gratuito: 25 personas (corregido en BD)
- Los límites de planes son modificables desde el panel admin general — nunca hardcodeados
- El admin general puede crear planes, modificar parámetros y dar de baja planes con migración de usuarios

**Vinculación entre árboles (segunda etapa):**
- Opción B adoptada: árboles independientes con personas compartidas
- Una persona vive en su árbol natural y aparece como referencia (🔗) en otros árboles
- Mecanismo: al agregar pareja/familiar, opción "buscar en otros árboles" además de "crear nuevo"
- Descendencia compartida: hijos de personas de dos árboles distintos pertenecen a ambos árboles
- Edición solo desde el árbol natural — desde referencias se avisa que los cambios afectan a ambos
- Prerequisito: Smart Matching (tercera etapa) para matching automático; en segunda etapa es manual
**Migración técnica conjunta primero:** React+Vite → Next.js | JavaScript → TypeScript | Express → NestJS | CSS-in-JS → TailwindCSS

Prioridades de la segunda etapa (en orden):
1. Migración técnica conjunta del stack
2. **Perfil extendido de persona** — emigración como evento destacado (barco, puerto, fecha, destino), bautismo + padrinos + madrinas, servicio militar, múltiples ocupaciones con período, educación con institución y título ← *decisión del análisis MyHeritage 20/05/2026*
3. **Galería de fotos** — adjunta al perfil de persona y al sitio familiar, con etiquetado y privacidad por foto ← *decisión del análisis MyHeritage 20/05/2026*
4. **Campos territoriales gallegos** — parroquia + aldea + concello con dropdown desde seed IGE (~3.800 parroquias) ← *decisión del análisis MyHeritage 20/05/2026*
5. **Consistency Checker** — verificación lógica post-importación y bajo demanda ← *decisión del análisis MyHeritage 20/05/2026*
6. **Fan View** — vista de abanico con identidad visual de GM ← *decisión del análisis MyHeritage 20/05/2026*
7. Micrositios de asociaciones (construidos en Next.js)
8. Activar backend NestJS para pagos y emails
9. Sistema de notificaciones — punto de extensión marcado en `EventosFamiliares.jsx`
10. Migrar i18n a tabla `traducciones` en Supabase
11. FamilySearch OAuth ← ⚠️ requiere registro previo como desarrollador

### Acciones externas (equipo — no Claude Code)
- Registrarse como desarrollador en FamilySearch ⚠️ URGENTE
- Agregar co-owner a GitHub, Vercel y Supabase
- Contratar asesoría legal antes del lanzamiento público
- Designar admin general secundario

---

## Lecciones aprendidas / Problemas conocidos

### 1. Variables de entorno en Windows/PowerShell → encoding artifacts

**Problema:** Error `"String contains non ISO-8859-1 code point"` en producción. Causa: caracteres invisibles (BOM, CRLF, Zero-Width Space) agregados por PowerShell.

**Solución aplicada:**
1. `frontend/src/lib/supabase.js` aplica `clean()`: `(s) => (s ?? '').replace(/[^\x20-\x7E]/g, '').trim()`
2. Al ingresar variables en Vercel usar Python:
   ```bash
   python3 -c "import sys; sys.stdout.buffer.write(b'VALOR_AQUI')" | vercel env add NOMBRE_VAR production
   ```

### 2. FK violation en sitios_familiares → usuarios no existe en public.usuarios

**Problema:** `"violates foreign key constraint 'sitios_familiares_propietario_id_fkey'"`. Causa: Supabase Auth crea el usuario en `auth.users` pero no en `public.usuarios`.

**Solución aplicada (tres capas):**
1. `auth.js`: función `ensureUsuarioRecord(authUser)` — upsert idempotente en `public.usuarios`
2. `raices.js`: `crearSitio()` llama a `ensureUsuarioRecord(user)` antes del INSERT
3. Migración 003: trigger `AFTER INSERT ON auth.users`

**Regla derivada:** Siempre llamar `ensureUsuarioRecord()` antes de cualquier operación que referencie `usuarios.id` vía FK.

### 3. Relaciones en personas_arbol → columnas eliminadas en migración 004

**Columnas eliminadas:** `padre_id`, `madre_id`, `conyugue_id`
**Reemplazadas por:** tabla `relaciones_persona`
**Acción requerida:** actualizar todo el código que referenciaba esas columnas

### 4. Manejo de errores inconsistente en código anterior a v2.1

El código escrito antes del 14/05/2026 no aplica el estándar de manejo de errores definido en este documento. Se corrige incrementalmente — cada vez que se toque un archivo existente, aplicar el estándar en las funciones modificadas.

---

## Roadmap técnico resumido

```
MVP (ahora):
  React + Vite + JavaScript + CSS-in-JS + Supabase directo

Segunda etapa (migración conjunta antes de micrositios):
  Next.js + TypeScript + TailwindCSS + NestJS + Supabase

Tercera etapa:
  + React Native (app móvil)
  + Neo4j (redes migratorias)
  + Python + FastAPI (IA: OCR, NLP, matching)

Cuarta etapa:
  + API de contenido territorial propio
  + Integración institucional completa
```

---

*Documento actualizado el 20 de mayo de 2026. Versión 2.4*
*Cambios v2.1: política de manejo de errores integrada como estándar obligatorio, auditoría de código existente agregada a pendientes como ítem #3, lección aprendida #4 sobre deuda técnica de errores.*
*Cambios v2.2: importador GEDCOM tolerante completado (sesión 6) — migración 006, GedcomSection.jsx reescrito, catalogarArchivo en raices.js, gedcom_raw/gedcom_warnings en schema.*
*Cambios v2.3: reorganización de carpetas frontend (sesión 8) — components/common/, PortalHeader, Admin/, ArbolGenealogico/ assets, styles/portal.js. i18n CMS agregado a pendientes de segunda etapa. Estructura del proyecto actualizada.*
*Cambios v2.4: sesión 9 — análisis MyHeritage. Documentos del proyecto actualizados para incluir myheritage.md y LEGAJO_FUTURO.md. Pendientes de segunda etapa enriquecidos con decisiones del análisis: perfil extendido, campos territoriales gallegos, Consistency Checker, Fan View. Historial de sesiones y hitos actualizados.*
*Leer PRD.md v2.2, SPEC.md v2.0, myheritage.md y LEGAJO_FUTURO.md para contexto completo del proyecto.*

### 5. Backup de migración en JSON en lugar de SQL — migración 004

**Problema:** el backup previo a la migración 004 quedó como `backup_pre_004_2026-05-14T14-50-44.json` en lugar de un `.sql` ejecutable. Claude Code usó la API de Supabase para exportar la estructura. Un JSON no es suficiente para restauración de emergencia — no contiene datos ni DDL ejecutable.

**Regla derivada:** en futuras migraciones el backup debe ser un `.sql` generado con `pg_dump`. Si `pg_dump` no está disponible, hacer backup manual desde el panel de Supabase (Database → Backups → Download) antes de proceder. Verificar que el archivo no esté vacío y sea un `.sql` válido.

---

## Seguimiento del proyecto — uso interno del equipo

### Hitos completados

| Fecha | Hito | Commit | Archivos |
|---|---|---|---|
| 10/05/2026 | Setup inicial — Landing, Auth, schema base | — | frontend, database/schema.sql |
| 11/05/2026 | Árbol genealógico visual SVG + CRUD personas | — | Origenes/, api/ |
| 12/05/2026 | Refactor componentes árbol + props delegados | — | MiArbol.jsx, AdminArboles.jsx |
| 13/05/2026 | Migración a Supabase Auth SDK — auth completo | — | auth.js, raices.js, App.jsx, migraciones 001-003 |
| 14/05/2026 | Análisis de arquitectura — sesión estratégica completa | — | PRD v2.0, SPEC v2.0, CLAUDE v2.1 |
| 14/05/2026 | Migración 004 — schema expansion (37 tablas) | de917b7 | schema.sql, 18 tablas nuevas |
| 14/05/2026 | Árbol visual migrado a relaciones_persona | 990c720 | 6 archivos |
| 17/05/2026 | EventosFamiliares funcional — auto + manuales | 0a53c15 | 3 archivos + migración 005 |
| 17/05/2026 | Importación/exportación multi-formato | f79be95 | 3 archivos — GEDCOM, CSV, Excel, JSON |
| 17/05/2026 | Mejoras importación CSV/Excel | 186cc3b | GedcomSection.jsx — plantilla + mapper |
| 17/05/2026 | Fix GEDCOM: HTML en notas MyHeritage | 12f8a23 | GedcomSection.jsx — preprocesador + fallback manual |
| 17/05/2026 | MiembrosSitio + EstadisticasFamiliares | 4179ffd | 3 archivos |
| 17/05/2026 | Fix GEDCOM: nombres // + relaciones + logs | a2c04c1 | GedcomSection.jsx |
| 17/05/2026 | Fix post-importación: nombres, placeholders, guardar, nodos | caa9a52 | 5 archivos |
| 17/05/2026 | Reescritura árbol visual — zoom, pan, fragmento, dos modos | ec7a9f6 | 4 archivos |
| 17/05/2026 | Fix árbol + sin_raices + modal familia + logos | b833c46 | 8 archivos + migración 007 |
| 18/05/2026 | Correcciones post-auditoría — schema, constants, auth, raices, árbol | 947fb14 | 12 archivos |
| 18/05/2026 | Mejoras visuales árbol v3 — conexiones, cross-links, nupcias, fallecidos, eventos, slider | 1a76bca | MiArbol.jsx |
| 18/05/2026 | Fix definitivo algoritmo árbol + edición de relaciones | 1ec34a1 | 3 archivos |
| 17/05/2026 | Importador GEDCOM tolerante — pipeline 6 capas | 94860f4 + 2fa6a9c | GedcomSection.jsx, raices.js, schema.sql, migración 006 |
| 19/05/2026 | Menú landing reestructurado + panel admin general completo | f87dd28 + dadbf87 | Navbar.jsx, landing.js, styles.js, migración 008, admin.js, AdminPanel.jsx |
| 19/05/2026 | Reorganización de carpetas frontend — arquitectura de componentes | pendiente | components/common/, components/layout/, pages/Admin/, ArbolGenealogico/ assets, styles/portal.js |
| 20/05/2026 | Debug árbol: pan fix + nodos faltantes + análisis renderizado selectivo | dafeafb + 3b7724a | MiArbol.jsx — closure pan, childCouples ownership, orphan pass |
| 22/05/2026 | Feature flags + multi-árbol + PortalHeader funcional + modal crear sitio | d68e57d, f7d66a5, 48edf38, d629e75, deb6abe, fa4d196, 836ff7f | 010_feature_flags.sql, permisos.js, raices.js, Origenes/index.jsx, PortalHeader.jsx, ModalCrearSitio.jsx, InicioHome.jsx |

### Sesiones de desarrollo

| Sesión | Fecha | Duración estimada | Tareas completadas |
|---|---|---|---|
| 1 | 10/05/2026 | ~3hs | Setup, Landing, Auth, schema base |
| 2 | 11/05/2026 | ~4hs | Árbol genealógico, CRUD, refactor |
| 3 | 13/05/2026 | ~3hs | Supabase Auth SDK, migraciones 001-003 |
| 4 | 14/05/2026 | ~6hs | Análisis estratégico, migraciones 004, árbol visual |
| 5 | 17/05/2026 | ~2hs | EventosFamiliares, migración 005 |
| 6 | 17/05/2026 | ~4hs | Importador GEDCOM tolerante — migración 006, pipeline 6 capas, multimedia, borradores/cuarentena |
| 7 | 19/05/2026 | ~3hs | Menú landing reestructurado + panel admin completo — migración 008, AdminPanel.jsx, admin.js, NavBar |
| 8 | 19/05/2026 | ~2hs | Reorganización de carpetas — components/common/, PortalHeader, Admin/, ArbolGenealogico/ assets, styles/portal.js, revisión arquitectónica |
| 13 | 21/05/2026 | ~4hs | Motor bipartito, BFS ponderado, arbol_config, multi-parejas, placeholder, toolbar completa, panel config |

### Costos acumulados (referencia)

| Servicio | Plan | Costo mensual | Estado |
|---|---|---|---|
| Supabase | Free tier | $0 | ✅ Activo |
| Vercel | Hobby | $0 | ✅ Activo |
| GitHub | Free | $0 | ✅ Activo |
| Claude (desarrollo) | Pro | A registrar | ✅ En uso |
| Dominio | — | A registrar | ⏳ Pendiente |

> Los costos de Claude se registran manualmente por el equipo. Agregar aquí cuando se contrate un plan específico para el proyecto.

### Próximos hitos estimados

| Hito | Tareas incluidas | Estimación |
|---|---|---|
| MVP funcional completo | ~~MiembrosSitio~~ ✅, ~~Estadísticas~~ ✅, ~~GEDCOM~~ ✅, ~~menú landing~~ ✅, ~~panel admin~~ ✅ — **MVP COMPLETO** | ✅ |
| Segunda etapa — inicio | Migración Next.js + TypeScript + NestJS + TailwindCSS | ~3-4 sesiones |
| Segunda etapa — árbol extendido | Perfil extendido, campos territoriales gallegos, Consistency Checker, Fan View | ~3-4 sesiones |
| Micrositios | Construcción en Next.js | ~4-5 sesiones |
| Backend activo | Pagos, emails, FamilySearch | ~3-4 sesiones |


---

## Regla de diseño — Menús desplegables en todo campo posible

En todo campo donde las respuestas sean predecibles y acotadas, usar dropdown/select — nunca texto libre. Esto garantiza consistencia en estadísticas, búsquedas y matching.

Aplica a: tipo de relación de pareja, género, estado civil, tipo de documento, ocupación, religión, causa de fallecimiento, locaciones (escalonadas via API territorial), y cualquier otro campo con valores estándar finitos.

**Regla:** si el campo puede tener un conjunto finito de valores estándar → dropdown. Si el valor es verdaderamente libre (nombre, biografía, notas) → texto libre.

Esta regla aplica a todo código nuevo desde ahora. El código existente se corrige incrementalmente cuando se toque cada módulo.

---

## Motor genealógico — principios arquitectónicos

El árbol genealógico es un DAG (grafo dirigido acíclico) con ciclos potenciales — NO un árbol binario clásico. El motor debe tolerar y representar correctamente:

- Múltiples matrimonios (N parejas sin límite)
- Endogamia y relaciones cruzadas (ciclos en el grafo)
- Adopciones
- Hubs familiares
- Genealogías no lineales
- Personas en múltiples ramas

**Stack del motor (MIGRACIÓN EN CURSO — 21/05/2026):**
- ~~Motor manual (`computeLayout`, `childCouples`, `layoutCouple`)~~ → **REEMPLAZADO**
- **Motor bipartito custom (`genealogyLayout.js`)** — motor de layout propio, sin dependencias externas. Internalizado en `frontend/src/pages/Origenes/ArbolGenealogico/genealogyLayout.js`. Exporta `computeLayoutGenealogy`.
- **React HTML** — renderizado de nodos (PersonNode) — sin cambios
- **SVG overlay** — renderizado de conectores — sin cambios

**Modelo de datos del motor:**
- Nodo persona: `{ id: 'p_{id}', tipo: 'persona' }`
- Nodo familia: `{ id: 'f_{key}', tipo: 'familia' }` — uno por unión/matrimonio
- Edge cónyuge: persona → nodo familia
- Edge hijo: nodo familia → persona hijo
- Este patrón resuelve estructuralmente: múltiples parejas, hermanos con subárboles propios, personas en múltiples ramas

**Preparado para:**
- Web Workers (computeLayout en thread separado)
- Virtualización (solo nodos visibles en viewport)
- Canvas/WebGL (renderer alternativo para árboles masivos)

**Nunca:** límites artificiales de parejas, pérdida de nodos, desaparición de personas, hacks temporales.

---

### Regla absoluta — commits requieren aprobación explícita

**NUNCA hacer commit ni push sin aprobación explícita del usuario.**

El flujo correcto es:
1. Analizar el problema y mostrar el diagnóstico
2. Proponer la solución con el código exacto que se va a cambiar
3. **Esperar confirmación** antes de tocar cualquier archivo
4. Solo después de "sí, hacelo" → implementar y commitear

Si el prompt dice "mostrá el análisis antes de tocar código" → no tocar código hasta recibir aprobación explícita. Sin excepciones.

**Esto incluye:**
- Console.log de debug → requieren aprobación
- Cambios "menores" de una línea → requieren aprobación
- Revertes → requieren aprobación
- Migraciones → requieren aprobación

**Por qué:** cada commit sin aprobación rompe la trazabilidad, puede introducir regresiones y hace imposible saber qué cambió y por qué.

**NUNCA modificar sin consulta explícita al usuario:**
- Elementos visuales del árbol: colores, iconos, indicadores, badges, estilos de nodo, formas
- Valores default de cualquier control (sliders, toggles, selectores)
- Comportamiento documentado en commits anteriores o en SPEC.md
- Cualquier decisión marcada como "deliberada" o "acordada" en el historial

**Si SPEC.md documenta un elemento visual → es intocable sin aprobación explícita.**

**Si se quiere proponer una mejora visual:**
1. Documentarla como sugerencia en el informe de sesión
2. Esperar confirmación del usuario antes de implementar
3. Nunca implementar y "ver si le gusta" — eso no es consultar

**Ejemplos de violaciones (sesión 12 — 21/05/2026):**
- ❌ Cambió generaciones default de 5 → 3 sin consultar (revertido)
- ❌ Cambió triángulo fallecido → badge † sin consultar (revertido)
- ⚠️ Agregó centering focal, gender bar lateral y anillo focal sin que se pidieran (pendiente aprobación del usuario)
