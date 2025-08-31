-- Fix search path security issue for the trigger function
CREATE OR REPLACE FUNCTION public.set_shipping_eligibility()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
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
$$;