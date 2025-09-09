-- Fix the remaining function search path issues
ALTER FUNCTION public.auto_generate_match_details() SET search_path = '';
ALTER FUNCTION public.calculate_match_intelligence(uuid) SET search_path = '';
ALTER FUNCTION public.calculate_match_priority(uuid, uuid) SET search_path = '';
ALTER FUNCTION public.calculate_profile_visibility_score(uuid) SET search_path = '';
ALTER FUNCTION public.calculate_user_engagement_score(uuid) SET search_path = '';
ALTER FUNCTION public.check_feature_access(uuid, text) SET search_path = '';
ALTER FUNCTION public.check_security_event_access(uuid) SET search_path = '';
ALTER FUNCTION public.check_user_premium_status(uuid) SET search_path = '';
ALTER FUNCTION public.cleanup_expired_sessions() SET search_path = '';
ALTER FUNCTION public.generate_ai_match_v2() SET search_path = '';
ALTER FUNCTION public.generate_ai_match_wrapper(bigint) SET search_path = '';
ALTER FUNCTION public.generate_match_preview(uuid, uuid) SET search_path = '';
ALTER FUNCTION public.generate_top_picks(uuid, integer) SET search_path = '';
ALTER FUNCTION public.generate_user_analytics_summary(uuid) SET search_path = '';
ALTER FUNCTION public.increment_message_count(uuid) SET search_path = '';
ALTER FUNCTION public.process_match_interaction(uuid, uuid, text) SET search_path = '';
ALTER FUNCTION public.process_user_feedback(uuid, jsonb) SET search_path = '';
ALTER FUNCTION public.schedule_match_archiving() SET search_path = '';
ALTER FUNCTION public.schedule_risk_assessment() SET search_path = '';
ALTER FUNCTION public.update_memory_vault_updated_at() SET search_path = '';
ALTER FUNCTION public.update_profiles_updated_at() SET search_path = '';
ALTER FUNCTION public.update_quiet_start_updated_at() SET search_path = '';
ALTER FUNCTION public.update_user_activity_status(uuid, jsonb) SET search_path = '';
ALTER FUNCTION public.validate_age_verification_data(date, text) SET search_path = '';
ALTER FUNCTION public.validate_profile_data(jsonb) SET search_path = '';

-- Add missing RLS policy for premium_profile_themes table
CREATE POLICY "Users can manage their own profile themes" ON public.premium_profile_themes
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);