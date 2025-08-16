-- Create a match between the current authenticated user and Alex
INSERT INTO matches (id, user1_id, user2_id, created_at)
SELECT 
  gen_random_uuid(),
  auth.uid(),
  '11111111-1111-1111-1111-111111111111',
  NOW()
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;