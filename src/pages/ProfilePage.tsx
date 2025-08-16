import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Eye, MessageCircle, Share, MapPin, Calendar, UserCheck, Camera, Vote, TrendingUp, Shield, GraduationCap } from "lucide-react";
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
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="font-bold text-lg">{user.username}</h1>
            <p className="text-sm text-muted-foreground">@{user.handle}</p>
          </div>
          <ProfileMenu />
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
              <EditableField
                value={user.username}
                onSave={(value) => handleUpdateField('username', value)}
                className="text-xl font-bold"
              />
              {user.isVerified && <UserCheck className="w-5 h-5 text-blue-500" />}
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
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                נרשם {user.joinDate}
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
        <div className="flex gap-2 flex-wrap">
          {user.expertise.map((domain) => {
            const IconComponent = domain.icon;
            return (
              <Badge 
                key={domain.domain}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1.5"
              >
                <IconComponent className="w-3 h-3" />
                <span className="text-xs font-medium">{domain.name} ({domain.trustCount})</span>
              </Badge>
            );
          })}
        </div>

        {/* Enhanced Stats with ZOOZ Priority */}
        <div className="flex justify-around py-4 border-y border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-trust">{user.trustersCount}</div>
            <div className="text-sm text-muted-foreground">אמון</div>
          </div>
          <ZoozEarnedDisplay zoozEarned={user.zoozEarned} showAnimation />
          <div className="text-center">
            <div className="text-lg font-semibold">{user.postsCount}</div>
            <div className="text-sm text-muted-foreground">פוסטים</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-watch">{user.watchersCount}</div>
            <div className="text-sm text-muted-foreground">צופים</div>
          </div>
        </div>

        {/* Action Buttons with Vote Button */}
        <div className="flex gap-3">
          {canVote && (
            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              <Vote className="w-4 h-4 ml-2" />
              הצבעה
            </Button>
          )}
          <Button variant="outline" className="flex-1">
            <Eye className="w-4 h-4 ml-2" />
            עריכת פרופיל
          </Button>
          <Button variant="outline" size="icon">
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* KYC Management Section */}
      <div className="px-6 pb-6">
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