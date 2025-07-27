-- Create Memory Vault tables for storing user's saved items

-- Table for saved matches
CREATE TABLE public.memory_vault_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  matched_user_id UUID NOT NULL,
  match_id UUID,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for saved prompts/questions
CREATE TABLE public.memory_vault_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_text TEXT NOT NULL,
  prompt_source TEXT, -- 'compatibility_quiz', 'conversation_starter', 'custom', etc.
  response_text TEXT,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for saved moments/conversations
CREATE TABLE public.memory_vault_moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  moment_type TEXT NOT NULL, -- 'message', 'video_call', 'milestone', 'reflection'
  title TEXT NOT NULL,
  description TEXT,
  content JSONB, -- Store conversation snippets, call notes, etc.
  related_user_id UUID, -- Optional reference to another user
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  moment_date TIMESTAMP WITH TIME ZONE, -- When the actual moment happened
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.memory_vault_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_vault_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_vault_moments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for memory_vault_matches
CREATE POLICY "Users can manage their own saved matches" 
ON public.memory_vault_matches 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for memory_vault_prompts
CREATE POLICY "Users can manage their own saved prompts" 
ON public.memory_vault_prompts 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for memory_vault_moments
CREATE POLICY "Users can manage their own saved moments" 
ON public.memory_vault_moments 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_memory_vault_matches_user_id ON public.memory_vault_matches(user_id);
CREATE INDEX idx_memory_vault_prompts_user_id ON public.memory_vault_prompts(user_id);
CREATE INDEX idx_memory_vault_moments_user_id ON public.memory_vault_moments(user_id);
CREATE INDEX idx_memory_vault_moments_type ON public.memory_vault_moments(moment_type);
CREATE INDEX idx_memory_vault_moments_favorite ON public.memory_vault_moments(is_favorite);

-- Create trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_memory_vault_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_memory_vault_matches_updated_at
  BEFORE UPDATE ON public.memory_vault_matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_memory_vault_updated_at();

CREATE TRIGGER update_memory_vault_prompts_updated_at
  BEFORE UPDATE ON public.memory_vault_prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_memory_vault_updated_at();

CREATE TRIGGER update_memory_vault_moments_updated_at
  BEFORE UPDATE ON public.memory_vault_moments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_memory_vault_updated_at();