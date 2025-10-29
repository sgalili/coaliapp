-- Drop all existing policies first
DROP POLICY IF EXISTS "Allow all inserts for testing" ON public.zooz_reactions;
DROP POLICY IF EXISTS "Allow all selects for testing" ON public.zooz_reactions;
DROP POLICY IF EXISTS "Anyone can view zooz reactions" ON public.zooz_reactions;
DROP POLICY IF EXISTS "Authenticated users can create zooz reactions" ON public.zooz_reactions;

-- Create simple test policies
CREATE POLICY "Test insert policy" 
ON public.zooz_reactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Test select policy" 
ON public.zooz_reactions 
FOR SELECT 
USING (true);