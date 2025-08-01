-- Add Unlocked Beyond badge toggle column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN unlocked_beyond_badge_enabled boolean DEFAULT false;