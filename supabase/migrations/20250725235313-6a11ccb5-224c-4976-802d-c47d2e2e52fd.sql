-- Create cron job to process email events every hour
SELECT cron.schedule(
  'process-email-events',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://syptmdowisipzqaxoroq.supabase.co/functions/v1/process-email-events',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5cHRtZG93aXNpcHpxYXhvcm9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0ODMwMTAsImV4cCI6MjA2NzA1OTAxMH0.ACxyOW_eqSeQFrvrMNVpYHiTqipqUHKF9gjAjhvJg60"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Also create a function to manually trigger signup event for existing users
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