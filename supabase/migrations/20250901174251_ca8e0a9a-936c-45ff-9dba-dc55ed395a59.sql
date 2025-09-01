-- Add photo storage and swiping capabilities to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS occupation text,
ADD COLUMN IF NOT EXISTS interests text[],
ADD COLUMN IF NOT EXISTS photos text[],
ADD COLUMN IF NOT EXISTS is_profile_complete boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS distance_preference integer DEFAULT 25,
ADD COLUMN IF NOT EXISTS age_min integer DEFAULT 18,
ADD COLUMN IF NOT EXISTS age_max integer DEFAULT 99,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS looking_for text,
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for profile photos
CREATE POLICY "Users can upload their own photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view all profile photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can update their own photos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own photos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create swipe interactions table
CREATE TABLE IF NOT EXISTS public.swipe_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  swiped_user_id uuid NOT NULL,
  swipe_direction text NOT NULL CHECK (swipe_direction IN ('left', 'right', 'super')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, swiped_user_id)
);

-- Enable RLS on swipe interactions
ALTER TABLE public.swipe_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for swipe interactions
CREATE POLICY "Users can create their own swipes" 
ON public.swipe_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own swipes" 
ON public.swipe_interactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create function to handle matches when both users swipe right
CREATE OR REPLACE FUNCTION public.handle_mutual_swipe()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is a right swipe
  IF NEW.swipe_direction = 'right' OR NEW.swipe_direction = 'super' THEN
    -- Check if the other user also swiped right on this user
    IF EXISTS (
      SELECT 1 FROM public.swipe_interactions 
      WHERE user_id = NEW.swiped_user_id 
      AND swiped_user_id = NEW.user_id 
      AND swipe_direction IN ('right', 'super')
    ) THEN
      -- Create a match if one doesn't already exist
      INSERT INTO public.matches (user1_id, user2_id, score)
      VALUES (
        LEAST(NEW.user_id, NEW.swiped_user_id),
        GREATEST(NEW.user_id, NEW.swiped_user_id),
        0.95
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic match creation
DROP TRIGGER IF EXISTS on_swipe_interaction ON public.swipe_interactions;
CREATE TRIGGER on_swipe_interaction
  AFTER INSERT ON public.swipe_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_mutual_swipe();

-- Update profiles timestamp trigger
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profiles_updated_at();