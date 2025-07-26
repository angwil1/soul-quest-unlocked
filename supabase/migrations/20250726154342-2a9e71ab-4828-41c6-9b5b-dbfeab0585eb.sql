-- Add digest_content column to compatibility_digests table
ALTER TABLE public.compatibility_digests 
ADD COLUMN digest_content JSONB;