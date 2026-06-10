-- ============================================================
-- El Salvador — Estructura territorial 2024
-- 14 departamentos · 44 municipios · ~262 distritos
--
-- IMPORTANTE: la tabla countries usa url_prefix = 'sv',
-- NO code = 'SV'. El script usa url_prefix.
--
-- Ejecutar en Supabase SQL Editor en este orden:
--   1. Bloque DELETE (limpiar)
--   2. Bloque DO $$ (reinsertar)
-- ============================================================

-- ── 1. LIMPIAR ───────────────────────────────────────────────
DELETE FROM districts;
DELETE FROM municipalities;
DELETE FROM departments
WHERE country_id = (
  SELECT id FROM countries WHERE url_prefix = 'sv'
);

-- ── 2. REINSERTAR ────────────────────────────────────────────
DO $$
DECLARE
  sv_id   uuid;
  dept_id uuid;
  muni_id uuid;
BEGIN
  SELECT id INTO sv_id FROM countries WHERE url_prefix = 'sv';

  -- ══════════════════════════════════════════
  -- 1. AHUACHAPÁN  (3 municipios · 12 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'Ahuachapán')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Ahuachapán Norte')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Atiquizaya'),
    (gen_random_uuid(), muni_id, 'El Refugio'),
    (gen_random_uuid(), muni_id, 'San Lorenzo'),
    (gen_random_uuid(), muni_id, 'Turín');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Ahuachapán Centro')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Ahuachapán'),
    (gen_random_uuid(), muni_id, 'Apaneca'),
    (gen_random_uuid(), muni_id, 'Concepción de Ataco'),
    (gen_random_uuid(), muni_id, 'Tacuba');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Ahuachapán Sur')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Guaymango'),
    (gen_random_uuid(), muni_id, 'Jujutla'),
    (gen_random_uuid(), muni_id, 'San Francisco Menéndez'),
    (gen_random_uuid(), muni_id, 'San Pedro Puxtla');

  -- ══════════════════════════════════════════
  -- 2. CABAÑAS  (2 municipios · 10 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'Cabañas')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Cabañas Este')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Cinquera'),
    (gen_random_uuid(), muni_id, 'Ilobasco'),
    (gen_random_uuid(), muni_id, 'Jutiapa'),
    (gen_random_uuid(), muni_id, 'San Isidro'),
    (gen_random_uuid(), muni_id, 'Sensuntepeque'),
    (gen_random_uuid(), muni_id, 'Tejutepeque'),
    (gen_random_uuid(), muni_id, 'Victoria');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Cabañas Oeste')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Guacotecti'),
    (gen_random_uuid(), muni_id, 'San Pedro Perulapán'),
    (gen_random_uuid(), muni_id, 'Suchitoto');

  -- ══════════════════════════════════════════
  -- 3. CHALATENANGO  (3 municipios · 30 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'Chalatenango')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Chalatenango Norte')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Citalá'),
    (gen_random_uuid(), muni_id, 'La Palma'),
    (gen_random_uuid(), muni_id, 'San Ignacio');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Chalatenango Centro')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Agua Caliente'),
    (gen_random_uuid(), muni_id, 'Chalatenango'),
    (gen_random_uuid(), muni_id, 'Concepción Quezaltepeque'),
    (gen_random_uuid(), muni_id, 'Dulce Nombre de María'),
    (gen_random_uuid(), muni_id, 'El Paraíso'),
    (gen_random_uuid(), muni_id, 'La Laguna'),
    (gen_random_uuid(), muni_id, 'Las Vueltas'),
    (gen_random_uuid(), muni_id, 'Nombre de Jesús'),
    (gen_random_uuid(), muni_id, 'Nueva Concepción'),
    (gen_random_uuid(), muni_id, 'Nueva Trinidad'),
    (gen_random_uuid(), muni_id, 'Ojos de Agua'),
    (gen_random_uuid(), muni_id, 'Potonico'),
    (gen_random_uuid(), muni_id, 'San Antonio de la Cruz'),
    (gen_random_uuid(), muni_id, 'San Antonio Los Ranchos'),
    (gen_random_uuid(), muni_id, 'San Fernando'),
    (gen_random_uuid(), muni_id, 'San Francisco Lempa'),
    (gen_random_uuid(), muni_id, 'San Francisco Morazán'),
    (gen_random_uuid(), muni_id, 'San Isidro Labrador'),
    (gen_random_uuid(), muni_id, 'San Luis del Carmen'),
    (gen_random_uuid(), muni_id, 'San Miguel de Mercedes'),
    (gen_random_uuid(), muni_id, 'San Rafael'),
    (gen_random_uuid(), muni_id, 'Santa Rita'),
    (gen_random_uuid(), muni_id, 'Tejutla');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Chalatenango Sur')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Arcatao'),
    (gen_random_uuid(), muni_id, 'Azacualpa'),
    (gen_random_uuid(), muni_id, 'Comalapa'),
    (gen_random_uuid(), muni_id, 'El Carrizal');

  -- ══════════════════════════════════════════
  -- 4. CUSCATLÁN  (2 municipios · 12 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'Cuscatlán')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Cuscatlán Norte')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Candelaria'),
    (gen_random_uuid(), muni_id, 'Monte San Juan'),
    (gen_random_uuid(), muni_id, 'San Cristóbal'),
    (gen_random_uuid(), muni_id, 'San Pedro Perulapán'),
    (gen_random_uuid(), muni_id, 'San Ramón'),
    (gen_random_uuid(), muni_id, 'Santa Cruz Analquito'),
    (gen_random_uuid(), muni_id, 'Santa Cruz Michapa'),
    (gen_random_uuid(), muni_id, 'Suchitoto');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Cuscatlán Sur')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Cojutepeque'),
    (gen_random_uuid(), muni_id, 'El Carmen'),
    (gen_random_uuid(), muni_id, 'San José Guayabal'),
    (gen_random_uuid(), muni_id, 'Oratorio de Concepción');

  -- ══════════════════════════════════════════
  -- 5. LA LIBERTAD  (6 municipios · 25 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'La Libertad')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'La Libertad Norte')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Colón'),
    (gen_random_uuid(), muni_id, 'San Juan Opico'),
    (gen_random_uuid(), muni_id, 'Sitio del Niño');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'La Libertad Centro')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Antiguo Cuscatlán'),
    (gen_random_uuid(), muni_id, 'Ciudad Arce'),
    (gen_random_uuid(), muni_id, 'Nuevo Cuscatlán'),
    (gen_random_uuid(), muni_id, 'San José Villanueva'),
    (gen_random_uuid(), muni_id, 'Zaragoza');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'La Libertad Este')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Huizúcar'),
    (gen_random_uuid(), muni_id, 'Quezaltepeque'),
    (gen_random_uuid(), muni_id, 'San Matías'),
    (gen_random_uuid(), muni_id, 'San Pablo Tacachico');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'La Libertad Oeste')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Chiltiupán'),
    (gen_random_uuid(), muni_id, 'Jayaque'),
    (gen_random_uuid(), muni_id, 'Jicalapa'),
    (gen_random_uuid(), muni_id, 'La Libertad'),
    (gen_random_uuid(), muni_id, 'Tamanique'),
    (gen_random_uuid(), muni_id, 'Teotepeque');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'La Libertad Sur')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Comasagua'),
    (gen_random_uuid(), muni_id, 'Santa Tecla');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'La Libertad Costa')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Cuisnahuat'),
    (gen_random_uuid(), muni_id, 'Sacacoyo'),
    (gen_random_uuid(), muni_id, 'San Juan Talpa'),
    (gen_random_uuid(), muni_id, 'San Luis Talpa'),
    (gen_random_uuid(), muni_id, 'Tecoluca');

  -- ══════════════════════════════════════════
  -- 6. LA PAZ  (3 municipios · 19 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'La Paz')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'La Paz Norte')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Cuyultitán'),
    (gen_random_uuid(), muni_id, 'El Rosario'),
    (gen_random_uuid(), muni_id, 'Olocuilta'),
    (gen_random_uuid(), muni_id, 'San Antonio Masahuat'),
    (gen_random_uuid(), muni_id, 'San Francisco Chinameca'),
    (gen_random_uuid(), muni_id, 'San Juan Nonualco'),
    (gen_random_uuid(), muni_id, 'San Luis Talpa'),
    (gen_random_uuid(), muni_id, 'San Miguel Tepezontes'),
    (gen_random_uuid(), muni_id, 'San Pedro Masahuat'),
    (gen_random_uuid(), muni_id, 'San Pedro Nonualco'),
    (gen_random_uuid(), muni_id, 'Santa María Ostuma'),
    (gen_random_uuid(), muni_id, 'Santiago Nonualco');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'La Paz Centro')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Mercedes La Ceiba'),
    (gen_random_uuid(), muni_id, 'San Juan Tepezontes'),
    (gen_random_uuid(), muni_id, 'Zacatecoluca');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'La Paz Sur')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Paraíso de Osorio'),
    (gen_random_uuid(), muni_id, 'San Luis La Herradura'),
    (gen_random_uuid(), muni_id, 'San Luis Talpa'),
    (gen_random_uuid(), muni_id, 'Tapalhuaca');

  -- ══════════════════════════════════════════
  -- 7. LA UNIÓN  (2 municipios · 17 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'La Unión')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'La Unión Norte')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Anamorós'),
    (gen_random_uuid(), muni_id, 'Bolívar'),
    (gen_random_uuid(), muni_id, 'Concepción de Oriente'),
    (gen_random_uuid(), muni_id, 'El Sauce'),
    (gen_random_uuid(), muni_id, 'Lislique'),
    (gen_random_uuid(), muni_id, 'Nueva Esparta'),
    (gen_random_uuid(), muni_id, 'Pasaquina'),
    (gen_random_uuid(), muni_id, 'Polorós'),
    (gen_random_uuid(), muni_id, 'San José');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'La Unión Sur')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Conchagua'),
    (gen_random_uuid(), muni_id, 'El Carmen'),
    (gen_random_uuid(), muni_id, 'Intipucá'),
    (gen_random_uuid(), muni_id, 'La Unión'),
    (gen_random_uuid(), muni_id, 'Meanguera del Golfo'),
    (gen_random_uuid(), muni_id, 'San Alejo'),
    (gen_random_uuid(), muni_id, 'Yayantique'),
    (gen_random_uuid(), muni_id, 'Yucuaiquín');

  -- ══════════════════════════════════════════
  -- 8. MORAZÁN  (2 municipios · 28 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'Morazán')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Morazán Norte')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Arambala'),
    (gen_random_uuid(), muni_id, 'Cacaopera'),
    (gen_random_uuid(), muni_id, 'Corinto'),
    (gen_random_uuid(), muni_id, 'El Rosario'),
    (gen_random_uuid(), muni_id, 'Gualococti'),
    (gen_random_uuid(), muni_id, 'Guatajiagua'),
    (gen_random_uuid(), muni_id, 'Joateca'),
    (gen_random_uuid(), muni_id, 'Jocoaitique'),
    (gen_random_uuid(), muni_id, 'Jocoro'),
    (gen_random_uuid(), muni_id, 'Lolotiquillo'),
    (gen_random_uuid(), muni_id, 'Meanguera'),
    (gen_random_uuid(), muni_id, 'Osicala'),
    (gen_random_uuid(), muni_id, 'Perquín'),
    (gen_random_uuid(), muni_id, 'San Fernando'),
    (gen_random_uuid(), muni_id, 'San Isidro'),
    (gen_random_uuid(), muni_id, 'San Simón'),
    (gen_random_uuid(), muni_id, 'Sensembra'),
    (gen_random_uuid(), muni_id, 'Sociedad'),
    (gen_random_uuid(), muni_id, 'Torola'),
    (gen_random_uuid(), muni_id, 'Yamabal'),
    (gen_random_uuid(), muni_id, 'Yoloaiquín');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Morazán Sur')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Chilanga'),
    (gen_random_uuid(), muni_id, 'Delicias de Concepción'),
    (gen_random_uuid(), muni_id, 'El Divisadero'),
    (gen_random_uuid(), muni_id, 'San Carlos'),
    (gen_random_uuid(), muni_id, 'San Francisco Gotera'),
    (gen_random_uuid(), muni_id, 'San Luis'),
    (gen_random_uuid(), muni_id, 'Uluazapa');

  -- ══════════════════════════════════════════
  -- 9. SAN MIGUEL  (3 municipios · 19 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'San Miguel')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'San Miguel Norte')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Ciudad Barrios'),
    (gen_random_uuid(), muni_id, 'Nuevo Edén de San Juan'),
    (gen_random_uuid(), muni_id, 'San Antonio'),
    (gen_random_uuid(), muni_id, 'San Luis de la Reina'),
    (gen_random_uuid(), muni_id, 'Sesori');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'San Miguel Centro')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Carolina'),
    (gen_random_uuid(), muni_id, 'Chapeltique'),
    (gen_random_uuid(), muni_id, 'Chinameca'),
    (gen_random_uuid(), muni_id, 'Chirilagua'),
    (gen_random_uuid(), muni_id, 'El Tránsito'),
    (gen_random_uuid(), muni_id, 'Moncagua'),
    (gen_random_uuid(), muni_id, 'Nueva Guadalupe'),
    (gen_random_uuid(), muni_id, 'Quelepa'),
    (gen_random_uuid(), muni_id, 'San Miguel'),
    (gen_random_uuid(), muni_id, 'San Rafael Oriente');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'San Miguel Oeste')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Comacarán'),
    (gen_random_uuid(), muni_id, 'Lolotique'),
    (gen_random_uuid(), muni_id, 'San Jorge'),
    (gen_random_uuid(), muni_id, 'Uluazapa');

  -- ══════════════════════════════════════════
  -- 10. SAN SALVADOR  (5 municipios · 25 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'San Salvador')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'San Salvador Norte')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Aguilares'),
    (gen_random_uuid(), muni_id, 'El Paisnal'),
    (gen_random_uuid(), muni_id, 'Guazapa');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'San Salvador Oeste')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Apopa'),
    (gen_random_uuid(), muni_id, 'Nejapa');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'San Salvador Este')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Ilopango'),
    (gen_random_uuid(), muni_id, 'San Martín'),
    (gen_random_uuid(), muni_id, 'Soyapango'),
    (gen_random_uuid(), muni_id, 'Tonacatepeque');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'San Salvador Centro')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Ayutuxtepeque'),
    (gen_random_uuid(), muni_id, 'Ciudad Delgado'),
    (gen_random_uuid(), muni_id, 'Cuscatancingo'),
    (gen_random_uuid(), muni_id, 'Mejicanos'),
    (gen_random_uuid(), muni_id, 'Panchimalco'),
    (gen_random_uuid(), muni_id, 'Rosario de Mora'),
    (gen_random_uuid(), muni_id, 'San Marcos'),
    (gen_random_uuid(), muni_id, 'San Salvador'),
    (gen_random_uuid(), muni_id, 'Santiago Texacuangos'),
    (gen_random_uuid(), muni_id, 'Santo Tomás');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'San Salvador Sur')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Olocuilta'),
    (gen_random_uuid(), muni_id, 'San Luis Talpa'),
    (gen_random_uuid(), muni_id, 'San Miguel Tepezontes'),
    (gen_random_uuid(), muni_id, 'San Pedro Masahuat'),
    (gen_random_uuid(), muni_id, 'Santa María Ostuma'),
    (gen_random_uuid(), muni_id, 'Tapalhuaca');

  -- ══════════════════════════════════════════
  -- 11. SAN VICENTE  (2 municipios · 12 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'San Vicente')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'San Vicente Norte')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Apastepeque'),
    (gen_random_uuid(), muni_id, 'San Cayetano Istepeque'),
    (gen_random_uuid(), muni_id, 'San Esteban Catarina'),
    (gen_random_uuid(), muni_id, 'San Ildefonso'),
    (gen_random_uuid(), muni_id, 'San Lorenzo'),
    (gen_random_uuid(), muni_id, 'Santa Clara'),
    (gen_random_uuid(), muni_id, 'Santo Domingo'),
    (gen_random_uuid(), muni_id, 'Verapaz');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'San Vicente Sur')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Guadalupe'),
    (gen_random_uuid(), muni_id, 'San Sebastián'),
    (gen_random_uuid(), muni_id, 'San Vicente'),
    (gen_random_uuid(), muni_id, 'Tecoluca');

  -- ══════════════════════════════════════════
  -- 12. SANTA ANA  (4 municipios · 12 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'Santa Ana')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Santa Ana Norte')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Metapán'),
    (gen_random_uuid(), muni_id, 'Santa Rosa Guachipilín'),
    (gen_random_uuid(), muni_id, 'Texistepeque');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Santa Ana Centro')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Santa Ana');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Santa Ana Este')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Candelaria de la Frontera'),
    (gen_random_uuid(), muni_id, 'Chalchuapa'),
    (gen_random_uuid(), muni_id, 'El Congo'),
    (gen_random_uuid(), muni_id, 'El Porvenir'),
    (gen_random_uuid(), muni_id, 'Masahuat');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Santa Ana Oeste')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Coatepeque'),
    (gen_random_uuid(), muni_id, 'San Antonio Pajonal'),
    (gen_random_uuid(), muni_id, 'Santiago de la Frontera');

  -- ══════════════════════════════════════════
  -- 13. SONSONATE  (4 municipios · 18 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'Sonsonate')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Sonsonate Norte')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Armenia'),
    (gen_random_uuid(), muni_id, 'Caluco'),
    (gen_random_uuid(), muni_id, 'Cuisnahuat'),
    (gen_random_uuid(), muni_id, 'Nahulingo'),
    (gen_random_uuid(), muni_id, 'San Julián'),
    (gen_random_uuid(), muni_id, 'Santa Isabel Ishuatán'),
    (gen_random_uuid(), muni_id, 'Santo Domingo de Guzmán'),
    (gen_random_uuid(), muni_id, 'Sonzacate');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Sonsonate Centro')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Izalco'),
    (gen_random_uuid(), muni_id, 'Nahuizalco'),
    (gen_random_uuid(), muni_id, 'Salcoatitán'),
    (gen_random_uuid(), muni_id, 'Santa Catarina Masahuat'),
    (gen_random_uuid(), muni_id, 'Sonsonate'),
    (gen_random_uuid(), muni_id, 'Tonacatepeque');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Sonsonate Este')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'San Antonio del Monte'),
    (gen_random_uuid(), muni_id, 'San Pablo Tacachico'),
    (gen_random_uuid(), muni_id, 'San Pedro Puxtla');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Sonsonate Oeste')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Acajutla');

  -- ══════════════════════════════════════════
  -- 14. USULUTÁN  (3 municipios · 26 distritos)
  -- ══════════════════════════════════════════
  INSERT INTO departments (id, country_id, name)
    VALUES (gen_random_uuid(), sv_id, 'Usulután')
    RETURNING id INTO dept_id;

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Usulután Norte')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Alegría'),
    (gen_random_uuid(), muni_id, 'Berlín'),
    (gen_random_uuid(), muni_id, 'California'),
    (gen_random_uuid(), muni_id, 'El Triunfo'),
    (gen_random_uuid(), muni_id, 'Estanzuelas'),
    (gen_random_uuid(), muni_id, 'Mercedes Umaña'),
    (gen_random_uuid(), muni_id, 'Ozatlán'),
    (gen_random_uuid(), muni_id, 'Santa Elena'),
    (gen_random_uuid(), muni_id, 'Santiago de María'),
    (gen_random_uuid(), muni_id, 'Tecapán');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Usulután Centro')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Concepción Batres'),
    (gen_random_uuid(), muni_id, 'Ereguayquín'),
    (gen_random_uuid(), muni_id, 'Jiquilisco'),
    (gen_random_uuid(), muni_id, 'Jucuapa'),
    (gen_random_uuid(), muni_id, 'Jucuarán'),
    (gen_random_uuid(), muni_id, 'Nueva Granada'),
    (gen_random_uuid(), muni_id, 'Usulután');

  INSERT INTO municipalities (id, department_id, name)
    VALUES (gen_random_uuid(), dept_id, 'Usulután Sur')
    RETURNING id INTO muni_id;
  INSERT INTO districts (id, municipality_id, name) VALUES
    (gen_random_uuid(), muni_id, 'Asunción Pavón'),
    (gen_random_uuid(), muni_id, 'El Carmen'),
    (gen_random_uuid(), muni_id, 'Filadelfia'),
    (gen_random_uuid(), muni_id, 'General Pedro Antonio Cabrera'),
    (gen_random_uuid(), muni_id, 'Junquillo'),
    (gen_random_uuid(), muni_id, 'Nuevo Mundo'),
    (gen_random_uuid(), muni_id, 'San Buenaventura'),
    (gen_random_uuid(), muni_id, 'San Dionisio'),
    (gen_random_uuid(), muni_id, 'Santa María');

END $$;

-- ── 3. VERIFICAR ─────────────────────────────────────────────
SELECT
  d.name                          AS departamento,
  COUNT(DISTINCT m.id)            AS municipios,
  COUNT(dist.id)                  AS distritos
FROM departments d
JOIN countries c ON c.id = d.country_id AND c.url_prefix = 'sv'
LEFT JOIN municipalities m  ON m.department_id = d.id
LEFT JOIN districts      dist ON dist.municipality_id = m.id
GROUP BY d.name
ORDER BY d.name;

-- Totales globales:
SELECT
  COUNT(DISTINCT d.id)   AS total_departamentos,
  COUNT(DISTINCT m.id)   AS total_municipios,
  COUNT(DISTINCT dist.id) AS total_distritos
FROM departments d
JOIN countries c ON c.id = d.country_id AND c.url_prefix = 'sv'
LEFT JOIN municipalities m   ON m.department_id = d.id
LEFT JOIN districts      dist ON dist.municipality_id = m.id;
