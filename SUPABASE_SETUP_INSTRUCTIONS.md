# ============================================
# SQL À EXÉCUTER DANS SUPABASE SQL EDITOR
# ============================================

# 1. Exécuter d'abord ce SQL pour créer la table cms_content:

-- Table pour le contenu CMS de la page d'accueil
CREATE TABLE IF NOT EXISTS public.cms_content (
  id TEXT PRIMARY KEY DEFAULT 'homepage',
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer le contenu par défaut pour la page d'accueil
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
        "metrics": { "roi": "+320%", "revenue": "+320%", "scale": "x3.2" },
        "avatar": "👩‍💼"
      },
      {
        "id": "2",
        "name": "Marc D.",
        "company": "SaaS Scale-up",
        "role": "Head of Growth",
        "content": "Leur expertise en media buying nous a permis de passer de 50k€ à 500k€ de revenus mensuels en moins d''un an.",
        "result": "+900% Croissance",
        "metrics": { "roi": "+850%", "revenue": "+900%", "scale": "x10" },
        "avatar": "👨‍💻"
      }
    ],
    "lastUpdated": "' || NOW() || '"
  }'
) ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW();

-- Activer RLS (Row Level Security)
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour permettre la lecture à tous
CREATE POLICY "cms_content_select_policy" ON public.cms_content
  FOR SELECT USING (true);

-- Politique RLS pour permettre les mises à jour aux admins
CREATE POLICY "cms_content_update_policy" ON public.cms_content
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Politique RLS pour permettre les insertions aux admins
CREATE POLICY "cms_content_insert_policy" ON public.cms_content
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Créer un index pour optimiser les performances
CREATE INDEX IF NOT EXISTS cms_content_id_idx ON public.cms_content(id);

# 2. Ensuite, exécuter ce SQL pour créer la table profiles:

-- Table pour les profils utilisateurs étendus
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- Créer un profil automatiquement lorsqu'un utilisateur s'inscrit
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Activer RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Politique RLS pour permettre aux utilisateurs de mettre à jour leur propre profil
CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Politique RLS pour permettre aux utilisateurs d'insérer leur propre profil
CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique RLS pour permettre aux admins de voir tous les profils
CREATE POLICY "profiles_admin_select_policy" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Créer des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);

-- Mettre à jour automatiquement le champ updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE OR REPLACE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

# ============================================
# INSTRUCTIONS:
# ============================================
# 1. Allez dans votre projet Supabase
# 2. Cliquez sur "SQL Editor" dans le menu de gauche
# 3. Copiez-collez le premier bloc SQL (cms_content) et exécutez-le
# 4. Copiez-collez le deuxième bloc SQL (profiles) et exécutez-le
# 5. Vérifiez que les deux tables sont bien créées dans "Table Editor"
#
# Après avoir exécuté ces SQL, le CMS et le profil fonctionneront correctement!
