-- Add whisper window constraints and settings
ALTER TABLE public.echo_limited_chats 
ADD COLUMN character_limit INTEGER DEFAULT 375, -- 250-500 range, middle value
ADD COLUMN message_pace_hours INTEGER DEFAULT 18, -- 12-24 hours, middle value
ADD COLUMN tone_guidance_enabled BOOLEAN DEFAULT true,
ADD COLUMN single_thread_enforced BOOLEAN DEFAULT true,
ADD COLUMN silence_mode_enabled BOOLEAN DEFAULT false;

-- Add completion tracking
ALTER TABLE public.echo_limited_chats
ADD COLUMN can_complete_connection BOOLEAN DEFAULT false,
ADD COLUMN connection_completion_available_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days');

-- Add character count tracking to messages
ALTER TABLE public.echo_limited_messages
ADD COLUMN character_count INTEGER;

-- Create function to check whisper window constraints
CREATE OR REPLACE FUNCTION check_whisper_window_constraints(
  chat_id_param UUID,
  sender_id_param UUID,
  message_text_param TEXT
)
RETURNS jsonb AS $$
DECLARE
  chat_settings RECORD;
  last_message_time TIMESTAMP WITH TIME ZONE;
  char_count INTEGER;
  hours_since_last INTEGER;
  result jsonb;
BEGIN
  -- Get chat settings
  SELECT character_limit, message_pace_hours, tone_guidance_enabled
  INTO chat_settings
  FROM public.echo_limited_chats
  WHERE id = chat_id_param;
  
  -- Check character limit
  char_count := LENGTH(message_text_param);
  IF char_count > chat_settings.character_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'character_limit_exceeded',
      'limit', chat_settings.character_limit,
      'current', char_count,
      'guidance', CASE WHEN chat_settings.tone_guidance_enabled 
                      THEN 'Keep it gentle and concise—let each word carry weight in this whisper space.'
                      ELSE null END
    );
  END IF;
  
  -- Check pace limit
  SELECT created_at INTO last_message_time
  FROM public.echo_limited_messages
  WHERE chat_id = chat_id_param AND sender_id = sender_id_param
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF last_message_time IS NOT NULL THEN
    hours_since_last := EXTRACT(EPOCH FROM (now() - last_message_time)) / 3600;
    IF hours_since_last < chat_settings.message_pace_hours THEN
      RETURN jsonb_build_object(
        'allowed', false,
        'reason', 'pace_limit',
        'hours_to_wait', (chat_settings.message_pace_hours - hours_since_last),
        'guidance', CASE WHEN chat_settings.tone_guidance_enabled 
                        THEN 'The echo needs time to resonate. Your words will carry more meaning with gentle pacing.'
                        ELSE null END
      );
    END IF;
  END IF;
  
  -- Update connection completion availability
  UPDATE public.echo_limited_chats
  SET can_complete_connection = (created_at <= now() - interval '7 days')
  WHERE id = chat_id_param;
  
  RETURN jsonb_build_object(
    'allowed', true,
    'character_count', char_count,
    'guidance', CASE WHEN chat_settings.tone_guidance_enabled 
                    THEN 'Your words flow beautifully in this whisper space.'
                    ELSE null END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add silence mode to profiles
ALTER TABLE public.profiles
ADD COLUMN echo_silence_mode BOOLEAN DEFAULT false;