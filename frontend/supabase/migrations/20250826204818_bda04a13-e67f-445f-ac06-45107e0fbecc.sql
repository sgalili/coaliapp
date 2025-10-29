-- Create news articles table
CREATE TABLE public.news_articles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  content text,
  thumbnail_url text,
  category text NOT NULL,
  source text NOT NULL,
  published_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  view_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  is_published boolean DEFAULT true
);

-- Create news comments table (separate from regular post comments)
CREATE TABLE public.news_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_article_id uuid NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text,
  video_url text,
  duration integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  trust_count integer DEFAULT 0,
  watch_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  reply_count integer DEFAULT 0,
  share_count integer DEFAULT 0
);

-- Create user stats table for tracking user performance
CREATE TABLE public.user_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  trust_score integer DEFAULT 0,
  profile_views integer DEFAULT 0,
  posts_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  trust_received integer DEFAULT 0,
  trust_given integer DEFAULT 0,
  watch_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create news interactions table (trust, watch, etc. on news comments)
CREATE TABLE public.news_interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  news_comment_id uuid NOT NULL REFERENCES public.news_comments(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('trust', 'watch', 'like', 'share')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, news_comment_id, interaction_type)
);

-- Enable RLS
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_interactions ENABLE ROW LEVEL SECURITY;

-- News articles policies (public read, admin write)
CREATE POLICY "News articles are viewable by everyone"
ON public.news_articles
FOR SELECT
USING (is_published = true);

-- News comments policies
CREATE POLICY "News comments are viewable by everyone"
ON public.news_comments
FOR SELECT
USING (true);

CREATE POLICY "Users can create news comments"
ON public.news_comments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own news comments"
ON public.news_comments
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own news comments"
ON public.news_comments
FOR DELETE
USING (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "Users can view their own stats"
ON public.user_stats
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
ON public.user_stats
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
ON public.user_stats
FOR UPDATE
USING (auth.uid() = user_id);

-- News interactions policies
CREATE POLICY "Users can view all news interactions"
ON public.news_interactions
FOR SELECT
USING (true);

CREATE POLICY "Users can create their own interactions"
ON public.news_interactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions"
ON public.news_interactions
FOR DELETE
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_news_articles_updated_at
BEFORE UPDATE ON public.news_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_comments_updated_at
BEFORE UPDATE ON public.news_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
BEFORE UPDATE ON public.user_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample news articles
INSERT INTO public.news_articles (title, description, category, source, thumbnail_url) VALUES
('הכנסת אישרה את חוק השידור החדש - מה זה אומר על העתיד של התקשורת?', 'החוק החדש יעמיד אתגרים חדשים בפני התאגיד החדש של השידור הישראלי ויכול לשנות את פני התקשורת', 'פוליטיקה', 'חדשות 12', 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=300&h=200&fit=crop'),
('פריצת דרך בטכנולוגיית הבלוקצ''יין - סטארט-אפ ישראלי פיתח פתרון חדשני', 'הטכנולוגיה החדשה יכולה לשנות את עולם הפיננסים הדיגיטליים ולהביא לשקיפות רבה יותר', 'טכנולוגיה', 'גלובס', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop'),
('עליה חדה במחירי הדיור - מה הפתרונות האפשריים?', 'מחירי הדיור ממשיכים לטפס ומעוררים דאגה רבה בקרב צעירים הרוצים לרכוש דירה ראשונה', 'כלכלה', 'כלכליסט', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop'),
('המכבי תל אביב זכתה באליפות - חגיגות ברחובות העיר', 'אלפי אוהדים יצאו לרחובות לחגוג את הזכייה המרגשת של המכבי תל אביב באליפות המדינה', 'ספורט', 'ספורט 5', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop');

-- Functions for news system
CREATE OR REPLACE FUNCTION public.increment_news_view_count(news_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.news_articles 
  SET view_count = view_count + 1 
  WHERE id = news_id;
  RETURN TRUE;
END;
$$;

-- Function to update user stats
CREATE OR REPLACE FUNCTION public.update_user_stats(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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