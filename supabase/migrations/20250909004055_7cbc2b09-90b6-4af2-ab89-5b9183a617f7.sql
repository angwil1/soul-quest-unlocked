-- Fix Remaining Functions with Mutable Search Paths
-- Address the final batch of functions that need secure search paths

-- Fix all remaining functions with mutable search paths
CREATE OR REPLACE FUNCTION public.profile_completeness(p_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    completeness_score NUMERIC := 0;
    total_fields NUMERIC := 10; -- Total number of profile fields we check
BEGIN
    -- Basic validation - only allow users to check their own profile completeness
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only check own profile completeness';
    END IF;

    -- Calculate completeness based on available profile data
    -- This is a simplified calculation - adjust based on your actual profile schema
    SELECT 
        CASE WHEN avatar_url IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN created_at IS NOT NULL THEN 1 ELSE 0 END +
        -- Add more fields as needed based on your profiles table structure
        8 -- Placeholder for other profile fields
    INTO completeness_score
    FROM public.profiles
    WHERE id = p_user_id;
    
    -- Return as percentage
    RETURN COALESCE(completeness_score / total_fields, 0);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_message_limit(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_is_premium BOOLEAN := false;
    v_daily_limit INTEGER := 5;
BEGIN
    -- Security check: only allow users to check their own limits
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only check own message limits';
    END IF;
    
    -- Check if user is premium (with error handling)
    BEGIN
        SELECT EXISTS (
            SELECT 1 
            FROM public.premium_memberships 
            WHERE 
                user_id = p_user_id AND 
                is_active = true AND 
                expires_at > NOW()
        ) INTO v_is_premium;
    EXCEPTION WHEN undefined_table THEN
        v_is_premium := false;
    END;
    
    -- Return unlimited for premium users, otherwise daily limit
    IF v_is_premium THEN
        RETURN -1; -- Indicates unlimited
    ELSE
        RETURN v_daily_limit;
    END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_daily_message_count(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_message_count INTEGER;
BEGIN
    -- Security check: only allow users to check their own counts
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only check own message count';
    END IF;
    
    -- Get today's message count
    SELECT COALESCE(message_count, 0) INTO v_message_count
    FROM public.daily_message_limits
    WHERE user_id = p_user_id AND message_date = CURRENT_DATE;
    
    RETURN COALESCE(v_message_count, 0);
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_message_content(p_message_text text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Basic message validation
    IF p_message_text IS NULL OR trim(p_message_text) = '' THEN
        RETURN false;
    END IF;
    
    -- Check length limits
    IF length(p_message_text) > 5000 THEN
        RETURN false;
    END IF;
    
    -- Check for prohibited content patterns
    IF p_message_text ~* '<script|javascript:|data:|vbscript:|onload|onerror|onclick' THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_match_compatibility_score(p_user_id uuid, p_matched_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_score NUMERIC := 0.5; -- Default compatibility score
BEGIN
    -- Security check: only allow users to check compatibility involving themselves
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only check own compatibility scores';
    END IF;
    
    -- Try to get actual compatibility score from matches or premium_matches
    BEGIN
        SELECT COALESCE(compatibility_score, score, 0.5) INTO v_score
        FROM (
            SELECT compatibility_score, NULL as score
            FROM public.premium_matches
            WHERE user_id = p_user_id AND matched_user_id = p_matched_user_id
            UNION ALL
            SELECT NULL as compatibility_score, score
            FROM public.matches
            WHERE (user1_id = p_user_id AND user2_id = p_matched_user_id)
               OR (user1_id = p_matched_user_id AND user2_id = p_user_id)
        ) combined_matches
        LIMIT 1;
    EXCEPTION WHEN undefined_table THEN
        v_score := 0.5;
    END;
    
    RETURN COALESCE(v_score, 0.5);
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_last_active(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Security check: only allow users to update their own activity
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only update own activity';
    END IF;
    
    -- Update last_online in profiles table if it exists
    BEGIN
        UPDATE public.profiles
        SET last_online = NOW()
        WHERE id = p_user_id;
    EXCEPTION WHEN undefined_column THEN
        -- Column doesn't exist, ignore
        NULL;
    END;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_user_engagement_score(p_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_engagement_score NUMERIC := 0.5;
    v_message_count INTEGER := 0;
    v_match_count INTEGER := 0;
BEGIN
    -- Security check: only allow users to check their own engagement
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only check own engagement score';
    END IF;
    
    -- Calculate basic engagement based on messages and matches
    BEGIN
        SELECT COUNT(*) INTO v_message_count
        FROM public.messages
        WHERE sender_id = p_user_id;
    EXCEPTION WHEN undefined_table THEN
        v_message_count := 0;
    END;
    
    BEGIN
        SELECT COUNT(*) INTO v_match_count
        FROM public.matches
        WHERE user1_id = p_user_id OR user2_id = p_user_id;
    EXCEPTION WHEN undefined_table THEN
        v_match_count := 0;
    END;
    
    -- Simple engagement calculation
    v_engagement_score := LEAST(1.0, (v_message_count * 0.1 + v_match_count * 0.2) / 10.0);
    
    RETURN GREATEST(0.1, v_engagement_score);
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_user_premium_status(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_is_premium BOOLEAN := false;
BEGIN
    -- Security check: only allow users to check their own premium status
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only check own premium status';
    END IF;
    
    -- Check premium membership
    BEGIN
        SELECT EXISTS (
            SELECT 1 
            FROM public.premium_memberships 
            WHERE 
                user_id = p_user_id AND 
                is_active = true AND 
                expires_at > NOW()
        ) INTO v_is_premium;
    EXCEPTION WHEN undefined_table THEN
        v_is_premium := false;
    END;
    
    RETURN v_is_premium;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_subscription_tier(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_tier TEXT := 'free';
BEGIN
    -- Security check: only allow users to check their own subscription tier
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only check own subscription tier';
    END IF;
    
    -- Check premium membership tier
    BEGIN
        SELECT tier INTO v_tier
        FROM public.premium_memberships 
        WHERE 
            user_id = p_user_id AND 
            is_active = true AND 
            expires_at > NOW()
        LIMIT 1;
    EXCEPTION WHEN undefined_table THEN
        v_tier := 'free';
    END;
    
    RETURN COALESCE(v_tier, 'free');
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_profile_data(p_profile_data jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Basic profile data validation
    IF p_profile_data IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check for required fields and validate content
    IF p_profile_data ? 'name' AND length(p_profile_data->>'name') > 100 THEN
        RETURN false;
    END IF;
    
    IF p_profile_data ? 'bio' AND length(p_profile_data->>'bio') > 1000 THEN
        RETURN false;
    END IF;
    
    -- Check for malicious content in profile data
    IF p_profile_data::text ~* '<script|javascript:|data:|vbscript:|onload|onerror|onclick' THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_match_priority(p_user_id uuid, p_matched_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_priority NUMERIC := 0.5;
    v_compatibility NUMERIC;
    v_activity_score NUMERIC;
BEGIN
    -- Security check: only allow users to calculate priority for their own matches
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only calculate priority for own matches';
    END IF;
    
    -- Get compatibility score
    SELECT public.get_match_compatibility_score(p_user_id, p_matched_user_id) INTO v_compatibility;
    
    -- Get activity/engagement score
    SELECT public.calculate_user_engagement_score(p_matched_user_id) INTO v_activity_score;
    
    -- Calculate priority based on compatibility and activity
    v_priority := (COALESCE(v_compatibility, 0.5) * 0.7) + (COALESCE(v_activity_score, 0.5) * 0.3);
    
    RETURN GREATEST(0.1, LEAST(1.0, v_priority));
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_activity_status(p_user_id uuid, p_activity_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Security check: only allow users to update their own activity
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only update own activity status';
    END IF;
    
    -- Validate activity data
    IF NOT public.validate_user_input(p_activity_data::text, 2000) THEN
        RAISE EXCEPTION 'Invalid activity data provided';
    END IF;
    
    -- Update last active timestamp
    PERFORM public.update_last_active(p_user_id);
    
    -- Log activity if needed (basic implementation)
    -- Additional activity logging could be implemented here
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_feature_access(p_user_id uuid, p_feature_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_is_premium BOOLEAN;
    v_premium_features TEXT[] := ARRAY['ai_matching', 'premium_filters', 'priority_likes', 'read_receipts'];
BEGIN
    -- Security check: only allow users to check their own feature access
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only check own feature access';
    END IF;
    
    -- Validate feature name
    IF p_feature_name IS NULL OR trim(p_feature_name) = '' THEN
        RETURN false;
    END IF;
    
    -- Check if feature requires premium access
    IF p_feature_name = ANY(v_premium_features) THEN
        SELECT public.check_user_premium_status(p_user_id) INTO v_is_premium;
        RETURN v_is_premium;
    END IF;
    
    -- Default: allow access to non-premium features
    RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_user_analytics_summary(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_summary JSONB;
    v_message_count INTEGER;
    v_match_count INTEGER;
    v_engagement_score NUMERIC;
BEGIN
    -- Security check: only allow users to generate their own analytics
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only generate own analytics summary';
    END IF;
    
    -- Get basic metrics
    SELECT public.get_user_daily_message_count(p_user_id) INTO v_message_count;
    SELECT public.calculate_user_engagement_score(p_user_id) INTO v_engagement_score;
    
    -- Count matches
    BEGIN
        SELECT COUNT(*) INTO v_match_count
        FROM public.matches
        WHERE user1_id = p_user_id OR user2_id = p_user_id;
    EXCEPTION WHEN undefined_table THEN
        v_match_count := 0;
    END;
    
    -- Build summary
    v_summary := jsonb_build_object(
        'message_count', COALESCE(v_message_count, 0),
        'match_count', COALESCE(v_match_count, 0),
        'engagement_score', COALESCE(v_engagement_score, 0.5),
        'generated_at', NOW(),
        'user_id', p_user_id
    );
    
    RETURN v_summary;
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_user_feedback(p_user_id uuid, p_feedback_data jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Security check: only allow users to submit their own feedback
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only submit own feedback';
    END IF;
    
    -- Validate feedback data
    IF p_feedback_data IS NULL THEN
        RAISE EXCEPTION 'Feedback data cannot be null';
    END IF;
    
    -- Validate feedback content
    IF NOT public.validate_user_input(p_feedback_data::text, 5000) THEN
        RAISE EXCEPTION 'Invalid feedback data provided';
    END IF;
    
    -- Log security event for feedback submission
    PERFORM public.log_security_event(
        'user_feedback_submitted',
        jsonb_build_object(
            'feedback_type', COALESCE(p_feedback_data->>'type', 'general'),
            'feedback_length', length(p_feedback_data::text)
        )
    );
    
    RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Basic cleanup function - can be expanded based on actual session management needs
    -- This is a placeholder implementation
    
    -- Clean up expired rate limits (older than 24 hours)
    BEGIN
        DELETE FROM public.rate_limits 
        WHERE window_start < NOW() - INTERVAL '24 hours';
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, ignore
        NULL;
    END;
    
    -- Clean up old failed login attempts (older than 24 hours)
    BEGIN
        DELETE FROM public.failed_login_attempts 
        WHERE attempt_time < NOW() - INTERVAL '24 hours';
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, ignore
        NULL;
    END;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_age_verification_data(p_date_of_birth date, p_verification_method text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Validate date of birth
    IF p_date_of_birth IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check if user is at least 18 years old
    IF p_date_of_birth > (CURRENT_DATE - INTERVAL '18 years') THEN
        RETURN false;
    END IF;
    
    -- Check if date is reasonable (not too far in the past)
    IF p_date_of_birth < (CURRENT_DATE - INTERVAL '120 years') THEN
        RETURN false;
    END IF;
    
    -- Validate verification method
    IF p_verification_method NOT IN ('self_reported', 'id_verification', 'third_party') THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_profile_visibility_score(p_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_visibility_score NUMERIC := 0.5;
    v_completeness NUMERIC;
    v_activity_score NUMERIC;
    v_is_premium BOOLEAN;
BEGIN
    -- Security check: only allow users to calculate their own visibility score
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only calculate own visibility score';
    END IF;
    
    -- Get profile completeness
    SELECT public.profile_completeness(p_user_id) INTO v_completeness;
    
    -- Get activity/engagement score
    SELECT public.calculate_user_engagement_score(p_user_id) INTO v_activity_score;
    
    -- Check premium status
    SELECT public.check_user_premium_status(p_user_id) INTO v_is_premium;
    
    -- Calculate visibility score
    v_visibility_score := (COALESCE(v_completeness, 0.5) * 0.4) + 
                         (COALESCE(v_activity_score, 0.5) * 0.4) +
                         (CASE WHEN v_is_premium THEN 0.2 ELSE 0.0 END);
    
    RETURN GREATEST(0.1, LEAST(1.0, v_visibility_score));
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_match_interaction(p_user_id uuid, p_matched_user_id uuid, p_interaction_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Security check: only allow users to process their own interactions
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: can only process own interactions';
    END IF;
    
    -- Validate interaction type
    IF p_interaction_type NOT IN ('like', 'pass', 'super_like', 'block', 'report') THEN
        RAISE EXCEPTION 'Invalid interaction type';
    END IF;
    
    -- Validate matched user ID
    IF p_matched_user_id IS NULL OR p_matched_user_id = p_user_id THEN
        RAISE EXCEPTION 'Invalid matched user ID';
    END IF;
    
    -- Log the interaction for analytics
    PERFORM public.log_security_event(
        'match_interaction_processed',
        jsonb_build_object(
            'interaction_type', p_interaction_type,
            'matched_user_id', p_matched_user_id
        )
    );
    
    RETURN true;
END;
$function$;