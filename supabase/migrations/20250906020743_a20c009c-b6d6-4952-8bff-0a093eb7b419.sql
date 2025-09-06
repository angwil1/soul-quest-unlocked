-- CRITICAL SECURITY FIX: Remove public access to user photos and personal content
-- This addresses the security vulnerability where vibe_gallery_items were exposed to unauthenticated users

-- Drop the dangerous public access policy
DROP POLICY IF EXISTS "Public vibe gallery items are viewable by everyone" ON public.vibe_gallery_items;

-- Create secure replacement policy that requires authentication
-- Only authenticated users can view public vibe gallery items from other users
CREATE POLICY "Authenticated users can view public vibe items" 
ON public.vibe_gallery_items 
FOR SELECT 
TO authenticated
USING (is_public = true);

-- Ensure the existing user management policies are properly secured
-- (These should already exist but let's make sure they're correct)

-- Drop any duplicate policies first
DROP POLICY IF EXISTS "Users can manage own vibe items" ON public.vibe_gallery_items;
DROP POLICY IF EXISTS "Users can manage their own vibe gallery items" ON public.vibe_gallery_items;

-- Create consolidated secure policy for user's own content
CREATE POLICY "Users can manage their own vibe gallery items" 
ON public.vibe_gallery_items 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add additional security: Users can only view their own private items
CREATE POLICY "Users can view own private vibe items" 
ON public.vibe_gallery_items 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND is_public = false);

-- Ensure RLS is enabled on the table
ALTER TABLE public.vibe_gallery_items ENABLE ROW LEVEL SECURITY;