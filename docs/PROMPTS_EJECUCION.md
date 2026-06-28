# GALICIA MIGRANTE — PROMPTS DE EJECUCIÓN
### Instrucciones operativas secuenciales para implementar el plan de acción
**Versión:** 1.0 — 28 de junio de 2026
**Documento padre:** `docs/PLAN_DE_ACCION.md`
**Uso:** Cada prompt es una sesión de Claude Code independiente. Se ejecutan en orden estricto. No se pasa al siguiente hasta completar y verificar el actual.

---

## INSTRUCCIÓN GLOBAL (aplica a TODOS los prompts)

Antes de ejecutar cualquier prompt, el agente debe:
1. Leer **todos** los archivos en la raíz del proyecto (CLAUDE.md, package.json, next.config.mjs, etc.)
2. Leer **todos** los archivos en `docs/` sin excepción
3. Leer `no pushear/Claves y contraseñas.txt` para credenciales
4. Solo entonces comenzar a trabajar

El agente trabaja de forma completamente autónoma. No pide permiso para usar PowerShell, terminal, ni ninguna herramienta. No espera confirmación para ejecutar comandos. Ejecuta, verifica, corrige, vuelve a verificar, y solo cuando todo está limpio y probado, declara la tarea completa.

---

## P-00 — CIERRE DE DEUDA TÉCNICA

```
Eres un ingeniero de QA senior especializado en aplicaciones Next.js con Supabase. Tu trabajo 
es cerrar toda la deuda técnica pendiente antes de que el equipo avance al siguiente sprint.

PASO 1 — LECTURA OBLIGATORIA (no saltear bajo ninguna circunstancia):
Lee uno por uno, en este orden:
- Todos los archivos en la raíz del proyecto: CLAUDE.md, package.json, next.config.mjs, 
  .env.local (si existe), y cualquier otro archivo en la raíz.
- Todos los archivos en docs/ sin excepción: ESTADO_PROYECTO.md, PRD.md, VISION.md, 
  PLAN_DE_ACCION.md, manual-de-marca.md, LEGAJO_FUTURO_legacy.md, MANUAL_BLOG.md, 
  y cualquier otro que encuentres.
- no pushear/Claves y contraseñas.txt — contiene las credenciales de Supabase y usuarios de prueba.
Solo cuando hayas leído todo, comienza con el Paso 2.

PASO 2 — ARRANCAR EL SERVIDOR DE DESARROLLO:
Inicia el servidor Next.js en background con:
  Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'F:\proyectos\Portal Galicia Migrante'; npm run dev" -WindowStyle Minimized
Espera 10 segundos y verifica que http://localhost:3000 responde.

PASO 3 — TAREA A: VERIFICAR Y REPARAR EL BOTÓN "TRADUCIR TODO"

3.1 Leer el archivo app/api/blog/[id]/translate-all/route.js completo.
3.2 Leer el archivo app/admin/blog/[slug]/traducciones/components/TranslationEditor.js completo.
3.3 Leer el archivo app/admin/components/admin.module.css y buscar las clases .translateAllBar y .btnTranslateAll.
3.4 Leer lib/translate.js para entender cómo funciona translatePost().
3.5 Ir a Supabase (URL y service role key en no pushear/Claves y contraseñas.txt) y ejecutar esta query para encontrar los posts SIN traducciones:
    SELECT p.id, p.slug, p.titulo 
    FROM blog_posts p
    LEFT JOIN blog_post_translations t ON t.post_id = p.id
    WHERE p.estado = 'publicado' AND t.id IS NULL
    GROUP BY p.id;
3.6 Para CADA post sin traducciones, hacer un POST a http://localhost:3000/api/blog/[id]/translate-all
    con el header Authorization usando la sesión de administrador (credenciales en no pushear/).
    Si el endpoint no acepta llamadas sin sesión activa de Supabase, obtener el JWT del admin
    logueándose primero a http://localhost:3000/auth y luego usar ese token.
3.7 Verificar en Supabase que la tabla blog_post_translations tiene filas para cada post y cada idioma (gl, en, fr, de, it).
3.8 Si algo falla en el endpoint: leer el error, identificar la causa raíz, corregir el código, 
    reiniciar el servidor, y repetir desde 3.6.
3.9 Si todo funciona: navegar a /admin/blog en el browser (o vía fetch), elegir un post que 
    tuviera traducciones pendientes, ir a /traducciones, y verificar visualmente que:
    - El botón "🌐 Traducir todo (5 idiomas)" aparece en la parte superior
    - Al hacer clic, el botón muestra el estado de carga
    - Al terminar, los 5 tabs de idioma muestran el contenido traducido
    Si algo de esto no funciona, corregir el código hasta que funcione.

PASO 4 — TAREA B: VERIFICAR EL TOGGLE DE CONTRASEÑA

4.1 Leer app/auth/page.js completo.
4.2 Leer app/auth/auth.module.css completo.
4.3 Abrir http://localhost:3000/auth y verificar visualmente:
    - En el campo "Contraseña" de login: aparece un ícono ojo (👁️ o similar) a la derecha.
    - Hacer clic en el ícono cambia el input de type="password" a type="text" y viceversa.
    - En el campo "Confirmar contraseña" del registro: mismo comportamiento.
    - Los íconos están bien posicionados (dentro del input, no fuera).
    - En mobile (viewport 375px): los íconos no se superponen con el texto.
4.4 Si algo no funciona visualmente: revisar los estilos .passwordWrapper y .togglePassword 
    en auth.module.css. Corregir hasta que los toggles funcionen perfectamente en desktop y mobile.
4.5 Verificar que el formulario de login sigue funcionando después del cambio (login real con 
    usuario.prueba@galiciamigrante.com / PruebaBlog2026!).

PASO 5 — TAREA C: POSTS INAUGURALES

5.1 Consultar Supabase: SELECT id, slug, titulo, estado FROM blog_posts ORDER BY created_at;
5.2 Si hay posts con estado 'provisorio': actualizarlos a 'en_revision' con:
    UPDATE blog_posts SET estado = 'en_revision' WHERE estado = 'provisorio';
5.3 Ir a http://localhost:3000/admin/blog como administrador.
5.4 En la cola de moderación, aprobar todos los posts que estén 'en_revision'.
5.5 Verificar que los posts aprobados aparecen en http://localhost:3000/blog.
5.6 Verificar que cada post publicado tiene traducciones en los 5 idiomas. Si no las tiene, 
    aplicar el flujo de "Traducir todo" de la Tarea A.
5.7 Verificar que el selector de idioma en el blog funciona para cada post aprobado.

PASO 6 — TAREA D: BUILD LIMPIO

6.1 Detener el servidor de dev.
6.2 Ejecutar: npm run build
6.3 Leer el output completo. Si hay errores o warnings de TypeScript/ESLint que rompan el build:
    - Identificar el archivo y línea exacta.
    - Corregir el problema (no suprimir con comentarios // eslint-disable).
    - Volver a ejecutar npm run build.
    - Repetir hasta que el build sea exitoso y limpio.
6.4 Cuando el build sea limpio, ejecutar npm run start para verificar que el build de producción 
    arranca sin errores.

PASO 7 — REVISIÓN FINAL Y BÚSQUEDA DE BUGS

7.1 Vuelve a arrancar el servidor dev: npm run dev
7.2 Recorre CADA una de estas URLs y verifica que cargan sin error:
    - http://localhost:3000 (landing)
    - http://localhost:3000/blog
    - http://localhost:3000/blog/[slug de cada post publicado]
    - http://localhost:3000/auth
    - http://localhost:3000/arbol (con login)
    - http://localhost:3000/admin/blog (con login admin)
    - http://localhost:3000/admin/blog/[slug]/traducciones (con login admin)
7.3 Para cada URL: abrir la consola del browser (o hacer fetch desde Node.js) y verificar que 
    no hay errores de JavaScript en consola, errores 404, ni errores de red.
7.4 Si encuentras cualquier bug: corregirlo antes de continuar.
7.5 Repetir la ronda de verificación completa después de cada corrección hasta pasar sin 
    ningún error en ninguna URL.

PASO 8 — COMMIT Y CIERRE

8.1 Ejecutar: npm run build — debe ser exitoso.
8.2 git add -p para revisar exactamente qué cambió.
8.3 git commit -m "fix(qa): close phase-0 technical debt — translate-all verified, password toggle verified, inaugural posts published, build clean"
8.4 git push
8.5 Actualizar docs/ESTADO_PROYECTO.md: marcar Fase 0 como COMPLETA con la fecha de hoy.
8.6 git add docs/ESTADO_PROYECTO.md && git commit -m "docs: mark phase-0 complete" && git push

CRITERIO DE COMPLETITUD:
- Build limpio sin errores ✅
- Botón "Traducir todo" funciona en browser para todos los posts ✅
- Toggle de contraseña funciona en ambos campos de /auth ✅
- Posts inaugurales publicados y visibles en /blog ✅
- Todas las URLs del paso 7.2 cargan sin errores de consola ✅

Solo cuando todos estos criterios estén verificados, la Fase 0 está completa.
Pasar al prompt P-01-A.
```

---

## P-01-A — MODO DÍA/NOCHE

```
Eres un ingeniero frontend senior especializado en sistemas de diseño, temas visuales y 
CSS avanzado para aplicaciones Next.js. Tu tarea es implementar el toggle de modo día/noche 
(light/dark) de forma definitiva, limpia y sin parches.

PASO 1 — LECTURA OBLIGATORIA:
Lee uno por uno, en este orden:
- Todos los archivos en la raíz: CLAUDE.md, package.json, next.config.mjs, y cualquier otro.
- Todos los archivos en docs/ sin excepción.
- no pushear/Claves y contraseñas.txt
- app/globals.css COMPLETO — este archivo es el corazón del sistema de diseño.
- components/Navbar.js COMPLETO
- app/layout.js COMPLETO
- Cualquier archivo CSS global que encuentres.
Solo cuando hayas leído todo, comienza con el Paso 2.

PASO 2 — AUDITORÍA DEL ESTADO ACTUAL

2.1 Leer app/globals.css y mapear TODOS los bloques @media (prefers-color-scheme: dark) 
    existentes. Listar cada variable CSS que cambia entre modo claro y oscuro.
2.2 Verificar si existe algún mecanismo de persistencia de tema actual (localStorage, cookie, 
    clase en <html>). Probablemente no existe todavía.
2.3 Leer el componente Navbar.js e identificar exactamente dónde agregar el toggle.
2.4 Verificar que app/layout.js usa el tag <html> con posibilidad de agregarle una clase.

PASO 3 — IMPLEMENTAR EL SISTEMA DE TEMAS

El sistema funciona así:
- Modo claro: clase ausente en <html> (o clase "light")
- Modo oscuro: clase "dark" en <html>
- Persistencia: localStorage con key "gm-theme"
- Inicialización: leer localStorage primero, fallback a prefers-color-scheme
- El toggle está en la Navbar, visible siempre

3.1 Crear components/ThemeProvider.js:
    - Client component ("use client")
    - Lee localStorage["gm-theme"] al montar. Si no existe, lee window.matchMedia("prefers-color-scheme: dark").
    - Aplica la clase correspondiente a document.documentElement (el tag <html>).
    - Expone un contexto React (ThemeContext) con { theme, toggleTheme }.
    - toggleTheme() alterna entre "light" y "dark", actualiza document.documentElement.className 
      y guarda en localStorage["gm-theme"].
    - Para evitar el flash de tema incorrecto (FOUC), inyectar un <script> inline en el <head> 
      que lea localStorage y aplique la clase ANTES de que React hidrate:
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var theme = localStorage.getItem('gm-theme');
            if (!theme) theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            document.documentElement.classList.add(theme);
          })();
        `}} />
      Este script va en app/layout.js dentro de <head>.

3.2 Envolver el contenido de app/layout.js con <ThemeProvider>.

3.3 En components/Navbar.js:
    - Importar useTheme() del ThemeContext.
    - Agregar un botón toggle al final de la navbar (antes del menú de auth).
    - El botón muestra ☀️ cuando está en modo oscuro (para cambiar a claro) y 🌙 cuando está 
      en modo claro (para cambiar a oscuro).
    - El botón tiene un aria-label descriptivo para accesibilidad.
    - Usar una clase CSS del módulo de Navbar para el botón — no estilos inline.

3.4 Reescribir los bloques dark de app/globals.css:
    - ELIMINAR todos los bloques @media (prefers-color-scheme: dark) { ... }
    - REEMPLAZAR cada uno por el equivalente usando selector .dark:
        /* ANTES */
        @media (prefers-color-scheme: dark) {
          :root { --color-bg: #0D1B2A; }
        }
        /* DESPUÉS */
        .dark {
          --color-bg: #0D1B2A;
        }
    - No eliminar NINGUNA variable del modo oscuro — solo cambiar el selector.
    - Hacer este reemplazo para CADA variable CSS que tenga variante oscura.
    - Verificar que no quedó ningún @media (prefers-color-scheme: dark) en todo el proyecto:
        grep -r "prefers-color-scheme" app/ components/ lib/

PASO 4 — VERIFICACIÓN VISUAL EXHAUSTIVA

Iniciar el servidor: npm run dev
Para CADA una de estas páginas, verificar en modo claro Y en modo oscuro:

4.1 http://localhost:3000 (landing page)
    - El fondo cambia correctamente entre claro y oscuro
    - El texto es legible en ambos modos
    - Los botones tienen el color correcto en ambos modos
    - El logo de la navbar es visible en ambos modos (si hay problema de contraste, anotarlo)

4.2 http://localhost:3000/blog
    - Cards del blog visibles y legibles en ambos modos

4.3 http://localhost:3000/blog/[slug de cualquier post]
    - El contenido Markdown renderiza bien en ambos modos

4.4 http://localhost:3000/auth
    - Formulario visible y legible en ambos modos
    - Los campos input tienen el color de fondo correcto en ambos modos

4.5 http://localhost:3000/arbol (requiere login)
    - El árbol genealógico es visible en ambos modos
    - Los nodos del grafo son legibles en ambos modos

4.6 http://localhost:3000/admin/blog (requiere login admin)
    - El panel de admin es legible en ambos modos

4.7 Verificar que al recargar la página, el tema persiste (no hay flash de tema incorrecto).
4.8 Verificar en mobile (viewport 375px): el toggle es accesible y visible en la navbar.

PASO 5 — CORRECCIÓN DE BUGS VISUALES

5.1 Para cada problema visual encontrado en el Paso 4:
    - Identificar la variable CSS que está fallando.
    - Agregar la variante .dark correcta en globals.css.
    - Verificar que el fix no rompe el modo claro.
5.2 Ejecutar la ronda de verificación completa del Paso 4 nuevamente.
5.3 Repetir hasta que TODOS los modos visuales sean correctos en TODAS las páginas.

PASO 6 — BUILD Y COMMIT

6.1 npm run build — debe ser exitoso y limpio.
6.2 Si hay errores: corregirlos y repetir.
6.3 git add -p — revisar exactamente qué cambió.
6.4 git commit -m "feat(ui): day/night theme toggle — ThemeProvider, localStorage persistence, FOUC prevention, dark selectors migrated from @media to .dark class"
6.5 git push
6.6 Actualizar docs/ESTADO_PROYECTO.md: marcar P-01-A como COMPLETA.
6.7 git add docs/ESTADO_PROYECTO.md && git commit -m "docs: mark P-01-A complete" && git push

CRITERIO DE COMPLETITUD:
- Toggle ☀️/🌙 visible en la navbar en todas las páginas ✅
- Al hacer clic, el tema cambia instantáneamente en toda la UI ✅
- Al recargar la página, el tema persiste (sin flash) ✅
- No hay @media (prefers-color-scheme: dark) en ningún archivo CSS ✅
- Todas las páginas son visualmente correctas en ambos modos ✅
- Build limpio ✅

Pasar al prompt P-01-B.
```

---

## P-01-B — REFRESH DE LA LANDING PAGE

```
Eres un diseñador UI/UX senior y desarrollador frontend de élite. Tu tarea es rediseñar 
completamente la landing page de Galicia Migrante para que produzca una emoción de 
pertenencia e identidad en los primeros 10 segundos de visita.

La landing es la puerta del portal. Si no funciona, nada más importa.

PASO 1 — LECTURA OBLIGATORIA:
Lee uno por uno, en este orden:
- Todos los archivos en la raíz: CLAUDE.md, package.json, next.config.mjs, y cualquier otro.
- Todos los archivos en docs/ sin excepción. Prestar especial atención a:
  * VISION.md — el "por qué" del portal. La landing debe encarnar esta visión.
  * manual-de-marca.md — paleta, tipografía, tono.
  * PLAN_DE_ACCION.md — qué se espera de esta fase.
- no pushear/Claves y contraseñas.txt
- app/page.js o app/page.jsx — la landing actual COMPLETA.
- app/globals.css COMPLETO — variables CSS disponibles.
- Todos los componentes en components/ que usa la landing.
- Cualquier CSS module que use la landing actual.
Solo cuando hayas leído absolutamente todo, comienza con el Paso 2.

PASO 2 — AUDITORÍA DE LA LANDING ACTUAL

2.1 Levantar el servidor: npm run dev
2.2 Analizar la landing actual en http://localhost:3000:
    - ¿Produce emoción en 10 segundos? (Respuesta honesta)
    - ¿Pasa la "prueba del joven" de VISION.md?
    - ¿Pasa la "prueba comunitaria" de VISION.md?
    - ¿Usa la paleta correcta del Brief (azul #0A2540, verde #00875A, dorado #D4A853)?
    - ¿La tipografía es la correcta (Playfair Display en headings)?
    - ¿El CTA principal lleva al árbol genealógico?
    - ¿Hay tagline en gallego?
2.3 Documentar en un comentario al inicio del archivo qué se va a cambiar y por qué.

PASO 3 — REDISEÑO DE LA LANDING

Implementar las siguientes secciones en orden. Cada sección va en un componente separado 
en app/components/ (o en la subcarpeta que corresponda según la estructura del proyecto).

SECCIÓN 1 — HERO (la más importante):
- Fondo: color azul profundo #0A2540, o imagen fotográfica con overlay azul al 75%.
  Si se usa imagen: landscape de Galicia o imagen del mar atlántico con carácter documental.
  La imagen va como background-image en CSS (no como <img> para facilitar el overlay).
- Contenido centrado verticalmente en al menos 80vh.
- Tagline en gallego, tipografía serif con personalidad:
    "De onde vés, non é o de menos."
  Debajo, en español, más pequeño: 
    "La historia de tu familia gallega te espera."
- Headline principal (Playfair Display, blanco, grande):
    "Somos la colectividad gallega en el siglo XXI."
  O variante más emocional:
    "Tu bisabuelo cruzó el Atlántico. Vos podés encontrarlo."
- Subheadline (Inter, gris claro, más pequeño):
    "Construí tu árbol genealógico. Descubrí tu pueblo en Galicia. 
    Unite a la comunidad que guarda la memoria."
- CTA primario (botón verde #00875A, texto blanco, grande):
    "Empezar mi árbol genealógico" → lleva a /arbol (con redirect a login si no tiene sesión)
- CTA secundario (botón outline blanco):
    "Explorar el blog" → lleva a /blog
- En mobile: todo apilado verticalmente, botones a full width.

SECCIÓN 2 — PROPUESTA DE VALOR (3 columnas en desktop, apiladas en mobile):
Título de sección: "¿Qué encontrás en Galicia Migrante?"
No listar features — mostrar el beneficio emocional.

Columna 1 — Árbol genealógico:
  Ícono: árbol o trisquel
  Título: "Tu historia familiar"
  Texto: "Construí tu árbol, cargá fotos y documentos, y descubrí en qué parroquia de 
  Galicia vivieron tus ancestros."
  Link: "Empezar mi árbol →"

Columna 2 — Blog y comunidad:
  Ícono: comunidad o conversación
  Título: "La comunidad que te da contexto"
  Texto: "Artículos, historias y testimonios escritos por y para la diáspora gallega. 
  Porque el pasado se entiende mejor cuando lo contamos juntos."
  Link: "Leer el blog →"

Columna 3 — Mediateca (puede mostrarse como "próximamente" si no existe aún):
  Ícono: libro, nota musical
  Título: "La cultura gallega, viva"
  Texto: "Música, fotografías históricas, libros y testimonios orales. 
  El acervo cultural de la diáspora, en un solo lugar."
  Link: "Conocer más →" (deshabilitado si no existe aún)

SECCIÓN 3 — DATOS DE LA COMUNIDAD (prueba social):
Mostrar estadísticas reales obtenidas de Supabase al momento de construir la página (SSR).
Implementar como Server Component que hace las queries al cargar.
Estadísticas a mostrar:
  - Cantidad de usuarios registrados: SELECT COUNT(*) FROM auth.users
  - Cantidad de personas en árboles: SELECT COUNT(*) FROM personas (o la tabla correspondiente)
  - Cantidad de posts publicados: SELECT COUNT(*) FROM blog_posts WHERE estado = 'publicado'
  - Cantidad de idiomas: 6 (hardcodeado — ES, GL, EN, FR, DE, IT — este SÍ se puede hardcodear)
Presentación: 4 números grandes con label debajo. Fondo levemente diferente al resto.
Si alguna query falla o devuelve 0: mostrar el número real (aunque sea 0, no inventar).

SECCIÓN 4 — FOOTER:
Columna 1: Logo + descripción en una línea: "La asociación gallega del siglo XXI."
Columna 2: Navegación rápida (Inicio, Blog, Mi árbol, Asociaciones, Quiénes somos)
Columna 3: Idiomas disponibles (link para cambiar idioma)
Columna 4: Redes sociales (placeholders si no hay cuentas reales aún) + contacto
Abajo: línea fina con copyright y año.

PASO 4 — TIPOGRAFÍA

4.1 Verificar que Playfair Display está cargada correctamente (Google Fonts o local).
    Si no lo está: agregarla en app/layout.js con el import de next/font/google:
    import { Playfair_Display, Inter } from 'next/font/google'
    const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
    const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
    Agregar las variables al tag <html>.
4.2 En globals.css: usar var(--font-playfair) para todos los h1, h2, h3 de secciones 
    públicas (no del panel admin).
4.3 En globals.css: usar var(--font-inter) para body y párrafos.

PASO 5 — RESPONSIVE

5.1 Verificar en viewport 375px (mobile):
    - El hero ocupa 100vh con todo el contenido visible sin scroll
    - Los botones son touch-friendly (mínimo 44px de alto)
    - El texto no se corta ni desborda
    - La sección de propuesta de valor está apilada verticalmente (una columna)
    - Los números de estadísticas están en grid 2x2
5.2 Verificar en viewport 768px (tablet):
    - Propuesta de valor en 2 columnas o apilada — lo que se vea mejor
5.3 Verificar en viewport 1280px (desktop):
    - Propuesta de valor en 3 columnas
    - Hero con suficiente padding lateral

PASO 6 — MODO OSCURO

6.1 Verificar que la landing se ve bien en modo oscuro (clase .dark en <html>).
6.2 El hero en modo oscuro puede ser idéntico (ya tiene fondo oscuro).
6.3 La sección de propuesta de valor: verificar que el fondo blanco/claro se convierte 
    en el fondo oscuro correspondiente con las variables CSS de globals.css.
6.4 Los textos y cards son legibles en modo oscuro.

PASO 7 — VERIFICACIÓN FINAL Y BUG HUNTING

7.1 Ronda completa de verificación:
    - Desktop claro: ¿produce emoción en 10 segundos?
    - Desktop oscuro: ¿se ve igual de bien?
    - Mobile claro: ¿todo visible y usable?
    - Mobile oscuro: ¿correcto?
7.2 Verificar la consola del browser: cero errores de JavaScript.
7.3 Verificar que los CTAs llevan a las URLs correctas.
7.4 Verificar que las estadísticas de la Sección 3 muestran datos reales (no hardcodeados excepto el de idiomas).
7.5 Pasar las cuatro pruebas de VISION.md:
    ✓ Prueba del joven: ¿Un joven de 28 años sin contexto previo entiende y se emociona?
    ✓ Prueba del mayor: ¿Una persona de 60 con poca experiencia digital puede orientarse?
    ✓ Prueba comunitaria: ¿Une o solo informa?
    ✓ Prueba de la cultura viva: ¿Muestra Galicia como algo que existe hoy?
7.6 Para cada punto que no pase: corregir y volver a verificar.
7.7 Repetir hasta pasar los cuatro sin objeciones.

PASO 8 — BUILD Y COMMIT

8.1 npm run build — exitoso y limpio.
8.2 git add -p
8.3 git commit -m "feat(landing): full redesign — hero with emotional headline, value prop sections, real stats SSR, Playfair Display typography, dark mode compatible"
8.4 git push
8.5 Actualizar docs/ESTADO_PROYECTO.md.
8.6 git add docs/ESTADO_PROYECTO.md && git commit -m "docs: mark P-01-B complete" && git push

CRITERIO DE COMPLETITUD:
- Hero con tagline en gallego, headline emocional y 2 CTAs ✅
- Sección de propuesta de valor con 3 columnas ✅
- Estadísticas reales desde Supabase ✅
- Tipografía Playfair Display en headings ✅
- Correcto en desktop y mobile, claro y oscuro ✅
- Pasa las 4 pruebas de VISION.md ✅
- Build limpio ✅

Pasar al prompt P-01-C.
```

---

## P-01-C — REFRESH DE COMPONENTES GLOBALES

```
Eres un diseñador de sistemas de diseño y desarrollador frontend senior. Tu tarea es 
extender el sistema visual de la nueva landing page al resto del portal, asegurando 
consistencia visual en todos los módulos existentes.

PASO 1 — LECTURA OBLIGATORIA:
Lee uno por uno, en este orden:
- Todos los archivos en la raíz del proyecto.
- Todos los archivos en docs/ sin excepción.
- no pushear/Claves y contraseñas.txt
- app/globals.css COMPLETO
- components/Navbar.js COMPLETO y su CSS module
- components/Footer.js COMPLETO (si existe) y su CSS
- app/auth/auth.module.css COMPLETO
- app/blog/components/ — todos los archivos
- app/admin/components/admin.module.css COMPLETO
Solo cuando hayas leído absolutamente todo, comienza con el Paso 2.

PASO 2 — AUDITORÍA DE CONSISTENCIA VISUAL

Levantar el servidor: npm run dev
Recorrer CADA página del portal y documentar qué no es consistente con el sistema de diseño 
definido en VISION.md y manual-de-marca.md:

Checklist por página:
□ ¿Usa la paleta correcta? (#0A2540 azul, #00875A verde, #D4A853 dorado, #F8F9FA fondo)
□ ¿Los headings usan Playfair Display?
□ ¿El cuerpo de texto usa Inter?
□ ¿Los botones primarios son verde #00875A con texto blanco?
□ ¿Los botones secundarios son outline azul #0A2540?
□ ¿Los bordes y sombras son consistentes?
□ ¿El espaciado es consistente con las variables de globals.css?
□ ¿El modo oscuro funciona correctamente?

Páginas a auditar:
- /auth — formulario de login y registro
- /blog — lista de posts
- /blog/[slug] — post individual
- /arbol — árbol genealógico
- /dashboard/posts — lista de posts del usuario
- /dashboard/posts/nuevo — editor de posts
- /admin/blog — panel de moderación
- /admin/blog/[slug]/traducciones — editor de traducciones

PASO 3 — CORRECCIONES POR COMPONENTE

Para cada inconsistencia encontrada en el Paso 2:
3.1 Identificar el archivo CSS exacto donde está el problema.
3.2 Corregir el valor usando la variable CSS correspondiente de globals.css.
    NO usar valores hardcodeados de color (ej: color: #0A2540) — siempre usar var(--color-*).
    Si la variable no existe en globals.css, agregarla primero con el nombre semántico correcto.
3.3 Verificar que la corrección no rompe el modo oscuro.
3.4 Verificar que la corrección no rompe mobile.

Correcciones prioritarias específicas:

NAVBAR:
- Logo: debe tener buena visibilidad tanto en modo claro como oscuro. Si el logo actual 
  tiene bajo contraste en modo oscuro, usar filter: brightness(0) invert(1) en .dark .logo-img
  o proveer una variante SVG con colores adaptables.
- El toggle de idioma debe estar alineado con el toggle de tema (P-01-A).
- En mobile: el menú hamburguesa debe abrirse/cerrarse limpiamente, sin saltar el contenido.

BLOG — CARDS DE POSTS:
- Cada card debe tener: título en Playfair Display, extracto en Inter, badges de categoría 
  con el color de la paleta, y un "Leer más →" en verde #00875A.
- Si el post tiene imagen de portada: mostrarla en la card.
- En modo oscuro: fondo de la card debe usar var(--color-card-bg) o equivalente.

FORMULARIOS (auth, dashboard):
- Labels: tipografía Inter, color apropiado en ambos modos.
- Inputs: borde sutil, fondo var(--color-input-bg), texto legible en ambos modos.
- Focus state: borde azul #0A2540 en modo claro, borde más claro en modo oscuro.
- Error states: rojo semántico, no naranja ni magenta.

ÁRBOL GENEALÓGICO:
- La barra lateral (si existe) debe usar la paleta correcta.
- Los modales de persona deben ser legibles en ambos modos.
- Los botones de acción (agregar, editar, eliminar) deben usar la jerarquía correcta de botones.

PASO 4 — SISTEMA DE TOKENS EN GLOBALS.CSS

4.1 Revisar globals.css y asegurarse de que existen estas variables semánticas (si no, crearlas):
    --color-primary: #0A2540
    --color-accent: #00875A
    --color-gold: #D4A853
    --color-bg: #F8F9FA (claro) / #0A2540 (oscuro)
    --color-surface: #FFFFFF (claro) / #112240 (oscuro)
    --color-text-primary: #0A2540 (claro) / #F8F9FA (oscuro)
    --color-text-secondary: #4A5568 (claro) / #A0AEC0 (oscuro)
    --color-border: #E2E8F0 (claro) / #2D3748 (oscuro)
    --color-input-bg: #FFFFFF (claro) / #1A2744 (oscuro)
    --font-heading: var(--font-playfair), Georgia, serif
    --font-body: var(--font-inter), system-ui, sans-serif
    --radius-sm: 6px
    --radius-md: 10px
    --radius-lg: 16px
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08)
    --shadow-md: 0 4px 12px rgba(0,0,0,0.12)
    
4.2 Para modo oscuro (.dark): redefinir solo las que cambian.
4.3 Reemplazar en todos los CSS modules: valores hardcodeados → variables semánticas.

PASO 5 — VERIFICACIÓN FINAL EXHAUSTIVA

5.1 Ronda completa: recorrer TODAS las páginas del Paso 2 en 4 combinaciones:
    - Desktop + modo claro
    - Desktop + modo oscuro
    - Mobile (375px) + modo claro
    - Mobile (375px) + modo oscuro
5.2 Para cada combinación: cero errores de consola, todos los textos legibles, 
    todos los botones con contraste suficiente (ratio mínimo 4.5:1 WCAG AA).
5.3 Verificar que el flujo completo de usuario sigue funcionando:
    - Registro de nuevo usuario
    - Login
    - Crear persona en el árbol
    - Escribir un post en el blog
    - El admin modera un post
5.4 Para cada bug encontrado: corregir y repetir la verificación.
5.5 Continuar hasta que no quede ningún bug ni inconsistencia visual.

PASO 6 — BUILD Y COMMIT

6.1 npm run build — exitoso y limpio.
6.2 git add -p
6.3 git commit -m "feat(ui): design system refresh — semantic CSS tokens, consistent palette, Playfair Display headings, dark mode across all components"
6.4 git push
6.5 Actualizar docs/ESTADO_PROYECTO.md.
6.6 git add docs/ESTADO_PROYECTO.md && git commit -m "docs: mark P-01-C complete — Phase 1 visual foundation done" && git push

CRITERIO DE COMPLETITUD:
- Paleta correcta en todas las páginas en modo claro y oscuro ✅
- Playfair Display en todos los headings ✅
- Sistema de tokens CSS semánticos en globals.css ✅
- Flujo completo de usuario funciona sin errores visuales ✅
- Build limpio ✅

Pasar al prompt P-02-A.
```

---

## P-02-A — POSTS INAUGURALES DEL BLOG

```
Eres un editor de contenido digital especializado en cultura gallega, historia de la 
emigración y comunidades de la diáspora. También eres desarrollador frontend y sabés 
publicar contenido directamente en Supabase. Tu tarea es escribir y publicar los 8 
artículos inaugurales del blog de Galicia Migrante.

PASO 1 — LECTURA OBLIGATORIA:
Lee uno por uno, en este orden:
- Todos los archivos en la raíz del proyecto.
- Todos los archivos en docs/ sin excepción. Prestar especial atención a VISION.md 
  (sección "El tono de voz") y PLAN_DE_ACCION.md (sección "Posts inaugurales del blog").
- no pushear/Claves y contraseñas.txt
- app/blog/ — todos los archivos para entender la estructura de posts.
- lib/blog/posts.js — para entender el schema de un post en Supabase.
- database/migrations/ — leer la migración del blog para entender exactamente qué 
  columnas tiene la tabla blog_posts.
Solo cuando hayas leído absolutamente todo, comienza con el Paso 2.

PASO 2 — ENTENDER EL SCHEMA

2.1 Consultar Supabase: DESCRIBE blog_posts o equivalente en PostgREST.
2.2 Confirmar las columnas exactas: id, slug, titulo, extracto, contenido, estado, 
    categoria, etiquetas, autor_id, created_at, etc.
2.3 Consultar las categorías disponibles: SELECT * FROM blog_categorias (o equivalente).
2.4 Obtener el UUID del usuario administrador para usarlo como autor_id:
    SELECT id FROM auth.users WHERE email = 'administrador@galiciamigrante.com'

PASO 3 — ESCRIBIR LOS 8 ARTÍCULOS

Para cada artículo, seguir el tono definido en VISION.md:
- Cercano, apasionado, no académico
- Español rioplatense (vos, entrá, descubrí)
- Primer párrafo: enganchar con algo concreto — imagen, historia, dato inesperado
- Cierre: invitar a compartir o descubrir algo propio
- Formato Markdown completo con headings (##, ###), negritas, listas donde corresponda

ARTÍCULO 1: "Galicia Migrante: el espacio que la colectividad necesitaba"
Slug: galicia-migrante-el-espacio-que-la-colectividad-necesitaba
Categoría: comunidad
Etiquetas: presentación, colectividad, comunidad
Extracto: Por qué existe Galicia Migrante, qué queremos construir y para quién.
Contenido: Historia del proyecto. El problema de los centros en decadencia. La visión 
del portal como la asociación gallega del siglo XXI. Invitación a participar.
~600 palabras.

ARTÍCULO 2: "Cómo empezar tu árbol genealógico (aunque no sepas nada)"
Slug: como-empezar-tu-arbol-genealogico
Categoría: genealogia
Etiquetas: tutorial, árbol genealógico, primeros pasos
Extracto: Una guía simple para arrancar con tu árbol, paso a paso, sin conocimientos previos.
Contenido: Dónde conseguir la información (qué preguntarle a la familia), cómo cargar la 
primera persona, qué datos son importantes (especialmente el pueblo de origen en Galicia), 
cómo agregar documentos y fotos. Tono didáctico pero no condescendiente. ~700 palabras.

ARTÍCULO 3: "Los barcos que trajeron a los gallegos"
Slug: los-barcos-que-trajeron-a-los-gallegos
Categoría: historia
Etiquetas: emigración, barcos, historia, siglo XX
Extracto: El Cap Polonio, el Cabo San Roque, el Príncipe de Asturias. Viajes que cambiaron familias enteras.
Contenido: Historia de la emigración gallega a Argentina. Los puertos de salida (Vigo, 
Coruña). Los barcos más conocidos. Las fechas de los grandes flujos migratorios (1900-1930, 
posguerra). Qué se vivía en esos viajes. Cómo buscar registros de llegada en el CEMLA.
~800 palabras.

ARTÍCULO 4: "La parroquia: la unidad que los apellidos no te cuentan"
Slug: la-parroquia-la-unidad-que-los-apellidos-no-te-cuentan
Categoría: genealogia
Etiquetas: parroquias, territorio, Galicia, apellidos
Extracto: Saber el apellido no alcanza. En Galicia, la identidad más profunda está en la parroquia.
Contenido: Qué es una parroquia en Galicia (no es lo mismo que en Argentina). Por qué hay 
tres "López" en el mismo pueblo sin ningún parentesco. Cómo la parroquia organiza la 
identidad territorial gallega. Cómo encontrar la parroquia de tus ancestros. ~600 palabras.

ARTÍCULO 5: "5 músicos gallegos que tenés que conocer (aunque no lo supieras)"
Slug: 5-musicos-gallegos-que-tenes-que-conocer
Categoría: cultura
Etiquetas: música, cultura gallega, artistas
Extracto: De las gaitas a los cantautores contemporáneos: la música gallega va mucho más allá del folklore.
Contenido: Presentar 5 artistas/grupos que mezclan lo tradicional con lo contemporáneo: 
Carlos Núñez, Luar na Lubre, Susana Seivane, Mercedes Peón, Baiuca (o similares con 
contexto). Para cada uno: quién es, qué hace, por qué importa, un link de YouTube si aplica.
~700 palabras.

ARTÍCULO 6: "Las asociaciones gallegas de Buenos Aires: historia y presente"
Slug: asociaciones-gallegas-de-buenos-aires
Categoría: comunidad
Etiquetas: asociaciones, Buenos Aires, colectividad, historia
Extracto: Desde las primeras sociedades de ayuda mutua hasta hoy: cómo la comunidad gallega construyó su lugar en Argentina.
Contenido: Historia de las primeras asociaciones (fines del siglo XIX). Las principales 
instituciones en Buenos Aires. Qué ofrecen hoy. Por qué están en decadencia y qué se puede 
hacer. El rol del portal como complemento digital. ~700 palabras.

ARTÍCULO 7: "Entroido, Magosto y San Xoán: las fiestas que viajaron con la diáspora"
Slug: entroido-magosto-san-xoan-fiestas-que-viajaron
Categoría: cultura
Etiquetas: tradiciones, fiestas patronales, Galicia, diáspora
Extracto: Tres celebraciones gallegas que sobrevivieron el cruce del Atlántico y siguen vivas en la diáspora.
Contenido: Explicación de cada festividad (qué es, cuándo, cómo se celebra en Galicia hoy). 
Cómo se adaptaron en Argentina/Cuba/Venezuela. Anécdotas o testimonios si se tienen. 
Cómo buscar dónde se celebran cerca tuyo. ~700 palabras.

ARTÍCULO 8: "Tu historia también es nuestra: cómo contribuir a Galicia Migrante"
Slug: tu-historia-tambien-es-nuestra
Categoría: comunidad
Etiquetas: comunidad, contribución, participación
Extracto: El portal crece con lo que cada uno trae. Tus fotos, tus recuerdos, tus investigaciones son parte del acervo colectivo.
Contenido: Cómo registrarse. Cómo publicar un artículo en el blog. Cómo cargar fotos 
históricas. Qué va a venir (Mediateca, testimonios orales). Invitación directa y cálida 
a participar. ~500 palabras.

PASO 4 — PUBLICAR LOS ARTÍCULOS EN SUPABASE

Para CADA uno de los 8 artículos:
4.1 Construir el objeto con todos los campos requeridos por blog_posts.
4.2 Insertar en Supabase usando la service role key (en no pushear/):
    - estado: 'publicado'
    - autor_id: UUID del administrador
    - created_at: fechas escalonadas (uno por día, empezando 7 días atrás)
4.3 Verificar que el post aparece en http://localhost:3000/blog.
4.4 Verificar que el post individual carga sin errores.
4.5 Ejecutar el endpoint de traducción para cada post:
    POST http://localhost:3000/api/blog/[id]/translate-all
    con el JWT del administrador.
4.6 Verificar en Supabase que blog_post_translations tiene filas para cada idioma.
4.7 Verificar que el selector de idioma en el post funciona para GL, EN, FR, DE, IT.

PASO 5 — VERIFICACIÓN EDITORIAL Y TÉCNICA

5.1 Leer CADA artículo publicado en el browser.
5.2 Verificar que el Markdown renderiza correctamente (headings, negritas, listas).
5.3 Verificar que el tono corresponde a lo definido en VISION.md.
5.4 Verificar que ningún artículo tiene errores ortográficos graves (hacer una revisión).
5.5 Verificar que los slugs son únicos y funcionan como URLs.
5.6 Verificar que los filtros de categoría en /blog funcionan con las categorías usadas.
5.7 Para cada problema encontrado: corregir el contenido o el código y re-verificar.

PASO 6 — COMMIT Y CIERRE

6.1 Si se modificó código (bug fixes): npm run build, luego git commit.
6.2 Si solo se agregó contenido a la base de datos: documentar en ESTADO_PROYECTO.md.
6.3 Actualizar docs/ESTADO_PROYECTO.md con la lista de artículos publicados.
6.4 git add docs/ESTADO_PROYECTO.md && git commit -m "docs: mark P-02-A complete — 8 inaugural posts published" && git push

CRITERIO DE COMPLETITUD:
- 8 artículos publicados y accesibles en /blog ✅
- Cada artículo tiene traducciones en los 5 idiomas ✅
- El Markdown renderiza correctamente en todos ✅
- Los filtros de categoría funcionan ✅
- Cero errores de consola en /blog y en cada post individual ✅

Pasar al prompt P-02-B.
```

---

## P-02-B — PÁGINA "QUIÉNES SOMOS"

```
Eres un desarrollador frontend senior y redactor de contenido institucional. Tu tarea 
es crear la página "Quiénes somos" de Galicia Migrante con contenido real y diseño 
consistente con el sistema visual establecido.

PASO 1 — LECTURA OBLIGATORIA:
Lee uno por uno, en este orden:
- Todos los archivos en la raíz del proyecto.
- Todos los archivos en docs/ sin excepción.
- no pushear/Claves y contraseñas.txt
- El archivo de la página "Quiénes somos" actual (buscar en app/ — puede ser 
  app/quienes-somos/page.js o similar).
- app/globals.css COMPLETO
- components/Navbar.js para entender la navegación
Solo cuando hayas leído absolutamente todo, comienza con el Paso 2.

PASO 2 — AUDITORÍA DEL ESTADO ACTUAL

2.1 Buscar si existe app/quienes-somos/ o app/about/ o equivalente.
2.2 Si existe: leer el contenido actual. Evaluar si tiene contenido real o es placeholder.
2.3 Verificar que la ruta aparece en el menú de navegación principal.
2.4 Si no existe: crearla desde cero.

PASO 3 — CONTENIDO DE LA PÁGINA

La página tiene 4 secciones:

SECCIÓN 1 — LA HISTORIA DEL PROYECTO:
"Galicia Migrante nació de una pregunta simple: ¿dónde se encuentra hoy la comunidad 
gallega de la diáspora? Las asociaciones gallegas que construyeron generaciones anteriores 
están en decadencia. La memoria vive en los mayores. Los jóvenes están dispersos, 
conectados, pero sin un espacio que los haga sentir parte de algo más grande."
"Este portal es ese espacio. El equivalente digital de la asociación gallega: un lugar 
donde encontrarse, recordar, investigar y construir juntos el legado de la diáspora."

SECCIÓN 2 — NUESTRA VISIÓN:
Versión accesible de VISION.md, en 3-4 párrafos. Sin jerga de producto. 
Como le contarías a tu abuela por qué existe esto.

SECCIÓN 3 — QUÉ OFRECEMOS:
Lista visual con los módulos actuales y futuros:
- Árbol genealógico (disponible)
- Blog de la comunidad (disponible)
- Tu lugar en Galicia (próximamente)
- La Mediateca — biblioteca, hemeroteca, musicoteca (próximamente)
- Historia oral (próximamente)
- Micrositios de asociaciones (próximamente)

SECCIÓN 4 — CÓMO PARTICIPAR:
"Galicia Migrante se construye con lo que cada uno trae."
3 formas de participar:
1. Crear tu árbol genealógico y compartirlo con tu familia
2. Escribir un artículo para el blog — tu historia, tu investigación, tu recuerdo
3. Contribuir con fotos históricas, documentos o testimonios (próximamente)
CTA final: botón "Registrarse gratis" → /auth

PASO 4 — IMPLEMENTACIÓN

4.1 Crear o actualizar app/quienes-somos/page.js como Server Component.
4.2 Los estilos van en app/quienes-somos/components/quienes-somos.module.css.
4.3 Usar las variables CSS del sistema de diseño — no valores hardcodeados.
4.4 Responsive: mobile first, verificar en 375px y 1280px.
4.5 Modo oscuro: verificar que todas las secciones son legibles.
4.6 Asegurarse de que el enlace "Quiénes somos" en la navbar apunta a esta página.

PASO 5 — VERIFICACIÓN

5.1 http://localhost:3000/quienes-somos carga sin errores.
5.2 Todas las secciones son legibles en desktop y mobile, claro y oscuro.
5.3 El CTA "Registrarse gratis" lleva a /auth.
5.4 La navegación de vuelta al inicio funciona.
5.5 Cero errores de consola.
5.6 npm run build exitoso.

PASO 6 — COMMIT

6.1 git commit -m "feat(about): create quienes-somos page with real content and responsive design"
6.2 git push
6.3 Actualizar docs/ESTADO_PROYECTO.md.

Pasar al prompt P-02-C.
```

---

## P-02-C — SEED DE AGENDA

```
Eres un desarrollador backend y community manager de la colectividad gallega. Tu tarea 
es cargar eventos reales en la agenda del portal para que no esté vacía al lanzar.

PASO 1 — LECTURA OBLIGATORIA:
Lee todos los archivos en la raíz y todos los archivos en docs/. Lee no pushear/Claves.
Lee app/agenda/ o la sección de agenda que exista — todos los archivos.
Lee las migraciones de la base de datos para entender el schema de la tabla eventos.
Solo entonces comienza.

PASO 2 — ENTENDER EL SCHEMA DE EVENTOS

2.1 Buscar la tabla eventos en las migraciones o en lib/.
2.2 Identificar las columnas: título, descripción, fecha, lugar, organizador, URL, etc.
2.3 Verificar cómo se muestran los eventos en la UI de /agenda.

PASO 3 — CARGAR EVENTOS REALES

Cargar al menos 15 eventos en la tabla eventos de Supabase. Los eventos deben ser:
- Reales o plausibles para la colectividad gallega en Argentina
- Con fechas futuras (a partir de la fecha de hoy en el momento de ejecutar el prompt)
- Variados: fiestas patronales, encuentros culturales, eventos de asociaciones, webinars

Ejemplos de tipos de eventos a generar:
- Fiesta de Santiago Apóstol (25 de julio) en diversas ciudades
- Fiesta del Magosto (noviembre) en asociaciones
- Talleres de árbol genealógico
- Presentaciones de libros sobre la emigración gallega
- Webinars de la Xunta de Galicia para la diáspora
- Encuentros de descendientes jóvenes
- Festivales de gaita y música gallega
- Cursos de gallego (idioma)

Para cada evento crear un objeto con todos los campos requeridos e insertar via Supabase.

PASO 4 — VERIFICACIÓN

4.1 Ir a http://localhost:3000/agenda y verificar que los eventos aparecen.
4.2 Verificar que el ordenamiento por fecha funciona correctamente.
4.3 Verificar que la UI de la agenda no tiene errores con los nuevos datos.
4.4 Si la agenda es estática (HTML hardcodeado): migrarla a datos dinámicos desde Supabase.
    - Server Component que hace SELECT * FROM eventos WHERE fecha >= NOW() ORDER BY fecha
    - Renderiza la lista de eventos desde los datos reales
    - Si la UI hardcodeada tenía estilos buenos: preservarlos pero alimentarlos con datos reales
4.5 npm run build limpio.

PASO 5 — COMMIT

5.1 git commit -m "feat(agenda): seed 15+ real events, migrate to dynamic data from Supabase"
5.2 git push. Actualizar ESTADO_PROYECTO.md.

Pasar al prompt P-03-A.
```

---

## P-03-A — TU LUGAR EN GALICIA: SEED DE DATOS

```
Eres un ingeniero de datos y backend developer especializado en datos geográficos y 
administrativos. Tu tarea es cargar en Supabase el dataset completo de parroquias 
gallegas del IGE y preparar la infraestructura de base de datos para el módulo 
"Tu lugar en Galicia".

PASO 1 — LECTURA OBLIGATORIA:
Lee todos los archivos en la raíz y todos los archivos en docs/ sin excepción.
Lee no pushear/Claves y contraseñas.txt.
Lee docs/PRD.md sección "Tu lugar en Galicia" con especial atención.
Lee todas las migraciones en database/migrations/ para entender la convención de nombres.
Solo entonces comienza.

PASO 2 — DISEÑO DEL SCHEMA

Crear una migración nueva (número siguiente al último) con estas tablas:

TABLA: galicia_provincias
  id SERIAL PRIMARY KEY
  nombre TEXT NOT NULL
  codigo TEXT UNIQUE NOT NULL  -- 'C', 'LU', 'OR', 'PO'

TABLA: galicia_comarcas
  id SERIAL PRIMARY KEY
  nombre TEXT NOT NULL
  provincia_id INT REFERENCES galicia_provincias(id)

TABLA: galicia_concellos
  id SERIAL PRIMARY KEY
  nombre TEXT NOT NULL
  comarca_id INT REFERENCES galicia_comarcas(id)
  provincia_id INT REFERENCES galicia_provincias(id)
  lat DECIMAL(10,7)
  lng DECIMAL(10,7)

TABLA: galicia_parroquias
  id SERIAL PRIMARY KEY
  nombre TEXT NOT NULL
  concello_id INT REFERENCES galicia_concellos(id)
  tipo TEXT  -- 'civil' o 'eclesiastica'
  lat DECIMAL(10,7)
  lng DECIMAL(10,7)
  descripcion TEXT  -- contenido editorial, puede estar vacío inicialmente

TABLA: galicia_aldeas
  id SERIAL PRIMARY KEY
  nombre TEXT NOT NULL
  parroquia_id INT REFERENCES galicia_parroquias(id)

Agregar índices en: nombre (todas las tablas), concello_id, parroquia_id.
Habilitar RLS pero hacer todas las tablas de lectura pública.

PASO 3 — CARGAR LOS DATOS

3.1 Las 4 provincias gallegas: A Coruña, Lugo, Ourense, Pontevedra.
3.2 Las comarcas de Galicia (~53 comarcas) — buscar el listado oficial.
3.3 Los concellos (~313 concellos) — buscar el listado oficial del IGE.
3.4 Las parroquias (~3.800 parroquias) — este es el dataset más importante.

Para obtener los datos:
- Buscar el dataset CSV/JSON del IGE (Instituto Galego de Estatística) en data.xunta.gal
  o en el repositorio de datos abiertos de la Xunta.
- Si el dataset del IGE no está disponible directamente, construirlo desde la Wikipedia 
  o desde datos open source de OpenStreetMap (overpass API para Galicia).
- Alternativa: usar el dataset de nomenclátor del IGE en formato Excel si está disponible.

3.5 Cargar los datos en orden jerárquico: provincias → comarcas → concellos → parroquias.
3.6 Para cada nivel: verificar en Supabase que los datos se cargaron correctamente con 
    SELECT COUNT(*) para cada tabla.

PASO 4 — VERIFICACIÓN DE INTEGRIDAD

4.1 Verificar que no hay parroquias sin concello_id.
4.2 Verificar que no hay concellos sin provincia_id.
4.3 Probar una búsqueda: SELECT * FROM galicia_parroquias WHERE nombre ILIKE '%Santiago%' LIMIT 10;
4.4 Probar la jerarquía: dado un parroquia_id, obtener el concello, la comarca y la provincia.

PASO 5 — COMMIT

5.1 La migración SQL va en database/migrations/[numero]_galicia_territorio.sql
5.2 El script de seed (si es un archivo separado) va en database/seeds/ o similar.
5.3 git commit -m "feat(territorio): add galicia territorial schema + seed ~3800 parroquias from IGE"
5.4 git push. Actualizar ESTADO_PROYECTO.md.

Pasar al prompt P-03-B.
```

---

## P-03-B — TU LUGAR EN GALICIA: MÓDULO UI

```
Eres un desarrollador frontend senior especializado en interfaces de exploración geográfica 
y cultural. Tu tarea es construir el módulo "Tu lugar en Galicia" del portal.

PASO 1 — LECTURA OBLIGATORIA:
Lee todos los archivos en la raíz y todos los archivos en docs/ sin excepción.
Lee no pushear/Claves y contraseñas.txt.
Lee el resultado de P-03-A: el schema de las tablas galicia_*.
Lee app/globals.css y el sistema de diseño completo.
Solo entonces comienza.

PASO 2 — ESTRUCTURA DE ARCHIVOS

Siguiendo las reglas de CLAUDE.md (app/ solo routing, componentes en components/ del módulo):
  app/territorio/page.js                              — landing del módulo (buscador)
  app/territorio/[provincia]/page.js                 — página de provincia
  app/territorio/[provincia]/[concello]/page.js      — página de concello
  app/territorio/parroquia/[id]/page.js              — página de parroquia
  app/territorio/components/BuscadorTerritorio.js    — buscador con autocompletado
  app/territorio/components/TarjetaParroquia.js      — card de una parroquia
  app/territorio/components/MapaParroquia.js         — mapa de ubicación
  app/territorio/components/territorio.module.css    — estilos del módulo
  lib/territorio/queries.js                          — todas las queries a Supabase

PASO 3 — IMPLEMENTAR EL BUSCADOR (página principal del módulo)

La landing de /territorio tiene:
- Headline: "¿De qué parroquia venís?"
- Subtítulo: "Encontrá el lugar en Galicia donde vivieron tus ancestros."
- Buscador con autocompletado:
  * El usuario escribe el nombre de la parroquia, aldea o concello
  * El buscador hace fetch a un route handler /api/territorio/buscar?q=[query]
  * El route handler hace SELECT con ILIKE en galicia_parroquias, galicia_concellos y galicia_aldeas
  * Devuelve los primeros 10 resultados con tipo (parroquia/concello/aldea) y jerarquía completa
  * El dropdown muestra: "Santiago de Compostela · Concello · A Coruña"
  * Al hacer clic: navega a la página de esa parroquia o concello

PASO 4 — IMPLEMENTAR LA PÁGINA DE PARROQUIA

/territorio/parroquia/[id] muestra:
- Nombre de la parroquia en Playfair Display (grande)
- Jerarquía: aldea → parroquia → concello → comarca → provincia
- Mapa: usar un iframe de Google Maps o OpenStreetMap centrado en lat/lng de la parroquia.
  Si la parroquia no tiene coordenadas, mostrar el mapa del concello.
- Descripción editorial (puede estar vacía inicialmente — mostrar placeholder)
- Sección "Miembros de la comunidad con ancestros de aquí":
  * Query: SELECT COUNT(*) de personas en el árbol que tienen esta parroquia como origen
  * Mostrar el número (sin revelar nombres — privacidad)
  * CTA: "¿Tenés ancestros de esta parroquia? Agregala a tu árbol →"
- Sección "Parroquias cercanas" (opcional en primera versión)

PASO 5 — ROUTE HANDLER DE BÚSQUEDA

app/api/territorio/buscar/route.js:
- GET con query param ?q=
- Si q tiene menos de 2 caracteres: devuelve []
- Busca en galicia_parroquias, galicia_concellos y galicia_aldeas con ILIKE
- Para cada resultado incluye la jerarquía completa (joins)
- Limita a 10 resultados
- Ordena por relevancia (exacto primero, luego contiene)
- No requiere autenticación (es búsqueda pública)

PASO 6 — INTEGRACIÓN CON EL ÁRBOL GENEALÓGICO

6.1 En el formulario de agregar/editar persona del árbol: 
    el campo "Lugar de nacimiento" debe tener una opción "Buscar parroquia en Galicia"
    que abre el buscador del módulo territorial y permite seleccionar una parroquia.
6.2 Al seleccionar: guardar el parroquia_id en la tabla personas (agregar columna 
    parroquia_origen_id INT REFERENCES galicia_parroquias(id) si no existe).
6.3 En el modal de visualización de una persona en el árbol: si tiene parroquia_origen_id,
    mostrar "De [parroquia], [concello], Galicia" con link a la página de la parroquia.

PASO 7 — VERIFICACIÓN EXHAUSTIVA

7.1 Buscar "Santiago" → debe aparecer múltiples parroquias con ese nombre.
7.2 Buscar "Vigo" → debe aparecer el concello de Vigo.
7.3 Navegar a una página de parroquia → todo se carga sin errores.
7.4 El mapa carga correctamente.
7.5 En el árbol: agregar parroquia de origen a una persona → aparece en el modal.
7.6 Desde la parroquia: el contador de miembros con ancestros funciona.
7.7 Verificar en mobile (375px): el buscador y la página de parroquia son usables.
7.8 Verificar en modo oscuro: todo legible.
7.9 Para cada bug: corregir y re-verificar.

PASO 8 — BUILD Y COMMIT

8.1 npm run build limpio.
8.2 git commit -m "feat(territorio): Tu lugar en Galicia module — search, parroquia pages, arbol integration"
8.3 git push. Actualizar ESTADO_PROYECTO.md.

Pasar al prompt P-04-A.
```

---

## P-04-A — LA MEDIATECA: ARQUITECTURA Y RUTAS

```
Eres un arquitecto de software y desarrollador fullstack senior. Tu tarea es diseñar 
e implementar la arquitectura base de La Mediateca — el espacio cultural del portal — 
sin todavía llenar el contenido de cada sala (eso lo hacen los prompts siguientes).

PASO 1 — LECTURA OBLIGATORIA:
Lee todos los archivos en la raíz y todos los archivos en docs/ sin excepción.
Lee no pushear/Claves y contraseñas.txt.
Lee VISION.md sección "La Mediateca" con especial atención.
Lee todas las migraciones existentes para entender la convención.
Solo entonces comienza.

PASO 2 — SCHEMA DE BASE DE DATOS

Crear migración para las tablas de la Mediateca:

TABLA: mediateca_items
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
  tipo TEXT NOT NULL CHECK (tipo IN ('libro','articulo_hemeroteca','cancion','album',
       'fotografia','grabacion_oral','pelicula','documento'))
  titulo TEXT NOT NULL
  descripcion TEXT
  autor TEXT
  fecha_publicacion DATE
  fecha_aproximada BOOLEAN DEFAULT false
  idioma TEXT DEFAULT 'es'
  url_contenido TEXT        -- URL del archivo o recurso externo
  url_miniatura TEXT        -- URL de imagen de portada/miniatura
  licencia TEXT             -- dominio público, CC, derechos reservados, etc.
  fuente TEXT               -- de dónde proviene el material
  etiquetas TEXT[]
  estado TEXT DEFAULT 'publicado' CHECK (estado IN ('borrador','publicado','archivado'))
  contribuidor_id UUID REFERENCES auth.users(id)
  creado_en TIMESTAMPTZ DEFAULT NOW()
  actualizado_en TIMESTAMPTZ DEFAULT NOW()

TABLA: mediateca_colecciones
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
  nombre TEXT NOT NULL
  descripcion TEXT
  tipo TEXT NOT NULL        -- 'biblioteca','hemeroteca','musicoteca','fototeca','fonoteca','filmoteca'
  portada_url TEXT
  curada BOOLEAN DEFAULT true

TABLA: mediateca_items_colecciones
  item_id UUID REFERENCES mediateca_items(id) ON DELETE CASCADE
  coleccion_id UUID REFERENCES mediateca_colecciones(id) ON DELETE CASCADE
  orden INT
  PRIMARY KEY (item_id, coleccion_id)

RLS:
  - Lectura pública para items con estado='publicado'
  - Escritura solo para admin_general
  - Inserción permitida para usuarios autenticados (contribuciones pendientes de moderación → estado='borrador')

PASO 3 — ESTRUCTURA DE ARCHIVOS

app/mediateca/page.js                            — landing con las 6 salas
app/mediateca/biblioteca/page.js                 — sala de libros
app/mediateca/hemeroteca/page.js                 — sala de prensa
app/mediateca/musica/page.js                     — sala de música
app/mediateca/fotos/page.js                      — sala de fotografías históricas
app/mediateca/testimonios/page.js                — sala de grabaciones orales
app/mediateca/[tipo]/[id]/page.js               — vista individual de cualquier item
app/mediateca/components/SalaCard.js             — card de una sala (para la landing)
app/mediateca/components/ItemCard.js             — card de un item
app/mediateca/components/ItemDetalle.js          — vista detallada de un item
app/mediateca/components/mediateca.module.css    — estilos del módulo
app/api/mediateca/items/route.js                 — GET (lista) y POST (contribuir)
app/api/mediateca/items/[id]/route.js            — GET (detalle)
lib/mediateca/queries.js                         — queries a Supabase

PASO 4 — LANDING DE LA MEDIATECA (/mediateca)

La landing muestra las 6 salas como cards visuales. Cada card tiene:
- Ícono representativo de la sala
- Nombre de la sala
- Descripción en una línea
- Cantidad de items disponibles (query real)
- Color o imagen de fondo distintivo pero dentro de la paleta del portal

Las 6 salas y su descripción:
1. Biblioteca — "Libros y documentos sobre la emigración gallega"
2. Hemeroteca — "Prensa gallega histórica y publicaciones de la diáspora"
3. Musicoteca — "La música gallega: de la gaita al cantautor contemporáneo"
4. Fototeca — "Fotografías históricas de la diáspora: barcos, llegadas, fiestas patronales"
5. Testimonios — "Grabaciones y relatos orales de quienes vivieron la emigración"
6. Filmoteca — "Documentales y material audiovisual sobre Galicia y su diáspora"

PASO 5 — COMPONENTE ITEMCARD

Reutilizable para todas las salas. Muestra:
- Miniatura (url_miniatura) con fallback a un placeholder según tipo
- Título
- Autor / artista / fuente
- Fecha (aproximada si fecha_aproximada=true)
- Badge de tipo
- Descripción truncada a 2 líneas
- Link a la página de detalle /mediateca/[tipo]/[id]

PASO 6 — RUTA DE ITEM INDIVIDUAL

/mediateca/[tipo]/[id] muestra:
- Todos los datos del item
- Si tiene url_contenido: viewer inline si es posible (PDF viewer, audio player, video player)
- Si es externo: link con aviso "Este recurso está alojado en [fuente]"
- Items relacionados del mismo tipo o con las mismas etiquetas

PASO 7 — NAVEGACIÓN

7.1 Agregar "La Mediateca" al menú principal de la Navbar.
7.2 Verificar que el menú en mobile funciona correctamente.

PASO 8 — VERIFICACIÓN

8.1 /mediateca carga con las 6 cards (contadores en 0 si no hay items aún).
8.2 Cada /mediateca/[sala] carga con mensaje "Contenido próximamente" si está vacía.
8.3 La migración se aplicó sin errores en Supabase.
8.4 Las políticas RLS funcionan: anónimo puede leer publicados, no puede escribir.
8.5 npm run build limpio.

PASO 9 — COMMIT

9.1 git commit -m "feat(mediateca): architecture — schema, routes, landing with 6 salas, ItemCard component"
9.2 git push. Actualizar ESTADO_PROYECTO.md.

Pasar al prompt P-04-B.
```

---

## P-04-B — SEED INICIAL DE LA MEDIATECA

```
Eres un curador de contenido cultural especializado en la diáspora gallega y un 
desarrollador backend. Tu tarea es cargar el contenido inicial de las 6 salas de 
La Mediateca para que no estén vacías al lanzar.

PASO 1 — LECTURA OBLIGATORIA:
Lee todos los archivos en la raíz y todos los archivos en docs/ sin excepción.
Lee no pushear/Claves y contraseñas.txt.
Lee el schema implementado en P-04-A (tabla mediateca_items y relacionadas).
Lee VISION.md sección "La Mediateca" con especial atención al modelo de contenido.
Solo entonces comienza.

PASO 2 — CONTENIDO POR SALA

Investigar y cargar en Supabase el siguiente contenido mínimo por sala.
TODO el contenido debe ser real, verificable, y de dominio público o con licencia libre 
(CC0, CC BY, etc.) a menos que sea un link externo a un recurso ya publicado en internet.

BIBLIOTECA (mínimo 10 ítems):
Libros y documentos digitalizados sobre emigración gallega. Buscar en:
- Biblioteca de Galicia digital (bivir.xunta.gal)
- Biblioteca Nacional de España (BNE digital)
- Internet Archive (archive.org) con búsqueda "galicia emigracion"
- Gallica (BNF) para prensa y documentos históricos
Ejemplos de lo que buscar: obras de Rosalía de Castro (dominio público), documentos de 
la emigración gallega a América, memorias de emigrantes, estudios históricos.

HEMEROTECA (mínimo 10 ítems):
Prensa gallega histórica. Buscar en:
- Arquivo de Galicia / hemeroteca dixital
- Internet Archive: colecciones de prensa española
- BNE hemeroteca digital
Ejemplos: colecciones de "El Eco de Galicia" (Buenos Aires), "El Correo de Galicia", 
publicaciones de centros gallegos históricos.

MUSICOTECA (mínimo 15 ítems):
Artistas y canciones representativas de la música gallega. Para cada ítem:
- Nombre del artista/banda
- Nombre de la canción o álbum
- URL de YouTube (si existe y es oficial) o Spotify
- Descripción del artista y su importancia cultural
Incluir: Carlos Núñez, Luar na Lubre, Milladoiro, Mercedes Peón, Susana Seivane, 
Baiuca, Tanxugueiras, Dios Ke Te Crew, Sés, entre otros.
Mezclar: música tradicional, cantautores, fusión contemporánea.

FOTOTECA (mínimo 10 ítems):
Fotografías históricas de dominio público de la diáspora gallega. Buscar en:
- Wikimedia Commons: "galician emigration", "gallegos argentina"
- CEMLA: Centro de Estudios Migratorios Latinoamericanos (si tienen material público)
- Arquivo de Galicia: colecciones fotográficas
- Internet Archive: colecciones fotográficas de la emigración española
Para cada foto: título descriptivo, fecha aproximada, fuente y licencia.

TESTIMONIOS (mínimo 5 ítems):
Grabaciones o transcripciones de testimonios de emigrantes. Buscar en:
- YouTube: entrevistas a emigrantes gallegos en Argentina
- Museos de emigración: Museo da Emigración Galega, Arquivo da Memoria
- Proyectos de historia oral existentes
Si no hay material libre: crear 5 fichas de testimonios "próximamente" como placeholders 
con descripción del tipo de testimonio que se buscará.

FILMOTECA (mínimo 5 ítems):
Documentales sobre la emigración gallega. Buscar en:
- YouTube: documentales de TVG, La 2 sobre emigración gallega
- Vimeo: producciones independientes
- Archive.org: noticiarios o documentales históricos
Para cada uno: título, año, duración, descripción, URL.

PASO 3 — INSERCIÓN EN SUPABASE

Para cada ítem:
3.1 Construir el objeto completo con todos los campos.
3.2 Insertar usando la service role key.
3.3 Insertar en la colección correspondiente (mediateca_items_colecciones).
3.4 Verificar que el ítem aparece en la UI de /mediateca/[sala].

PASO 4 — VERIFICACIÓN VISUAL

4.1 Abrir cada sala y verificar que los ítems cargan correctamente.
4.2 Verificar que las miniaturas cargan (o que el fallback funciona si no hay URL).
4.3 Abrir la página de detalle de al menos 2 ítems por sala.
4.4 Verificar que los players/viewers funcionan donde corresponde.
4.5 La landing /mediateca muestra los contadores actualizados.
4.6 Cero errores de consola.

PASO 5 — COMMIT

5.1 Si se modificó código: npm run build, luego commit.
5.2 Actualizar docs/ESTADO_PROYECTO.md con el conteo de ítems por sala.
5.3 git commit -m "feat(mediateca): seed initial content — biblioteca, hemeroteca, musicoteca, fototeca, testimonios, filmoteca"
5.4 git push.

CRITERIO DE COMPLETITUD:
- Las 6 salas tienen al menos el mínimo de ítems establecido ✅
- Todos los ítems cargan sin errores en la UI ✅
- Los contadores de la landing son correctos ✅
- Build limpio ✅

Pasar al prompt P-05.
```

---

## P-05 — MICROSITIOS DE ASOCIACIONES

```
Eres un desarrollador fullstack senior especializado en sistemas CMS y multi-tenant. 
Tu tarea es implementar el sistema completo de micrositios para asociaciones gallegas, 
tal como está especificado en el PRD sección 8.

PASO 1 — LECTURA OBLIGATORIA:
Lee todos los archivos en la raíz y todos los archivos en docs/ sin excepción.
Lee no pushear/Claves y contraseñas.txt.
Lee docs/PRD.md sección 8 COMPLETA y en detalle.
Lee las tablas existentes: asociaciones, asociaciones_directivos, asociaciones_noticias, eventos.
Lee app/asociaciones/ — todo lo que exista actualmente.
Solo entonces comienza.

PASO 2 — AUDITORÍA DEL ESTADO ACTUAL

2.1 Examinar qué existe en app/asociaciones/.
2.2 Examinar el schema actual de las tablas de asociaciones en Supabase.
2.3 Identificar qué falta para el micrositio completo (según PRD sección 8).
2.4 Verificar si existe el rol admin_asociacion en el sistema de roles.

PASO 3 — SCHEMA ADICIONAL SI ES NECESARIO

Si falta alguna tabla del PRD (como fotos_asociacion):
Crear migración con las tablas faltantes, con RLS apropiada:
- admin_asociacion puede CRUD su propia asociación
- admin_general puede leer y editar cualquiera
- público puede leer datos publicados

PASO 4 — IMPLEMENTAR LAS RUTAS DEL MICROSITIO

Según el PRD sección 8.3:
app/asociaciones/page.js                            — directorio público
app/asociaciones/[slug]/page.js                    — inicio del micrositio
app/asociaciones/[slug]/autoridades/page.js        — comisión directiva
app/asociaciones/[slug]/agenda/page.js             — eventos propios
app/asociaciones/[slug]/galeria/page.js            — galería
app/asociaciones/[slug]/noticias/page.js           — novedades
app/asociaciones/[slug]/noticias/[id]/page.js      — noticia individual
app/asociaciones/[slug]/contacto/page.js           — contacto

Panel de administración de la asociación:
app/asociaciones/[slug]/admin/page.js              — dashboard del admin
app/asociaciones/[slug]/admin/inicio/page.js       — editar datos generales
app/asociaciones/[slug]/admin/autoridades/page.js  — gestionar directivos
app/asociaciones/[slug]/admin/agenda/page.js       — gestionar eventos
app/asociaciones/[slug]/admin/fotos/page.js        — gestionar galería
app/asociaciones/[slug]/admin/noticias/page.js     — gestionar noticias

Cada ruta del panel verifica:
  const { data } = await supabase.rpc('es_admin_asociacion', { slug_asociacion: params.slug })
  Si no es admin de esa asociación ni admin_general: redirect a /

PASO 5 — CARGAR UNA ASOCIACIÓN DE EJEMPLO

Para probar el sistema end-to-end, cargar datos reales (o plausibles) de una asociación:
- Nombre: "Asociación Gallega de Buenos Aires" (o una real si se tienen datos)
- Slug: asociacion-gallega-buenos-aires
- Directivos: 3-4 personas con cargo y foto placeholder
- 3 noticias de ejemplo
- 5 eventos futuros
- Descripción institucional completa

PASO 6 — VERIFICACIÓN EXHAUSTIVA

6.1 /asociaciones — lista con la asociación de ejemplo.
6.2 /asociaciones/[slug] — página de inicio carga correctamente.
6.3 Todas las sub-rutas del micrositio cargan sin errores.
6.4 El panel admin es accesible con admin_general pero no con usuario regular.
6.5 Editar datos desde el panel: los cambios se reflejan en la vista pública.
6.6 Subir una noticia: aparece en /noticias.
6.7 Mobile y modo oscuro: todo correcto.
6.8 npm run build limpio.

PASO 7 — COMMIT

7.1 git commit -m "feat(asociaciones): full micrositio system — public routes, admin panel, RBAC, example association"
7.2 git push. Actualizar ESTADO_PROYECTO.md.

Pasar al prompt P-06.
```

---

## P-06 — MODELO DE NEGOCIO Y PAGOS

```
Eres un ingeniero backend senior especializado en sistemas de pagos, suscripciones y 
feature flags. Tu tarea es implementar el modelo de negocio completo del portal.

PASO 1 — LECTURA OBLIGATORIA:
Lee todos los archivos en la raíz y todos los archivos en docs/ sin excepción.
Lee no pushear/Claves y contraseñas.txt.
Lee docs/PRD.md secciones 6 (membresías, planes, medios de pago) y 7 (módulos por etapa).
Lee las tablas existentes de planes y features en Supabase.
Solo entonces comienza.

PASO 2 — AUDITORÍA DEL SISTEMA DE PLANES ACTUAL

2.1 Examinar las tablas: features, plan_features, usuario_features, planes, suscripciones.
2.2 Verificar qué feature flags están activos y cuáles no.
2.3 Verificar cómo se verifica el plan de un usuario en el código actual.
2.4 Identificar qué features están actualmente disponibles para todos (sin verificación de plan).

PASO 3 — ACTIVAR LOS FEATURE FLAGS POR PLAN

3.1 Configurar en la base de datos los 3 planes definidos en el PRD:
    - Plan Gratuito: acceso a agenda, directorio, blog, quiénes somos, página de parroquia.
    - Plan Asociado: todo lo anterior + árbol genealógico + mediateca + library + historia oral.
    - Plan Asociación: todo lo anterior + micrositio propio.
3.2 Implementar el middleware de verificación de plan:
    lib/auth/checkFeatureAccess.js — recibe (userId, featureKey) y devuelve boolean
3.3 En cada ruta que requiere plan: aplicar checkFeatureAccess al inicio del Server Component.
3.4 Si el usuario no tiene el plan requerido: mostrar una página de upgrade, no un 403 crudo.
    La página de upgrade explica qué plan necesita y tiene CTA al checkout (P-06 B).

PASO 4 — INTEGRAR MERCADOPAGO

4.1 Crear una cuenta de prueba en MercadoPago developers (mercadopago.com.ar/developers).
    Guardar las credenciales (public key, access token de sandbox) en no pushear/.
4.2 Instalar el SDK: npm install mercadopago
4.3 Implementar el flujo de checkout:
    app/api/pagos/crear-preferencia/route.js — POST que recibe plan_id y crea preferencia MP
    app/api/pagos/webhook/route.js — POST que recibe notificaciones IPN de MP
    app/planes/page.js — página de planes con pricing y botones de contratar
    app/checkout/[plan]/page.js — página de checkout con el botón de MP
4.4 Cuando el webhook confirma el pago:
    - Insertar o actualizar registro en suscripciones
    - Activar las features del plan en usuario_features
    - Enviar email de bienvenida (si hay sistema de email configurado)
4.5 Probar el flujo completo en sandbox:
    - Ir a /planes
    - Seleccionar plan Asociado
    - Completar el checkout con tarjeta de prueba de MP (4509953566233704)
    - Verificar que el webhook se recibe
    - Verificar que el usuario tiene acceso al árbol después del pago

PASO 5 — PÁGINA DE PLANES

/planes muestra los 3 planes en columnas:
- Nombre del plan
- Precio (desde la base de datos, no hardcodeado)
- Lista de features incluidas
- CTA: "Empezar gratis" (gratuito) / "Suscribirme" (pagos)
- El plan actual del usuario está resaltado
En mobile: planes apilados verticalmente.

PASO 6 — VERIFICACIÓN EXHAUSTIVA

6.1 Usuario sin plan: puede acceder a blog y landing. NO puede acceder al árbol.
6.2 Upgrade a plan Asociado: puede acceder al árbol.
6.3 El webhook de MP procesa correctamente en sandbox.
6.4 La página /planes carga con precios reales desde la BD.
6.5 npm run build limpio.

PASO 7 — COMMIT

7.1 git commit -m "feat(pagos): MercadoPago integration — checkout flow, webhooks, feature flags by plan, /planes page"
7.2 git push. Actualizar ESTADO_PROYECTO.md.

Pasar al prompt P-07.
```

---

## P-07 — HISTORIA ORAL Y COMUNIDAD PROFUNDA

```
Eres un desarrollador fullstack senior y arquitecto de plataformas comunitarias. 
Tu tarea es implementar el módulo de Historia Oral (Fonoteca ampliada) y las 
funcionalidades de comunidad profunda que convierten el portal en un archivo vivo.

PASO 1 — LECTURA OBLIGATORIA:
Lee todos los archivos en la raíz y todos los archivos en docs/ sin excepción.
Lee no pushear/Claves y contraseñas.txt.
Lee VISION.md con especial atención a la sección "Historia oral / Fonoteca".
Lee docs/LEGAJO_FUTURO_legacy.md para contexto de decisiones anteriores.
Solo entonces comienza.

PASO 2 — MÓDULO DE HISTORIA ORAL

El módulo de Historia Oral es la Fonoteca de la Mediateca con capacidades de contribución.
Diferencia clave con el resto de la Mediateca: los usuarios pueden subir sus propios 
testimonios (con moderación).

2.1 Schema adicional si es necesario:
    La tabla mediateca_items ya tiene tipo='grabacion_oral'. Agregar si falta:
    - campo duracion_segundos INT para grabaciones
    - campo transcripcion TEXT para la transcripción del relato oral
    - campo sujeto_nombre TEXT para el nombre de quien da el testimonio
    - campo sujeto_edad INT para la edad del testimonio
    - campo sujeto_origen_id FK a galicia_parroquias

2.2 Flujo de contribución de un testimonio:
    /mediateca/testimonios/contribuir — formulario para subir un testimonio
    Campos: título del testimonio, nombre del sujeto (opcional), edad aproximada, 
    lugar de origen en Galicia (buscador del módulo territorial), archivo de audio/video,
    descripción del contenido, consentimiento explícito de uso.
    Al subir: estado='borrador', notifica al admin.
    El admin revisa en /admin/mediateca/testimonios y aprueba o rechaza.

2.3 Player de audio inline en la página del testimonio:
    Usar el elemento HTML5 <audio controls> con los estilos del portal.
    Si es video: <video controls>.
    Si el archivo está en Supabase Storage: construir la URL pública correctamente.

2.4 Supabase Storage:
    Crear un bucket 'mediateca-testimonios' con acceso público para archivos aprobados.
    Implementar la subida de archivos en el formulario de contribución.
    Límite de tamaño: 100MB por archivo.

PASO 3 — PANEL DE MODERACIÓN DE LA MEDIATECA

app/admin/mediateca/page.js — lista todos los ítems pendientes de aprobación
app/admin/mediateca/[id]/page.js — vista de detalle para moderar un ítem específico
Acciones: Aprobar (estado='publicado'), Rechazar con motivo, Editar metadatos.

PASO 4 — VERIFICACIÓN EXHAUSTIVA

4.1 Subir un testimonio de audio de prueba (archivo .mp3 de prueba).
4.2 El testimonio aparece en /admin/mediateca con estado 'borrador'.
4.3 Aprobar desde el panel: el testimonio aparece en /mediateca/testimonios.
4.4 El player de audio funciona en la página del testimonio.
4.5 En mobile: el player es usable con controles touch.
4.6 npm run build limpio.

PASO 5 — COMMIT

5.1 git commit -m "feat(historia-oral): audio/video contribution flow, Supabase Storage, admin moderation panel"
5.2 git push. Actualizar ESTADO_PROYECTO.md marcando Fase 7 iniciada.

NOTA FINAL: Esta es la fase sin fecha de cierre. El módulo crece con la comunidad.
Documentar en ESTADO_PROYECTO.md qué quedó implementado y qué sigue abierto para 
futuras iteraciones.
```

---

*Documento creado el 28 de junio de 2026.*
*Cada prompt es autocontenido y puede ejecutarse en una sesión de Claude Code independiente.*
*Secuencia obligatoria: P-00 → P-01-A → P-01-B → P-01-C → P-02-A → P-02-B → P-02-C → P-03-A → P-03-B → P-04-A → P-04-B → P-05 → P-06 → P-07*
