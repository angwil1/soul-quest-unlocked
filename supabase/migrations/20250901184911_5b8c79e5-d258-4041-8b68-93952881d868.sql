-- Fix the search path for the newly created function
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
    -- Delete existing matches first to avoid conflicts
    DELETE FROM matches WHERE 
        (user1_id = target_user_id AND user2_id = ANY(sample_user_ids)) OR
        (user2_id = target_user_id AND user1_id = ANY(sample_user_ids));
        
    -- Create fresh matches with sample users
    FOREACH sample_user_id IN ARRAY sample_user_ids
    LOOP
        -- Insert match
        INSERT INTO matches (user1_id, user2_id, score, created_at)
        VALUES (target_user_id, sample_user_id, 0.85 + (random() * 0.14), now())
        RETURNING id INTO match_id;
        
        -- Add some sample messages
        INSERT INTO messages (sender_id, match_id, message_text, created_at)
        VALUES 
        (sample_user_id, match_id, 'Hey! I saw we matched. How''s your day going?', now() - interval '2 hours'),
        (sample_user_id, match_id, 'I noticed we both love coffee ☕️ Do you have a favorite local spot?', now() - interval '1 hour');
    END LOOP;
    
    RAISE NOTICE 'Created sample matches for user %', target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Grant execution to authenticated users  
GRANT EXECUTE ON FUNCTION create_sample_matches_for_user(UUID) TO authenticated;