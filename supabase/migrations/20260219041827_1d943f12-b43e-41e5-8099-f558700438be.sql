
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function: is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

-- site_content table (single row for global content)
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value_pt TEXT NOT NULL DEFAULT '',
  value_en TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_pt TEXT NOT NULL,
  title_en TEXT NOT NULL DEFAULT '',
  description_pt TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  link TEXT,
  year TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_pt TEXT NOT NULL,
  name_en TEXT NOT NULL DEFAULT '',
  institution_pt TEXT NOT NULL DEFAULT '',
  institution_en TEXT NOT NULL DEFAULT '',
  year TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- recommendations table
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_name TEXT NOT NULL,
  role_pt TEXT NOT NULL DEFAULT '',
  role_en TEXT NOT NULL DEFAULT '',
  text_pt TEXT NOT NULL DEFAULT '',
  text_en TEXT NOT NULL DEFAULT '',
  screenshot_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- social_links table
CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'link',
  sort_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin());

-- RLS Policies for site_content
CREATE POLICY "Anyone can read content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage content" ON public.site_content FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- RLS Policies for projects
CREATE POLICY "Anyone can read projects" ON public.projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- RLS Policies for certificates
CREATE POLICY "Anyone can read certificates" ON public.certificates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage certificates" ON public.certificates FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- RLS Policies for recommendations
CREATE POLICY "Anyone can read recommendations" ON public.recommendations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage recommendations" ON public.recommendations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- RLS Policies for social_links
CREATE POLICY "Anyone can read social links" ON public.social_links FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage social links" ON public.social_links FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Storage policies
CREATE POLICY "Public can view media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'media');
CREATE POLICY "Admins can upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins can delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin());

-- Seed initial content
INSERT INTO public.site_content (key, value_pt, value_en) VALUES
('bio', 'Estudante de Turismo na UEMS, apaixonado por unir turismo e tecnologia.', 'Tourism student at UEMS, passionate about merging tourism and technology.'),
('about', 'Criador do Guatá, a capivara mascote de turismo do MS, e idealizador do projeto Descubra Mato Grosso do Sul.', 'Creator of Guatá, the capybara tourism mascot of MS, and founder of the Descubra Mato Grosso do Sul project.'),
('tagline', 'Turismo & Tecnologia', 'Tourism & Technology');

-- Seed social links
INSERT INTO public.social_links (platform, url, icon, sort_order) VALUES
('Instagram', 'https://instagram.com/', 'instagram', 1),
('LinkedIn', 'https://linkedin.com/in/', 'linkedin', 2),
('WhatsApp', 'https://wa.me/', 'message-circle', 3),
('DescubraMS', 'https://descubrams.com', 'external-link', 4),
('Lattes', '#', 'graduation-cap', 5);

-- Seed sample project
INSERT INTO public.projects (title_pt, title_en, description_pt, description_en, link, year, sort_order) VALUES
('Descubra Mato Grosso do Sul', 'Discover Mato Grosso do Sul', 'Plataforma digital para promover destinos turísticos do MS.', 'Digital platform promoting tourism destinations in MS.', 'https://descubrams.com', '2024', 1),
('Guatá — Mascote do Turismo', 'Guatá — Tourism Mascot', 'Personagem capivara criado para representar o turismo sul-mato-grossense.', 'Capybara character created to represent tourism in Mato Grosso do Sul.', '#', '2024', 2);
