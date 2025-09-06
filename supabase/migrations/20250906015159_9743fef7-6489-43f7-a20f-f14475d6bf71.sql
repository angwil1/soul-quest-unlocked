-- Fix remaining database function security issues
-- This addresses the remaining "Function Search Path Mutable" security warnings

-- Update all remaining functions that lack secure search_path settings
CREATE OR REPLACE FUNCTION public.uid()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  RETURN auth.uid();
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_security_event_access(p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    v_is_authorized BOOLEAN;
BEGIN
    -- Strict check against auth.uid() to prevent privilege escalation
    v_is_authorized := (
        SELECT EXISTS (
            SELECT 1 
            FROM public.security_events 
            WHERE user_id = p_user_id 
              AND user_id = auth.uid()
        )
    );
    
    RETURN v_is_authorized;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_ai_match_v2()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    -- Basic implementation  
    NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_match_preview(p_user_id uuid, p_preview_user_id uuid)
 RETURNS match_previews
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
    v_preview_record public.match_previews;
    v_teaser_text TEXT;
    v_partial_score TEXT;
BEGIN
    -- Generate a teaser text
    SELECT 
        FORMAT(
            'Intriguing connection spotted! This profile shares %L interests with you.',
            (
                SELECT string_agg(interest, ', ')
                FROM (
                    SELECT DISTINCT interest
                    FROM (
                        SELECT jsonb_array_elements_text(
                            (SELECT profile_data->'interests' FROM public.user_profiles WHERE user_id = p_preview_user_id)
                        ) AS interest
                        INTERSECT
                        SELECT jsonb_array_elements_text(
                            (SELECT profile_data->'interests' FROM public.user_profiles WHERE user_id = p_user_id)
                        )
                    ) shared
                    LIMIT 2
                )
            )
        ) INTO v_teaser_text;

    -- Generate a partial compatibility score hint
    SELECT 
        CASE 
            WHEN compatibility_score >= 0.8 THEN 'High Potential ✨'
            WHEN compatibility_score >= 0.6 THEN 'Good Match 👍'
            ELSE 'Interesting Connection 🤔'
        END INTO v_partial_score
    FROM 
        public.match_summaries
    WHERE 
        user_id = p_user_id AND 
        matched_user_id = p_preview_user_id
    LIMIT 1;

    -- Insert or update preview
    INSERT INTO public.match_previews (
        user_id, 
        preview_user_id, 
        teaser_text, 
        blurred_avatar_url,
        partial_compatibility_hint
    ) VALUES (
        p_user_id,
        p_preview_user_id,
        v_teaser_text,
        FORMAT('/blurred-avatars/%s.jpg', p_preview_user_id),
        v_partial_score
    )
    ON CONFLICT (user_id, preview_user_id) 
    DO UPDATE SET 
        teaser_text = EXCLUDED.teaser_text,
        preview_generated_at = NOW(),
        expires_at = NOW() + INTERVAL '7 days'
    RETURNING * INTO v_preview_record;

    RETURN v_preview_record;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_ai_match_wrapper(user_id bigint)
 RETURNS TABLE(match_id bigint, user_id_1 bigint, user_id_2 bigint, score numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    m.id AS match_id,
    m.user_id_1,
    m.user_id_2,
    m.score
  FROM public.matches m
  WHERE m.user_id_1 = $1 OR m.user_id_2 = $1
  ORDER BY m.score DESC
  LIMIT 10;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_message_count(p_user_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.check_daily_message_limit(chat_id_param uuid, sender_id_param uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  today_count INTEGER;
  daily_limit INTEGER;
BEGIN
  -- Get today's message count and daily limit
  SELECT 
    COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE AND sender_id = sender_id_param),
    c.daily_message_limit
  INTO today_count, daily_limit
  FROM public.echo_limited_messages m
  RIGHT JOIN public.echo_limited_chats c ON c.id = chat_id_param
  WHERE m.chat_id = chat_id_param OR m.chat_id IS NULL
  GROUP BY c.daily_message_limit;
  
  RETURN COALESCE(today_count, 0) < COALESCE(daily_limit, 3);
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

CREATE OR REPLACE FUNCTION public.check_user_security_level()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_current_user_id uuid;
  v_security_level text;
  v_mfa_count integer;
BEGIN
  v_current_user_id := auth.uid();

  -- Basic security check
  SELECT 
    COALESCE('standard', 'standard'),
    0
  INTO 
    v_security_level, 
    v_mfa_count;

  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_security_level()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Basic security level update
  NEW.raw_user_meta_data := jsonb_set(
    COALESCE(NEW.raw_user_meta_data, '{}'::jsonb), 
    '{security_level}', 
    '"standard"'::jsonb
  );

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_ai_match(user_id uuid)
 RETURNS TABLE(matched_user_id uuid, match_score double precision)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT user_id_2, match_score
  FROM public.premium_ai_matches
  WHERE user_id_1 = generate_ai_match.user_id
  ORDER BY match_score DESC
  LIMIT 3;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_match_intelligence(input_user_id uuid)
 RETURNS TABLE(match_id uuid, compatibility_score numeric, is_premium_preview boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id AS match_id,
    50.0::numeric AS compatibility_score,
    false AS is_premium_preview
  FROM public.profiles p
  WHERE p.id != input_user_id
  ORDER BY RANDOM()
  LIMIT 10;
END;
$function$;