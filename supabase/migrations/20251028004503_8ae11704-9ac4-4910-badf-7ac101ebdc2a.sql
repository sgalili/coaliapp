-- Fix ambiguous reference in referral code generation
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8 character alphanumeric code
    v_code := upper(substring(md5(random()::text) from 1 for 8));

    -- Check if share_id already exists
    SELECT EXISTS(
      SELECT 1 FROM public.referral_codes r WHERE r.code = v_code
    ) INTO exists_check;

    -- Exit loop if code is unique
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;

  RETURN v_code;
END;
$function$;