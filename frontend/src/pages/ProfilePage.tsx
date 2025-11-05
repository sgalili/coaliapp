import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Settings, Heart, Eye, ShieldCheck, Handshake, Crown, Vote, Gavel, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ProfilePage() {
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ trust: 0, votes: 0, watch: 0 });

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
    loadUserPosts();
  }, []);

  const loadUserPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_posts')
        .select('*')
        .eq('user_id', 'demo-user')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('📊 Loaded', data?.length, 'user posts');
      setUserPosts(data || []);
      
      if (data && data.length > 0) {
        const totalTrust = data.reduce((sum, p) => sum + (p.trust_count || 0), 0);
        const totalVotes = data.reduce((sum, p) => sum + (p.vote_count || 0), 0);
        const totalWatch = data.reduce((sum, p) => sum + (p.watch_count || 0), 0);
        setStats({ trust: totalTrust, votes: totalVotes, watch: totalWatch });
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
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

          <h2 className="text-2xl font-bold mb-1">משתמש דמו</h2>
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
                <Vote className="w-5 h-5 text-primary" />
                <p className="text-2xl font-bold">{stats.votes}</p>
              </div>
              <p className="text-xs text-muted-foreground">הצבעות</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <Gavel className="w-5 h-5 text-purple-600" />
                <p className="text-2xl font-bold">0</p>
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
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2">
                    <p className="text-white text-xs">🛡️ {post.trust_count || 0}</p>
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
