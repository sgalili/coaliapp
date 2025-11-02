// Temporarily disabled - database schema not yet created
export const useUserStats = () => {
  return {
    stats: { 
      trustRank: 0,
      trust_received: 0,
      trust_given: 0,
      profile_views: 0,
      posts_count: 0,
      comments_count: 0,
      trust_score: 0,
    },
    trustRank: {
      score: 0,
      trendDay: 'stable' as 'up' | 'down' | 'stable',
      trendWeek: 'stable' as 'up' | 'down' | 'stable',
      ai: { 
        insights: [],
        percentileWeekTop: 0,
        forecastTarget7d: 0,
        top50Needed: 0,
        growthFasterThanPct: 0,
      },
      weights: {
        strongUserWeightPct: 0,
        avgTrustPower: 0,
        lastBoost: 0,
        gen: [],
        removalsImpact: 0,
      },
      qualityVsQuantity: { 
        quality: 0, 
        quantity: 0,
        strongEqualsRegular: 0,
        kRegular: 0,
      },
      supporters: []
    },
    loading: false,
    refreshStats: async () => {},
  };
};
