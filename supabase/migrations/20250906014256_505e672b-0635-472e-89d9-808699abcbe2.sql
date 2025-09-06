-- Core Security Fixes - Corrected for proper column types
-- Fix critical missing RLS policies for user data tables

-- 1. Secure profiles table (already has RLS, add delete policy)
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile" 
ON public.profiles FOR DELETE 
USING (auth.uid() = id);

-- 2. Secure quiz_results table (check if exists first)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quiz_results') THEN
        ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can manage own quiz results" ON public.quiz_results;
        CREATE POLICY "Users can manage own quiz results" 
        ON public.quiz_results FOR ALL 
        USING (auth.uid() = user_id) 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 3. Secure questions table (make publicly readable for authenticated users)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'questions') THEN
        ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Authenticated users can read questions" ON public.questions;
        CREATE POLICY "Authenticated users can read questions" 
        ON public.questions FOR SELECT 
        USING (auth.uid() IS NOT NULL);
    END IF;
END $$;

-- 4. Secure vibe_gallery_items table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vibe_gallery_items') THEN
        ALTER TABLE public.vibe_gallery_items ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can manage own vibe items" ON public.vibe_gallery_items;
        CREATE POLICY "Users can manage own vibe items" 
        ON public.vibe_gallery_items FOR ALL 
        USING (auth.uid() = user_id) 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 5. Secure premium_profiles table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'premium_profiles') THEN
        ALTER TABLE public.premium_profiles ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can manage own premium profile" ON public.premium_profiles;
        CREATE POLICY "Users can manage own premium profile" 
        ON public.premium_profiles FOR ALL 
        USING (auth.uid() = user_id) 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 6. Secure premium_user_profiles table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'premium_user_profiles') THEN
        ALTER TABLE public.premium_user_profiles ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can manage own premium user profile" ON public.premium_user_profiles;
        CREATE POLICY "Users can manage own premium user profile" 
        ON public.premium_user_profiles FOR ALL 
        USING (auth.uid() = user_id) 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 7. Secure swipe_interactions table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'swipe_interactions') THEN
        ALTER TABLE public.swipe_interactions ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can manage own swipe interactions" ON public.swipe_interactions;
        CREATE POLICY "Users can manage own swipe interactions" 
        ON public.swipe_interactions FOR ALL 
        USING (auth.uid() = user_id) 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 8. Secure user_blocks table 
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_blocks') THEN
        ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can manage blocks they created" ON public.user_blocks;
        CREATE POLICY "Users can manage blocks they created" 
        ON public.user_blocks FOR ALL 
        USING (auth.uid() = blocker_id) 
        WITH CHECK (auth.uid() = blocker_id);
    END IF;
END $$;

-- 9. Secure user_reports table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_reports') THEN
        ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can create reports" ON public.user_reports;
        CREATE POLICY "Users can create reports" 
        ON public.user_reports FOR INSERT 
        WITH CHECK (auth.uid() = reporter_id);
        
        DROP POLICY IF EXISTS "Users can view reports they created" ON public.user_reports;
        CREATE POLICY "Users can view reports they created" 
        ON public.user_reports FOR SELECT 
        USING (auth.uid() = reporter_id);
    END IF;
END $$;

-- Log security fixes applied
INSERT INTO public.security_events (user_id, event_type, event_data)
VALUES (
  auth.uid(),
  'security_migration_applied',
  jsonb_build_object(
    'migration_type', 'rls_policies_core_tables_fixed',
    'timestamp', now()
  )
);