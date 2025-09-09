-- Comprehensive Security Fix Migration (Corrected)
-- Phase 1: Critical RLS Policy Fixes

-- Fix user_locations table security (check if table exists first)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_locations') THEN
        ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can only access their own locations" ON public.user_locations;
        CREATE POLICY "Users can only access their own locations"
        ON public.user_locations
        FOR ALL
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Fix email_journeys table security
ALTER TABLE public.email_journeys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only view their own email journeys" ON public.email_journeys;
CREATE POLICY "Users can only view their own email journeys"
ON public.email_journeys
FOR SELECT
USING (auth.uid() = user_id);

-- Strengthen paypal_payments security
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

-- Fix subscribers table (check if it exists and what columns it has)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'subscribers') THEN
        ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can only view their own subscription" ON public.subscribers;
        CREATE POLICY "Users can only view their own subscription"
        ON public.subscribers
        FOR SELECT
        USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscribers;
        CREATE POLICY "Service role can manage subscriptions"
        ON public.subscribers
        FOR ALL
        USING (auth.role() = 'service_role')
        WITH CHECK (auth.role() = 'service_role');
    END IF;
END $$;

-- Fix quiet_start_signups table
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quiet_start_signups') THEN
        ALTER TABLE public.quiet_start_signups ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can only access their own quiet start signup" ON public.quiet_start_signups;
        CREATE POLICY "Users can only access their own quiet start signup"
        ON public.quiet_start_signups
        FOR ALL
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Phase 2: Fix Database Function Security (Critical search_path vulnerabilities)

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

CREATE OR REPLACE FUNCTION public.get_remaining_messages(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_is_premium BOOLEAN := false;
    v_message_count INTEGER;
    v_daily_limit INTEGER := 5;
BEGIN
    -- Validate user can only check their own limits
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only check own message limits';
    END IF;
    
    -- Check if subscribers table exists and user is premium
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'subscribers') THEN
        SELECT EXISTS (
            SELECT 1 
            FROM public.subscribers 
            WHERE 
                user_id = p_user_id AND 
                subscribed = true AND 
                (subscription_end IS NULL OR subscription_end > NOW())
        ) INTO v_is_premium;
    END IF;
    
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
    v_is_premium BOOLEAN := false;
    v_message_count INTEGER;
    v_daily_limit INTEGER := 5;
BEGIN
    -- Security check: only allow users to check their own message limits
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only check own message limits';
    END IF;
    
    -- Check if subscribers table exists and user is premium
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'subscribers') THEN
        SELECT EXISTS (
            SELECT 1 
            FROM public.subscribers 
            WHERE 
                user_id = p_user_id AND 
                subscribed = true AND 
                (subscription_end IS NULL OR subscription_end > NOW())
        ) INTO v_is_premium;
    END IF;
    
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

CREATE OR REPLACE FUNCTION public.mark_kit_shipped(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Security check: only allow service role or user themselves
    IF auth.role() != 'service_role' AND auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: insufficient permissions';
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

-- Phase 4: Add indexes for security-related queries
CREATE INDEX IF NOT EXISTS idx_security_events_user_type 
ON public.security_events(user_id, event_type);

CREATE INDEX IF NOT EXISTS idx_daily_message_limits_user_date 
ON public.daily_message_limits(user_id, message_date);

-- Add security constraints only if columns exist
DO $$
BEGIN
    -- Add constraint for quiet_start_signups if shipping_status column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quiet_start_signups' 
        AND column_name = 'shipping_status'
    ) THEN
        ALTER TABLE public.quiet_start_signups 
        ADD CONSTRAINT IF NOT EXISTS valid_shipping_status 
        CHECK (shipping_status IN ('pending', 'eligible', 'shipped', 'delivered'));
    END IF;
END $$;

-- Add security documentation comments
COMMENT ON TABLE public.email_journeys IS 'Contains user email history - read-only access for users';
COMMENT ON TABLE public.paypal_payments IS 'Contains sensitive payment data - service role access only';
COMMENT ON TABLE public.security_events IS 'Security audit log - tracks sensitive data access and security events';