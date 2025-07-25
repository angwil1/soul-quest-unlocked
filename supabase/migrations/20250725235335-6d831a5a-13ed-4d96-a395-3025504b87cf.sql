-- Create a function to manually trigger signup event for existing users
CREATE OR REPLACE FUNCTION public.create_signup_event_for_user(p_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Check if signup event already exists
  IF NOT EXISTS (
    SELECT 1 FROM public.user_events 
    WHERE user_id = p_user_id AND event_type = 'signup'
  ) THEN
    -- Create signup event
    INSERT INTO public.user_events (user_id, event_type, event_data)
    VALUES (
      p_user_id,
      'signup',
      jsonb_build_object(
        'signup_method', 'email',
        'created_via_function', true
      )
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;