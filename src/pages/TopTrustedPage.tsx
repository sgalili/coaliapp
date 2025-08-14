import { DomainSection } from "@/components/DomainSection";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export type ExpertDomain = 'economy' | 'tech' | 'education' | 'health' | 'security' | 'culture';

export interface Expert {
  id: string;
  name: string;
  avatar: string;
  expertise: ExpertDomain[];
  stats: {
    trustCount: number;
    views: number;
    trustRate: number;
    kycLevel: number;
  };
  trustedByUser: boolean;
  trending: boolean;
  verified: boolean;
}

const mockExperts: Expert[] = [
  {
    id: '1',
    name: 'אמית כהן',
    avatar: '/src/assets/amit-profile.jpg',
    expertise: ['economy', 'tech'],
    stats: { trustCount: 2847, views: 45200, trustRate: 6.3, kycLevel: 3 },
    trustedByUser: true,
    trending: true,
    verified: true
  },
  {
    id: '2', 
    name: 'שרה לוי',
    avatar: '/src/assets/sarah-profile.jpg',
    expertise: ['education', 'culture'],
    stats: { trustCount: 1523, views: 18900, trustRate: 8.1, kycLevel: 2 },
    trustedByUser: true,
    trending: false,
    verified: true
  },
  {
    id: '3',
    name: 'דוד מושקוביץ',
    avatar: '/src/assets/david-profile.jpg', 
    expertise: ['security', 'tech'],
    stats: { trustCount: 856, views: 12400, trustRate: 6.9, kycLevel: 2 },
    trustedByUser: false,
    trending: true,
    verified: true
  },
  {
    id: '4',
    name: 'מאיה רוזן',
    avatar: '/src/assets/maya-profile.jpg',
    expertise: ['health', 'education'],
    stats: { trustCount: 1234, views: 15600, trustRate: 7.9, kycLevel: 3 },
    trustedByUser: false,
    trending: false,
    verified: true
  },
  {
    id: '5',
    name: 'רחל אברהם',
    avatar: '/src/assets/rachel-profile.jpg',
    expertise: ['economy', 'culture'],
    stats: { trustCount: 3421, views: 58300, trustRate: 5.9, kycLevel: 2 },
    trustedByUser: true,
    trending: false,
    verified: true
  },
  {
    id: '6',
    name: 'נועה שמואל',
    avatar: '/src/assets/noa-profile.jpg',
    expertise: ['tech', 'education'],
    stats: { trustCount: 987, views: 11200, trustRate: 8.8, kycLevel: 3 },
    trustedByUser: false,
    trending: true,
    verified: true
  }
];

const TopTrustedPage = () => {
  const zoozBalance = 1250;
  
  const domains: ExpertDomain[] = ['economy', 'security', 'education', 'health', 'tech', 'culture'];

  return (
    <div className="h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex flex-col">
      {/* Simplified Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">אנשי אמון מובילים</h1>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="text-xs">{mockExperts.length}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Domain Sections Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="pt-4">
          {domains.map((domain) => (
            <DomainSection
              key={domain}
              domain={domain}
              experts={mockExperts}
            />
          ))}
        </div>
      </div>

      <Navigation zoozBalance={zoozBalance} />
    </div>
  );
};

export default TopTrustedPage;