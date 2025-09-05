-- First, drop the problematic function
DROP FUNCTION IF EXISTS public.generate_gov_id();

-- Rename gov_id to share_id in shared_governments table
ALTER TABLE public.shared_governments 
RENAME COLUMN gov_id TO share_id;

-- Create the new generate_share_id function for sharing
CREATE OR REPLACE FUNCTION public.generate_share_id()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_share_id TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8 character alphanumeric code
    new_share_id := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if share_id already exists
    SELECT EXISTS(SELECT 1 FROM public.shared_governments WHERE share_id = new_share_id) INTO exists_check;
    
    -- Exit loop if share_id is unique
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_share_id;
END;
$function$