import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Settings, Heart, Eye, ShieldCheck, Handshake, Crown, Vote, Gavel, Menu, Bell, X, LogOut, User, Lock, HelpCircle, FileText, MessageSquare, Share2, Bookmark, Gift, Edit2, Grid3x3, Info, CheckSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [trustCount, setTrustCount] = useState(0);
  const [decisionsCount, setDecisionsCount] = useState(0);
  const [userDecisions, setUserDecisions] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Demo count
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'info' | 'trust' | 'bookmarks'>('posts');
  const [expertiseFields, setExpertiseFields] = useState(['טכנולוגיה', 'עسקים', 'חדשות']);
  const [savedBookmarks, setSavedBookmarks] = useState<any[]>([]);
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
    loadUserPosts();
    
    // Real-time subscription for posts
    const postsSubscription = supabase
      .channel('profile-posts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'demo_posts', filter: `user_id=eq.demo-user` },
        () => {
          console.log('🔄 Posts changed, reloading...');
          loadUserPosts();
        }
      )
      .subscribe();
    
    // Real-time subscription for decisions
    const decisionsSubscription = supabase
      .channel('profile-decisions')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'demo_decisions' },
        () => {
          console.log('🔄 Decisions changed, reloading...');
          loadUserPosts();
        }
      )
      .subscribe();
    
    return () => {
      postsSubscription.unsubscribe();
      decisionsSubscription.unsubscribe();
    };
  }, []);
  // Scroll listener for sticky tabs
  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const rect = tabsRef.current.getBoundingClientRect();
        setIsTabsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle tab change with auto-scroll
  const handleTabChange = (tab: 'posts' | 'info' | 'trust' | 'bookmarks') => {
    setActiveTab(tab);
    // Scroll to tabs position
    if (tabsRef.current) {
      const yOffset = -60; // Offset for sticky positioning
      const y = tabsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const loadUserPosts = async () => {
    try {
      // Fetch demo user's posts
      const { data, error } = await supabase
        .from('demo_posts')
        .select('*')
        .eq('user_id', 'demo-user')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('📊 User posts loaded:', data?.length);
      setUserPosts(data || []);
      
      // Calculate stats from posts
      if (data && data.length > 0) {
        const totalTrust = data.reduce((sum, p) => sum + (p.trust_count || 0), 0);
        const totalVotes = data.reduce((sum, p) => sum + (p.vote_count || 0), 0);
        const totalWatch = data.reduce((sum, p) => sum + (p.watch_count || 0), 0);
        
        setStats({ trust: totalTrust, votes: totalVotes, watch: totalWatch });
      }
      
      // Count decisions where user has actually voted
      // This should check a user_votes table or voted_by field in real implementation
      // For now, we'll check if there's a votes_by_user field or similar
      const { count: votedDecisionsCount } = await supabase
        .from('demo_decisions')
        .select('*', { count: 'exact', head: true })
        .contains('voted_users', ['demo-user']); // Check if user is in voted_users array
      
      // Fallback: count based on demo logic (you may need to adjust based on actual schema)
      const decidedCount = votedDecisionsCount || 0;
      
      console.log('🗳️ Decisions voted by user:', decidedCount);
      setStats(prev => ({ ...prev, decisions: decidedCount }));

      // Load bookmark statistics
      await loadBookmarkStats();
      await loadSavedBookmarks();
      
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadBookmarkStats = async () => {
    try {
      // Count bookmarks received on my posts
      const { count: receivedCount } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', 'demo-user');

      // Count my saved bookmarks
      const { count: savedCount } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('bookmark_user_id', 'demo-user');

      setBookmarkStats({
        received: receivedCount || 0,
        saved: savedCount || 0
      });

      console.log('🔖 Bookmark stats:', { received: receivedCount, saved: savedCount });
    } catch (error) {
      console.error('Failed to load bookmark stats:', error);
    }
  };

  const loadSavedBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          post:demo_posts(*)
        `)
        .eq('bookmark_user_id', 'demo-user')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedBookmarks(data || []);
      console.log('🔖 Saved bookmarks loaded:', data?.length);
    } catch (error) {
      console.error('Failed to load saved bookmarks:', error);
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;

      // Refresh bookmarks
      await loadSavedBookmarks();
      await loadBookmarkStats();
      
      // Show toast (you'll need to import toast from sonner)
      console.log('הסימניה הוסרה');
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Burger Menu Overlay */}
      {showBurgerMenu && (
        <div className="fixed inset-0 z-[100] bg-black/50" onClick={() => setShowBurgerMenu(false)}>
          <div 
            className="absolute top-0 right-0 w-[280px] h-full bg-background shadow-2xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold">תפריט</h2>
              <button onClick={() => setShowBurgerMenu(false)} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg text-right">
                <User className="w-5 h-5 text-muted-foreground" />
                <span>עריכת פרופיל</span>
              </button>
              
              <button 
                onClick={() => {
                  navigate('/wallet');
                  setShowBurgerMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg text-right"
              >
                <Gift className="w-5 h-5 text-muted-foreground" />
                <span>ארנק ZOOZ</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg text-right">
                <Bookmark className="w-5 h-5 text-muted-foreground" />
                <span>שמורים</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg text-right">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span>הגדרות</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg text-right">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <span>פרטיות ואבטחה</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg text-right">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <span>עזרה ותמיכה</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg text-right">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span>תנאי שימוש</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg text-right">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <span>צור קשר</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg text-right text-red-600 mt-4">
                <LogOut className="w-5 h-5" />
                <span>התנתק</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header with Menu on Right and Bell on Left */}
        <div className="relative p-6 text-center">
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => setShowBurgerMenu(true)}
              className="p-2 hover:bg-muted rounded-full"
            >
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          <div className="absolute top-4 left-4">
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

          {/* Profile Image */}
          <img
            src="https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary"
          />

          {/* Name & Handle with Edit Icon */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">משתמש דמו מאומת</h2>
            <button className="p-1.5 hover:bg-muted rounded-full transition-colors">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-2" dir="ltr">@demouser</p>

          {/* Expertise Fields */}
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            {expertiseFields.map((field, i) => (
              <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {field}
              </span>
            ))}
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1 relative">
                <Handshake className="w-5 h-5 text-trust" />
                <p className="text-2xl font-bold ml-2">{stats.trust}</p>
              </div>
              <p className="text-xs text-muted-foreground">אמון</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <Vote className="w-5 h-5 text-primary" />
                <p className="text-2xl font-bold">{stats.votes}</p>
              </div>
              <p className="text-xs text-muted-foreground">הצבעות</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <Gavel className="w-5 h-5 text-purple-600" />
                <p className="text-2xl font-bold">{stats.decisions}</p>
              </div>
              <p className="text-xs text-muted-foreground">החלטות</p>
            </div>
          </div>
        </div>

        {/* Tabs - Sticky when scrolling */}
        <div 
          ref={tabsRef} 
          className={cn(
            "border-b border-border bg-background transition-all z-40",
            isTabsSticky && "sticky top-0 shadow-sm"
          )}
        >
          <div className="flex items-center justify-around">
            <button
              onClick={() => handleTabChange('posts')}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'posts' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              פוסטים
            </button>
            <button
              onClick={() => handleTabChange('info')}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'info' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              מידע
            </button>
            <button
              onClick={() => handleTabChange('trust')}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'trust' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              אמון
            </button>
            <button
              onClick={() => handleTabChange('bookmarks')}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'bookmarks' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              שמורים
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-6">
          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div>
              <h3 className="text-lg font-bold mb-4">הפוסטים שלי ({userPosts.length})</h3>
              {userPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {userPosts.map((post) => (
                    <div key={post.id} className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                      {post.video_url && (
                        <video src={post.video_url} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                        <div className="flex items-center justify-between text-white text-xs">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{post.watch_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 relative">
                            <Handshake className="w-3 h-3" />
                            <Crown className="w-2 h-2 absolute -top-0.5 -right-0.5 text-yellow-400" />
                            <span className="ml-1">{post.trust_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground">עדיין לא העלית פוסטים</p>
          )}
        </div>
      )}

      {/* Info Tab */}
      {activeTab === 'info' && (
        <div>
          <h3 className="text-lg font-bold mb-4">פרטי משתמש</h3>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">שם מלא</p>
              <p className="font-medium">משתמש דמו מאומת</p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">ביוגרפיה</p>
              <p className="text-sm">מומחה בתחומי טכנולוגיה, עסקים וחדשות. משתף ידע ותובנות עם הקהילה.</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">תחומי מומחיות</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {expertiseFields.map((field, i) => (
                  <span key={i} className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                    {field}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">מיקום</p>
              <p className="font-medium">תל אביב, ישראל</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">הצטרף ב</p>
              <p className="font-medium">ינואר 2024</p>
            </div>
          </div>
        </div>
      )}

      {/* Trust Tab - Now shows bookmarks */}
      {activeTab === 'trust' && (
        <div>
          <h3 className="text-lg font-bold mb-4">סימניות ואמון</h3>
          
          {/* Bookmark Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">{bookmarkStats.received}</p>
              <p className="text-sm text-muted-foreground mt-1">סימניות שקיבלתי</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-primary">{bookmarkStats.saved}</p>
              <p className="text-sm text-muted-foreground mt-1">הסימניות שלי</p>
            </div>
          </div>

          {/* Trust List */}
          <h4 className="font-bold mb-3">נותני אמון אחרונים</h4>
          <div className="space-y-3">
            {[
              { name: 'דוד כהן', image: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg', expertise: 'כלכלה' },
              { name: 'שרה לוי', image: 'https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg', expertise: 'טכנולוגיה' },
              { name: 'יעקב מזרחי', image: 'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg', expertise: 'פוליטיקה' },
            ].map((user, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <img src={user.image} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.expertise}</p>
                </div>
                <Handshake className="w-5 h-5 text-trust" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookmarks Tab */}
      {activeTab === 'bookmarks' && (
        <div>
          <h3 className="text-lg font-bold mb-4">הפוסטים השמורים שלי ({savedBookmarks.length})</h3>
          {savedBookmarks.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {savedBookmarks.map((bookmark) => (
                <div key={bookmark.id} className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
                  {bookmark.post?.video_url && (
                    <video src={bookmark.post.video_url} className="w-full h-full object-cover" />
                  )}
                  {bookmark.post?.image_url && (
                    <img src={bookmark.post.image_url} className="w-full h-full object-cover" alt="" />
                  )}
                  
                  {/* Remove Bookmark Button */}
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  {/* Post Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs line-clamp-2">{bookmark.post?.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">עדיין לא שמרת פוסטים</p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>

      <Navigation zoozBalance={9957} />
    </div>
  );
}
