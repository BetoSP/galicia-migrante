-- Migration 013 — blog_and_traducciones
-- Crea las tablas traducciones_interfaz y blog_posts con políticas RLS y permisos.
-- Aplicar en Supabase SQL Editor.

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. TRADUCCIONES DE INTERFAZ CUSTOMIZABLES ───────────────────────────
CREATE TABLE IF NOT EXISTS traducciones_interfaz (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clave             TEXT NOT NULL,
  idioma            TEXT NOT NULL,
  texto_por_defecto TEXT NOT NULL,
  texto_custom      TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_clave_idioma UNIQUE (clave, idioma)
);

-- Trigger para updated_at en traducciones_interfaz
CREATE OR REPLACE FUNCTION update_traducciones_interfaz_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_traducciones_interfaz_updated_at ON traducciones_interfaz;
CREATE TRIGGER trg_traducciones_interfaz_updated_at
  BEFORE UPDATE ON traducciones_interfaz
  FOR EACH ROW EXECUTE FUNCTION update_traducciones_interfaz_updated_at();

-- Habilitar RLS para traducciones_interfaz
ALTER TABLE traducciones_interfaz ENABLE ROW LEVEL SECURITY;

-- Lectura pública para cualquier usuario (anónimo y autenticado)
CREATE POLICY "traducciones_interfaz_select_public"
  ON traducciones_interfaz FOR SELECT
  USING (true);

-- Escritura limitada a usuarios con el permiso 'personalizar_traducciones' o rol 'admin_general'
CREATE POLICY "traducciones_interfaz_admin_write"
  ON traducciones_interfaz FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_roles ur
      JOIN roles r ON ur.rol_id = r.id
      WHERE ur.usuario_id = auth.uid()
        AND r.nombre IN ('admin_general', 'traductor_delegado')
    )
  );


-- ── 2. BLOG POSTS CON SEGURIDAD RLS ─────────────────────────────────────
-- Registrar feature flag para creación de posts
INSERT INTO features (key, nombre_es, modulo) VALUES ('crear_posts', 'Crear artículos de blog', 'blog') ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS blog_posts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT UNIQUE NOT NULL,
  autor_id          UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  autor_nombre      TEXT NOT NULL DEFAULT 'Galicia Migrante',
  titulo            TEXT NOT NULL,
  extracto          TEXT,
  contenido         TEXT NOT NULL,
  categoria         TEXT NOT NULL CHECK (categoria IN ('general', 'historia', 'literatura', 'tramites')),
  tags              TEXT[] DEFAULT '{}',
  estado            TEXT NOT NULL CHECK (estado IN ('provisorio', 'publicado', 'bloqueado')) DEFAULT 'provisorio',
  fecha_publicacion DATE DEFAULT CURRENT_DATE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para updated_at en blog_posts
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_blog_posts_updated_at();

-- Habilitar RLS para blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 1. Lectura de posts publicados: accesible a cualquiera
CREATE POLICY "blog_posts_select_published"
  ON blog_posts FOR SELECT
  USING (estado = 'publicado');

-- 2. Lectura de posts provisorios y bloqueados: solo el autor o administradores
CREATE POLICY "blog_posts_select_own_or_admin"
  ON blog_posts FOR SELECT
  USING (
    auth.uid() = autor_id 
    OR EXISTS (
      SELECT 1 FROM usuarios_roles ur
      JOIN roles r ON ur.rol_id = r.id
      WHERE ur.usuario_id = auth.uid()
        AND r.nombre = 'admin_general'
    )
  );

-- 3. Inserción de posts: usuarios autenticados con membresía activa que tengan permiso de crear_posts
CREATE POLICY "blog_posts_insert_auth"
  ON blog_posts FOR INSERT
  WITH CHECK (
    auth.uid() = autor_id
    AND (
      EXISTS (
        -- Validar permisos de membresía / suscripción
        SELECT 1 FROM usuario_permisos up
        WHERE up.usuario_id = auth.uid()
          AND up.feature_key = 'crear_posts'
      )
      OR EXISTS (
        -- O que sea administrador general
        SELECT 1 FROM usuarios_roles ur
        JOIN roles r ON ur.rol_id = r.id
        WHERE ur.usuario_id = auth.uid()
          AND r.nombre = 'admin_general'
      )
    )
  );

-- 4. Edición de posts: solo el autor (siempre que el post no esté bloqueado administrativamente)
CREATE POLICY "blog_posts_update_own"
  ON blog_posts FOR UPDATE
  USING (
    auth.uid() = autor_id 
    AND estado != 'bloqueado'
  )
  WITH CHECK (
    auth.uid() = autor_id
  );

-- 5. Eliminación de posts: el autor o el administrador general
CREATE POLICY "blog_posts_delete_own_or_admin"
  ON blog_posts FOR DELETE
  USING (
    auth.uid() = autor_id
    OR EXISTS (
      SELECT 1 FROM usuarios_roles ur
      JOIN roles r ON ur.rol_id = r.id
      WHERE ur.usuario_id = auth.uid()
        AND r.nombre = 'admin_general'
    )
  );


-- ── 3. SEMILLAS (SEED DATA) — ARTÍCULOS DE EJEMPLO ──────────────────────
INSERT INTO blog_posts (slug, autor_nombre, titulo, extracto, contenido, categoria, tags, estado, fecha_publicacion) VALUES
  (
    'bienvenidos',
    'Equipo Galicia Migrante',
    'Bienvenidos al Blog de Galicia Migrante',
    'Un espacio para contar las historias de la diáspora gallega, explorar la identidad y mantener vivo el vínculo con la tierra de origen.',
    '## Un espacio para la memoria y la identidad

Galicia Migrante nace de una convicción simple: **las historias de los que se fueron merecen ser contadas**.

Durante generaciones, miles de gallegos cruzaron el océano en busca de una vida mejor. Se asentaron en Argentina, Uruguay, Cuba, Brasil, Venezuela y tantos otros lugares. Construyeron comunidades, mantuvieron tradiciones y, sobre todo, conservaron en el corazón el recuerdo de una tierra que los vio nacer.

Este blog es el espacio donde esas historias encuentran su lugar.

## ¿Qué vas a encontrar aquí?

- **Historias de emigración** — relatos reales de familias gallegas por el mundo
- **Cultura e identidad** — tradiciones, gastronomía, música y lengua gallega
- **Recursos genealógicos** — guías para investigar tus raíces
- **Noticias del ecosistema** — novedades del portal Galicia Migrante

## El árbol genealógico como punto de partida

El corazón del ecosistema Galicia Migrante es el módulo de árbol genealógico. Una herramienta diseñada para que puedas construir, explorar y compartir la historia de tu familia con la profundidad y el cuidado que se merece.

El blog y el árbol son dos caras de la misma moneda: el árbol te da la estructura, el blog te da el contexto.

Bienvenidos a casa.',
    'general',
    ARRAY['bienvenida', 'galicia', 'diáspora'],
    'provisorio',
    '2026-06-22'
  ),
  (
    'historia-del-centro-gallego-de-buenos-aires',
    'Xurxo Martínez',
    'La Epopeya del Centro Gallego de Buenos Aires: El Hospital de la Diáspora',
    'Conoce la historia del centro médico y social gallego más grande del mundo, un faro de salud y cultura fundado por inmigrantes en Argentina.',
    '## Un faro de solidaridad en el Río de la Plata

Fundado en **1907**, el Centro Gallego de Buenos Aires nació de la necesidad imperiosa de brindar asistencia médica y social a las oleadas de inmigrantes gallegos que llegaban al puerto de Buenos Aires. Lo que comenzó como un pequeño local de alquiler en la calle Alsina se convirtió, con los años, en el **centro hospitalario de la diáspora más grande del mundo**, ocupando una manzana entera en el barrio de Balvanera.

> "El Centro Gallego fue, para miles de nuestros abuelos, el primer refugio de dignidad y salud en tierras americanas."

### Los pilares de la institución

El éxito y crecimiento del Centro se debió a una combinación única de dos fuerzas:

1. **Mutualismo sanitario:** Un sistema solidario donde los socios aportaban una cuota mínima mensual a cambio de una cobertura médica integral, revolucionaria para la época.
2. **Fervor cultural:** Además de hospital, el centro contaba con una inmensa biblioteca, salones de arte y el teatro *Galicia*, donde se daban cita las figuras más relevantes de la cultura gallega en el exilio, incluyendo a **Alfonso Daniel Rodríguez Castelao**.

---

## El legado cultural: La muerte de Castelao

El Centro Gallego no solo curaba el cuerpo, sino que alimentaba el alma gallega. Fue aquí donde Castelao, el padre de la patria gallega moderna, pasó sus últimos días y falleció el **7 de enero de 1950**. La habitación número 202 del hospital se conserva hoy como un sitio de memoria histórica permanente.

Hoy en día, a pesar de las crisis económicas y los desafíos institucionales, el imponente edificio de la avenida Belgrano sigue en pie como un monumento vivo al esfuerzo, el ahorro y la inmensa solidaridad de la comunidad gallega en Argentina.',
    'historia',
    ARRAY['historia', 'buenos-aires', 'asociaciones', 'emigracion'],
    'provisorio',
    '2026-06-23'
  ),
  (
    'guia-ley-nietos-nacionalidad-espanola',
    'María del Carmen Blanco',
    'Guía Práctica de la Ley de Nietos: Cómo recuperar tu nacionalidad',
    'Todo lo que necesitas saber sobre los requisitos, plazos y documentos consulares para solicitar la nacionalidad por descendencia gallega.',
    '## Una oportunidad histórica para los descendientes

La *Ley de Memoria Democrática*, popularmente conocida como la **Ley de Nietos**, ha abierto una ventana de oportunidad sin precedentes para que hijos y nietos de españoles nacidos en el exterior recuperen o adquieran la nacionalidad de sus ancestros de forma directa y sin tener que residir en España.

Para la comunidad de descendientes gallegos, que representa una parte sustancial de la diáspora en América Latina, este trámite tiene un valor no solo civil, sino profundamente familiar y emocional.

---

### ¿Quiénes pueden aplicar?

Los supuestos principales que contempla la ley actual son:

1. **Hijos o nietos de exiliados:** Nacidos fuera de España de padre, madre, abuelo o abuela que originariamente hubieran sido españoles, y que hubiesen perdido o renunciado a la nacionalidad española a consecuencia del exilio (por razones políticas, ideológicas, de creencia o de orientación e identidad sexual).
2. **Hijos de mujeres españolas casadas con extranjeros:** Nacidos en el exterior de mujeres españolas que perdieron su nacionalidad por casarse con extranjeros antes de la Constitución de 1978.
3. **Hijos mayores de edad:** De aquellos españoles a quienes les fue reconocida su nacionalidad de origen en virtud de la ley actual o de la anterior Ley de Memoria Histórica (de 2007).

---

## Documentación básica requerida

El éxito del trámite consular depende casi en un 100% de la calidad de la documentación aportada. Deberás reunir:

* **Acta de nacimiento del solicitante:** Legalizada y apostillada.
* **Acta de nacimiento del padre/madre español:** Expedida por el Registro Civil correspondiente.
* **Acta de nacimiento del abuelo/abuela español:** Si es quien emigró, con fecha de expedición reciente y obtenida en el municipio gallego de origen.
* **Prueba de emigración/exilio:** (Para el supuesto 1) Pasaportes españoles legados, certificados de desembarco, o documentación que demuestre la salida de España.

### Consejos para buscar actas en Galicia

Si no tienes el acta de nacimiento de tu abuelo gallego, la búsqueda debe comenzar en el ámbito familiar: averigua el **Concello** (municipio) y, de ser posible, la **Parroquia** y la fecha aproximada de nacimiento. Con estos datos, puedes realizar una solicitud formal en la Sede Electrónica del Ministerio de Justicia de España o ponerte en contacto directamente con los registros civiles municipales o archivos diocesanos gallegos correspondientes.',
    'tramites',
    ARRAY['tramites', 'nacionalidad', 'ley-de-nietos', 'consejos'],
    'provisorio',
    '2026-06-24'
  )
ON CONFLICT (slug) DO NOTHING;


-- ── 4. GRANTS EXPLÍCITOS PARA ACCESO DESDE CLIENTES SUPABASE-JS ──────────
GRANT SELECT ON traducciones_interfaz TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON traducciones_interfaz TO authenticated;

GRANT SELECT ON blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON blog_posts TO authenticated;


-- ── 5. VERIFICACIÓN ──────────────────────────────────────────────────────
DO $$
DECLARE
  t_traducciones BOOLEAN;
  t_blog BOOLEAN;
  n_posts INTEGER;
BEGIN
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'traducciones_interfaz') INTO t_traducciones;
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_posts') INTO t_blog;
  
  IF NOT t_traducciones OR NOT t_blog THEN
    RAISE EXCEPTION 'Fallo de verificación: Una de las tablas no fue creada correctamente.';
  END IF;

  SELECT COUNT(*) INTO n_posts FROM blog_posts;
  IF n_posts < 3 THEN
    RAISE EXCEPTION 'Fallo de verificación: Se esperaban al menos 3 posts de semilla, hay %', n_posts;
  END IF;
  
  RAISE NOTICE 'Migration 013 OK — Tablas creadas y con RLS. % posts de ejemplo sembrados.', n_posts;
END $$;

COMMIT;
