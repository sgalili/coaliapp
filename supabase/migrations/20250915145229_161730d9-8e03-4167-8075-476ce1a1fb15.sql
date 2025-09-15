-- Create table for Prime Minister candidates
CREATE TABLE public.prime_minister_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  party TEXT,
  expertise TEXT[],
  experience TEXT,
  bio TEXT,
  wikipedia_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.prime_minister_candidates ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view PM candidates (public data)
CREATE POLICY "PM candidates are viewable by everyone" 
ON public.prime_minister_candidates 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_prime_minister_candidates_updated_at
BEFORE UPDATE ON public.prime_minister_candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();