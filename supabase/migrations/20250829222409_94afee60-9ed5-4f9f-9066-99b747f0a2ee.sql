-- Fix critical security settings for app store readiness
-- Add security definer and search_path to important functions

-- Update the user profile update trigger function
ALTER FUNCTION public.update_updated_at_column() SECURITY DEFINER SET search_path = public;

-- Update the new user handler function if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
        ALTER FUNCTION public.handle_new_user() SECURITY DEFINER SET search_path = public;
    END IF;
END $$;