import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { MapPin, Settings, Calendar, Globe, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";

const expertiseTags = [
  { label: 'כלכלה', count: 234 },
  { label: 'ביטחון', count: 167 },
  { label: 'חינוך', count: 89 },
];

const tabs = [
  { id: 'posts', label: 'פוסטים' },
  { id: 'info', label: 'מידע' },
  { id: 'trust', label: 'אמון' },
  { id: 'giving', label: 'נתתי אמון' },
];

const posts = [
  { id: '1', thumbnail: 'https://trust.coali.app/api/placeholder/300/400', duration: '0:15', trust: 234, zooz: 187 },
  { id: '2', thumbnail: 'https://trust.coali.app/api/placeholder/300/400', duration: '0:15', trust: 187, zooz: 149 },
  { id: '3', thumbnail: 'https://trust.coali.app/api/placeholder/300/400', duration: '0:15', trust: 312, zooz: 249 },
  { id: '4', thumbnail: 'https://trust.coali.app/api/placeholder/300/400', duration: '0:15', trust: 156, zooz: 124 },
  { id: '5', thumbnail: 'https://trust.coali.app/api/placeholder/300/400', duration: '0:15', trust: 401, zooz: 320 },
  { id: '6', thumbnail: 'https://trust.coali.app/api/placeholder/300/400', duration: '0:15', trust: 223, zooz: 178 },
];

// Demo profile data
const demoProfile = {
  firstName: 'שרה',
  lastName: 'כהן',
  handle: '@sarahp',
  location: 'תל אביב, ישראל',
  bio: 'מומחית למדיניות ציבורית ודמוקרטיה דיגיטלית. פועלת למען שקיפות ואמון ברשתות חברתיות.',
  avatar: 'https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg',
  kycVerified: false,
  kycLevel: 0,
  trustCount: 423,
  watchCount: 847,
  zoozEarned: 12800,
  joinDate: 'ינואר 2024',
  postsCount: 6,
};

export default function ProfilePage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  const isOwnProfile = !userId; // If no userId in URL, it's own profile

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Settings Icon (Own Profile Only) */}
        {isOwnProfile && (
          <div className="absolute top-4 left-4 z-10">
            <button className="p-2 hover:bg-muted rounded-full transition-colors bg-background/80 backdrop-blur-sm">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Profile Header */}
        <div className="relative text-center pt-6 px-6">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <img
              src={demoProfile.avatar}
              alt={`${demoProfile.firstName} ${demoProfile.lastName}`}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary"
            />
          </div>

          {/* Name and Handle */}
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {demoProfile.firstName} {demoProfile.lastName}
          </h2>
          <p className="text-sm text-muted-foreground mb-2">{demoProfile.handle}</p>

          {/* Location */}
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span>{demoProfile.location}</span>
          </div>

          {/* Bio */}
          <p className="text-sm text-foreground mb-4 max-w-md mx-auto leading-relaxed">
            {demoProfile.bio}
          </p>

          {/* Expertise Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {expertiseTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
              >
                {tag.label} ({tag.count})
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground mb-1">{demoProfile.trustCount}</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-foreground mb-1">{demoProfile.watchCount}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <span className="text-2xl font-bold text-zooz">Z</span>
                <span className="text-2xl font-bold text-foreground">
                  {(demoProfile.zoozEarned / 1000).toFixed(1)}K
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Verification Section */}
        <div className="mx-4 mb-6 p-4 bg-card border-2 border-destructive/20 rounded-xl">
          <h3 className="text-lg font-bold text-foreground mb-2">לא מאומת</h3>
          <p className="text-sm text-muted-foreground mb-3">השלם אימות בסיסי</p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">רמה {demoProfile.kycLevel}</span>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 mb-3">
            <p className="text-sm font-semibold text-foreground mb-2">שדרג לרמה 1</p>
            <p className="text-xs text-zooz font-bold mb-2">+50 ZOOZ</p>
            <p className="text-xs text-muted-foreground">עיר, תאריך לידה, מספר זהות</p>
          </div>

          <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            שדרג עכשיו
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2",
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">{demoProfile.postsCount} פוסטים</p>
              <div className="grid grid-cols-2 gap-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-6xl">🖼️</span>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs font-medium">
                      {post.duration}
                    </div>

                    {/* Stats Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{post.trust}</span>
                          <div className="flex items-center gap-0.5">
                            <span className="text-zooz font-bold">Z</span>
                            <span className="font-bold">{post.zooz}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{post.trust}</span>
                          <div className="flex items-center gap-0.5">
                            <span className="text-zooz font-bold">Z</span>
                            <span className="font-bold">{post.zooz}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-2">מיקום</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium text-foreground">{demoProfile.location}</p>
                </div>
              </div>
              
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-2">הצטרף</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium text-foreground">{demoProfile.joinDate}</p>
                </div>
              </div>

              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-2">תחומי מומחיות</p>
                <div className="flex flex-wrap gap-2">
                  {expertiseTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Trust Tab */}
          {activeTab === 'trust' && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">{demoProfile.trustCount} נותני אמון</p>
              <div className="text-center py-12">
                <p className="text-muted-foreground">רשימת אנשים שנותנים לך אמון תופיע כאן</p>
              </div>
            </div>
          )}

          {/* Giving Trust Tab */}
          {activeTab === 'giving' && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">נותן אמון ל-{demoProfile.watchCount} אנשים</p>
              <div className="text-center py-12">
                <p className="text-muted-foreground">רשימת אנשים שאתה נותן להם אמון תופיע כאן</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={9957} />
    </div>
  );
}
