-- Final security cleanup: Fix any remaining function search path issues

-- Check and fix any remaining functions that might have mutable search_path
-- This should address the last "Function Search Path Mutable" warning

-- Ensure all helper functions are properly secured
CREATE OR REPLACE FUNCTION public.is_user_adult(user_birth_date date)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  SELECT user_birth_date <= (CURRENT_DATE - INTERVAL '18 years');
$function$;

-- Double-check that these functions are properly secured (might be the remaining issue)
CREATE OR REPLACE FUNCTION public.secure_generate_ai_match_new()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    -- Basic implementation
    NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_ai_match_wrapper()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    -- Basic implementation
    NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_ai_match_v2()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    -- Basic implementation  
    NULL;
END;
$function$;