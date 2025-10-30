import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ChannelSelector } from "@/components/ChannelSelector";
import { Crown, Search, Heart, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useChannel } from "@/contexts/ChannelContext";

// Demo users data (50 users)
const generateDemoUsers = () => {
  const users = [
    { rank: 1, name: 'תמר סייבר', category: 'Technology', bio: 'מומחה מוכר ואמין בתחום', avatar: 'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg', verified: true, trusters: 1789, weeklyChange: 276, tags: ['Technology', 'Security'] },
    { rank: 2, name: 'שרה לוי', category: 'Education', bio: 'חוקרת חינוך, מומחית פדגוגיה דיגיטלית ויועצת ארגונית', avatar: 'https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg', verified: true, trusters: 1523, weeklyChange: 189, tags: ['Education', 'Culture'] },
    { rank: 3, name: 'יוסי טכנולוגיה', category: 'Technology', bio: 'מומחה מוכר ואמין בתחום', avatar: 'https://trust.coali.app/assets/amit-profile-CprpaaC6.jpg', verified: true, trusters: 1543, weeklyChange: 221, tags: ['Technology'] },
    { rank: 4, name: 'אמית כהן', category: 'Economy', bio: 'מומחה כלכלה וטכנולוגיה, יועץ השקעות ומרצה בכיר באוניברסיטת תל אביב', avatar: 'https://trust.coali.app/assets/amit-profile-CprpaaC6.jpg', verified: true, trusters: 2847, weeklyChange: 452, tags: ['Economy', 'Technology'] },
    { rank: 5, name: 'רחל אברהם', category: 'Economy', bio: 'כלכלנית בכירה, יועצת עסקית ומומחית בשווקים פיננסיים', avatar: 'https://trust.coali.app/assets/rachel-profile-w3gZXC9S.jpg', verified: true, trusters: 3421, weeklyChange: 583, tags: ['Economy', 'Culture'] },
    { rank: 6, name: 'אלון AI', category: 'Technology', bio: 'מומחה מוכר ואמין בתחום', avatar: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg', verified: true, trusters: 2156, weeklyChange: 348, tags: ['Technology'] },
    { rank: 7, name: 'נועה שמואל', category: 'Technology', bio: 'מפתחת תוכנה בכירה, מומחית בינה מלאכותית ומובילת צוותים', avatar: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg', verified: true, trusters: 987, weeklyChange: 112, tags: ['Technology', 'Education'] },
    { rank: 8, name: 'ליאת קוד', category: 'Technology', bio: 'מומחה מוכר ואמין בתחום', avatar: 'https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg', verified: true, trusters: 892, weeklyChange: 134, tags: ['Technology'] },
    { rank: 9, name: 'ענת דטה', category: 'Technology', bio: 'מומחה מוכר ואמין בתחום', avatar: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg', verified: true, trusters: 1334, weeklyChange: 198, tags: ['Technology'] },
    { rank: 10, name: 'מאיה רוזן', category: 'Health', bio: 'רופאה מומחית, חוקרת בתחום הבריאות הדיגיטלית ומרצה', avatar: 'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg', verified: true, trusters: 1234, weeklyChange: 156, tags: ['Health', 'Education'] },
    { rank: 11, name: 'דוד מושקוביץ', category: 'Security', bio: 'מומחה אבטחת מידע, יועץ סייבר וחוקר באקדמיה', avatar: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg', verified: true, trusters: 856, weeklyChange: 124, tags: ['Security', 'Technology'] },
    { rank: 12, name: 'רועי בלוקצ\'יין', category: 'Technology', bio: 'מומחה מוכר ואמין בתחום', avatar: 'https://trust.coali.app/assets/rachel-profile-w3gZXC9S.jpg', verified: true, trusters: 945, weeklyChange: 162, tags: ['Technology', 'Economy'] },
  ];

  return users;
};

type TimeFilter = 'all' | 'week' | 'month';

export default function TopTrustedPage() {
  const navigate = useNavigate();
  const { selectedChannel } = useChannel();
  const [users] = useState(generateDemoUsers());
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  const topThree = users.slice(0, 3);
  const rankedList = users.slice(3);

  const filteredUsers = searchQuery
    ? users.filter(u => u.name.includes(searchQuery) || u.bio.includes(searchQuery))
    : users;

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Left - Search Icon */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
          
          {/* Center - Page Title */}
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">מובילים בקואלי</h1>
          </div>
          
          {/* Right - Channel Selector (same layout as homepage) */}
          <div className="flex items-center gap-2">
            {selectedChannel.id !== null && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full text-xs">
                <span className="text-xs font-medium">{selectedChannel.name}</span>
                <button
                  onClick={() => {
                    // Will be handled properly later
                  }}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  ×
                </button>
              </div>
            )}
            <ChannelSelector />
          </div>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex border-t border-border">
          <button
            onClick={() => setTimeFilter('all')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors border-b-2",
              timeFilter === 'all'
                ? "text-primary border-primary bg-primary/5"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >
            הכל
          </button>
          <button
            onClick={() => setTimeFilter('week')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors border-b-2",
              timeFilter === 'week'
                ? "text-primary border-primary bg-primary/5"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >
            השבוע
          </button>
          <button
            onClick={() => setTimeFilter('month')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors border-b-2",
              timeFilter === 'month'
                ? "text-primary border-primary bg-primary/5"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >
            החודש
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Top 3 Podium */}
        <div className="p-6 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-end justify-center gap-4">
            {/* 2nd Place */}
            {topThree[1] && (
              <button
                onClick={() => navigate(`/user/${topThree[1].rank}`)}
                className="flex flex-col items-center flex-1"
              >
                <div className="text-3xl mb-2">🥈</div>
                <div className="relative mb-3">
                  <img
                    src={topThree[1].avatar}
                    alt={topThree[1].name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-gray-400"
                  />
                </div>
                <h3 className="font-bold text-sm text-foreground text-center mb-1">
                  {topThree[1].name}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">
                  {topThree[1].category}
                </p>
                <div className="flex items-center gap-1 text-trust">
                  <span className="text-sm font-bold">{formatCount(topThree[1].trusters)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{formatCount(topThree[1].weeklyChange)}</span>
                </div>
              </button>
            )}

            {/* 1st Place - Elevated */}
            {topThree[0] && (
              <button
                onClick={() => navigate(`/user/${topThree[0].rank}`)}
                className="flex flex-col items-center flex-1 -mt-8"
              >
                <Crown className="w-8 h-8 text-primary mb-1 animate-pulse" />
                <div className="text-4xl mb-2">👑</div>
                <div className="relative mb-3">
                  <img
                    src={topThree[0].avatar}
                    alt={topThree[0].name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-primary ring-4 ring-primary/20"
                  />
                </div>
                <h3 className="font-bold text-base text-foreground text-center mb-1">
                  {topThree[0].name}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">
                  {topThree[0].category}
                </p>
                <div className="flex items-center gap-1 text-trust">
                  <span className="text-base font-bold">{formatCount(topThree[0].trusters)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{formatCount(topThree[0].weeklyChange)}</span>
                </div>
              </button>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <button
                onClick={() => navigate(`/user/${topThree[2].rank}`)}
                className="flex flex-col items-center flex-1"
              >
                <div className="text-3xl mb-2">🥉</div>
                <div className="relative mb-3">
                  <img
                    src={topThree[2].avatar}
                    alt={topThree[2].name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-orange-600"
                  />
                </div>
                <h3 className="font-bold text-sm text-foreground text-center mb-1">
                  {topThree[2].name}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">
                  {topThree[2].category}
                </p>
                <div className="flex items-center gap-1 text-trust">
                  <span className="text-sm font-bold">{formatCount(topThree[2].trusters)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{formatCount(topThree[2].weeklyChange)}</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Ranked List */}
        <div className="px-4 space-y-2">
          {rankedList.map((user) => (
            <button
              key={user.rank}
              onClick={() => navigate(`/user/${user.rank}`)}
              className="w-full flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:bg-muted/30 transition-colors"
            >
              {/* Rank */}
              <div className="w-8 text-center">
                <span className="text-lg font-bold text-muted-foreground">#{user.rank}</span>
              </div>

              {/* Avatar */}
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* User Info */}
              <div className="flex-1 min-w-0 text-right">
                <h3 className="font-bold text-foreground truncate mb-0.5">
                  {user.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {user.category}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.bio}
                </p>
              </div>

              {/* Stats */}
              <div className="text-left">
                <div className="flex items-center gap-1 text-trust mb-1">
                  <span className="font-bold text-sm">{formatCount(user.trusters)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">
                    {formatCount(user.weeklyChange)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-background z-50">
          <div className="sticky top-0 bg-background border-b border-border p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-2 hover:bg-muted rounded-full"
              >
                <Crown className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="חפש לפי שם או תחום..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pr-10 pl-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {filteredUsers.slice(0, 20).map(user => (
              <button
                key={user.rank}
                onClick={() => {
                  navigate(`/user/${user.rank}`);
                  setSearchOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 text-right">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.bio}</p>
                </div>
                <div className="flex items-center gap-1 text-trust">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-bold">{formatCount(user.trusters)}</span>
                </div>
              </button>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">לא נמצאו תוצאות</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation zoozBalance={999} />
    </div>
  );
}
