-- Ensure profiles table has proper unique constraint on user_id
-- This prevents duplicate profiles for the same user

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_user_id_key'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Ensure user_id is properly linked to auth.users
-- Note: We cannot add a foreign key to auth.users as per Supabase best practices
-- But we ensure the column exists and is properly typed
ALTER TABLE public.profiles 
  ALTER COLUMN user_id SET NOT NULL;

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);