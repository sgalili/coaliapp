import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface PostData {
  id: string;
  user_id: string;
  title: string | null;
  content: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  category: string | null;
  domain: string | null;
  view_count: number;
  zooz_earned: number;
  trust_count: number;
  watch_count: number;
  comment_count: number;
  share_count: number;
  is_live: boolean;
  created_at: string;
  updated_at: string;
  // Joined data from profiles
  profiles?: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export const usePosts = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!inner (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Erreur lors du chargement des posts');
    } finally {
      setLoading(false);
    }
  };

  const uploadVideo = async (videoBlob: Blob): Promise<string | null> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const fileName = `${user.id}/${Date.now()}.webm`;
      
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoBlob, {
          contentType: 'video/webm',
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  };

  const createPost = async (postData: {
    content: string;
    videoBlob?: Blob;
    category?: string;
    isLive?: boolean;
  }): Promise<PostData | null> => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return null;
    }

    setUploading(true);
    try {
      let videoUrl = null;

      // Upload video if provided
      if (postData.videoBlob) {
        videoUrl = await uploadVideo(postData.videoBlob);
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: postData.content,
          video_url: videoUrl,
          category: postData.category,
          is_live: postData.isLive || false,
        })
        .select(`
          *,
          profiles!inner (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Add to local state
      setPosts(prev => [data, ...prev]);

      // Reward user for posting
      if (user.id) {
        await supabase.rpc('reward_zooz', {
          target_user: user.id,
          p_amount: 10,
          reason: 'Publication de contenu',
          p_post: data.id
        });
      }

      toast.success('Post publié avec succès ! +10 ZOOZ');
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Erreur lors de la publication');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deletePost = async (postId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id); // Security: only delete own posts

      if (error) throw error;

      // Remove from local state
      setPosts(prev => prev.filter(p => p.id !== postId));
      toast.success('Post supprimé');
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Erreur lors de la suppression');
      return false;
    }
  };

  const updatePostCounts = (postId: string, updates: {
    view_count?: number;
    trust_count?: number;
    watch_count?: number;
    zooz_earned?: number;
  }) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, ...updates }
        : post
    ));
  };

  return {
    posts,
    loading,
    uploading,
    fetchPosts,
    createPost,
    deletePost,
    updatePostCounts,
  };
};