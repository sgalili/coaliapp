-- Add share_url column to shared_governments table
ALTER TABLE public.shared_governments 
ADD COLUMN share_url text;