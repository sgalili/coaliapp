import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ChannelSelector } from "@/components/ChannelSelector";
import { Crown, Search, Heart, TrendingUp, TrendingDown, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useChannel } from "@/contexts/ChannelContext";

export default function TopTrustedPage() {
  const navigate = useNavigate();
  const { selectedChannel } = useChannel();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Check if real user - HIDE all demo leaders
  const isReal = localStorage.getItem('authenticated_user_id') && 
                 localStorage.getItem('authenticated_user_id') !== 'demo-user';
  
  // Empty for real users, demo data for demo users
  const [users] = useState(isReal ? [] : []);
  const [unreadNotifications, setUnreadNotifications] = useState(isReal ? 0 : 3);

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
          {/* Right - Channel Selector (same layout as homepage) */}
          <div className="flex items-center gap-2">
            <ChannelSelector />
          </div>
          
          {/* Center - Page Title */}
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">מובילים בקואלי</h1>
          </div>
          
          {/* Left - Search & Bell Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 hover:bg-muted rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-[1px] right-[17px] min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
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
        {/* Top 3 Podium - Show skeleton for real users */}
        <div className="p-6 bg-gradient-to-b from-primary/5 to-transparent">
          {users.length > 0 ? (
            <div className="flex items-end justify-center gap-4">
              {/* Actual top 3 for demo users */}
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
          ) : (
            /* Skeleton for real users - Show structure */
            <div className="flex items-end justify-center gap-4">
              {/* 2nd Place Skeleton */}
              <div className="flex flex-col items-center flex-1 opacity-20">
                <div className="text-3xl mb-2">🥈</div>
                <div className="w-16 h-16 rounded-full bg-muted mb-3"></div>
                <div className="h-4 w-20 bg-muted rounded mb-2"></div>
                <div className="h-3 w-16 bg-muted rounded"></div>
              </div>
              
              {/* 1st Place Skeleton */}
              <div className="flex flex-col items-center flex-1 -mt-8 opacity-20">
                <Crown className="w-8 h-8 text-muted mb-1" />
                <div className="text-4xl mb-2">👑</div>
                <div className="w-20 h-20 rounded-full bg-muted mb-3"></div>
                <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                <div className="h-3 w-20 bg-muted rounded"></div>
              </div>
              
              {/* 3rd Place Skeleton */}
              <div className="flex flex-col items-center flex-1 opacity-20">
                <div className="text-3xl mb-2">🥉</div>
                <div className="w-16 h-16 rounded-full bg-muted mb-3"></div>
                <div className="h-4 w-20 bg-muted rounded mb-2"></div>
                <div className="h-3 w-16 bg-muted rounded"></div>
              </div>
            </div>
          )}
        </div>

        {/* Ranked List - Show skeleton or empty state */}
        <div className="px-4 space-y-2">
          {users.length > 0 ? (
            rankedList.map((user) => (
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
