-- Ensure 'user 1' profile exists with provided details and referral code LEVI0770
DO $$
BEGIN
  -- Update profile if it exists
  UPDATE public.profiles
  SET first_name = 'Lev',
      last_name = 'Israel',
      phone = '+972-586136130',
      updated_at = now()
  WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid;

  -- Insert profile if it does not exist
  IF NOT FOUND THEN
    INSERT INTO public.profiles (user_id, first_name, last_name, phone)
    VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'Lev', 'Israel', '+972-586136130');
  END IF;
END$$;

-- Ensure LEVI0770 referral code is assigned to 'user 1'
DO $$
BEGIN
  -- Try to update existing code
  UPDATE public.referral_codes
  SET user_id = '00000000-0000-0000-0000-000000000001'::uuid,
      max_uses = 10,
      is_active = true,
      updated_at = now()
  WHERE code = 'LEVI0770';

  -- If no row was updated, insert new referral code
  IF NOT FOUND THEN
    INSERT INTO public.referral_codes (user_id, code, max_uses, is_active, current_uses)
    VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'LEVI0770', 10, true, 0);
  END IF;
END$$;