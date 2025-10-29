import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const usePostInteractions = () => {
  const { user } = useAuth();
  const [userTrusts, setUserTrusts] = useState<Set<string>>(new Set());
  const [userWatches, setUserWatches] = useState<Set<string>>(new Set());
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserInteractions();
      fetchUserBalance();
    }
  }, [user]);

  const fetchUserInteractions = async () => {
    if (!user) return;

    try {
      // Fetch user's trusts
      const { data: trusts } = await supabase
        .from('trusts')
        .select('trusted_id, post_id')
        .eq('truster_id', user.id);

      // Fetch user's watches  
      const { data: watches } = await supabase
        .from('watches')
        .select('watched_id, post_id')
        .eq('watcher_id', user.id);

      if (trusts) {
        const trustKeys = trusts.map(t => `${t.trusted_id}-${t.post_id}`);
        setUserTrusts(new Set(trustKeys));
      }

      if (watches) {
        const watchKeys = watches.map(w => `${w.watched_id}-${w.post_id}`);
        setUserWatches(new Set(watchKeys));
      }
    } catch (error) {
      console.error('Error fetching user interactions:', error);
    }
  };

  const fetchUserBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_balances')
        .select('zooz_balance')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setUserBalance(data?.zooz_balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
      // Initialize balance if not exists
      await supabase.rpc('init_user_balance', { p_user: user.id });
      setUserBalance(0);
    }
  };

  const giveTrust = async (postId: string, trustedUserId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return false;
    }

    const trustKey = `${trustedUserId}-${postId}`;
    
    try {
      if (userTrusts.has(trustKey)) {
        // Remove trust
        const { error } = await supabase
          .from('trusts')
          .delete()
          .eq('truster_id', user.id)
          .eq('trusted_id', trustedUserId)
          .eq('post_id', postId);

        if (error) throw error;
        
        setUserTrusts(prev => {
          const newSet = new Set(prev);
          newSet.delete(trustKey);
          return newSet;
        });

        toast.success('Trust retiré');
      } else {
        // Add trust
        const { error } = await supabase
          .from('trusts')
          .insert({
            truster_id: user.id,
            trusted_id: trustedUserId,
            post_id: postId,
          });

        if (error) throw error;

        setUserTrusts(prev => new Set(prev).add(trustKey));

        // Reward both users
        await supabase.rpc('reward_zooz', {
          target_user: trustedUserId,
          p_amount: 5,
          reason: 'Trust reçu',
          p_post: postId
        });

        toast.success('Trust donné ! +5 ZOOZ au créateur');
      }

      return true;
    } catch (error) {
      console.error('Error managing trust:', error);
      toast.error('Erreur lors de la gestion du trust');
      return false;
    }
  };

  const toggleWatch = async (postId: string, watchedUserId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return false;
    }

    const watchKey = `${watchedUserId}-${postId}`;
    
    try {
      if (userWatches.has(watchKey)) {
        // Remove watch
        const { error } = await supabase
          .from('watches')
          .delete()
          .eq('watcher_id', user.id)
          .eq('watched_id', watchedUserId)
          .eq('post_id', postId);

        if (error) throw error;
        
        setUserWatches(prev => {
          const newSet = new Set(prev);
          newSet.delete(watchKey);
          return newSet;
        });

        toast.success('Ne suit plus');
      } else {
        // Add watch
        const { error } = await supabase
          .from('watches')
          .insert({
            watcher_id: user.id,
            watched_id: watchedUserId,
            post_id: postId,
          });

        if (error) throw error;

        setUserWatches(prev => new Set(prev).add(watchKey));
        toast.success('Vous suivez maintenant ce créateur');
      }

      return true;
    } catch (error) {
      console.error('Error managing watch:', error);
      toast.error('Erreur lors de la gestion du suivi');
      return false;
    }
  };

  const sendZooz = async (postId: string, toUserId: string, amount: number = 1): Promise<boolean> => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return false;
    }

    if (userBalance < amount) {
      toast.error('Solde ZOOZ insuffisant');
      return false;
    }

    try {
      const success = await supabase.rpc('transfer_zooz', {
        from_user: user.id,
        to_user: toUserId,
        p_amount: amount,
        p_description: 'Support créateur',
        p_post: postId
      });

      if (success) {
        setUserBalance(prev => prev - amount);
        toast.success(`${amount} ZOOZ envoyé !`);
        return true;
      } else {
        toast.error('Échec de l\'envoi des ZOOZ');
        return false;
      }
    } catch (error) {
      console.error('Error sending ZOOZ:', error);
      toast.error('Erreur lors de l\'envoi des ZOOZ');
      return false;
    }
  };

  const updateView = async (postId: string): Promise<void> => {
    try {
      const { error } = await supabase.rpc('increment_post_views', { p_post_id: postId });
      if (error) console.error('Error updating view count:', error);
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const isTrusted = (postId: string, trustedUserId: string): boolean => {
    return userTrusts.has(`${trustedUserId}-${postId}`);
  };

  const isWatched = (postId: string, watchedUserId: string): boolean => {
    return userWatches.has(`${watchedUserId}-${postId}`);
  };

  return {
    userBalance,
    giveTrust,
    toggleWatch,
    sendZooz,
    updateView,
    isTrusted,
    isWatched,
    refreshBalance: fetchUserBalance,
  };
};