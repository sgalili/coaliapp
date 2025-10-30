import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { MapPin, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

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
  { id: '1', duration: '0:15', trust: 234, zooz: 187 },
  { id: '2', duration: '0:15', trust: 187, zooz: 149 },
  { id: '3', duration: '0:15', trust: 312, zooz: 249 },
  { id: '4', duration: '0:15', trust: 156, zooz: 124 },
  { id: '5', duration: '0:15', trust: 401, zooz: 320 },
  { id: '6', duration: '0:15', trust: 223, zooz: 178 },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="relative p-6 text-center">
          {/* Settings Icon */}
          <button className="absolute top-4 left-4 p-2 hover:bg-muted rounded-full transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Avatar */}
          <img
            src="https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg"
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-primary"
          />

          {/* Name and Handle */}
          <h2 className="text-2xl font-bold text-foreground mb-1">שרה כהן</h2>
          <p className="text-sm text-muted-foreground mb-2">@sarahp</p>

          {/* Location */}
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span>תל אביב, ישראל</span>
          </div>

          {/* Bio */}
          <p className="text-sm text-foreground mb-4 max-w-md mx-auto leading-relaxed">
            מומחית למדיניות ציבורית ודמוקרטיה דיגיטלית. פועלת למען שקיפות ואמון ברשתות חברתיות.
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
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">423</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">847</p>
            </div>

            <div className="text-center flex items-center gap-1">
              <span className="text-2xl font-bold text-zooz">Z</span>
              <span className="text-2xl font-bold text-foreground">12.8K</span>
            </div>
          </div>
        </div>

        {/* KYC Section */}
        <div className="mx-4 mb-6 p-4 bg-card border-2 border-destructive/20 rounded-xl">
          <h3 className="text-lg font-bold text-foreground mb-2">לא מאומת</h3>
          <p className="text-sm text-muted-foreground mb-3">השלם אימות בסיסי</p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">רמה 0</span>
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
          {activeTab === 'posts' && (
            <div className="grid grid-cols-2 gap-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden group cursor-pointer"
                >
                  <img
                    src="https://trust.coali.app/api/placeholder/300/400"
                    alt="Post"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect fill="%239ca3af" width="300" height="400"/%3E%3C/svg%3E';
                    }}
                  />
                  
                  {/* Duration Badge */}
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs font-medium">
                    {post.duration}
                  </div>

                  {/* Stats Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{post.trust}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-zooz font-bold">Z</span>
                          <span className="font-bold">{post.zooz}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{post.trust}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-zooz font-bold">Z</span>
                          <span className="font-bold">{post.zooz}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">מיקום</p>
                <p className="font-medium text-foreground">תל אביב, ישראל 🇮🇱</p>
              </div>
              
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">תחומי מומחיות</p>
                <p className="font-medium text-foreground">כלכלה, ביטחון, חינוך</p>
              </div>
              
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">הצטרף</p>
                <p className="font-medium text-foreground">ינואר 2024</p>
              </div>
            </div>
          )}

          {activeTab === 'trust' && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">רשימת אנשים שנותנים לך אמון תופיע כאן</p>
            </div>
          )}

          {activeTab === 'giving' && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">רשימת אנשים שאתה נותן להם אמון תופיע כאן</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={9957} />
    </div>
  );
}
