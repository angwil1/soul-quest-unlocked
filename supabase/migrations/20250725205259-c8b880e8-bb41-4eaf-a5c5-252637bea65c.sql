-- CRITICAL SECURITY FIXES

-- 1. Enable RLS on match_velocity_analytics table (currently unprotected!)
ALTER TABLE public.match_velocity_analytics ENABLE ROW LEVEL SECURITY;

-- Add policy to allow users to view only their own analytics
CREATE POLICY "Users can view their own match velocity analytics" 
ON public.match_velocity_analytics 
FOR SELECT 
USING (user_id = auth.uid());

-- Add policy to allow users to insert their own analytics
CREATE POLICY "Users can insert their own match velocity analytics" 
ON public.match_velocity_analytics 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Add policy to allow users to update their own analytics
CREATE POLICY "Users can update their own match velocity analytics" 
ON public.match_velocity_analytics 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 2. Fix insecure database functions by adding proper search_path
CREATE OR REPLACE FUNCTION public.generate_match_summary(p_user_id uuid, p_matched_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_user_profile JSONB;
    v_matched_user_profile JSONB;
    v_summary TEXT;
    v_is_premium BOOLEAN;
BEGIN
    -- Check if user is a premium member
    SELECT EXISTS (
        SELECT 1 
        FROM public.premium_memberships 
        WHERE 
            user_id = p_user_id AND 
            status = 'active' AND 
            expires_at > NOW()
    ) INTO v_is_premium;

    -- Raise exception if not a premium user
    IF NOT v_is_premium THEN
        RAISE EXCEPTION 'User is not a premium member';
    END IF;

    -- Fetch user profiles (assuming a profiles table exists)
    SELECT profile_data INTO v_user_profile 
    FROM public.user_profiles 
    WHERE user_id = p_user_id;

    SELECT profile_data INTO v_matched_user_profile 
    FROM public.user_profiles 
    WHERE user_id = p_matched_user_id;

    -- Generate a summary highlighting shared traits
    v_summary := FORMAT(
        'Exciting Match Alert! 🌟 You and %L share some fascinating connections. ',
        (SELECT name FROM public.user_profiles WHERE user_id = p_matched_user_id)
    );

    -- Add shared interests
    IF v_user_profile->'interests' && v_matched_user_profile->'interests' THEN
        v_summary := v_summary || FORMAT(
            'You both love %L, creating an instant connection. ',
            (
                SELECT string_agg(interest, ', ')
                FROM (
                    SELECT DISTINCT jsonb_array_elements_text(v_user_profile->'interests') AS interest
                    WHERE interest = ANY(
                        SELECT jsonb_array_elements_text(v_matched_user_profile->'interests')
                    )
                ) shared_interests
            )
        );
    END IF;

    -- Add professional alignment
    IF v_user_profile->>'industry' = v_matched_user_profile->>'industry' THEN
        v_summary := v_summary || FORMAT(
            'You''re both in the %L industry, suggesting aligned professional wavelengths. ',
            v_user_profile->>'industry'
        );
    END IF;

    -- Add location proximity if applicable
    IF v_user_profile->>'city' = v_matched_user_profile->>'city' THEN
        v_summary := v_summary || FORMAT(
            'Bonus: You''re both based in %L, making meetups a breeze! ',
            v_user_profile->>'city'
        );
    END IF;

    -- Final touch
    v_summary := v_summary || 'Dive deeper to explore your unique connection!';

    RETURN v_summary;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_top_picks(p_user_id uuid, p_max_picks integer DEFAULT 10)
RETURNS SETOF public.top_picks
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
    v_is_premium BOOLEAN;
BEGIN
    -- Verify premium status
    SELECT EXISTS (
        SELECT 1 
        FROM public.premium_memberships 
        WHERE 
            user_id = p_user_id AND 
            is_active = true AND 
            expires_at > NOW()
    ) INTO v_is_premium;

    IF NOT v_is_premium THEN
        RAISE EXCEPTION 'User is not a premium member';
    END IF;

    -- Clear existing picks older than 24 hours
    DELETE FROM public.top_picks 
    WHERE 
        user_id = p_user_id AND 
        first_shown_at < NOW() - INTERVAL '24 hours';

    -- Generate new top picks based on advanced matching algorithm
    RETURN QUERY 
    WITH potential_matches AS (
        SELECT 
            u.id AS candidate_user_id,
            -- Calculate priority score based on multiple factors
            (
                COALESCE(ms.similarity_score, 0) * 0.4 +
                COALESCE(profile_completeness(u.id), 0) * 0.3 +
                RANDOM() * 0.3
            ) AS priority_score,
            -- Compute visibility boost
            CASE 
                WHEN profile_completeness(u.id) > 0.8 THEN 1.5
                WHEN profile_completeness(u.id) > 0.6 THEN 1.2
                ELSE 1.0
            END AS visibility_boost
        FROM 
            auth.users u
        LEFT JOIN 
            public.match_summaries ms ON ms.matched_user_id = u.id
        WHERE 
            -- Exclude current user and existing matches
            u.id != p_user_id AND
            NOT EXISTS (
                SELECT 1 
                FROM public.premium_matches pm 
                WHERE 
                    (pm.user_id = p_user_id AND pm.matched_user_id = u.id) OR
                    (pm.matched_user_id = p_user_id AND pm.user_id = u.id)
            )
    )
    INSERT INTO public.top_picks (
        user_id, 
        candidate_user_id, 
        priority_score, 
        visibility_boost,
        first_shown_at,
        cooldown_until
    )
    SELECT 
        p_user_id,
        candidate_user_id,
        priority_score,
        visibility_boost,
        NOW(),
        NOW() + INTERVAL '24 hours'
    FROM 
        potential_matches
    ORDER BY 
        priority_score * visibility_boost DESC
    LIMIT p_max_picks
    RETURNING *;
END;
$function$;

-- 3. Strengthen authentication security
-- Update auth configuration for stronger password requirements
-- Note: This would typically be done via Supabase dashboard or API