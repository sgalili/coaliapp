import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIsDemoMode } from './useIsDemoMode';

export interface Post {
  id: string;
  user_id: string;
  title?: string;
  content?: string;
  video_url?: string;
  thumbnail_url?: string;
  trust_count: number;
  watch_count: number;
  comment_count: number;
  share_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  domain?: string;
  category?: string;
  zooz_earned?: number;
}

export const usePosts = () => {
  const { isDemoMode } = useIsDemoMode();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const tableName = isDemoMode ? 'demo_posts' : 'posts';
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPosts = async (userId: string) => {
    try {
      setIsLoading(true);
      const tableName = isDemoMode ? 'demo_posts' : 'posts';
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [isDemoMode]);

  return {
    posts,
    isLoading,
    error,
    fetchPosts,
    fetchUserPosts,
  };
};
