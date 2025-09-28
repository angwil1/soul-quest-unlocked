-- Fix critical privacy issue: Secure dating quiz questions
-- Remove public access and restrict to authorized users only

-- First, let's check if questions table exists and remove overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view questions" ON public.questions;
DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions; 
DROP POLICY IF EXISTS "Public read access to questions" ON public.questions;

-- Create secure policy for questions table - only allow users with completed profiles
CREATE POLICY "Completed profile users can view questions" 
ON public.questions 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (name IS NOT NULL OR bio IS NOT NULL) -- User has at least started their profile
  )
);

-- Secure any other potentially exposed quiz/compatibility data
-- Fix memory vault access to ensure users only see their own data
ALTER TABLE public.memory_vault_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_vault_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_vault_prompts ENABLE ROW LEVEL SECURITY;

-- Secure interaction risk profiles 
ALTER TABLE public.interaction_risk_profiles ENABLE ROW LEVEL SECURITY;

-- Fix missing RLS policies for tables that need them
CREATE POLICY "Users can only view own risk profiles" 
ON public.interaction_risk_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Ensure quiz results are private
CREATE POLICY "Users can only view own quiz results" 
ON public.quiz_results 
FOR SELECT 
USING (auth.uid() = user_id);