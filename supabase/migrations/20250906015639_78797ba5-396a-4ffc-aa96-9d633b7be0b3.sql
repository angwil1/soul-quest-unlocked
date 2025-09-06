-- Security fix migration: Fix remaining database function vulnerabilities and secure public data

-- Fix remaining functions with mutable search_path (security critical)
CREATE OR REPLACE FUNCTION public.update_quiet_start_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_memory_vault_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_mutual_swipe()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.schedule_match_archiving()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    -- Basic trigger implementation without pg_cron dependency
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.schedule_risk_assessment()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    -- Basic trigger implementation without pg_cron dependency
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_generate_match_details()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.archive_expired_matches()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    -- Archive matches that have been inactive for too long
    WITH matches_to_archive AS (
        SELECT 
            pm.id AS original_match_id,
            pm.user_id,
            pm.matched_user_id,
            pm.match_timestamp AS matched_at,
            pm.compatibility_score,
            'expired' AS interaction_status,
            NULL AS last_interaction_at
        FROM 
            public.premium_matches pm
        WHERE 
            -- Matches older than 90 days
            pm.match_timestamp < NOW() - INTERVAL '90 days'
    )
    -- Insert into archive
    INSERT INTO public.ai_matches_archive (
        original_match_id,
        user_id,
        matched_user_id,
        matched_at,
        compatibility_score,
        interaction_status,
        last_interaction_at,
        archive_reason
    )
    SELECT 
        original_match_id,
        user_id,
        matched_user_id,
        matched_at,
        compatibility_score,
        interaction_status,
        last_interaction_at,
        'match_age_expiry' AS archive_reason
    FROM 
        matches_to_archive;

    -- Remove archived matches from active matches
    DELETE FROM public.premium_matches pm
    WHERE EXISTS (
        SELECT 1 
        FROM public.ai_matches_archive ama
        WHERE 
            ama.original_match_id = pm.id
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_daily_compatibility_digest(p_user_id uuid)
 RETURNS compatibility_digests
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
    v_digest_record public.compatibility_digests;
    v_new_profiles JSONB;
    v_score_deltas JSONB;
    v_conversation_starters JSONB;
BEGIN
    -- Generate basic new profiles data
    v_new_profiles := '[]'::jsonb;
    v_score_deltas := '[]'::jsonb;
    v_conversation_starters := '[]'::jsonb;

    -- Insert or update digest
    INSERT INTO public.compatibility_digests (
        user_id,
        new_compatible_profiles,
        profile_score_deltas,
        ai_conversation_starters
    ) VALUES (
        p_user_id,
        v_new_profiles,
        v_score_deltas,
        v_conversation_starters
    )
    ON CONFLICT (user_id, digest_date) 
    DO UPDATE SET 
        new_compatible_profiles = EXCLUDED.new_compatible_profiles,
        profile_score_deltas = EXCLUDED.profile_score_deltas,
        ai_conversation_starters = EXCLUDED.ai_conversation_starters,
        generated_at = NOW()
    RETURNING * INTO v_digest_record;

    RETURN v_digest_record;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_match_velocity(p_user_id uuid)
 RETURNS match_velocity_analytics
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
    v_analytics public.match_velocity_analytics;
BEGIN
    -- Compute basic match velocity metrics
    INSERT INTO public.match_velocity_analytics (
        user_id,
        total_matches,
        responded_matches,
        reply_rate,
        avg_response_time,
        fastest_response,
        slowest_response,
        engagement_momentum,
        interaction_quality_score
    )
    VALUES (
        p_user_id,
        0,
        0,
        0,
        '00:00:00'::interval,
        NULL,
        NULL,
        0,
        0
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        last_updated_at = NOW()
    RETURNING * INTO v_analytics;

    RETURN v_analytics;
END;
$function$;

CREATE OR REPLACE FUNCTION public.example_function(param1 text, param2 integer)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    RETURN param1 || param2::TEXT;
END;
$function$;

-- Secure public tables by requiring authentication
-- Remove public access to questions table
DROP POLICY IF EXISTS "Anyone can read questions" ON public.questions;

-- Create authenticated user policy for questions (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'questions' AND table_schema = 'public') THEN
        CREATE POLICY "Authenticated users can read questions" 
        ON public.questions 
        FOR SELECT 
        USING (auth.uid() IS NOT NULL);
    END IF;
END $$;

-- Remove public access to faqs table  
DROP POLICY IF EXISTS "Anyone can read FAQs" ON public.faqs;

-- Create authenticated user policy for faqs
CREATE POLICY "Authenticated users can read FAQs" 
ON public.faqs 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Log this security improvement
INSERT INTO public.security_events (
    event_type,
    event_data,
    user_id
) VALUES (
    'security_hardening_applied',
    jsonb_build_object(
        'fixes_applied', ARRAY[
            'function_search_path_secured',
            'public_data_access_restricted',
            'authentication_required_for_sensitive_data'
        ],
        'timestamp', NOW()
    ),
    NULL
);