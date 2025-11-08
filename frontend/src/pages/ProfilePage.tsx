import React, { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Settings, Heart, Eye, ShieldCheck, Handshake, Crown, Vote, Gavel, Menu, Bell, X, LogOut, User, Lock, HelpCircle, FileText, MessageSquare, Share2, Bookmark, Gift, Edit2, Grid3x3, Info, CheckSquare, FileEdit, Trash2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { EditProfileModal } from "@/components/EditProfileModal";
import { demoUsers } from "@/data/demoUsers";

export default function ProfilePage() {
  const navigate = useNavigate();
  
  // CRITICAL: Check authentication IMMEDIATELY on mount
  React.useEffect(() => {
    const authUserId = localStorage.getItem('authenticated_user_id');
    const authPhone = localStorage.getItem('authenticated_user_phone');
    const demoMode = localStorage.getItem('demo_mode');
    
    console.log('🚨 PROFILE PAGE MOUNTED');
    console.log('📋 Full localStorage dump:');
    Object.keys(localStorage).forEach(key => {
      console.log(`  ${key}:`, localStorage.getItem(key));
    });
    
    if (authUserId && authUserId !== 'demo-user') {
      console.log('✅ REAL USER DETECTED:', authUserId);
      console.log('🧹 Ensuring no demo mode...');
      
      // Force remove any demo flags
      if (demoMode) {
        localStorage.removeItem('demo_mode');
        console.log('🔄 Removed demo_mode flag, reloading...');
        window.location.reload();
      }
    } else if (!authUserId) {
      console.log('⚠️ NO authenticated_user_id - Will use demo-user');
    }
  }, []);
  
  // Check if user is authenticated (real user) or demo
  const getAuthenticatedUserId = () => {
    const authUserId = localStorage.getItem('authenticated_user_id');
    
    // CRITICAL: If we have an authenticated user ID that's not demo-user, USE IT
    if (authUserId && authUserId !== 'demo-user' && authUserId !== 'undefined' && authUserId !== 'null') {
      console.log('✅ Using REAL authenticated user:', authUserId);
      return authUserId;
    }
    
    console.log('⚠️ Defaulting to demo-user');
    return 'demo-user';
  };
  
  const currentUserId = getAuthenticatedUserId();
  const isDemoUser = currentUserId === 'demo-user';
  
  console.log('👤 FINAL Current user:', currentUserId);
  console.log('👤 Is demo?:', isDemoUser);
  console.log('👤 Will load data for:', currentUserId);
  
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [trustCount, setTrustCount] = useState(0);
  const [decisionsCount, setDecisionsCount] = useState(0);
  const [userDecisions, setUserDecisions] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Demo count
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'trust' | 'favorites' | 'decisions'>('posts');
  const [showDrafts, setShowDrafts] = useState(false);
  const [trustSubTab, setTrustSubTab] = useState<'trust-me' | 'i-trust'>('trust-me');
  const [bookmarksSubTab, setBookmarksSubTab] = useState<'posts' | 'subscriptions'>('posts');
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
  const [showEditProfile, setShowEditProfile] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const [isBioLong, setIsBioLong] = useState(false);
  
  // REAL user profile data
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const userBio = userProfile?.bio || "בוגר תקשורת מאוניברסיטת תל אביב, עובד בתחום הטכנולוגיה כמנהל מוצר במשך 8 שנים. תומך בחדשנות ישראלית ומאמין בכוח הקהילה לשנות את העולם. אוהב לטייל, לקרוא ספרים על היסטוריה ולצלם נופים.";

  const handleTrustBack = async (userId: string) => {
    try {
      // Add trust relationship
      const { error } = await supabase
        .from('trust_relationships')
        .insert({
          truster_user_id: currentUserId,
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

  const loadUserProfile = async () => {
    try {
      console.log('📋 Loading profile for user:', currentUserId);
      
      if (currentUserId === 'demo-user') {
        // Demo user - use default data
        setUserProfile({
          first_name: 'משתמש דמו',
          last_name: 'מאומת',
          avatar_url: 'https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg',
          bio: 'בוגר תקשורת מאוניברסיטת תל אביב, עובד בתחום הטכנולוגיה כמנהל מוצר במשך 8 שנים.',
          expertise_fields: ['טכנולוגיה', 'עסקים', 'חדשות']
        });
        return;
      }
      
      // REAL USER - Load from database
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUserId)
        .single();
      
      if (error) {
        console.error('Error loading profile:', error);
        return;
      }
      
      console.log('✅ REAL user profile loaded:', data);
      setUserProfile(data);
      
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const handleUntrust = async (userId: string) => {
    if (!confirm('האם אתה בטוח שברצונך לבטל את האמון?')) return;

    try {
      const { error } = await supabase
        .from('trust_relationships')
        .delete()
        .eq('truster_user_id', currentUserId)
        .eq('trusted_user_id', userId);

      if (error) throw error;

      console.log('✅ Trust removed');
      // Reload trust data
      await loadTrustCount();
    } catch (error) {
      console.error('Failed to remove trust:', error);
    }
  };

  const handleUnsubscribe = async (creatorId: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('subscriber_id', currentUserId)
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
    
    // Load user profile first
    loadUserProfile();
    
    // Then load posts and other data
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
    
    // Real-time subscription for decisions/votes
    const votesSubscription = supabase
      .channel('profile-votes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_votes', filter: `user_id=eq.demo-user` },
        () => {
          console.log('🔄 Votes changed, reloading...');
          loadUserDecisions();
        }
      )
      .subscribe();
    
    // Real-time subscription for bookmarks
    const bookmarksSubscription = supabase
      .channel('profile-bookmarks')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks', filter: `bookmark_user_id=eq.demo-user` },
        () => {
          console.log('🔄 Bookmarks changed, reloading...');
          loadSavedBookmarks();
        }
      )
      .subscribe();
    
    // Real-time subscription for trust relationships
    const trustSubscription = supabase
      .channel('profile-trust')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'trust_relationships' },
        (payload) => {
          console.log('🔄 Trust relationships changed, reloading...');
          loadTrustCount();
        }
      )
      .subscribe();
    
    // Real-time subscription for subscriptions
    const subsSubscription = supabase
      .channel('profile-subscriptions')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'subscriptions', filter: `subscriber_id=eq.demo-user` },
        () => {
          console.log('🔄 Subscriptions changed, reloading...');
          loadSubscriptions();
        }
      )
      .subscribe();
    
    return () => {
      postsSubscription.unsubscribe();
      votesSubscription.unsubscribe();
      bookmarksSubscription.unsubscribe();
      trustSubscription.unsubscribe();
      subsSubscription.unsubscribe();
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
  const handleTabChange = (tab: 'posts' | 'trust' | 'favorites' | 'decisions') => {
    setActiveTab(tab);
    // Don't auto-scroll - user has full manual control
  };

  const loadDraftPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_posts')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('status', 'draft')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Draft posts may not exist, using demo data:', error);
        // Use demo draft data with placeholder
        setDraftPosts([
          {
            id: 'draft-1',
            caption: 'טיוטה ראשונה - רעיונות על חדשנות בישראל',
            image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
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

  const handleEditPost = (postId: string, isDraft: boolean = false) => {
    // TODO: Open edit modal/page
    console.log('Edit post/draft:', postId);
    alert(`עריכת ${isDraft ? 'טיוטה' : 'פוסט'} - תכונה תבוא בקרוב`);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק?')) return;

    try {
      const { error } = await supabase
        .from('demo_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', currentUserId); // Only allow deleting own posts

      if (error) throw error;

      console.log('✅ Post deleted');
      // Reload posts
      await loadUserPosts();
      await loadDraftPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('שגיאה במחיקת הפוסט');
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
      // Fetch user's posts
      const { data, error } = await supabase
        .from('demo_posts')
        .select('*')
        .eq('user_id', currentUserId)
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
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('subscriber_id', currentUserId)
        .order('created_at', { ascending: false });

      // Map to demo users from demoUsers.ts
      let subsWithProfiles = (data || []).map(sub => {
        const user = demoUsers.find(u => u.id === sub.creator_id);
        return user ? {
          id: sub.id || Math.random().toString(),
          creator_id: sub.creator_id,
          creator: {
            user_id: user.id,
            full_name: `${user.first_name} ${user.last_name}`,
            avatar_url: user.avatar_url,
            field: user.field
          }
        } : null;
      }).filter(Boolean);
      
      setSubscriptions(subsWithProfiles);
      console.log('📱 Subscriptions loaded:', subsWithProfiles.length);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      setSubscriptions([]);
    }
  };

  const loadUserDecisions = async () => {
    try {
      const { data } = await supabase
        .from('user_votes')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });

      if (!data || data.length === 0) {
        setUserDecisions([]);
        setDecisionsCount(0);
        console.log('🗳️ No votes found');
        return;
      }

      // Load decision data for each vote
      let votesWithDecisions = [];
      for (const vote of data) {
        const { data: decision } = await supabase
          .from('demo_decisions')
          .select('*')
          .eq('id', vote.decision_id)
          .single();
        
        if (decision) {
          votesWithDecisions.push({
            ...vote,
            decision: decision
          });
        }
      }

      setUserDecisions(votesWithDecisions);
      setDecisionsCount(votesWithDecisions.length);
      console.log('🗳️ User decisions loaded:', votesWithDecisions.length);
    } catch (error) {
      console.error('Failed to load user decisions:', error);
      setDecisionsCount(0);
      setUserDecisions([]);
    }
  };

  const loadTrustCount = async () => {
    try {
      // Load trust relationships from database
      const { data: trustedMeData } = await supabase
        .from('trust_relationships')
        .select('*')
        .eq('trusted_user_id', currentUserId);

      const { data: trustedByMeData } = await supabase
        .from('trust_relationships')
        .select('*')
        .eq('truster_user_id', currentUserId);

      // Map to demo users from demoUsers.ts
      let trustedMeList = (trustedMeData || []).map(trust => {
        const user = demoUsers.find(u => u.id === trust.truster_user_id);
        return user ? {
          id: trust.id || Math.random().toString(),
          truster_user_id: trust.truster_user_id,
          truster: {
            user_id: user.id,
            full_name: `${user.first_name} ${user.last_name}`,
            avatar_url: user.avatar_url,
            field: user.field
          }
        } : null;
      }).filter(Boolean);

      let trustedByMeList = (trustedByMeData || []).map(trust => {
        const user = demoUsers.find(u => u.id === trust.trusted_user_id);
        return user ? {
          id: trust.id || Math.random().toString(),
          trusted_user_id: trust.trusted_user_id,
          trusted: {
            user_id: user.id,
            full_name: `${user.first_name} ${user.last_name}`,
            avatar_url: user.avatar_url,
            field: user.field
          }
        } : null;
      }).filter(Boolean);

      setTrustedMe(trustedMeList);
      setTrustedByMe(trustedByMeList);
      setTrustCount(trustedMeList.length);
      
      console.log('🤝 Loaded trust data:', { trustedMe: trustedMeList.length, trustedByMe: trustedByMeList.length });
      
    } catch (error) {
      console.error('Failed to load trust relationships:', error);
      setTrustCount(0);
      setTrustedMe([]);
      setTrustedByMe([]);
    }
  };

  const loadSavedBookmarks = async () => {
    try {
      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('bookmark_user_id', currentUserId)
        .order('created_at', { ascending: false });

      if (!data || data.length === 0) {
        setSavedBookmarks([]);
        console.log('🔖 No bookmarks found');
        return;
      }

      // Load post data for each bookmark
      let bookmarksWithPosts = [];
      for (const bookmark of data) {
        const { data: post } = await supabase
          .from('demo_posts')
          .select('*')
          .eq('id', bookmark.post_id)
          .single();
        
        if (post) {
          bookmarksWithPosts.push({
            id: bookmark.id,
            post: post
          });
        }
      }
      
      setSavedBookmarks(bookmarksWithPosts);
      console.log('🔖 Bookmarks loaded:', bookmarksWithPosts.length);
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
      
      console.log('המועדף הוסר');
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
              <button 
                onClick={() => {
                  navigate('/notifications-settings');
                  setShowBurgerMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg text-right"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span>התראות</span>
              </button>

              <button 
                onClick={() => {
                  navigate('/invite-friends');
                  setShowBurgerMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg text-right"
              >
                <Gift className="w-5 h-5 text-primary" />
                <span>Get Free ZOOZ</span>
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

              {/* Conditional: Demo user sees signup/login, Real user sees logout */}
              {isDemoUser ? (
                <button 
                  onClick={() => {
                    navigate('/auth');
                    setShowBurgerMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 rounded-lg text-right text-primary mt-4"
                >
                  <User className="w-5 h-5" />
                  <span>הרשמה/כניסה</span>
                </button>
              ) : (
                <button 
                  onClick={() => {
                    // Logout logic for real users
                    supabase.auth.signOut();
                    localStorage.clear();
                    navigate('/');
                    setShowBurgerMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg text-right text-red-600 mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span>התנתק</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Fixed Header with Menu on Right and Bell on Left */}
        <div className="sticky top-0 z-50 bg-background">
          <div className="relative p-6 text-center pb-0">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setShowBurgerMenu(true)}
                className="p-2 hover:bg-muted rounded-full bg-background"
              >
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="absolute top-4 left-4">
              <button
                onClick={() => navigate('/notifications')}
                className="p-2 hover:bg-muted rounded-full transition-colors relative bg-background"
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
        </div>

        {/* Profile Content */}
        <div className="relative p-6 pt-0 text-center">
          {/* Profile Image */}
          <img
            src="https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary"
          />

          {/* Name & Handle with Edit Icon */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">משתמש דמו מאומת</h2>
            <button 
              onClick={() => setShowEditProfile(true)}
              className="p-1.5 hover:bg-muted rounded-full transition-colors"
            >
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Expertise Fields */}
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            {expertiseFields.map((field, i) => (
              <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {field}
              </span>
            ))}
          </div>

          {/* Bio Section - Clickable to expand/collapse */}
          <div className="px-6 mb-4 text-center">
            <p 
              onClick={() => setShowFullBio(!showFullBio)}
              className={cn(
                "text-sm text-muted-foreground leading-relaxed cursor-pointer hover:text-foreground transition-colors",
                !showFullBio && "line-clamp-3"
              )}
            >
              {userBio}
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
                <span className="text-[18px] font-semibold">{userPosts.length}</span>
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
                <span className="text-[18px] font-semibold">{trustCount}</span>
              </div>
              <span>אמון</span>
            </button>
            <button
              onClick={() => handleTabChange('favorites')}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex flex-col items-center justify-center gap-1",
                activeTab === 'favorites' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-1">
                <Bookmark className="w-4 h-4" />
                <span className="text-[18px] font-semibold">{savedBookmarks.length}</span>
              </div>
              <span>מועדפים</span>
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
                <span className="text-[18px] font-semibold">{decisionsCount}</span>
              </div>
              <span>החלטות</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-6">
          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div>
              {/* Toggle between Posts and Drafts */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setShowDrafts(false)}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
                    !showDrafts 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  פוסטים ({userPosts.length})
                </button>
                <button
                  onClick={() => setShowDrafts(true)}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
                    showDrafts 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  טיוטות ({draftPosts.length})
                </button>
              </div>

              {/* Published Posts */}
              {!showDrafts && (
                <>
                  {userPosts.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {userPosts.map((post) => (
                        <div 
                          key={post.id} 
                          className="aspect-square bg-muted rounded-lg overflow-hidden relative group cursor-pointer"
                          onClick={() => navigate(`/?post=${post.id}`)}
                        >
                          {post.video_url && (
                            <video src={post.video_url} className="w-full h-full object-cover" />
                          )}
                          
                          {/* Edit/Delete buttons */}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPost(post.id);
                              }}
                              className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePost(post.id);
                              }}
                              className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          
                          {/* Post stats */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                            <div className="flex items-center justify-between text-white text-xs">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{post.watch_count || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Bookmark className="w-3 h-3" />
                                <span>{post.bookmark_count || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Handshake className="w-3 h-3" />
                                <span>{post.trust_count || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-12 text-muted-foreground">עדיין לא העלית פוסטים</p>
                  )}
                </>
              )}

              {/* Drafts */}
              {showDrafts && (
                <>
                  {draftPosts.length > 0 ? (
                    <div className="space-y-4">
                      {draftPosts.map((draft) => (
                        <div key={draft.id} className="bg-muted/50 rounded-lg p-4 hover:bg-muted transition-colors">
                          <div className="flex items-start gap-3">
                            {/* Draft Thumbnail */}
                            <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                              {draft.video_url && (
                                <video src={draft.video_url} className="w-full h-full object-cover" />
                              )}
                              {draft.image_url && (
                                <img src={draft.image_url} className="w-full h-full object-cover" alt="" />
                              )}
                              {!draft.video_url && !draft.image_url && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FileEdit className="w-8 h-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            
                            {/* Draft Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium mb-1 line-clamp-2">{draft.caption || 'ללא כותרת'}</p>
                              <p className="text-xs text-muted-foreground">
                                נוצר ב-{new Date(draft.created_at).toLocaleDateString('he-IL')}
                              </p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => {
                                  handleEditPost(draft.id, true);
                                }}
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                title="עריכה"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handlePublishDraft(draft.id)}
                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                title="פרסום"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePost(draft.id)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                title="מחיקה"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileEdit className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">אין לך טיוטות</p>
                      <p className="text-sm text-muted-foreground mt-2">התחל ליצור תוכן ושמור אותו כטיוטה</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

      {/* Trust Tab */}
      {activeTab === 'trust' && (
        <div>
          {/* Toggle between Trust Me and I Trust */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTrustSubTab('trust-me')}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
                trustSubTab === 'trust-me' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              נותנים לי אמון ({trustedMe.length})
            </button>
            <button
              onClick={() => setTrustSubTab('i-trust')}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
                trustSubTab === 'i-trust' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              אני נותן אמון ({trustedByMe.length})
            </button>
          </div>

          {/* People Who Trust Me - First Tab */}
          {trustSubTab === 'trust-me' && (
            <div>
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
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Handshake className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">עדיין אין מי שנותן לך אמון</p>
                </div>
              )}
            </div>
          )}

          {/* People I Trust - Second Tab */}
          {trustSubTab === 'i-trust' && (
            <div>
              {trustedByMe.length > 0 ? (
                <div className="space-y-3">
                  {trustedByMe.map((trust, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div 
                        className="flex items-center gap-3 flex-1 cursor-pointer"
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
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUntrust(trust.trusted?.user_id || trust.id);
                        }}
                        className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-sm rounded-full transition-colors"
                      >
                        ביטול אמון
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Handshake className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">עדיין לא נתת אמון למשתמשים</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Favorites Tab (formerly Bookmarks) */}
      {activeTab === 'favorites' && (
        <div>
          {/* Toggle between Posts and Subscriptions */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setBookmarksSubTab('posts')}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
                bookmarksSubTab === 'posts' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              פוסטים שמורים ({savedBookmarks.length})
            </button>
            <button
              onClick={() => setBookmarksSubTab('subscriptions')}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
                bookmarksSubTab === 'subscriptions' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              מנויים ({subscriptions.length})
            </button>
          </div>

          {/* Saved Posts Section */}
          {bookmarksSubTab === 'posts' && (
            <div>
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
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Bookmark className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">עדיין לא שמרת פוסטים</p>
                </div>
              )}
            </div>
          )}

          {/* Subscriptions Section */}
          {bookmarksSubTab === 'subscriptions' && (
            <div>
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
                        ביטול מינוי
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Share2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">אין לך מנויים</p>
                </div>
              )}
            </div>
          )}
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
                if (!decision) return null;
                
                return (
                  <div key={vote.id} className="bg-muted/50 rounded-lg p-4 hover:bg-muted transition-colors">
                    <h4 className="font-medium mb-2">{decision.title || 'החלטה'}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{decision.description || ''}</p>
                    
                    {/* Vote Results */}
                    {decision.votes_yes !== undefined && (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="text-green-600 font-bold">{decision.votes_yes || 0}</div>
                          <div className="text-xs text-green-700">בעד</div>
                        </div>
                        <div className="text-center p-2 bg-red-50 rounded">
                          <div className="text-red-600 font-bold">{decision.votes_no || 0}</div>
                          <div className="text-xs text-red-700">נגד</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-gray-600 font-bold">{decision.votes_abstain || 0}</div>
                          <div className="text-xs text-gray-700">נמנע</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(vote.created_at).toLocaleDateString('he-IL', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold",
                          vote.vote_value === 'yes' && "bg-green-100 text-green-700",
                          vote.vote_value === 'no' && "bg-red-100 text-red-700",
                          vote.vote_value === 'abstain' && "bg-gray-100 text-gray-700"
                        )}>
                          {vote.vote_value === 'yes' ? '✓ בעד' : vote.vote_value === 'no' ? '✗ נגד' : '○ נמנע'}
                        </div>
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
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        userId={currentUserId}
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={() => {
          setShowEditProfile(false);
          loadUserPosts();
        }}
      />
    </div>
  );
}
