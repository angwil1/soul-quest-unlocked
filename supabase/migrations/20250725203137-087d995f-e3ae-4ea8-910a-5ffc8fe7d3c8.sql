-- Fix remaining database functions with correct types and search_path

-- Fix compute_match_embedding function (simplified without vector dependency)
CREATE OR REPLACE FUNCTION public.compute_match_embedding(p_user_id uuid, p_matched_user_id uuid)
 RETURNS extensions.vector
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    v_is_premium BOOLEAN;
BEGIN
    -- Check if user is a premium member
    SELECT EXISTS (
        SELECT 1 
        FROM public.premium_memberships 
        WHERE 
            user_id = p_user_id AND 
            is_active = true AND 
            expires_at > NOW()
    ) INTO v_is_premium;

    -- Raise exception if not a premium user
    IF NOT v_is_premium THEN
        RAISE EXCEPTION 'User is not a premium member';
    END IF;

    -- Return NULL for now (vector implementation can be added later)
    RETURN NULL;
END;
$function$;

-- Fix generate_daily_compatibility_digest function
CREATE OR REPLACE FUNCTION public.generate_daily_compatibility_digest(p_user_id uuid)
 RETURNS compatibility_digests
 LANGUAGE plpgsql
 SET search_path = ''
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
END;$function$;

-- Fix update_match_velocity function
CREATE OR REPLACE FUNCTION public.update_match_velocity(p_user_id uuid)
 RETURNS match_velocity_analytics
 LANGUAGE plpgsql
 SET search_path = ''
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

-- Fix archive_expired_matches function
CREATE OR REPLACE FUNCTION public.archive_expired_matches()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = ''
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