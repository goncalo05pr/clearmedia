-- Table pour les profils utilisateurs étendus (simplifiée)
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

-- Créer des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);

-- Activer RLS (Row Level Security) - simplifié
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique RLS simplifiée : permettre aux utilisateurs de voir et modifier leur propre profil
CREATE POLICY "profiles_user_policy" ON public.profiles
  FOR ALL USING (auth.uid() = user_id);

-- Trigger simple pour mettre à jour updated_at
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
