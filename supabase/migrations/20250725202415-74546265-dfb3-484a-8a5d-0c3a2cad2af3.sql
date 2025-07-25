-- Fix critical database functions to include proper SET search_path

-- Fix generate_ai_match_wrapper function
CREATE OR REPLACE FUNCTION public.generate_ai_match_wrapper(user_id bigint)
 RETURNS TABLE(match_id bigint, user_id_1 bigint, user_id_2 bigint, score numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
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

-- Fix get_premium_matches function
CREATE OR REPLACE FUNCTION public.get_premium_matches(p_user_id uuid, p_min_compatibility double precision DEFAULT 0.7, p_sort_by text DEFAULT 'compatibility'::text, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0)
 RETURNS TABLE(matched_user_id uuid, compatibility_score double precision, interaction_boost double precision, match_timestamp timestamp with time zone, ai_match_summary text, embedding extensions.vector)
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

    -- Return filtered and sorted matches with AI summaries
    RETURN QUERY 
    SELECT 
        pm.matched_user_id,
        pm.compatibility_score,
        pm.interaction_boost,
        pm.match_timestamp,
        pm.ai_match_summary,
        pm.embedding
    FROM 
        public.premium_matches pm
    WHERE 
        pm.user_id = p_user_id AND
        pm.compatibility_score >= p_min_compatibility
    ORDER BY 
        CASE 
            WHEN p_sort_by = 'compatibility' THEN pm.compatibility_score
            WHEN p_sort_by = 'interaction_boost' THEN pm.interaction_boost
            WHEN p_sort_by = 'recency' THEN EXTRACT(EPOCH FROM pm.match_timestamp)
            ELSE pm.compatibility_score
        END DESC
    LIMIT p_limit OFFSET p_offset;
END;
$function$;

-- Fix generate_ai_match function
CREATE OR REPLACE FUNCTION public.generate_ai_match(user_id uuid)
 RETURNS TABLE(matched_user_id uuid, match_score double precision)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
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

-- Fix compute_interaction_risk function
CREATE OR REPLACE FUNCTION public.compute_interaction_risk(p_user_id uuid)
 RETURNS TABLE(computed_user_id uuid, swiping_anomaly_score double precision, block_report_score double precision, location_shift_score double precision, total_risk_score double precision, warning_level text, interaction_limit_multiplier double precision, debug_info jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    v_swiping_anomaly_score double precision := 0.2;
    v_block_report_score double precision := 0.2;
    v_location_shift_score double precision := 0.2;
    v_total_risk_score double precision;
    v_warning_level text;
    v_interaction_limit_multiplier double precision;
    
    -- Diagnostic variables
    v_match_interactions_count integer;
    v_user_interactions_count integer;
    v_user_locations_count integer;
    v_pass_interactions_count integer;
    v_block_report_interactions_count integer;
BEGIN
    -- Diagnostic: Count interactions
    SELECT COUNT(*) INTO v_match_interactions_count 
    FROM public.match_interactions 
    WHERE user_id = p_user_id;

    SELECT COUNT(*) INTO v_pass_interactions_count 
    FROM public.match_interactions 
    WHERE user_id = p_user_id AND match_type = 'pass';

    SELECT COUNT(*) INTO v_user_interactions_count 
    FROM public.user_interactions 
    WHERE user_id = p_user_id;

    SELECT COUNT(*) INTO v_block_report_interactions_count 
    FROM public.user_interactions 
    WHERE user_id = p_user_id AND interaction_type IN ('block', 'report');

    SELECT COUNT(DISTINCT location) INTO v_user_locations_count 
    FROM public.user_locations 
    WHERE user_locations.user_id = p_user_id;

    -- Compute total risk score
    v_total_risk_score := 
        COALESCE(v_swiping_anomaly_score, 0.2) * 0.3 + 
        COALESCE(v_block_report_score, 0.2) * 0.4 + 
        COALESCE(v_location_shift_score, 0.2) * 0.3;

    -- Determine warning level
    v_warning_level := 
        CASE 
            WHEN v_total_risk_score > 0.7 THEN 'high'
            WHEN v_total_risk_score > 0.4 THEN 'medium'
            ELSE 'normal'
        END;

    -- Compute interaction limit multiplier
    v_interaction_limit_multiplier := 
        CASE 
            WHEN v_warning_level = 'high' THEN 0.5
            WHEN v_warning_level = 'medium' THEN 0.8
            ELSE 1.0
        END;

    -- Upsert risk profile
    INSERT INTO public.interaction_risk_profiles (
        user_id, 
        swiping_anomaly_score, 
        block_report_score, 
        location_shift_score, 
        total_risk_score, 
        warning_level, 
        interaction_limit_multiplier,
        last_risk_update,
        next_risk_assessment
    ) VALUES (
        p_user_id,
        v_swiping_anomaly_score,
        v_block_report_score,
        v_location_shift_score,
        v_total_risk_score,
        v_warning_level,
        v_interaction_limit_multiplier,
        NOW(),
        NOW() + INTERVAL '24 hours'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        swiping_anomaly_score = EXCLUDED.swiping_anomaly_score,
        block_report_score = EXCLUDED.block_report_score,
        location_shift_score = EXCLUDED.location_shift_score,
        total_risk_score = EXCLUDED.total_risk_score,
        warning_level = EXCLUDED.warning_level,
        interaction_limit_multiplier = EXCLUDED.interaction_limit_multiplier,
        last_risk_update = NOW(),
        next_risk_assessment = NOW() + INTERVAL '24 hours';

    -- Return the computed risk profile with debug information
    RETURN QUERY 
    SELECT 
        p_user_id AS computed_user_id,
        v_swiping_anomaly_score,
        v_block_report_score,
        v_location_shift_score,
        v_total_risk_score,
        v_warning_level,
        v_interaction_limit_multiplier,
        jsonb_build_object(
            'match_interactions_count', v_match_interactions_count,
            'pass_interactions_count', v_pass_interactions_count,
            'user_interactions_count', v_user_interactions_count,
            'block_report_interactions_count', v_block_report_interactions_count,
            'user_locations_count', v_user_locations_count
        ) AS debug_info;
END;
$function$;