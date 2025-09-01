-- Fix sample profiles for messaging - ensure correct IDs and update function
DELETE FROM profiles WHERE id IN (
  'a1111111-1111-1111-1111-111111111111',
  'b2222222-2222-2222-2222-222222222222'
);

-- Create the correct messaging sample profiles with proper IDs
INSERT INTO profiles (id, name, bio, age, location, occupation, created_at)
VALUES 
(
  'msg11111-1111-1111-1111-111111111111',
  'Taylor Brooks',
  'Passionate about sustainable living and weekend farmers markets. Looking for someone who shares my love for organic gardening and cozy movie nights.',
  29,
  'Portland, OR',
  'Environmental Consultant',
  now()
),
(
  'msg22222-2222-2222-2222-222222222222', 
  'Casey Chen',
  'Dog lover, rock climber, and coffee enthusiast. My golden retriever Mochi and I are always up for new adventures and meeting genuine people.',
  31,
  'Denver, CO',
  'Veterinarian',
  now()
),
(
  'msg33333-3333-3333-3333-333333333333',
  'Riley Martinez', 
  'Musician by night, teacher by day. I play guitar at local coffee shops and believe in the power of music to bring people together.',
  27,
  'Austin, TX',
  'Music Teacher',
  now()
),
(
  'msg44444-4444-4444-4444-444444444444',
  'Sage Thompson', 
  'Yoga instructor and mindfulness coach. I love sunrise hikes, meditation retreats, and deep conversations about life and purpose.',
  33,
  'Sedona, AZ',
  'Yoga Instructor',
  now()
);