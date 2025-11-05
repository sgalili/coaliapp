import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Settings, Heart, Eye, ShieldCheck, Handshake, Crown, Vote, Gavel, Menu, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ trust: 0, votes: 0, watch: 0, decisions: 0 });
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Demo count

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
      
      // Fetch decisions participated in
      const { data: decisionsData } = await supabase
        .from('demo_decisions')
        .select('*')
        .eq('has_voted', true); // Get decisions where user has voted
      
      // For demo, count all decisions as participated
      const { count } = await supabase
        .from('demo_decisions')
        .select('*', { count: 'exact', head: true });
      
      console.log('🗳️ Total decisions:', count);
      setStats(prev => ({ ...prev, decisions: count || 0 }));
      
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="relative p-6 text-center">
          <button className="absolute top-4 left-4 p-2 hover:bg-muted rounded-full">
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>

          <img
            src="https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary"
          />

          <h2 className="text-2xl font-bold mb-1">משתמש דמו מאומת</h2>
          <p className="text-sm text-muted-foreground mb-4" dir="ltr">demouser@</p>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1 relative">
                <Handshake className="w-5 h-5 text-trust" />
                <Crown className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />
                <p className="text-2xl font-bold ml-2">{stats.trust}</p>
              </div>
              <p className="text-xs text-muted-foreground">אמון</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <div className="w-6 h-6 rounded-sm bg-zooz flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="20" width="80" height="70" rx="4" fill="white"/>
                    <rect x="15" y="25" width="70" height="40" fill="currentColor" opacity="0.3"/>
                    <path d="M30 45 L45 60 L70 35" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
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

        <div className="px-4">
          <h3 className="text-lg font-bold mb-4">הפוסטים שלי ({userPosts.length})</h3>
          {userPosts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {userPosts.map((post) => (
                <div key={post.id} className="aspect-[3/4] bg-muted rounded-lg overflow-hidden relative">
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
      </div>

      <Navigation zoozBalance={9957} />
    </div>
  );
}
