-- Remove test user and clean up database
-- Remove all test data
DELETE FROM public.user_balances WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM public.profiles WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';