-- Add missing columns to profiles table to match application expectations
-- This prevents security issues from incomplete table structure

-- Add all missing profile columns with proper data types
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS interests text[],
ADD COLUMN IF NOT EXISTS photos text[],
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS height integer,
ADD COLUMN IF NOT EXISTS occupation text,
ADD COLUMN IF NOT EXISTS education text,
ADD COLUMN IF NOT EXISTS looking_for text,
ADD COLUMN IF NOT EXISTS distance_preference integer,
ADD COLUMN IF NOT EXISTS age_preference_min integer,
ADD COLUMN IF NOT EXISTS age_preference_max integer,
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS echo_badge_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS unlocked_beyond_badge_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS tiktok_embed_url text,
ADD COLUMN IF NOT EXISTS vibe_gallery jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS emotional_soundtrack text,
ADD COLUMN IF NOT EXISTS open_to_connection_invites boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS echo_visibility_level text DEFAULT 'private';

-- Remove ALL existing policies to ensure clean slate
DROP POLICY IF EXISTS "Insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "READ OWN PROFILE" ON public.profiles;
DROP POLICY IF EXISTS "Read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Update own profile" ON public.profiles;
DROP POLICY IF EXISTS "read own profile" ON public.profiles;
DROP POLICY IF EXISTS "read own profile " ON public.profiles;
DROP POLICY IF EXISTS "Users can only view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can only insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can only update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "No profile deletion allowed" ON public.profiles;

-- Create secure, comprehensive RLS policies with unique names
CREATE POLICY "secure_profile_select"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "secure_profile_insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "secure_profile_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Completely prevent profile deletion for data integrity
CREATE POLICY "secure_profile_no_delete"
  ON public.profiles FOR DELETE
  USING (false);

-- Ensure the trigger function exists and create trigger
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();