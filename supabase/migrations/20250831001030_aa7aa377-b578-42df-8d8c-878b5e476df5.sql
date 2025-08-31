-- Create waitlist table to store email signups
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  referral_source TEXT,
  user_agent TEXT,
  ip_address INET
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into waitlist (public signups)
CREATE POLICY "Anyone can join waitlist" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

-- Allow reading for analytics (admins could query count)
CREATE POLICY "Public read for count" 
ON public.waitlist 
FOR SELECT 
USING (true);