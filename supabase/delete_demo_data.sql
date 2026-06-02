-- ===========================================================
-- K1BO — Eliminar todos los datos de demostración
-- Ejecutar en Supabase SQL Editor antes de re-ejecutar demo_data.sql
-- Respeta el orden de foreign keys (de hija a padre)
-- ===========================================================

-- 1. Reseñas (referencia quote_requests, professionals, profiles, categories)
DELETE FROM public.reviews
WHERE client_id IN (
  SELECT id FROM public.profiles WHERE role IN ('client','professional')
  AND id::text LIKE 'd0000000-0000-0000-000%'
);

-- 2. Solicitudes de cotización
DELETE FROM public.quote_requests
WHERE id::text LIKE 'd0000000-0000-0000-0002-%';

-- 3. Servicios / tags de profesionales
DELETE FROM public.professional_services
WHERE professional_id::text LIKE 'd0000000-0000-0000-0000-%';

-- 4. Cobertura geográfica
DELETE FROM public.professional_coverage
WHERE professional_id::text LIKE 'd0000000-0000-0000-0000-%';

-- 5. Categorías de profesionales
DELETE FROM public.professional_categories
WHERE professional_id::text LIKE 'd0000000-0000-0000-0000-%';

-- 6. Profesionales
DELETE FROM public.professionals
WHERE id::text LIKE 'd0000000-0000-0000-0000-%';

-- 7. Perfiles (profesionales y clientes)
DELETE FROM public.profiles
WHERE id::text LIKE 'd0000000-0000-0000-%';

-- 8. Identidades en auth
DELETE FROM auth.identities
WHERE user_id::text LIKE 'd0000000-0000-0000-%';

-- 9. Usuarios en auth (esto hace cascade en profiles si quedan registros)
DELETE FROM auth.users
WHERE email LIKE '%@k1bo-demo.com';
