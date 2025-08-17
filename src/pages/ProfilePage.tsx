import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Eye, MessageCircle, Share, MapPin, Calendar, UserCheck, Camera, Vote, TrendingUp, Shield, GraduationCap, Handshake, Crown } from "lucide-react";
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
import { cn } from "@/lib/utils";
import sarahProfile from "@/assets/sarah-profile.jpg";

// Mock current user data - in real app this would come from auth
const mockCurrentUser = {
  id: "current",
  username: "שרה_פוליטיקה", 
  handle: "sarahp",
  profileImage: sarahProfile,
  bio: "מומחית למדיניות ציבורית ודמוקרטיה דיגיטלית. פועלת למען שקיפות ואמון ברשתות חברתיות.",
  location: "תל אביב, ישראל",
  joinDate: "מאי 2023",
  kycLevel: 2,
  isVerified: true,
  trustersCount: 847,
  watchersCount: 423,
  postsCount: 89,
  zoozEarned: 12750,
  expertise: [
    { domain: 'economy', name: 'כלכלה', trustCount: 234, icon: TrendingUp },
    { domain: 'security', name: 'ביטחון', trustCount: 167, icon: Shield },
    { domain: 'education', name: 'חינוך', trustCount: 89, icon: GraduationCap }
  ],
  posts: [
    {
      id: "post1",
      caption: "העתיד של הדמוקרטיה תלוי ברשתות אמון. הנה למה אנחנו צריכים לחשוב מחדש על איך אנחנו בוחרים את הנציגים שלנו...",
      trustCount: 234,
      watchCount: 167,
      commentCount: 45,
      shareCount: 23,
      timestamp: "לפני 2 שעות"
    },
    {
      id: "post2",
      caption: "מה שלמדתי מהבחירות האחרונות על השפעת הרשתות החברתיות על דעת הקהל",
      trustCount: 187,
      watchCount: 423,
      commentCount: 32,
      shareCount: 18,
      timestamp: "לפני יום"
    },
    {
      id: "post3",
      caption: "איך אפשר לזהות מידע מוטעה ברשתות החברתיות? מדריך מעשי",
      trustCount: 312,
      watchCount: 501,
      commentCount: 67,
      shareCount: 41,
      timestamp: "לפני 3 ימים"
    },
    {
      id: "post4",
      caption: "שקיפות בממשל - מה אפשר לעשות כאזרחים?",
      trustCount: 156,
      watchCount: 289,
      commentCount: 28,
      shareCount: 15,
      timestamp: "לפני שבוע"
    },
    {
      id: "post5",
      caption: "הצעת חוק חדשה שיכולה לשנות את עתיד הדמוקרטיה הדיגיטלית",
      trustCount: 401,
      watchCount: 672,
      commentCount: 89,
      shareCount: 53,
      timestamp: "לפני שבועיים"
    },
    {
      id: "post6",
      caption: "למה חשוב שהאלגוריתמים יהיו שקופים יותר?",
      trustCount: 223,
      watchCount: 334,
      commentCount: 41,
      shareCount: 27,
      timestamp: "לפני שלושה שבועות"
    }
  ]
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(mockCurrentUser);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const zoozBalance = 1250;

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
            <div className="flex items-center gap-2">
              <div>
                <EditableField
                  value={user.username}
                  onSave={(value) => handleUpdateField('username', value)}
                  className="text-xl font-bold"
                />
                <p className="text-sm text-muted-foreground">@{user.handle}</p>
              </div>
              <TrustBadge trustCount={user.trustersCount} />
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

        {/* Simplified Stats */}
        <div className="flex justify-around py-4 border-y border-border">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center cursor-pointer">
                  <TrustIcon />
                  <div className="text-2xl font-bold text-trust mt-1">{user.trustersCount}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>מספר האנשים שהביעו אמון</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ZoozEarnedDisplay zoozEarned={user.zoozEarned} showAnimation />
        </div>

      </div>

      {/* KYC Management Section */}
      <div className="px-6 pb-4">
        <KYCManagement className="bg-card/50 rounded-lg p-3" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6 pb-20">
        <TabsList className="grid w-full grid-cols-4" dir="rtl">
          <TabsTrigger value="posts">פוסטים</TabsTrigger>
          <TabsTrigger value="info">מידע</TabsTrigger>
          <TabsTrigger value="trusters">אמון</TabsTrigger>
          <TabsTrigger value="trusted">נתתי אמון</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-4 mt-6" dir="rtl">
          <VideoGrid 
            posts={user.posts.map(post => ({
              id: post.id,
              thumbnail: `/api/placeholder/300/400`, // Placeholder pour les thumbnails
              caption: post.caption,
              trustCount: post.trustCount,
              watchCount: post.watchCount,
              commentCount: post.commentCount,
              shareCount: post.shareCount,
              duration: "0:15", // Durée par défaut
            }))}
            onVideoClick={(postId, index) => {
              // Ouvrir le fullscreen player
              setSelectedPostIndex(index);
              setIsFullscreenOpen(true);
            }}
            className="px-0 -mx-6" // Full width
          />
        </TabsContent>
        
        <TabsContent value="info" className="mt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">מידע אישי ופרטי הפרופיל</p>
          </div>
        </TabsContent>
        
        <TabsContent value="trusters" className="mt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">אנשים שנותנים לי אמון</p>
          </div>
        </TabsContent>
        
        <TabsContent value="trusted" className="mt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">אנשים שאני נותן להם אמון</p>
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