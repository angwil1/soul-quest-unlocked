-- Create Alex's profile for proper messaging functionality
INSERT INTO profiles (
  id, 
  name, 
  age, 
  bio, 
  location, 
  interests, 
  photos, 
  avatar_url,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Alex',
  28,
  'Adventure seeker and photography enthusiast. Love hiking, rock climbing, and capturing life''s beautiful moments.',
  'San Francisco, CA',
  ARRAY['Photography', 'Hiking', 'Rock Climbing', 'Travel', 'Coffee'],
  ARRAY['/lovable-uploads/ca0ac62b-2f4a-43d8-aafa-8a00c169e4b7.png'],
  '/lovable-uploads/ca0ac62b-2f4a-43d8-aafa-8a00c169e4b7.png',
  NOW(),
  NOW()
);