-- Fix database function security by setting secure search_path for all functions
-- This addresses the "Function Search Path Mutable" security warnings

-- Update all functions that lack secure search_path settings
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_quiet_start_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_next_kit_number()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(kit_number), 0) + 1 INTO next_number
  FROM public.quiet_start_signups
  WHERE benefits_claimed = true;
  
  -- Ensure we don't exceed 500 kits
  IF next_number > 500 THEN
    RETURN NULL;
  END IF;
  
  RETURN next_number;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NOW()
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_mutual_swipe()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_memory_vault_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
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

CREATE OR REPLACE FUNCTION public.create_default_safety_settings()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.safety_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.schedule_risk_assessment()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    -- Basic trigger implementation without pg_cron dependency
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.schedule_match_archiving()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    -- Basic trigger implementation without pg_cron dependency
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_generate_match_details()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    -- Generate AI summary if not exists
    IF NEW.ai_match_summary IS NULL THEN
        NEW.ai_match_summary := public.generate_match_summary(NEW.user_id, NEW.matched_user_id);
    END IF;

    -- Compute embedding if not exists
    IF NEW.embedding IS NULL THEN
        NEW.embedding := public.compute_match_embedding(NEW.user_id, NEW.matched_user_id);
    END IF;

    RETURN NEW;
END;
$function$;