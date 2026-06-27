# CLAUDE.md — REGLAS INFLEXIBLES DE DESARROLLO (Galicia Migrante)
### LEER ANTES DE CUALQUIER ACCIÓN O MODIFICACIÓN DE CÓDIGO

Este archivo define las directrices y estándares obligatorios de desarrollo para el ecosistema Galicia Migrante. Cualquier agente o programador trabajando en este repositorio debe respetar estas reglas de forma estricta y sin excepciones.

---

## 📚 PROTOCOLO DE INICIO DE SESIÓN (OBLIGATORIO)

**Al comenzar CUALQUIER sesión de trabajo, antes de responder al usuario o tocar cualquier archivo:**

1. Leer `docs/ESTADO_PROYECTO.md` — estado actual, qué está pendiente de prueba, tareas en curso.
2. Leer `docs/PRD.md` — requerimientos del producto y visión general.
3. Leer `docs/manual-de-marca.md` — identidad visual, colores oficiales, tipografía, tono.
4. Leer `docs/LEGAJO_FUTURO_legacy.md` — contexto histórico y decisiones de arquitectura pasadas.
5. Consultar la memoria del proyecto en `~/.claude/projects/*/memory/MEMORY.md`.

**Al finalizar cada sesión:**
- Actualizar `docs/ESTADO_PROYECTO.md` con el estado real: qué se hizo, qué quedó pendiente, qué falta probar.
- Hacer commit y push del archivo actualizado.

---

## 🚨 PRINCIPIO RECTOR ABSOLUTO

**CERO PARCHES. CERO IMPROVISACIONES. SOLUCIONES DEFINITIVAS DESDE EL INICIO.**
No se permite código temporal, "soluciones rápidas" o "dejar para limpiar después". El camino corto a base de remiendos siempre termina siendo el más largo. Si no puedes realizar una implementación limpia, robusta y con calidad de código de elite, detente y pide aclaraciones.

---

## 📁 ESTRUCTURA Y ORGANIZACIÓN DE ARCHIVOS (INFLEXIBLE)

El portal está estructurado como una única aplicación unificada de Next.js. Se prohíbe introducir arquitecturas mixtas o workspaces independientes.

### 1. El directorio de rutas `app/` es sagrado
* El directorio `app/` y sus subcarpetas de rutas (ej. `app/arbol/`, `app/blog/`) deben contener **únicamente** archivos de enrutamiento nativos de Next.js:
  - `page.js` / `page.jsx`
  - `layout.js` / `layout.jsx`
  - `loading.js` / `error.js` / `route.js`
* **Prohibido:** No colocar archivos CSS sueltos, componentes React (`.jsx` o `.js`) o archivos de lógica de negocio directamente dentro de las carpetas de ruta en `app/`.

### 2. Encapsulación y Módulos Autocontenidos
* Cada módulo (ej. Árbol Genealógico, Blog) debe ser autocontenido:
  - **Componentes y Estilos:** Todos los componentes exclusivos del módulo y sus correspondientes hojas de estilo (sean `.css` o `.module.css`) deben vivir dentro de la subcarpeta `components/` interna del módulo (ej. [app/arbol/components/](file:///f:/proyectos/Portal%20Galicia%20Migrante/app/arbol/components/)).
  - **Lógica e Integración:** Los servicios de API y lógica específicos del módulo deben colocarse en una subcarpeta local o en [lib/](file:///f:/proyectos/Portal%20Galicia%20Migrante/lib/) bajo el espacio de nombres del módulo (ej. `lib/arbol/`).
* **Componentes Globales:** Solo los componentes genuinamente compartidos por todo el ecosistema (como `Navbar.js` o `Footer.js`) residen en la carpeta raíz `components/`.

---

## 🛠️ FLUJO DE TRABAJO Y PLANIFICACIÓN

Antes de escribir una sola línea de código:
1. **Entender el problema:** Analizar exhaustivamente los requerimientos y el estado del código actual.
2. **Planificar la solución definitiva:** Formular un plan de implementación estructurado y completo en el archivo de planificación correspondiente.
3. **Validación:** Asegurar que el plan de cambios propuesto respeta las guías visuales, técnicas y de estructuración del portal.
4. **Ejecución de elite:** Escribir código limpio, modular, documentado y preparado para futuras migraciones (como la transición a TypeScript).
5. **Compilación obligatoria:** Ejecutar `npm run build` localmente y verificar que compila exitosamente antes de realizar cualquier commit.

---

## 💾 CONTROL DE VERSIONES (GIT)

* **Commits automáticos y descriptivos:** Realizar commit y push inmediatamente tras finalizar una tarea o bloque funcional verificado.
* **Mensajes claros:** Escribir los mensajes de commit en inglés utilizando la convención estándar `tipo: descripción` (ej: `refactor: move arbol css files to nested components dir`).
* **Hojas de estilo:** Nunca modificar clases, colores o valores visuales establecidos en `app/globals.css` sin consentimiento o planificación previa.
