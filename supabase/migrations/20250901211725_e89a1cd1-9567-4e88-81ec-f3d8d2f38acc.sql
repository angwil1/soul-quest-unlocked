-- Fix the sample matches function to work without auth user constraints
CREATE OR REPLACE FUNCTION public.create_sample_matches_for_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    sample_user_ids UUID[] := ARRAY[
        '10000000-1111-1111-1111-111111111111'::UUID,
        '20000000-2222-2222-2222-222222222222'::UUID,
        '30000000-3333-3333-3333-333333333333'::UUID,
        '40000000-4444-4444-4444-444444444444'::UUID
    ];
    sample_user_id UUID;
    match_id_var UUID;
    sample_names TEXT[] := ARRAY['Sage', 'River', 'Atlas', 'Echo'];
    sample_messages TEXT[][] := ARRAY[
        ARRAY['Hi! I saw we matched. I love your profile - do you enjoy farmers markets too? 🌱', 'I''m heading to the Saturday market this weekend if you''d like to join!'],
        ARRAY['Hey there! Mochi (my golden retriever) and I were wondering if you''d like to meet up at the dog park sometime? 🐕', 'Mochi says woof! (That means yes to coffee too ☕)'],
        ARRAY['Hello! I noticed we both appreciate good music. I''m playing at a local coffee shop this Friday - would you like to come? 🎸', 'Either way, I''d love to hear about your music taste!'],
        ARRAY['Namaste! 🙏 I love connecting with mindful people. Would you be interested in a sunrise hike together?', 'No pressure though - sometimes the best connections happen naturally 🌅']
    ];
    i INTEGER := 1;
BEGIN
    -- Create matches with sample users (if they don't already exist)
    FOREACH sample_user_id IN ARRAY sample_user_ids
    LOOP
        -- Insert match (avoid duplicates)
        INSERT INTO matches (user1_id, user2_id, score, created_at)
        VALUES (target_user_id, sample_user_id, 0.85 + (random() * 0.14), now())
        ON CONFLICT DO NOTHING;
        
        -- Get the match ID
        SELECT m.id INTO match_id_var
        FROM matches m 
        WHERE (m.user1_id = target_user_id AND m.user2_id = sample_user_id)
           OR (m.user1_id = sample_user_id AND m.user2_id = target_user_id);
        
        -- Only create messages if none exist and we have a match
        IF match_id_var IS NOT NULL AND NOT EXISTS (SELECT 1 FROM messages WHERE messages.match_id = match_id_var) THEN
            -- Create messages from the target user's perspective (as if they received them)
            -- We'll create a simple notification-style message instead of actual messages
            INSERT INTO messages (sender_id, match_id, message_text, created_at)
            VALUES 
            (target_user_id, match_id_var, 
             'You have a new match with ' || sample_names[i] || '! They seem really interested in connecting with you. Start a conversation!', 
             now() - interval '1 hour');
        END IF;
        
        i := i + 1;
    END LOOP;
END;
$function$;