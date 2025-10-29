-- Create a bootstrap admin profile first
INSERT INTO public.profiles (user_id, first_name, last_name, phone)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'Admin', 'Bootstrap', '+33000000000')
ON CONFLICT (user_id) DO NOTHING;

-- Now insert the requested invitation code
INSERT INTO public.referral_codes (user_id, code, max_uses, is_active)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'LEVI0770', 10, true)
ON CONFLICT (code) DO UPDATE SET 
  max_uses = EXCLUDED.max_uses,
  is_active = EXCLUDED.is_active,
  current_uses = 0;