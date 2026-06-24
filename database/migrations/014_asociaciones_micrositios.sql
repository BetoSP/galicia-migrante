-- Migración 014: Columnas de Micrositio para Asociaciones y Semillas de Lalin Buenos Aires

-- 1. Agregar columnas necesarias a la tabla asociaciones
ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS historia_es TEXT;
ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS historia_gl TEXT;
ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS historia_en TEXT;
ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS finalidades_es TEXT;
ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS finalidades_gl TEXT;
ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS finalidades_en TEXT;
ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- 2. Habilitar RLS en asociaciones, directivos y noticias si no están activos
ALTER TABLE asociaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE asociaciones_directivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE asociaciones_noticias ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Seguridad (RLS)
-- A. Lectura pública para todos
DROP POLICY IF EXISTS "asociaciones_select_public" ON asociaciones;
CREATE POLICY "asociaciones_select_public" ON asociaciones 
  FOR SELECT TO anon, authenticated USING (activa = true);

DROP POLICY IF EXISTS "directivos_select_public" ON asociaciones_directivos;
CREATE POLICY "directivos_select_public" ON asociaciones_directivos 
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "noticias_select_public" ON asociaciones_noticias;
CREATE POLICY "noticias_select_public" ON asociaciones_noticias 
  FOR SELECT TO anon, authenticated USING (publicado = true);

-- B. Escritura / Edición limitada al admin de la asociación o administradores generales
DROP POLICY IF EXISTS "asociaciones_write_admin" ON asociaciones;
CREATE POLICY "asociaciones_write_admin" ON asociaciones 
  FOR ALL TO authenticated 
  USING (
    admin_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM usuarios_roles ur JOIN roles r ON ur.rol_id = r.id WHERE ur.usuario_id = auth.uid() AND r.nombre = 'admin_general')
  );

DROP POLICY IF EXISTS "directivos_write_admin" ON asociaciones_directivos;
CREATE POLICY "directivos_write_admin" ON asociaciones_directivos 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM asociaciones a 
      WHERE a.id = asociacion_id AND 
      (a.admin_id = auth.uid() OR EXISTS (SELECT 1 FROM usuarios_roles ur JOIN roles r ON ur.rol_id = r.id WHERE ur.usuario_id = auth.uid() AND r.nombre = 'admin_general'))
    )
  );

DROP POLICY IF EXISTS "noticias_write_admin" ON asociaciones_noticias;
CREATE POLICY "noticias_write_admin" ON asociaciones_noticias 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM asociaciones a 
      WHERE a.id = asociacion_id AND 
      (a.admin_id = auth.uid() OR EXISTS (SELECT 1 FROM usuarios_roles ur JOIN roles r ON ur.rol_id = r.id WHERE ur.usuario_id = auth.uid() AND r.nombre = 'admin_general'))
    )
  );

-- 4. Inserción de Semillas de Datos (Centro Lalín de Buenos Aires)
INSERT INTO asociaciones (
  id, nombre, slug, fundacion, 
  descripcion_es, historia_es, finalidades_es, 
  email, telefono, direccion, ciudad, pais, 
  logo_url, banner_url, activa
) VALUES (
  'a4b87cb3-42eb-4c8d-8fe5-1c3905581977',
  'Centro Lalín, Golada y Silleda de Buenos Aires',
  'centro-lalin-buenos-aires',
  1982,
  'Nos complace darle la bienvenida al sitio web del Centro Lalín Golada y Silleda de Galicia en Buenos Aires. Desde el año 1982 nuestra institución mantiene el firme y decidido compromiso de divulgar el origen e identidad gallegas.',
  'El Centro Lalín de Buenos Aires fue constituido por un grupo de entusiastas emigrantes originarios de la comarca del Deza con el objeto de mantener el contacto con su terruño natal y ayudarse mutuamente en la gran urbe porteña.',
  'Nuestros objetivos principales consisten en: 1) Divulgar la cultura gallega y de la comarca del Deza. 2) Favorecer la unión e integración social de los descendientes de gallegos en Argentina. 3) Ofrecer actividades culturales, recreativas y formativas.',
  'centrolalin@yahoo.com.ar',
  '+54 11 4941-2054',
  'Moreno 1949',
  'Buenos Aires',
  'Argentina',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
  true
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  historia_es = EXCLUDED.historia_es,
  finalidades_es = EXCLUDED.finalidades_es;

-- Directivos de Semilla para Centro Lalín
INSERT INTO asociaciones_directivos (asociacion_id, nombre, cargo, orden) VALUES
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581977', 'José González Otero', 'Presidente', 1),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581977', 'María del Carmen deza', 'Vicepresidenta', 2),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581977', 'Manuel Varela', 'Secretario General', 3),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581977', 'Elena Fernández Cuiña', 'Tesorera', 4)
ON CONFLICT DO NOTHING;

-- Noticias de Semilla para Centro Lalín
INSERT INTO asociaciones_noticias (asociacion_id, titulo_es, contenido_es, publicado) VALUES
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905581977',
    'Gran Banquete de la Fiesta del Cocido',
    'El Centro Lalín de Buenos Aires celebrará su tradicional Fiesta del Cocido en el salón principal, con danzas folclóricas gallegas y la presencia de autoridades e invitados especiales de la comarca del Deza.',
    true
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905581977',
    'Conferencia: Diáspora y Raíces en el Siglo XXI',
    'Un coloquio interactivo sobre la historia de la inmigración en Argentina, las leyes de nacionalidad vigentes y el papel de las nuevas generaciones en la conservación de la galleguidad.',
    true
  )
ON CONFLICT DO NOTHING;

-- Otras 5 Asociaciones de Semilla
INSERT INTO asociaciones (id, nombre, slug, fundacion, descripcion_es, ciudad, pais, logo_url, banner_url, activa) VALUES
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905581978',
    'Sociedad Gallega de Socorros Mutuos de Rosario',
    'sociedad-gallega-rosario',
    1892,
    'Fundada en 1892, es uno de los centros de socorros mutuos gallegos más antiguos del continente americano, brindando asistencia médica y social a los migrantes.',
    'Rosario',
    'Argentina',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    true
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905581979',
    'Casa de Galicia de Montevideo',
    'casa-de-galicia-montevideo',
    1921,
    'Institución emblemática que representó un pilar fundamental en la atención de la colectividad y en la difusión cultural en Uruguay desde la década de 1920.',
    'Montevideo',
    'Uruguay',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    true
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905581980',
    'Irmandade Galega de Córdoba',
    'irmandade-galega-cordoba',
    1934,
    'Espacio de reencuentro de la colonia gallega en la provincia de Córdoba, organizando romerías y manteniendo activa la escuela de gaita y bailes tradicionales.',
    'Córdoba',
    'Argentina',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    true
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905581981',
    'Centro Galego de São Paulo',
    'centro-galego-sao-paulo',
    1903,
    'El punto neurálgico de la diáspora en Brasil. Promueve activamente el aprendizaje del idioma gallego y el intercambio empresarial entre Galicia y el estado de São Paulo.',
    'São Paulo',
    'Brasil',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    true
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905581982',
    'Asociación Galicia de Mendoza',
    'asociacion-galicia-mendoza',
    1945,
    'Agrupa a la colectividad en la región de Cuyo, aunando los valores culturales de Galicia con el amor a la tierra del buen sol y del buen vino.',
    'Mendoza',
    'Argentina',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  descripcion_es = EXCLUDED.descripcion_es;

-- Eventos de Semilla
INSERT INTO eventos (titulo_es, descripcion_es, tipo, fecha_inicio, lugar, ciudad, publicado) VALUES
  ('Fiesta del Cocido en Buenos Aires', 'Gran evento gastronómico y cultural en Moreno 1949, Centro Lalín.', 'gastronomia', '2026-07-15 12:30:00', 'Moreno 1949', 'Buenos Aires', true),
  ('Encuentro de Gaitas del Cono Sur', 'Romería gallega al aire libre con agrupaciones folclóricas de Rosario y Buenos Aires.', 'musica', '2026-08-02 11:00:00', 'Rosario', 'Rosario', true)
ON CONFLICT DO NOTHING;
