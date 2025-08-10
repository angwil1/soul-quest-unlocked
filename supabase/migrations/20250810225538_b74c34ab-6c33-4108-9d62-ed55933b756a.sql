-- Add zip_code column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS zip_code TEXT;