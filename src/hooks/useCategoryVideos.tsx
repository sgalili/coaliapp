import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VideoResult {
  id: string;
  username: string;
  expertise: string;
  profileImage: string;
  videoUrl: string;
  caption: string;
  location: string;
  isVerified: boolean;
  isLive: boolean;
  category: string;
  voteCount: number;
  zoozCount: number;
  trustCount: number;
  watchCount: number;
  commentCount: number;
  hasUserTrusted: boolean;
  hasUserWatched: boolean;
}

export const useCategoryVideos = (category: string) => {
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching videos for category:', category);
        
        const { data, error: functionError } = await supabase.functions.invoke('fetch-category-videos', {
          body: { category }
        });

        if (functionError) {
          console.error('Error fetching videos:', functionError);
          setError(functionError.message);
          return;
        }

        if (data?.videos) {
          // Transform the API response to match our post structure
          const transformedVideos: VideoResult[] = data.videos.map((video: any, index: number) => ({
            id: video.id || `${category}-${index}`,
            username: video.source || 'News Network',
            expertise: getCategoryLabel(category),
            profileImage: video.thumbnail || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=150&h=150&fit=crop',
            videoUrl: video.url,
            caption: video.title,
            location: 'ישראל',
            isVerified: true,
            isLive: false,
            category: category,
            voteCount: 0,
            zoozCount: Math.floor(Math.random() * 50000) + 10000,
            trustCount: Math.floor(Math.random() * 100000) + 50000,
            watchCount: Math.floor(Math.random() * 500000) + 100000,
            commentCount: Math.floor(Math.random() * 10000) + 1000,
            hasUserTrusted: false,
            hasUserWatched: false,
          }));

          console.log('Transformed videos:', transformedVideos);
          setVideos(transformedVideos);
        }
      } catch (err) {
        console.error('Error in useCategoryVideos:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    if (category && category !== 'all') {
      fetchVideos();
    } else {
      setVideos([]);
      setLoading(false);
    }
  }, [category]);

  return { videos, loading, error };
};

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'politics': 'פוליטיקה',
    'economy': 'כלכלה',
    'technology': 'טכנולוגיה',
    'health': 'בריאות',
    'business': 'עסקים',
    'culture': 'תרבות',
    'society': 'חברה'
  };
  return labels[category] || 'חדשות';
}