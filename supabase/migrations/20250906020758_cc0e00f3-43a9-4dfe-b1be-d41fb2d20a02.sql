-- Fix Critical Security Vulnerability: Remove public access to vibe_gallery_items
-- This prevents unauthenticated users from accessing user photos and personal content

-- Drop the dangerous policy that allows public access to user photos
DROP POLICY IF EXISTS "Public vibe gallery items are viewable by everyone" ON public.vibe_gallery_items;

-- Create a secure policy that requires authentication for viewing public items
CREATE POLICY "Authenticated users can view public vibe items" 
ON public.vibe_gallery_items 
FOR SELECT 
TO authenticated
USING (is_public = true);

-- Ensure the existing user management policies are properly secured
-- Drop duplicate policies if they exist
DROP POLICY IF EXISTS "Users can manage own vibe items" ON public.vibe_gallery_items;

-- Keep only the properly named policy for user management
-- This policy already exists but ensure it's correctly configured
DROP POLICY IF EXISTS "Users can manage their own vibe gallery items" ON public.vibe_gallery_items;

CREATE POLICY "Users can manage their own vibe gallery items" 
ON public.vibe_gallery_items 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add a policy for users to view their own private items
CREATE POLICY "Users can view their own private vibe items" 
ON public.vibe_gallery_items 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND is_public = false);