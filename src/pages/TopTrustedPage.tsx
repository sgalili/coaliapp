import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { TrustedUserCard } from "@/components/TrustedUserCard";
import { ProfileOverlay } from "@/components/ProfileOverlay";
import { SearchModal } from "@/components/SearchModal";
import { CategoryFilterModal } from "@/components/CategoryFilterModal";
import { useToast } from "@/hooks/use-toast";
import amitProfile from "@/assets/amit-profile.jpg";
import sarahProfile from "@/assets/sarah-profile.jpg";
import davidProfile from "@/assets/david-profile.jpg";
import mayaProfile from "@/assets/maya-profile.jpg";
import rachelProfile from "@/assets/rachel-profile.jpg";
import noaProfile from "@/assets/noa-profile.jpg";

export type ExpertDomain = 'economy' | 'tech' | 'education' | 'health' | 'security' | 'culture';

export interface Expert {
  id: string;
  name: string;
  avatar: string;
  username?: string;
  bio?: string;
  followers?: number;
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
    avatar: amitProfile,
    username: 'amit_cohen',
    bio: 'מומחה כלכלה וטכנולוגיה, יועץ השקעות ומרצה בכיר באוניברסיטת תל אביב',
    followers: 12500,
    expertise: ['economy', 'tech'],
    stats: { trustCount: 2847, views: 45200, trustRate: 6.3, kycLevel: 3 },
    trustedByUser: true,
    trending: true,
    verified: true
  },
  {
    id: '2', 
    name: 'שרה לוי',
    avatar: sarahProfile,
    username: 'sarah_education',
    bio: 'חוקרת חינוך, מומחית פדגוגיה דיגיטלית ויועצת ארגונית',
    followers: 8900,
    expertise: ['education', 'culture'],
    stats: { trustCount: 1523, views: 18900, trustRate: 8.1, kycLevel: 2 },
    trustedByUser: true,
    trending: false,
    verified: true
  },
  {
    id: '3',
    name: 'דוד מושקוביץ',
    avatar: davidProfile,
    username: 'david_security',
    bio: 'מומחה אבטחת מידע, יועץ סייבר וחוקר באקדמיה',
    followers: 5600,
    expertise: ['security', 'tech'],
    stats: { trustCount: 856, views: 12400, trustRate: 6.9, kycLevel: 2 },
    trustedByUser: false,
    trending: true,
    verified: true
  },
  {
    id: '4',
    name: 'מאיה רוזן',
    avatar: mayaProfile,
    username: 'maya_health',
    bio: 'רופאה מומחית, חוקרת בתחום הבריאות הדיגיטלית ומרצה',
    followers: 9800,
    expertise: ['health', 'education'],
    stats: { trustCount: 1234, views: 15600, trustRate: 7.9, kycLevel: 3 },
    trustedByUser: false,
    trending: false,
    verified: true
  },
  {
    id: '5',
    name: 'רחל אברהם',
    avatar: rachelProfile,
    username: 'rachel_economy',
    bio: 'כלכלנית בכירה, יועצת עסקית ומומחית בשווקים פיננסיים',
    followers: 15200,
    expertise: ['economy', 'culture'],
    stats: { trustCount: 3421, views: 58300, trustRate: 5.9, kycLevel: 2 },
    trustedByUser: true,
    trending: false,
    verified: true
  },
  {
    id: '6',
    name: 'נועה שמואל',
    avatar: noaProfile,
    username: 'noa_tech',
    bio: 'מפתחת תוכנה בכירה, מומחית בינה מלאכותית ומובילת צוותים',
    followers: 7300,
    expertise: ['tech', 'education'],
    stats: { trustCount: 987, views: 11200, trustRate: 8.8, kycLevel: 3 },
    trustedByUser: false,
    trending: true,
    verified: true
  },
  // Additional tech experts for testing horizontal scroll
  {
    id: '7',
    name: 'יוסי טכנולוגיה',
    avatar: amitProfile,
    expertise: ['tech'],
    stats: { trustCount: 1543, views: 22100, trustRate: 7.2, kycLevel: 2 },
    trustedByUser: true,
    trending: false,
    verified: true
  },
  {
    id: '8',
    name: 'ליאת קוד',
    avatar: sarahProfile,
    expertise: ['tech'],
    stats: { trustCount: 892, views: 13400, trustRate: 8.5, kycLevel: 3 },
    trustedByUser: false,
    trending: true,
    verified: true
  },
  {
    id: '9',
    name: 'אלון AI',
    avatar: davidProfile,
    expertise: ['tech'],
    stats: { trustCount: 2156, views: 34800, trustRate: 9.1, kycLevel: 3 },
    trustedByUser: false,
    trending: true,
    verified: true
  },
  {
    id: '10',
    name: 'תמר סייבר',
    avatar: mayaProfile,
    expertise: ['tech', 'security'],
    stats: { trustCount: 1789, views: 27600, trustRate: 7.8, kycLevel: 2 },
    trustedByUser: true,
    trending: false,
    verified: true
  },
  {
    id: '11',
    name: 'רועי בלוקצ\'יין',
    avatar: rachelProfile,
    expertise: ['tech', 'economy'],
    stats: { trustCount: 945, views: 16200, trustRate: 6.7, kycLevel: 2 },
    trustedByUser: false,
    trending: true,
    verified: true
  },
  {
    id: '12',
    name: 'ענת דטה',
    avatar: noaProfile,
    expertise: ['tech'],
    stats: { trustCount: 1334, views: 19800, trustRate: 8.3, kycLevel: 3 },
    trustedByUser: false,
    trending: false,
    verified: true
  }
];

const TopTrustedPage = () => {
  const zoozBalance = 1250;
  const { toast } = useToast();
  
  // State management
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<ExpertDomain[]>([]);

  // Filter and sort experts
  const filteredExperts = mockExperts
    .filter(expert => 
      selectedCategories.length === 0 || 
      expert.expertise.some(domain => selectedCategories.includes(domain))
    )
    .sort((a, b) => {
      // Sort by trust rate (highest first)
      if (a.trustedByUser && !b.trustedByUser) return -1;
      if (!a.trustedByUser && b.trustedByUser) return 1;
      return b.stats.trustRate - a.stats.trustRate;
    });

  const handleTrustClick = (expert: Expert) => {
    toast({
      title: expert.trustedByUser ? "הוסר אמון" : "נתן אמון",
      description: expert.trustedByUser 
        ? `הוסר האמון מ${expert.name}` 
        : `נתת אמון ל${expert.name}`,
      duration: 2000,
    });
  };

  const handleWatchClick = (expert: Expert) => {
    toast({
      title: "פתיחת פרופיל",
      description: `צפייה בתוכן של ${expert.name}`,
      duration: 2000,
    });
  };

  const handleMessageClick = () => {
    toast({
      title: "שליחת הודעה",
      description: "פתיחת צ'אט עם המשתמש",
      duration: 2000,
    });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex flex-col">
      {/* Modern Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">אנשי אמון מובילים</h1>
            
            {/* Search & Filter Icons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="h-9 w-9"
              >
                <Search className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsFilterOpen(true)}
                className="h-9 w-9 relative"
              >
                <Filter className="h-4 w-4" />
                {selectedCategories.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-primary rounded-full w-3 h-3 flex items-center justify-center">
                    <span className="text-[10px] text-primary-foreground font-bold">
                      {selectedCategories.length}
                    </span>
                  </div>
                )}
              </Button>
            </div>
          </div>
          
          {/* Filter indicator */}
          {selectedCategories.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              מציג {filteredExperts.length} מתוך {mockExperts.length} משתמשים
            </p>
          )}
        </div>
      </div>

      {/* Periscope-style Vertical List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {filteredExperts.map((expert) => (
            <TrustedUserCard
              key={expert.id}
              expert={expert}
              onProfileClick={() => setSelectedExpert(expert)}
              onTrustClick={() => handleTrustClick(expert)}
              onWatchClick={() => handleWatchClick(expert)}
            />
          ))}
          
          {filteredExperts.length === 0 && (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <p className="text-sm">לא נמצאו משתמשים בקטגוריות שנבחרו</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={zoozBalance} />

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allExperts={mockExperts}
      />

      <CategoryFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
      />

      {/* Profile Overlay */}
      {selectedExpert && (
        <ProfileOverlay
          expert={selectedExpert}
          isOpen={!!selectedExpert}
          onClose={() => setSelectedExpert(null)}
          onTrustClick={() => handleTrustClick(selectedExpert)}
          onMessageClick={handleMessageClick}
        />
      )}
    </div>
  );
};

export default TopTrustedPage;