-- Add shipping eligibility tracking to quiet_start_signups
ALTER TABLE public.quiet_start_signups 
ADD COLUMN shipping_eligible_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN shipping_status TEXT DEFAULT 'pending' CHECK (shipping_status IN ('pending', 'eligible', 'shipped', 'cancelled'));

-- Update shipping_eligible_at for existing records (3 months from account creation)
UPDATE public.quiet_start_signups 
SET shipping_eligible_at = created_at + INTERVAL '3 months'
WHERE shipping_eligible_at IS NULL;

-- Create function to check shipping eligibility
CREATE OR REPLACE FUNCTION public.check_shipping_eligibility(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    v_signup_record RECORD;
    v_user_created_at TIMESTAMP WITH TIME ZONE;
    v_eligible_date TIMESTAMP WITH TIME ZONE;
    v_days_remaining INTEGER;
BEGIN
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
$$;

-- Create function to mark kit as shipped
CREATE OR REPLACE FUNCTION public.mark_kit_shipped(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
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
$$;

-- Update trigger to set shipping_eligible_at for new signups
CREATE OR REPLACE FUNCTION public.set_shipping_eligibility()
RETURNS TRIGGER
LANGUAGE plpgsql
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

-- Create trigger for new signups
CREATE TRIGGER set_shipping_eligibility_trigger
    BEFORE INSERT ON public.quiet_start_signups
    FOR EACH ROW
    EXECUTE FUNCTION public.set_shipping_eligibility();