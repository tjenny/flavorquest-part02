-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT UNIQUE,
  display_name TEXT,
  dietary_prefs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles (owner-only access)
CREATE POLICY "profiles_owner_select" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_owner_insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_owner_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for automatic timestamp updates on profiles
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create posts table for social feed with owner-only access
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  photo_url TEXT,
  caption TEXT,
  challenge_id TEXT NOT NULL,
  challenge_title TEXT NOT NULL,
  challenge_type TEXT,
  path_id TEXT,
  country_id TEXT,
  place_name TEXT,
  place_provider TEXT,
  place_id TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION
);

-- Enable RLS on posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for posts (owner-only access)
CREATE POLICY "posts_owner_select" ON public.posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "posts_owner_insert" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "posts_owner_update" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "posts_owner_delete" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_country ON public.posts(country_id);
CREATE INDEX IF NOT EXISTS idx_posts_path ON public.posts(path_id);

-- Create completions table for challenge completions with owner-only access
CREATE TABLE IF NOT EXISTS public.completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  display_title TEXT NOT NULL,
  display_type TEXT,
  photo_url TEXT,
  caption TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  used_ai_hint BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  place_name TEXT,
  place_provider TEXT,
  place_id TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION
);

-- Enable RLS on completions
ALTER TABLE public.completions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for completions (owner-only access)
CREATE POLICY "completions_owner_select" ON public.completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "completions_owner_insert" ON public.completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "completions_owner_update" ON public.completions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "completions_owner_delete" ON public.completions
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_completions_user ON public.completions(user_id);