// Temporarily disabled - database schema not yet created
export interface LiveZoozReaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
  amount?: number;
  isOwn?: boolean;
  animationId?: string;
}

export const useZoozReactions = (_postId?: string, _userId?: string) => {
  return {
    reactions: [],
    liveReactions: [] as LiveZoozReaction[],
    loading: false,
    addReaction: async (_a: any, _b?: any) => ({ error: 'Database not initialized' }),
    addZoozReaction: (_emoji?: string | number, _x?: number, _y?: number) => {},
  };
};
