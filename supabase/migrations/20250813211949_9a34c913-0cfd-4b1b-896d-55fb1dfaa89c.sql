-- Drop existing policies and create new ones for testing
DROP POLICY IF EXISTS "Users can insert their own zooz reactions" ON public.zooz_reactions;
DROP POLICY IF EXISTS "Users can view all zooz reactions" ON public.zooz_reactions;

-- Create more permissive policies for testing (will restrict later for production)
CREATE POLICY "Allow all inserts for testing" 
ON public.zooz_reactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all selects for testing" 
ON public.zooz_reactions 
FOR SELECT 
USING (true);