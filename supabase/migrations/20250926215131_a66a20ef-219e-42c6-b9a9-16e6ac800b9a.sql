-- Add missing profile fields to support profile completion and matching
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS photos TEXT[],
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS height INTEGER,
ADD COLUMN IF NOT EXISTS occupation TEXT,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS looking_for TEXT,
ADD COLUMN IF NOT EXISTS distance_preference INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS age_preference_min INTEGER,
ADD COLUMN IF NOT EXISTS age_preference_max INTEGER,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS echo_badge_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS unlocked_beyond_badge_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tiktok_embed_url TEXT,
ADD COLUMN IF NOT EXISTS vibe_gallery JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS emotional_soundtrack TEXT,
ADD COLUMN IF NOT EXISTS open_to_connection_invites BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS echo_visibility_level TEXT DEFAULT 'public';

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();