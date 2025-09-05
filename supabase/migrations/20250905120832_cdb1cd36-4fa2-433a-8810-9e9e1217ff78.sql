-- Create table for storing generated government images
CREATE TABLE public.government_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  candidates_hash TEXT NOT NULL,
  image_url TEXT NOT NULL,
  prompt TEXT,
  seed INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.government_images ENABLE ROW LEVEL SECURITY;

-- Create policies for government_images
CREATE POLICY "Users can view their own government images" 
ON public.government_images 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create government images" 
ON public.government_images 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own government images" 
ON public.government_images 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own government images" 
ON public.government_images 
FOR DELETE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_government_images_updated_at
BEFORE UPDATE ON public.government_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for efficient lookups
CREATE INDEX idx_government_images_user_hash ON public.government_images(user_id, candidates_hash);
CREATE INDEX idx_government_images_hash ON public.government_images(candidates_hash);