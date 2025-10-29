-- Create helper function for incrementing post views
CREATE OR REPLACE FUNCTION public.increment_post_views(p_post_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.posts 
  SET view_count = view_count + 1 
  WHERE id = p_post_id;
  RETURN TRUE;
END; $$;