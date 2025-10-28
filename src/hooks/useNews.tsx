import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIsDemoMode } from './useIsDemoMode';

export interface NewsArticle {
  id: string;
  title: string;
  description?: string;
  content?: string;
  category: string;
  source: string;
  thumbnail_url?: string;
  published_at: string;
  view_count: number;
  comment_count: number;
}

export const useNews = () => {
  const { isDemoMode } = useIsDemoMode();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const tableName = isDemoMode ? 'demo_news_articles' : 'news_articles';
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setNews(data || []);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [isDemoMode]);

  return {
    news,
    isLoading,
    error,
  };
};
