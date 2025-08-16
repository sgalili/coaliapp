import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Eye, MessageCircle, Share, MapPin, Calendar, Camera, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { TrustBadge } from "@/components/TrustBadge";
import { ZoozEarnedDisplay } from "@/components/ZoozEarnedDisplay";
import { EditableField } from "@/components/EditableField";
import { ProfileMenu } from "@/components/ProfileMenu";
import { KYCManagement } from "@/components/KYCManagement";
import { TrustStatusIndicator } from "@/components/TrustStatusIndicator";
import { getDomainConfig } from "@/lib/domainConfig";
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
    { domain: 'economy', trustCount: 234 },
    { domain: 'security', trustCount: 167 },
    { domain: 'education', trustCount: 89 }
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
    }
  ]
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(mockCurrentUser);
  const [activeTab, setActiveTab] = useState("posts");
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

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header - TikTok Style */}
      <div className="flex items-center justify-between p-4">
        <div className="text-sm text-muted-foreground">@{user.handle}</div>
        <button className="p-2 hover:bg-accent rounded-full transition-colors">
          <Share className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="p-6 space-y-4">
        {/* Profile Photo with Watchers Count */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <img 
              src={user.profileImage} 
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
            />
            <TrustStatusIndicator kycLevel={user.kycLevel} />
            <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90 transition-colors">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>{user.watchersCount.toLocaleString()} צופים</span>
          </div>
        </div>

        {/* User Name - Bigger and Editable */}
        <div className="text-center mb-4">
          <EditableField
            value={user.username}
            onSave={(value) => handleUpdateField('username', value)}
            className="text-2xl font-bold mb-2"
          />
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

        {/* Expertise Badges - Exactly like DomainFilter */}
        <div className="flex gap-2 flex-wrap justify-center mb-4">
          {user.expertise.map((expertiseItem) => {
            const domainConfig = getDomainConfig(expertiseItem.domain as any);
            const IconComponent = domainConfig.icon;
            return (
              <Badge 
                key={expertiseItem.domain}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1.5"
              >
                <IconComponent className="w-3 h-3" />
                <span className="text-xs font-medium">{domainConfig.hebrewName} ({expertiseItem.trustCount})</span>
              </Badge>
            );
          })}
        </div>

        {/* Simplified Stats - Trust and ZOOZ Only */}
        <div className="flex justify-around py-6 border-y border-border">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{user.trustersCount}</div>
            <div className="text-sm text-muted-foreground">אמון כולל</div>
          </div>
          <div className="text-center">
            <ZoozEarnedDisplay zoozEarned={user.zoozEarned} />
          </div>
        </div>

        {/* Simplified Action Button */}
        <div className="flex justify-center py-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Vote className="w-4 h-4" />
            הצבעה
          </Button>
        </div>
      </div>

      {/* Compact KYC Section */}
      <div className="px-6 pb-2">
        <KYCManagement />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6 pb-20">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">פוסטים ({user.postsCount})</TabsTrigger>
          <TabsTrigger value="trusted">נותן אמון</TabsTrigger>
          <TabsTrigger value="trusters">מקבל אמון ({user.trustersCount})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-4 mt-6">
          {user.posts.map((post: any) => (
            <div key={post.id} className="bg-card rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{post.timestamp}</span>
              </div>
              <p className="text-sm text-right">{post.caption}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-trust" />
                    {post.trustCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-watch" />
                    {post.watchCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.commentCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <Share className="w-4 h-4" />
                    {post.shareCount}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="trusted" className="mt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">אנשים שאני נותן להם אמון</p>
          </div>
        </TabsContent>
        
        <TabsContent value="trusters" className="mt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">אנשים שנותנים לי אמון</p>
          </div>
        </TabsContent>
      </Tabs>

      <Navigation zoozBalance={zoozBalance} />
    </div>
  );
};

export default ProfilePage;