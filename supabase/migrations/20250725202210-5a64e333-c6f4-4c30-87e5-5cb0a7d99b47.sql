-- Enable RLS on unprotected tables and create security policies

-- Enable RLS on ai_matches_archive
ALTER TABLE public.ai_matches_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own archived matches" 
ON public.ai_matches_archive 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

-- Enable RLS on compatibility_digests
ALTER TABLE public.compatibility_digests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own compatibility digests" 
ON public.compatibility_digests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own compatibility digests" 
ON public.compatibility_digests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Enable RLS on interaction_risk_profiles
ALTER TABLE public.interaction_risk_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own risk profiles" 
ON public.interaction_risk_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Enable RLS on match_interactions
ALTER TABLE public.match_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own match interactions" 
ON public.match_interactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own match interactions" 
ON public.match_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Enable RLS on match_previews
ALTER TABLE public.match_previews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own match previews" 
ON public.match_previews 
FOR SELECT 
USING (auth.uid() = user_id);

-- Enable RLS on top_picks
ALTER TABLE public.top_picks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own top picks" 
ON public.top_picks 
FOR SELECT 
USING (auth.uid() = user_id);

-- Enable RLS on user_interactions
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own interactions" 
ON public.user_interactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interactions" 
ON public.user_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Enable RLS on user_locations
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own locations" 
ON public.user_locations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own locations" 
ON public.user_locations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Enable RLS on faqs (public read access)
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read FAQs" 
ON public.faqs 
FOR SELECT 
USING (true);

-- Enable RLS on questions (public read access)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read questions" 
ON public.questions 
FOR SELECT 
USING (true);