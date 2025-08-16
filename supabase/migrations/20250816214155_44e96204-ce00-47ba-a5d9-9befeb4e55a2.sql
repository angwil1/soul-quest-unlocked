-- Create match between the specific user and Alex
INSERT INTO matches (id, user1_id, user2_id, created_at)
VALUES (
  gen_random_uuid(),
  '33495078-536a-4250-b78e-9e4843576fa7',
  '11111111-1111-1111-1111-111111111111',
  NOW()
);