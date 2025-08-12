-- Fix critical security issue: Remove overly permissive RLS policies on subscribers table
-- that allow public access to user email addresses and subscription data

-- Drop all existing insecure policies
DROP POLICY IF EXISTS "System can manage subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "System can update subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create secure RLS policies that only allow users to access their own subscription data
CREATE POLICY "Users can view only their own subscription"
ON public.subscribers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert only their own subscription"
ON public.subscribers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update only their own subscription"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow system/service role to manage subscriptions for webhooks (PayPal, Stripe, etc.)
CREATE POLICY "Service role can manage all subscriptions"
ON public.subscribers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Ensure user_id is never null for new subscriptions (critical for security)
ALTER TABLE public.subscribers ALTER COLUMN user_id SET NOT NULL;