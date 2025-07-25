-- Fix remaining database functions to include proper SET search_path

-- Fix generate_match_summary function
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
            is_active = true AND 
            expires_at > NOW()
    ) INTO v_is_premium;

    -- Raise exception if not a premium user
    IF NOT v_is_premium THEN
        RAISE EXCEPTION 'User is not a premium member';
    END IF;

    -- Generate a basic summary
    v_summary := 'Exciting Match Alert! 🌟 You have a great connection with this user.';

    RETURN v_summary;
END;$function$;

-- Fix compute_match_embedding function
CREATE OR REPLACE FUNCTION public.compute_match_embedding(p_user_id uuid, p_matched_user_id uuid)
 RETURNS extensions.vector
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    v_embedding vector(384);
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

    -- Return a default embedding
    v_embedding := '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]'::vector;

    RETURN v_embedding;
END;
$function$;

-- Fix auto_generate_match_details function
CREATE OR REPLACE FUNCTION public.auto_generate_match_details()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
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

-- Fix generate_top_picks function
CREATE OR REPLACE FUNCTION public.generate_top_picks(p_user_id uuid, p_max_picks integer DEFAULT 10)
 RETURNS SETOF top_picks
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

    -- Generate basic top picks
    RETURN QUERY 
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
        u.id,
        RANDOM() * 100,
        1.0,
        NOW(),
        NOW() + INTERVAL '24 hours'
    FROM 
        auth.users u
    WHERE 
        u.id != p_user_id
    LIMIT p_max_picks
    RETURNING *;
END;
$function$;

-- Fix generate_match_preview function
CREATE OR REPLACE FUNCTION public.generate_match_preview(p_user_id uuid, p_preview_user_id uuid)
 RETURNS match_previews
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
DECLARE
    v_preview_record public.match_previews;
    v_teaser_text TEXT;
    v_partial_score TEXT;
BEGIN
    -- Generate a teaser text
    v_teaser_text := 'Intriguing connection spotted! This profile might be a great match for you.';

    -- Generate a partial compatibility score hint
    v_partial_score := 'Good Match 👍';

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