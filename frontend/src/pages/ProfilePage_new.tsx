import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Eye, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: 'posts', label: 'פוסטים' },
  { id: 'info', label: 'מידע' },
  { id: 'trust', label: 'אמון' },
  { id: 'giving', label: 'נותן אמון' },
];

const placeholderPosts = Array.from({ length: 6 }, (_, i) => ({
  id: `${i + 1}`,
  thumbnail: '🖼️',
}));

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">פרופיל</h1>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="p-6 text-center">
          {/* Avatar */}
          <div className="w-30 h-30 mx-auto mb-4">
            <div className="w-30 h-30 rounded-full bg-muted flex items-center justify-center border-4 border-primary">
              <span className="text-6xl">👤</span>
            </div>
          </div>

          {/* User Info */}
          <h2 className="text-2xl font-bold text-foreground mb-2">שם משתמש</h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            ביוגרפיה של המשתמש תופיע כאן. זה יכול להיות תיאור קצר על המשתמש, תחומי העניין שלו והמומחיות שלו.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-watch mb-1">
                <Eye className="w-5 h-5" />
                <span className="text-xl font-bold">1.2K</span>
              </div>
              <span className="text-xs text-muted-foreground">Watch</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-trust mb-1">
                <Heart className="w-5 h-5" />
                <span className="text-xl font-bold">8.5K</span>
              </div>
              <span className="text-xs text-muted-foreground">Trust</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-zooz mb-1">
                <span className="text-2xl font-bold">Z</span>
                <span className="text-xl font-bold">15K</span>
              </div>
              <span className="text-xs text-muted-foreground">Zooz</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
              עריכת פרופיל
            </button>
            <button className="px-6 py-2 bg-muted text-foreground rounded-full font-medium hover:bg-muted/80 transition-colors">
              שתף פרופיל
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border px-4">
          <div className="flex gap-1 overflow-x-auto">
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
            <div className="grid grid-cols-3 gap-2">
              {placeholderPosts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  <span className="text-4xl">{post.thumbnail}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4 max-w-md mx-auto">
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">מיקום</p>
                <p className="font-medium text-foreground">תל אביב, ישראל 🇮🇱</p>
              </div>
              
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">תחום מומחיות</p>
                <p className="font-medium text-foreground">טכנולוגיה, כלכלה</p>
              </div>
              
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">הצטרף</p>
                <p className="font-medium text-foreground">ינואר 2024</p>
              </div>
            </div>
          )}

          {activeTab === 'trust' && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">רשימת אנשים שנותנים לך אמון תופיע כאן</p>
            </div>
          )}

          {activeTab === 'giving' && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">רשימת אנשים שאתה נותן להם אמון תופיע כאן</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={250} />
    </div>
  );
}
