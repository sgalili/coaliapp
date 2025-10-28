-- Update profiles RLS policy to ensure users can always read their own profile
DROP POLICY IF EXISTS "Real users can view real profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Demo users can view demo profiles"
ON public.profiles
FOR SELECT
USING (is_demo_user(auth.uid()) AND is_demo = true);