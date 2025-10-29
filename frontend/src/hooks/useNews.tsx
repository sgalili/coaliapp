import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  thumbnail_url?: string;
  thumbnail: string; // Mapped from thumbnail_url
  category: string;
  source: string;
  published_at: string;
  publishedAt: string; // Mapped from published_at
  view_count: number;
  comment_count: number;
  comments: NewsComment[]; // Required for compatibility
}

export interface NewsComment {
  id: string;
  news_article_id: string;
  user_id: string;
  userId: string; // Mapped from user_id
  content?: string;
  video_url?: string;
  videoUrl: string; // Mapped from video_url
  duration: number; // Required
  created_at: string;
  timestamp: string; // Mapped from created_at
  trust_count: number;
  trustLevel: number; // Mapped from trust_count
  watch_count: number;
  like_count: number;
  likes: number; // Mapped from like_count
  reply_count: number;
  replies: number; // Mapped from reply_count
  share_count: number;
  user_profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  username: string; // Mapped from profile
  userImage?: string; // Mapped from profile avatar
  kyc_level: 1 | 2 | 3;
  kycLevel: 1 | 2 | 3; // Alternative mapping
  category: string; // For compatibility
}

export const useNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNews = async (category?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('news_articles')
        .select(`
          *,
          news_comments (
            *,
            profiles:user_id (
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (category && category !== 'all' && category !== 'trending') {
        const categoryMap: { [key: string]: string } = {
          politics: 'פוליטיקה',
          technology: 'טכנולוגיה',
          economy: 'כלכלה',
          sports: 'ספורט',
          culture: 'תרבות'
        };
        if (categoryMap[category]) {
          query = query.eq('category', categoryMap[category]);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      let processedData = data?.map(article => ({
        ...article,
        thumbnail: article.thumbnail_url || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=300&h=200&fit=crop',
        publishedAt: article.published_at,
        comments: article.news_comments?.map((comment: any) => ({
          ...comment,
          userId: comment.user_id,
          videoUrl: comment.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          timestamp: comment.created_at,
          trustLevel: comment.trust_count,
          likes: comment.like_count,
          replies: comment.reply_count,
          user_profile: comment.profiles,
          kyc_level: Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3,
          kycLevel: Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3,
          username: comment.profiles ? `${comment.profiles.first_name} ${comment.profiles.last_name}` : 'משתמש אנונימי',
          userImage: comment.profiles?.avatar_url,
          category: article.category
        })) || []
      })) || [];

      // Handle trending sort
      if (category === 'trending') {
        processedData = processedData.sort((a, b) => {
          const aTrustSum = a.comments?.reduce((sum, comment) => sum + comment.trust_count, 0) || 0;
          const bTrustSum = b.comments?.reduce((sum, comment) => sum + comment.trust_count, 0) || 0;
          return bTrustSum - aTrustSum;
        });
      }

      setArticles(processedData);
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewsComment = async (newsId: string, content: string, videoUrl?: string, duration?: number) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await supabase
        .from('news_comments')
        .insert({
          news_article_id: newsId,
          user_id: user.id,
          content,
          video_url: videoUrl,
          duration
        })
        .select()
        .single();

      if (error) throw error;

      // Update comment count
      await supabase.rpc('increment_news_view_count', { news_id: newsId });
      
      return data;
    } catch (err: any) {
      console.error('Error creating news comment:', err);
      throw err;
    }
  };

  const interactWithNewsComment = async (commentId: string, interactionType: 'trust' | 'watch' | 'like' | 'share') => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await supabase
        .from('news_interactions')
        .upsert({
          user_id: user.id,
          news_comment_id: commentId,
          interaction_type: interactionType
        });

      if (error) throw error;

      // Update the comment's interaction count
      const updateField = `${interactionType}_count`;
      await supabase
        .from('news_comments')
        .update({ [updateField]: 1 }) // Simple increment, not using SQL
        .eq('id', commentId);

    } catch (err: any) {
      console.error('Error interacting with news comment:', err);
      throw err;
    }
  };

  const incrementNewsView = async (newsId: string) => {
    try {
      await supabase.rpc('increment_news_view_count', { news_id: newsId });
    } catch (err: any) {
      console.error('Error incrementing news view:', err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    articles,
    loading,
    error,
    fetchNews,
    createNewsComment,
    interactWithNewsComment,
    incrementNewsView
  };
};