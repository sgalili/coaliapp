-- Create table for shared governments
CREATE TABLE public.shared_governments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gov_id TEXT NOT NULL UNIQUE,
  creator_user_id UUID,
  creator_name TEXT,
  pm_name TEXT NOT NULL,
  pm_avatar TEXT,
  minister_1_name TEXT,
  minister_1_position TEXT,
  minister_1_avatar TEXT,
  minister_2_name TEXT,
  minister_2_position TEXT,
  minister_2_avatar TEXT,
  minister_3_name TEXT,
  minister_3_position TEXT,
  minister_3_avatar TEXT,
  minister_4_name TEXT,
  minister_4_position TEXT,
  minister_4_avatar TEXT,
  minister_5_name TEXT,
  minister_5_position TEXT,
  minister_5_avatar TEXT,
  minister_6_name TEXT,
  minister_6_position TEXT,
  minister_6_avatar TEXT,
  minister_7_name TEXT,
  minister_7_position TEXT,
  minister_7_avatar TEXT,
  minister_8_name TEXT,
  minister_8_position TEXT,
  minister_8_avatar TEXT,
  generated_image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shared_governments ENABLE ROW LEVEL SECURITY;

-- Create policies for shared governments (public read access)
CREATE POLICY "Shared governments are viewable by everyone" 
ON public.shared_governments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create shared governments" 
ON public.shared_governments 
FOR INSERT 
WITH CHECK (true);

-- Create function to generate short gov_id
CREATE OR REPLACE FUNCTION public.generate_gov_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  gov_id TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8 character alphanumeric code
    gov_id := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if gov_id already exists
    SELECT EXISTS(SELECT 1 FROM public.shared_governments WHERE shared_governments.gov_id = gov_id) INTO exists_check;
    
    -- Exit loop if gov_id is unique
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN gov_id;
END;
$$;