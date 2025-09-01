-- Fix nullable columns that should not be nullable for RLS
ALTER TABLE public.messages 
ALTER COLUMN match_id SET NOT NULL,
ALTER COLUMN sender_id SET NOT NULL;

-- Ensure RLS is enabled
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Users can view their matches" ON public.matches;
DROP POLICY IF EXISTS "Users can create matches involving themselves" ON public.matches; 
DROP POLICY IF EXISTS "Users can view messages in their matches" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their matches" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

-- Create proper RLS policies for matches
CREATE POLICY "Users can view their matches" 
ON public.matches 
FOR SELECT 
USING ((auth.uid() = user1_id) OR (auth.uid() = user2_id));

CREATE POLICY "Users can create matches involving themselves" 
ON public.matches 
FOR INSERT 
WITH CHECK ((auth.uid() = user1_id) OR (auth.uid() = user2_id));

-- Create proper RLS policies for messages
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