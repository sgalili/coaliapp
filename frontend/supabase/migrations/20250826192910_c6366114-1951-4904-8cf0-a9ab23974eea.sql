-- Bootstrap invitation code setup
-- Remove any existing LEVI0770 to avoid duplicates
DELETE FROM public.referral_codes WHERE code = 'LEVI0770';

-- Insert the requested code with defaults (10 uses, active)
INSERT INTO public.referral_codes (user_id, code, max_uses, is_active)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'LEVI0770', 10, true);
