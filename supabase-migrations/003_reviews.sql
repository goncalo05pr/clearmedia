-- Table pour les avis/évaluations des formations
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id UUID REFERENCES public.formations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, formation_id) -- Un avis par utilisateur par formation
);

-- Créer des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS reviews_formation_id_idx ON public.reviews(formation_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS_reviews_rating_idx ON public.reviews(rating);

-- Activer RLS (Row Level Security)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour permettre aux utilisateurs de voir les avis publics
CREATE POLICY "reviews_select_policy" ON public.reviews
  FOR SELECT USING (is_public = true);

-- Politique RLS pour permettre aux utilisateurs de créer/modifier leurs propres avis
CREATE POLICY "reviews_user_policy" ON public.reviews
  FOR ALL USING (auth.uid() = user_id);

-- Politique RLS pour permettre aux admins de voir tous les avis
CREATE POLICY "reviews_admin_policy" ON public.reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.handle_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_reviews_updated_at();
