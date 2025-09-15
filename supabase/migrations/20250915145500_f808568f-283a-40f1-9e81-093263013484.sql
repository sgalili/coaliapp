-- Fix RLS policies for prime_minister_candidates table
-- Add policies to explicitly deny INSERT, UPDATE, DELETE for regular users
-- Only service role should be able to manage this data

CREATE POLICY "Only service role can insert PM candidates" 
ON public.prime_minister_candidates 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Only service role can update PM candidates" 
ON public.prime_minister_candidates 
FOR UPDATE 
USING (false);

CREATE POLICY "Only service role can delete PM candidates" 
ON public.prime_minister_candidates 
FOR DELETE 
USING (false);