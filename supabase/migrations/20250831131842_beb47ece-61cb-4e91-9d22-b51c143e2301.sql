-- Create a table to track Quiet Start signups and benefits
CREATE TABLE public.quiet_start_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  signup_step TEXT NOT NULL DEFAULT 'email_signup',
  benefits_claimed BOOLEAN NOT NULL DEFAULT false,
  wellness_kit_address JSONB,
  claimed_at TIMESTAMP WITH TIME ZONE,
  kit_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quiet_start_signups ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own Quiet Start signup" 
ON public.quiet_start_signups 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a function to update timestamps
CREATE OR REPLACE FUNCTION public.update_quiet_start_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quiet_start_signups_updated_at
BEFORE UPDATE ON public.quiet_start_signups
FOR EACH ROW
EXECUTE FUNCTION public.update_quiet_start_updated_at();

-- Create a function to get the next available kit number
CREATE OR REPLACE FUNCTION public.get_next_kit_number()
RETURNS INTEGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(kit_number), 0) + 1 INTO next_number
  FROM public.quiet_start_signups
  WHERE benefits_claimed = true;
  
  -- Ensure we don't exceed 500 kits
  IF next_number > 500 THEN
    RETURN NULL;
  END IF;
  
  RETURN next_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;