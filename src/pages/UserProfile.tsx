import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Eye, MessageCircle, Share, Settings, UserCheck, MapPin, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Import profile images
import sarahProfile from "@/assets/sarah-profile.jpg";

// Mock user data - in real app this would come from API
const mockUserData = {
  "1": {
    id: "1",
    username: "שרה_פוליטיקה",
    handle: "sarahp",
    profileImage: sarahProfile,
    bio: "מומחית למדיניות ציבורית ודמוקרטיה דיגיטלית. פועלת למען שקיפות ואמון ברשתות חברתיות.",
    location: "תל אביב, ישראל",
    joinDate: "מאי 2023",
    kycLevel: 3,
    isVerified: true,
    trustersCount: 1247,
    watchersCount: 856,
    postsCount: 89,
    expertise: ["מדיניות ציבורית", "דמוקרטיה דיגיטלית", "רשתות אמון"],
    posts: [
      {
        id: "post1",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        caption: "העתיד של הדמוקרטיה תלוי ברשתות אמון. הנה למה אנחנו צריכים לחשוב מחדש על איך אנחנו בוחרים את הנציגים שלנו...",
        trustCount: 234,
        watchCount: 167,
        commentCount: 45,
        shareCount: 23,
        timestamp: "לפני 2 שעות"
      }
    ]
  }
};

const KYCBadge = ({ level }: { level: 1 | 2 | 3 }) => {
  const variants = {
    1: "bg-amber-500 text-amber-50",
    2: "bg-blue-500 text-blue-50", 
    3: "bg-emerald-500 text-emerald-50"
  };
  
  const labels = {
    1: "אימות בסיסי",
    2: "אימות קהילתי", 
    3: "אימות מלא"
  };
  
  return (
    <Badge className={cn("border-0", variants[level])}>
      <Shield className="w-3 h-3 ml-1" />
      {labels[level]}
    </Badge>
  );
};

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    // Set RTL direction
    document.documentElement.setAttribute('dir', 'rtl');
    
    // Mock data fetch
    if (userId && mockUserData[userId as keyof typeof mockUserData]) {
      setUser(mockUserData[userId as keyof typeof mockUserData]);
    }
  }, [userId]);

  if (!user) {
    return (
      <div className="h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">משתמש לא נמצא</h2>
          <Button onClick={() => navigate(-1)} variant="outline">
            חזרה
          </Button>
        </div>
      </div>
    );
  }

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
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-6 space-y-4">
        {/* Avatar and Basic Info */}
        <div className="flex items-start gap-4">
          <img 
            src={user.profileImage} 
            alt={user.username}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{user.username}</h2>
              {user.isVerified && <UserCheck className="w-5 h-5 text-blue-500" />}
            </div>
            <KYCBadge level={user.kycLevel} />
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                נרשם {user.joinDate}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm leading-relaxed text-right">{user.bio}</p>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-2">
          {user.expertise.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-around py-4 border-y border-border">
          <div className="text-center">
            <div className="text-2xl font-bold">{user.postsCount}</div>
            <div className="text-sm text-muted-foreground">פוסטים</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-trust">{user.trustersCount}</div>
            <div className="text-sm text-muted-foreground">אמון</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-watch">{user.watchersCount}</div>
            <div className="text-sm text-muted-foreground">צופים</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-trust hover:bg-trust/90">
            <Heart className="w-4 h-4 ml-2" />
            תן אמון
          </Button>
          <Button variant="outline" className="flex-1">
            <Eye className="w-4 h-4 ml-2" />
            צפה
          </Button>
          <Button variant="outline" size="icon">
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">פוסטים</TabsTrigger>
          <TabsTrigger value="trusted">נותן אמון</TabsTrigger>
          <TabsTrigger value="trusters">מקבל אמון</TabsTrigger>
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
            <p className="text-muted-foreground">אנשים שהמשתמש נותן להם אמון</p>
          </div>
        </TabsContent>
        
        <TabsContent value="trusters" className="mt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">אנשים שנותנים אמון למשתמש</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;