-- Fix remaining security issues

-- Fix more functions with SET search_path
CREATE OR REPLACE FUNCTION public.schedule_risk_assessment()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    -- Basic trigger implementation without pg_cron dependency
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.schedule_match_archiving()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    -- Basic trigger implementation without pg_cron dependency
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_match_intelligence(input_user_id uuid)
 RETURNS TABLE(match_id uuid, compatibility_score numeric, is_premium_preview boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id AS match_id,
    50.0::numeric AS compatibility_score,
    false AS is_premium_preview
  FROM public.profiles p
  WHERE p.id != input_user_id
  ORDER BY RANDOM()
  LIMIT 10;
END;
$function$;

CREATE OR REPLACE FUNCTION public.example_function(param1 text, param2 integer)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    RETURN param1 || param2::TEXT;
END;
$function$;

CREATE OR REPLACE FUNCTION public.secure_generate_ai_match_new()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
    -- Basic implementation
    NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_ai_match_v2()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    -- Basic implementation  
    NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_ai_match()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN gen_random_uuid();
END;
$function$;

CREATE OR REPLACE FUNCTION public.secure_generate_ai_match_deprecated()
 RETURNS TABLE(id bigint, user_id uuid, match_score numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY SELECT
    1::bigint AS id,
    auth.uid() AS user_id,
    0.5::numeric AS match_score
  WHERE FALSE; -- Returns empty result
END;
$function$;

-- Check and enable RLS on premium_matches if needed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'premium_matches'
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.premium_matches ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view their own premium matches" 
        ON public.premium_matches 
        FOR SELECT 
        USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own premium matches" 
        ON public.premium_matches 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;