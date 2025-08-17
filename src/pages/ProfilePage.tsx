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
import { ProfilePostsGrid } from "@/components/ProfilePostsGrid";
import { ProfileBioSection } from "@/components/ProfileBioSection";
import { ProfileTrustersTab } from "@/components/ProfileTrustersTab";
import { ProfileTrustedTab } from "@/components/ProfileTrustedTab";
import { cn } from "@/lib/utils";
import sarahProfile from "@/assets/sarah-profile.jpg";
import davidProfile from "@/assets/david-profile.jpg";
import mayaProfile from "@/assets/maya-profile.jpg";
import noaProfile from "@/assets/noa-profile.jpg";

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
      caption: "הטכנולוגיה הפיננסית המתקדמת של ישראל מציבה אותנו כמובילים בעולם...",
      trustCount: 189,
      watchCount: 234,
      commentCount: 67,
      shareCount: 34,
      timestamp: "לפני יום"
    },
    {
      id: "post3",
      caption: "חינוך דיגיטלי - איך אנחנו מכינים את הדור הבא למציאות חדשה?",
      trustCount: 156,
      watchCount: 198,
      commentCount: 42,
      shareCount: 28,
      timestamp: "לפני 3 ימים"
    }
  ],
  bioData: {
    professionalBackground: "בעלת 15 שנות ניסיון במגזר הציבורי והטכנולוגי. עבדתי כיועצת מדיניות במשרד האוצר וכמובילה טכנולוגית בסטארט-אפים מובילים.",
    education: "תואר ראשון במדעי המדינה, אוניברסיטת תל אביב. תואר שני במדיניות ציבורית, הרווארד קנדי סקול.",
    experience: "מנהלת מוצר בפייסבוק ישראל (2018-2021), יועצת מדיניות דיגיטלית במשרד האוצר (2015-2018), מובילה טכנולוגית ב-Waze (2012-2015).",
    achievements: "זוכת פרס 'נשים מובילות בטכנולוגיה' 2020, מרצה מוזמנת בכנסים בינלאומיים, מחברת ספר 'דמוקרטיה דיגיטלית' (2019).",
    expertise: ["מדיניות ציבורית", "טכנולוגיה פיננסית", "דמוקרטיה דיגיטלית", "חדשנות ממשלתית", "אתיקה טכנולוגית"],
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/sarah-politics" },
      { platform: "Twitter", url: "https://twitter.com/sarah_politics" },
      { platform: "Medium", url: "https://medium.com/@sarah_politics" }
    ],
    communityInvolvement: "מייסדת ויו\"ר ארגון 'טכנולוגיה לשינוי חברתי', מתנדבת בתוכנית 'קוד לקהילה', חברת מועצת מנהלים ב-3 עמותות טכנולוגיות.",
    publicInfluence: "מרצה מוזמנת בכנסי TED ו-DLD, כותבת קבועה בעיתון הארץ, מובילת דעת קהל ברשתות החברתיות עם 50K עוקבים."
  },
  trusters: [
    {
      id: "user1",
      username: "דוד_טכנולוגיה",
      profileImage: davidProfile,
      kycLevel: 3,
      trustersCount: 1234,
      domain: "tech" as const,
      trustDate: "לפני יום",
      bio: "מפתח תוכנה בכיר, מומחה בבינה מלאכותית ולמידת מכונה"
    },
    {
      id: "user2", 
      username: "מאיה_כלכלה",
      profileImage: mayaProfile,
      kycLevel: 2,
      trustersCount: 892,
      domain: "economy" as const,
      trustDate: "לפני 3 ימים",
      bio: "כלכלנית ראשית בבנק הפועלים, מומחית בשווקים פיננסיים"
    },
    {
      id: "user3",
      username: "נועה_חינוך",
      profileImage: noaProfile,
      kycLevel: 2,
      trustersCount: 567,
      domain: "education" as const,
      trustDate: "לפני שבוע",
      bio: "מנהלת מערכת חינוך דיגיטלי, חלוצה בחדשנות פדגוגית"
    }
  ],
  trustedUsers: [
    {
      id: "user4",
      username: "אמית_ביטחון",
      profileImage: "/src/assets/amit-profile.jpg",
      kycLevel: 3,
      trustersCount: 2156,
      domain: "security" as const,
      trustDate: "לפני 2 ימים",
      bio: "אנליסט ביטחון סייבר, יועץ לממשלה בנושאי אבטחת מידע"
    },
    {
      id: "user5",
      username: "רחל_מדיניות",
      profileImage: "/src/assets/rachel-profile.jpg",
      kycLevel: 2,
      trustersCount: 1543,
      domain: "politics" as const,
      trustDate: "לפני 4 ימים",
      bio: "חוקרת מדיניות ציבורית, מובילה דעת קהל בנושאי משטר וחברה"
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-0 pb-20">
        <TabsList className="w-full h-auto bg-transparent p-0 border-b border-border">
          <div className="grid w-full grid-cols-4 gap-0" dir="rtl">
            <TabsTrigger 
              value="trusted"
              className="flex-1 px-2 py-4 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary bg-transparent rounded-none relative after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-border last:after:hidden"
            >
              נתתי אמון
            </TabsTrigger>
            <TabsTrigger 
              value="trusters"
              className="flex-1 px-2 py-4 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary bg-transparent rounded-none relative after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-border last:after:hidden"
            >
              נותני אמון ({user.trustersCount})
            </TabsTrigger>
            <TabsTrigger 
              value="bio"
              className="flex-1 px-2 py-4 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary bg-transparent rounded-none relative after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-border last:after:hidden"
            >
              מידע
            </TabsTrigger>
            <TabsTrigger 
              value="posts" 
              className="flex-1 px-2 py-4 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary bg-transparent rounded-none"
            >
              פוסטים ({user.postsCount})
            </TabsTrigger>
          </div>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6" dir="rtl">
          <ProfilePostsGrid posts={user.posts} />
        </TabsContent>
        
        <TabsContent value="bio" className="mt-6" dir="rtl">
          <ProfileBioSection 
            bioData={user.bioData}
            isOwnProfile={true}
            onUpdate={(field, value) => {
              setUser(prev => ({
                ...prev,
                bioData: {
                  ...prev.bioData,
                  [field]: value
                }
              }));
            }}
          />
        </TabsContent>
        
        <TabsContent value="trusters" className="mt-6" dir="rtl">
          <ProfileTrustersTab trusters={user.trusters} />
        </TabsContent>
        
        <TabsContent value="trusted" className="mt-6" dir="rtl">
          <ProfileTrustedTab trustedUsers={user.trustedUsers} />
        </TabsContent>
      </Tabs>

      <Navigation zoozBalance={zoozBalance} />
    </div>
  );
};

export default ProfilePage;