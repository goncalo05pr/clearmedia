-- Création de toutes les tables manquantes pour le système de formations (CORRIGÉ)

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

-- 5. Table profiles (CORRIGÉE)
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  birthdate DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Table reviews
DROP TABLE IF EXISTS public.reviews CASCADE;
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id UUID REFERENCES public.formations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, formation_id)
);

-- 7. Table cms_content
DROP TABLE IF EXISTS public.cms_content CASCADE;
CREATE TABLE public.cms_content (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);

CREATE INDEX IF NOT EXISTS reviews_formation_id_idx ON public.reviews(formation_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON public.reviews(rating);

-- Activer RLS (Row Level Security) sur toutes les tables
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formation_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formation_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour formations
CREATE POLICY "formations_select_policy" ON public.formations
  FOR SELECT USING (is_active = true);

CREATE POLICY "formations_admin_policy" ON public.formations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
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
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
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
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Politiques RLS pour purchases
CREATE POLICY "purchases_user_policy" ON public.user_purchases
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "purchases_admin_policy" ON public.user_purchases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Politiques RLS pour profiles
CREATE POLICY "profiles_user_policy" ON public.profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "profiles_admin_policy" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Politiques RLS pour reviews
CREATE POLICY "reviews_select_policy" ON public.reviews
  FOR SELECT USING (is_public = true);

CREATE POLICY "reviews_user_policy" ON public.reviews
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "reviews_admin_policy" ON public.reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Politiques RLS pour cms_content
CREATE POLICY "cms_content_select_policy" ON public.cms_content
  FOR SELECT USING (true);

CREATE POLICY "cms_content_update_policy" ON public.cms_content
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "cms_content_insert_policy" ON public.cms_content
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
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

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_cms_content_updated_at
  BEFORE UPDATE ON public.cms_content
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

-- Insérer le contenu CMS par défaut
INSERT INTO public.cms_content (id, content) VALUES (
  'homepage',
  '{
    "id": "homepage",
    "heroTitle": "Votre trafic devient revenu automatique",
    "heroSubtitle": "KLIQZ transforme vos visiteurs en clients payants",
    "heroDescription": "Stratégies data-driven • Media buying expert • ROI garanti",
    "stats": {
      "satisfactionRate": 98,
      "averageRoi": 320,
      "support": "24/7"
    },
    "services": {
      "seo": {
        "title": "SEO Optimisation",
        "description": "Positionnement premium sur Google avec des stratégies techniques avancées",
        "features": ["SEO technique", "Content marketing", "Link building", "Local SEO"]
      },
      "ads": {
        "title": "Paid Ads",
        "description": "Campagnes performantes sur Meta, TikTok, LinkedIn avec optimisation continue",
        "features": ["Meta Ads", "TikTok Ads", "Google Ads", "Retargeting"]
      },
      "socialMedia": {
        "title": "Social Media",
        "description": "Gestion complète des réseaux sociaux avec création de contenu engageant",
        "features": ["Stratégie contenu", "Community management", "Influence marketing", "Social ads"]
      },
      "content": {
        "title": "Content Creation",
        "description": "Contenu percutant qui convertit vos visiteurs en clients",
        "features": ["Copywriting", "Video creation", "Blog posts", "Email marketing"]
      },
      "analytics": {
        "title": "Analytics",
        "description": "Suivi performance en temps réel et optimisation basée sur les données",
        "features": ["Dashboard custom", "A/B testing", "Conversion tracking", "ROI analysis"]
      },
      "branding": {
        "title": "Branding",
        "description": "Identité visuelle forte qui vous démarque de la concurrence",
        "features": ["Logo design", "Brand strategy", "Visual identity", "Brand guidelines"]
      }
    },
    "testimonials": [
      {
        "id": "1",
        "name": "Sarah L.",
        "company": "E-commerce B2B",
        "role": "CEO & Founder",
        "content": "KLIQZ a complètement transformé notre acquisition client. En 6 mois, nous avons multiplié notre ROI par 3.2.",
        "result": "+320% ROI",
        "metrics": {"roi": "+320%", "revenue": "+320%", "scale": "x3.2"},
        "avatar": "👩‍💼"
      },
      {
        "id": "2",
        "name": "Marc D.",
        "company": "SaaS Scale-up",
        "role": "Head of Growth",
        "content": "Leur expertise en media buying nous a permis de passer de 50k€ à 500k€ de revenus mensuels en moins d''un an.",
        "result": "+900% Croissance",
        "metrics": {"roi": "+850%", "revenue": "+900%", "scale": "x10"},
        "avatar": "👨‍💻"
      }
    ],
    "lastUpdated": "2024-03-29T15:40:00.000Z"
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW();

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
FROM public.user_purchases
UNION ALL
SELECT 
  'profiles' as table_name, COUNT(*) as row_count 
FROM public.profiles
UNION ALL
SELECT 
  'reviews' as table_name, COUNT(*) as row_count 
FROM public.reviews
UNION ALL
SELECT 
  'cms_content' as table_name, COUNT(*) as row_count 
FROM public.cms_content;
