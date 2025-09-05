-- Create government_shares table for permanent sharing links
CREATE TABLE public.government_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  share_id TEXT NOT NULL UNIQUE,
  creator_name TEXT,
  creator_user_id UUID,
  selected_candidates JSONB NOT NULL,
  image_url TEXT NOT NULL,
  prompt TEXT,
  seed INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.government_shares ENABLE ROW LEVEL SECURITY;

-- Anyone can view shared governments (public sharing)
CREATE POLICY "Shared governments are viewable by everyone" 
ON public.government_shares 
FOR SELECT 
USING (true);

-- Only authenticated users can create shares
CREATE POLICY "Users can create government shares" 
ON public.government_shares 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to generate unique share_id
CREATE OR REPLACE FUNCTION public.generate_share_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  share_id TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8 character alphanumeric code
    share_id := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if share_id already exists
    SELECT EXISTS(SELECT 1 FROM public.government_shares WHERE government_shares.share_id = share_id) INTO exists_check;
    
    -- Exit loop if share_id is unique
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN share_id;
END;
$$;

-- Add trigger for updating updated_at
CREATE TRIGGER update_government_shares_updated_at
BEFORE UPDATE ON public.government_shares
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();