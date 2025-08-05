-- Create table for Echo quiet notes (expressive one-liners)
CREATE TABLE public.echo_quiet_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  note_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN DEFAULT false,
  response_invite_sent BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.echo_quiet_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for quiet notes
CREATE POLICY "Users can send quiet notes to Echo members" 
ON public.echo_quiet_notes 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view quiet notes sent to them" 
ON public.echo_quiet_notes 
FOR SELECT 
USING (auth.uid() = recipient_id OR auth.uid() = sender_id);

CREATE POLICY "Recipients can update note status" 
ON public.echo_quiet_notes 
FOR UPDATE 
USING (auth.uid() = recipient_id);

-- Create table for response invites
CREATE TABLE public.echo_response_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiet_note_id UUID NOT NULL REFERENCES public.echo_quiet_notes(id),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  invite_message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, declined, expired
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days')
);

-- Enable RLS
ALTER TABLE public.echo_response_invites ENABLE ROW LEVEL SECURITY;

-- Create policies for response invites
CREATE POLICY "Echo members can create response invites" 
ON public.echo_response_invites 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view invites involving them" 
ON public.echo_response_invites 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Recipients can update invite status" 
ON public.echo_response_invites 
FOR UPDATE 
USING (auth.uid() = recipient_id);

-- Create table for limited Echo chats
CREATE TABLE public.echo_limited_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  response_invite_id UUID NOT NULL REFERENCES public.echo_response_invites(id),
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  message_count INTEGER DEFAULT 0,
  daily_message_limit INTEGER DEFAULT 3,
  last_message_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '14 days')
);

-- Enable RLS
ALTER TABLE public.echo_limited_chats ENABLE ROW LEVEL SECURITY;

-- Create policies for limited chats
CREATE POLICY "Chat participants can view their chats" 
ON public.echo_limited_chats 
FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "System can manage chat data" 
ON public.echo_limited_chats 
FOR UPDATE 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create table for limited chat messages
CREATE TABLE public.echo_limited_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.echo_limited_chats(id),
  sender_id UUID NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.echo_limited_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for limited messages
CREATE POLICY "Chat participants can send messages" 
ON public.echo_limited_messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Chat participants can view messages" 
ON public.echo_limited_messages 
FOR SELECT 
USING (auth.uid() = sender_id OR chat_id IN (
  SELECT id FROM public.echo_limited_chats 
  WHERE user1_id = auth.uid() OR user2_id = auth.uid()
));

-- Add connection invitation settings to profiles table
ALTER TABLE public.profiles 
ADD COLUMN open_to_connection_invites BOOLEAN DEFAULT false,
ADD COLUMN echo_visibility_level TEXT DEFAULT 'standard'; -- standard, enhanced, full

-- Create function to check daily message limit
CREATE OR REPLACE FUNCTION check_daily_message_limit(chat_id_param UUID, sender_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  today_count INTEGER;
  daily_limit INTEGER;
BEGIN
  -- Get today's message count and daily limit
  SELECT 
    COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE AND sender_id = sender_id_param),
    c.daily_message_limit
  INTO today_count, daily_limit
  FROM public.echo_limited_messages m
  RIGHT JOIN public.echo_limited_chats c ON c.id = chat_id_param
  WHERE m.chat_id = chat_id_param OR m.chat_id IS NULL
  GROUP BY c.daily_message_limit;
  
  RETURN COALESCE(today_count, 0) < COALESCE(daily_limit, 3);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;