-- Fix RLS policies for government_shares table
-- Add missing policies for UPDATE and DELETE operations

-- Allow users to update their own shared governments
CREATE POLICY "Users can update their own government shares" 
ON public.government_shares 
FOR UPDATE 
USING (auth.uid() = creator_user_id);

-- Allow users to delete their own shared governments
CREATE POLICY "Users can delete their own government shares" 
ON public.government_shares 
FOR DELETE 
USING (auth.uid() = creator_user_id);