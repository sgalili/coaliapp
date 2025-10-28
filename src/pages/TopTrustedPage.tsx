import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Search, Filter, TrendingUp } from "lucide-react";
import { TrustedUserCard } from "@/components/TrustedUserCard";
import { ProfileOverlay } from "@/components/ProfileOverlay";
import { SearchModal } from "@/components/SearchModal";
import { CategoryFilterModal } from "@/components/CategoryFilterModal";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { useToast } from "@/hooks/use-toast";
import { useIsDemoMode } from "@/hooks/useIsDemoMode";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export type ExpertDomain = 'economy' | 'tech' | 'education' | 'health' | 'security' | 'culture' | 'politics';

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
  trendingCount?: number;
  verified: boolean;
  rank?: number;
}

const TopTrustedPage = () => {
  const zoozBalance = 1250;
  const { toast } = useToast();
  const { isDemoMode, getDemoUserId } = useIsDemoMode();
  const navigate = useNavigate();

  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<ExpertDomain[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [trendingExperts, setTrendingExperts] = useState<Expert[]>([]);

  useEffect(() => {
    const fetchDemoExperts = async () => {
      if (!isDemoMode) return;

      const demoUserId = getDemoUserId();
      const { data: profiles } = await supabase
        .from('demo_profiles')
        .select('*');

      const { data: trusts } = await supabase
        .from('demo_trusts')
        .select('*');

      if (profiles) {
        // Create rich expert data from demo profiles
        const expertsData: Expert[] = profiles
          .map((profile, index) => {
            const trustCount = trusts?.filter(t => t.trusted_id === profile.user_id).length || 0;
            const isTrustedByUser = trusts?.some(t => t.truster_id === demoUserId && t.trusted_id === profile.user_id) || false;
            
            // Assign expertise based on name patterns
            let expertise: ExpertDomain[] = ['economy'];
            if (profile.first_name?.includes('טכנ') || profile.last_name?.includes('טכנ')) expertise = ['tech'];
            if (profile.first_name?.includes('רופ') || profile.last_name?.includes('בריאות')) expertise = ['health'];
            
            return {
              id: profile.user_id,
              name: `${profile.first_name} ${profile.last_name}`,
              avatar: profile.avatar_url || '/placeholder.svg',
              username: `@${profile.first_name}_${profile.last_name}`,
              bio: index === 0 ? 'כלכלן, מומחה לשוק ההון וכלכלת ישראל. לשעבר סמנכ"ל בנק ישראל' : 
                   `מומחה ${expertise[0] === 'economy' ? 'כלכלה' : expertise[0] === 'tech' ? 'טכנולוגיה' : 'בריאות'}`,
              followers: Math.floor(1000 + Math.random() * 15000),
              expertise,
              stats: {
                trustCount: index === 0 ? 12450 : trustCount + Math.floor(Math.random() * 5000),
                views: Math.floor(10000 + Math.random() * 50000),
                trustRate: 5 + Math.random() * 4,
                kycLevel: Math.floor(2 + Math.random() * 2),
              },
              trustedByUser: isTrustedByUser,
              trending: Math.random() > 0.6,
              trendingCount: Math.floor(50 + Math.random() * 300),
              verified: Math.random() > 0.3,
              rank: index + 1,
            };
          })
          .sort((a, b) => b.stats.trustCount - a.stats.trustCount);

        setExperts(expertsData);
        setTrendingExperts(expertsData.filter(e => e.trending).slice(0, 10));
      }
    };

    fetchDemoExperts();
  }, [isDemoMode, getDemoUserId]);

  const filteredExperts = experts.filter(expert => 
    selectedCategories.length === 0 || 
    expert.expertise.some(domain => selectedCategories.includes(domain))
  );

  const handleTrustClick = async (expert: Expert) => {
    if (!isDemoMode) return;

    const demoUserId = getDemoUserId();
    if (!demoUserId) return;

    if (expert.trustedByUser) {
      await supabase
        .from('demo_trusts')
        .delete()
        .eq('truster_id', demoUserId)
        .eq('trusted_id', expert.id);
      
      toast({
        title: "הוסר אמון",
        description: `הוסר האמון מ${expert.name}`,
        duration: 2000
      });
    } else {
      await supabase
        .from('demo_trusts')
        .insert({
          truster_id: demoUserId,
          trusted_id: expert.id
        });
      
      toast({
        title: "נתן אמון",
        description: `נתת אמון ל${expert.name}`,
        duration: 2000
      });
    }

    // Refresh experts
    const { data: trusts } = await supabase
      .from('demo_trusts')
      .select('*');

    setExperts(experts.map(e => 
      e.id === expert.id 
        ? { ...e, trustedByUser: !e.trustedByUser }
        : e
    ));
  };

  const handleProfileClick = (expert: Expert) => {
    navigate(`/user/${expert.id}`);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <DemoModeBanner />
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">מובילים בקואלי</h1>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(true)} className="relative">
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
          
          {selectedCategories.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              מציג {filteredExperts.length} מתוך {experts.length} משתמשים
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Trending Section */}
          {trendingExperts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold">עולים השבוע</h2>
              </div>
              <div className="space-y-2">
                {trendingExperts.slice(0, 5).map(expert => (
                  <TrustedUserCard
                    key={expert.id}
                    expert={expert}
                    onProfileClick={() => handleProfileClick(expert)}
                    onTrustClick={() => handleTrustClick(expert)}
                    onWatchClick={() => handleProfileClick(expert)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Users */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">כל המובילים</h2>
            <div className="space-y-2">
              {filteredExperts.map(expert => (
                <TrustedUserCard
                  key={expert.id}
                  expert={expert}
                  onProfileClick={() => handleProfileClick(expert)}
                  onTrustClick={() => handleTrustClick(expert)}
                  onWatchClick={() => handleProfileClick(expert)}
                />
              ))}
            </div>
          </div>
          
          {filteredExperts.length === 0 && (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <p className="text-sm">לא נמצאו משתמשים בקטגוריות שנבחרו</p>
            </div>
          )}
        </div>
      </div>

      <Navigation zoozBalance={zoozBalance} />

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        allExperts={experts} 
      />

      <CategoryFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
      />

      {selectedExpert && (
        <ProfileOverlay
          expert={selectedExpert}
          isOpen={!!selectedExpert}
          onClose={() => setSelectedExpert(null)}
          onTrustClick={() => handleTrustClick(selectedExpert)}
          onMessageClick={() => toast({ title: "שליחת הודעה", description: "פתיחת צ'אט" })}
        />
      )}
    </div>
  );
};

export default TopTrustedPage;
