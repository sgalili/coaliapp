import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Crown, TrendingUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const filterTabs = [
  { id: 'all', label: 'הכל' },
  { id: 'week', label: 'השבוע' },
  { id: 'month', label: 'החודש' },
];

const placeholderLeaders = [
  { rank: 1, username: 'יוסי כהן', bio: 'מומחה לכלכלה וטכנולוגיה', trust: '8,547', trend: '+124', isPodium: true },
  { rank: 2, username: 'שרה לוי', bio: 'מנהלת קהילה ומובילת דעה', trust: '7,892', trend: '+98', isPodium: true },
  { rank: 3, username: 'דוד ישראלי', bio: 'יועץ פוליטי ואסטרטג', trust: '6,234', trend: '+87', isPodium: true },
  { rank: 4, username: 'רחל אברהם', bio: 'עיתונאית ובלוגרית', trust: '5,678', trend: '+76' },
  { rank: 5, username: 'משה דהן', bio: 'מומחה לביטחון וצבא', trust: '4,921', trend: '+65' },
  { rank: 6, username: 'נועה גולן', bio: 'יזמת וממציאה', trust: '4,456', trend: '+54' },
  { rank: 7, username: 'אבי מזרחי', bio: 'מנהל טכנולוגיות', trust: '3,789', trend: '+43' },
  { rank: 8, username: 'מיכל ברק', bio: 'אקטיביסטית חברתית', trust: '3,234', trend: '+38' },
  { rank: 9, username: 'רון פרץ', bio: 'אנליסט כלכלי', trust: '2,987', trend: '+32' },
  { rank: 10, username: 'תמר שמש', bio: 'מובילת דעה קהל', trust: '2,654', trend: '+28' },
];

export default function TopTrustedPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  const podiumUsers = placeholderLeaders.filter(u => u.isPodium);
  const regularUsers = placeholderLeaders.filter(u => !u.isPodium);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex items-center gap-2">
          <Crown className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">מובילים</h1>
        </div>
        
        {/* Filter Tabs */}
        <div className="px-4 pb-3 flex gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                selectedFilter === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Podium - Top 3 */}
        <div className="p-4 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-end justify-center gap-2 mb-8">
            {/* 2nd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 border-4 border-gray-400">
                <span className="text-2xl">🥈</span>
              </div>
              <p className="font-bold text-sm text-foreground text-center">{podiumUsers[1]?.username}</p>
              <div className="flex items-center gap-1 text-trust mt-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">{podiumUsers[1]?.trust}</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center flex-1 -mt-6">
              <Crown className="w-8 h-8 text-primary mb-1" />
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-2 border-4 border-primary ring-4 ring-primary/20">
                <span className="text-3xl">👑</span>
              </div>
              <p className="font-bold text-base text-foreground text-center">{podiumUsers[0]?.username}</p>
              <div className="flex items-center gap-1 text-trust mt-1">
                <Heart className="w-5 h-5" />
                <span className="text-base font-bold">{podiumUsers[0]?.trust}</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 border-4 border-orange-600">
                <span className="text-2xl">🥉</span>
              </div>
              <p className="font-bold text-sm text-foreground text-center">{podiumUsers[2]?.username}</p>
              <div className="flex items-center gap-1 text-trust mt-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">{podiumUsers[2]?.trust}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regular Leaderboard */}
        <div className="px-4">
          {regularUsers.map((user) => (
            <div
              key={user.rank}
              className="flex items-center gap-3 py-4 border-b border-border hover:bg-muted/30 transition-colors"
            >
              {/* Rank */}
              <div className="w-8 text-center">
                <span className="text-lg font-bold text-muted-foreground">#{user.rank}</span>
              </div>

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">👤</span>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground truncate">{user.username}</p>
                <p className="text-sm text-muted-foreground truncate">{user.bio}</p>
              </div>

              {/* Stats */}
              <div className="text-left">
                <div className="flex items-center gap-1 text-trust mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="font-bold">{user.trust}</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">{user.trend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={250} />
    </div>
  );
}
