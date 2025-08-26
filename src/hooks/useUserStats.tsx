import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserStats {
  trust_score: number;
  profile_views: number;
  posts_count: number;
  comments_count: number;
  trust_received: number;
  trust_given: number;
  watch_count: number;
}

export interface TrustRankData {
  score: number;
  trendDay: 'up' | 'down' | 'stable';
  trendWeek: 'up' | 'down' | 'stable';
  weights: {
    strongUserWeightPct: number;
    avgTrustPower: number;
    lastBoost: number;
    gen: number[];
    removalsImpact: number;
  };
  qualityVsQuantity: {
    strongEqualsRegular: number;
    kRegular: number;
  };
  supporters: Array<{
    name: string;
    powerW: number;
  }>;
  ai: {
    percentileWeekTop: number;
    forecastTarget7d: number;
    top50Needed: number;
    growthFasterThanPct: number;
  };
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [trustRank, setTrustRank] = useState<TrustRankData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchUserStats = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Get or create user stats
      let { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      if (!userStats) {
        // Create initial stats
        await supabase.rpc('update_user_stats', { p_user_id: user.id });
        
        const { data: newStats, error: newStatsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (newStatsError) throw newStatsError;
        userStats = newStats;
      }

      setStats(userStats);

      // Generate mock trust rank data based on user stats
      const mockTrustRank: TrustRankData = {
        score: Math.max(500, userStats.trust_score + Math.floor(Math.random() * 500)),
        trendDay: Math.random() > 0.5 ? 'up' : 'down',
        trendWeek: Math.random() > 0.5 ? 'up' : 'down',
        weights: {
          strongUserWeightPct: 62,
          avgTrustPower: 1.8,
          lastBoost: 24,
          gen: [55, 30, 15],
          removalsImpact: 12
        },
        qualityVsQuantity: {
          strongEqualsRegular: 1,
          kRegular: 12
        },
        supporters: [
          { name: "@LeaderOne", powerW: 5.2 },
          { name: "@CivicPro", powerW: 3.9 },
          { name: "@TechGuru", powerW: 4.1 },
          { name: "@CommunityChamp", powerW: 2.8 }
        ],
        ai: {
          percentileWeekTop: Math.floor(Math.random() * 50) + 10,
          forecastTarget7d: userStats.trust_score + 50,
          top50Needed: Math.floor(Math.random() * 5) + 1,
          growthFasterThanPct: Math.floor(Math.random() * 40) + 40
        }
      };

      setTrustRank(mockTrustRank);

    } catch (err: any) {
      console.error('Error fetching user stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileViews = async () => {
    if (!user?.id) return;

    try {
      const { data: currentStats } = await supabase
        .from('user_stats')
        .select('profile_views')
        .eq('user_id', user.id)
        .single();

      const newViews = (currentStats?.profile_views || 0) + 1;
      
      await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          profile_views: newViews
        });
    } catch (err: any) {
      console.error('Error updating profile views:', err);
    }
  };

  const refreshStats = async () => {
    if (!user?.id) return;
    
    try {
      await supabase.rpc('update_user_stats', { p_user_id: user.id });
      await fetchUserStats();
    } catch (err: any) {
      console.error('Error refreshing stats:', err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
    }
  }, [user?.id]);

  return {
    stats,
    trustRank,
    loading,
    error,
    fetchUserStats,
    updateProfileViews,
    refreshStats
  };
};