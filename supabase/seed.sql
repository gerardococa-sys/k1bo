-- ============================================================
-- K1BO — Seed data
-- ============================================================

-- Countries
INSERT INTO public.countries (name, code, url_prefix, currency_name, currency_code, currency_symbol, flag_emoji, active) VALUES
  ('El Salvador', 'SV', 'sv', 'Dólar estadounidense', 'USD', '$',   '🇸🇻', true),
  ('Guatemala',   'GT', 'gt', 'Quetzal',              'GTQ', 'Q',   '🇬🇹', false),
  ('Honduras',    'HN', 'hn', 'Lempira',              'HNL', 'L',   '🇭🇳', false),
  ('Nicaragua',   'NI', 'ni', 'Córdoba',              'NIO', 'C$',  '🇳🇮', false),
  ('Costa Rica',  'CR', 'cr', 'Colón',                'CRC', '₡',   '🇨🇷', false),
  ('Panamá',      'PA', 'pa', 'Balboa',               'PAB', 'B/.', '🇵🇦', false),
  ('Belice',      'BZ', 'bz', 'Dólar de Belice',      'BZD', 'BZ$', '🇧🇿', false);

-- ============================================================
-- El Salvador — Departments (14)
-- ============================================================
WITH sv AS (SELECT id FROM public.countries WHERE code = 'SV')
INSERT INTO public.departments (country_id, name)
SELECT sv.id, unnest(ARRAY[
  'Ahuachapán','Santa Ana','Sonsonate','Chalatenango',
  'La Libertad','San Salvador','Cuscatlán','La Paz',
  'Cabañas','San Vicente','Usulután','San Miguel',
  'Morazán','La Unión'
]) FROM sv;

-- ============================================================
-- El Salvador — Municipalities
-- ============================================================

-- Ahuachapán
WITH dept AS (SELECT id FROM public.departments WHERE name = 'Ahuachapán')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Ahuachapán','Apaneca','Atiquizaya','Concepción de Ataco',
  'El Refugio','Guaymango','Jujutla','San Francisco Menéndez',
  'San Lorenzo','San Pedro Puxtla','Tacuba','Turín'
]) FROM dept;

-- Santa Ana
WITH dept AS (SELECT id FROM public.departments WHERE name = 'Santa Ana')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Candelaria de la Frontera','Chalchuapa','Coatepeque',
  'El Congo','El Porvenir','Masahuat','Metapán',
  'San Antonio Pajonal','San Sebastián Salitrillo','Santa Ana',
  'Santa Rosa Guachipilín','Santiago de la Frontera','Texistepeque'
]) FROM dept;

-- Sonsonate
WITH dept AS (SELECT id FROM public.departments WHERE name = 'Sonsonate')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Acajutla','Armenia','Caluco','Cuisnahuat','Izalco','Juayúa',
  'Nahuizalco','Nahulingo','Salcoatitán','San Antonio del Monte',
  'San Julián','Santa Catarina Masahuat','Santa Isabel Ishuatán',
  'Santo Domingo de Guzmán','Sonsonate','Sonzacate'
]) FROM dept;

-- Chalatenango
WITH dept AS (SELECT id FROM public.departments WHERE name = 'Chalatenango')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Agua Caliente','Arcatao','Azacualpa','Cancasque','Citalá',
  'Comalapa','Concepción Quezaltepeque','Chalatenango',
  'Dulce Nombre de María','El Carrizal','El Paraíso','La Laguna',
  'La Palma','La Reina','Las Vueltas','Nombre de Jesús',
  'Nueva Concepción','Nueva Trinidad','Ojos de Agua','Potonico',
  'San Antonio de la Cruz','San Antonio Los Ranchos','San Fernando',
  'San Francisco Lempa','San Francisco Morazán','San Ignacio',
  'San Isidro Labrador','San Luis del Carmen','San Miguel de Mercedes',
  'San Rafael','Santa Rita','Tejutla'
]) FROM dept;

-- La Libertad
WITH dept AS (SELECT id FROM public.departments WHERE name = 'La Libertad')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Antiguo Cuscatlán','Chiltiupán','Ciudad Arce','Colón',
  'Comasagua','Huizúcar','Jayaque','Jicalapa','La Libertad',
  'Nuevo Cuscatlán','Quezaltepeque','San Juan Opico','San Matías',
  'San Pablo Tacachico','Sacacoyo','Santa Tecla','Talnique',
  'Tamanique','Teotepeque','Tepecoyo','Zaragoza'
]) FROM dept;

-- San Salvador
WITH dept AS (SELECT id FROM public.departments WHERE name = 'San Salvador')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Aguilares','Apopa','Ayutuxtepeque','Cuscatancingo','Delgado',
  'El Paisnal','Guazapa','Ilopango','Mejicanos','Nejapa',
  'Panchimalco','Rosario de Mora','San Marcos','San Martín',
  'San Salvador','Santiago Texacuangos','Santo Tomás',
  'Soyapango','Tonacatepeque'
]) FROM dept;

-- Cuscatlán
WITH dept AS (SELECT id FROM public.departments WHERE name = 'Cuscatlán')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Candelaria','Cojutepeque','El Carmen','El Rosario',
  'Monte San Juan','Oratorio de Concepción','San Bartolomé Perulapía',
  'San Cristóbal','San José Guayabal','San Pedro Perulapán',
  'Santa Cruz Analquito','Santa Cruz Michapa','Suchitoto','San Ramón'
]) FROM dept;

-- La Paz
WITH dept AS (SELECT id FROM public.departments WHERE name = 'La Paz')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Cuyultitán','El Rosario','Jerusalén','Mercedes La Ceiba',
  'Olocuilta','Paraíso de Osorio','San Antonio Masahuat',
  'San Emigdio','San Francisco Chinameca','San Juan Nonualco',
  'San Juan Talpa','San Juan Tepezontes','San Luis Talpa',
  'San Miguel Tepezontes','San Pedro Masahuat','San Pedro Nonualco',
  'San Rafael Obrajuelo','Santa María Ostuma','Santiago Nonualco',
  'Tapalhuaca','Zacatecoluca'
]) FROM dept;

-- Cabañas
WITH dept AS (SELECT id FROM public.departments WHERE name = 'Cabañas')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Cinquera','Dolores','Guacotecti','Ilobasco','Jutiapa',
  'San Isidro','Sensuntepeque','Tejutepeque','Victoria'
]) FROM dept;

-- San Vicente
WITH dept AS (SELECT id FROM public.departments WHERE name = 'San Vicente')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Apastepeque','Guadalupe','San Cayetano Istepeque',
  'San Esteban Catarina','San Ildefonso','San Lorenzo',
  'San Sebastián','San Vicente','Santa Clara','Santo Domingo',
  'Tecoluca','Tepetitán','Verapaz'
]) FROM dept;

-- Usulután
WITH dept AS (SELECT id FROM public.departments WHERE name = 'Usulután')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Alegría','Berlín','California','Concepción Batres','El Triunfo',
  'Ereguayquín','Estanzuelas','Jiquilisco','Jucuapa','Jucuarán',
  'Mercedes Umaña','Nueva Granada','Ozatlán','Puerto El Triunfo',
  'San Agustín','San Buenaventura','San Dionisio',
  'San Francisco Javier','Santa Elena','Santa María',
  'Santiago de María','Tecapán','Usulután'
]) FROM dept;

-- San Miguel
WITH dept AS (SELECT id FROM public.departments WHERE name = 'San Miguel')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Carolina','Ciudad Barrios','Comacarán','Chapeltique','Chinameca',
  'Chirilagua','El Tránsito','Lolotique','Moncagua','Nueva Guadalupe',
  'Nuevo Edén de San Juan','Quelepa','San Antonio','San Gerardo',
  'San Jorge','San Luis de la Reina','San Miguel','San Rafael Oriente',
  'Sesori','Uluazapa'
]) FROM dept;

-- Morazán
WITH dept AS (SELECT id FROM public.departments WHERE name = 'Morazán')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Arambala','Cacaopera','Corinto','Chilanga','El Divisadero',
  'El Rosario','Gualococti','Guatajiagua','Joateca','Jocoaitique',
  'Jocoro','Lolotiquillo','Meanguera','Osicala','Perquín','San Carlos',
  'San Fernando','San Francisco Gotera','San Isidro','San Simón',
  'Sensembra','Sociedad','Torola','Yamabal','Yoloaiquín'
]) FROM dept;

-- La Unión
WITH dept AS (SELECT id FROM public.departments WHERE name = 'La Unión')
INSERT INTO public.municipalities (department_id, name)
SELECT dept.id, unnest(ARRAY[
  'Anamorós','Bolívar','Concepción de Oriente','Conchagua',
  'El Carmen','El Sauce','Intipucá','La Unión','Lislique',
  'Meanguera del Golfo','Nueva Esparta','Pasaquina','Polorós',
  'San Alejo','San José','Santa Rosa de Lima','Yayantique','Yucuaiquín'
]) FROM dept;

-- ============================================================
-- Categories & Subcategories
-- ============================================================

-- Main categories
INSERT INTO public.categories (name, slug, description, icon, order_index) VALUES
  ('Cielo Falso',         'cielo-falso',       'Instalación de cielos falsos para interiores.',                                              'layers',     1),
  ('Paneles WPC y PVC',   'paneles-wpc-pvc',   'Revestimiento de paredes interiores y exteriores con paneles de madera plástica (WPC) y PVC.', 'layers',     2),
  ('Ventanas PVC',        'ventanas-pvc',       'Fabricación e instalación de ventanas en perfiles de PVC.',                                  'wind',       3),
  ('Albañilería',         'albanileria',        'Construcción, reparación y acabados en paredes, pisos, repellos y enchapes.',                 'hammer',     4),
  ('Pintura',             'pintura',            'Aplicación de pintura interior y exterior, acabados decorativos.',                            'paintbucket',5),
  ('Jardinería',          'jardineria',         'Diseño, mantenimiento y paisajismo de jardines, podas y limpieza de áreas verdes.',            'treepine',   6),
  ('Fontanería',          'fontaneria',         'Instalación y reparación de tuberías, llaves, sanitarios y sistemas de agua.',                 'droplets',   7),
  ('Electricidad',        'electricidad',       'Instalaciones eléctricas residenciales y comerciales.',                                       'zap',        8),
  ('Estructura Metálica', 'estructura-metalica','Fabricación e instalación de estructuras metálicas para techos, mezanines y portones.',       'building2',  9),
  ('Pisos',               'pisos',              'Instalación de todo tipo de pisos.',                                                           'layers',    10);

-- Subcategories: Cielo Falso
INSERT INTO public.categories (name, slug, description, parent_id, order_index) VALUES
  ('PVC', 'cielo-falso-pvc',
   'Instalación de cielos falsos en láminas de PVC, ideales para ambientes húmedos como baños y cocinas.',
   (SELECT id FROM public.categories WHERE slug = 'cielo-falso'), 1),
  ('Tabla Roca', 'cielo-falso-tabla-roca',
   'Sistemas de cielo falso en tabla roca (gypsum) para interiores con acabados lisos y diseños arquitectónicos.',
   (SELECT id FROM public.categories WHERE slug = 'cielo-falso'), 2);

-- Subcategories: Pisos
INSERT INTO public.categories (name, slug, description, parent_id, order_index) VALUES
  ('Cerámica y Porcelanato', 'pisos-ceramica-porcelanato',
   'Instalación de pisos y paredes en cerámica, porcelanato y materiales vítreos.',
   (SELECT id FROM public.categories WHERE slug = 'pisos'), 1),
  ('Vínico', 'pisos-vinico',
   'Instalación de pisos vínicos en rollo o tablilla para ambientes residenciales y comerciales.',
   (SELECT id FROM public.categories WHERE slug = 'pisos'), 2);
