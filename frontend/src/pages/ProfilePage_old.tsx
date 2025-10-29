import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Eye, MessageCircle, Share, MapPin, Calendar, UserCheck, Camera, Vote, TrendingUp, Shield, GraduationCap, Handshake, Crown, Globe, Twitter, Facebook, Youtube, Linkedin, ExternalLink } from "lucide-react";
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
import { FullscreenVideoPlayer } from "@/components/FullscreenVideoPlayer";
import { useAuth } from "@/hooks/useAuth";
import { useUserStats } from "@/hooks/useUserStats";
import { useWalletData } from "@/hooks/useWalletData";
import { usePosts } from "@/hooks/usePosts";
import { useTrust } from "@/hooks/useTrust";
import { cn } from "@/lib/utils";
import sarahProfile from "@/assets/sarah-profile.jpg";
import amitProfile from "@/assets/amit-profile.jpg";
import mayaProfile from "@/assets/maya-profile.jpg";
import davidProfile from "@/assets/david-profile.jpg";
import rachelProfile from "@/assets/rachel-profile.jpg";

// Default user data structure
const getDefaultUser = (profile: any) => ({
  id: profile?.user_id || "current",
  username: `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "משתמש חדש", 
  handle: "user",
  profileImage: profile?.avatar_url || sarahProfile,
  bio: "הוסף תיאור אישי...",
  location: "הוסף מיקום...",
  joinDate: "מאי 2023",
  website: "",
  twitter: "",
  facebook: "",
  youtube: "",
  scholar: "",
  kycLevel: 1,
  isVerified: false,
  trustersCount: 0,
  watchersCount: 0,
  postsCount: 0,
  zoozEarned: 0,
  professionalExperience: "הוסף ניסיון מקצועי...",
  education: "הוסף פרטי השכלה...",
  communityService: "הוסף פעילות ציבורית וקהילתית...",
  publications: "הוסף פרסומים והשפעה...",
  awards: "הוסף הכרה וביקורת עמיתים...",
  skills: "הוסף כישורים ושפות...",
  expertise: [],
  posts: []
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user: authUser, profile } = useAuth();
  const { stats } = useUserStats();
  const { zoozBalance } = useWalletData();
  const { posts } = usePosts();
  const { trusters, trusted, loading: trustLoading } = useTrust();
  
  const [user, setUser] = useState(getDefaultUser(null));
  const [activeTab, setActiveTab] = useState("posts");
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);

  // Update user data when auth user or stats change
  useEffect(() => {
    if (authUser || stats || profile) {
      setUser(prev => ({
        ...prev,
        id: authUser?.id || "current",
        username: `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "משתמש חדש",
        profileImage: profile?.avatar_url || prev.profileImage,
        trustersCount: stats?.trust_received || 0,
        postsCount: stats?.posts_count || 0,
        watchersCount: stats?.watch_count || 0,
        zoozEarned: zoozBalance,
      }));
    }
  }, [authUser, stats, zoozBalance, profile]);

  useEffect(() => {
    // Set RTL direction
    document.documentElement.setAttribute('dir', 'rtl');
  }, []);

  const handleUpdateField = (field: keyof typeof user, value: any) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canVote = user.trustersCount >= 1000; // Level 5 requirement

  const TrustIcon = () => (
    <div className="relative flex justify-center mb-1">
      <div className="relative">
        <Handshake className="w-6 h-6 text-trust" />
        <Crown className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />
      </div>
    </div>
  );

  const ZoozIcon = () => (
    <div className="w-6 h-6 bg-zooz text-white rounded-full flex items-center justify-center font-bold text-sm">
      Z
    </div>
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-end p-4">
          <div className="flex items-center gap-2">
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
            <img 
              src={user.profileImage} 
              alt={user.username}
              className="w-20 h-20 rounded-full object-cover"
            />
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
                  <EditableField
                    value={user.username}
                    onSave={(value) => handleUpdateField('username', value)}
                    className="text-xl font-bold"
                  />
                  <TrustBadge trustCount={user.trustersCount} />
                </div>
                <p className="text-sm text-muted-foreground">@{user.handle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <EditableField
                  value={user.location}
                  onSave={(value) => handleUpdateField('location', value)}
                  placeholder="הוסף מיקום"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <EditableField
          value={user.bio}
          onSave={(value) => handleUpdateField('bio', value)}
          type="textarea"
          placeholder="כתוב על עצמך..."
          className="text-sm leading-relaxed text-right"
          maxLength={280}
        />

        {/* Expertise Badges */}
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

        {/* Stats - RTL Order: Watch, Trust, ZOOZ with balanced text color */}
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

      {/* Tabs - Full width */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="pb-20">
        <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-border" dir="rtl">
          <TabsTrigger value="posts">פוסטים</TabsTrigger>
          <TabsTrigger value="info">מידע</TabsTrigger>
          <TabsTrigger value="trusters">אמון</TabsTrigger>
          <TabsTrigger value="trusted">נתתי אמון</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-0" dir="rtl">
          <VideoGrid 
            posts={posts.length > 0 ? posts.map(post => ({
              id: post.id,
              thumbnail: post.thumbnail_url || `/api/placeholder/300/400`,
              caption: post.content || '',
              trustCount: post.trust_count,
              watchCount: post.watch_count,
              commentCount: post.comment_count,
              shareCount: post.share_count,
              duration: "0:15",
            })) : []}
            onVideoClick={(postId, index) => {
              setSelectedPostIndex(index);
              setIsFullscreenOpen(true);
            }}
          />
        </TabsContent>
        
        <TabsContent value="info" className="mt-0 space-y-6" dir="rtl">
          <div className="bg-card border-b border-border">
            {/* Professional Experience */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                ניסיון מקצועי
              </h3>
              <EditableField
                value={profile?.professional_experience || "הוסף ניסיון מקצועי..."}
                onSave={(value) => handleUpdateField('professionalExperience', value)}
                type="textarea"
                placeholder="תאר את הניסיון המקצועי שלך..."
                className="text-sm leading-relaxed"
                maxLength={500}
              />
            </div>
          </div>

          <div className="bg-card border-b border-border">
            {/* Education */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                השכלה
              </h3>
              <EditableField
                value={profile?.education || "הוסף פרטי השכלה..."}
                onSave={(value) => handleUpdateField('education', value)}
                type="textarea"
                placeholder="פרט על ההשכלה שלך..."
                className="text-sm leading-relaxed"
                maxLength={400}
              />
            </div>
          </div>

          <div className="bg-card border-b border-border">
            {/* Community & Public Service */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                פעילות ציבורית וקהילתית
              </h3>
              <EditableField
                value={profile?.community_service || "הוסף פעילות ציבורית וקהילתית..."}
                onSave={(value) => handleUpdateField('communityService', value)}
                type="textarea"
                placeholder="תאר את הפעילות הציבורית והקהילתית שלך..."
                className="text-sm leading-relaxed"
                maxLength={400}
              />
            </div>
          </div>

          <div className="bg-card border-b border-border">
            {/* Publications & Media */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                פרסומים והשפעה
              </h3>
              <EditableField
                value={profile?.publications || "הוסף פרסומים והשפעה..."}
                onSave={(value) => handleUpdateField('publications', value)}
                type="textarea"
                placeholder="פרט על פרסומים, הרצאות והשפעתך..."
                className="text-sm leading-relaxed"
                maxLength={400}
              />
            </div>
          </div>

          <div className="bg-card border-b border-border">
            {/* Awards & Recognition */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Crown className="w-5 h-5" />
                הכרה וביקורת עמיתים
              </h3>
              <EditableField
                value={profile?.awards || "הוסף פרסים, הכרה והישגים..."}
                onSave={(value) => handleUpdateField('awards', value)}
                type="textarea"
                placeholder="פרט על פרסים, הכרה והישגים..."
                className="text-sm leading-relaxed"
                maxLength={300}
              />
            </div>
          </div>

          <div className="bg-card border-b border-border">
            {/* Languages & Skills */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                כישורים ושפות
              </h3>
              <EditableField
                value={profile?.skills || "הוסף כישורים ושפות..."}
                onSave={(value) => handleUpdateField('skills', value)}
                type="textarea"
                placeholder="פרט על שפות, כישורים טכניים ומקצועיים..."
                className="text-sm leading-relaxed"
                maxLength={300}
              />
            </div>
          </div>

          <div className="bg-card">
            {/* Contact & Verification */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                פרטי קשר ואימות
              </h3>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">דוא״ל מאומת</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <UserCheck className="w-4 h-4" />
                    {authUser?.email || "לא הוגדר"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">טלפון</span>
                  <span className="text-muted-foreground">
                    {authUser?.phone || profile?.phone || "לא הוגדר"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">רמת KYC</span>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>רמה {user.kycLevel} - {user.kycLevel > 0 ? 'מאומת' : 'לא מאומת'}</span>
                  </div>
                </div>
              </div>
              
              {/* Social Links & Websites */}
              <div className="pt-4 border-t border-border">
                <h4 className="text-md font-medium mb-3 flex items-center gap-2">
                  <Share className="w-4 h-4" />
                  קישורים ורשתות חברתיות
                </h4>
                <div className="space-y-3">
                  {/* Website */}
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <EditableField
                      value={user.website}
                      onSave={(value) => handleUpdateField('website', value)}
                      placeholder="אתר אינטרנט אישי..."
                      className="text-sm flex-1"
                    />
                  </div>
                  
                  {/* Social Media Icons */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">רשתות חברתיות:</span>
                    <div className="flex gap-3">
                      {user.twitter && (
                        <button
                          onClick={() => window.open(user.twitter, '_blank')}
                          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                          title="Twitter/X"
                        >
                          <Twitter className="w-4 h-4 text-white" />
                        </button>
                      )}
                      {user.facebook && (
                        <button
                          onClick={() => window.open(user.facebook, '_blank')}
                          className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors"
                          title="Facebook"
                        >
                          <Facebook className="w-4 h-4 text-white" />
                        </button>
                      )}
                      {user.youtube && (
                        <button
                          onClick={() => window.open(user.youtube, '_blank')}
                          className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                          title="YouTube"
                        >
                          <Youtube className="w-4 h-4 text-white" />
                        </button>
                      )}
                      <button
                        onClick={() => window.open('https://linkedin.com/in/sarahpolitics', '_blank')}
                        className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Google Scholar */}
                  {user.scholar && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-muted-foreground" />
                      <button
                        onClick={() => window.open(user.scholar, '_blank')}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        Google Scholar
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trusters" className="mt-0" dir="rtl">
          {/* Small discrete title with filter */}
          <div className="px-6 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">אנשים שנותנים לי אמון</h3>
              <select className="text-xs bg-transparent border border-border rounded px-2 py-1 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="all">כל התחומים</option>
                <option value="economy">כלכלה</option>
                <option value="security">ביטחון</option>
                <option value="education">חינוך</option>
                <option value="health">בריאות</option>
                <option value="technology">טכנולוגיה</option>
              </select>
            </div>
          </div>
          
          {/* List of people who gave trust */}
          <div className="space-y-0">
            {trustLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-sm text-muted-foreground">טוען...</div>
              </div>
            ) : trusters.length > 0 ? (
              trusters.map((truster) => (
              <div key={truster.id}>
                <div 
                  className="flex items-start gap-3 p-4 hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/profile/${truster.id}`)}
                >
                  {/* Profile Avatar with KYC */}
                  <div className="relative shrink-0">
                    <img 
                      src={truster.avatar || sarahProfile} 
                      alt={truster.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <TrustStatusIndicator kycLevel={truster.kycLevel} />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground truncate">{truster.name}</h4>
                      <TrustBadge trustCount={truster.trustCount} className="shrink-0" />
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1">@{truster.username}</p>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {truster.bio}
                    </p>
                    
                    {/* Trust stats and date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="relative">
                          <Handshake className="w-3 h-3 text-trust" />
                          <Crown className="w-1 h-1 text-yellow-400 absolute -top-0.5 -right-0.5" />
                        </div>
                        <span className="text-xs font-medium text-trust">
                          {truster.trustCount.toLocaleString()}
                        </span>
                      </div>
                      
                      <span className="text-xs text-muted-foreground">
                        {truster.trustDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-border mx-4" />
              </div>
            ))) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <p className="text-sm">עדיין אין אנשים שנתנו אמון</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="trusted" className="mt-0" dir="rtl">
          {/* Small discrete title with filter */}
          <div className="px-6 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">אנשים שאני נותן להם אמון</h3>
              <select className="text-xs bg-transparent border border-border rounded px-2 py-1 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="all">כל התחומים</option>
                <option value="economy">כלכלה</option>
                <option value="security">ביטחון</option>
                <option value="education">חינוך</option>
                <option value="health">בריאות</option>
                <option value="technology">טכנולוגיה</option>
              </select>
            </div>
          </div>
          
          {/* List of people I gave trust to */}
          <div className="space-y-0">
            {trustLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-sm text-muted-foreground">טוען...</div>
              </div>
            ) : trusted.length > 0 ? (
              trusted.map((trustedUser) => (
              <div key={trustedUser.id}>
                <div 
                  className="flex items-start gap-3 p-4 hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/profile/${trustedUser.id}`)}
                >
                  {/* Profile Avatar with KYC */}
                  <div className="relative shrink-0">
                    <img 
                      src={trustedUser.avatar || sarahProfile} 
                      alt={trustedUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <TrustStatusIndicator kycLevel={trustedUser.kycLevel} />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground truncate">{trustedUser.name}</h4>
                      <TrustBadge trustCount={trustedUser.trustCount} className="shrink-0" />
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1">@{trustedUser.username}</p>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {trustedUser.bio || "אין תיאור"}
                    </p>
                    
                    {/* Trust stats and date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="relative">
                          <Handshake className="w-3 h-3 text-trust" />
                          <Crown className="w-1 h-1 text-yellow-400 absolute -top-0.5 -right-0.5" />
                        </div>
                        <span className="text-xs font-medium text-trust">
                          {trustedUser.trustCount.toLocaleString()}
                        </span>
                      </div>
                      
                      <span className="text-xs text-muted-foreground">
                        {trustedUser.trustDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-border mx-4" />
              </div>
            ))) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <p className="text-sm">עדיין לא נתת אמון לאף אחד</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Fullscreen Video Player */}
      {isFullscreenOpen && (
        <FullscreenVideoPlayer
          comments={user.posts.map(post => ({
            id: post.id,
            userId: user.id,
            username: user.username,
            userImage: user.profileImage,
            videoUrl: `/api/placeholder/video/${post.id}`, // Placeholder pour les vidéos
            duration: 15,
            likes: post.trustCount,
            replies: post.commentCount,
            trustLevel: post.trustCount,
            timestamp: post.timestamp,
            category: "פוליטיקה",
            kycLevel: user.kycLevel as 1 | 2 | 3,
            watchCount: post.watchCount,
            shareCount: post.shareCount,
          }))}
          initialCommentIndex={selectedPostIndex}
          onClose={() => setIsFullscreenOpen(false)}
          onTrust={(postId) => console.log('Trust post:', postId)}
          onWatch={(postId) => console.log('Watch post:', postId)}
          onComment={(postId) => console.log('Comment on post:', postId)}
          onShare={(postId) => console.log('Share post:', postId)}
        />
      )}

      <Navigation zoozBalance={zoozBalance} />
    </div>
  );
};

export default ProfilePage;