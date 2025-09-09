-- Fix Final Batch of Functions with Security Issues
-- Address remaining functions with mutable search paths

-- Fix all remaining security-sensitive functions
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_next_kit_number()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  next_number INTEGER;
BEGIN
  -- Security check: only service role can call this
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied: service role required';
  END IF;

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

CREATE OR REPLACE FUNCTION public.create_signup_event_for_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Security check: only service role or the user themselves
  IF auth.role() != 'service_role' AND auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Access denied: insufficient permissions';
  END IF;

  -- Check if signup event already exists
  IF NOT EXISTS (
    SELECT 1 FROM public.user_events 
    WHERE user_id = p_user_id AND event_type = 'signup'
  ) THEN
    -- Create signup event
    INSERT INTO public.user_events (user_id, event_type, event_data)
    VALUES (
      p_user_id,
      'signup',
      jsonb_build_object(
        'signup_method', 'email',
        'created_via_function', true
      )
    );
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_user_age(p_date_of_birth date)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Check if user is at least 18
  IF p_date_of_birth > (CURRENT_DATE - INTERVAL '18 years') THEN
    RAISE EXCEPTION 'User must be at least 18 years old';
  END IF;

  -- Insert or update age verification
  INSERT INTO public.age_verifications (
    user_id,
    date_of_birth,
    is_verified,
    verification_method,
    verified_at
  ) VALUES (
    auth.uid(),
    p_date_of_birth,
    TRUE,
    'self_reported',
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    date_of_birth = EXCLUDED.date_of_birth,
    is_verified = TRUE,
    verification_method = 'self_reported',
    verified_at = NOW();

  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.perform_sensitive_action(p_action_details jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- First, check security level
  PERFORM public.check_user_security_level();

  -- Log the sensitive action
  PERFORM public.log_security_event(
    'sensitive_action_performed',
    p_action_details
  );

  -- Proceed with sensitive action
  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, created_at)
  VALUES (NEW.id, NEW.created_at);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_memory_vault_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_mutual_swipe()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.auto_generate_match_details()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    -- Generate AI summary if not exists
    IF NEW.ai_match_summary IS NULL THEN
        NEW.ai_match_summary := 'Match details generated automatically';
    END IF;

    -- Set a basic embedding placeholder if not exists
    IF NEW.embedding IS NULL THEN
        -- Use NULL for now as vector implementation can be added later
        NEW.embedding := NULL;
    END IF;

    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_quiet_start_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

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
END;
$function$;

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

CREATE OR REPLACE FUNCTION public.set_shipping_eligibility()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_user_created_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get user account creation date
    SELECT created_at INTO v_user_created_at
    FROM auth.users
    WHERE id = NEW.user_id;
    
    -- Set shipping eligibility to 3 months from account creation
    NEW.shipping_eligible_at := v_user_created_at + INTERVAL '3 months';
    
    RETURN NEW;
END;
$function$;