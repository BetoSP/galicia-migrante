-- Migración 015: Semillas para más asociaciones argentinas (Vedra, Mos y Centro Galicia)

-- 1. Inserción de Sociedad Parroquial de Vedra en Buenos Aires
INSERT INTO asociaciones (
  id, nombre, slug, fundacion, 
  descripcion_es, historia_es, finalidades_es, 
  email, telefono, direccion, ciudad, pais, 
  logo_url, banner_url, activa
) VALUES (
  'a4b87cb3-42eb-4c8d-8fe5-1c3905581983',
  'Sociedad Parroquial de Vedra en Buenos Aires',
  'sociedad-parroquial-vedra',
  1910,
  'Fundada el 25 de septiembre de 1910, la Sociedad Parroquial de Vedra en Buenos Aires mantiene vivo el lazo de unión de los emigrantes del ayuntamiento de Vedra (A Coruña) en la República Argentina.',
  'Un grupo de inmigrantes originarios de las diferentes parroquias de Vedra se unieron en 1910 en Buenos Aires para crear una sociedad que paliara la nostalgia del terruño y sirviera de auxilio y socorro mutuo. A lo largo del siglo XX, consolidó su sede propia y su conjunto artístico.',
  'Preservar la cultura y las tradiciones gallegas, difundir el folclore de Vedra (especialmente sus cantos y bailes tradicionales), y prestar asistencia y acogida social a los miembros de la diáspora.',
  'vedrabuenosaires@galiciaaberta.com',
  '+54 11 4923-2545',
  'José Mármol 760',
  'Buenos Aires',
  'Argentina',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
  true
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  historia_es = EXCLUDED.historia_es,
  finalidades_es = EXCLUDED.finalidades_es;

-- Directivos de Vedra
INSERT INTO asociaciones_directivos (asociacion_id, nombre, cargo, orden) VALUES
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581983', 'Manuel López Ares', 'Presidente', 1),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581983', 'Rosa Miramontes', 'Secretaria', 2)
ON CONFLICT DO NOTHING;

-- Noticias de Vedra
INSERT INTO asociaciones_noticias (asociacion_id, titulo_es, contenido_es, publicado) VALUES
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905581983',
    'Ensayos del Conjunto de Danza y Gaita',
    'Se reanudan los ensayos semanales de nuestro cuerpo de baile y banda de gaitas en la sede de José Mármol. Invitamos a todos los jóvenes descendientes a sumarse.',
    true
  )
ON CONFLICT DO NOTHING;


-- 2. Inserción de Asociación Residentes de Mos en Buenos Aires
INSERT INTO asociaciones (
  id, nombre, slug, fundacion, 
  descripcion_es, historia_es, finalidades_es, 
  email, telefono, direccion, ciudad, pais, 
  logo_url, banner_url, activa
) VALUES (
  'a4b87cb3-42eb-4c8d-8fe5-1c3905581984',
  'Asociación Residentes de Mos en Buenos Aires',
  'asociacion-residentes-mos',
  1918,
  'Creada en 1918, la Asociación Residentes de Mos en Buenos Aires agrupa a los originarios del municipio de Mos (Pontevedra) y sus familias, promoviendo el canto y folclore gallego en Argentina.',
  'La sociedad nació en el año 1918 con fines benéficos y recreativos. Con esfuerzo colectivo, la comunidad adquirió su sede en Humberto I, constituyendo un faro de cultura pontevedresa en la capital argentina.',
  'Mantener vivas las raíces de Mos en Buenos Aires, coordinar talleres de lengua y cultura gallega, gaita, pandereta y canto tradicional, y promover el intercambio intergeneracional.',
  'mosbuenosaires@galiciaaberta.com',
  '+54 11 4308-1212',
  'Humberto I 3051',
  'Buenos Aires',
  'Argentina',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  true
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  historia_es = EXCLUDED.historia_es,
  finalidades_es = EXCLUDED.finalidades_es;

-- Directivos de Mos
INSERT INTO asociaciones_directivos (asociacion_id, nombre, cargo, orden) VALUES
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581984', 'Carlos Alberto Souto', 'Presidente', 1),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581984', 'Alicia Nogueira', 'Tesorera', 2)
ON CONFLICT DO NOTHING;


-- 3. Inserción de Centro Galicia de Buenos Aires
INSERT INTO asociaciones (
  id, nombre, slug, fundacion, 
  descripcion_es, historia_es, finalidades_es, 
  email, telefono, direccion, ciudad, pais, 
  logo_url, banner_url, activa
) VALUES (
  'a4b87cb3-42eb-4c8d-8fe5-1c3905581985',
  'Centro Galicia de Buenos Aires',
  'centro-galicia-buenos-aires',
  1979,
  'Es una de las instituciones de la diáspora más grandes del mundo, ofreciendo una amplia oferta de actividades culturales, educativas, sociales y deportivas.',
  'Fundado en octubre de 1979 mediante la fusión de los cuatro centros provinciales gallegos históricos en Buenos Aires (Centro Lucense, Centro Orensano, Centro Pontevedrés y Centro Asturiano-Gallego), logrando unificar esfuerzos de toda la colectividad.',
  'Brindar servicios sociales, deportivos de alto nivel (fútbol, básquet, bolos celtas), escolares mediante su colegio y preservar de forma unificada el legado y las artes tradicionales de Galicia.',
  'centrogalicia@galiciaaberta.com',
  '+54 11 4952-5555',
  'Bartolomé Mitre 2538',
  'Buenos Aires',
  'Argentina',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  true
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  historia_es = EXCLUDED.historia_es,
  finalidades_es = EXCLUDED.finalidades_es;

-- Directivos de Centro Galicia
INSERT INTO asociaciones_directivos (asociacion_id, nombre, cargo, orden) VALUES
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581985', 'Jesús Mosquera', 'Presidente', 1),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581985', 'José María Vila Alén', 'Vicepresidente', 2)
ON CONFLICT DO NOTHING;
