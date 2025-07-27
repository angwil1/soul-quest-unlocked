-- Add Echo badge and TikTok features to profiles table
ALTER TABLE public.profiles 
ADD COLUMN echo_badge_enabled BOOLEAN DEFAULT false,
ADD COLUMN tiktok_embed_url TEXT,
ADD COLUMN vibe_gallery JSONB DEFAULT '[]'::jsonb,
ADD COLUMN emotional_soundtrack TEXT;

-- Create table for Echo subscription tracking
CREATE TABLE public.echo_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('monthly', 'lifetime')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ, -- NULL for lifetime subscriptions
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on echo_subscriptions
ALTER TABLE public.echo_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for echo_subscriptions
CREATE POLICY "Users can view their own Echo subscriptions" 
ON public.echo_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Echo subscriptions" 
ON public.echo_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Echo subscriptions" 
ON public.echo_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create table for vibe gallery content
CREATE TABLE public.vibe_gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'image', 'audio')),
  file_url TEXT NOT NULL,
  caption TEXT,
  mood_tags JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on vibe_gallery_items
ALTER TABLE public.vibe_gallery_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vibe_gallery_items
CREATE POLICY "Users can manage their own vibe gallery items" 
ON public.vibe_gallery_items 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public vibe gallery items are viewable by everyone" 
ON public.vibe_gallery_items 
FOR SELECT 
USING (is_public = true);