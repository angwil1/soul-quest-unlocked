-- TARGETED SECURITY FIX: Remove only the dangerous public access policy
-- Check if the dangerous policy still exists and remove it

DO $$
BEGIN
    -- Drop the dangerous policy that allows unauthenticated public access
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'vibe_gallery_items' 
        AND policyname = 'Public vibe gallery items are viewable by everyone'
        AND 'public' = ANY(roles)
    ) THEN
        DROP POLICY "Public vibe gallery items are viewable by everyone" ON public.vibe_gallery_items;
    END IF;
    
    -- Ensure we have the secure authenticated-only policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'vibe_gallery_items' 
        AND policyname = 'Authenticated users can view public vibe items'
    ) THEN
        CREATE POLICY "Authenticated users can view public vibe items" 
        ON public.vibe_gallery_items 
        FOR SELECT 
        TO authenticated
        USING (is_public = true);
    END IF;
END $$;