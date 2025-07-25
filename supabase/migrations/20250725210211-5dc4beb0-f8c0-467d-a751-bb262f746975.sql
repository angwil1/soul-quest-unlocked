-- CLEANUP REMAINING SECURITY ISSUES

-- 1. Remove duplicate RLS policies
-- First, let's clean up duplicate policies on profiles table
DROP POLICY IF EXISTS "Insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "READ OWN PROFILE" ON public.profiles;
DROP POLICY IF EXISTS "Read own profile" ON public.profiles;
DROP POLICY IF EXISTS "read own profile" ON public.profiles;
DROP POLICY IF EXISTS "read own profile " ON public.profiles;

-- Keep only the consolidated policy for profiles
CREATE POLICY "Users can manage their own profile" 
ON public.profiles 
FOR ALL 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Clean up duplicate policies on messages table
DROP POLICY IF EXISTS "Allow users to view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Allow users to view messages in their matches" ON public.messages;
DROP POLICY IF EXISTS "Allow premium users to view all messages" ON public.messages;

-- Keep consolidated message policies
CREATE POLICY "Users can view messages in their matches" 
ON public.messages 
FOR SELECT 
USING (
  sender_id = auth.uid() OR 
  match_id IN (
    SELECT id FROM public.matches 
    WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);

-- Clean up matches table policies
DROP POLICY IF EXISTS "Users can see their own matches" ON public.matches;
DROP POLICY IF EXISTS "Allow access to matched users" ON public.matches;

-- Keep consolidated match policy
CREATE POLICY "Users can manage their matches" 
ON public.matches 
FOR ALL 
USING (auth.uid() = user1_id OR auth.uid() = user2_id)
WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- 2. Standardize storage bucket security
-- Update storage policies for consistent security

-- Remove any overly permissive storage policies
DELETE FROM storage.policies WHERE bucket_id IN ('pic', 'profile-pictures', 'profile-photos');

-- Create secure storage policies for profile-photos bucket (public)
INSERT INTO storage.policies (id, bucket_id, policy_name, operation, permissive, definition, check_definition)
VALUES 
  (
    'profile-photos-select-policy',
    'profile-photos',
    'Anyone can view profile photos',
    'SELECT',
    true,
    'true',
    NULL
  ),
  (
    'profile-photos-insert-policy', 
    'profile-photos',
    'Authenticated users can upload their own photos',
    'INSERT',
    true,
    'auth.uid() IS NOT NULL',
    'auth.uid()::text = (storage.foldername(name))[1]'
  ),
  (
    'profile-photos-update-policy',
    'profile-photos', 
    'Users can update their own photos',
    'UPDATE',
    true,
    'auth.uid()::text = (storage.foldername(name))[1]',
    'auth.uid()::text = (storage.foldername(name))[1]'
  ),
  (
    'profile-photos-delete-policy',
    'profile-photos',
    'Users can delete their own photos', 
    'DELETE',
    true,
    'auth.uid()::text = (storage.foldername(name))[1]',
    NULL
  );

-- Create secure storage policies for profile-pictures bucket (private)
INSERT INTO storage.policies (id, bucket_id, policy_name, operation, permissive, definition, check_definition)
VALUES 
  (
    'profile-pictures-select-policy',
    'profile-pictures',
    'Users can view their own profile pictures',
    'SELECT',
    true,
    'auth.uid()::text = (storage.foldername(name))[1]',
    NULL
  ),
  (
    'profile-pictures-insert-policy',
    'profile-pictures', 
    'Users can upload their own profile pictures',
    'INSERT',
    true,
    'auth.uid() IS NOT NULL',
    'auth.uid()::text = (storage.foldername(name))[1]'
  ),
  (
    'profile-pictures-update-policy',
    'profile-pictures',
    'Users can update their own profile pictures',
    'UPDATE', 
    true,
    'auth.uid()::text = (storage.foldername(name))[1]',
    'auth.uid()::text = (storage.foldername(name))[1]'
  ),
  (
    'profile-pictures-delete-policy',
    'profile-pictures',
    'Users can delete their own profile pictures',
    'DELETE',
    true,
    'auth.uid()::text = (storage.foldername(name))[1]',
    NULL
  );

-- Create secure storage policies for pic bucket (private)
INSERT INTO storage.policies (id, bucket_id, policy_name, operation, permissive, definition, check_definition)
VALUES 
  (
    'pic-select-policy',
    'pic',
    'Users can view their own pics',
    'SELECT',
    true,
    'auth.uid()::text = (storage.foldername(name))[1]',
    NULL
  ),
  (
    'pic-insert-policy',
    'pic',
    'Users can upload their own pics', 
    'INSERT',
    true,
    'auth.uid() IS NOT NULL',
    'auth.uid()::text = (storage.foldername(name))[1]'
  ),
  (
    'pic-update-policy',
    'pic',
    'Users can update their own pics',
    'UPDATE',
    true,
    'auth.uid()::text = (storage.foldername(name))[1]',
    'auth.uid()::text = (storage.foldername(name))[1]'
  ),
  (
    'pic-delete-policy',
    'pic',
    'Users can delete their own pics',
    'DELETE',
    true,
    'auth.uid()::text = (storage.foldername(name))[1]',
    NULL
  );

-- 3. Add security monitoring and rate limiting tables
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id uuid,
  event_type text NOT NULL,
  event_details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow system/admin access to security logs
CREATE POLICY "Restrict access to security logs" 
ON public.security_audit_log 
FOR ALL 
USING (false);

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id uuid,
  ip_address inet,
  endpoint text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, ip_address, endpoint, window_start)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rate limit data
CREATE POLICY "Users can view their own rate limits" 
ON public.rate_limits 
FOR SELECT 
USING (auth.uid() = user_id);

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_event_details jsonb DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    event_type, 
    event_details,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    p_event_type,
    p_event_details,
    p_ip_address,
    p_user_agent
  );
END;
$function$;

-- Function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_endpoint text,
  p_ip_address inet,
  p_max_requests integer DEFAULT 100,
  p_window_minutes integer DEFAULT 60
)
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