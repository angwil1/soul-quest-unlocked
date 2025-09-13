-- Fix Critical Security Issues for Beta Testing

-- 1. Restrict quiz questions access to prevent theft
DROP POLICY IF EXISTS "Users can view questions" ON public.questions;
CREATE POLICY "Users can view questions after profile completion" 
ON public.questions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND profile_completed = true
  )
);

-- 2. Restrict vibe gallery to matched users only
DROP POLICY IF EXISTS "Users can view public vibe gallery items" ON public.vibe_gallery_items;
CREATE POLICY "Users can view vibe gallery from matches only" 
ON public.vibe_gallery_items 
FOR SELECT 
USING (
  is_public = true 
  AND (
    user_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.matches 
      WHERE (user1_id = auth.uid() AND user2_id = vibe_gallery_items.user_id)
         OR (user2_id = auth.uid() AND user1_id = vibe_gallery_items.user_id)
    )
  )
);

-- 3. Fix database functions security - Add search_path to all edge functions
-- Update existing functions to be secure
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SECURITY DEFINER SET search_path = public;