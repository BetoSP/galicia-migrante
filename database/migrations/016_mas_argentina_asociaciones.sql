-- Migración 016: Semillas para 6 asociaciones argentinas adicionales

-- 1. Federación de Asociaciones Gallegas de la República Argentina
INSERT INTO asociaciones (
  id, nombre, slug, fundacion, 
  descripcion_es, historia_es, finalidades_es, 
  email, telefono, direccion, ciudad, pais, 
  logo_url, banner_url, activa
) VALUES (
  'a4b87cb3-42eb-4c8d-8fe5-1c3905581986',
  'Federación de Asociaciones Gallegas de la República Argentina',
  'federacion-asociaciones-gallegas-argentina',
  1921,
  'Organización histórica de segundo grado fundada en 1921 que reúne a las sociedades gallegas laicas y republicanas de la Argentina, custodiando el Museo de la Emigración Gallega (MEGA).',
  'La Federación nació en Buenos Aires en 1921 como órgano federativo para coordinar la lucha social, la ayuda mutua y la solidaridad con la causa republicana gallega. Ha sido cuna de grandes intelectuales como Alfonso Daniel Rodríguez Castelao y Lorenzo Varela.',
  'Preservar la memoria de la emigración gallega laica y republicana, administrar el Museo MEGA, y promover actividades artísticas, históricas y debates socioculturales.',
  'museomega@fag.org.ar',
  '+54 11 4362-5957',
  'Chacabuco 955',
  'Buenos Aires',
  'Argentina',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
  true
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  historia_es = EXCLUDED.historia_es;

INSERT INTO asociaciones_directivos (asociacion_id, nombre, cargo, orden) VALUES
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581986', 'Diego Martínez', 'Presidente', 1)
ON CONFLICT DO NOTHING;


-- 2. Unión de Asociaciones Gallegas de la República Argentina
INSERT INTO asociaciones (
  id, nombre, slug, fundacion, 
  descripcion_es, historia_es, finalidades_es, 
  email, telefono, direccion, ciudad, pais, 
  logo_url, banner_url, activa
) VALUES (
  'a4b87cb3-42eb-4c8d-8fe5-1c3905581987',
  'Unión de Asociaciones Gallegas de la República Argentina',
  'union-asociaciones-gallegas-argentina',
  1988,
  'Entidad que coordina y representa a los centros gallegos de toda la Argentina ante la Xunta de Galicia y otros estamentos públicos y privados.',
  'Se estableció en Buenos Aires en 1988 como un foro de cooperación para aunar fuerzas institucionales en actividades de gran envergadura (como romerías federales y representaciones culturales conjuntas).',
  'Promover la hermandad de los gallegos de la República Argentina, servir de canalización para becas y programas pedagógicos de la Xunta de Galicia, y organizar certámenes tradicionales.',
  'uniongallegasarg@galiciaaberta.com',
  '+54 11 4952-4411',
  'Bartolomé Mitre 2538',
  'Buenos Aires',
  'Argentina',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&auto=format&fit=crop&q=80',
  true
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  historia_es = EXCLUDED.historia_es;


-- 3. Hogar Gallego para Ancianos de Domselaar
INSERT INTO asociaciones (
  id, nombre, slug, fundacion, 
  descripcion_es, historia_es, finalidades_es, 
  email, telefono, direccion, ciudad, pais, 
  logo_url, banner_url, activa
) VALUES (
  'a4b87cb3-42eb-4c8d-8fe5-1c3905581988',
  'Hogar Gallego para Ancianos de Domselaar',
  'hogar-gallego-ancianos-domselaar',
  1943,
  'Obra benéfica y social ejemplar fundada en 1943 dedicada al cuidado integral y la asistencia de ancianos de la diáspora gallega en un predio rural en la provincia de Buenos Aires.',
  'La idea nació de la filantropía y solidaridad gallega para dar una vejez digna a los migrantes sin recursos en la comarca. Con donaciones se adquirió el gran predio de Domselaar, inaugurando sus pabellones de residencia médica.',
  'Brindar servicios de geriatría, recreación campestre, y contención emocional y cultural para los mayores gallegos bajo los valores históricos de solidaridad.',
  'hogardomselaar@galiciaaberta.com',
  '+54 2225 491-104',
  'Ruta 210 Km 58',
  'Domselaar',
  'Argentina',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
  true
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  historia_es = EXCLUDED.historia_es;


-- 4. Centro Gallego de Avellaneda
INSERT INTO asociaciones (
  id, nombre, slug, fundacion, 
  descripcion_es, historia_es, finalidades_es, 
  email, telefono, direccion, ciudad, pais, 
  logo_url, banner_url, activa
) VALUES (
  'a4b87cb3-42eb-4c8d-8fe5-1c3905581989',
  'Centro Gallego de Avellaneda',
  'centro-gallego-avellaneda',
  1899,
  'Entidad señera del sur del Gran Buenos Aires, fundada en 1899 para la difusión de la cultura gallega y el encuentro de su gran colonia industrial.',
  'Fundado a finales del siglo XIX en Avellaneda, sirvió de punto de apoyo para miles de gallegos instalados en el polo fabril bonaerense, ofreciendo asistencia médica, social y una activa biblioteca popular.',
  'Desarrollar actividades de baile gallego, escuela de gaita y pandereta, ciclos de cine debate, y cooperar en labores benéficas del partido de Avellaneda.',
  'cgallegodeavellaneda@yahoo.com.ar',
  '+54 11 4201-8488',
  'Mitre 780',
  'Avellaneda',
  'Argentina',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=1200&auto=format&fit=crop&q=80',
  true
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  historia_es = EXCLUDED.historia_es;


-- 5. Asociación Civil Fillos de Ourense
INSERT INTO asociaciones (
  id, nombre, slug, fundacion, 
  descripcion_es, historia_es, finalidades_es, 
  email, telefono, direccion, ciudad, pais, 
  logo_url, banner_url, activa
) VALUES (
  'a4b87cb3-42eb-4c8d-8fe5-1c3905581990',
  'Asociación Civil Fillos de Ourense',
  'asociacion-fillos-de-ourense',
  1916,
  'Sociedad que agrupa a los nativos de la provincia de Ourense y sus descendientes en Buenos Aires, fomentando el estudio y resguardo de su folclore singular.',
  'Creada en 1916 por ourensanos con el fin de rememorar las fiestas patronales de la provincia de origen y constituir redes de ayuda mutua laboral y de vivienda para los recién llegados a Buenos Aires.',
  'Fomentar las danzas tradicionales y la música de gaita ourensana, organizar la fiesta patronal de San Roque, y difundir la literatura e historia ourensana.',
  'fillosdeourense@galiciaaberta.com',
  '+54 11 4942-1200',
  'Moreno 1824',
  'Buenos Aires',
  'Argentina',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80',
  true
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  historia_es = EXCLUDED.historia_es;


-- 6. Centro Gallego de Jubilados y Pensionados de la República Argentina
INSERT INTO asociaciones (
  id, nombre, slug, fundacion, 
  descripcion_es, historia_es, finalidades_es, 
  email, telefono, direccion, ciudad, pais, 
  logo_url, banner_url, activa
) VALUES (
  'a4b87cb3-42eb-4c8d-8fe5-1c3905581991',
  'Centro Gallego de Jubilados y Pensionados de la República Argentina',
  'centro-gallego-jubilados',
  1965,
  'Asociación civil creada en 1965 con el objeto de brindar recreación, turismo social y gestiones de pensiones para los jubilados de la colectividad gallega.',
  'Nació a mediados de la década de 1960 para asistir a la primera generación de emigrantes gallegos en su etapa pasiva, logrando convenios médicos y viajes de esparcimiento organizados.',
  'Brindar contención social para la tercera edad de la diáspora, organizar eventos culturales, y orientar en las pensiones asistenciales gallegas ante el Consulado.',
  'jubiladosgallegos@galiciaaberta.com',
  '+54 11 4951-8585',
  'Pichincha 120',
  'Buenos Aires',
  'Argentina',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80',
  true
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  historia_es = EXCLUDED.historia_es;
