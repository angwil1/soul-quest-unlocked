-- Create a demo user profile for Alex (for testing)
INSERT INTO profiles (id, name, age, bio) 
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Alex',
  28,
  'Love photography and hiking. Looking for meaningful connections!'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  age = EXCLUDED.age,
  bio = EXCLUDED.bio;

-- Create a demo match between current user and Alex (assuming you have a user)
-- We'll use a placeholder user ID that can be updated
INSERT INTO matches (id, user1_id, user2_id, created_at)
SELECT 
  '22222222-2222-2222-2222-222222222222',
  auth.uid(),
  '11111111-1111-1111-1111-111111111111',
  NOW()
WHERE auth.uid() IS NOT NULL
ON CONFLICT (id) DO NOTHING;