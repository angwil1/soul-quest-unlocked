-- Add RLS policies for questions table
CREATE POLICY "Anyone can read questions for the compatibility quiz" 
ON public.questions 
FOR SELECT 
USING (true);

-- Only service role should be able to modify questions
CREATE POLICY "Only service role can modify questions" 
ON public.questions 
FOR ALL 
USING (auth.role() = 'service_role'::text) 
WITH CHECK (auth.role() = 'service_role'::text);