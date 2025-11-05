import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, Heart, Eye, Gavel, Handshake, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ trust: 0, votes: 0, decisions: 0 });

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      // Fetch user's posts to get profile info and stats
      const { data: posts } = await supabase
        .from('demo_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (!posts || posts.length === 0) {
        setUser({ username: 'User Not Found', user_id: userId });
        return;
      }
      
      // Get user info from first post
      const firstPost = posts[0];
      setUser({
        user_id: userId,
        username: firstPost.username,
        profile_image: firstPost.profile_image,
        expertise: firstPost.expertise,
        is_verified: firstPost.is_verified
      });
      
      setUserPosts(posts);
      
      // Calculate stats
      const totalTrust = posts.reduce((sum, p) => sum + (p.trust_count || 0), 0);
      const totalVotes = posts.reduce((sum, p) => sum + (p.vote_count || 0), 0);
      
      setStats({ trust: totalTrust, votes: totalVotes, decisions: 0 });
      
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <p>טוען...</p>
        <Navigation zoozBalance={999} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="p-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">פרופיל משתמש</h1>
        </div>

        {/* Profile */}
        <div className="p-6 text-center">
          <img
            src={user.profile_image || '/default-avatar.jpg'}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary"
          />
          
          <h2 className="text-2xl font-bold mb-1">{user.username}</h2>
          <p className="text-sm text-muted-foreground mb-4" dir="ltr">{userId}@</p>

          {/* Stats */}
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
                <Heart className="w-5 h-5 text-primary" />
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

        {/* Posts */}
        <div className="px-4">
          <h3 className="text-lg font-bold mb-4">פוסטים ({userPosts.length})</h3>
          {userPosts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {userPosts.map(post => (
                <div key={post.id} className="aspect-[3/4] bg-muted rounded-lg overflow-hidden relative">
                  {post.video_url && (
                    <video src={post.video_url} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 p-2">
                    <div className="flex items-center justify-between text-white text-xs">
                      <span>👁️ {post.watch_count || 0}</span>
                      <span>🤝 {post.trust_count || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground">אין פוסטים</p>
          )}
        </div>
      </div>

      <Navigation zoozBalance={999} />
    </div>
  );
}
