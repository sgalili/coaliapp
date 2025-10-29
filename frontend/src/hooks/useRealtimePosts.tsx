import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostData } from './usePosts';

export const useRealtimePosts = (
  posts: PostData[],
  onPostUpdate: (postId: string, updates: Partial<PostData>) => void,
  onNewPost: (post: PostData) => void
) => {
  useEffect(() => {
    // Subscribe to posts changes
    const postsChannel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          console.log('New post:', payload);
          // Fetch the complete post with profile data
          fetchFullPost(payload.new.id).then(post => {
            if (post) onNewPost(post);
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          console.log('Post updated:', payload);
          onPostUpdate(payload.new.id, payload.new as Partial<PostData>);
        }
      )
      .subscribe();

    // Subscribe to trust changes
    const trustsChannel = supabase
      .channel('trusts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trusts'
        },
        (payload) => {
          console.log('Trust changed:', payload);
          if (payload.new && 'post_id' in payload.new && payload.new.post_id) {
            // Update trust count for the post
            updatePostTrustCount(payload.new.post_id as string);
          } else if (payload.old && 'post_id' in payload.old && payload.old.post_id) {
            // Handle deletion
            updatePostTrustCount(payload.old.post_id as string);
          }
        }
      )
      .subscribe();

    // Subscribe to watch changes
    const watchesChannel = supabase
      .channel('watches-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'watches'
        },
        (payload) => {
          console.log('Watch changed:', payload);
          if (payload.new && 'post_id' in payload.new && payload.new.post_id) {
            updatePostWatchCount(payload.new.post_id as string);
          } else if (payload.old && 'post_id' in payload.old && payload.old.post_id) {
            updatePostWatchCount(payload.old.post_id as string);
          }
        }
      )
      .subscribe();

    // Subscribe to ZOOZ transactions
    const zoozChannel = supabase
      .channel('zooz-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'zooz_transactions'
        },
        (payload) => {
          console.log('ZOOZ transaction:', payload);
          if (payload.new && 'post_id' in payload.new && payload.new.post_id) {
            updatePostZoozCount(payload.new.post_id as string);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(trustsChannel);  
      supabase.removeChannel(watchesChannel);
      supabase.removeChannel(zoozChannel);
    };
  }, [posts, onPostUpdate, onNewPost]);

  const fetchFullPost = async (postId: string): Promise<PostData | null> => {
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
        .eq('id', postId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching full post:', error);
      return null;
    }
  };

  const updatePostTrustCount = async (postId: string) => {
    try {
      const { count } = await supabase
        .from('trusts')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      onPostUpdate(postId, { trust_count: count || 0 });
    } catch (error) {
      console.error('Error updating trust count:', error);
    }
  };

  const updatePostWatchCount = async (postId: string) => {
    try {
      const { count } = await supabase
        .from('watches')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      onPostUpdate(postId, { watch_count: count || 0 });
    } catch (error) {
      console.error('Error updating watch count:', error);
    }
  };

  const updatePostZoozCount = async (postId: string) => {
    try {
      const { data } = await supabase
        .from('zooz_transactions')
        .select('amount')
        .eq('post_id', postId);

      const totalZooz = data?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
      onPostUpdate(postId, { zooz_earned: totalZooz });
    } catch (error) {
      console.error('Error updating ZOOZ count:', error);
    }
  };
};