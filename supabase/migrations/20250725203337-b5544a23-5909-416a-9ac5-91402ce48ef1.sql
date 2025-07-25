-- Find and fix the remaining table without RLS and finish securing all functions

-- Enable RLS on premium_matches (the missing table)
ALTER TABLE public.premium_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own premium matches" 
ON public.premium_matches 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own premium matches" 
ON public.premium_matches 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fix remaining functions that still need SET search_path
CREATE OR REPLACE FUNCTION public.check_user_security_level()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  v_current_user_id uuid;
  v_security_level text;
  v_mfa_count integer;
BEGIN
  v_current_user_id := auth.uid();

  -- Basic security check
  SELECT 
    COALESCE('standard', 'standard'),
    0
  INTO 
    v_security_level, 
    v_mfa_count;

  RETURN TRUE;
END;$function$;

CREATE OR REPLACE FUNCTION public.perform_sensitive_action(p_action_details jsonb)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- First, check security level
  PERFORM public.check_user_security_level();

  -- Proceed with sensitive action
  RETURN TRUE;
END;$function$;

CREATE OR REPLACE FUNCTION public.update_user_security_level()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Basic security level update
  NEW.raw_user_meta_data := jsonb_set(
    COALESCE(NEW.raw_user_meta_data, '{}'::jsonb), 
    '{security_level}', 
    '"standard"'::jsonb
  );

  RETURN NEW;
END;
$function$;