-- ============================================================
-- K1BO — Esquema inicial de base de datos
-- ============================================================

-- Countries
CREATE TABLE public.countries (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  code           text UNIQUE NOT NULL,
  url_prefix     text UNIQUE NOT NULL,
  currency_name  text NOT NULL,
  currency_code  text NOT NULL,
  currency_symbol text NOT NULL,
  flag_emoji     text,
  active         boolean DEFAULT false,
  created_at     timestamptz DEFAULT now()
);

-- Departments
CREATE TABLE public.departments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id uuid NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  name       text NOT NULL
);

-- Municipalities
CREATE TABLE public.municipalities (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  name          text NOT NULL
);

-- Districts
CREATE TABLE public.districts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  municipality_id uuid NOT NULL REFERENCES public.municipalities(id) ON DELETE CASCADE,
  name            text NOT NULL
);

-- Categories
CREATE TABLE public.categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  description text,
  parent_id   uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  icon        text,
  order_index integer DEFAULT 0,
  active      boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  country_id      uuid REFERENCES public.countries(id),
  role            text NOT NULL CHECK (role IN ('client', 'professional', 'admin')),
  full_name       text,
  photo_url       text,
  phone           text,
  date_of_birth   date,
  address         text,
  department_id   uuid REFERENCES public.departments(id),
  municipality_id uuid REFERENCES public.municipalities(id),
  district_id     uuid REFERENCES public.districts(id),
  verified        boolean DEFAULT false,
  active          boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

-- Professionals
CREATE TABLE public.professionals (
  id                    uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  bio                   text,
  short_description     text,
  working_hours         jsonb,
  whatsapp              text,
  facebook_url          text,
  instagram_url         text,
  tiktok_url            text,
  covers_entire_country boolean DEFAULT false,
  featured              boolean DEFAULT false,
  dui_front_url         text,
  dui_back_url          text,
  total_projects        integer DEFAULT 0
);

-- Professional categories (max 3 main + 2 sub per main)
CREATE TABLE public.professional_categories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  category_id     uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  projects_count  integer DEFAULT 0,
  UNIQUE(professional_id, category_id)
);

-- Professional coverage areas
CREATE TABLE public.professional_coverage (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  department_id   uuid NOT NULL REFERENCES public.departments(id),
  municipality_id uuid REFERENCES public.municipalities(id),
  district_id     uuid REFERENCES public.districts(id)
);

-- Professional service tags
CREATE TABLE public.professional_services (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  service_tag     text NOT NULL
);

-- Portfolio photos (max 25 per professional)
CREATE TABLE public.portfolio_photos (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  photo_url       text NOT NULL,
  caption         text,
  order_index     integer DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

-- Professional FAQ
CREATE TABLE public.professional_faq (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  question        text NOT NULL,
  answer          text NOT NULL,
  order_index     integer DEFAULT 0
);

-- Availability
CREATE TABLE public.availability (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  date            date NOT NULL,
  status          text NOT NULL CHECK (status IN ('available', 'busy', 'blocked')),
  UNIQUE(professional_id, date)
);

-- Quote requests
CREATE TABLE public.quote_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id      uuid NOT NULL REFERENCES public.countries(id),
  client_id       uuid NOT NULL REFERENCES public.profiles(id),
  professional_id uuid NOT NULL REFERENCES public.professionals(id),
  category_id     uuid NOT NULL REFERENCES public.categories(id),
  subcategory_id  uuid REFERENCES public.categories(id),
  description     text NOT NULL,
  required_date   date NOT NULL,
  status          text NOT NULL CHECK (status IN ('pending','responded','accepted','rejected')) DEFAULT 'pending',
  created_at      timestamptz DEFAULT now()
);

-- Quote request photos (max 10)
CREATE TABLE public.quote_request_photos (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id uuid NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  photo_url        text NOT NULL
);

-- Reviews
CREATE TABLE public.reviews (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id  uuid NOT NULL REFERENCES public.professionals(id),
  client_id        uuid NOT NULL REFERENCES public.profiles(id),
  quote_request_id uuid NOT NULL REFERENCES public.quote_requests(id),
  category_id      uuid NOT NULL REFERENCES public.categories(id),
  country_id       uuid REFERENCES public.countries(id),
  rating           integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment          text,
  created_at       timestamptz DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_profiles_country ON public.profiles(country_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_professionals_featured ON public.professionals(featured);
CREATE INDEX idx_professional_categories_professional ON public.professional_categories(professional_id);
CREATE INDEX idx_professional_categories_category ON public.professional_categories(category_id);
CREATE INDEX idx_professional_coverage_professional ON public.professional_coverage(professional_id);
CREATE INDEX idx_quote_requests_client ON public.quote_requests(client_id);
CREATE INDEX idx_quote_requests_professional ON public.quote_requests(professional_id);
CREATE INDEX idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX idx_reviews_professional ON public.reviews(professional_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_parent ON public.categories(parent_id);
CREATE INDEX idx_availability_professional_date ON public.availability(professional_id, date);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.countries              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.municipalities         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_coverage  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_services  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_photos       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_faq       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_request_photos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews                ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Countries: public read
CREATE POLICY "countries_public_read" ON public.countries FOR SELECT USING (true);

-- Departments, municipalities, districts: public read
CREATE POLICY "departments_public_read"    ON public.departments    FOR SELECT USING (true);
CREATE POLICY "municipalities_public_read" ON public.municipalities FOR SELECT USING (true);
CREATE POLICY "districts_public_read"      ON public.districts      FOR SELECT USING (true);

-- Categories: public read
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_write" ON public.categories FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Profiles
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_insert"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_own_update"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Professionals: public read, owner write
CREATE POLICY "professionals_public_read" ON public.professionals FOR SELECT USING (true);
CREATE POLICY "professionals_own_insert"  ON public.professionals FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "professionals_own_update"  ON public.professionals FOR UPDATE USING (auth.uid() = id);

-- Professional related tables: public read, owner write
CREATE POLICY "pro_categories_public_read" ON public.professional_categories FOR SELECT USING (true);
CREATE POLICY "pro_categories_own_write"   ON public.professional_categories FOR ALL
  USING (auth.uid() = professional_id);

CREATE POLICY "pro_coverage_public_read" ON public.professional_coverage FOR SELECT USING (true);
CREATE POLICY "pro_coverage_own_write"   ON public.professional_coverage FOR ALL
  USING (auth.uid() = professional_id);

CREATE POLICY "pro_services_public_read" ON public.professional_services FOR SELECT USING (true);
CREATE POLICY "pro_services_own_write"   ON public.professional_services FOR ALL
  USING (auth.uid() = professional_id);

CREATE POLICY "portfolio_public_read" ON public.portfolio_photos FOR SELECT USING (true);
CREATE POLICY "portfolio_own_write"   ON public.portfolio_photos FOR ALL
  USING (auth.uid() = professional_id);

CREATE POLICY "faq_public_read" ON public.professional_faq FOR SELECT USING (true);
CREATE POLICY "faq_own_write"   ON public.professional_faq FOR ALL
  USING (auth.uid() = professional_id);

CREATE POLICY "availability_public_read" ON public.availability FOR SELECT USING (true);
CREATE POLICY "availability_own_write"   ON public.availability FOR ALL
  USING (auth.uid() = professional_id);

-- Quote requests: visible only to client and professional
CREATE POLICY "quotes_client_or_pro" ON public.quote_requests FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = professional_id);
CREATE POLICY "quotes_client_insert" ON public.quote_requests FOR INSERT
  WITH CHECK (auth.uid() = client_id);
CREATE POLICY "quotes_pro_update_status" ON public.quote_requests FOR UPDATE
  USING (auth.uid() = professional_id);

-- Quote photos: same as quote requests
CREATE POLICY "quote_photos_access" ON public.quote_request_photos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.quote_requests q
    WHERE q.id = quote_request_id
    AND (q.client_id = auth.uid() OR q.professional_id = auth.uid())
  ));
CREATE POLICY "quote_photos_insert" ON public.quote_request_photos FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.quote_requests q
    WHERE q.id = quote_request_id AND q.client_id = auth.uid()
  ));

-- Reviews: public read, client of quote inserts
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_client_insert" ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM public.quote_requests q
      WHERE q.id = quote_request_id AND q.client_id = auth.uid()
    )
  );
CREATE POLICY "reviews_admin_delete" ON public.reviews FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
