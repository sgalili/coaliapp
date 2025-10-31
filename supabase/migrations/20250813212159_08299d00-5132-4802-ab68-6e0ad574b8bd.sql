-- Remove the foreign key constraint on user_id in zooz_reactions table
ALTER TABLE public.zooz_reactions 
DROP CONSTRAINT IF EXISTS zooz_reactions_user_id_fkey;

-- Make user_id nullable for testing
ALTER TABLE public.zooz_reactions 
ALTER COLUMN user_id DROP NOT NULL;