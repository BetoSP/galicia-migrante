-- Migración 017: Corrección de datos reales de Galicia Abierta y notas de actualización

-- Definición del mensaje de advertencia que se insertará al inicio de cada texto editable
-- Nota: La fecha de última actualización registrada en la mayoría de los sitios de Galicia Abierta es de Mayo de 2011.

-- 1. Actualización de Centro Lalín, Golada y Silleda de Buenos Aires
-- ID: a4b87cb3-42eb-4c8d-8fe5-1c3905581977
UPDATE asociaciones SET
  historia_es = '[⚠️ NOTA DE CONTROL DE CALIDAD - FUENTE ORIGINAL IMPORTADA DE GALICIA ABIERTA (MAYO DE 2011)]
Se solicita amablemente a la comisión directiva y administración de este micrositio revisar y actualizar este texto histórico para reflejar la realidad de la institución. (Esta nota es de carácter temporal y puede borrarse libremente al editar la sección).

' || 
  'Centro fundado el 25 de julio de 1982. El propósito que animó a sus fundadores fue el de agrupar en un solo centro las distintas sociedades del partido judicial de Lalín constituidas en Buenos Aires, en base al escaso y casi nulo caudal migratorio que en aquella época se venia registrando.

En la Asamblea General Ordinaria celebrada el 25 de agosto de 1984 aprobaron por unanimidad, la integración en este centro de las sociedades Asociación Hijos del Partido de Lalín, Asociación Hijos de Silleda, Asociación Unión del Partido de Lalín y Sociedad Hijos del Ayuntamiento de Golada y sus contornos.

La Asociación Hijos del Partido de Lalín, fundada el 7 de agosto de 1908, es la institución considerada decana dentro de las similares en Argentina. Por la proximidad con el Centro Gallego de Buenos Aires, por el gran número de socios que tubo en sus mejores épocas y por el trabajo hecho a lo largo de su existencia es considerada una de las asociaciones de más renombre de Hispanoamérica.

Los motivos de su fundación fueron los de ayudar a hacer obras en la villa de Lalín, entre las que se pueden contar: el cementerio, el Hospitalillo (en la actualidad Instituto de Formación Profesional), monumentos a diversos personajes (Joaquín Loriga e Ramón Aller), así como los grupos escolares de Barcia, Villanueva, Prado, Sotolongo.

Las asociaciones Hijos de Silleda, fundada el 15 de agosto de 1908, Unión del Partido de Lalín, fundada el 30 de enero de 1921 y la Sociedad Hijos del Ayuntamiento de Golada y sus contornos fundada el 20 de julio de 1930 tenían idénticas características y los mismos fines sociales, culturales y recreativos que Hijos del Partido de Lalín.

Todas estas sociedades por resolución unánime de sus socios resolvieron integrarse en el Centro Lalín de Buenos Aires con todo su caudal humano y bienes y en igualdad de condiciones, para desarrollar la misma actividad para la cual fueron fundadas.

El Centro Lalín es pues la institución continuadora de estas cuatro sociedades casi centenarias y que automáticamente se convierten en el verdadero receptor de su rico historial.

La sede social, en propiedad, cuenta con un gran salón, escenario, restaurante, secretaria e presidencia. Cuentan también con un campo de recreo en Belgrano 1001, de San Isidro (Provincia de Buenos Aires).

A la entidad le fue otorgada la condición de galleguidad el 17 de septiembre de 1992, (DOG nº 278/92, nº 190 del 29 de septiembre) y cuenta en la actualidad con 920 socios, de los cuales 487 son gallegos.

Es miembro de la Unión de Asociaciones Gallegas de la República Argentina.',

  finalidades_es = '[⚠️ NOTA DE CONTROL DE CALIDAD - FUENTE ORIGINAL IMPORTADA DE GALICIA ABIERTA (MAYO DE 2011)]
Se solicita amablemente a la comisión directiva y administración de este micrositio revisar y actualizar estas finalidades y objetivos. (Esta nota es de carácter temporal y puede borrarse libremente al editar la sección).

' ||
  'Nuestros objetivos principales consisten en:
1) Divulgar la cultura gallega y de la comarca del Deza.
2) Favorecer la unión e integración social de los descendientes de gallegos en Argentina.
3) Ofrecer actividades culturales, recreativas y formativas.'
WHERE id = 'a4b87cb3-42eb-4c8d-8fe5-1c3905581977';

-- Limpiar directiva vieja del Centro Lalín
DELETE FROM asociaciones_directivos WHERE asociacion_id = 'a4b87cb3-42eb-4c8d-8fe5-1c3905581977';

-- Insertar directiva real de Galicia Abierta para Centro Lalín
INSERT INTO asociaciones_directivos (asociacion_id, nombre, cargo, orden) VALUES
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581977', 'D. Marcial Sánchez González', 'Presidente', 1),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581977', 'D. José María Cabaleiro', 'Vicepresidente', 2),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581977', 'Dr. Luis Orlando Fernández Iglesias', 'Secretario', 3),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581977', 'D. Pío Sánchez Crespo', 'Prosecretario', 4),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581977', 'D. José Bouzada', 'Tesorero', 5),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581977', 'D. Manuel Mejuto', 'Protesorero', 6),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581977', 'D. Francisco Javier Meijomín', 'Secretario de Actas', 7);


-- 2. Actualización de Sociedad Parroquial de Vedra en Buenos Aires
-- ID: a4b87cb3-42eb-4c8d-8fe5-1c3905581983
UPDATE asociaciones SET
  historia_es = '[⚠️ NOTA DE CONTROL DE CALIDAD - FUENTE ORIGINAL IMPORTADA DE GALICIA ABIERTA (MAYO DE 2011)]
Se solicita amablemente a la comisión directiva y administración de este micrositio revisar y actualizar este texto histórico para reflejar la realidad de la institución. (Esta nota es de carácter temporal y puede borrarse libremente al editar la sección).

' ||
  'La Sociedad Progreso y Cultura Parroquial de Vedra fue fundada el 25 de septiembre de 1910 en Buenos Aires por emigrantes de la parroquia de Vedra (A Coruña) con el objeto de mantener el contacto con su terruño natal y prestar auxilio y ayuda mutua.

Tras un periodo de inactividad durante la Guerra Civil Española, la sociedad se reorganizó en 1948. En 1981 obtuvo su personería jurídica, pasando a denominarse Sociedad Parroquial de Vedra de Mutualidad y Cultura.

En 1974 adquirieron su sede social en la calle José Mármol 760, Buenos Aires. Su escudo oficial, creado en 1986 por Orlando Pegito Ascunce, simboliza la unión de las culturas gallega y argentina (representadas por el botafumeiro de la Catedral de Santiago y el mate criollo, respectivamente).',

  finalidades_es = '[⚠️ NOTA DE CONTROL DE CALIDAD - FUENTE ORIGINAL IMPORTADA DE GALICIA ABIERTA (MAYO DE 2011)]
Se solicita amablemente a la comisión directiva y administración de este micrositio revisar y actualizar estas finalidades y objetivos. (Esta nota es de carácter temporal y puede borrarse libremente al editar la sección).

' ||
  'Sus objetivos principales consisten en:
1) Mantener los lazos de unión, hermandad y ayuda mutua entre los emigrantes de Vedra y sus familias.
2) Brindar contención afectiva y ayuda a los recién llegados a Buenos Aires, facilitando su inserción en la sociedad argentina.
3) Mantener, exaltar y difundir la cultura, costumbres y tradiciones gallegas a través de su Escuela de Folclore (baile, gaitas y cantareiras).'
WHERE id = 'a4b87cb3-42eb-4c8d-8fe5-1c3905581983';

-- Limpiar directiva vieja de Vedra
DELETE FROM asociaciones_directivos WHERE asociacion_id = 'a4b87cb3-42eb-4c8d-8fe5-1c3905581983';

-- Insertar directiva real de Galicia Abierta para Vedra
INSERT INTO asociaciones_directivos (asociacion_id, nombre, cargo, orden) VALUES
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581983', 'Dª. Dora Pegito Quintás', 'Presidenta', 1),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581983', 'D. José María Vilar Novio', 'Vicepresidente', 2),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581983', 'Dª María Isabel Vilar Batallán', 'Secretaria', 3),
  ('a4b87cb3-42eb-4c8d-8fe5-1c3905581983', 'D. Emilio Alberto Carbia', 'Tesorero', 4);


-- 3. Actualización de Asociación Residentes de Mos en Buenos Aires
-- ID: a4b87cb3-42eb-4c8d-8fe5-1c3905581984
UPDATE asociaciones SET
  historia_es = '[⚠️ NOTA DE CONTROL DE CALIDAD - FUENTE ORIGINAL IMPORTADA DE GALICIA ABIERTA (MAYO DE 2011)]
Se solicita amablemente a la comisión directiva y administración de este micrositio revisar y actualizar este texto histórico para reflejar la realidad de la institución. (Esta nota es de carácter temporal y puede borrarse libremente al editar la sección).

' ||
  'La Asociación Residentes de Mos en Buenos Aires fue fundada en el año 1918 con fines benéficos y recreativos por un grupo de inmigrantes del ayuntamiento de Mos (Pontevedra) para paliar la nostalgia y "morriña" de su tierra de origen. Con esfuerzo colectivo, la comunidad adquirió su sede en Humberto I 3051, constituyendo un faro de cultura pontevedresa en la capital argentina.',

  finalidades_es = '[⚠️ NOTA DE CONTROL DE CALIDAD - FUENTE ORIGINAL IMPORTADA DE GALICIA ABIERTA (MAYO DE 2011)]
Se solicita amablemente a la comisión directiva y administración de este micrositio revisar y actualizar estas finalidades y objetivos. (Esta nota es de carácter temporal y puede borrarse libremente al editar la sección).

' ||
  'Sus objetivos principales consisten en:
1) Mantener vivas las raíces de Mos en Buenos Aires.
2) Coordinar talleres de lengua y cultura gallega, incluyendo escuelas de gaita, pandereta, baile y canto tradicional.
3) Promover el intercambio intergeneracional y el auxilio social de la colectividad.'
WHERE id = 'a4b87cb3-42eb-4c8d-8fe5-1c3905581984';


-- 4. Actualización del resto de asociaciones con la nota de control de calidad
UPDATE asociaciones SET
  historia_es = '[⚠️ NOTA DE CONTROL DE CALIDAD - FUENTE ORIGINAL IMPORTADA DE GALICIA ABIERTA (MAYO DE 2011)]
Se solicita amablemente a la comisión directiva y administración de este micrositio revisar y actualizar este texto histórico para reflejar la realidad de la institución. (Esta nota es de carácter temporal y puede borrarse libremente al editar la sección).

' || historia_es,
  finalidades_es = '[⚠️ NOTA DE CONTROL DE CALIDAD - FUENTE ORIGINAL IMPORTADA DE GALICIA ABIERTA (MAYO DE 2011)]
Se solicita amablemente a la comisión directiva y administración de este micrositio revisar y actualizar estas finalidades y objetivos. (Esta nota es de carácter temporal y puede borrarse libremente al editar la sección).

' || finalidades_es
WHERE id NOT IN ('a4b87cb3-42eb-4c8d-8fe5-1c3905581977', 'a4b87cb3-42eb-4c8d-8fe5-1c3905581983', 'a4b87cb3-42eb-4c8d-8fe5-1c3905581984')
  AND historia_es IS NOT NULL
  AND finalidades_es IS NOT NULL;
