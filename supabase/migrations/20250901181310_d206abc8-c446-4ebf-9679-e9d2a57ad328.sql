-- Clean up RLS policies for profiles table
-- Drop existing duplicate policies first (the ones that worked were already created)
DROP POLICY IF EXISTS "READ OWN PROFILE" ON public.profiles;
DROP POLICY IF EXISTS "Read own profile" ON public.profiles;
DROP POLICY IF EXISTS "read own profile" ON public.profiles;
DROP POLICY IF EXISTS "read own profile " ON public.profiles;

-- The new policies should now be in place and working
-- Let's also ensure profile-photos bucket exists properly
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', false)
ON CONFLICT (id) DO NOTHING;