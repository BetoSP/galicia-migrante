# Legajo para el Futuro — Galicia Migrante
### Ideas bien documentadas que no implementaremos por ahora
**Versión:** 1.0 — 19 de mayo de 2026
**Estado:** Documento vivo — se actualiza en cada sesión de trabajo

---

## Qué es este documento

El Legajo para el Futuro es el archivo vivo de ideas de Galicia Migrante que no entran en el plan actual pero merecen ser preservadas con contexto suficiente para retomarse cuando llegue su momento.

**No es un cementerio de features.** Cada entrada tiene:
- Qué es y qué problema resuelve
- Por qué no la implementamos ahora
- Qué condiciones tendrían que darse para retomar la idea
- Referencias técnicas o de producto relevantes

Las ideas aquí no están descartadas — están en espera con buena documentación.

---

## Índice

1. [Árbol genealógico](#1-árbol-genealógico)
2. [Fotos y documentos](#2-fotos-y-documentos)
3. [Matching e investigación](#3-matching-e-investigación)
4. [Portal y comunidad](#4-portal-y-comunidad)
5. [Infraestructura y tecnología](#5-infraestructura-y-tecnología)
6. [DNA y biología](#6-dna-y-biología)
7. [Ideas de producto sin categoría definida](#7-ideas-de-producto-sin-categoría-definida)

---

## 1. Árbol genealógico

---

### 1.1 Fan View — vista de abanico

**Qué es:**
Vista del árbol en forma de semicírculo o abanico, con el individuo central en el medio y sus ancestros directos desplegándose hacia afuera por generaciones. MyHeritage la ofrece en modo estándar y en modo color por rama.

**Por qué no ahora:**
El MVP prioriza la Family View navegable. La Fan View es una visualización complementaria — útil y viral, pero no bloquea el uso core del árbol. Requiere un renderer alternativo sobre Cytoscape.js (que ya está en uso) más trabajo de diseño visual.

**Cuándo retomar:**
Segunda etapa, junto con las otras vistas alternativas del árbol. Especialmente relevante cuando se active la funcionalidad de compartir en redes sociales — la Fan View es el formato más compartible genealógico que existe.

**Diferencial para GM:**
Renderizar con la paleta azul/dorado del portal y exportar con la marca de Galicia Migrante. Herramienta de adquisición orgánica — la gente la comparte en Instagram y Facebook.

**Referencias:**
MyHeritage Fan View (sección 2.3 de myheritage.md). Cytoscape.js ya disponible como motor de layout.

---

### 1.2 Pedigree View — vista de línea directa

**Qué es:**
Vista que muestra solo la línea directa de ancestros de una persona, sin hijos ni colaterales. Se navega hacia atrás en el tiempo generación a generación. Configurable entre 3 y 7+ generaciones visibles simultáneamente.

**Por qué no ahora:**
La Family View cubre el caso de uso principal. La Pedigree View es útil para árboles grandes donde se quiere explorar la línea directa sin el ruido de los colaterales, pero no es prioritaria para el MVP ni para la segunda etapa temprana.

**Cuándo retomar:**
Segunda etapa tardía o tercera etapa. Prioritaria cuando los usuarios tengan árboles de más de 100 personas.

**Referencias:**
MyHeritage Pedigree View (sección 2.2 de myheritage.md).

---

### 1.3 Color-coding por rama o país de origen

**Qué es:**
Sistema de colores aplicado a los nodos del árbol para identificar visualmente a qué rama familiar pertenece cada persona (materna/paterna) o de qué país proviene. Configurable por el usuario.

**Por qué no ahora:**
El árbol actual tiene identidad visual consistente (azul/dorado). Agregar color-coding requiere un sistema de paletas por rama que no existe y que agrega complejidad de UI sin impacto en el MVP.

**Cuándo retomar:**
Segunda etapa junto con las vistas alternativas del árbol. Especialmente útil combinado con la Fan View.

**Diferencial para GM:**
El color-coding por origen territorial (Galicia vs. Argentina vs. otros países de migración) tiene un significado narrativo especial para la diáspora. No solo es decorativo — cuenta la historia de la dispersión familiar.

---

### 1.4 Consistency Checker — verificador de consistencia lógica

**Qué es:**
Motor que detecta errores lógicos automáticamente: fechas imposibles (nacimiento después de fallecimiento), edades implausibles (madre a los 8 años, persona de 180 años), relaciones circulares (A es padre de B que es padre de A), datos críticos faltantes. Se ejecuta automáticamente al importar GEDCOM y opcionalmente bajo demanda.

**Por qué no ahora:**
El importador GEDCOM tolerante ya maneja muchos casos de datos sucios en la importación. El Consistency Checker es una capa adicional de calidad de datos que no es crítica para el MVP pero sí lo será cuando los árboles crezcan y cuando empiece el matching entre árboles.

**Cuándo retomar:**
Alta prioridad para segunda etapa — antes de activar cualquier funcionalidad de matching entre árboles. Los datos sucios en escala son un problema difícil de resolver retroactivamente.

**Notas técnicas:**
Las reglas de consistencia viven en la base de datos (o en un módulo de validación del frontend). Las reglas básicas son: fecha_nacimiento < fecha_fallecimiento, edad_al_tener_primer_hijo > 12, edad_al_tener_ultimo_hijo < 70 para mujeres, no ciclos en relaciones padre/hijo. Las reglas más complejas (relaciones circulares) requieren traversal del grafo — Cytoscape.js puede hacerlo.

**Referencias:**
MyHeritage Consistency Checker (sección 4.4 de myheritage.md).

---

### 1.5 Instant Discoveries — incorporación masiva de ramas

**Qué es:**
Funcionalidad que permite agregar ramas enteras de árbol (10 a 50 personas) en un solo clic, basándose en coincidencias con árboles de otros usuarios de la plataforma. El usuario revisa los datos propuestos persona por persona y acepta o rechaza en bloque.

**Por qué no ahora:**
Requiere masa crítica de árboles en la plataforma para tener coincidencias significativas. En el estado actual (MVP, usuarios iniciales) no hay suficiente volumen para que esta funcionalidad aporte valor real. El modelo de MyHeritage funciona porque tiene millones de árboles — GM necesita construir esa base primero.

**Cuándo retomar:**
Tercera etapa, después de que el matching semántico entre árboles esté activo y haya volumen suficiente de usuarios con árboles cargados.

**Notas importantes:**
El equivalente en GM no sería igual a MyHeritage. El foco sería en coincidencias dentro de la comunidad gallega/argentina — "esta persona de tu árbol podría ser la misma que en el árbol de otro usuario de GM". Requiere Neo4j para escalar correctamente.

---

### 1.6 Imprimir gráficos y libros genealógicos

**Qué es:**
Exportar el árbol genealógico como gráfico imprimible (PDF A3/A4, póster) o como libro narrativo con fotos, datos y fechas organizados por generación. MyHeritage ofrece exportación a PDF del árbol en vista pedigrí y vista abanico, y también un servicio de libro impreso físico.

**Por qué no ahora:**
El CRUD del árbol y la visualización son prioridades. La impresión es un feature de consumo/compartir que viene después de que el árbol tenga contenido suficiente.

**Cuándo retomar:**
Segunda etapa tardía. El libro impreso físico (como producto físico vendible) podría ser un feature de monetización interesante para tercera etapa.

**Notas técnicas:**
La exportación a PDF del árbol se puede hacer con jsPDF o Puppeteer. El libro genealógico requiere una plantilla de diseño editorial — trabajo no trivial.

---

### 1.7 Mapa de migraciones familiares

**Qué es:**
Visualización geográfica que muestra en un mapa los orígenes y destinos de las personas del árbol. Líneas de migración entre lugares de nacimiento, residencia y fallecimiento. Filtrable por época, rama familiar o apellido. Muestra la dispersión de la familia en el espacio y el tiempo.

**Por qué no ahora:**
Requiere que los perfiles tengan datos de lugar estructurados (parroquia/aldea para Galicia, provincia/ciudad para Argentina). Hoy los campos de lugar son texto libre. Además, la visualización de grafos geográficos a escala requiere Neo4j y Mapbox — tecnologías de tercera etapa.

**Cuándo retomar:**
Tercera etapa, junto con Neo4j. Es uno de los features más poderosos narrativamente — ver en un mapa cómo una familia de Lugo terminó dispersa entre Buenos Aires, Montevideo y São Paulo es exactamente el tipo de narrativa emocional que define al proyecto.

**Diferencial para GM:**
El mapa de migraciones gallegas tiene una identidad propia muy fuerte. No es un mapa de migraciones genérico — es específicamente la diáspora gallega al Río de la Plata, con sus rutas de barco, sus puertos, sus fechas históricas. Integrar datos de barcos (CEMLA) haría esto único a nivel mundial.

**Referencias:**
MyHeritage Migration Map (sección 2.5 de myheritage.md). Neo4j para grafos de relaciones. Mapbox para visualización geográfica.

---

### 1.8 Padrinos y madrinas como vínculos reales del árbol

**Qué es:**
En lugar de registrar padrinos y madrinas como texto libre (como hace MyHeritage), vincularlos como personas reales del árbol o de árboles de otros usuarios. Esto permite reconstruir la red social de la parroquia gallega: quiénes eran los padrinos habituales, qué familias se vinculaban entre sí por el padrinazgo, cómo se propagaba el vínculo a través de generaciones.

**Por qué no ahora:**
El campo de padrinos como texto libre ya aporta valor básico en segunda etapa. El vínculo como persona real del árbol requiere el sistema de matching entre árboles (tercera etapa) para ser verdaderamente útil — de lo contrario solo funciona dentro del mismo sitio familiar.

**Cuándo retomar:**
Tercera etapa, junto con el matching semántico y el repositorio propio de registros históricos. En los libros sacramentales gallegos (bautismos, confirmaciones) los padrinos están siempre registrados — con un repositorio propio digitalizado, los padrinos se pueden vincular automáticamente.

**Diferencial para GM:**
Esta funcionalidad no existe en ninguna plataforma genealógica. La red de padrinazgo gallega es un objeto de estudio histórico único — reconstruirla a escala sería un aporte genuino a la memoria histórica.

---

### 1.9 Educación en el perfil de persona — múltiples entradas

**Qué es:**
Sección del perfil que registra el historial educativo de una persona: tipo de educación (primaria, secundaria, universidad, formación técnica), nombre de la institución, título o materia, período de inicio y fin, notas. Puede tener múltiples entradas sin límite.

**Por qué no ahora:**
El perfil básico (MVP) cubre los datos vitales esenciales. La educación es un campo relevante pero secundario en el contexto genealógico de la diáspora gallega del siglo XIX-XX, donde la mayoría de los emigrantes tenían instrucción básica o nula. Su valor aumenta para generaciones más recientes.

**Cuándo retomar:**
Segunda etapa, junto con el perfil extendido completo. Se implementa como parte del mismo módulo que emigración, bautismo, servicio militar y ocupaciones múltiples.

**Notas para GM:**
Los campos más relevantes en el contexto gallego son: escuela primaria en la parroquia de origen (muchas veces el único registro de alfabetización), formación en Argentina (escuelas del Centro Gallego, colegios de la colectividad), títulos universitarios de la segunda generación. El campo "institución" debería tener autocompletado con nombres de instituciones históricas conocidas de la colectividad gallega argentina.

**Referencias:**
MyHeritage sección 3.6 de myheritage.md.

---

## 2. Fotos y documentos

---

### 2.1 In Color™ — colorización de fotos históricas

**Qué es:**
Colorización automática de fotos en blanco y negro usando deep learning. El algoritmo detecta si la foto es B&N o color desvanecido y aplica colores históricamente plausibles. Sin intervención manual del usuario.

**Por qué no ahora:**
Requiere un microservicio de IA (Python + FastAPI, tercera etapa). En MVP y segunda etapa no hay infraestructura de IA propia. Existen APIs de terceros (DeepAI, Replicate) pero introducen dependencias externas y costos variables.

**Cuándo retomar:**
Tercera etapa, junto con el microservicio Python + FastAPI. Evaluar usar un modelo open source hosteado propio (DeOldify, DDColor) vs. API de terceros.

**Notas técnicas:**
Los modelos de colorización más usados: DeOldify (clásico), DDColor (2023, más preciso), Colorize (Replicate API). Para fotos históricas de 1880–1960, DDColor tiene los mejores resultados documentados.

---

### 2.2 Photo Enhancer — mejora y upscaling de fotos

**Qué es:**
Aumenta la resolución de fotos antiguas (upscaling) y enfoca rostros borrosos usando deep learning. Especialmente efectivo en fotos de baja resolución o con caras desenfocadas.

**Por qué no ahora:**
Mismo caso que colorización — requiere microservicio Python, tercera etapa.

**Cuándo retomar:**
Tercera etapa, en el mismo microservicio de IA que colorización. Los modelos de upscaling (ESRGAN, Real-ESRGAN) y face restoration (GFPGAN, CodeFormer) son open source y bien documentados.

---

### 2.3 Photo Repair — restauración de daños

**Qué es:**
Reparación automática de fotos dañadas: rayones, roturas, manchas, dobleces, agujeros. Proceso completamente automático. El resultado es la foto sin marcas de daño visibles.

**Por qué no ahora:**
Tercera etapa — mismo microservicio Python. Los modelos de inpainting (LaMa, Stable Diffusion Inpainting) requieren GPU para tiempos razonables.

**Cuándo retomar:**
Tercera etapa. Importante: para fotos históricas gallegas dañadas (muchas familias trajeron fotos en muy mal estado desde Galicia) esto tiene un valor emocional enorme. Es uno de los features con mayor impacto percibido por el usuario final.

---

### 2.4 Deep Nostalgia™ — animación de fotos fijas

**Qué es:**
Toma un rostro en una foto fija y lo anima: el sujeto parpadea, sonríe, gira la cabeza. El resultado es un video corto (GIF/MP4). Viral en redes sociales — permite "ver" a ancestros fallecidos en movimiento.

**Por qué no ahora:**
Requiere modelos de IA generativa (video synthesis) que van más allá del microservicio básico de fotos. Alto costo computacional. MyHeritage lo ofrece como feature premium.

**Cuándo retomar:**
Cuarta etapa o cuando el costo de los modelos de síntesis de video baje significativamente. Evaluar APIs de terceros (Runway, D-ID) como alternativa a modelo propio.

**Notas importantes:**
Este feature tiene implicaciones éticas a considerar: animar el rostro de una persona fallecida sin consentimiento explícito de sus descendientes puede generar controversia. Requiere una política clara antes de implementar.

---

### 2.5 PhotoDater™ — datación de fotos por análisis visual

**Qué es:**
Analiza elementos visuales de una foto (ropa, peinado, objetos, arquitectura) usando IA y estima la fecha en que fue tomada. Da un rango de años con explicación de los elementos que determinaron la estimación.

**Por qué no ahora:**
Requiere un modelo de visión computacional entrenado en fotografía histórica. No existe un modelo open source especializado en fotografía gallega o rioplatense del período 1880–1960.

**Cuándo retomar:**
Tercera etapa como feature experimental. Para el contexto de GM, los elementos visuales relevantes son distintos a los del mercado anglosajón para el que están entrenados los modelos existentes — se necesitaría fine-tuning.

---

### 2.6 Photo Storyteller™ — audio e historias adjuntas a fotos

**Qué es:**
Permite grabar o adjuntar audio a una foto para contar la historia detrás de la imagen. La grabación queda archivada junto a la foto y es visible para los miembros del sitio familiar.

**Por qué no ahora:**
Requiere infraestructura de almacenamiento de audio (Supabase Storage o Cloudflare Stream) y un player de audio en el frontend. No es complejo técnicamente, pero tampoco es prioritario para el MVP.

**Cuándo retomar:**
Segunda etapa tardía o tercera etapa, junto con el módulo de Historia Oral. Hay una convergencia natural entre Photo Storyteller y Historia Oral — ambos son formas de preservar la memoria en audio ligada a contenido visual.

**Diferencial para GM:**
Para la primera generación de emigrantes (que todavía está viva o cuyos hijos directos aún recuerdan), este feature tiene un valor de preservación histórica irreemplazable. Cada grabación que se pierda es memoria que no vuelve.

---

### 2.7 Scanner de fotos con cámara del móvil

**Qué es:**
App móvil (o funcionalidad de la app) que permite escanear fotos físicas usando la cámara del smartphone con alta resolución. Las fotos escaneadas se sincronizan automáticamente con el árbol.

**Por qué no ahora:**
Requiere la app móvil nativa, que es tercera etapa.

**Cuándo retomar:**
Tercera etapa, junto con la app React Native. Es uno de los casos de uso centrales de la app móvil — la cámara como herramienta de digitalización de memoria familiar.

---

## 3. Matching e investigación

---

### 3.1 Smart Matching — coincidencias entre árboles de GM

**Qué es:**
Motor que compara automáticamente personas de distintos árboles dentro de Galicia Migrante para detectar posibles ancestros en común. Usa algoritmos fonéticos y lingüísticos para tolerar variaciones de nombres, errores de escritura y diferencias entre idiomas (gallego, español, portugués, inglés).

**Por qué no ahora:**
Requiere masa crítica de árboles. Con pocos usuarios, las coincidencias son escasas y el feature no aporta valor real. Técnicamente, el matching a escala requiere indexación eficiente (posiblemente Neo4j) y un motor de comparación robusto.

**Cuándo retomar:**
Tercera etapa, con Neo4j disponible. La condición previa es tener una base de usuarios con árboles cargados que justifique el motor de matching.

**Diferencial para GM:**
El matching de GM no es genérico — se concentra en la diáspora gallega. Los apellidos, los topónimos y los patrones de emigración son específicos. Eso permite entrenar un motor más preciso para este nicho que el de MyHeritage para el mercado general.

---

### 3.5 Vinculación entre árboles — personas compartidas

**Qué es:**
Mecanismo para que una persona que existe en un árbol aparezca como referencia en otro árbol distinto, sin duplicar sus datos. Cuando Alberto (Familia Sánchez) se casa con Adriana (Familia Fraguio), Adriana aparece en el árbol Sánchez con el icono 🔗 indicando que es una referencia a su árbol natural.

**Especificación:**
- Una persona tiene un **árbol natural** donde vive y se edita
- En otros árboles aparece como **referencia** con icono 🔗
- Al editar desde una referencia: el sistema avisa "estás editando una persona de otro árbol — los cambios afectan a ambos"
- La **descendencia compartida** (hijos de personas de dos árboles distintos) pertenece a ambos árboles simultáneamente — no son referencia en ninguno
- **Mecanismo de vinculación manual**: al agregar pareja/familiar, opción "buscar en otros árboles" además de "crear persona nueva"
- La búsqueda funciona en árboles propios del usuario y árboles públicos o con acceso compartido

**Por qué no ahora:**
Requiere un modelo de datos adicional (`referencias_persona`: árbol_origen_id, persona_id, árbol_destino_id) y lógica de sincronización entre árboles. En el MVP con un solo árbol por usuario no era necesario.

**Cuándo retomar:**
Segunda etapa — junto con el sistema multi-árbol ya implementado. La tabla `referencias_persona` es la migración 011.

**Prerequisito para el Smart Matching:**
En tercera etapa, el Smart Matching detectará automáticamente personas que podrían ser la misma en distintos árboles y propondrá el vínculo. La vinculación manual de segunda etapa es el paso previo.

**Referencias:**
Patrón Titular/Referencia documentado en `myheritage.md` sección 24.2.

**Qué es:**
Motor que busca automáticamente en el repositorio propio de registros históricos gallegos (libros sacramentales, registros de inmigración, censos, padrones) personas que coincidan con ancestros del árbol del usuario.

**Por qué no ahora:**
Requiere el repositorio propio de registros históricos, que es tercera etapa. Sin el repositorio, no hay registros contra los que hacer matching.

**Cuándo retomar:**
Tercera etapa, junto con el repositorio propio. El repositorio propio (archivos diocesanos de Galicia, Arquivo de Galicia, registros CEMLA/AGN) es la condición previa necesaria.

**Diferencial para GM:**
FamilySearch tiene los registros parroquiales gallegos digitalizados pero no indexados de forma accesible. Construir el índice propio y el motor de matching sobre esos registros sería un aporte único a la comunidad genealógica gallega a nivel mundial.

---

### 3.3 SuperSearch — motor de búsqueda de registros históricos

**Qué es:**
Buscador unificado de registros históricos por nombre, apellido, lugar de nacimiento, lugar de residencia y año. Cubre múltiples colecciones simultáneamente (civil, eclesiástico, censos, inmigración). Con búsqueda fonética y tolerancia a variaciones de escritura.

**Por qué no ahora:**
No hay colecciones propias de registros históricos todavía. El buscador sin repositorio propio es una cáscara vacía.

**Cuándo retomar:**
Tercera etapa, junto con el repositorio propio. La arquitectura del buscador (Elasticsearch o búsqueda vectorial) se define cuando el repositorio tenga volumen suficiente.

---

### 3.4 Reconstrucción colaborativa — indexación voluntaria de documentos

**Qué es:**
Módulo donde usuarios voluntarios indexan y transcriben documentos históricos del repositorio propio de GM. Similar al programa de indexación voluntaria de FamilySearch. Cada documento transcrito por voluntarios se vuelve buscable para toda la comunidad.

**Por qué no ahora:**
Requiere masa crítica de usuarios comprometidos y el repositorio propio de documentos. Es un proyecto comunitario que no tiene sentido sin comunidad establecida.

**Cuándo retomar:**
Tercera etapa tardía o cuarta etapa. Condiciones previas: repositorio propio activo, base de usuarios establecida, sistema de gamificación para motivar la contribución voluntaria.

**Notas importantes:**
Este es uno de los features más poderosos del concepto original del PRD — "archivo vivo de la diáspora" y "proyecto de reconstrucción colaborativa". Requiere mucho trabajo previo para que sea posible, pero cuando llegue tiene el potencial de diferenciar a GM de cualquier otra plataforma.

---

## 4. Portal y comunidad

---

### 4.1 Mensajería interna entre usuarios

**Qué es:**
Sistema de mensajería directa entre usuarios de GM: entre miembros del mismo sitio familiar, entre usuarios con posibles ancestros en común (Smart Matches), entre usuarios de la misma parroquia de origen. Con bandeja de entrada, notificaciones y gestión de mensajes.

**Por qué no ahora:**
Requiere backend activo (NestJS) para WebSockets o notificaciones en tiempo real. En MVP el backend está inactivo. Además, la mensajería sin matching entre árboles no tiene el caso de uso más valioso (contactar a alguien que comparte ancestros).

**Cuándo retomar:**
Segunda etapa tardía, cuando el backend NestJS esté activo. La mensajería entre miembros del mismo sitio familiar es el primer paso — más simple y no requiere matching.

---

### 4.2 Gamificación cultural — logros y desafíos

**Qué es:**
Sistema de logros y desafíos para incentivar la participación y el completado del árbol. Ejemplos: "Llegaste a la 4ª generación", "Vinculaste a tu primer ancestro con una parroquia gallega", "Completaste los datos de 10 personas", "Subiste tu primera foto histórica". Orientado especialmente a la tercera y cuarta generación.

**Por qué no ahora:**
La gamificación sin contenido suficiente (árbol completo, matching, registros históricos) se siente vacía. Los logros tienen que celebrar cosas que realmente importan, no solo acciones mecánicas.

**Cuándo retomar:**
Segunda etapa tardía o tercera etapa. Las condiciones previas son: árbol con perfil extendido, matching activo, registros históricos disponibles. Con esos elementos, los logros tienen significado real.

**Diferencial para GM:**
Los logros pueden tener nombres en gallego con significado cultural propio. "Encontraches as túas raíces" (Encontraste tus raíces) cuando se vincula el primer ancestro a una parroquia. Esto es diferente a los badges genéricos de MyHeritage.

---

### 4.3 Notificaciones push — cumpleaños, aniversarios y eventos

**Qué es:**
Notificaciones automáticas cuando se acerca el cumpleaños o aniversario de una persona del árbol. También notificaciones de nuevos matches, mensajes recibidos, y cambios en el árbol compartido.

**Por qué no ahora:**
Requiere backend activo para el sistema de notificaciones programadas. El punto de extensión ya está marcado en `EventosFamiliares.jsx`.

**Cuándo retomar:**
Segunda etapa, cuando el backend NestJS esté activo. Es uno de los primeros features del backend — no complejo de implementar y con alto valor de engagement.

---

### 4.4 Comunidades de parroquias y apellidos

**Qué es:**
Microcomunidades dentro del portal organizadas por parroquia de origen o por apellido. Usuarios que comparten la misma parroquia ancestral o el mismo apellido pueden conectarse, compartir documentos y colaborar en la reconstrucción de la historia de ese lugar o linaje.

**Por qué no ahora:**
Las comunidades sin masa crítica de usuarios son espacios vacíos. Requiere también el seed territorial del IGE (parroquias) y el sistema de matching para que los usuarios puedan ser agrupados automáticamente por origen.

**Cuándo retomar:**
Tercera etapa. Las comunidades de parroquias son especialmente poderosas combinadas con el repositorio propio de registros históricos — cada parroquia puede tener su propio archivo digitalizado.

---

### 4.5 Generación de contenido para redes sociales

**Qué es:**
Herramienta que genera imágenes y posts compartibles desde descubrimientos genealógicos. Ejemplos: "Mi bisabuelo llegó a Buenos Aires en 1902 desde Lugo, Galicia" con imagen del árbol, foto antigua y datos del viaje. Formato optimizado para Instagram, Facebook y WhatsApp.

**Por qué no ahora:**
Requiere que los perfiles tengan datos suficientes (fotos, lugares, fechas del viaje migratorio) para generar contenido de calidad. Con datos escasos, el contenido generado es genérico y no vale la pena compartirlo.

**Cuándo retomar:**
Tercera etapa, junto con el módulo de fotos con IA y el evento de emigración/inmigración como campo destacado del perfil. La combinación de foto coloreada + datos del viaje migratorio + diseño con la identidad de GM es un producto viral natural.

---

### 4.6 Actividades presenciales coordinadas desde el portal

**Qué es:**
Sistema de organización de encuentros presenciales: reuniones de descendientes de una misma parroquia, talleres genealógicos, viajes de reconexión a Galicia, festivales híbridos. El portal actúa como coordinador — inscripción, agenda, grupos de viaje, documentación post-evento.

**Por qué no ahora:**
Requiere una comunidad establecida y relaciones institucionales (con centros gallegos, con la Xunta, con agencias de turismo especializadas). No es un feature técnico sino un producto de comunidad.

**Cuándo retomar:**
Cuarta etapa o cuando la comunidad de usuarios tenga masa crítica. Las condiciones previas son: base de usuarios activa, micrositios de asociaciones operativos, relaciones con la Xunta de Galicia.

---

## 5. Infraestructura y tecnología

---

### 5.1 Neo4j — grafos de redes migratorias

**Qué es:**
Base de datos de grafos para modelar y consultar redes de relaciones entre árboles genealógicos, patrones de migración, rutas de barcos y conexiones entre familias. Complementa a PostgreSQL (que maneja datos estructurados) con consultas de relaciones complejas que son imposibles o muy ineficientes en SQL.

**Por qué no ahora:**
El MVP y la segunda etapa no requieren consultas de grafos. PostgreSQL es suficiente para el árbol de un usuario. Neo4j entra cuando el sistema necesita consultar relaciones entre árboles de múltiples usuarios a escala.

**Cuándo retomar:**
Tercera etapa, como capa adicional de la arquitectura (polyglot persistence). Neo4j AuraDB (managed) es la opción para no gestionar infraestructura propia.

**Notas técnicas:**
El modelo de datos en Neo4j refleja el mismo grafo de personas y relaciones de PostgreSQL pero optimizado para traversal. La sincronización entre ambas BDs es unidireccional en principio: PostgreSQL es la fuente de verdad, Neo4j es el índice de grafos.

---

### 5.2 Docker y containerización

**Qué es:**
Containerización de todos los servicios (frontend, backend NestJS, microservicio Python) con Docker y Docker Compose para garantizar consistencia entre entornos y facilitar el deploy.

**Por qué no ahora:**
Con un solo servicio activo (frontend en Vercel), Docker agrega complejidad sin beneficio. Cuando haya múltiples servicios (NestJS + FastAPI + Neo4j) la containerización pasa a ser necesaria.

**Cuándo retomar:**
Tercera etapa, cuando el microservicio Python + FastAPI entre en juego. La combinación NestJS + FastAPI es el trigger natural para adoptar Docker Compose.

---

### 5.3 GitHub Actions — CI/CD y tests automáticos

**Qué es:**
Pipeline de integración continua que ejecuta tests automáticos, linting y checks de seguridad en cada push. Deploy automático condicionado a que los tests pasen.

**Por qué no ahora:**
Sin tests escritos, el pipeline está vacío. La inversión en CI/CD tiene sentido cuando hay tests que ejecutar y múltiples personas contribuyendo al código.

**Cuándo retomar:**
Segunda etapa, junto con la migración a TypeScript. TypeScript + tests es la combinación que hace que el CI/CD tenga valor real.

---

### 5.4 App móvil nativa (React Native)

**Qué es:**
Aplicación móvil nativa para iOS y Android construida con React Native, compartiendo la lógica de negocio con el frontend web. Casos de uso específicos del móvil: notificaciones push, cámara para escanear documentos y fotos, mapa familiar, compartir descubrimientos. Seguridad biométrica (Face ID / Touch ID).

**Por qué no ahora:**
El MVP y la segunda etapa priorizan el producto web. La app móvil requiere una base sólida de backend (NestJS activo) y un producto web estable antes de bifurcarse en una plataforma adicional.

**Cuándo retomar:**
Tercera etapa. Las condiciones previas son: producto web estable, backend NestJS activo, base de usuarios que justifique la inversión en la app.

---

### 5.5 Integración con FamilySearch OAuth

**Qué es:**
Login con cuenta FamilySearch, importación de árboles desde FamilySearch, búsqueda de registros parroquiales gallegos en la base de datos de FamilySearch, y matching entre el árbol de GM y los registros de FamilySearch.

**Por qué no ahora:**
Requiere registro como desarrollador en FamilySearch (acción externa pendiente — marcada como ⚠️ URGENTE en CLAUDE.md) y desarrollo del flujo OAuth completo.

**Cuándo retomar:**
Segunda etapa, después de completar el registro como desarrollador. FamilySearch tiene los libros sacramentales gallegos digitalizados — la integración tiene un valor enorme para los usuarios que investigan sus raíces en Galicia.

**Acción inmediata requerida:**
Registrarse en https://www.familysearch.org/developers/ — no requiere desarrollo, solo gestión administrativa.

---

### 5.6 Cloudflare CDN y protección DDoS

**Qué es:**
Red de distribución de contenido (CDN) y capa de protección contra ataques DDoS. Reduce latencia para usuarios en España y Galicia (el servidor está en São Paulo).

**Por qué no ahora:**
Con el tráfico actual (MVP), la latencia adicional no es un problema significativo y el riesgo de DDoS es bajo. Vercel ya incluye CDN básico.

**Cuándo retomar:**
Cuando el tráfico lo justifique o cuando se establezcan relaciones institucionales con la Xunta (que podría atraer tráfico de España/Europa en volumen).

---

## 6. DNA y biología

---

### 6.1 Test de ADN y DNA matching

**Qué es:**
Test de ADN autosómico que permite identificar parientes genéticos entre usuarios de la plataforma. Incluye breakdown de etnicidad, DNA matches, Chromosome Browser y AutoClusters. MyHeritage es uno de los líderes en este servicio.

**Por qué no implementar nunca (o muy lejanamente):**
El diferencial de GM no es genético sino cultural, territorial e histórico. El ADN es costoso (requiere laboratorio, kits físicos, infraestructura genómica), altamente regulado (GDPR, HIPAA, regulaciones específicas de ADN en distintos países), y compite con servicios ya establecidos (23andMe, AncestryDNA, MyHeritage DNA). El foco de GM — la reconstrucción de la experiencia migratoria gallega — se logra con genealogía documental, no con genética.

**Si se retoma algún día:**
La opción más accesible sería permitir la subida de ADN de otros servicios (como hace MyHeritage gratuitamente) para matching interno, sin ofrecer el kit propio. Pero incluso esto requiere infraestructura genómica no trivial y regulación específica.

---

### 6.2 Theory of Family Relativity — combinación de ADN y árbol

**Qué es:**
Sistema que combina datos genéticos con árboles genealógicos y registros históricos para proponer teorías sobre cómo dos personas con ADN compartido podrían estar relacionadas.

**Por qué no ahora:**
Depende completamente del DNA matching (6.1). Sin ADN, no hay teorías de relación genética.

**Cuándo retomar:**
Solo si se implementa DNA matching en el futuro. No es prioritario.

---

## 7. Ideas de producto sin categoría definida

---

### 7.1 AI Time Machine — fotos históricas personalizadas (descontinuado en MyHeritage)

**Qué es:**
Transformaba fotos personales en imágenes de uno mismo como figura histórica en distintas épocas (prehistoria, Egipto, Renacimiento, etc.). MyHeritage lo discontinuó.

**Por qué no implementar:**
MyHeritage lo discontinuó por razones que incluyen costos computacionales, saturación del mercado y posiblemente controversias de privacidad. El esfuerzo de implementación supera el valor de retención. Para GM habría una versión más específica y valiosa: "cómo serías en la Galicia de 1900" — pero incluso eso tiene más valor de marketing viral que de producto core.

**Si se retoma:**
Solo como feature experimental de marketing, nunca como feature core del producto. Evaluar cuando los modelos de IA generativa de imagen sean más accesibles y baratos.

---

### 7.2 Línea de tiempo con contexto histórico gallego

**Qué es:**
Vista cronológica de los eventos del árbol familiar superpuesta con eventos históricos relevantes: la emigración masiva gallega (1880–1930), la guerra civil española (1936–1939), el franquismo, la dictadura argentina, el retorno democrático. El usuario ve su historia familiar en contexto con la historia colectiva.

**Por qué no ahora:**
La línea de tiempo básica (segunda etapa) no requiere el contexto histórico — es solo cronología de eventos del árbol. El contexto histórico es una capa adicional que requiere curación de datos históricos y diseño de la experiencia.

**Cuándo retomar:**
Tercera etapa, junto con el repositorio propio de contenido territorial e histórico. La combinación de árbol personal + contexto histórico gallego es uno de los features más poderosos conceptualmente del proyecto.

**Diferencial para GM:**
Una línea de tiempo que muestra "tu bisabuelo emigró a Buenos Aires en 1906" junto con "ese año partieron desde el puerto de Vigo 47.000 gallegos" es narrativamente muy diferente a una línea de tiempo genealógica genérica. Eso es exactamente lo que GM puede hacer y MyHeritage no.

---

### 7.3 NLP gallego — procesamiento de nombres y documentos históricos

**Qué es:**
Procesamiento de lenguaje natural especializado en gallego histórico: normalización de nombres (Xosé → José, Xoán → Juan), detección de topónimos en gallego antiguo, OCR especializado en documentos manuscritos en gallego del siglo XIX, traducción de términos jurídicos y eclesiásticos históricos.

**Por qué no ahora:**
Requiere el microservicio Python + FastAPI (tercera etapa), modelos entrenados en corpus gallego histórico (que son escasos), y el repositorio propio de documentos históricos para justificar la inversión.

**Cuándo retomar:**
Tercera etapa o cuarta etapa. El NLP gallego histórico es un campo de investigación activo — colaborar con universidades gallegas (USC, UVigo, UDC) podría ser el camino para acceder a modelos y corpus existentes.

**Diferencial para GM:**
El gallego histórico es un nicho muy específico que ninguna plataforma genealógica general atiende. Un motor de búsqueda que entiende que "Xoán Carballo de Boqueixón" y "Juan Carballo de Boqueixón" son la misma persona sería único.

---

### 7.4 Agente de investigación autónomo

**Qué es:**
Agente de IA que, dado un ancestro del árbol con datos parciales, busca automáticamente en el repositorio propio, en FamilySearch y en archivos digitalizados para encontrar registros adicionales. Propone nuevos datos al usuario para revisión antes de incorporarlos al árbol.

**Por qué no ahora:**
Requiere todo lo demás: repositorio propio, integración FamilySearch, microservicio de IA, y un árbol con suficientes datos como punto de partida. Es la cima del producto, no el punto de entrada.

**Cuándo retomar:**
Cuarta etapa. Las condiciones previas son prácticamente todas las funcionalidades anteriores de tercera etapa activas.

---

### 9.1 Limpieza técnica — deuda acumulada (detectada en auditoría 28/05/2026)

**Colores hardcodeados en Admin/index.jsx:**
Líneas 70, 111, 112, 524 tienen valores hex directos (`#D1FAE5`, `#065F46`, `#5BAF7A`, `#8C5CBF`, `#B91C1C`). Deben reemplazarse por variables de `variables.js`. Tarea pequeña, bajo riesgo.

**i18n faltante en AdminPanel:**
`Admin/index.jsx` no tiene objeto I18N — todos los labels y mensajes son strings hardcodeados en español. Agregar cuando se retome el panel admin.

**Estado error faltante en TabDashboard:**
Si la carga de métricas falla, el dashboard muestra valores vacíos sin mensaje de error. Agregar manejo de error estándar.

**GaleriaFotos.jsx y Descubrimientos.jsx con mock data:**
Ambos son placeholders que muestran datos hardcodeados. No están conectados a Supabase. Documentados como segunda etapa. — "Tu lugar en Galicia"

**Qué es:**
Módulo de contenido propio para contextualizar el árbol genealógico con información histórica, territorial y cultural gallega. Reemplaza la idea original de usar Wikipedia como fuente de contenido. El SGC permite responder preguntas como "¿qué pasaba en Lalín en 1906 cuando emigró mi bisabuelo?" y vincular esa respuesta automáticamente con los ancestros del árbol que son de ese lugar.

**Arquitectura:**
- Tabla `lugares` con seed IGE (~3.800 parroquias gallegas) — base territorial de todo el sistema
- Tabla `sgc_articulos` — contenido en Markdown almacenado en Supabase
- Tabla `sgc_relaciones` — grafo de relaciones entre artículos, lugares y personas del árbol
- Campo `lugar_nac_id` en `personas_arbol` — puente entre el árbol y el SGC
- Visualización D3.js del grafo de relaciones en tercera etapa

**Por qué no Wikipedia:**
Dependencia externa, contenido no adecuado al nicho gallego, sin vinculación con el árbol, contenido no curado para la diáspora, escasez de artículos en gallego. Ver especificación completa en `SGC_TU_LUGAR_EN_GALICIA.md`.

**Por qué no archivos .md en el repositorio:**
Los archivos en el repo no escalan para miles de artículos y complican el workflow de publicación. Supabase permite el mismo contenido Markdown con búsqueda full-text, RLS y exportación a archivos .md en cualquier momento — soberanía igual, mejor ergonomía.

**Implicaciones para el árbol (acción en segunda etapa):**
Agregar `lugar_nac_id uuid FK → lugares.id` a `personas_arbol` cuando se implementen los campos territoriales gallegos. Este campo es el puente entre el árbol y el SGC — sin él, la vinculación automática no es posible.

**Cuándo retomar:**
Segunda etapa — junto con "Tu lugar en Galicia". La Fase 1 (tabla `lugares` + seed IGE + `lugar_nac_id` en personas) va junto con los campos territoriales gallegos ya planificados. La Fase 2 (artículos, visor, panel admin) es segunda etapa tardía. La Fase 3 (grafo D3.js, Neo4j, contribución comunitaria) es tercera etapa.

**Especificación completa:** `SGC_TU_LUGAR_EN_GALICIA.md` — documento de diseño detallado con modelo de datos, fases de implementación y decisiones de arquitectura.

---

### 7.6 Directorio de apellidos gallegos con historia y distribución

**Qué es:**
Sección del portal donde cada apellido gallego tiene su propia página con: historia del apellido, distribución geográfica en Galicia (por concello y parroquia), frecuencia histórica, variantes (Carballo, Carvallo, Carballal), y lista de usuarios de GM con ese apellido (con privacidad).

**Por qué no ahora:**
Requiere un dataset de apellidos gallegos con su distribución geográfica (disponible en el IGE) y una sección del portal que hoy no existe. Es contenido valioso pero no es genealogía activa.

**Cuándo retomar:**
Segunda etapa tardía o tercera etapa, como parte del módulo "Tu lugar en Galicia" extendido. El IGE tiene datos de distribución de apellidos por concello.

---

*Documento creado el 19 de mayo de 2026. Versión 1.0*
*Este documento se actualiza en cada sesión donde se toma la decisión de posponer una feature o cuando surge una idea que no entra en el plan inmediato.*
*Formato: cada entrada debe tener Qué es, Por qué no ahora, Cuándo retomar, y opcionalmente Diferencial para GM y Notas técnicas.*
