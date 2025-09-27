-- Update the get_next_kit_number function to limit to 200 kits instead of 500
CREATE OR REPLACE FUNCTION public.get_next_kit_number()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  next_number INTEGER;
BEGIN
  -- Security check: only service role can call this
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied: service role required';
  END IF;

  SELECT COALESCE(MAX(kit_number), 0) + 1 INTO next_number
  FROM public.quiet_start_signups
  WHERE benefits_claimed = true;
  
  -- Ensure we don't exceed 200 kits (updated from 500)
  IF next_number > 200 THEN
    RETURN NULL;
  END IF;
  
  RETURN next_number;
END;
$function$;