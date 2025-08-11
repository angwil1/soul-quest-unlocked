-- First, let me check the current age_verifications table and fix any RLS issues
-- Make sure the age_verifications table has proper policies

-- Enable RLS if not already enabled
ALTER TABLE public.age_verifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to start fresh
DROP POLICY IF EXISTS "Users can manage their age verification" ON public.age_verifications;

-- Create comprehensive RLS policies for age_verifications
CREATE POLICY "Users can insert their own age verification" 
ON public.age_verifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own age verification" 
ON public.age_verifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own age verification" 
ON public.age_verifications 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a simple function to handle age verification
CREATE OR REPLACE FUNCTION public.verify_user_age(
  p_date_of_birth DATE
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Check if user is at least 18
  IF p_date_of_birth > (CURRENT_DATE - INTERVAL '18 years') THEN
    RAISE EXCEPTION 'User must be at least 18 years old';
  END IF;

  -- Insert or update age verification
  INSERT INTO public.age_verifications (
    user_id,
    date_of_birth,
    is_verified,
    verification_method,
    verified_at
  ) VALUES (
    auth.uid(),
    p_date_of_birth,
    TRUE,
    'self_reported',
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    date_of_birth = EXCLUDED.date_of_birth,
    is_verified = TRUE,
    verification_method = 'self_reported',
    verified_at = NOW();

  RETURN TRUE;
END;
$$;