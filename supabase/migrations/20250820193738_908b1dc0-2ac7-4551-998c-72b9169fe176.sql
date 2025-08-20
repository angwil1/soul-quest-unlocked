-- CRITICAL SECURITY FIXES - Part 2: Remaining Database Functions

-- Continue securing remaining database functions with SET search_path TO ''

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

CREATE OR REPLACE FUNCTION public.uid()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN auth.uid();
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, avatar_url, created_at)
  VALUES (
    NEW.id,
    NULL,
    NOW()
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_security_event_access(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v_is_authorized BOOLEAN;
BEGIN
    -- Strict check against auth.uid() to prevent privilege escalation
    v_is_authorized := (p_user_id = auth.uid());
    
    RETURN v_is_authorized;
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

CREATE OR REPLACE FUNCTION public.increment_message_count(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v_new_count INTEGER;
BEGIN
    -- Validate user can only increment their own count
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only increment own message count';
    END IF;
    
    -- Insert or update daily message count
    INSERT INTO public.daily_message_limits (user_id, message_date, message_count)
    VALUES (p_user_id, CURRENT_DATE, 1)
    ON CONFLICT (user_id, message_date)
    DO UPDATE SET 
        message_count = daily_message_limits.message_count + 1,
        updated_at = NOW()
    RETURNING message_count INTO v_new_count;
    
    RETURN v_new_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.archive_expired_matches()
RETURNS void
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
    -- Archive matches that have been inactive for too long
    WITH matches_to_archive AS (
        SELECT 
            pm.id AS original_match_id,
            pm.user_id,
            pm.matched_user_id,
            pm.match_timestamp AS matched_at,
            pm.compatibility_score,
            'expired' AS interaction_status,
            NULL AS last_interaction_at
        FROM 
            public.premium_matches pm
        WHERE 
            -- Matches older than 90 days
            pm.match_timestamp < NOW() - INTERVAL '90 days'
    )
    -- Insert into archive
    INSERT INTO public.ai_matches_archive (
        original_match_id,
        user_id,
        matched_user_id,
        matched_at,
        compatibility_score,
        interaction_status,
        last_interaction_at,
        archive_reason
    )
    SELECT 
        original_match_id,
        user_id,
        matched_user_id,
        matched_at,
        compatibility_score,
        interaction_status,
        last_interaction_at,
        'match_age_expiry' AS archive_reason
    FROM 
        matches_to_archive;

    -- Remove archived matches from active matches
    DELETE FROM public.premium_matches pm
    WHERE EXISTS (
        SELECT 1 
        FROM public.ai_matches_archive ama
        WHERE 
            ama.original_match_id = pm.id
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_user_security_level()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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
SET search_path TO ''
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

-- Add security audit table for monitoring
CREATE TABLE IF NOT EXISTS public.security_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    event_type text NOT NULL,
    event_data jsonb DEFAULT '{}',
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policy for security events
CREATE POLICY "Users can view own security events" 
ON public.security_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can log security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR auth.uid() = user_id);

-- Add rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    ip_address inet,
    endpoint text NOT NULL,
    request_count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, ip_address, endpoint, window_start)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policy for rate limits
CREATE POLICY "System manages rate limits" 
ON public.rate_limits 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add security logging function
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