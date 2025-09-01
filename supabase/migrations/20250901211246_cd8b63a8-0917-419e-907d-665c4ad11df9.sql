-- Fix the create_sample_matches_for_user function to use proper schema references
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
    match_id UUID;
BEGIN
    -- Create matches with messaging sample users (if they don't already exist)
    FOREACH sample_user_id IN ARRAY sample_user_ids
    LOOP
        -- Insert match (avoid duplicates)
        INSERT INTO public.matches (user1_id, user2_id, score, created_at)
        VALUES (target_user_id, sample_user_id, 0.85 + (random() * 0.14), now())
        ON CONFLICT DO NOTHING;
        
        -- Get the match ID
        SELECT id INTO match_id
        FROM public.matches 
        WHERE (user1_id = target_user_id AND user2_id = sample_user_id)
           OR (user1_id = sample_user_id AND user2_id = target_user_id);
        
        -- Add some sample messages if no messages exist for this match
        IF NOT EXISTS (SELECT 1 FROM public.messages WHERE match_id = match_id) THEN
            INSERT INTO public.messages (sender_id, match_id, message_text, created_at)
            VALUES 
            (sample_user_id, match_id, 
             CASE 
               WHEN sample_user_id = '10000000-1111-1111-1111-111111111111' THEN 'Hi! I saw we matched. I love your profile - do you enjoy farmers markets too? 🌱'
               WHEN sample_user_id = '20000000-2222-2222-2222-222222222222' THEN 'Hey there! Mochi (my golden retriever) and I were wondering if you''d like to meet up at the dog park sometime? 🐕'
               WHEN sample_user_id = '30000000-3333-3333-3333-333333333333' THEN 'Hello! I noticed we both appreciate good music. I''m playing at a local coffee shop this Friday - would you like to come? 🎸'
               WHEN sample_user_id = '40000000-4444-4444-4444-444444444444' THEN 'Namaste! 🙏 I love connecting with mindful people. Would you be interested in a sunrise hike together?'
               ELSE 'Hey! Great to match with you 😊'
             END, 
             now() - interval '3 hours'),
            (sample_user_id, match_id, 
             CASE 
               WHEN sample_user_id = '10000000-1111-1111-1111-111111111111' THEN 'I''m heading to the Saturday market this weekend if you''d like to join!'
               WHEN sample_user_id = '20000000-2222-2222-2222-222222222222' THEN 'Mochi says woof! (That means yes to coffee too ☕)'
               WHEN sample_user_id = '30000000-3333-3333-3333-333333333333' THEN 'Either way, I''d love to hear about your music taste!'
               WHEN sample_user_id = '40000000-4444-4444-4444-444444444444' THEN 'No pressure though - sometimes the best connections happen naturally 🌅'
               ELSE 'Looking forward to getting to know you!'
             END, 
             now() - interval '1 hour');
        END IF;
    END LOOP;
END;
$function$