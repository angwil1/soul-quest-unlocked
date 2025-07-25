-- Create email_journeys table to track automated emails
CREATE TABLE public.email_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  journey_type TEXT NOT NULL, -- 'welcome', 'quiz_completed', 'match_velocity_slow'
  email_address TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'delivered', 'opened', 'clicked', 'failed'
  email_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.email_journeys ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own email journey data
CREATE POLICY "Users can view their own email journeys" 
ON public.email_journeys 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create user_events table to track user actions that trigger emails
CREATE TABLE public.user_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'signup', 'quiz_completed', 'profile_completed', 'match_created', 'message_sent'
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own events
CREATE POLICY "Users can view their own events" 
ON public.user_events 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to insert their own events
CREATE POLICY "Users can insert their own events" 
ON public.user_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_events_user_id_type ON public.user_events(user_id, event_type);
CREATE INDEX idx_user_events_created_at ON public.user_events(created_at);
CREATE INDEX idx_email_journeys_user_journey ON public.email_journeys(user_id, journey_type);

-- Create function to trigger welcome email
CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert signup event
  INSERT INTO public.user_events (user_id, event_type, event_data)
  VALUES (
    NEW.id,
    'signup',
    jsonb_build_object(
      'email', NEW.email,
      'signup_method', 'email'
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users for new signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.trigger_welcome_email();