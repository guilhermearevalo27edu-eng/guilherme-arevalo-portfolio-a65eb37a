
-- Create project_media table
CREATE TABLE public.project_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title_pt TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  description_pt TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  media_url TEXT,
  external_url TEXT,
  media_type TEXT NOT NULL DEFAULT 'online',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can read project media"
ON public.project_media
FOR SELECT
USING (true);

-- Admin manage
CREATE POLICY "Admins can manage project media"
ON public.project_media
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
