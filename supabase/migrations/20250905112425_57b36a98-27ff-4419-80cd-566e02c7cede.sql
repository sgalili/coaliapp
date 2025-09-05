-- Create government_selections table to store user's chosen candidates
CREATE TABLE public.government_selections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ministry_id TEXT NOT NULL,
  candidate_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, ministry_id)
);

-- Enable Row Level Security
ALTER TABLE public.government_selections ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own government selections" 
ON public.government_selections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own government selections" 
ON public.government_selections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own government selections" 
ON public.government_selections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own government selections" 
ON public.government_selections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_government_selections_updated_at
BEFORE UPDATE ON public.government_selections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();