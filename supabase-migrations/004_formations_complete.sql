-- Création de toutes les tables manquantes pour le système de formations

-- 1. Table formations
DROP TABLE IF EXISTS public.formations CASCADE;
CREATE TABLE public.formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0.00,
  image_url TEXT,
  level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
  duration INTEGER DEFAULT 0, -- en heures
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table chapters
DROP TABLE IF EXISTS public.formation_chapters CASCADE;
CREATE TABLE public.formation_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id UUID REFERENCES public.formations(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table modules
DROP TABLE IF EXISTS public.formation_modules CASCADE;
CREATE TABLE public.formation_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES public.formation_chapters(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- video, pdf, link, text
  content_url TEXT,
  content_data JSONB, -- pour stocker le contenu textuel ou autres données
  "order" INTEGER NOT NULL,
  is_free BOOLEAN DEFAULT false, -- module gratuit ou payant
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table purchases (user_purchases)
DROP TABLE IF EXISTS public.user_purchases CASCADE;
CREATE TABLE public.user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  formation_id UUID REFERENCES public.formations(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_intent_id TEXT, -- ID de paiement Stripe
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, formation_id)
);

-- Créer des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS formations_title_idx ON public.formations(title);
CREATE INDEX IF NOT EXISTS formations_level_idx ON public.formations(level);
CREATE INDEX IF NOT EXISTS formations_active_idx ON public.formations(is_active);

CREATE INDEX IF NOT EXISTS chapters_formation_id_idx ON public.formation_chapters(formation_id);
CREATE INDEX IF NOT EXISTS chapters_order_idx ON public.formation_chapters("order");

CREATE INDEX IF NOT EXISTS modules_chapter_id_idx ON public.formation_modules(chapter_id);
CREATE INDEX IF NOT EXISTS modules_type_idx ON public.formation_modules(type);
CREATE INDEX IF NOT EXISTS modules_order_idx ON public.formation_modules("order");

CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON public.user_purchases(user_id);
CREATE INDEX IF NOT EXISTS purchases_formation_id_idx ON public.user_purchases(formation_id);
CREATE INDEX IF NOT EXISTS purchases_status_idx ON public.user_purchases(status);

-- Activer RLS (Row Level Security) sur toutes les tables
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formation_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formation_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour formations
CREATE POLICY "formations_select_policy" ON public.formations
  FOR SELECT USING (is_active = true);

CREATE POLICY "formations_admin_policy" ON public.formations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Politiques RLS pour chapters
CREATE POLICY "chapters_select_policy" ON public.formation_chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.formations f
      WHERE f.id = formation_chapters.formation_id 
      AND f.is_active = true
    )
  );

CREATE POLICY "chapters_admin_policy" ON public.formation_chapters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Politiques RLS pour modules
CREATE POLICY "modules_select_policy" ON public.formation_modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.formation_chapters fc
      JOIN public.formations f ON f.id = fc.formation_id
      WHERE fc.id = formation_modules.chapter_id 
      AND f.is_active = true
    )
  );

CREATE POLICY "modules_admin_policy" ON public.formation_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Politiques RLS pour purchases
CREATE POLICY "purchases_user_policy" ON public.user_purchases
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "purchases_admin_policy" ON public.user_purchases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Trigger pour mettre à jour updated automatiquement
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer les triggers updated_at
CREATE TRIGGER handle_formations_updated_at
  BEFORE UPDATE ON public.formations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_chapters_updated_at
  BEFORE UPDATE ON public.formation_chapters
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_modules_updated_at
  BEFORE UPDATE ON public.formation_modules
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_purchases_updated_at
  BEFORE UPDATE ON public.user_purchases
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insérer quelques formations de démonstration
INSERT INTO public.formations (title, description, price, image_url, level, duration) VALUES
('Social Ads Mastery', 'Maîtrisez la publicité sur les réseaux sociaux', 297.00, 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800', 'intermediate', 12),
('Funnel Premium', 'Créez des tunnels de vente qui convertissent', 497.00, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'advanced', 16),
('SEO Expert', 'Devenez un expert en référencement naturel', 397.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'intermediate', 14);

-- Insérer quelques chapitres de démonstration
INSERT INTO public.formation_chapters (formation_id, title, "order") 
SELECT 
  f.id, 
  'Chapitre 1: Introduction', 
  1 
FROM public.formations f 
WHERE f.title = 'Social Ads Mastery'
UNION ALL
SELECT 
  f.id, 
  'Chapitre 2: Les bases', 
  2 
FROM public.formations f 
WHERE f.title = 'Social Ads Mastery'
UNION ALL
SELECT 
  f.id, 
  'Chapitre 1: Démarrage', 
  1 
FROM public.formations f 
WHERE f.title = 'Funnel Premium';

-- Insérer quelques modules de démonstration
INSERT INTO public.formation_modules (chapter_id, title, type, content_url, "order", is_free)
SELECT 
  fc.id, 
  'Introduction au cours', 
  'video', 
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
  1, 
  true
FROM public.formation_chapters fc 
JOIN public.formations f ON f.id = fc.formation_id 
WHERE f.title = 'Social Ads Mastery' AND fc.title = 'Chapitre 1: Introduction'
UNION ALL
SELECT 
  fc.id, 
  'Premiers pas', 
  'text', 
  '{"content": "Bienvenue dans ce module..."}', 
  2, 
  false
FROM public.formation_chapters fc 
JOIN public.formations f ON f.id = fc.formation_id 
WHERE f.title = 'Social Ads Mastery' AND fc.title = 'Chapitre 1: Introduction';

-- Afficher un résumé des tables créées
SELECT 
  'formations' as table_name, COUNT(*) as row_count 
FROM public.formations
UNION ALL
SELECT 
  'formation_chapters' as table_name, COUNT(*) as row_count 
FROM public.formation_chapters
UNION ALL
SELECT 
  'formation_modules' as table_name, COUNT(*) as row_count 
FROM public.formation_modules
UNION ALL
SELECT 
  'user_purchases' as table_name, COUNT(*) as row_count 
FROM public.user_purchases;
