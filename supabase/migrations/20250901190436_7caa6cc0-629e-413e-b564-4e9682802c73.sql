-- Create different sample profiles for matches (messaging) vs browse profiles
-- Remove the old sample profiles that are shared
DELETE FROM profiles WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
);

-- Create new dedicated MESSAGING sample profiles (for when users create test matches)
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

-- Update the function to use the new messaging sample profiles
CREATE OR REPLACE FUNCTION create_sample_matches_for_user(target_user_id UUID)
RETURNS void AS $$
DECLARE
    sample_user_ids UUID[] := ARRAY[
        'msg11111-1111-1111-1111-111111111111'::UUID,
        'msg22222-2222-2222-2222-222222222222'::UUID,
        'msg33333-3333-3333-3333-333333333333'::UUID,
        'msg44444-4444-4444-4444-444444444444'::UUID
    ];
    sample_user_id UUID;
    match_id UUID;
BEGIN
    -- Create matches with messaging sample users (if they don't already exist)
    FOREACH sample_user_id IN ARRAY sample_user_ids
    LOOP
        -- Insert match (avoid duplicates)
        INSERT INTO matches (user1_id, user2_id, score, created_at)
        VALUES (target_user_id, sample_user_id, 0.85 + (random() * 0.14), now())
        ON CONFLICT DO NOTHING;
        
        -- Get the match ID
        SELECT id INTO match_id
        FROM matches 
        WHERE (user1_id = target_user_id AND user2_id = sample_user_id)
           OR (user1_id = sample_user_id AND user2_id = target_user_id);
        
        -- Add some sample messages if no messages exist for this match
        IF NOT EXISTS (SELECT 1 FROM messages WHERE match_id = match_id) THEN
            INSERT INTO messages (sender_id, match_id, message_text, created_at)
            VALUES 
            (sample_user_id, match_id, 
             CASE 
               WHEN sample_user_id = 'msg11111-1111-1111-1111-111111111111' THEN 'Hi! I saw we matched. I love your profile - do you enjoy farmers markets too? 🌱'
               WHEN sample_user_id = 'msg22222-2222-2222-2222-222222222222' THEN 'Hey there! Mochi (my golden retriever) and I were wondering if you''d like to meet up at the dog park sometime? 🐕'
               WHEN sample_user_id = 'msg33333-3333-3333-3333-333333333333' THEN 'Hello! I noticed we both appreciate good music. I''m playing at a local coffee shop this Friday - would you like to come? 🎸'
               WHEN sample_user_id = 'msg44444-4444-4444-4444-444444444444' THEN 'Namaste! 🙏 I love connecting with mindful people. Would you be interested in a sunrise hike together?'
               ELSE 'Hey! Great to match with you 😊'
             END, 
             now() - interval '3 hours'),
            (sample_user_id, match_id, 
             CASE 
               WHEN sample_user_id = 'msg11111-1111-1111-1111-111111111111' THEN 'I''m heading to the Saturday market this weekend if you''d like to join!'
               WHEN sample_user_id = 'msg22222-2222-2222-2222-222222222222' THEN 'Mochi says woof! (That means yes to coffee too ☕)'
               WHEN sample_user_id = 'msg33333-3333-3333-3333-333333333333' THEN 'Either way, I''d love to hear about your music taste!'
               WHEN sample_user_id = 'msg44444-4444-4444-4444-444444444444' THEN 'No pressure though - sometimes the best connections happen naturally 🌅'
               ELSE 'Looking forward to getting to know you!'
             END, 
             now() - interval '1 hour');
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';