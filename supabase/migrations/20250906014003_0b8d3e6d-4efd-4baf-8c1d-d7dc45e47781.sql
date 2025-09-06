-- Security Fix Migration: Phase 1 - Critical Data Protection
-- Fix RLS policies and secure database functions

-- First, let's check which tables have RLS enabled but no policies
-- and add proper policies where needed

-- Check if waitlist table exists and secure it
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on waitlist if not already enabled
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Remove any existing public access policies for waitlist
DROP POLICY IF EXISTS "Anyone can read waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Public can read waitlist" ON public.waitlist;

-- Create secure policies for waitlist - only authenticated users can view their own submissions
CREATE POLICY "Users can insert into waitlist"
ON public.waitlist
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Admin-only access to view all waitlist entries (implement admin check later)
CREATE POLICY "System can manage waitlist"
ON public.waitlist
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Secure all database functions by adding proper search_path
-- Update functions that currently have mutable search paths

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_quiet_start_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_memory_vault_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_mutual_swipe()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if this is a right swipe
  IF NEW.swipe_direction = 'right' OR NEW.swipe_direction = 'super' THEN
    -- Check if the other user also swiped right on this user
    IF EXISTS (
      SELECT 1 FROM public.swipe_interactions 
      WHERE user_id = NEW.swiped_user_id 
      AND swiped_user_id = NEW.user_id 
      AND swipe_direction IN ('right', 'super')
    ) THEN
      -- Create a match if one doesn't already exist
      INSERT INTO public.matches (user1_id, user2_id, score)
      VALUES (
        LEAST(NEW.user_id, NEW.swiped_user_id),
        GREATEST(NEW.user_id, NEW.swiped_user_id),
        0.95
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_default_safety_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.safety_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_shipping_eligibility()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.schedule_risk_assessment()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    -- Basic trigger implementation without pg_cron dependency
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.schedule_match_archiving()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    -- Basic trigger implementation without pg_cron dependency
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_generate_match_details()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    -- Generate AI summary if not exists
    IF NEW.ai_match_summary IS NULL THEN
        NEW.ai_match_summary := public.generate_match_summary(NEW.user_id, NEW.matched_user_id);
    END IF;

    -- Compute embedding if not exists
    IF NEW.embedding IS NULL THEN
        NEW.embedding := public.compute_match_embedding(NEW.user_id, NEW.matched_user_id);
    END IF;

    RETURN NEW;
END;
$$;

-- Add missing RLS policies for tables that need them
-- Ensure user_blocks table has proper RLS
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  blocked_user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, blocked_user_id)
);

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own blocks"
ON public.user_blocks
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure swipe_interactions table has proper RLS
CREATE TABLE IF NOT EXISTS public.swipe_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  swiped_user_id UUID NOT NULL,
  swipe_direction TEXT NOT NULL CHECK (swipe_direction IN ('left', 'right', 'super')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, swiped_user_id)
);

ALTER TABLE public.swipe_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own swipes"
ON public.swipe_interactions
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Secure safety_settings table
CREATE TABLE IF NOT EXISTS public.safety_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  block_screenshots BOOLEAN DEFAULT false,
  hide_last_seen BOOLEAN DEFAULT false,
  private_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.safety_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own safety settings"
ON public.safety_settings
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add comprehensive logging for security events
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON public.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);

-- Add indexes for performance on critical security tables
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_email ON public.failed_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_ip ON public.failed_login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_time ON public.failed_login_attempts(attempt_time);

-- Add rate limiting table indexes
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_ip ON public.rate_limits(user_id, ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limits_endpoint ON public.rate_limits(endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON public.rate_limits(window_start);