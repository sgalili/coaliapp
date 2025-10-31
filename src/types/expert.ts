export interface Expert {
  id: string;
  rank: number;
  name: string;
  username?: string;
  category: string;
  bio?: string;
  avatar: string;
  verified: boolean;
  trusters: number;
  weeklyChange: number;
  tags: string[];
  trending?: boolean;
  trustedByUser?: boolean;
  followers?: number;
  expertise: ExpertDomain[];
  stats: {
    trustCount: number;
    trustRate: number;
    views: number;
    kycLevel: number;
  };
}

export type ExpertDomain = 'economy' | 'tech' | 'education' | 'health' | 'security' | 'culture';
