-- Fix RLS policy for otps table - make it more restrictive
DROP POLICY IF EXISTS "Service role can manage OTPs" ON public.otps;

-- Only allow service role (used by edge functions) to manage OTPs
CREATE POLICY "Only service role can manage OTPs" ON public.otps
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);