-- Core Security Fixes for Active Tables
-- Fix critical missing RLS policies for user data tables

-- 1. Secure profiles table (core user data)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add missing profile policies
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile" 
ON public.profiles FOR DELETE 
USING (auth.uid() = id);

-- 2. Secure users table if it exists and is being used
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own data" ON public.users;
CREATE POLICY "Users can manage own data" 
ON public.users FOR ALL 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- 3. Secure quiz_results table
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own quiz results" ON public.quiz_results;
CREATE POLICY "Users can manage own quiz results" 
ON public.quiz_results FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 4. Secure questions table
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read questions" ON public.questions;
CREATE POLICY "Authenticated users can read questions" 
ON public.questions FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 5. Secure vibe_gallery_items table
ALTER TABLE public.vibe_gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own vibe items" ON public.vibe_gallery_items;
CREATE POLICY "Users can manage own vibe items" 
ON public.vibe_gallery_items FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 6. Secure premium_profiles table
ALTER TABLE public.premium_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own premium profile" ON public.premium_profiles;
CREATE POLICY "Users can manage own premium profile" 
ON public.premium_profiles FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 7. Secure premium_user_profiles table
ALTER TABLE public.premium_user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own premium user profile" ON public.premium_user_profiles;
CREATE POLICY "Users can manage own premium user profile" 
ON public.premium_user_profiles FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 8. Fix subscribers table RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own subscription" ON public.subscribers;
CREATE POLICY "Users can manage own subscription" 
ON public.subscribers FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 9. Secure safety_settings table
ALTER TABLE public.safety_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own safety settings" ON public.safety_settings;
CREATE POLICY "Users can manage own safety settings" 
ON public.safety_settings FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 10. Secure swipe_interactions table
ALTER TABLE public.swipe_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own swipe interactions" ON public.swipe_interactions;
CREATE POLICY "Users can manage own swipe interactions" 
ON public.swipe_interactions FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 11. Secure user_blocks table
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage blocks they created" ON public.user_blocks;
CREATE POLICY "Users can manage blocks they created" 
ON public.user_blocks FOR ALL 
USING (auth.uid() = blocker_id) 
WITH CHECK (auth.uid() = blocker_id);

-- 12. Secure user_reports table
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create reports" ON public.user_reports;
CREATE POLICY "Users can create reports" 
ON public.user_reports FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can view reports they created" ON public.user_reports;
CREATE POLICY "Users can view reports they created" 
ON public.user_reports FOR SELECT 
USING (auth.uid() = reporter_id);

-- Log security fixes applied
INSERT INTO public.security_events (user_id, event_type, event_data)
VALUES (
  auth.uid(),
  'security_migration_applied',
  jsonb_build_object(
    'migration_type', 'rls_policies_core_tables',
    'tables_secured', ARRAY[
      'profiles', 'users', 'quiz_results', 'questions', 
      'vibe_gallery_items', 'premium_profiles', 'premium_user_profiles',
      'subscribers', 'safety_settings', 'swipe_interactions', 
      'user_blocks', 'user_reports'
    ]
  )
);