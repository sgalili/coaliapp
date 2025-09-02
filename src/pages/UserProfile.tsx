import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Eye, Share, UserCheck, MapPin, Calendar, Shield, GraduationCap, Handshake, Crown, TrendingUp } from "lucide-react";
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

// Import profile images
import sarahProfile from "@/assets/sarah-profile.jpg";
import yaronProfile from "@/assets/yaron-profile.jpg";

// Mock user data - in real app this would come from API
const mockUserData = {
  "1": {
    id: "1",
    username: "שרה כהן",
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
    zoozEarned: 8430,
    professionalExperience: "מנהלת מחקר במכון למדיניות ציבורית (2020-2024) • יועצת לוועדת הכנסת לחינוך (2018-2020) • חוקרת בכירה במכון הישראלי לדמוקרטיה (2015-2018)",
    education: "דוקטורט במדעי המדינה, האוניברסיטה העברית (2015) • מוסמך במדיניות ציבורית, אוניברסיטת תל אביב (2010) • תואר ראשון בפילוסופיה ומדעי המדינה, האוניברסיטה הפתוחה (2008)",
    communityService: "מייסדת שותפה של 'דמוקרטיה דיגיטלית ישראל' • חברת מועצת המנהלים ב'שקיפות ישראל' • מתנדבת במרכז לזכויות אדם • מרצה אורחת באוניברסיטאות שונות",
    publications: "מחברת של 15 מאמרים מחקריים בכתבי עת מובילים • כותבת טור שבועי בהארץ • מרואיינת קבועה ברדיו וטלוויזיה בנושאי דמוקרטיה • הרצאות TEDx על עתיד הפוליטיקה",
    awards: "זוכת פרס רוטשילד למדעי החברה (2022) • נבחרת לרשימת 40 תחת 40 של גלובס (2021) • מקבלת מלגת פולברייט לחקר דמוקרטיה דיגיטלית בארה״ב",
    skills: "עברית (שפת אם) • אנגלית (ברמת דובר יליד) • ערבית (שיחה) • מומחיות בניתוח נתונים, מחקר איכותני, מדיניות ציבורית, ניהול פרויקטים",
    expertise: [
      { domain: 'politics', name: 'פוליטיקה', trustCount: 234 },
      { domain: 'education', name: 'חינוך', trustCount: 167 },
      { domain: 'tech', name: 'טכנולוgia', trustCount: 89 }
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
  },
  "2": {
    id: "2",
    username: "יאיר לפיד",
    handle: "yairlapid",
    profileImage: yaronProfile,
    bio: "מנהיג יש עתיד, לשעבר שר האוצר וראש הממשלה. פועל למען שינוי פוליטי וחברתי בישראל.",
    location: "תל אביב, ישראל",
    joinDate: "מרץ 2022",
    kycLevel: 3,
    isVerified: true,
    trustersCount: 2890,
    watchersCount: 4567,
    postsCount: 156,
    zoozEarned: 15420,
    professionalExperience: "ראש הממשלה (2022) • שר האוצר (2021-2022) • מנהיג יש עתיד (2012-עכשיו) • עיתונאי ומגיש (1995-2012)",
    education: "תואר ראשון בפילוסופיה ותולדות עם ישראל, אוניברסיטת תל אביב",
    communityService: "מייסד תנועת יש עתיד • פעילות למען זכויות אזרחיות • תמיכה בארגונים חברתיים",
    publications: "מחבר מספר ספרים • כותב עמודי דעה בעיתונות • מרואיין בתכניות חדשות",
    awards: "פרס הכתיבה העיתונאית (2010) • איש השנה בתחום התקשורת",
    skills: "עברית (שפת אם) • אנגלית (רמה גבוהה) • יכולות הנהגה, מדיניות כלכלית, תקשורת ציבורית",
    expertise: [
      { domain: 'politics', name: 'פוליטיקה', trustCount: 1890 },
      { domain: 'economy', name: 'כלכלה', trustCount: 1456 },
      { domain: 'diplomacy', name: 'דיפלומטיה', trustCount: 890 }
    ],
    posts: [
      {
        id: "post2_1",
        caption: "הזמן הגיע לשינוי אמיתי בישראל. נבנה מדינה של כבוד, צדק ושוויון הזדמנויות לכל אזרח.",
        trustCount: 1890,
        watchCount: 3456,
        commentCount: 234,
        shareCount: 156,
        timestamp: "לפני יום"
      }
    ]
  },
  "3": {
    id: "3",
    username: "רון חולדאי",
    handle: "ronhuldai",
    profileImage: sarahProfile,
    bio: "ראש עיריית תל אביב-יפו. עובד למען פיתוח עירוני בר קיימא ושיפור איכות החיים בעיר.",
    location: "תל אביב-יפו, ישראל",
    joinDate: "ינואר 2021",
    kycLevel: 3,
    isVerified: true,
    trustersCount: 1567,
    watchersCount: 2234,
    postsCount: 123,
    zoozEarned: 11250,
    professionalExperience: "ראש עיריית תל אביב-יפו (1998-עכשיו) • קצין טייס בחיל האוויר • מהנדס אווירונאוטיקה",
    education: "תואר ראשון בהנדסת אווירונאוטיקה, הטכניון • קורס הנהלת ערים, אוניברסיטת הרווארד",
    communityService: "הובלת פרויקטים עירוניים מתקדמים • פעילות למען איכות הסביבה • תמיכה בתרבות ואמנות",
    publications: "כתבות על פיתוח עירוני • ראיונות על ניהול עירייה • הרצאות בכנסים בינלאומיים",
    awards: "פרס ראש העיר הטוב בעולם (2019) • אות הוקרה על תרומה לפיתוח העיר",
    skills: "עברית (שפת אם) • אנגלית (רמה גבוהה) • ניהול עירוני, תכנון מרחבי, הנהגה ציבורית",
    expertise: [
      { domain: 'urban', name: 'ניהול עירוני', trustCount: 987 },
      { domain: 'transport', name: 'תחבורה', trustCount: 567 },
      { domain: 'culture', name: 'תרבות', trustCount: 456 }
    ],
    posts: [
      {
        id: "post3_1",
        caption: "תל אביב ממשיכה להיות עיר חדשנית ומתקדמת. הפרויקטים החדשים שלנו ישפרו את איכות החיים לכל התושבים.",
        trustCount: 987,
        watchCount: 1456,
        commentCount: 89,
        shareCount: 67,
        timestamp: "לפני 3 שעות"
      }
    ]
  },
  "4": {
    id: "4",
    username: "ירון זליכה",
    handle: "yaronzelikha", 
    profileImage: yaronProfile,
    bio: "כלכלן ראשי ומומחה למדיניות כלכלית. מנתח את השווקים הפיננסיים ומייעץ למשקיעים.",
    location: "תל אביב, ישראל",
    joinDate: "פברואר 2023",
    kycLevel: 3,
    isVerified: true,
    trustersCount: 2134,
    watchersCount: 3890,
    postsCount: 198,
    zoozEarned: 18650,
    professionalExperience: "כלכלן ראשי בבנק הפועלים (2018-עכשיו) • יועץ כלכלי בוועדת הכספים של הכנסת (2015-2018) • אנליסט בכיר בבנק ישראל (2010-2015)",
    education: "דוקטורט בכלכלה, אוניברסיטת חיפה (2010) • מוסמך בכלכלה ומימון, האוניברסיטה העברית (2005) • תואר ראשון במתמטיקה וכלכלה, אוניברסיטת תל אביב (2003)",
    communityService: "מייסד פורום הכלכלנים הצעירים • מרצה בקורסי העשרה כלכלית לציבור • יועץ בהתנדבות לעמותות חברתיות",
    publications: "מחבר של 25 מאמרים אקדמיים • כותב עמוד כלכלי שבועי בגלובס • מרואיין קבוע בתכניות כלכלה • ספר בנושא השקעות חכמות",
    awards: "זוכה פרס הכלכלן הצעיר של השנה (2020) • מקבל אות הוקרה מבנק ישראל • נבחר למומחה כלכלה מוביל",
    skills: "עברית (שפת אם) • אנגלית (ברמת דובר יליד) • צרפתית (שיחה) • מומחיות בניתוח פיננסי, מדיניות מוניטרית, חיזוי כלכלי",
    expertise: [
      { domain: 'economy', name: 'כלכלה', trustCount: 1456 },
      { domain: 'investments', name: 'השקעות', trustCount: 1234 },
      { domain: 'fiscal', name: 'מדיניות פיסקלית', trustCount: 987 }
    ],
    posts: [
      {
        id: "post4_1", 
        caption: "השווקים הפיננסיים עוברים תמורות משמעותיות. הנה התחזית שלי לרבעון הקרוב ואיך זה ישפיע על המשק הישראלי.",
        trustCount: 1456,
        watchCount: 2890,
        commentCount: 167,
        shareCount: 123,
        timestamp: "לפני 4 שעות"
      }
    ]
  }
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

  const TrustIcon = () => (
    <div className="relative flex justify-center mb-1">
      <div className="relative">
        <Handshake className="w-6 h-6 text-trust" />
        <Crown className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />
      </div>
    </div>
  );

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
          <div className="w-10" />
          <Button variant="ghost" size="icon">
            <Share className="w-4 h-4" />
          </Button>
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
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{user.username}</h2>
                  <TrustBadge trustCount={user.trustersCount} />
                </div>
                <p className="text-sm text-muted-foreground">@{user.handle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.location}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm leading-relaxed text-right">{user.bio}</p>

        {/* Expertise Badges */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {user.expertise.map((domain: any) => {
            const domainConfig = getDomainConfig(domain.domain);
            const IconComponent = domainConfig.icon;
            return (
              <div key={domain.domain} className="shrink-0">
                <Badge 
                  variant="secondary"
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 transition-colors hover:bg-accent",
                    domainConfig.bgColor,
                    domainConfig.textColor,
                    domainConfig.borderColor
                  )}
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
          
          <ZoozEarnedDisplay zoozEarned={user.zoozEarned || 0} showAnimation textColorClass="text-foreground/90" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-trust hover:bg-trust/90 text-white">
            <Crown className="w-4 h-4 ml-2" />
            תן אמון
          </Button>
          <Button variant="outline" className="flex-1">
            <Eye className="w-4 h-4 ml-2" />
            צפה
          </Button>
        </div>
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
            posts={user.posts.map((post: any) => ({
              id: post.id,
              thumbnail: `/api/placeholder/300/400`,
              caption: post.caption,
              trustCount: post.trustCount,
              watchCount: post.watchCount,
              commentCount: post.commentCount,
              shareCount: post.shareCount,
              duration: "0:15",
            }))}
            onVideoClick={(postId, index) => {
              // Handle video click for view-only mode
              console.log("Video clicked:", postId, index);
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
              <p className="text-sm leading-relaxed text-right">
                {user.professionalExperience}
              </p>
            </div>
          </div>

          <div className="bg-card border-b border-border">
            {/* Education */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                השכלה
              </h3>
              <p className="text-sm leading-relaxed text-right">
                {user.education}
              </p>
            </div>
          </div>

          <div className="bg-card border-b border-border">
            {/* Community & Public Service */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                פעילות ציבורית וקהילתית
              </h3>
              <p className="text-sm leading-relaxed text-right">
                {user.communityService}
              </p>
            </div>
          </div>

          <div className="bg-card border-b border-border">
            {/* Publications & Media */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                פרסומים והשפעה
              </h3>
              <p className="text-sm leading-relaxed text-right">
                {user.publications}
              </p>
            </div>
          </div>

          <div className="bg-card border-b border-border">
            {/* Awards & Recognition */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Crown className="w-5 h-5" />
                הכרה וביקורת עמיתים
              </h3>
              <p className="text-sm leading-relaxed text-right">
                {user.awards}
              </p>
            </div>
          </div>

          <div className="bg-card border-b border-border">
            {/* Languages & Skills */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                כישורים ושפות
              </h3>
              <p className="text-sm leading-relaxed text-right">
                {user.skills}
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trusters" className="mt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">אנשים שנותנים אמון למשתמש</p>
          </div>
        </TabsContent>
        
        <TabsContent value="trusted" className="mt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">אנשים שהמשתמש נותן להם אמון</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;