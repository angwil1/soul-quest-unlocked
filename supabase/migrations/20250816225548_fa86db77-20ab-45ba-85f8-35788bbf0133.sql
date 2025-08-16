-- Fix security vulnerability in daily_message_limits table RLS policies
-- Remove overly permissive policy and create proper access controls

-- Drop the dangerous policy that allows unrestricted access
DROP POLICY IF EXISTS "System can manage message limits" ON public.daily_message_limits;

-- Create secure policies for system functions
-- Allow system functions to insert/update message limits (SECURITY DEFINER functions bypass RLS)
CREATE POLICY "Allow system functions to manage message limits"
ON public.daily_message_limits
FOR ALL
TO authenticated
USING (false)  -- No direct user access
WITH CHECK (false);  -- No direct user access

-- Users can only view their own message limits (this policy already exists but ensuring it's correct)
-- The existing "Users can view own message limits" policy is fine

-- Create a security definer function to safely check if user can access their data
CREATE OR REPLACE FUNCTION public.check_user_message_limit_access(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- Only allow access if the user is checking their own limits
    RETURN p_user_id = auth.uid();
END;
$$;

-- Update the existing user access policy to be more explicit
DROP POLICY IF EXISTS "Users can view own message limits" ON public.daily_message_limits;

CREATE POLICY "Users can view own message limits"
ON public.daily_message_limits
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Ensure no direct INSERT/UPDATE/DELETE access for regular users
-- System functions will use SECURITY DEFINER to bypass RLS when needed