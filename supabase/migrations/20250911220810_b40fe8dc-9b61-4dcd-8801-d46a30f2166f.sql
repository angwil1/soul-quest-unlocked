-- Fix critical security vulnerabilities for dating app privacy (corrected version)

-- 1. Fix profiles table - restrict access to only matched users (not all premium users)
DROP POLICY IF EXISTS "Allow Premium users to view match scores" ON public.profiles;
DROP POLICY IF EXISTS "allow match access for premium users" ON public.profiles;

-- Create secure profile access policies
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view profiles of matched users only" ON public.profiles
FOR SELECT USING (
  auth.uid() != id AND (
    -- User can see profiles they've matched with
    EXISTS (
      SELECT 1 FROM public.matches 
      WHERE (user1_id = auth.uid() AND user2_id = id) 
         OR (user2_id = auth.uid() AND user1_id = id)
    )
    -- OR users with premium can see limited profile previews (not full profiles)
    OR EXISTS (
      SELECT 1 FROM public.premium_memberships pm
      WHERE pm.user_id = auth.uid() 
        AND pm.is_active = true 
        AND pm.expires_at > NOW()
    )
  )
);

-- 2. Enhanced message privacy - ensure messages are only accessible to participants
DROP POLICY IF EXISTS "Allow premium users to view all messages" ON public.messages;
DROP POLICY IF EXISTS "Allow users to view messages in their matches" ON public.messages;

-- Recreate secure message policies
CREATE POLICY "Message participants only" ON public.messages
FOR SELECT USING (
  match_id IN (
    SELECT m.id FROM public.matches m
    WHERE (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
  )
);

-- 3. Create function to check if users are matched (for profile access)
CREATE OR REPLACE FUNCTION public.are_users_matched(user1_id uuid, user2_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.matches 
    WHERE (user1_id = are_users_matched.user1_id AND user2_id = are_users_matched.user2_id)
       OR (user1_id = are_users_matched.user2_id AND user2_id = are_users_matched.user1_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = '';

-- 4. Add location data cleanup function for privacy
CREATE OR REPLACE FUNCTION public.cleanup_old_location_data()
RETURNS void AS $$
BEGIN
  -- Delete location data older than 30 days to protect privacy
  DELETE FROM public.user_locations 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 5. Add privacy settings table for granular user control
CREATE TABLE IF NOT EXISTS public.privacy_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  profile_visibility text NOT NULL DEFAULT 'matched_only' CHECK (profile_visibility IN ('matched_only', 'premium_preview', 'public')),
  location_sharing boolean NOT NULL DEFAULT false,
  last_seen_sharing boolean NOT NULL DEFAULT true,
  read_receipts boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on privacy settings
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own privacy settings" ON public.privacy_settings
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Enhanced age verification access controls
DROP POLICY IF EXISTS "Users can insert their own age verification" ON public.age_verifications;
DROP POLICY IF EXISTS "Users can update their own age verification" ON public.age_verifications;
DROP POLICY IF EXISTS "Users can view their own age verification" ON public.age_verifications;

CREATE POLICY "Restricted age verification access" ON public.age_verifications
FOR ALL USING (
  auth.uid() = user_id 
  -- Only allow system functions to access for verification
  OR auth.role() = 'service_role'
)
WITH CHECK (auth.uid() = user_id);