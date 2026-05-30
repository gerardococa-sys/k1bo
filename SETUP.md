# K1BO — Guía de instalación

## 1. Instalar dependencias

```bash
npm install
```

## 2. Configurar variables de entorno

Copia el archivo de ejemplo y llena los valores:

```bash
cp .env.local.example .env.local
```

Necesitas:
- `NEXT_PUBLIC_SUPABASE_URL` — URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (solo para admin)

## 3. Configurar Supabase

### 3a. Crear el schema

En el SQL Editor de Supabase, ejecuta en orden:

1. `supabase/migrations/001_schema.sql`
2. `supabase/seed.sql`

### 3b. Crear los Storage Buckets

En Storage → New Bucket:

| Nombre | Público |
|--------|---------|
| `avatars` | ✅ Sí |
| `portfolio` | ✅ Sí |
| `quote-photos` | ❌ No |
| `documents` | ❌ No |

### 3c. Configurar Storage RLS

En `avatars`:
```sql
-- Lectura pública
CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- Upload por dueño
CREATE POLICY "avatars_owner_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
-- Update por dueño
CREATE POLICY "avatars_owner_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

En `portfolio`:
```sql
CREATE POLICY "portfolio_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "portfolio_owner_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "portfolio_owner_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
```

En `quote-photos`:
```sql
CREATE POLICY "quote_photos_owner" ON storage.objects
  USING (bucket_id = 'quote-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

En `documents` (solo service_role, no necesita policy pública).

## 4. Crear primer usuario Admin

Después de registrar un usuario con email, ve al SQL Editor y ejecuta:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'tu@email.com');
```

## 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 6. URLs principales

| Ruta | Descripción |
|------|-------------|
| `/` | Homepage global (selector de país) |
| `/sv` | Homepage El Salvador |
| `/sv/categoria/pintura` | Listado de pintores |
| `/sv/profesional/[id]` | Perfil de profesional |
| `/login` | Inicio de sesión |
| `/registro/cliente` | Registro de cliente |
| `/registro/profesional` | Registro de profesional (6 pasos) |
| `/sv/cliente/dashboard` | Panel del cliente |
| `/sv/profesional-panel/dashboard` | Panel del profesional |
| `/admin/dashboard` | Panel administrativo |

## 7. Deploy en Vercel

1. Conecta el repo a Vercel
2. Agrega las variables de entorno en el dashboard de Vercel
3. Deploy automático en cada push a `main`
