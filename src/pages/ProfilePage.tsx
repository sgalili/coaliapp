import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Eye, MessageCircle, Share, MapPin, Calendar, UserCheck, Camera, Vote, TrendingUp, Shield, GraduationCap, Handshake, Crown, Globe, Twitter, Facebook, Youtube, Linkedin, ExternalLink, Bell, User, Plus } from "lucide-react";
import { CoalitionIcon } from "@/components/CoalitionIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { TrustBadge } from "@/components/TrustBadge";
import { ZoozEarnedDisplay } from "@/components/ZoozEarnedDisplay";
import { EditableField } from "@/components/EditableField";
import { ProfileMenu } from "@/components/ProfileMenu";
import { KYCManagement } from "@/components/KYCManagement";
import { TrustStatusIndicator } from "@/components/TrustStatusIndicator";
import { VideoGrid } from "@/components/VideoGrid";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  username: string;
  handle: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  kycLevel: number;
  trustersCount: number;
  watchersCount: number;
  postsCount: number;
  zoozEarned: number;
  expertise: Array<{ domain: string; name: string; trustCount: number; icon: any }>;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        console.error('Error getting auth user:', authError);
        navigate('/auth');
        return;
      }

      console.log('Fetching profile for user:', authUser.id);
      
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        if (profileError.code === 'PGRST116') {
          navigate('/auth');
        }
        return;
      }

      console.log('Profile fetched:', profile);

      // Fetch user's posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching posts:', postsError);
      } else {
        setUserPosts(posts || []);
        console.log('User posts fetched:', posts?.length || 0);
      }

      // Fetch trust count (people who trust this user)
      const { count: trustersCount } = await supabase
        .from('trusts')
        .select('*', { count: 'exact', head: true })
        .eq('trusted_id', authUser.id);

      // Fetch watchers count
      const { count: watchersCount } = await supabase
        .from('watches')
        .select('*', { count: 'exact', head: true })
        .eq('watched_id', authUser.id);

      // Fetch wallet balance
      const { data: balance } = await supabase
        .from('user_balances')
        .select('zooz_balance')
        .eq('user_id', authUser.id)
        .single();

      // Fetch user expertise
      const { data: expertise } = await supabase
        .from('user_expertise')
        .select('*')
        .eq('user_id', authUser.id);

      const userProfile: UserProfile = {
        id: authUser.id,
        username: profile.first_name && profile.last_name 
          ? `${profile.first_name} ${profile.last_name}` 
          : '',
        handle: authUser.email?.split('@')[0] || 'user',
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

      setUser(userProfile);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setIsLoading(false);
    }
  };

  const handleUpdateField = async (field: string, value: any) => {
    if (!user) return;
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Update profile in database
      if (field === 'username') {
        const [firstName, ...lastNameParts] = value.split(' ');
        const lastName = lastNameParts.join(' ');
        
        await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName
          })
          .eq('user_id', authUser.id);
      }

      // Update local state
      setUser(prev => prev ? { ...prev, [field]: value } : null);
    } catch (error) {
      console.error('Error updating field:', error);
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
          <p className="text-muted-foreground mb-4">לא נמצא פרופיל</p>
          <Button onClick={() => navigate('/auth')}>התחבר</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-end p-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/notification')}
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/mygov')}
            >
              <CoalitionIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share className="w-4 h-4" />
            </Button>
            <ProfileMenu />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-6 space-y-4">
        {/* Avatar and Basic Info */}
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
            <Button
              variant="ghost"
              size="icon"
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-background border border-border rounded-full shadow-sm hover:bg-accent"
            >
              <Camera className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {user.username ? (
                    <EditableField
                      value={user.username}
                      onSave={(value) => handleUpdateField('username', value)}
                      className="text-xl font-bold"
                    />
                  ) : (
                    <EditableField
                      value=""
                      onSave={(value) => handleUpdateField('username', value)}
                      placeholder="הוסף שם"
                      className="text-xl font-bold text-muted-foreground"
                    />
                  )}
                  <TrustBadge trustCount={user.trustersCount} />
                </div>
                <p className="text-sm text-muted-foreground">@{user.handle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <EditableField
                  value={user.location || ''}
                  onSave={(value) => handleUpdateField('location', value)}
                  placeholder="הוסף מיקום"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <EditableField
          value={user.bio || ''}
          onSave={(value) => handleUpdateField('bio', value)}
          type="textarea"
          placeholder="כתוב על עצמך..."
          className="text-sm leading-relaxed text-right"
          maxLength={280}
        />

        {/* Expertise Badges */}
        {user.expertise.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {user.expertise.map((domain) => {
              const IconComponent = domain.icon;
              return (
                <div key={domain.domain} className="shrink-0">
                  <Badge 
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1.5 transition-colors hover:bg-accent"
                  >
                    <IconComponent className="w-3 h-3" />
                    <span className="text-xs font-medium">{domain.name} ({domain.trustCount})</span>
                  </Badge>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-around py-4 border-y border-border">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center cursor-pointer">
                  <Eye className="w-6 h-6 text-watch mx-auto mb-1" />
                  <div className="text-2xl font-bold text-foreground/90 mt-1">{user.watchersCount}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>מספר הצופים</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center cursor-pointer">
                  <TrustIcon />
                  <div className="text-2xl font-bold text-foreground/90 mt-1">{user.trustersCount}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>מספר האנשים שהביעו אמון</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <ZoozEarnedDisplay zoozEarned={user.zoozEarned} showAnimation textColorClass="text-foreground/90" />
        </div>
      </div>

      {/* KYC Management Section */}
      <div className="px-6 pb-4">
        <KYCManagement className="bg-card/50 rounded-lg p-3" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="pb-20">
        <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-border" dir="rtl">
          <TabsTrigger value="posts">פוסטים ({user.postsCount})</TabsTrigger>
          <TabsTrigger value="info">מידע</TabsTrigger>
          <TabsTrigger value="trusters">אמון</TabsTrigger>
          <TabsTrigger value="trusted">נתתי אמון</TabsTrigger>
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
              <MessageCircle className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">עדיין לא פרסמת פוסטים</h3>
              <p className="text-sm text-muted-foreground mb-4">התחל לשתף את המחשבות שלך עם הקהילה</p>
              <Button onClick={() => navigate('/')}>
                <Plus className="w-4 h-4 ml-2" />
                צור פוסט ראשון
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="info" className="mt-0 space-y-6" dir="rtl">
          <div className="bg-card border-b border-border p-6">
            <p className="text-sm text-muted-foreground text-center">אין מידע נוסף</p>
          </div>
        </TabsContent>

        <TabsContent value="trusters" className="mt-0" dir="rtl">
          <div className="bg-card border-b border-border p-6">
            <p className="text-sm text-muted-foreground text-center">
              {user.trustersCount === 0 ? 'עדיין אין אנשים שנתנו לך אמון' : 'טוען...'}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="trusted" className="mt-0" dir="rtl">
          <div className="bg-card border-b border-border p-6">
            <p className="text-sm text-muted-foreground text-center">עדיין לא נתת אמון לאף אחד</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Fullscreen Video Player - TODO: Implement with proper props */}

      <Navigation />
    </div>
  );
};

export default ProfilePage;
