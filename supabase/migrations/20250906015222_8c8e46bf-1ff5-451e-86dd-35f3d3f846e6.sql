-- Final fix for remaining database function security issues
-- This addresses all remaining "Function Search Path Mutable" security warnings

-- Update remaining functions with secure search_path settings
CREATE OR REPLACE FUNCTION public.generate_ai_match()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  RETURN gen_random_uuid();
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_user_adult(user_birth_date date)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  SELECT user_birth_date <= (CURRENT_DATE - INTERVAL '18 years');
$function$;

CREATE OR REPLACE FUNCTION public.compute_match_embedding(p_user_id uuid, p_matched_user_id uuid)
 RETURNS extensions.vector
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
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

CREATE OR REPLACE FUNCTION public.secure_generate_ai_match_deprecated()
 RETURNS TABLE(id bigint, user_id uuid, match_score numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY SELECT
    1::bigint AS id,
    auth.uid() AS user_id,
    0.5::numeric AS match_score
  WHERE FALSE; -- Returns empty result
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_shipping_eligibility(p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    v_signup_record RECORD;
    v_user_created_at TIMESTAMP WITH TIME ZONE;
    v_eligible_date TIMESTAMP WITH TIME ZONE;
    v_days_remaining INTEGER;
BEGIN
    -- Get signup record
    SELECT * INTO v_signup_record
    FROM public.quiet_start_signups
    WHERE user_id = p_user_id AND benefits_claimed = true;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'eligible', false,
            'reason', 'no_signup_found'
        );
    END IF;
    
    -- Get user account creation date
    SELECT created_at INTO v_user_created_at
    FROM auth.users
    WHERE id = p_user_id;
    
    -- Calculate eligibility date (3 months from account creation)
    v_eligible_date := v_user_created_at + INTERVAL '3 months';
    
    -- Check if eligible now
    IF NOW() >= v_eligible_date THEN
        -- Update status if not already updated
        UPDATE public.quiet_start_signups
        SET shipping_status = 'eligible'
        WHERE user_id = p_user_id AND shipping_status = 'pending';
        
        RETURN jsonb_build_object(
            'eligible', true,
            'shipping_status', COALESCE(v_signup_record.shipping_status, 'eligible'),
            'eligible_since', v_eligible_date
        );
    ELSE
        -- Calculate days remaining
        v_days_remaining := EXTRACT(DAY FROM v_eligible_date - NOW());
        
        RETURN jsonb_build_object(
            'eligible', false,
            'shipping_status', v_signup_record.shipping_status,
            'eligible_date', v_eligible_date,
            'days_remaining', v_days_remaining,
            'reason', 'account_too_new'
        );
    END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.mark_kit_shipped(p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    UPDATE public.quiet_start_signups
    SET 
        shipping_status = 'shipped',
        updated_at = NOW()
    WHERE 
        user_id = p_user_id 
        AND benefits_claimed = true 
        AND shipping_status = 'eligible';
    
    RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.can_send_message(p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    v_is_premium BOOLEAN;
    v_message_count INTEGER;
    v_daily_limit INTEGER := 5;
BEGIN
    -- Check if user is premium (unlimited messages)
    SELECT EXISTS (
        SELECT 1 
        FROM public.subscribers 
        WHERE 
            user_id = p_user_id AND 
            subscribed = true AND 
            (subscription_end IS NULL OR subscription_end > NOW())
    ) INTO v_is_premium;
    
    -- Premium users have unlimited messages
    IF v_is_premium THEN
        RETURN true;
    END IF;
    
    -- Check daily message count for free users
    SELECT COALESCE(message_count, 0) INTO v_message_count
    FROM public.daily_message_limits
    WHERE user_id = p_user_id AND message_date = CURRENT_DATE;
    
    -- Return true if under the limit
    RETURN COALESCE(v_message_count, 0) < v_daily_limit;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_premium_matches(p_user_id uuid, p_min_compatibility double precision DEFAULT 0.7, p_sort_by text DEFAULT 'compatibility'::text, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0)
 RETURNS TABLE(matched_user_id uuid, compatibility_score double precision, interaction_boost double precision, match_timestamp timestamp with time zone, ai_match_summary text, embedding extensions.vector)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
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

CREATE OR REPLACE FUNCTION public.check_whisper_window_constraints(chat_id_param uuid, sender_id_param uuid, message_text_param text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  chat_settings RECORD;
  last_message_time TIMESTAMP WITH TIME ZONE;
  char_count INTEGER;
  hours_since_last INTEGER;
  result jsonb;
BEGIN
  -- Get chat settings
  SELECT character_limit, message_pace_hours, tone_guidance_enabled
  INTO chat_settings
  FROM public.echo_limited_chats
  WHERE id = chat_id_param;
  
  -- Check character limit
  char_count := LENGTH(message_text_param);
  IF char_count > chat_settings.character_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'character_limit_exceeded',
      'limit', chat_settings.character_limit,
      'current', char_count,
      'guidance', CASE WHEN chat_settings.tone_guidance_enabled 
                      THEN 'Keep it gentle and concise—let each word carry weight in this whisper space.'
                      ELSE null END
    );
  END IF;
  
  -- Check pace limit
  SELECT created_at INTO last_message_time
  FROM public.echo_limited_messages
  WHERE chat_id = chat_id_param AND sender_id = sender_id_param
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF last_message_time IS NOT NULL THEN
    hours_since_last := EXTRACT(EPOCH FROM (now() - last_message_time)) / 3600;
    IF hours_since_last < chat_settings.message_pace_hours THEN
      RETURN jsonb_build_object(
        'allowed', false,
        'reason', 'pace_limit',
        'hours_to_wait', (chat_settings.message_pace_hours - hours_since_last),
        'guidance', CASE WHEN chat_settings.tone_guidance_enabled 
                        THEN 'The echo needs time to resonate. Your words will carry more meaning with gentle pacing.'
                        ELSE null END
      );
    END IF;
  END IF;
  
  -- Update connection completion availability
  UPDATE public.echo_limited_chats
  SET can_complete_connection = (created_at <= now() - interval '7 days')
  WHERE id = chat_id_param;
  
  RETURN jsonb_build_object(
    'allowed', true,
    'character_count', char_count,
    'guidance', CASE WHEN chat_settings.tone_guidance_enabled 
                    THEN 'Your words flow beautifully in this whisper space.'
                    ELSE null END
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_user_input(input_text text, max_length integer DEFAULT 1000)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    -- Check for null or empty input
    IF input_text IS NULL OR trim(input_text) = '' THEN
        RETURN false;
    END IF;
    
    -- Check length
    IF length(input_text) > max_length THEN
        RETURN false;
    END IF;
    
    -- Check for malicious patterns (basic XSS protection)
    IF input_text ~* '<script|javascript:|data:|vbscript:|onload|onerror|onclick' THEN
        RETURN false;
    END IF;
    
    -- Check for SQL injection patterns
    IF input_text ~* '(union|select|insert|update|delete|drop|alter|create|exec|execute)(\s|\(|;)' THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_shipping_eligibility()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;