import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { DomainFilter } from "@/components/DomainFilter";
import { ExpertStoriesSection } from "@/components/ExpertStoriesSection";
import { ExpertDiscoveryStack } from "@/components/ExpertDiscoveryStack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Award } from "lucide-react";

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
  const [selectedDomain, setSelectedDomain] = useState<ExpertDomain | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'trusted' | 'discovery'>('trusted');

  const filteredExperts = mockExperts.filter(expert => 
    selectedDomain === 'all' || expert.expertise.includes(selectedDomain as ExpertDomain)
  );

  const trustedExperts = filteredExperts.filter(expert => expert.trustedByUser);
  const discoveryExperts = filteredExperts.filter(expert => !expert.trustedByUser);

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">מובילים בקהילה</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span className="text-xs">{mockExperts.length}</span>
              </Badge>
            </div>
          </div>
          
          {/* Domain Filter */}
          <DomainFilter 
            selectedDomain={selectedDomain} 
            onDomainChange={setSelectedDomain}
          />
          
          {/* Tabs */}
          <div className="flex gap-1 mt-4 bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab('trusted')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'trusted' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              האמונים שלי ({trustedExperts.length})
            </button>
            <button
              onClick={() => setActiveTab('discovery')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'discovery' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              מומלצים לגילוי ({discoveryExperts.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'trusted' ? (
          <div className="p-4">
            {trustedExperts.length > 0 ? (
              <ExpertStoriesSection experts={trustedExperts} />
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    עדיין לא בחרת אנשי אמון בתחום זה
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="h-full">
            {discoveryExperts.length > 0 ? (
              <ExpertDiscoveryStack experts={discoveryExperts} />
            ) : (
              <div className="p-4">
                <Card className="text-center py-8">
                  <CardContent>
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      אין המלצות חדשות בתחום זה כרגע
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      <Navigation zoozBalance={zoozBalance} />
    </div>
  );
};

export default TopTrustedPage;