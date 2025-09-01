-- Check if messages table exists and create it if not
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  visibility_boost BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false
);

-- Enable RLS on both tables
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them
DROP POLICY IF EXISTS "Users can view their matches" ON public.matches;
DROP POLICY IF EXISTS "Users can create matches involving themselves" ON public.matches;
DROP POLICY IF EXISTS "Users can view messages in their matches" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their matches" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

-- Create fresh RLS policies for matches
CREATE POLICY "Users can view their matches" 
ON public.matches 
FOR SELECT 
USING ((auth.uid() = user1_id) OR (auth.uid() = user2_id));

CREATE POLICY "Users can create matches involving themselves" 
ON public.matches 
FOR INSERT 
WITH CHECK ((auth.uid() = user1_id) OR (auth.uid() = user2_id));

-- Create RLS policies for messages
CREATE POLICY "Users can view messages in their matches" 
ON public.messages 
FOR SELECT 
USING (
  match_id IN (
    SELECT id FROM public.matches 
    WHERE (auth.uid() = user1_id) OR (auth.uid() = user2_id)
  )
);

CREATE POLICY "Users can send messages in their matches" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() AND
  match_id IN (
    SELECT id FROM public.matches 
    WHERE (auth.uid() = user1_id) OR (auth.uid() = user2_id)
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING (sender_id = auth.uid());