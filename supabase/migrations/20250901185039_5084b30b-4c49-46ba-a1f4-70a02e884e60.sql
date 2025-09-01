-- Function to create sample matches for any authenticated user  
CREATE OR REPLACE FUNCTION create_sample_matches_for_user(target_user_id UUID)
RETURNS void AS $$
DECLARE
    sample_user_ids UUID[] := ARRAY[
        '11111111-1111-1111-1111-111111111111'::UUID,
        '22222222-2222-2222-2222-222222222222'::UUID,
        '33333333-3333-3333-3333-333333333333'::UUID
    ];
    sample_user_id UUID;
    match_id UUID;
BEGIN
    -- Create matches with sample users (if they don't already exist)
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
            (sample_user_id, match_id, 'Hey! I saw we matched. How''s your day going?', now() - interval '2 hours'),
            (sample_user_id, match_id, 'I noticed we both love coffee ☕️ Do you have a favorite local spot?', now() - interval '1 hour');
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION create_sample_matches_for_user(UUID) TO authenticated;

-- Insert sample profiles only if they don't exist
INSERT INTO profiles (id, name, bio, age, location, occupation, created_at)
SELECT * FROM (VALUES
  ('11111111-1111-1111-1111-111111111111'::UUID, 'Alex Johnson', 'Love hiking, coffee, and deep conversations. Looking for genuine connections.', 28, 'San Francisco, CA', 'Software Engineer', now()),
  ('22222222-2222-2222-2222-222222222222'::UUID, 'Sam Rivera', 'Artist and yoga enthusiast. Believe in mindful living and authentic relationships.', 26, 'Los Angeles, CA', 'Graphic Designer', now()),
  ('33333333-3333-3333-3333-333333333333'::UUID, 'Jordan Kim', 'Adventure seeker and bookworm. Always up for trying new cuisines and exploring cities.', 30, 'New York, NY', 'Marketing Manager', now())
) AS v(id, name, bio, age, location, occupation, created_at)
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = v.id
);