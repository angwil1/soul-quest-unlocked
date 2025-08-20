-- CRITICAL SECURITY FIXES - Part 3: Fix function conflicts and add remaining security measures

-- Drop existing function and recreate with correct parameters
DROP FUNCTION IF EXISTS public.log_security_event(text, jsonb, inet, text);

-- Add security logging function with correct parameters
CREATE OR REPLACE FUNCTION public.log_security_event(
    p_event_type text, 
    p_event_data jsonb DEFAULT '{}',
    p_ip_address inet DEFAULT NULL,
    p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    INSERT INTO public.security_events (
        user_id,
        event_type,
        event_data,
        ip_address,
        user_agent
    ) VALUES (
        auth.uid(),
        p_event_type,
        p_event_data,
        p_ip_address,
        p_user_agent
    );
END;
$function$;

-- Continue securing remaining database functions
CREATE OR REPLACE FUNCTION public.get_remaining_messages(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v_is_premium BOOLEAN;
    v_message_count INTEGER;
    v_daily_limit INTEGER := 5;
BEGIN
    -- Validate user can only check their own limits
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only check own message limits';
    END IF;
    
    -- Check if user is premium
    SELECT EXISTS (
        SELECT 1 
        FROM public.subscribers 
        WHERE 
            user_id = p_user_id AND 
            subscribed = true AND 
            (subscription_end IS NULL OR subscription_end > NOW())
    ) INTO v_is_premium;
    
    -- Premium users have unlimited messages
    IF v_is_premium THEN
        RETURN -1; -- Indicates unlimited
    END IF;
    
    -- Get today's message count
    SELECT COALESCE(message_count, 0) INTO v_message_count
    FROM public.daily_message_limits
    WHERE user_id = p_user_id AND message_date = CURRENT_DATE;
    
    RETURN GREATEST(0, v_daily_limit - COALESCE(v_message_count, 0));
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_user_age(p_date_of_birth date)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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
SET search_path TO ''
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

-- Add rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_endpoint text, 
    p_ip_address inet, 
    p_max_requests integer DEFAULT 100, 
    p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_current_count integer;
  v_window_start timestamp with time zone;
BEGIN
  -- Calculate window start time
  v_window_start := date_trunc('hour', now()) + 
                   (EXTRACT(minute FROM now())::integer / p_window_minutes) * 
                   (p_window_minutes || ' minutes')::interval;

  -- Get current request count for this window
  SELECT COALESCE(request_count, 0) INTO v_current_count
  FROM public.rate_limits
  WHERE 
    (user_id = auth.uid() OR ip_address = p_ip_address) AND
    endpoint = p_endpoint AND 
    window_start = v_window_start;

  -- Check if limit exceeded
  IF v_current_count >= p_max_requests THEN
    -- Log rate limit violation
    PERFORM public.log_security_event(
      'rate_limit_exceeded',
      jsonb_build_object(
        'endpoint', p_endpoint,
        'current_count', v_current_count,
        'max_requests', p_max_requests,
        'window_minutes', p_window_minutes
      ),
      p_ip_address
    );
    RETURN false;
  END IF;

  -- Increment counter
  INSERT INTO public.rate_limits (
    user_id,
    ip_address, 
    endpoint,
    request_count,
    window_start
  ) VALUES (
    auth.uid(),
    p_ip_address,
    p_endpoint,
    1,
    v_window_start
  )
  ON CONFLICT (user_id, ip_address, endpoint, window_start)
  DO UPDATE SET 
    request_count = public.rate_limits.request_count + 1;

  RETURN true;
END;
$function$;

-- Add enhanced input sanitization
CREATE OR REPLACE FUNCTION public.sanitize_user_content(input_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    sanitized_text text;
BEGIN
    -- Remove null/empty input
    IF input_text IS NULL OR trim(input_text) = '' THEN
        RETURN '';
    END IF;
    
    -- Basic HTML/script tag removal
    sanitized_text := regexp_replace(input_text, '<[^>]*>', '', 'gi');
    
    -- Remove javascript: URLs
    sanitized_text := regexp_replace(sanitized_text, 'javascript:', '', 'gi');
    
    -- Remove event handlers
    sanitized_text := regexp_replace(sanitized_text, 'on\w+\s*=', '', 'gi');
    
    -- Remove data: URLs
    sanitized_text := regexp_replace(sanitized_text, 'data:', '', 'gi');
    
    -- Limit length
    IF length(sanitized_text) > 5000 THEN
        sanitized_text := left(sanitized_text, 5000);
    END IF;
    
    RETURN sanitized_text;
END;
$function$;