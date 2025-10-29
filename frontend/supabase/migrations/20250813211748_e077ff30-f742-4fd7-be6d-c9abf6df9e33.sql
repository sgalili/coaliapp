-- Enable RLS on zooz_reactions table
ALTER TABLE public.zooz_reactions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own reactions
CREATE POLICY "Users can insert their own zooz reactions" 
ON public.zooz_reactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view all reactions for real-time updates
CREATE POLICY "Users can view all zooz reactions" 
ON public.zooz_reactions 
FOR SELECT 
USING (true);

-- Add the table to realtime publication for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.zooz_reactions;