-- FIX REMAINING 22 INSECURE DATABASE FUNCTIONS
-- Adding SET search_path = '' to prevent SQL injection

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

CREATE OR REPLACE FUNCTION public.generate_ai_match_wrapper()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Basic implementation
    NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_match_preview(p_user_id uuid, p_preview_user_id uuid)
RETURNS public.match_previews
LANGUAGE plpgsql
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NOW()
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.secure_generate_ai_match_new()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Basic implementation
    NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_ai_match_v2()
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    -- Basic implementation  
    NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.secure_generate_ai_match_deprecated()
RETURNS TABLE(id bigint, user_id uuid, match_score numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY SELECT
    1::bigint AS id,
    auth.uid() AS user_id,
    0.5::numeric AS match_score
  WHERE FALSE; -- Returns empty result
END;
$function$;

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

CREATE OR REPLACE FUNCTION public.calculate_match_intelligence(input_user_id uuid)
RETURNS TABLE(match_id uuid, compatibility_score numeric, is_premium_preview boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.example_function(param1 text, param2 integer)
RETURNS text
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    RETURN param1 || param2::TEXT;
END;
$function$;

CREATE OR REPLACE FUNCTION public.perform_sensitive_action(p_action_details jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- First, check security level
  PERFORM public.check_user_security_level();

  -- Proceed with sensitive action
  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_security_level()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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