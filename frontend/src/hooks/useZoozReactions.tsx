import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ZoozReaction {
  id: string;
  post_id: string;
  user_id: string | null;
  amount: number;
  x_position: number | null;
  y_position: number | null;
  created_at: string;
}

export interface LiveZoozReaction extends ZoozReaction {
  animationId: string;
  isOwn?: boolean;
}

export const useZoozReactions = (postId: string, currentUserId?: string) => {
  const [liveReactions, setLiveReactions] = useState<LiveZoozReaction[]>([]);

  const addZoozReaction = async (x: number, y: number, amount: number = 1) => {
    try {
      const { data, error } = await supabase
        .from('zooz_reactions')
        .insert({
          post_id: postId,
          user_id: currentUserId,
          amount,
          x_position: x,
          y_position: y,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding zooz reaction:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!postId) return;

    const channel = supabase
      .channel(`zooz-reactions-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'zooz_reactions',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          const newReaction = payload.new as ZoozReaction;
          const liveReaction: LiveZoozReaction = {
            ...newReaction,
            animationId: `zooz-${Date.now()}-${Math.random()}`,
            isOwn: newReaction.user_id === currentUserId
          };

          setLiveReactions(prev => [...prev, liveReaction]);

          // Remove reaction after animation completes
          setTimeout(() => {
            setLiveReactions(prev => 
              prev.filter(r => r.animationId !== liveReaction.animationId)
            );
          }, 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, currentUserId]);

  return {
    liveReactions,
    addZoozReaction
  };
};