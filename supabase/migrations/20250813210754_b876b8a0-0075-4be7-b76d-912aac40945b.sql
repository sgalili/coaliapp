-- Create table for real-time ZOOZ reactions
CREATE TABLE public.zooz_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL DEFAULT 1,
  x_position REAL,
  y_position REAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.zooz_reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for zooz_reactions
CREATE POLICY "Anyone can view zooz reactions" 
ON public.zooz_reactions 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create zooz reactions" 
ON public.zooz_reactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Enable realtime for the table
ALTER TABLE public.zooz_reactions REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.zooz_reactions;