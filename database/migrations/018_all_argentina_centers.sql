-- Migración 018: Inserción de base de datos completa de centros gallegos en Argentina, directivos reales y vinculación de eventos

BEGIN;

-- 1. Agregar columna 'reclamada' a la tabla asociaciones
ALTER TABLE asociaciones ADD COLUMN IF NOT EXISTS reclamada BOOLEAN DEFAULT false;

-- 2. Agregar columna 'asociacion_id' a la tabla eventos
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS asociacion_id UUID REFERENCES asociaciones(id) ON DELETE SET NULL;

-- 3. Actualizar asociaciones existentes para marcar las reclamadas (activas reales)
UPDATE asociaciones SET reclamada = true WHERE slug IN (
  'centro-lalin-buenos-aires',
  'sociedad-parroquial-vedra',
  'asociacion-residentes-mos',
  'centro-galicia-buenos-aires'
);

-- 4. Inserción de nuevos centros gallegos (reclamada = false)
INSERT INTO asociaciones (id, nombre, slug, fundacion, email, telefono, direccion, ciudad, pais, activa, reclamada) VALUES
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582001',
    'Asociación Benéfica Cultural del Partido de Corcubión',
    'asociacion-corcubion',
    1922,
    'corcubion_buenosaires@yahoo.com.ar',
    '+54 11 4942-2101',
    'Juan Carlos Cruz 1871',
    'Vicente López',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582002',
    'Asociación Casa de Galicia de Buenos Aires',
    'casa-de-galicia-buenos-aires',
    1933,
    'casadegaliciadebuenosaires@gmail.com',
    '+54 11 4381-5215',
    'San José 224',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582003',
    'Asociación Centro Betanzos de Buenos Aires',
    'centro-betanzos-buenos-aires',
    1918,
    'secretaria@centrobetanzos.com.ar',
    '+54 11 4381-1741',
    'Venezuela 1534',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582004',
    'Asociación Centro Partido de Carballiño',
    'centro-partido-carballino',
    1956,
    'gestorasilvana@gmail.com',
    '+54 11 4718-0138',
    'Juan Carlos Cruz 1361',
    'Vicente López',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582005',
    'Asociación Civil Unión Residentes de Outes',
    'union-residentes-outes',
    1910,
    'sociedaddeoutes@hotmail.com',
    '+54 11 4304-3280',
    'Dr. Enrique Finochietto 1219',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582006',
    'Asociación Finisterre en América',
    'asociacion-finisterre-en-america',
    1920,
    'asociacionfinisterreenamerica@gmail.com',
    '+54 11 4201-4995',
    '12 de Octubre 629',
    'Dock Sud',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582007',
    'Asociación Hijos de Zas',
    'asociacion-hijos-de-zas',
    1923,
    'zasbuenosaires@hotmail.com',
    '+54 11 4302-4703',
    'Suárez 236',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582008',
    'Asociación Mutual, Cultural y Recreativa Tuy y Salceda',
    'asociacion-tuy-y-salceda',
    1915,
    'tuy_salceda@yahoo.com.ar',
    '+54 11 4931-5800',
    'Maza 457',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582009',
    'Asociación Mutualista Residentes de Vigo',
    'mutualista-residentes-vigo',
    1916,
    'residentesdevigo@gmail.com',
    '+54 11 4982-7431',
    'Quintino Bocayuva 522',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582010',
    'Asociación Residentes de Curtis',
    'asociacion-residentes-curtis',
    1920,
    'curtisbosaires@gmail.com',
    NULL,
    'Castro 822',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582011',
    'Asociación Residentes Salvatierra de Miño',
    'residentes-salvatierra-de-minio',
    1914,
    'salvatierraenbuenosaires@yahoo.com.ar',
    '+54 11 4300-1790',
    'Chacabuco 955',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582012',
    'Asociación Unión Residentes del Ayuntamiento de Carbia en Buenos Aires',
    'union-residentes-carbia',
    1920,
    'carbiahoyvilladecruces@yahoo.es',
    '+54 11 4952-0773',
    'Moreno 1949',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582013',
    'Casa de Galicia de Córdoba',
    'casa-de-galicia-de-cordoba',
    1930,
    'casagaliciacba@hotmail.com',
    '+54 351 423-4124',
    'Av. 24 de Septiembre 946',
    'Córdoba',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582014',
    'Centro Arzuano Mellidense',
    'centro-arzuano-mellidense',
    1925,
    'arzuanomellidense@gmail.com',
    NULL,
    'Cochabamba 3245',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582015',
    'Centro Cultural y Recreativo "Hijos de Buján"',
    'hijos-de-bujan',
    1921,
    'hijosdebujan@yahoo.com.ar',
    '+54 11 4611-3158',
    'Rondeau 1639',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582016',
    'Centro Galego da Comarca de Ordes',
    'centro-galego-comarca-de-ordes',
    1939,
    'asoc_ordenes_arg@yahoo.com.ar',
    '+54 11 4228-0409',
    'Lomas Valentina 475',
    'Valentín Alsina',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582018',
    'Centro Galicia de Mendoza',
    'centro-galicia-de-mendoza',
    1945,
    'galiciamendoza@yahoo.com',
    NULL,
    NULL,
    'Mendoza',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582019',
    'Centro Gallego Aconcagua de Mendoza',
    'centro-gallego-aconcagua-mendoza',
    1950,
    NULL,
    '+54 261 411-2380',
    'Paso de los Andes 1923',
    'Mendoza',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582021',
    'Centro Gallego de Azul',
    'centro-gallego-de-azul',
    1900,
    'centrogallegodeazul@gmail.com',
    '+54 2281 42-8800',
    'San Martín 772',
    'Azul',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582022',
    'Centro Gallego de Bahia Blanca',
    'centro-gallego-bahia-blanca',
    1912,
    'cgbahiablanca@yahoo.com.ar',
    NULL,
    'Chiclana 681',
    'Bahía Blanca',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582023',
    'Centro Gallego de Buenos Aires',
    'centro-gallego-buenos-aires',
    1907,
    'revista_galicia@centrogallegoba.com.ar',
    '+54 11 4952-3907',
    'Av. Belgrano 2199',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582024',
    'Centro Gallego de Córdoba',
    'centro-gallego-de-cordoba',
    1907,
    'centrogallego@centrogallegoba.com.ar',
    '+54 351 423-4124',
    'Av. 24 de Septiembre 946',
    'Córdoba',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582026',
    'Centro Gallego de La Plata, Cultural y Recreativo',
    'centro-gallego-la-plata',
    1914,
    'centrogallegolp@gmail.com',
    '+54 221 422-8181',
    'Calle 42 373',
    'La Plata',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582027',
    'Centro Gallego de Mar del Plata',
    'centro-gallego-mar-del-plata',
    1916,
    'cgallegomdp@gmail.com',
    '+54 223 493-1798',
    '20 de Septiembre 1946',
    'Mar del Plata',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582028',
    'Centro Gallego de Río Gallegos',
    'centro-gallego-rio-gallegos',
    1920,
    'centrogallego_riogallegos@yahoo.com.ar',
    NULL,
    '9 de Julio 52',
    'Río Gallegos',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582029',
    'Centro Gallego de Rosario',
    'centro-gallego-rosario-oficial',
    1910,
    'centrogallego_ros@arnet.com.ar',
    NULL,
    'Buenos Aires 1137',
    'Rosario',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582030',
    'Círculo Social Val Miñor',
    'circulo-social-val-minor',
    1927,
    'valminior@yahoo.com.ar',
    '+54 11 4635-5705',
    'Rafaela 4840',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582031',
    'Hogar de Ribadumia en Buenos Aires',
    'hogar-de-ribadumia',
    1925,
    'ribadumiabuenosaires@gmail.com',
    NULL,
    'Chacabuco 955',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582032',
    'Sociedad de Campo Lameiro',
    'sociedad-campo-lameiro',
    1911,
    'campolameiroba@yahoo.com.ar',
    NULL,
    'Bolívar 655',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582033',
    'Asociación Hijos de Rodeiro',
    'asociacion-hijos-de-rodeiro',
    1920,
    NULL,
    '+54 11 4305-8790',
    'Chacabuco 955',
    'Buenos Aires',
    'Argentina',
    true,
    false
  ),
  (
    'a4b87cb3-42eb-4c8d-8fe5-1c3905582034',
    'Asociación Unión de Residentes de Dodro',
    'union-residentes-dodro',
    1922,
    'uniongallegasadodro@gmail.com',
    NULL,
    'Pichincha 120',
    'Buenos Aires',
    'Argentina',
    true,
    false
  )
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  slug = EXCLUDED.slug,
  email = EXCLUDED.email,
  telefono = EXCLUDED.telefono,
  direccion = EXCLUDED.direccion;

-- 5. Inserción de Directivos Reales (desde los datos del archivo de contactos)
-- A. Directivos de Hijos de Rodeiro
DELETE FROM asociaciones_directivos WHERE asociacion_id = 'a4b87cb3-42eb-4c8d-8fe5-1c3905582033';
INSERT INTO asociaciones_directivos (asociacion_id, nombre, cargo, orden) VALUES
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905582033', 'José Cuñarro Valladares', 'Presidente', 1),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905582033', 'Gustavo Fernando Iribarren', 'Secretario', 2),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905582033', 'Elias Fernandez', 'Vocal', 3),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905582033', 'Dolores Gomez', 'Vocal', 4),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905582033', 'Luisa Marta Calvo', 'Vocal', 5),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905582033', 'Rosalia Hayde Castro', 'Vocal', 6);

-- B. Directivos de Casa de Galicia de Buenos Aires
DELETE FROM asociaciones_directivos WHERE asociacion_id = 'a4b87cb3-42eb-4c8d-8fe5-1c3905582002';
INSERT INTO asociaciones_directivos (asociacion_id, nombre, cargo, orden) VALUES
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905582002', 'Manuel Eiranova Fernandez', 'Presidente', 1);

-- C. Directivos de Centro Galego de la Comarca de Ordes
DELETE FROM asociaciones_directivos WHERE asociacion_id = 'a4b87cb3-42eb-4c8d-8fe5-1c3905582016';
INSERT INTO asociaciones_directivos (asociacion_id, nombre, cargo, orden) VALUES
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905582016', 'Maria Eugenia Moar', 'Presidenta', 1);

-- D. Directivos de Asociación Unión Residentes del Ayuntamiento de Carbia (Villa de Cruces)
DELETE FROM asociaciones_directivos WHERE asociacion_id = 'a4b87cb3-42eb-4c8d-8fe5-1c3905582012';
INSERT INTO asociaciones_directivos (asociacion_id, nombre, cargo, orden) VALUES
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905582012', 'Eduardo Garcia Choren', 'Presidente', 1),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905582012', 'Guillermo Vila', 'Secretario', 2),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905582012', 'Martin Vila', 'Tesorero', 3),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905582012', 'Maria Vila', 'Vocal', 4);

-- E. Directivos adicionales para la Asociación Residentes de Mos
DELETE FROM asociaciones_directivos WHERE asociacion_id = 'a4b87cb3-42eb-4c8d-8fe5-1c3905581984';
INSERT INTO asociaciones_directivos (asociacion_id, nombre, cargo, orden) VALUES
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581984', 'Carlos Alberto Souto', 'Presidente', 1),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581984', 'Alberto Garcia', 'Vocal', 2),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581984', 'Albino Cambeiro', 'Vocal', 3),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581984', 'Alicia Nogueira', 'Tesorera', 4);

COMMIT;
