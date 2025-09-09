-- Comprehensive Security Fix Migration
-- Phase 1: Critical RLS Policy Fixes

-- Fix user_locations table security
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own locations"
ON public.user_locations
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fix email_journeys table security  
ALTER TABLE public.email_journeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own email journeys"
ON public.email_journeys
FOR SELECT
USING (auth.uid() = user_id);

-- Strengthen paypal_payments security (already has some RLS but needs tightening)
DROP POLICY IF EXISTS "System can manage PayPal payments" ON public.paypal_payments;
DROP POLICY IF EXISTS "Users can view own PayPal payments" ON public.paypal_payments;
DROP POLICY IF EXISTS "Users can view their own PayPal payments" ON public.paypal_payments;

CREATE POLICY "Users can only view their own payments"
ON public.paypal_payments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage payments"
ON public.paypal_payments
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Add RLS to quiet_start_signups if not already enabled
ALTER TABLE public.quiet_start_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own quiet start signup"
ON public.quiet_start_signups
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add RLS to subscribers table
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own subscription"
ON public.subscribers
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
ON public.subscribers
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Phase 2: Fix Database Function Security (Critical search_path vulnerabilities)

-- Fix security-critical functions with mutable search paths
CREATE OR REPLACE FUNCTION public.check_user_message_limit_access(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    RETURN p_user_id = auth.uid();
END;
$function$;

CREATE OR REPLACE FUNCTION public.uid()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN auth.uid();
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_default_safety_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.safety_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
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

CREATE OR REPLACE FUNCTION public.mark_kit_shipped(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Security check: only allow users to mark their own kit as shipped
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only mark own kit as shipped';
    END IF;
    
    UPDATE public.quiet_start_signups
    SET 
        shipping_status = 'shipped',
        updated_at = NOW()
    WHERE 
        user_id = p_user_id 
        AND benefits_claimed = true 
        AND shipping_status = 'eligible';
    
    RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_remaining_messages(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.can_send_message(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_is_premium BOOLEAN;
    v_message_count INTEGER;
    v_daily_limit INTEGER := 5;
BEGIN
    -- Security check: only allow users to check their own message limits
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only check own message limits';
    END IF;
    
    -- Check if user is premium (unlimited messages)
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
        RETURN true;
    END IF;
    
    -- Check daily message count for free users
    SELECT COALESCE(message_count, 0) INTO v_message_count
    FROM public.daily_message_limits
    WHERE user_id = p_user_id AND message_date = CURRENT_DATE;
    
    -- Return true if under the limit
    RETURN COALESCE(v_message_count, 0) < v_daily_limit;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_message_count(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_new_count INTEGER;
BEGIN
    -- Security check: only allow incrementing own message count
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

-- Phase 3: Create Security Audit Functions

CREATE OR REPLACE FUNCTION public.log_sensitive_data_access(
    p_table_name text,
    p_action text,
    p_user_id uuid DEFAULT NULL,
    p_additional_data jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    INSERT INTO public.security_events (
        user_id,
        event_type,
        event_data,
        ip_address
    ) VALUES (
        COALESCE(p_user_id, auth.uid()),
        'sensitive_data_access',
        jsonb_build_object(
            'table_name', p_table_name,
            'action', p_action,
            'additional_data', p_additional_data
        ),
        inet_client_addr()
    );
END;
$function$;

-- Phase 4: Add constraints for data integrity
ALTER TABLE public.quiet_start_signups 
ADD CONSTRAINT valid_shipping_status 
CHECK (shipping_status IN ('pending', 'eligible', 'shipped', 'delivered'));

ALTER TABLE public.subscribers
ADD CONSTRAINT valid_subscription_dates
CHECK (subscription_start <= COALESCE(subscription_end, subscription_start));

-- Phase 5: Create secure helper functions for user validation
CREATE OR REPLACE FUNCTION public.validate_user_ownership(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    RETURN auth.uid() = p_user_id;
END;
$function$;

-- Add indexes for security-related queries
CREATE INDEX IF NOT EXISTS idx_security_events_user_type 
ON public.security_events(user_id, event_type);

CREATE INDEX IF NOT EXISTS idx_daily_message_limits_user_date 
ON public.daily_message_limits(user_id, message_date);

-- Add comment for security documentation
COMMENT ON TABLE public.user_locations IS 'Contains sensitive user location data - access restricted by RLS';
COMMENT ON TABLE public.paypal_payments IS 'Contains sensitive payment data - service role access only';
COMMENT ON TABLE public.email_journeys IS 'Contains user email history - read-only access for users';