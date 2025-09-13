-- Fix Critical Security Issues for Beta Testing

-- 1. Restrict quiz questions access to prevent theft
DROP POLICY IF EXISTS "Users can view questions" ON public.questions;
CREATE POLICY "Users can view questions after profile completion" 
ON public.questions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND is_profile_complete = true
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

-- 3. Restrict FAQ access to authenticated users only
DROP POLICY IF EXISTS "Anyone can view FAQs" ON public.faqs;
CREATE POLICY "Authenticated users can view FAQs" 
ON public.faqs 
FOR SELECT 
USING (auth.uid() IS NOT NULL);