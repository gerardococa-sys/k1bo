-- ===========================================================
-- K1BO — Datos de Demostración para El Salvador
-- Ejecutar completo en Supabase SQL Editor (Dashboard › SQL Editor)
-- Contraseña de todos los usuarios demo: Demo1234!
-- REQUISITO: ejecutar seed.sql antes para tener categorías/países/departamentos
-- ===========================================================

-- ===========================================================
-- SECCIÓN 1: USUARIOS EN auth.users (3 clientes + 20 profesionales)
-- ===========================================================
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new,
  raw_app_meta_data, raw_user_meta_data, is_super_admin
) VALUES
  -- CLIENTES (para reseñas)
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0001-000000000001','authenticated','authenticated','cliente1@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Ana María Portillo"}',false),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0001-000000000002','authenticated','authenticated','cliente2@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Sandra Beatriz González"}',false),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0001-000000000003','authenticated','authenticated','cliente3@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Mario José Moreno"}',false),
  -- PROFESIONALES — Cielo Falso y Divisiones
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000001','authenticated','authenticated','pro01@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Carlos Hernández Ayala"}',false),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000002','authenticated','authenticated','pro02@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Roberto Martínez Cruz"}',false),
  -- Paneles WPC y PVC
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000003','authenticated','authenticated','pro03@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Miguel Ángel Torres Mendoza"}',false),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000004','authenticated','authenticated','pro04@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"José Luis Ramos Díaz"}',false),
  -- Ventanas PVC
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000005','authenticated','authenticated','pro05@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Eduardo Flores Gutiérrez"}',false),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000006','authenticated','authenticated','pro06@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Óscar Pereira Aguilar"}',false),
  -- Albañilería
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000007','authenticated','authenticated','pro07@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Juan Carlos López Rivas"}',false),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000008','authenticated','authenticated','pro08@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Ernesto Vásquez Portillo"}',false),
  -- Pintura
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000009','authenticated','authenticated','pro09@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Antonio Mejía Salinas"}',false),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000010','authenticated','authenticated','pro10@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Francisco Portillo Chávez"}',false),
  -- Jardinería
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000011','authenticated','authenticated','pro11@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Luis Alberto Morales Pineda"}',false),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000012','authenticated','authenticated','pro12@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Rodrigo Sánchez Henríquez"}',false),
  -- Fontanería
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000013','authenticated','authenticated','pro13@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Héctor Molina Escalón"}',false),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000014','authenticated','authenticated','pro14@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Óscar Fuentes Barrera"}',false),
  -- Electricidad
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000015','authenticated','authenticated','pro15@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Rafael Zelaya Montes"}',false),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000016','authenticated','authenticated','pro16@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Jesús Ramírez Bonilla"}',false),
  -- Estructura Metálica
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000017','authenticated','authenticated','pro17@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Víctor Argueta Mejía"}',false),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000018','authenticated','authenticated','pro18@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Marco Antonio Guzmán Peña"}',false),
  -- Pisos
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000019','authenticated','authenticated','pro19@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Alejandro Reyes Castellanos"}',false),
  ('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000020','authenticated','authenticated','pro20@k1bo-demo.com',crypt('Demo1234!',gen_salt('bf')),now(),now(),now(),'','','','{"provider":"email","providers":["email"]}','{"full_name":"Diego Chávez Hernández"}',false)
ON CONFLICT (id) DO NOTHING;

-- ===========================================================
-- SECCIÓN 2: IDENTIDADES EN auth.identities
-- ===========================================================
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at) VALUES
  ('d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0001-000000000001','cliente1@k1bo-demo.com','{"sub":"d0000000-0000-0000-0001-000000000001","email":"cliente1@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0001-000000000002','cliente2@k1bo-demo.com','{"sub":"d0000000-0000-0000-0001-000000000002","email":"cliente2@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0001-000000000003','cliente3@k1bo-demo.com','{"sub":"d0000000-0000-0000-0001-000000000003","email":"cliente3@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000001','d0000000-0000-0000-0000-000000000001','pro01@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000001","email":"pro01@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000002','pro02@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000002","email":"pro02@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000003','d0000000-0000-0000-0000-000000000003','pro03@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000003","email":"pro03@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000004','d0000000-0000-0000-0000-000000000004','pro04@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000004","email":"pro04@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000005','d0000000-0000-0000-0000-000000000005','pro05@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000005","email":"pro05@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000006','d0000000-0000-0000-0000-000000000006','pro06@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000006","email":"pro06@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000007','d0000000-0000-0000-0000-000000000007','pro07@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000007","email":"pro07@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000008','d0000000-0000-0000-0000-000000000008','pro08@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000008","email":"pro08@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000009','d0000000-0000-0000-0000-000000000009','pro09@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000009","email":"pro09@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000010','d0000000-0000-0000-0000-000000000010','pro10@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000010","email":"pro10@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000011','d0000000-0000-0000-0000-000000000011','pro11@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000011","email":"pro11@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000012','d0000000-0000-0000-0000-000000000012','pro12@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000012","email":"pro12@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000013','d0000000-0000-0000-0000-000000000013','pro13@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000013","email":"pro13@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000014','d0000000-0000-0000-0000-000000000014','pro14@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000014","email":"pro14@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000015','d0000000-0000-0000-0000-000000000015','pro15@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000015","email":"pro15@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000016','d0000000-0000-0000-0000-000000000016','pro16@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000016","email":"pro16@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000017','d0000000-0000-0000-0000-000000000017','pro17@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000017","email":"pro17@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000018','d0000000-0000-0000-0000-000000000018','pro18@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000018","email":"pro18@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000019','d0000000-0000-0000-0000-000000000019','pro19@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000019","email":"pro19@k1bo-demo.com"}','email',now(),now(),now()),
  ('d0000000-0000-0000-0000-000000000020','d0000000-0000-0000-0000-000000000020','pro20@k1bo-demo.com','{"sub":"d0000000-0000-0000-0000-000000000020","email":"pro20@k1bo-demo.com"}','email',now(),now(),now())
ON CONFLICT ON CONSTRAINT identities_pkey DO NOTHING;

-- ===========================================================
-- SECCIÓN 3: PERFILES EN public.profiles
-- ===========================================================
INSERT INTO public.profiles (id, country_id, department_id, role, full_name, phone, address, verified, active) VALUES
  -- Clientes
  ('d0000000-0000-0000-0001-000000000001',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'client','Ana María Portillo','7100-1001','San Salvador, El Salvador',false,true),
  ('d0000000-0000-0000-0001-000000000002',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'client','Sandra Beatriz González','7100-1002','San Salvador, El Salvador',false,true),
  ('d0000000-0000-0000-0001-000000000003',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'client','Mario José Moreno','7100-1003','San Salvador, El Salvador',false,true),
  -- Profesionales
  ('d0000000-0000-0000-0000-000000000001',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Carlos Hernández Ayala','7123-4567','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000002',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Roberto Martínez Cruz','7234-5678','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000003',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Miguel Ángel Torres Mendoza','7345-6789','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000004',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','José Luis Ramos Díaz','7456-7890','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000005',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Eduardo Flores Gutiérrez','7567-8901','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000006',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Óscar Pereira Aguilar','7678-9012','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000007',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Juan Carlos López Rivas','7789-0123','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000008',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Ernesto Vásquez Portillo','7890-1234','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000009',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Antonio Mejía Salinas','7901-2345','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000010',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Francisco Portillo Chávez','7012-3456','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000011',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Luis Alberto Morales Pineda','7123-5678','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000012',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Rodrigo Sánchez Henríquez','7234-6789','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000013',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Héctor Molina Escalón','7345-7890','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000014',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Óscar Fuentes Barrera','7456-8901','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000015',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Rafael Zelaya Montes','7567-9012','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000016',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Jesús Ramírez Bonilla','7678-0123','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000017',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Víctor Argueta Mejía','7789-1234','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000018',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Marco Antonio Guzmán Peña','7890-2345','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000019',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Alejandro Reyes Castellanos','7901-3456','San Salvador, El Salvador',true,true),
  ('d0000000-0000-0000-0000-000000000020',(SELECT id FROM public.countries WHERE code='SV'),(SELECT id FROM public.departments WHERE name='San Salvador'),'professional','Diego Chávez Hernández','7012-4567','San Salvador, El Salvador',true,true)
ON CONFLICT (id) DO NOTHING;

-- ===========================================================
-- SECCIÓN 4: DATOS DE PROFESIONALES
-- ===========================================================
DO $$
DECLARE wh jsonb := '{"lunes":{"open":true,"from":"08:00","to":"17:00"},"martes":{"open":true,"from":"08:00","to":"17:00"},"miercoles":{"open":true,"from":"08:00","to":"17:00"},"jueves":{"open":true,"from":"08:00","to":"17:00"},"viernes":{"open":true,"from":"08:00","to":"17:00"},"sabado":{"open":true,"from":"08:00","to":"12:00"},"domingo":{"open":false}}';
BEGIN
INSERT INTO public.professionals (id, short_description, bio, working_hours, whatsapp, covers_entire_country, featured, total_projects) VALUES
  ('d0000000-0000-0000-0000-000000000001',
   'Especialista en cielos falsos y divisiones de tabla roca con más de 10 años de experiencia.',
   'Carlos Hernández lleva más de 10 años instalando cielos falsos y divisiones de tabla roca en San Salvador. Ha trabajado en proyectos residenciales y comerciales logrando acabados impecables y entregas puntuales. Su experiencia incluye diseños arquitectónicos, instalaciones en áreas húmedas y divisiones de oficinas.',
   wh,'7123-4567',true,true,25),
  ('d0000000-0000-0000-0000-000000000002',
   'Instalación de cielos falsos PVC y tabla roca para hogares y negocios en San Salvador.',
   'Roberto Martínez tiene 8 años de experiencia en la instalación de sistemas de cielo falso en PVC y tabla roca. Trabaja principalmente en el área metropolitana de San Salvador ofreciendo precios competitivos y garantía en su trabajo. Especializado en divisiones de oficinas y acabados decorativos.',
   wh,'7234-5678',false,false,18),
  ('d0000000-0000-0000-0000-000000000003',
   'Instalación de paneles WPC y PVC para interiores y exteriores de alta calidad.',
   'Miguel Ángel Torres se especializa en el revestimiento de paredes con paneles WPC y PVC, materiales modernos que combinan estética y durabilidad. Con 7 años en el rubro ha completado más de 120 proyectos en el área de San Salvador. Ofrece asesoría gratuita y muestra de materiales antes de iniciar.',
   wh,'7345-6789',true,true,22),
  ('d0000000-0000-0000-0000-000000000004',
   'Revestimientos decorativos en paneles WPC y PVC para paredes interiores.',
   'José Luis Ramos ofrece soluciones de revestimiento modernas con paneles WPC y PVC. Con 6 años de trayectoria se ha enfocado en proyectos residenciales en San Salvador y alrededores. Sus trabajos destacan por la precisión en los cortes y el acabado limpio de las instalaciones.',
   wh,'7456-7890',false,false,15),
  ('d0000000-0000-0000-0000-000000000005',
   'Fabricación e instalación de ventanas PVC con herrajes de primera calidad.',
   'Eduardo Flores es técnico especializado en ventanas de PVC desde hace 9 años. Sus instalaciones garantizan ahorro energético, aislamiento acústico y seguridad para el hogar. Atiende proyectos residenciales y comerciales en el departamento de San Salvador con garantía incluida.',
   wh,'7567-8901',true,true,20),
  ('d0000000-0000-0000-0000-000000000006',
   'Ventanas y puertas de PVC a medida, instalación profesional garantizada.',
   'Óscar Pereira ofrece fabricación y montaje de ventanas PVC a medida. Con más de 7 años en el mercado trabaja con importadores directos lo que le permite ofrecer precios competitivos. Su trabajo incluye garantía de un año en mano de obra e instalación.',
   wh,'7678-9012',false,false,14),
  ('d0000000-0000-0000-0000-000000000007',
   'Maestro de obra con 15 años de experiencia en construcción, repellos y enchapes.',
   'Juan Carlos López es maestro de obra con 15 años de experiencia en construcción residencial y comercial. Se especializa en repellos, enchapes, levantado de paredes y reparaciones estructurales. Su trabajo es reconocido por la calidad y limpieza de los acabados finales.',
   wh,'7789-0123',true,true,30),
  ('d0000000-0000-0000-0000-000000000008',
   'Trabajos de albañilería: pisos, paredes, escaleras y reparaciones en general.',
   'Ernesto Vásquez cuenta con 12 años de experiencia en trabajos de albañilería general. Ha trabajado en colonias residenciales y proyectos comerciales del área de San Salvador. Ofrece presupuesto sin costo y garantiza su trabajo por 6 meses.',
   wh,'7890-1234',false,false,24),
  ('d0000000-0000-0000-0000-000000000009',
   'Pintura interior y exterior, acabados decorativos y stencil para su hogar.',
   'Antonio Mejía tiene 11 años pintando interiores y exteriores en el área metropolitana de San Salvador. Trabaja con pinturas de primera calidad y ofrece asesoría en selección de colores sin costo adicional. Sus trabajos incluyen pintura de casas, apartamentos, oficinas y bodegas.',
   wh,'7901-2345',true,true,28),
  ('d0000000-0000-0000-0000-000000000010',
   'Pintor profesional para interiores, exteriores y acabados especiales.',
   'Francisco Portillo es pintor especializado con más de 9 años en el oficio. Se distingue por su cuidado en la preparación de superficies antes de pintar garantizando mayor durabilidad del acabado. Trabaja en proyectos de todos los tamaños en San Salvador.',
   wh,'7012-3456',false,false,19),
  ('d0000000-0000-0000-0000-000000000011',
   'Diseño y mantenimiento de jardines, podas y paisajismo en El Salvador.',
   'Luis Alberto Morales es paisajista con 8 años diseñando y manteniendo jardines en San Salvador. Se especializa en jardines tropicales, sistemas de riego y contratos de mantenimiento mensual. Ha trabajado en residencias, condominios y espacios corporativos.',
   wh,'7123-5678',true,true,21),
  ('d0000000-0000-0000-0000-000000000012',
   'Poda de árboles, limpieza de jardines y mantenimiento de áreas verdes.',
   'Rodrigo Sánchez ofrece servicios de mantenimiento de jardines, podas de altura y limpieza de áreas verdes. Con 6 años de experiencia brinda contratos de mantenimiento mensual y atención de emergencias. Trabaja con equipo propio y personal capacitado.',
   wh,'7234-6789',false,false,16),
  ('d0000000-0000-0000-0000-000000000013',
   'Fontanero certificado, reparación de tuberías, instalación sanitaria y más.',
   'Héctor Molina es fontanero con 13 años de experiencia en instalaciones sanitarias residenciales y comerciales. Atiende emergencias de plomería los 7 días de la semana. Su especialidad incluye detección de fugas, reparación de tuberías y remodelaciones de baños.',
   wh,'7345-7890',true,true,27),
  ('d0000000-0000-0000-0000-000000000014',
   'Instalación y reparación de tuberías, sanitarios y llaves para su hogar.',
   'Óscar Fuentes lleva 10 años resolviendo problemas de fontanería en hogares y negocios del área de San Salvador. Trabaja con materiales certificados y ofrece garantía en materiales y mano de obra. Disponible para emergencias con respuesta en menos de 2 horas.',
   wh,'7456-8901',false,false,23),
  ('d0000000-0000-0000-0000-000000000015',
   'Electricista certificado para instalaciones residenciales y comerciales.',
   'Rafael Zelaya es electricista certificado con 14 años de experiencia. Realiza instalaciones eléctricas desde cero, ampliaciones de panel, instalación de aires acondicionados y soluciones de domótica básica. Su trabajo cumple con las normas eléctricas de El Salvador.',
   wh,'7567-9012',true,true,29),
  ('d0000000-0000-0000-0000-000000000016',
   'Instalaciones eléctricas, cableado estructurado y reparaciones urgentes.',
   'Jesús Ramírez atiende todo tipo de trabajos eléctricos residenciales y comerciales con 11 años en el oficio. Se especializa en cableado estructurado, instalación de luminarias LED y corrección de instalaciones defectuosas. Disponible para emergencias eléctricas.',
   wh,'7678-0123',false,false,20),
  ('d0000000-0000-0000-0000-000000000017',
   'Fabricación e instalación de estructuras metálicas, techos y portones.',
   'Víctor Argueta es herrero especializado con 12 años fabricando e instalando estructuras metálicas. Sus servicios incluyen techos a dos aguas, mezanines, portones automáticos y rejas de seguridad. Trabaja con acero galvanizado y tratamiento anticorrosivo para mayor durabilidad.',
   wh,'7789-1234',true,true,18),
  ('d0000000-0000-0000-0000-000000000018',
   'Estructuras metálicas para techos, pérgolas y protecciones residenciales.',
   'Marco Antonio Guzmán es soldador y estructurista con 9 años de experiencia. Se especializa en techados metálicos, pérgolas, canceles y rejas de seguridad. Sus trabajos incluyen diseño personalizado y tratamiento anticorrosivo para larga vida útil.',
   wh,'7890-2345',false,false,13),
  ('d0000000-0000-0000-0000-000000000019',
   'Instalación de pisos cerámicos, porcelanato y vínico para toda ocasión.',
   'Alejandro Reyes tiene 10 años instalando pisos de todo tipo en San Salvador. Se especializa en cerámica, porcelanato y pisos vínicos para ambientes residenciales y comerciales. Su trabajo incluye nivelación de bases, junteo y acabados impecables.',
   wh,'7901-3456',true,true,26),
  ('d0000000-0000-0000-0000-000000000020',
   'Pisos vínicos, cerámica y porcelanato: instalación rápida y garantizada.',
   'Diego Chávez es instalador de pisos con 7 años de trayectoria. Trabaja con materiales importados y nacionales adaptándose al presupuesto del cliente. Ofrece servicio de levantado de piso viejo, preparación de base y colocación de nuevo piso.',
   wh,'7012-4567',false,false,17)
ON CONFLICT (id) DO NOTHING;
END $$;

-- ===========================================================
-- SECCIÓN 5: CATEGORÍAS POR PROFESIONAL
-- ===========================================================
INSERT INTO public.professional_categories (professional_id, category_id, projects_count)
SELECT p, (SELECT id FROM public.categories WHERE slug = s), c
FROM (VALUES
  -- Cielo Falso y Divisiones
  ('d0000000-0000-0000-0000-000000000001'::uuid,'cielo-falso-divisiones',25),
  ('d0000000-0000-0000-0000-000000000001'::uuid,'cielo-falso-tabla-roca',15),
  ('d0000000-0000-0000-0000-000000000001'::uuid,'divisiones-tabla-roca',10),
  ('d0000000-0000-0000-0000-000000000002'::uuid,'cielo-falso-divisiones',18),
  ('d0000000-0000-0000-0000-000000000002'::uuid,'cielo-falso-pvc-sub',12),
  -- Paneles WPC y PVC
  ('d0000000-0000-0000-0000-000000000003'::uuid,'paneles-wpc-pvc',22),
  ('d0000000-0000-0000-0000-000000000004'::uuid,'paneles-wpc-pvc',15),
  -- Ventanas PVC
  ('d0000000-0000-0000-0000-000000000005'::uuid,'ventanas-pvc',20),
  ('d0000000-0000-0000-0000-000000000006'::uuid,'ventanas-pvc',14),
  -- Albañilería
  ('d0000000-0000-0000-0000-000000000007'::uuid,'albanileria',30),
  ('d0000000-0000-0000-0000-000000000008'::uuid,'albanileria',24),
  -- Pintura
  ('d0000000-0000-0000-0000-000000000009'::uuid,'pintura',28),
  ('d0000000-0000-0000-0000-000000000010'::uuid,'pintura',19),
  -- Jardinería
  ('d0000000-0000-0000-0000-000000000011'::uuid,'jardineria',21),
  ('d0000000-0000-0000-0000-000000000012'::uuid,'jardineria',16),
  -- Fontanería
  ('d0000000-0000-0000-0000-000000000013'::uuid,'fontaneria',27),
  ('d0000000-0000-0000-0000-000000000014'::uuid,'fontaneria',23),
  -- Electricidad
  ('d0000000-0000-0000-0000-000000000015'::uuid,'electricidad',29),
  ('d0000000-0000-0000-0000-000000000016'::uuid,'electricidad',20),
  -- Estructura Metálica
  ('d0000000-0000-0000-0000-000000000017'::uuid,'estructura-metalica',18),
  ('d0000000-0000-0000-0000-000000000018'::uuid,'estructura-metalica',13),
  -- Pisos
  ('d0000000-0000-0000-0000-000000000019'::uuid,'pisos',26),
  ('d0000000-0000-0000-0000-000000000019'::uuid,'pisos-ceramica-porcelanato',16),
  ('d0000000-0000-0000-0000-000000000019'::uuid,'pisos-vinico',10),
  ('d0000000-0000-0000-0000-000000000020'::uuid,'pisos',17),
  ('d0000000-0000-0000-0000-000000000020'::uuid,'pisos-ceramica-porcelanato',12)
) AS t(p, s, c)
ON CONFLICT (professional_id, category_id) DO NOTHING;

-- ===========================================================
-- SECCIÓN 6: COBERTURA GEOGRÁFICA (San Salvador)
-- ===========================================================
INSERT INTO public.professional_coverage (professional_id, department_id)
SELECT unnest(ARRAY[
  'd0000000-0000-0000-0000-000000000001'::uuid,
  'd0000000-0000-0000-0000-000000000002'::uuid,
  'd0000000-0000-0000-0000-000000000003'::uuid,
  'd0000000-0000-0000-0000-000000000004'::uuid,
  'd0000000-0000-0000-0000-000000000005'::uuid,
  'd0000000-0000-0000-0000-000000000006'::uuid,
  'd0000000-0000-0000-0000-000000000007'::uuid,
  'd0000000-0000-0000-0000-000000000008'::uuid,
  'd0000000-0000-0000-0000-000000000009'::uuid,
  'd0000000-0000-0000-0000-000000000010'::uuid,
  'd0000000-0000-0000-0000-000000000011'::uuid,
  'd0000000-0000-0000-0000-000000000012'::uuid,
  'd0000000-0000-0000-0000-000000000013'::uuid,
  'd0000000-0000-0000-0000-000000000014'::uuid,
  'd0000000-0000-0000-0000-000000000015'::uuid,
  'd0000000-0000-0000-0000-000000000016'::uuid,
  'd0000000-0000-0000-0000-000000000017'::uuid,
  'd0000000-0000-0000-0000-000000000018'::uuid,
  'd0000000-0000-0000-0000-000000000019'::uuid,
  'd0000000-0000-0000-0000-000000000020'::uuid
]) AS professional_id,
(SELECT id FROM public.departments WHERE name = 'San Salvador') AS department_id;

-- ===========================================================
-- SECCIÓN 7: SERVICIOS / TAGS
-- ===========================================================
INSERT INTO public.professional_services (professional_id, service_tag) VALUES
  -- pro01 Cielo Falso
  ('d0000000-0000-0000-0000-000000000001','Cielo falso tabla roca'),
  ('d0000000-0000-0000-0000-000000000001','Cielo falso PVC'),
  ('d0000000-0000-0000-0000-000000000001','Divisiones de tabla roca'),
  ('d0000000-0000-0000-0000-000000000001','Fascias y cornisas'),
  -- pro02 Cielo Falso
  ('d0000000-0000-0000-0000-000000000002','Cielo falso PVC'),
  ('d0000000-0000-0000-0000-000000000002','Cielo falso tabla roca'),
  ('d0000000-0000-0000-0000-000000000002','Acabados decorativos'),
  -- pro03 Paneles WPC
  ('d0000000-0000-0000-0000-000000000003','Paneles WPC'),
  ('d0000000-0000-0000-0000-000000000003','Paneles PVC'),
  ('d0000000-0000-0000-0000-000000000003','Revestimiento de paredes'),
  ('d0000000-0000-0000-0000-000000000003','Instalación interior'),
  -- pro04 Paneles WPC
  ('d0000000-0000-0000-0000-000000000004','Paneles WPC'),
  ('d0000000-0000-0000-0000-000000000004','Paneles PVC'),
  ('d0000000-0000-0000-0000-000000000004','Revestimiento decorativo'),
  -- pro05 Ventanas PVC
  ('d0000000-0000-0000-0000-000000000005','Ventanas PVC'),
  ('d0000000-0000-0000-0000-000000000005','Puertas PVC'),
  ('d0000000-0000-0000-0000-000000000005','Aislamiento acústico'),
  ('d0000000-0000-0000-0000-000000000005','Fabricación a medida'),
  -- pro06 Ventanas PVC
  ('d0000000-0000-0000-0000-000000000006','Ventanas PVC'),
  ('d0000000-0000-0000-0000-000000000006','Marcos PVC'),
  ('d0000000-0000-0000-0000-000000000006','Instalación de ventanas'),
  -- pro07 Albañilería
  ('d0000000-0000-0000-0000-000000000007','Repello'),
  ('d0000000-0000-0000-0000-000000000007','Enchape'),
  ('d0000000-0000-0000-0000-000000000007','Levantado de paredes'),
  ('d0000000-0000-0000-0000-000000000007','Fundiciones'),
  -- pro08 Albañilería
  ('d0000000-0000-0000-0000-000000000008','Repello'),
  ('d0000000-0000-0000-0000-000000000008','Enchape de cerámica'),
  ('d0000000-0000-0000-0000-000000000008','Reparaciones generales'),
  -- pro09 Pintura
  ('d0000000-0000-0000-0000-000000000009','Pintura interior'),
  ('d0000000-0000-0000-0000-000000000009','Pintura exterior'),
  ('d0000000-0000-0000-0000-000000000009','Acabados decorativos'),
  ('d0000000-0000-0000-0000-000000000009','Stencil'),
  -- pro10 Pintura
  ('d0000000-0000-0000-0000-000000000010','Pintura residencial'),
  ('d0000000-0000-0000-0000-000000000010','Pintura comercial'),
  ('d0000000-0000-0000-0000-000000000010','Preparación de superficies'),
  -- pro11 Jardinería
  ('d0000000-0000-0000-0000-000000000011','Diseño de jardines'),
  ('d0000000-0000-0000-0000-000000000011','Mantenimiento mensual'),
  ('d0000000-0000-0000-0000-000000000011','Podas'),
  ('d0000000-0000-0000-0000-000000000011','Sistemas de riego'),
  -- pro12 Jardinería
  ('d0000000-0000-0000-0000-000000000012','Podas de árboles'),
  ('d0000000-0000-0000-0000-000000000012','Limpieza de jardines'),
  ('d0000000-0000-0000-0000-000000000012','Mantenimiento de áreas verdes'),
  -- pro13 Fontanería
  ('d0000000-0000-0000-0000-000000000013','Instalación sanitaria'),
  ('d0000000-0000-0000-0000-000000000013','Reparación de tuberías'),
  ('d0000000-0000-0000-0000-000000000013','Detección de fugas'),
  ('d0000000-0000-0000-0000-000000000013','Remodelación de baños'),
  -- pro14 Fontanería
  ('d0000000-0000-0000-0000-000000000014','Plomería general'),
  ('d0000000-0000-0000-0000-000000000014','Instalación de llaves'),
  ('d0000000-0000-0000-0000-000000000014','Emergencias plomería'),
  -- pro15 Electricidad
  ('d0000000-0000-0000-0000-000000000015','Instalaciones eléctricas'),
  ('d0000000-0000-0000-0000-000000000015','Cableado estructurado'),
  ('d0000000-0000-0000-0000-000000000015','Paneles eléctricos'),
  ('d0000000-0000-0000-0000-000000000015','Luminarias LED'),
  -- pro16 Electricidad
  ('d0000000-0000-0000-0000-000000000016','Electricidad residencial'),
  ('d0000000-0000-0000-0000-000000000016','Reparaciones eléctricas'),
  ('d0000000-0000-0000-0000-000000000016','Iluminación comercial'),
  -- pro17 Estructura Metálica
  ('d0000000-0000-0000-0000-000000000017','Techos metálicos'),
  ('d0000000-0000-0000-0000-000000000017','Portones'),
  ('d0000000-0000-0000-0000-000000000017','Rejas de seguridad'),
  ('d0000000-0000-0000-0000-000000000017','Soldadura'),
  -- pro18 Estructura Metálica
  ('d0000000-0000-0000-0000-000000000018','Pérgolas'),
  ('d0000000-0000-0000-0000-000000000018','Canceles metálicos'),
  ('d0000000-0000-0000-0000-000000000018','Soldadura industrial'),
  -- pro19 Pisos
  ('d0000000-0000-0000-0000-000000000019','Cerámica y porcelanato'),
  ('d0000000-0000-0000-0000-000000000019','Piso vínico'),
  ('d0000000-0000-0000-0000-000000000019','Nivelación de base'),
  ('d0000000-0000-0000-0000-000000000019','Instalación de pisos'),
  -- pro20 Pisos
  ('d0000000-0000-0000-0000-000000000020','Porcelanato'),
  ('d0000000-0000-0000-0000-000000000020','Cerámica'),
  ('d0000000-0000-0000-0000-000000000020','Levantado de piso viejo'),
  ('d0000000-0000-0000-0000-000000000020','Pisos comerciales');

-- ===========================================================
-- SECCIÓN 8: SOLICITUDES DE COTIZACIÓN (requeridas por reseñas)
-- Cada profesional tiene 3 solicitudes (una por cliente)
-- ===========================================================
INSERT INTO public.quote_requests (id, country_id, client_id, professional_id, category_id, description, required_date, status, created_at) VALUES
  -- pro01 (Cielo Falso y Divisiones)
  ('d0000000-0000-0000-0002-000000000001',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000001',(SELECT id FROM public.categories WHERE slug='cielo-falso-divisiones'),'Necesito instalar cielo falso de tabla roca en mi sala y comedor.','2024-02-10','accepted','2024-01-20 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000002',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000001',(SELECT id FROM public.categories WHERE slug='cielo-falso-divisiones'),'Quiero instalar divisiones de tabla roca para separar mi oficina.','2024-03-05','accepted','2024-02-10 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000003',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000001',(SELECT id FROM public.categories WHERE slug='cielo-falso-divisiones'),'Instalar cielo falso en habitación principal.','2024-04-01','accepted','2024-03-05 11:00:00+00'),
  -- pro02
  ('d0000000-0000-0000-0002-000000000004',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000002',(SELECT id FROM public.categories WHERE slug='cielo-falso-divisiones'),'Cielo falso PVC para baño y cocina.','2024-02-15','accepted','2024-01-25 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000005',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000002',(SELECT id FROM public.categories WHERE slug='cielo-falso-divisiones'),'Reparación de cielo falso dañado por humedad.','2024-03-10','accepted','2024-02-15 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000006',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000002',(SELECT id FROM public.categories WHERE slug='cielo-falso-divisiones'),'Cielo falso para sala de reuniones.','2024-04-05','accepted','2024-03-10 11:00:00+00'),
  -- pro03 (Paneles WPC)
  ('d0000000-0000-0000-0002-000000000007',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000003',(SELECT id FROM public.categories WHERE slug='paneles-wpc-pvc'),'Revestir paredes de sala con paneles WPC decorativos.','2024-02-20','accepted','2024-01-30 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000008',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000003',(SELECT id FROM public.categories WHERE slug='paneles-wpc-pvc'),'Paneles WPC para local comercial.','2024-03-15','accepted','2024-02-20 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000009',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000003',(SELECT id FROM public.categories WHERE slug='paneles-wpc-pvc'),'Revestimiento de pared exterior con paneles PVC.','2024-04-10','accepted','2024-03-15 11:00:00+00'),
  -- pro04
  ('d0000000-0000-0000-0002-000000000010',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000004',(SELECT id FROM public.categories WHERE slug='paneles-wpc-pvc'),'Paneles decorativos para recepción de oficina.','2024-03-01','accepted','2024-02-05 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000011',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000004',(SELECT id FROM public.categories WHERE slug='paneles-wpc-pvc'),'Revestimiento WPC para dormitorio principal.','2024-03-20','accepted','2024-02-25 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000012',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000004',(SELECT id FROM public.categories WHERE slug='paneles-wpc-pvc'),'Paneles PVC para área de cocina.','2024-04-15','accepted','2024-03-20 11:00:00+00'),
  -- pro05 (Ventanas PVC)
  ('d0000000-0000-0000-0002-000000000013',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000005',(SELECT id FROM public.categories WHERE slug='ventanas-pvc'),'Cambiar 6 ventanas de aluminio por PVC en mi casa.','2024-03-05','accepted','2024-02-10 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000014',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000005',(SELECT id FROM public.categories WHERE slug='ventanas-pvc'),'Ventanas PVC para segundo piso de residencia.','2024-03-25','accepted','2024-03-01 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000015',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000005',(SELECT id FROM public.categories WHERE slug='ventanas-pvc'),'Puerta de PVC para entrada principal.','2024-04-20','accepted','2024-03-25 11:00:00+00'),
  -- pro06
  ('d0000000-0000-0000-0002-000000000016',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000006',(SELECT id FROM public.categories WHERE slug='ventanas-pvc'),'Ventanas PVC a medida para local comercial.','2024-03-10','accepted','2024-02-15 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000017',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000006',(SELECT id FROM public.categories WHERE slug='ventanas-pvc'),'Reparación de ventana PVC dañada.','2024-03-30','accepted','2024-03-05 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000018',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000006',(SELECT id FROM public.categories WHERE slug='ventanas-pvc'),'Instalar ventana PVC en habitación nueva.','2024-04-25','accepted','2024-03-30 11:00:00+00'),
  -- pro07 (Albañilería)
  ('d0000000-0000-0000-0002-000000000019',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000007',(SELECT id FROM public.categories WHERE slug='albanileria'),'Repello de fachada exterior completa.','2024-03-15','accepted','2024-02-20 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000020',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000007',(SELECT id FROM public.categories WHERE slug='albanileria'),'Enchape de cerámica en cocina y dos baños.','2024-04-05','accepted','2024-03-10 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000021',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000007',(SELECT id FROM public.categories WHERE slug='albanileria'),'Levantar pared divisoria en patio.','2024-05-01','accepted','2024-04-05 11:00:00+00'),
  -- pro08
  ('d0000000-0000-0000-0002-000000000022',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000008',(SELECT id FROM public.categories WHERE slug='albanileria'),'Reparar grietas en paredes interiores.','2024-03-20','accepted','2024-02-25 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000023',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000008',(SELECT id FROM public.categories WHERE slug='albanileria'),'Enchape de patio con cerámica antideslizante.','2024-04-10','accepted','2024-03-15 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000024',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000008',(SELECT id FROM public.categories WHERE slug='albanileria'),'Fundir losa de cochera.','2024-05-05','accepted','2024-04-10 11:00:00+00'),
  -- pro09 (Pintura)
  ('d0000000-0000-0000-0002-000000000025',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000009',(SELECT id FROM public.categories WHERE slug='pintura'),'Pintar interior completo de casa de 3 habitaciones.','2024-04-01','accepted','2024-03-05 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000026',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000009',(SELECT id FROM public.categories WHERE slug='pintura'),'Pintura exterior de fachada y barda.','2024-04-20','accepted','2024-03-25 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000027',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000009',(SELECT id FROM public.categories WHERE slug='pintura'),'Pintar local comercial interior.','2024-05-10','accepted','2024-04-15 11:00:00+00'),
  -- pro10
  ('d0000000-0000-0000-0002-000000000028',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000010',(SELECT id FROM public.categories WHERE slug='pintura'),'Pintura de apartamento recién construido.','2024-04-05','accepted','2024-03-10 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000029',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000010',(SELECT id FROM public.categories WHERE slug='pintura'),'Repintar habitaciones con acabado mate.','2024-04-25','accepted','2024-03-30 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000030',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000010',(SELECT id FROM public.categories WHERE slug='pintura'),'Pintura de oficina corporativa.','2024-05-15','accepted','2024-04-20 11:00:00+00'),
  -- pro11 (Jardinería)
  ('d0000000-0000-0000-0002-000000000031',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000011',(SELECT id FROM public.categories WHERE slug='jardineria'),'Diseñar jardín trasero desde cero.','2024-04-10','accepted','2024-03-15 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000032',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000011',(SELECT id FROM public.categories WHERE slug='jardineria'),'Mantenimiento mensual de jardín grande.','2024-04-30','accepted','2024-04-05 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000033',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000011',(SELECT id FROM public.categories WHERE slug='jardineria'),'Poda de 5 árboles grandes.','2024-05-20','accepted','2024-04-25 11:00:00+00'),
  -- pro12
  ('d0000000-0000-0000-0002-000000000034',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000012',(SELECT id FROM public.categories WHERE slug='jardineria'),'Limpieza y mantenimiento de jardín descuidado.','2024-04-15','accepted','2024-03-20 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000035',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000012',(SELECT id FROM public.categories WHERE slug='jardineria'),'Contrato de mantenimiento quincenal.','2024-05-05','accepted','2024-04-10 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000036',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000012',(SELECT id FROM public.categories WHERE slug='jardineria'),'Podas y limpieza general de área verde.','2024-05-25','accepted','2024-04-30 11:00:00+00'),
  -- pro13 (Fontanería)
  ('d0000000-0000-0000-0002-000000000037',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000013',(SELECT id FROM public.categories WHERE slug='fontaneria'),'Reparar fuga de agua bajo el lavadero.','2024-04-20','accepted','2024-03-25 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000038',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000013',(SELECT id FROM public.categories WHERE slug='fontaneria'),'Instalación completa de baño nuevo.','2024-05-10','accepted','2024-04-15 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000039',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000013',(SELECT id FROM public.categories WHERE slug='fontaneria'),'Cambio de tubería de agua fría completa.','2024-06-01','accepted','2024-05-05 11:00:00+00'),
  -- pro14
  ('d0000000-0000-0000-0002-000000000040',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000014',(SELECT id FROM public.categories WHERE slug='fontaneria'),'Instalar nueva llave de cocina.','2024-04-25','accepted','2024-03-30 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000041',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000014',(SELECT id FROM public.categories WHERE slug='fontaneria'),'Detección de fuga en pared.','2024-05-15','accepted','2024-04-20 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000042',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000014',(SELECT id FROM public.categories WHERE slug='fontaneria'),'Reemplazar tuberías de baño principal.','2024-06-05','accepted','2024-05-10 11:00:00+00'),
  -- pro15 (Electricidad)
  ('d0000000-0000-0000-0002-000000000043',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000015',(SELECT id FROM public.categories WHERE slug='electricidad'),'Instalación eléctrica completa de casa nueva.','2024-05-01','accepted','2024-04-05 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000044',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000015',(SELECT id FROM public.categories WHERE slug='electricidad'),'Revisión y corrección de instalación defectuosa.','2024-05-20','accepted','2024-04-25 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000045',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000015',(SELECT id FROM public.categories WHERE slug='electricidad'),'Instalar luminarias LED en oficina.','2024-06-10','accepted','2024-05-15 11:00:00+00'),
  -- pro16
  ('d0000000-0000-0000-0002-000000000046',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000016',(SELECT id FROM public.categories WHERE slug='electricidad'),'Agregar tomas y apagadores en sala.','2024-05-05','accepted','2024-04-10 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000047',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000016',(SELECT id FROM public.categories WHERE slug='electricidad'),'Reparar corto circuito en cocina.','2024-05-25','accepted','2024-04-30 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000048',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000016',(SELECT id FROM public.categories WHERE slug='electricidad'),'Cableado estructurado para red de datos.','2024-06-15','accepted','2024-05-20 11:00:00+00'),
  -- pro17 (Estructura Metálica)
  ('d0000000-0000-0000-0002-000000000049',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000017',(SELECT id FROM public.categories WHERE slug='estructura-metalica'),'Techo metálico a dos aguas para bodega.','2024-05-10','accepted','2024-04-15 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000050',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000017',(SELECT id FROM public.categories WHERE slug='estructura-metalica'),'Portón eléctrico corredizo para residencia.','2024-05-30','accepted','2024-05-05 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000051',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000017',(SELECT id FROM public.categories WHERE slug='estructura-metalica'),'Rejas de seguridad para ventanas.','2024-06-20','accepted','2024-05-25 11:00:00+00'),
  -- pro18
  ('d0000000-0000-0000-0002-000000000052',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000018',(SELECT id FROM public.categories WHERE slug='estructura-metalica'),'Pérgola metálica para terraza.','2024-05-15','accepted','2024-04-20 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000053',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000018',(SELECT id FROM public.categories WHERE slug='estructura-metalica'),'Canceles metálicos para cochera doble.','2024-06-05','accepted','2024-05-10 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000054',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000018',(SELECT id FROM public.categories WHERE slug='estructura-metalica'),'Techo metálico para cochera.','2024-06-25','accepted','2024-05-30 11:00:00+00'),
  -- pro19 (Pisos)
  ('d0000000-0000-0000-0002-000000000055',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000019',(SELECT id FROM public.categories WHERE slug='pisos'),'Instalar porcelanato en sala, comedor y pasillos.','2024-05-20','accepted','2024-04-25 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000056',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000019',(SELECT id FROM public.categories WHERE slug='pisos'),'Piso vínico para oficina de 80m².','2024-06-10','accepted','2024-05-15 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000057',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000019',(SELECT id FROM public.categories WHERE slug='pisos'),'Levantar piso viejo y poner cerámica nueva.','2024-07-01','accepted','2024-06-05 11:00:00+00'),
  -- pro20
  ('d0000000-0000-0000-0002-000000000058',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0000-000000000020',(SELECT id FROM public.categories WHERE slug='pisos'),'Instalar cerámica en 3 habitaciones.','2024-05-25','accepted','2024-04-30 09:00:00+00'),
  ('d0000000-0000-0000-0002-000000000059',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0000-000000000020',(SELECT id FROM public.categories WHERE slug='pisos'),'Porcelanato en planta baja completa.','2024-06-15','accepted','2024-05-20 10:00:00+00'),
  ('d0000000-0000-0000-0002-000000000060',(SELECT id FROM public.countries WHERE code='SV'),'d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0000-000000000020',(SELECT id FROM public.categories WHERE slug='pisos'),'Piso para local comercial 120m².','2024-07-05','accepted','2024-06-10 11:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- ===========================================================
-- SECCIÓN 9: RESEÑAS (3 por profesional = 60 reseñas)
-- ===========================================================
INSERT INTO public.reviews (professional_id, client_id, quote_request_id, category_id, country_id, rating, comment, created_at) VALUES
  -- pro01 Cielo Falso
  ('d0000000-0000-0000-0000-000000000001','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000001',(SELECT id FROM public.categories WHERE slug='cielo-falso-divisiones'),(SELECT id FROM public.countries WHERE code='SV'),5,'Excelente trabajo en el cielo falso de mi sala. Quedó perfecto, limpio y terminado a tiempo. Lo recomiendo sin dudarlo.','2024-02-20 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000001','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000002',(SELECT id FROM public.categories WHERE slug='cielo-falso-divisiones'),(SELECT id FROM public.countries WHERE code='SV'),5,'Instaló divisiones de tabla roca en mi oficina con acabados muy profesionales. Puntual y ordenado.','2024-03-15 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000001','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000003',(SELECT id FROM public.categories WHERE slug='cielo-falso-divisiones'),(SELECT id FROM public.countries WHERE code='SV'),4,'Buen trabajo y precio justo. El cielo falso de mi habitación quedó muy bien, recomendado.','2024-04-10 16:00:00+00'),
  -- pro02
  ('d0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000004',(SELECT id FROM public.categories WHERE slug='cielo-falso-divisiones'),(SELECT id FROM public.countries WHERE code='SV'),5,'Instaló cielo falso PVC en baño y cocina. Resistente a la humedad y quedó perfecto.','2024-02-25 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000005',(SELECT id FROM public.categories WHERE slug='cielo-falso-divisiones'),(SELECT id FROM public.countries WHERE code='SV'),4,'Muy amable y trabajador. Reparó el cielo dañado de manera eficiente y con garantía.','2024-03-20 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000006',(SELECT id FROM public.categories WHERE slug='cielo-falso-divisiones'),(SELECT id FROM public.countries WHERE code='SV'),4,'Precio justo y buena calidad. Mi sala de reuniones quedó con un aspecto muy profesional.','2024-04-15 16:00:00+00'),
  -- pro03 Paneles WPC
  ('d0000000-0000-0000-0000-000000000003','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000007',(SELECT id FROM public.categories WHERE slug='paneles-wpc-pvc'),(SELECT id FROM public.countries WHERE code='SV'),5,'Transformó mis paredes con paneles WPC. El resultado es increíble y muy moderno.','2024-03-01 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000003','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000008',(SELECT id FROM public.categories WHERE slug='paneles-wpc-pvc'),(SELECT id FROM public.countries WHERE code='SV'),5,'Trabajo limpio, rápido y profesional. Los paneles quedaron perfectos en mi negocio.','2024-03-25 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000003','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000009',(SELECT id FROM public.categories WHERE slug='paneles-wpc-pvc'),(SELECT id FROM public.countries WHERE code='SV'),4,'Materiales de calidad y buena instalación. Mi pared exterior quedó muy bien.','2024-04-20 16:00:00+00'),
  -- pro04
  ('d0000000-0000-0000-0000-000000000004','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000010',(SELECT id FROM public.categories WHERE slug='paneles-wpc-pvc'),(SELECT id FROM public.countries WHERE code='SV'),5,'Instaló paneles en mi recepción y quedó elegantísima. Muy recomendado.','2024-03-10 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000004','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000011',(SELECT id FROM public.categories WHERE slug='paneles-wpc-pvc'),(SELECT id FROM public.countries WHERE code='SV'),4,'Buen profesional, trabajo ordenado y acabado de primera calidad.','2024-03-30 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000004','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000012',(SELECT id FROM public.categories WHERE slug='paneles-wpc-pvc'),(SELECT id FROM public.countries WHERE code='SV'),4,'Precio competitivo y excelente resultado. Definitivamente lo volvería a contratar.','2024-04-25 16:00:00+00'),
  -- pro05 Ventanas PVC
  ('d0000000-0000-0000-0000-000000000005','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000013',(SELECT id FROM public.categories WHERE slug='ventanas-pvc'),(SELECT id FROM public.countries WHERE code='SV'),5,'Mis ventanas nuevas de PVC son perfectas. Reducen mucho el calor y el ruido de la calle.','2024-03-15 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000005','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000014',(SELECT id FROM public.categories WHERE slug='ventanas-pvc'),(SELECT id FROM public.countries WHERE code='SV'),5,'Instalación rápida y limpia. Los marcos quedaron bien sellados, sin filtraciones.','2024-04-05 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000005','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000015',(SELECT id FROM public.categories WHERE slug='ventanas-pvc'),(SELECT id FROM public.countries WHERE code='SV'),4,'Excelente inversión. La diferencia en temperatura dentro de mi casa es muy notable.','2024-05-01 16:00:00+00'),
  -- pro06
  ('d0000000-0000-0000-0000-000000000006','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000016',(SELECT id FROM public.categories WHERE slug='ventanas-pvc'),(SELECT id FROM public.countries WHERE code='SV'),5,'Ventanas a medida, bien instaladas y con garantía incluida. Muy satisfecho.','2024-03-20 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000006','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000017',(SELECT id FROM public.categories WHERE slug='ventanas-pvc'),(SELECT id FROM public.countries WHERE code='SV'),4,'Profesional y puntual. Mi casa quedó mucho más fresca y silenciosa.','2024-04-10 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000006','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000018',(SELECT id FROM public.categories WHERE slug='ventanas-pvc'),(SELECT id FROM public.countries WHERE code='SV'),4,'Atendió todas mis dudas y el resultado fue exactamente el esperado.','2024-05-05 16:00:00+00'),
  -- pro07 Albañilería
  ('d0000000-0000-0000-0000-000000000007','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000019',(SELECT id FROM public.categories WHERE slug='albanileria'),(SELECT id FROM public.countries WHERE code='SV'),5,'Repelló toda mi casa con acabados increíblemente lisos. Trabajo de maestro, muy profesional.','2024-03-25 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000007','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000020',(SELECT id FROM public.categories WHERE slug='albanileria'),(SELECT id FROM public.countries WHERE code='SV'),5,'Enchapó cocina y dos baños con cerámica. Trabajo muy limpio y bien medido. Excelente.','2024-04-15 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000007','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000021',(SELECT id FROM public.categories WHERE slug='albanileria'),(SELECT id FROM public.countries WHERE code='SV'),4,'Levantó la pared divisoria en tiempo récord. Sólida y bien terminada, recomendado.','2024-05-10 16:00:00+00'),
  -- pro08
  ('d0000000-0000-0000-0000-000000000008','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000022',(SELECT id FROM public.categories WHERE slug='albanileria'),(SELECT id FROM public.countries WHERE code='SV'),5,'Excelente albañil, conoce muy bien el oficio. Mi patio quedó como nuevo.','2024-03-30 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000008','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000023',(SELECT id FROM public.categories WHERE slug='albanileria'),(SELECT id FROM public.countries WHERE code='SV'),4,'Trabajó con mucho cuidado y limpieza. Recomendado 100%, volveré a contratarlo.','2024-04-20 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000008','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000024',(SELECT id FROM public.categories WHERE slug='albanileria'),(SELECT id FROM public.countries WHERE code='SV'),4,'Buen precio, cumplió el plazo acordado y dejó todo muy limpio al terminar.','2024-05-15 16:00:00+00'),
  -- pro09 Pintura
  ('d0000000-0000-0000-0000-000000000009','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000025',(SELECT id FROM public.categories WHERE slug='pintura'),(SELECT id FROM public.countries WHERE code='SV'),5,'Pintó toda mi casa interior en 3 días. Colores exactos, acabado muy limpio y profesional.','2024-04-10 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000009','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000026',(SELECT id FROM public.categories WHERE slug='pintura'),(SELECT id FROM public.countries WHERE code='SV'),5,'Excelente preparación de superficies antes de pintar. El acabado dura más que antes.','2024-05-01 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000009','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000027',(SELECT id FROM public.categories WHERE slug='pintura'),(SELECT id FROM public.countries WHERE code='SV'),4,'Mi negocio quedó como nuevo después de la pintura. Muy profesional y puntual.','2024-05-20 16:00:00+00'),
  -- pro10
  ('d0000000-0000-0000-0000-000000000010','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000028',(SELECT id FROM public.categories WHERE slug='pintura'),(SELECT id FROM public.countries WHERE code='SV'),5,'Puntual, ordenado y trabajó con mucho cuidado. Totalmente recomendado.','2024-04-15 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000010','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000029',(SELECT id FROM public.categories WHERE slug='pintura'),(SELECT id FROM public.countries WHERE code='SV'),4,'Los colores quedaron uniformes y sin manchas. Muy satisfecho con el resultado.','2024-05-05 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000010','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000030',(SELECT id FROM public.categories WHERE slug='pintura'),(SELECT id FROM public.countries WHERE code='SV'),4,'Precio justo y resultado excelente en pintura interior y exterior.','2024-05-25 16:00:00+00'),
  -- pro11 Jardinería
  ('d0000000-0000-0000-0000-000000000011','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000031',(SELECT id FROM public.categories WHERE slug='jardineria'),(SELECT id FROM public.countries WHERE code='SV'),5,'Diseñó y sembró mi jardín de cero. Quedó hermoso y muy bien organizado.','2024-04-20 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000011','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000032',(SELECT id FROM public.categories WHERE slug='jardineria'),(SELECT id FROM public.countries WHERE code='SV'),5,'Mantiene mi jardín mensualmente con mucha dedicación. Siempre puntual y responsable.','2024-05-10 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000011','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000033',(SELECT id FROM public.categories WHERE slug='jardineria'),(SELECT id FROM public.countries WHERE code='SV'),4,'Podó todos mis árboles sin dañar las plantas del alrededor. Trabajo muy experto.','2024-06-01 16:00:00+00'),
  -- pro12
  ('d0000000-0000-0000-0000-000000000012','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000034',(SELECT id FROM public.categories WHERE slug='jardineria'),(SELECT id FROM public.countries WHERE code='SV'),5,'Limpió mi jardín abandonado y lo dejó como nuevo. Muy buen trabajo y precio justo.','2024-04-25 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000012','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000035',(SELECT id FROM public.categories WHERE slug='jardineria'),(SELECT id FROM public.countries WHERE code='SV'),4,'Atendió mi jardín con mucho esmero. Lo recomendaría a cualquier persona.','2024-05-15 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000012','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000036',(SELECT id FROM public.categories WHERE slug='jardineria'),(SELECT id FROM public.countries WHERE code='SV'),4,'Buen servicio de mantenimiento. Mi jardín nunca había estado tan bien cuidado.','2024-06-05 16:00:00+00'),
  -- pro13 Fontanería
  ('d0000000-0000-0000-0000-000000000013','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000037',(SELECT id FROM public.categories WHERE slug='fontaneria'),(SELECT id FROM public.countries WHERE code='SV'),5,'Resolvió una fuga que tenía meses en minutos. Rápido, limpio y garantizó su trabajo.','2024-05-01 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000013','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000038',(SELECT id FROM public.categories WHERE slug='fontaneria'),(SELECT id FROM public.countries WHERE code='SV'),5,'Instaló nueva tubería en mi baño completamente. Trabajo de primera calidad y limpio.','2024-05-20 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000013','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000039',(SELECT id FROM public.categories WHERE slug='fontaneria'),(SELECT id FROM public.countries WHERE code='SV'),4,'Atendió emergencia de plomería un sábado por la tarde. Muy agradecido con su servicio.','2024-06-10 16:00:00+00'),
  -- pro14
  ('d0000000-0000-0000-0000-000000000014','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000040',(SELECT id FROM public.categories WHERE slug='fontaneria'),(SELECT id FROM public.countries WHERE code='SV'),5,'Cambió la llave de cocina con rapidez y limpieza. Muy profesional en su trabajo.','2024-05-05 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000014','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000041',(SELECT id FROM public.categories WHERE slug='fontaneria'),(SELECT id FROM public.countries WHERE code='SV'),4,'Detectó y reparó una fuga oculta en la pared. Excelente trabajo diagnóstico.','2024-05-25 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000014','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000042',(SELECT id FROM public.categories WHERE slug='fontaneria'),(SELECT id FROM public.countries WHERE code='SV'),4,'Buena atención, trabajo limpio y precio razonable. Lo recomiendo ampliamente.','2024-06-15 16:00:00+00'),
  -- pro15 Electricidad
  ('d0000000-0000-0000-0000-000000000015','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000043',(SELECT id FROM public.categories WHERE slug='electricidad'),(SELECT id FROM public.countries WHERE code='SV'),5,'Instaló el cableado completo de mi casa nueva cumpliendo todas las normas eléctricas.','2024-05-10 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000015','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000044',(SELECT id FROM public.categories WHERE slug='electricidad'),(SELECT id FROM public.countries WHERE code='SV'),5,'Revisó y corrigió mi instalación eléctrica defectuosa. Trabajo muy seguro y profesional.','2024-06-01 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000015','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000045',(SELECT id FROM public.categories WHERE slug='electricidad'),(SELECT id FROM public.countries WHERE code='SV'),4,'Instaló luminarias LED en toda mi oficina. El ahorro en electricidad es muy notable.','2024-06-20 16:00:00+00'),
  -- pro16
  ('d0000000-0000-0000-0000-000000000016','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000046',(SELECT id FROM public.categories WHERE slug='electricidad'),(SELECT id FROM public.countries WHERE code='SV'),5,'Resolvió un problema eléctrico urgente con rapidez y profesionalismo. Excelente.','2024-05-15 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000016','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000047',(SELECT id FROM public.categories WHERE slug='electricidad'),(SELECT id FROM public.countries WHERE code='SV'),4,'Instalación de sockets y apagadores muy ordenada y limpia. Muy recomendado.','2024-06-05 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000016','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000048',(SELECT id FROM public.categories WHERE slug='electricidad'),(SELECT id FROM public.countries WHERE code='SV'),4,'Muy confiable y conoce bien el oficio. Mi negocio quedó con instalación segura.','2024-06-25 16:00:00+00'),
  -- pro17 Estructura Metálica
  ('d0000000-0000-0000-0000-000000000017','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000049',(SELECT id FROM public.categories WHERE slug='estructura-metalica'),(SELECT id FROM public.countries WHERE code='SV'),5,'Fabricó e instaló el techo de mi bodega. Estructura sólida, bien soldada y duradera.','2024-05-20 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000017','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000050',(SELECT id FROM public.categories WHERE slug='estructura-metalica'),(SELECT id FROM public.countries WHERE code='SV'),5,'Instaló portón eléctrico en mi casa. Muy duradero, seguro y con garantía incluida.','2024-06-10 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000017','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000051',(SELECT id FROM public.categories WHERE slug='estructura-metalica'),(SELECT id FROM public.countries WHERE code='SV'),4,'Rejas de seguridad para mis ventanas. Trabajo fino, limpio y bien terminado.','2024-07-01 16:00:00+00'),
  -- pro18
  ('d0000000-0000-0000-0000-000000000018','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000052',(SELECT id FROM public.categories WHERE slug='estructura-metalica'),(SELECT id FROM public.countries WHERE code='SV'),5,'Construyó una pérgola preciosa en mi terraza. Muy sólida y con excelente acabado.','2024-05-25 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000018','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000053',(SELECT id FROM public.categories WHERE slug='estructura-metalica'),(SELECT id FROM public.countries WHERE code='SV'),4,'Rejas y canceles en toda mi casa. Trabajo preciso y de buena calidad estructural.','2024-06-15 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000018','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000054',(SELECT id FROM public.categories WHERE slug='estructura-metalica'),(SELECT id FROM public.countries WHERE code='SV'),4,'Muy profesional con la soldadura. Mi cochera quedó con techo metálico excelente.','2024-07-05 16:00:00+00'),
  -- pro19 Pisos
  ('d0000000-0000-0000-0000-000000000019','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000055',(SELECT id FROM public.categories WHERE slug='pisos'),(SELECT id FROM public.countries WHERE code='SV'),5,'Instaló porcelanato en toda la planta baja de mi casa. Acabado perfecto, sin una fisura.','2024-06-01 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000019','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000056',(SELECT id FROM public.categories WHERE slug='pisos'),(SELECT id FROM public.countries WHERE code='SV'),5,'Colocó piso vínico en mi oficina en un día. Quedó muy moderno y muy profesional.','2024-06-20 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000019','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000057',(SELECT id FROM public.categories WHERE slug='pisos'),(SELECT id FROM public.countries WHERE code='SV'),4,'Levantó el piso viejo y puso cerámica nueva en cocina y baños. Excelente resultado.','2024-07-10 16:00:00+00'),
  -- pro20
  ('d0000000-0000-0000-0000-000000000020','d0000000-0000-0000-0001-000000000001','d0000000-0000-0000-0002-000000000058',(SELECT id FROM public.categories WHERE slug='pisos'),(SELECT id FROM public.countries WHERE code='SV'),5,'Instaló cerámica en mis 3 habitaciones. Trabajo rápido, limpio y de mucha calidad.','2024-06-05 14:00:00+00'),
  ('d0000000-0000-0000-0000-000000000020','d0000000-0000-0000-0001-000000000002','d0000000-0000-0000-0002-000000000059',(SELECT id FROM public.categories WHERE slug='pisos'),(SELECT id FROM public.countries WHERE code='SV'),4,'Muy bien medido y cortado, sin desperdicios. El porcelanato quedó perfecto.','2024-06-25 15:00:00+00'),
  ('d0000000-0000-0000-0000-000000000020','d0000000-0000-0000-0001-000000000003','d0000000-0000-0000-0002-000000000060',(SELECT id FROM public.categories WHERE slug='pisos'),(SELECT id FROM public.countries WHERE code='SV'),4,'Buena experiencia, precio justo y resultado hermoso en el piso de mi local.','2024-07-15 16:00:00+00');
