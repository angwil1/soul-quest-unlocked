-- Create Connection DNA tables for emotional intelligence tracking

-- Table for storing user's emotional intelligence profile
CREATE TABLE public.connection_dna_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emotional_intelligence_score DECIMAL(4,2) DEFAULT 0.0, -- 0.0 to 100.0
  communication_style JSONB DEFAULT '{}', -- analyzed communication patterns
  emotional_patterns JSONB DEFAULT '{}', -- emotional response patterns
  compatibility_insights JSONB DEFAULT '{}', -- what works well for this user
  growth_metrics JSONB DEFAULT '{}', -- tracking improvement over time
  personality_markers JSONB DEFAULT '{}', -- detected personality traits
  interaction_quality_score DECIMAL(4,2) DEFAULT 0.0, -- quality of interactions
  empathy_score DECIMAL(4,2) DEFAULT 0.0, -- empathy level
  vulnerability_comfort DECIMAL(4,2) DEFAULT 0.0, -- comfort with emotional vulnerability
  conflict_resolution_style TEXT, -- how they handle disagreements
  love_language_primary TEXT, -- primary love language detected
  love_language_secondary TEXT, -- secondary love language
  last_analysis_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_scores CHECK (
    emotional_intelligence_score >= 0.0 AND emotional_intelligence_score <= 100.0 AND
    interaction_quality_score >= 0.0 AND interaction_quality_score <= 100.0 AND
    empathy_score >= 0.0 AND empathy_score <= 100.0 AND
    vulnerability_comfort >= 0.0 AND vulnerability_comfort <= 100.0
  )
);

-- Table for tracking interaction data points
CREATE TABLE public.connection_dna_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'message', 'response_to_prompt', 'match_reaction', 'profile_view'
  other_user_id UUID, -- if interaction involves another user
  interaction_data JSONB NOT NULL, -- raw interaction data
  emotional_markers JSONB, -- detected emotional markers
  sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
  response_time_seconds INTEGER, -- how long they took to respond
  message_length INTEGER, -- length of message/response
  empathy_indicators JSONB, -- detected empathy markers
  vulnerability_level DECIMAL(3,2), -- 0.0 to 1.0 how vulnerable/open they were
  engagement_score DECIMAL(3,2), -- 0.0 to 1.0 how engaged they were
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_sentiment CHECK (sentiment_score >= -1.0 AND sentiment_score <= 1.0),
  CONSTRAINT valid_vulnerability CHECK (vulnerability_level >= 0.0 AND vulnerability_level <= 1.0),
  CONSTRAINT valid_engagement CHECK (engagement_score >= 0.0 AND engagement_score <= 1.0)
);

-- Table for compatibility analysis between users
CREATE TABLE public.connection_dna_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_compatibility_score DECIMAL(4,2) NOT NULL, -- 0.0 to 100.0
  emotional_sync_score DECIMAL(4,2), -- how well they sync emotionally
  communication_compatibility DECIMAL(4,2), -- communication style match
  personality_match_score DECIMAL(4,2), -- personality compatibility
  shared_values_score DECIMAL(4,2), -- shared values alignment
  growth_potential_score DECIMAL(4,2), -- potential for mutual growth
  conflict_harmony_score DECIMAL(4,2), -- how they handle conflicts together
  detailed_analysis JSONB, -- detailed breakdown of compatibility
  strengths JSONB, -- relationship strengths
  growth_areas JSONB, -- areas for improvement
  conversation_starters JSONB, -- AI-generated conversation starters
  date_ideas JSONB, -- personalized date suggestions
  analysis_confidence DECIMAL(3,2) DEFAULT 0.5, -- confidence in analysis 0.0 to 1.0
  last_analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id_1, user_id_2),
  CONSTRAINT valid_compatibility_scores CHECK (
    overall_compatibility_score >= 0.0 AND overall_compatibility_score <= 100.0 AND
    emotional_sync_score >= 0.0 AND emotional_sync_score <= 100.0 AND
    communication_compatibility >= 0.0 AND communication_compatibility <= 100.0 AND
    personality_match_score >= 0.0 AND personality_match_score <= 100.0 AND
    shared_values_score >= 0.0 AND shared_values_score <= 100.0 AND
    growth_potential_score >= 0.0 AND growth_potential_score <= 100.0 AND
    conflict_harmony_score >= 0.0 AND conflict_harmony_score <= 100.0
  ),
  CONSTRAINT valid_confidence CHECK (analysis_confidence >= 0.0 AND analysis_confidence <= 1.0)
);

-- Table for storing emotional growth insights and recommendations
CREATE TABLE public.connection_dna_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'growth_opportunity', 'strength', 'pattern', 'recommendation'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  actionable_steps JSONB, -- suggested actions
  confidence_level DECIMAL(3,2) DEFAULT 0.5, -- 0.0 to 1.0
  priority_level TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  category TEXT, -- 'communication', 'empathy', 'vulnerability', 'conflict_resolution'
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE, -- when insight becomes stale
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_confidence_level CHECK (confidence_level >= 0.0 AND confidence_level <= 1.0)
);

-- Enable Row Level Security
ALTER TABLE public.connection_dna_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_dna_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_dna_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_dna_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for connection_dna_profiles
CREATE POLICY "Users can manage their own DNA profile" 
ON public.connection_dna_profiles 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for connection_dna_interactions
CREATE POLICY "Users can manage their own DNA interactions" 
ON public.connection_dna_interactions 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for connection_dna_compatibility
CREATE POLICY "Users can view compatibility involving them" 
ON public.connection_dna_compatibility 
FOR SELECT 
USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

CREATE POLICY "System can manage compatibility data" 
ON public.connection_dna_compatibility 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update compatibility data" 
ON public.connection_dna_compatibility 
FOR UPDATE 
USING (true);

-- RLS Policies for connection_dna_insights
CREATE POLICY "Users can manage their own DNA insights" 
ON public.connection_dna_insights 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_connection_dna_profiles_user_id ON public.connection_dna_profiles(user_id);
CREATE INDEX idx_connection_dna_interactions_user_id ON public.connection_dna_interactions(user_id);
CREATE INDEX idx_connection_dna_interactions_type ON public.connection_dna_interactions(interaction_type);
CREATE INDEX idx_connection_dna_compatibility_users ON public.connection_dna_compatibility(user_id_1, user_id_2);
CREATE INDEX idx_connection_dna_insights_user_id ON public.connection_dna_insights(user_id);
CREATE INDEX idx_connection_dna_insights_priority ON public.connection_dna_insights(priority_level);

-- Create trigger function for updated_at timestamps
CREATE TRIGGER update_connection_dna_profiles_updated_at
  BEFORE UPDATE ON public.connection_dna_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_memory_vault_updated_at();

CREATE TRIGGER update_connection_dna_compatibility_updated_at
  BEFORE UPDATE ON public.connection_dna_compatibility
  FOR EACH ROW
  EXECUTE FUNCTION public.update_memory_vault_updated_at();