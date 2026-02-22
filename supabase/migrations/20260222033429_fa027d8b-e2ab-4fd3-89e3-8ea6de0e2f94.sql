
-- Adicionar coluna image_url na tabela certificates
ALTER TABLE public.certificates ADD COLUMN image_url TEXT;

-- Inserir novas chaves no site_content
INSERT INTO public.site_content (key, value_pt, value_en) VALUES
  ('hero_photo', '', ''),
  ('contact_email', 'contato@guilhermearevalo.com', 'contato@guilhermearevalo.com'),
  ('contact_text_pt', 'Obrigado por visitar meu portfólio! Se você quer saber mais sobre meu trabalho ou tem uma proposta, entre em contato.', 'Thanks for visiting my portfolio! If you want to know more about my work or have a proposal, get in touch.'),
  ('footer_name', 'Guilherme Arevalo', 'Guilherme Arevalo')
ON CONFLICT (key) DO NOTHING;
