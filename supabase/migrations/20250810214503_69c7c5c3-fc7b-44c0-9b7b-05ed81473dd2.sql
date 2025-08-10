-- Create subscribers table for Stripe integration if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription info
CREATE POLICY "Users can view own subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Create policy for edge functions to update subscription info
CREATE POLICY "System can update subscriptions" ON public.subscribers
FOR ALL
USING (true);

-- Create message limits table to track daily usage
CREATE TABLE IF NOT EXISTS public.daily_message_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_date DATE NOT NULL DEFAULT CURRENT_DATE,
  message_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, message_date)
);

-- Enable RLS on message limits
ALTER TABLE public.daily_message_limits ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own message limits
CREATE POLICY "Users can view own message limits" ON public.daily_message_limits
FOR SELECT
USING (user_id = auth.uid());

-- Policy for system to manage message limits
CREATE POLICY "System can manage message limits" ON public.daily_message_limits
FOR ALL
USING (true);

-- Function to check if user can send a message
CREATE OR REPLACE FUNCTION public.can_send_message(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_is_premium BOOLEAN;
    v_message_count INTEGER;
    v_daily_limit INTEGER := 5;
BEGIN
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
$$;

-- Function to increment message count
CREATE OR REPLACE FUNCTION public.increment_message_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_new_count INTEGER;
BEGIN
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
$$;

-- Function to get user's remaining messages for today
CREATE OR REPLACE FUNCTION public.get_remaining_messages(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_is_premium BOOLEAN;
    v_message_count INTEGER;
    v_daily_limit INTEGER := 5;
BEGIN
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
$$;