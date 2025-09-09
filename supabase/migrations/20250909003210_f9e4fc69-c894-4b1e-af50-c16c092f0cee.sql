-- Fix Remaining Database Function Security Issues
-- Address the 20+ functions with mutable search paths

-- Fix all remaining functions with search_path vulnerabilities
CREATE OR REPLACE FUNCTION public.compute_interaction_risk(p_user_id uuid)
RETURNS TABLE(computed_user_id uuid, swiping_anomaly_score double precision, block_report_score double precision, location_shift_score double precision, total_risk_score double precision, warning_level text, interaction_limit_multiplier double precision, debug_info jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_swiping_anomaly_score double precision := 0.2;
    v_block_report_score double precision := 0.2;
    v_location_shift_score double precision := 0.2;
    v_total_risk_score double precision;
    v_warning_level text;
    v_interaction_limit_multiplier double precision;
    
    -- Diagnostic variables
    v_match_interactions_count integer;
    v_user_interactions_count integer;
    v_user_locations_count integer;
    v_pass_interactions_count integer;
    v_block_report_interactions_count integer;
BEGIN
    -- Only allow users to compute their own risk
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only compute own interaction risk';
    END IF;

    -- Diagnostic: Count interactions
    SELECT COUNT(*) INTO v_match_interactions_count 
    FROM public.match_interactions 
    WHERE user_id = p_user_id;

    SELECT COUNT(*) INTO v_pass_interactions_count 
    FROM public.match_interactions 
    WHERE user_id = p_user_id AND match_type = 'pass';

    SELECT COUNT(*) INTO v_user_interactions_count 
    FROM public.user_interactions 
    WHERE user_id = p_user_id;

    SELECT COUNT(*) INTO v_block_report_interactions_count 
    FROM public.user_interactions 
    WHERE user_id = p_user_id AND interaction_type IN ('block', 'report');

    -- Safe location count with error handling
    BEGIN
        SELECT COUNT(DISTINCT location) INTO v_user_locations_count 
        FROM public.user_locations 
        WHERE user_id = p_user_id;
    EXCEPTION WHEN undefined_table THEN
        v_user_locations_count := 0;
    END;

    -- Compute total risk score
    v_total_risk_score := 
        COALESCE(v_swiping_anomaly_score, 0.2) * 0.3 + 
        COALESCE(v_block_report_score, 0.2) * 0.4 + 
        COALESCE(v_location_shift_score, 0.2) * 0.3;

    -- Determine warning level
    v_warning_level := 
        CASE 
            WHEN v_total_risk_score > 0.7 THEN 'high'
            WHEN v_total_risk_score > 0.4 THEN 'medium'
            ELSE 'normal'
        END;

    -- Compute interaction limit multiplier
    v_interaction_limit_multiplier := 
        CASE 
            WHEN v_warning_level = 'high' THEN 0.5
            WHEN v_warning_level = 'medium' THEN 0.8
            ELSE 1.0
        END;

    -- Upsert risk profile
    INSERT INTO public.interaction_risk_profiles (
        user_id, 
        swiping_anomaly_score, 
        block_report_score, 
        location_shift_score, 
        total_risk_score, 
        warning_level, 
        interaction_limit_multiplier,
        last_risk_update,
        next_risk_assessment
    ) VALUES (
        p_user_id,
        v_swiping_anomaly_score,
        v_block_report_score,
        v_location_shift_score,
        v_total_risk_score,
        v_warning_level,
        v_interaction_limit_multiplier,
        NOW(),
        NOW() + INTERVAL '24 hours'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        swiping_anomaly_score = EXCLUDED.swiping_anomaly_score,
        block_report_score = EXCLUDED.block_report_score,
        location_shift_score = EXCLUDED.location_shift_score,
        total_risk_score = EXCLUDED.total_risk_score,
        warning_level = EXCLUDED.warning_level,
        interaction_limit_multiplier = EXCLUDED.interaction_limit_multiplier,
        last_risk_update = NOW(),
        next_risk_assessment = NOW() + INTERVAL '24 hours';

    -- Return the computed risk profile with debug information
    RETURN QUERY 
    SELECT 
        p_user_id AS computed_user_id,
        v_swiping_anomaly_score,
        v_block_report_score,
        v_location_shift_score,
        v_total_risk_score,
        v_warning_level,
        v_interaction_limit_multiplier,
        jsonb_build_object(
            'match_interactions_count', v_match_interactions_count,
            'pass_interactions_count', v_pass_interactions_count,
            'user_interactions_count', v_user_interactions_count,
            'block_report_interactions_count', v_block_report_interactions_count,
            'user_locations_count', v_user_locations_count
        ) AS debug_info;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(p_endpoint text, p_ip_address inet, p_max_requests integer DEFAULT 100, p_window_minutes integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.track_failed_login(p_email text, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_recent_attempts integer;
  v_lockout_threshold integer := 5;
  v_lockout_window interval := '15 minutes';
BEGIN
  -- Count recent failed attempts
  SELECT COUNT(*) INTO v_recent_attempts
  FROM public.failed_login_attempts
  WHERE 
    email = p_email AND 
    attempt_time > (now() - v_lockout_window);

  -- Check if account should be locked
  IF v_recent_attempts >= v_lockout_threshold THEN
    -- Log security event
    PERFORM public.log_security_event(
      'account_lockout',
      jsonb_build_object(
        'email', p_email,
        'recent_attempts', v_recent_attempts,
        'threshold', v_lockout_threshold
      ),
      p_ip_address,
      p_user_agent
    );
    RETURN false; -- Account is locked
  END IF;

  -- Record this failed attempt
  INSERT INTO public.failed_login_attempts (
    email,
    ip_address,
    user_agent
  ) VALUES (
    p_email,
    p_ip_address,
    p_user_agent
  );

  RETURN true; -- Account is not locked
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_shipping_eligibility(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_signup_record RECORD;
    v_user_created_at TIMESTAMP WITH TIME ZONE;
    v_eligible_date TIMESTAMP WITH TIME ZONE;
    v_days_remaining INTEGER;
BEGIN
    -- Security check: only allow users to check their own eligibility
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only check own shipping eligibility';
    END IF;

    -- Get signup record
    SELECT * INTO v_signup_record
    FROM public.quiet_start_signups
    WHERE user_id = p_user_id AND benefits_claimed = true;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'eligible', false,
            'reason', 'no_signup_found'
        );
    END IF;
    
    -- Get user account creation date
    SELECT created_at INTO v_user_created_at
    FROM auth.users
    WHERE id = p_user_id;
    
    -- Calculate eligibility date (3 months from account creation)
    v_eligible_date := v_user_created_at + INTERVAL '3 months';
    
    -- Check if eligible now
    IF NOW() >= v_eligible_date THEN
        -- Update status if not already updated
        UPDATE public.quiet_start_signups
        SET shipping_status = 'eligible'
        WHERE user_id = p_user_id AND shipping_status = 'pending';
        
        RETURN jsonb_build_object(
            'eligible', true,
            'shipping_status', COALESCE(v_signup_record.shipping_status, 'eligible'),
            'eligible_since', v_eligible_date
        );
    ELSE
        -- Calculate days remaining
        v_days_remaining := EXTRACT(DAY FROM v_eligible_date - NOW());
        
        RETURN jsonb_build_object(
            'eligible', false,
            'shipping_status', v_signup_record.shipping_status,
            'eligible_date', v_eligible_date,
            'days_remaining', v_days_remaining,
            'reason', 'account_too_new'
        );
    END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.sanitize_user_content(input_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.validate_user_input(input_text text, max_length integer DEFAULT 1000)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Check for null or empty input
    IF input_text IS NULL OR trim(input_text) = '' THEN
        RETURN false;
    END IF;
    
    -- Check length
    IF length(input_text) > max_length THEN
        RETURN false;
    END IF;
    
    -- Check for malicious patterns (basic XSS protection)
    IF input_text ~* '<script|javascript:|data:|vbscript:|onload|onerror|onclick' THEN
        RETURN false;
    END IF;
    
    -- Check for SQL injection patterns
    IF input_text ~* '(union|select|insert|update|delete|drop|alter|create|exec|execute)(\s|\(|;)' THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$function$;

-- Create secure helper function for checking security event access
CREATE OR REPLACE FUNCTION public.check_security_event_access(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Only allow users to access their own security events
    RETURN auth.uid() = p_user_id;
END;
$function$;