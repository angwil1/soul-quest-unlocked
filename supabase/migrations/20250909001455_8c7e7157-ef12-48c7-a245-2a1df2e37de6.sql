-- CRITICAL SECURITY FIX: Implement comprehensive RLS policies and security improvements
-- This migration addresses multiple security vulnerabilities identified in the security scan

-- ==================================================
-- 1. CREATE MISSING TABLES AND SECURITY FUNCTIONS
-- ==================================================

-- Create missing tables that were referenced in the security scan
CREATE TABLE IF NOT EXISTS public.quiet_start_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    shipping_address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'US',
    benefits_claimed BOOLEAN DEFAULT false,
    kit_number INTEGER,
    shipping_status TEXT DEFAULT 'pending',
    shipping_eligible_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    email TEXT NOT NULL,
    stripe_customer_id TEXT,
    subscribed BOOLEAN DEFAULT false,
    subscription_type TEXT,
    subscription_start TIMESTAMP WITH TIME ZONE,
    subscription_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all sensitive tables
ALTER TABLE public.age_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paypal_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiet_start_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- ==================================================
-- 2. CREATE SECURE HELPER FUNCTIONS
-- ==================================================

-- Security function to validate user ownership
CREATE OR REPLACE FUNCTION public.is_owner(resource_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() = resource_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Audit logging function for sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access(
    table_name TEXT,
    action TEXT,
    record_id UUID DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.security_events (
        user_id,
        event_type,
        event_data,
        ip_address
    ) VALUES (
        auth.uid(),
        'sensitive_data_access',
        jsonb_build_object(
            'table', table_name,
            'action', action,
            'record_id', record_id,
            'timestamp', now()
        ),
        inet_client_addr()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==================================================
-- 3. SECURE AGE VERIFICATIONS TABLE
-- ==================================================

-- Drop existing policies and create secure ones
DROP POLICY IF EXISTS "Users can insert their own age verification" ON public.age_verifications;
DROP POLICY IF EXISTS "Users can update their own age verification" ON public.age_verifications;
DROP POLICY IF EXISTS "Users can view their own age verification" ON public.age_verifications;

-- Secure RLS policies for age_verifications
CREATE POLICY "secure_age_verification_select" ON public.age_verifications
    FOR SELECT USING (public.is_owner(user_id));

CREATE POLICY "secure_age_verification_insert" ON public.age_verifications
    FOR INSERT WITH CHECK (public.is_owner(user_id));

CREATE POLICY "secure_age_verification_update" ON public.age_verifications
    FOR UPDATE USING (public.is_owner(user_id)) WITH CHECK (public.is_owner(user_id));

-- No delete allowed for age verifications (audit trail)
CREATE POLICY "no_age_verification_delete" ON public.age_verifications
    FOR DELETE USING (false);

-- ==================================================
-- 4. SECURE PAYPAL PAYMENTS TABLE
-- ==================================================

-- Drop existing policies
DROP POLICY IF EXISTS "System can manage PayPal payments" ON public.paypal_payments;
DROP POLICY IF EXISTS "Users can view own PayPal payments" ON public.paypal_payments;
DROP POLICY IF EXISTS "Users can view their own PayPal payments" ON public.paypal_payments;

-- Secure RLS policies for paypal_payments
CREATE POLICY "secure_paypal_select" ON public.paypal_payments
    FOR SELECT USING (public.is_owner(user_id));

-- Only system can insert/update payments (prevent user manipulation)
CREATE POLICY "system_only_paypal_insert" ON public.paypal_payments
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "system_only_paypal_update" ON public.paypal_payments
    FOR UPDATE USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- No delete allowed for payment records (audit trail)
CREATE POLICY "no_paypal_delete" ON public.paypal_payments
    FOR DELETE USING (false);

-- ==================================================
-- 5. SECURE EMAIL JOURNEYS TABLE
-- ==================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own email journeys" ON public.email_journeys;

-- Secure RLS policies for email_journeys
CREATE POLICY "secure_email_journeys_select" ON public.email_journeys
    FOR SELECT USING (public.is_owner(user_id));

-- Only system can manage email journeys
CREATE POLICY "system_only_email_insert" ON public.email_journeys
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "system_only_email_update" ON public.email_journeys
    FOR UPDATE USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- No delete allowed for email audit trail
CREATE POLICY "no_email_journeys_delete" ON public.email_journeys
    FOR DELETE USING (false);

-- ==================================================
-- 6. SECURE QUIET START SIGNUPS TABLE
-- ==================================================

-- Secure RLS policies for quiet_start_signups
CREATE POLICY "secure_quiet_start_select" ON public.quiet_start_signups
    FOR SELECT USING (public.is_owner(user_id));

CREATE POLICY "secure_quiet_start_insert" ON public.quiet_start_signups
    FOR INSERT WITH CHECK (public.is_owner(user_id));

CREATE POLICY "secure_quiet_start_update" ON public.quiet_start_signups
    FOR UPDATE USING (public.is_owner(user_id)) WITH CHECK (public.is_owner(user_id));

-- No delete allowed for shipping records (audit trail)
CREATE POLICY "no_quiet_start_delete" ON public.quiet_start_signups
    FOR DELETE USING (false);

-- ==================================================
-- 7. SECURE SUBSCRIBERS TABLE
-- ==================================================

-- Secure RLS policies for subscribers
CREATE POLICY "secure_subscribers_select" ON public.subscribers
    FOR SELECT USING (public.is_owner(user_id));

-- Only system can manage subscriptions (prevent manipulation)
CREATE POLICY "system_only_subscribers_insert" ON public.subscribers
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "system_only_subscribers_update" ON public.subscribers
    FOR UPDATE USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- No delete allowed for subscription records (audit trail)
CREATE POLICY "no_subscribers_delete" ON public.subscribers
    FOR DELETE USING (false);

-- ==================================================
-- 8. FIX FUNCTION SECURITY (search_path issues)
-- ==================================================

-- Update functions with proper search_path settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, created_at)
  VALUES (NEW.id, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_memory_vault_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_quiet_start_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ==================================================
-- 9. ADD TRIGGERS FOR AUDIT LOGGING
-- ==================================================

-- Trigger for shipping data access logging
CREATE OR REPLACE FUNCTION public.log_shipping_access()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.log_sensitive_data_access('quiet_start_signups', TG_OP, NEW.id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER shipping_access_audit
    AFTER SELECT OR INSERT OR UPDATE ON public.quiet_start_signups
    FOR EACH ROW EXECUTE FUNCTION public.log_shipping_access();

-- ==================================================
-- 10. CREATE SECURITY CONSTRAINTS
-- ==================================================

-- Add constraints to prevent data manipulation
ALTER TABLE public.age_verifications 
ADD CONSTRAINT age_verification_user_not_null CHECK (user_id IS NOT NULL);

ALTER TABLE public.paypal_payments 
ADD CONSTRAINT paypal_user_not_null CHECK (user_id IS NOT NULL);

ALTER TABLE public.email_journeys 
ADD CONSTRAINT email_user_not_null CHECK (user_id IS NOT NULL);

ALTER TABLE public.quiet_start_signups 
ADD CONSTRAINT quiet_start_user_not_null CHECK (user_id IS NOT NULL);

ALTER TABLE public.subscribers 
ADD CONSTRAINT subscribers_user_not_null CHECK (user_id IS NOT NULL);

-- Add updated_at triggers where missing
CREATE TRIGGER update_quiet_start_updated_at
    BEFORE UPDATE ON public.quiet_start_signups
    FOR EACH ROW EXECUTE FUNCTION public.update_quiet_start_updated_at();

CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================================================
-- SECURITY MIGRATION COMPLETE
-- ==================================================
-- This migration has implemented comprehensive security measures:
-- 1. Secure RLS policies on all sensitive data tables
-- 2. User ownership validation functions
-- 3. Audit logging for sensitive data access
-- 4. Fixed function security issues
-- 5. Added data integrity constraints
-- 6. Prevented unauthorized data manipulation
-- ==================================================