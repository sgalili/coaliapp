-- Fix search_path for security - update existing functions
CREATE OR REPLACE FUNCTION public.increment_news_view_count(news_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.news_articles 
  SET view_count = view_count + 1 
  WHERE id = news_id;
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_stats(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Initialize or update user stats
  INSERT INTO public.user_stats (user_id, posts_count, comments_count, trust_received)
  VALUES (p_user_id, 0, 0, 0)
  ON CONFLICT (user_id) 
  DO UPDATE SET
    posts_count = (SELECT COUNT(*) FROM public.posts WHERE user_id = p_user_id),
    comments_count = (SELECT COUNT(*) FROM public.comments WHERE user_id = p_user_id) + 
                     (SELECT COUNT(*) FROM public.news_comments WHERE user_id = p_user_id),
    trust_received = (SELECT COUNT(*) FROM public.trusts WHERE trusted_id = p_user_id),
    updated_at = now();
  
  RETURN TRUE;
END;
$$;