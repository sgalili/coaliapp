import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Eye, Share, UserCheck, MapPin, Calendar, Shield, GraduationCap, Handshake, Crown, TrendingUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrustBadge } from "@/components/TrustBadge";
import { TrustStatusIndicator } from "@/components/TrustStatusIndicator";
import { VideoGrid } from "@/components/VideoGrid";
import { ZoozEarnedDisplay } from "@/components/ZoozEarnedDisplay";
import { getDomainConfig, getAllDomains } from "@/lib/domainConfig";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  id: string;
  username: string;
  handle: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  kycLevel: number;
  trustersCount: number;
  watchersCount: number;
  postsCount: number;
  zoozEarned: number;
  expertise: Array<{ domain: string; name: string; trustCount: number }>;
}

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const [isTrusting, setIsTrusting] = useState(false);
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId]);

  const fetchUserProfile = async (uid: string) => {
    try {
      setIsLoading(true);

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', uid)
        .maybeSingle();

      if (profileError || !profile) {
        console.error('Error fetching profile:', profileError);
        setIsLoading(false);
        return;
      }

      // Fetch user's posts
      const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      setUserPosts(posts || []);

      // Fetch trust count
      const { count: trustersCount } = await supabase
        .from('trusts')
        .select('*', { count: 'exact', head: true })
        .eq('trusted_id', uid);

      // Fetch watchers count
      const { count: watchersCount } = await supabase
        .from('watches')
        .select('*', { count: 'exact', head: true })
        .eq('watched_id', uid);

      // Fetch wallet balance
      const { data: balance } = await supabase
        .from('user_balances')
        .select('zooz_balance')
        .eq('user_id', uid)
        .maybeSingle();

      // Check if current user is trusting this user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: trustData } = await supabase
          .from('trusts')
          .select('*')
          .eq('truster_id', currentUser.id)
          .eq('trusted_id', uid)
          .maybeSingle();
        
        setIsTrusting(!!trustData);

        const { data: watchData } = await supabase
          .from('watches')
          .select('*')
          .eq('watcher_id', currentUser.id)
          .eq('watched_id', uid)
          .maybeSingle();
        
        setIsWatching(!!watchData);
      }

      const userData: UserData = {
        id: uid,
        username: profile.first_name && profile.last_name 
          ? `${profile.first_name} ${profile.last_name}` 
          : 'משתמש',
        handle: profile.phone || 'user',
        profileImage: profile.avatar_url,
        bio: '',
        location: '',
        kycLevel: 0,
        trustersCount: trustersCount || 0,
        watchersCount: watchersCount || 0,
        postsCount: posts?.length || 0,
        zoozEarned: balance?.zooz_balance || 0,
        expertise: []
      };

      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setIsLoading(false);
    }
  };

  const handleTrust = async () => {
    if (!userId) return;
    
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        navigate('/auth');
        return;
      }

      if (isTrusting) {
        // Remove trust
        await supabase
          .from('trusts')
          .delete()
          .eq('truster_id', currentUser.id)
          .eq('trusted_id', userId);
        setIsTrusting(false);
      } else {
        // Add trust
        await supabase
          .from('trusts')
          .insert({
            truster_id: currentUser.id,
            trusted_id: userId
          });
        setIsTrusting(true);
      }

      // Refresh profile to update counts
      fetchUserProfile(userId);
    } catch (error) {
      console.error('Error toggling trust:', error);
    }
  };

  const handleWatch = async () => {
    if (!userId) return;
    
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        navigate('/auth');
        return;
      }

      if (isWatching) {
        // Remove watch
        await supabase
          .from('watches')
          .delete()
          .eq('watcher_id', currentUser.id)
          .eq('watched_id', userId);
        setIsWatching(false);
      } else {
        // Add watch
        await supabase
          .from('watches')
          .insert({
            watcher_id: currentUser.id,
            watched_id: userId
          });
        setIsWatching(true);
      }

      // Refresh profile to update counts
      fetchUserProfile(userId);
    } catch (error) {
      console.error('Error toggling watch:', error);
    }
  };

  const TrustIcon = () => (
    <div className="relative flex justify-center mb-1">
      <div className="relative">
        <Handshake className="w-6 h-6 text-trust" />
        <Crown className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען פרופיל...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">משתמש לא נמצא</p>
          <Button onClick={() => navigate('/')}>חזור לעמוד הבית</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowRight className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">{user.username}</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.username}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
            <TrustStatusIndicator kycLevel={user.kycLevel} />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{user.username}</h2>
              <TrustBadge trustCount={user.trustersCount} />
            </div>
            <p className="text-sm text-muted-foreground">@{user.handle}</p>
            
            {user.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
          </div>
        </div>

        {user.bio && (
          <p className="text-sm leading-relaxed">{user.bio}</p>
        )}

        {/* Stats */}
        <div className="flex justify-around py-4 border-y border-border">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center cursor-pointer">
                  <Eye className="w-6 h-6 text-watch mx-auto mb-1" />
                  <div className="text-2xl font-bold">{user.watchersCount}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent><p>צופים</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center cursor-pointer">
                  <TrustIcon />
                  <div className="text-2xl font-bold">{user.trustersCount}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent><p>אמון</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <ZoozEarnedDisplay zoozEarned={user.zoozEarned} showAnimation textColorClass="text-foreground/90" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant={isTrusting ? "default" : "outline"}
            className="flex-1"
            onClick={handleTrust}
          >
            <Handshake className="w-4 h-4 ml-2" />
            {isTrusting ? 'מעקב' : 'תן אמון'}
          </Button>
          <Button 
            variant={isWatching ? "default" : "outline"}
            className="flex-1"
            onClick={handleWatch}
          >
            <Eye className="w-4 h-4 ml-2" />
            {isWatching ? 'צופה' : 'צפה'}
          </Button>
          <Button variant="outline" size="icon">
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="pb-20">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border" dir="rtl">
          <TabsTrigger value="posts">פוסטים ({user.postsCount})</TabsTrigger>
          <TabsTrigger value="info">מידע</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-0" dir="rtl">
          {userPosts.length > 0 ? (
            <VideoGrid 
              posts={userPosts.map(post => ({
                id: post.id,
                thumbnail: post.thumbnail_url || '/api/placeholder/300/400',
                caption: post.content || post.title || '',
                trustCount: post.trust_count || 0,
                watchCount: post.watch_count || 0,
                commentCount: post.comment_count || 0,
                shareCount: post.share_count || 0,
                duration: "0:15",
              }))}
              onVideoClick={(postId) => navigate(`/post/${postId}`)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <p className="text-muted-foreground">משתמש זה עדיין לא פרסם פוסטים</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="info" className="mt-0 space-y-6" dir="rtl">
          <div className="bg-card border-b border-border p-6">
            <p className="text-sm text-muted-foreground text-center">אין מידע נוסף</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
