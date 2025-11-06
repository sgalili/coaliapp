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
  const [activeTab, setActiveTab] = useState<'posts' | 'info' | 'trust' | 'bookmarks' | 'decisions' | 'drafts'>('posts');
  const [expertiseFields, setExpertiseFields] = useState(['טכנולוגיה', 'עסקים', 'חדשות']);
  const [savedBookmarks, setSavedBookmarks] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [draftPosts, setDraftPosts] = useState<any[]>([]);
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [stats, setStats] = useState({ trust: 0, votes: 0, watch: 0, decisions: 0 });
  const [bookmarkStats, setBookmarkStats] = useState({ received: 0, saved: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const [trustedByMe, setTrustedByMe] = useState<any[]>([]);
  const [trustedMe, setTrustedMe] = useState<any[]>([]);
  const [showFullBio, setShowFullBio] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const [isBioLong, setIsBioLong] = useState(false);
  
  const userBio = "מומחה בתחומי טכנולוגיה, עסקים וחדשות.";

  const handleTrustBack = async (userId: string) => {
    try {
      // Add trust relationship
      const { error } = await supabase
        .from('trust_relationships')
        .insert({
          truster_user_id: 'demo-user',
          trusted_user_id: userId,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error trusting user:', error);
      } else {
        console.log('✅ Trust relationship created');
        // Reload trust data
        await loadTrustCount();
      }
    } catch (error) {
      console.error('Failed to trust user:', error);
    }
  };

  const handleUnsubscribe = async (creatorId: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('subscriber_id', 'demo-user')
        .eq('creator_id', creatorId);

      if (error) {
        console.error('Error unsubscribing:', error);
      } else {
        console.log('✅ Unsubscribed from user');
        // Reload subscriptions
        await loadSubscriptions();
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  };

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

  // Check bio length on mount
  useEffect(() => {
    if (bioRef.current) {
      const lineHeight = parseFloat(getComputedStyle(bioRef.current).lineHeight);
      const height = bioRef.current.scrollHeight;
      const lines = Math.round(height / lineHeight);
      setIsBioLong(lines > 3);
    }
  }, []);
  // Scroll listener for sticky tabs - stick at top, unstick when scrolling down
  useEffect(() => {
    let lastScrollY = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (tabsRef.current) {
        const rect = tabsRef.current.getBoundingClientRect();
        
        // If we're at or near the top, make tabs sticky
        if (currentScrollY <= 10) {
          setIsTabsSticky(true);
        } 
        // If scrolling down from top position, unstick
        else if (currentScrollY > lastScrollY && rect.top <= 0) {
          setIsTabsSticky(false);
        }
        // If scrolling up and tabs would be at top, make sticky
        else if (currentScrollY < lastScrollY && rect.top >= 0) {
          setIsTabsSticky(true);
        }
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle tab change without auto-scroll
  const handleTabChange = (tab: 'posts' | 'info' | 'trust' | 'bookmarks' | 'decisions' | 'drafts') => {
    setActiveTab(tab);
    // Don't auto-scroll - user has full manual control
  };

  const loadDraftPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_posts')
        .select('*')
        .eq('user_id', 'demo-user')
        .eq('status', 'draft')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Draft posts may not exist, using demo data:', error);
        // Use demo draft data
        setDraftPosts([
          {
            id: 'draft-1',
            caption: 'טיוטה ראשונה - רעיונות על חדשנות בישראל',
            video_url: '/videos/demo1.mp4',
            created_at: new Date().toISOString(),
            status: 'draft'
          }
        ]);
        return;
      }

      setDraftPosts(data || []);
      console.log('📝 Draft posts loaded:', data?.length);
    } catch (error) {
      console.error('Failed to load draft posts:', error);
      setDraftPosts([]);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק פוסט זה?')) return;

    try {
      const { error } = await supabase
        .from('demo_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      console.log('✅ Post deleted');
      // Reload posts
      await loadUserPosts();
      await loadDraftPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handlePublishDraft = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('demo_posts')
        .update({ status: 'published' })
        .eq('id', postId);

      if (error) throw error;

      console.log('✅ Draft published');
      // Reload posts and drafts
      await loadUserPosts();
      await loadDraftPosts();
    } catch (error) {
      console.error('Failed to publish draft:', error);
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
      
      // Load user decisions (votes made by this user)
      await loadUserDecisions();
      
      // Load trust count
      await loadTrustCount();

      // Load bookmark statistics
      await loadSavedBookmarks();
      await loadSubscriptions();
      await loadDraftPosts();
      
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          creator:profiles!subscriptions_creator_id_fkey(*)
        `)
        .eq('subscriber_id', 'demo-user')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Subscriptions table may not exist, using demo data:', error);
        // Use demo subscription data
        setSubscriptions([
          {
            id: 'sub-1',
            creator: {
              full_name: 'ירון זלקה',
              avatar_url: 'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
              field: 'כלכלה',
              user_id: 'user-1'
            }
          },
          {
            id: 'sub-2',
            creator: {
              full_name: 'נועה רותם',
              avatar_url: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg',
              field: 'טכנולוגיה',
              user_id: 'user-2'
            }
          }
        ]);
        console.log('📱 Using demo subscriptions: 2');
        return;
      }
      
      setSubscriptions(data || []);
      console.log('📱 Subscriptions loaded:', data?.length);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      setSubscriptions([]);
    }
  };

  const loadUserDecisions = async () => {
    try {
      // Fetch decisions where user has voted
      const { data, error } = await supabase
        .from('user_votes')
        .select(`
          *,
          decision:demo_decisions(*)
        `)
        .eq('user_id', 'demo-user')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('User votes table may not exist yet, using demo data:', error);
        // Use demo decision data
        const demoDecisions = [
          {
            id: '1',
            vote_value: 'yes',
            created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
            decision: {
              title: 'האם לתמוך ביוזמה לאנרגיה מתחדשת?',
              description: 'הצעה להגדלת תקציב המחקר באנרגיה סולארית',
            }
          },
          {
            id: '2',
            vote_value: 'no',
            created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
            decision: {
              title: 'האם להעלות את המיסוי על סוכר?',
              description: 'הצעה להטלת מס נוסף על משקאות ממותקים',
            }
          },
          {
            id: '3',
            vote_value: 'yes',
            created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
            decision: {
              title: 'האם לאשר את תוכנית התחבורה הציבורית?',
              description: 'הרחבת קווי רכבת קלה בערים הגדולות',
            }
          },
          {
            id: '4',
            vote_value: 'abstain',
            created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
            decision: {
              title: 'האם לאמץ מדיניות עבודה היברידית?',
              description: 'חובת עבודה מהבית לפחות יומיים בשבוע',
            }
          }
        ];
        setUserDecisions(demoDecisions);
        setDecisionsCount(demoDecisions.length);
        console.log('🗳️ Using demo decisions:', demoDecisions.length);
        return;
      }

      setUserDecisions(data || []);
      setDecisionsCount(data?.length || 0);
      console.log('🗳️ User decisions loaded:', data?.length);
    } catch (error) {
      console.error('Failed to load user decisions:', error);
      setDecisionsCount(0);
    }
  };

  const loadTrustCount = async () => {
    try {
      // Count users who trust this user (trusted me)
      const { data: trustedMeData, error: trustedMeError } = await supabase
        .from('trust_relationships')
        .select('*, truster:profiles!trust_relationships_truster_user_id_fkey(*)')
        .eq('trusted_user_id', 'demo-user');

      if (trustedMeError) {
        console.warn('Trust relationships may not exist, using demo data:', trustedMeError);
        // Use real demo users
        setTrustedMe([
          {
            id: '1',
            truster_user_id: 'user-1',
            truster: {
              user_id: 'user-1',
              full_name: 'ירון זלקה',
              avatar_url: 'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
              field: 'כלכלה'
            }
          },
          {
            id: '2',
            truster_user_id: 'user-3',
            truster: {
              user_id: 'user-3',
              full_name: 'דוד לוי',
              avatar_url: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
              field: 'חברה'
            }
          },
          {
            id: '3',
            truster_user_id: 'user-4',
            truster: {
              user_id: 'user-4',
              full_name: 'ד"ר רחל כהן',
              avatar_url: 'https://trust.coali.app/assets/rachel-profile-w3gZXC9S.jpg',
              field: 'בריאות'
            }
          }
        ]);
      } else {
        setTrustedMe(trustedMeData || []);
        console.log('🤝 People who trust me:', trustedMeData?.length);
      }

      // Count users this user trusts (I trust)
      const { data: trustedByMeData, error: trustedByMeError } = await supabase
        .from('trust_relationships')
        .select('*, trusted:profiles!trust_relationships_trusted_user_id_fkey(*)')
        .eq('truster_user_id', 'demo-user');

      if (trustedByMeError) {
        console.warn('Trust relationships may not exist, using demo data:', trustedByMeError);
        // Use real demo users
        setTrustedByMe([
          {
            id: '4',
            trusted_user_id: 'user-2',
            trusted: {
              user_id: 'user-2',
              full_name: 'נועה רותם',
              avatar_url: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg',
              field: 'טכנולוגיה'
            }
          },
          {
            id: '5',
            trusted_user_id: 'user-5',
            trusted: {
              user_id: 'user-5',
              full_name: 'עו"ד אמית ברק',
              avatar_url: 'https://trust.coali.app/assets/amit-profile-CprpaaC6.jpg',
              field: 'חברה'
            }
          }
        ]);
      } else {
        setTrustedByMe(trustedByMeData || []);
        console.log('🤝 People I trust:', trustedByMeData?.length);
      }

      // Set total trust count
      const trustedMeCount = trustedMeData?.length || 3; // demo count
      const trustedByMeCount = trustedByMeData?.length || 2; // demo count
      setTrustCount(trustedMeCount + trustedByMeCount);
    } catch (error) {
      console.error('Failed to load trust relationships:', error);
      // Set demo data on error using real demo users
      setTrustedMe([
        {
          id: '1',
          truster_user_id: 'user-1',
          truster: {
            user_id: 'user-1',
            full_name: 'ירון זלקה',
            avatar_url: 'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
            field: 'כלכלה'
          }
        },
        {
          id: '2',
          truster_user_id: 'user-3',
          truster: {
            user_id: 'user-3',
            full_name: 'דוד לוי',
            avatar_url: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
            field: 'חברה'
          }
        }
      ]);
      setTrustedByMe([
        {
          id: '3',
          trusted_user_id: 'user-2',
          trusted: {
            user_id: 'user-2',
            full_name: 'נועה רותם',
            avatar_url: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg',
            field: 'טכנולוגיה'
          }
        }
      ]);
      setTrustCount(3);
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

      if (error) {
        console.warn('Bookmarks table may not exist, using demo data:', error);
        // Use demo bookmark data
        setSavedBookmarks([
          {
            id: 'bookmark-1',
            post: {
              id: 'post-1',
              video_url: '/videos/demo1.mp4',
              image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
              caption: 'פוסט שמור ראשון'
            }
          },
          {
            id: 'bookmark-2',
            post: {
              id: 'post-2',
              video_url: '/videos/demo2.mp4',
              image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
              caption: 'פוסט שמור שני'
            }
          }
        ]);
        console.log('🔖 Using demo bookmarks: 2');
        return;
      }
      
      setSavedBookmarks(data || []);
      console.log('🔖 Saved bookmarks loaded:', data?.length);
    } catch (error) {
      console.error('Failed to load saved bookmarks:', error);
      setSavedBookmarks([]);
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
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-2" dir="ltr">@demouser</p>

          {/* Expertise Fields */}
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            {expertiseFields.map((field, i) => (
              <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {field}
              </span>
            ))}
          </div>

          {/* Bio Section */}
          <div className="px-6 mb-4 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="line-clamp-3 inline">
                {userBio}
              </span>
              {' '}
              <button 
                onClick={() => handleTabChange('info')}
                className="text-primary text-sm font-medium hover:underline inline"
              >
                עוד
              </button>
            </p>
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
                "flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex flex-col items-center justify-center gap-1",
                activeTab === 'posts' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-1">
                <Grid3x3 className="w-4 h-4" />
                <span className="text-[15px] font-semibold">{userPosts.length}</span>
              </div>
              <span>פוסטים</span>
            </button>
            <button
              onClick={() => handleTabChange('trust')}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex flex-col items-center justify-center gap-1",
                activeTab === 'trust' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-1">
                <Handshake className="w-4 h-4" />
                <span className="text-[15px] font-semibold">{trustCount}</span>
              </div>
              <span>אמון</span>
            </button>
            <button
              onClick={() => handleTabChange('bookmarks')}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex flex-col items-center justify-center gap-1",
                activeTab === 'bookmarks' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-1">
                <Bookmark className="w-4 h-4" />
                <span className="text-[15px] font-semibold">{savedBookmarks.length}</span>
              </div>
              <span>שמורים</span>
            </button>
            <button
              onClick={() => handleTabChange('decisions')}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex flex-col items-center justify-center gap-1",
                activeTab === 'decisions' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-1">
                <CheckSquare className="w-4 h-4" />
                <span className="text-[15px] font-semibold">{decisionsCount}</span>
              </div>
              <span>החלטות</span>
            </button>
            <button
              onClick={() => handleTabChange('info')}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex flex-col items-center justify-center gap-1",
                activeTab === 'info' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Info className="w-4 h-4" />
              <span>מידע</span>
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
              <p className="text-sm leading-relaxed">{userBio}</p>
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

      {/* Trust Tab */}
      {activeTab === 'trust' && (
        <div>
          <h3 className="text-lg font-bold mb-4">רשת האמון שלי</h3>

          {/* People I Trust */}
          <div className="mb-6">
            <h4 className="font-bold mb-3 text-primary">אני נותן אמון ל:</h4>
            {trustedByMe.length > 0 ? (
              <div className="space-y-3">
                {trustedByMe.map((trust, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => navigate(`/user/${trust.trusted?.user_id || trust.id}`)}
                  >
                    <img 
                      src={trust.trusted?.avatar_url || 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg'} 
                      className="w-12 h-12 rounded-full" 
                      alt=""
                    />
                    <div className="flex-1">
                      <p className="font-medium">{trust.trusted?.full_name || 'משתמש'}</p>
                      <p className="text-sm text-muted-foreground">{trust.trusted?.field || 'כללי'}</p>
                    </div>
                    <Handshake className="w-5 h-5 text-trust" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <Handshake className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">עדיין לא נתת אמון למשתמשים</p>
              </div>
            )}
          </div>

          {/* People Who Trust Me */}
          <div>
            <h4 className="font-bold mb-3 text-primary">נותנים לי אמון:</h4>
            {trustedMe.length > 0 ? (
              <div className="space-y-3">
                {trustedMe.map((trust, i) => {
                  const trusterId = trust.truster?.user_id || trust.id;
                  const isTrustingBack = trustedByMe.some(t => (t.trusted?.user_id || t.id) === trusterId);
                  
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div 
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => navigate(`/user/${trusterId}`)}
                      >
                        <img 
                          src={trust.truster?.avatar_url || 'https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg'} 
                          className="w-12 h-12 rounded-full" 
                          alt=""
                        />
                        <div className="flex-1">
                          <p className="font-medium">{trust.truster?.full_name || 'משתמש'}</p>
                          <p className="text-sm text-muted-foreground">{trust.truster?.field || 'כללי'}</p>
                        </div>
                      </div>
                      {!isTrustingBack && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrustBack(trusterId);
                          }}
                          className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1"
                        >
                          <Handshake className="w-4 h-4" />
                          <span>אמון חזרה</span>
                        </button>
                      )}
                      {isTrustingBack && (
                        <div className="flex items-center gap-1 text-trust text-sm">
                          <Handshake className="w-4 h-4" />
                          <span>נותן אמון</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <Handshake className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">עדיין אין מי שנותן לך אמון</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bookmarks Tab */}
      {activeTab === 'bookmarks' && (
        <div>
          {/* Saved Posts Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">פוסטים שמורים ({savedBookmarks.length})</h3>
            {savedBookmarks.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {savedBookmarks.map((bookmark) => (
                  <div 
                    key={bookmark.id} 
                    className="aspect-square bg-muted rounded-lg overflow-hidden relative group cursor-pointer"
                    onClick={() => {
                      // Navigate to the original post
                      if (bookmark.post?.id) {
                        navigate(`/?post=${bookmark.post.id}`);
                      }
                    }}
                  >
                    {bookmark.post?.video_url && (
                      <video src={bookmark.post.video_url} className="w-full h-full object-cover" />
                    )}
                    {bookmark.post?.image_url && (
                      <img src={bookmark.post.image_url} className="w-full h-full object-cover" alt="" />
                    )}
                    
                    {/* Remove Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBookmark(bookmark.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
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
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <Bookmark className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">עדיין לא שמרת פוסטים</p>
              </div>
            )}
          </div>

          {/* Following/Subscriptions Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">עוקב אחרי ({subscriptions.length})</h3>
            {subscriptions.length > 0 ? (
              <div className="space-y-3">
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div 
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => navigate(`/user/${subscription.creator?.user_id || subscription.creator_id}`)}
                    >
                      <img 
                        src={subscription.creator?.avatar_url || 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg'} 
                        className="w-12 h-12 rounded-full" 
                        alt=""
                      />
                      <div className="flex-1">
                        <p className="font-medium">{subscription.creator?.full_name || 'משתמש'}</p>
                        <p className="text-sm text-muted-foreground">{subscription.creator?.field || 'כללי'}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsubscribe(subscription.creator?.user_id || subscription.creator_id);
                      }}
                      className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-sm rounded-full transition-colors"
                    >
                      ביטול מעקב
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <Share2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">עדיין לא עוקב אחרי אף אחד</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decisions Tab */}
      {activeTab === 'decisions' && (
        <div>
          <h3 className="text-lg font-bold mb-4">ההחלטות שלי ({decisionsCount})</h3>
          {userDecisions.length > 0 ? (
            <div className="space-y-4">
              {userDecisions.map((vote) => {
                const decision = vote.decision;
                return (
                  <div key={vote.id} className="bg-muted/50 rounded-lg p-4 hover:bg-muted transition-colors">
                    <h4 className="font-medium mb-2">{decision?.title || 'החלטה'}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{decision?.description || ''}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(vote.created_at).toLocaleDateString('he-IL', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <Vote className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                          {vote.vote_value === 'yes' ? 'בעד' : vote.vote_value === 'no' ? 'נגד' : 'נמנע'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">עדיין לא השתתפת בהחלטות</p>
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
