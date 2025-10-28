import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Eye, MessageCircle, Share, MapPin, Calendar, UserCheck, Camera, Vote, TrendingUp, Shield, GraduationCap, Handshake, Crown, Globe, Twitter, Facebook, Youtube, Linkedin, ExternalLink, Bell } from "lucide-react";
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
import { FullscreenVideoPlayer } from "@/components/FullscreenVideoPlayer";
import { cn } from "@/lib/utils";
import sarahProfile from "@/assets/sarah-profile.jpg";
import amitProfile from "@/assets/amit-profile.jpg";
import mayaProfile from "@/assets/maya-profile.jpg";
import davidProfile from "@/assets/david-profile.jpg";
import rachelProfile from "@/assets/rachel-profile.jpg";

// Mock current user data - in real app this would come from auth
const mockCurrentUser = {
  id: "current",
  username: "שרה כהן", 
  handle: "sarahp",
  profileImage: sarahProfile,
  bio: "מומחית למדיניות ציבורית ודמוקרטיה דיגיטלית. פועלת למען שקיפות ואמון ברשתות חברתיות.",
  location: "תל אביב, ישראל",
  joinDate: "מאי 2023",
  website: "https://sarahpolitics.com",
  twitter: "https://twitter.com/sarahpolitics",
  facebook: "https://www.facebook.com/sarah.politics.israel",
  youtube: "https://www.youtube.com/@sarahpolitics",
  scholar: "https://scholar.google.com/citations?user=sarahp",
  kycLevel: 2,
  isVerified: true,
  trustersCount: 847,
  watchersCount: 423,
  postsCount: 89,
  zoozEarned: 12750,
  professionalExperience: "מנהלת מחקר במכון למדיניות ציבורית (2020-2024) • יועצת לוועדת הכנסת לחינוך (2018-2020) • חוקרת בכירה במכון הישראלי לדמוקרטיה (2015-2018)",
  education: "דוקטורט במדעי המדינה, האוניברסיטה העברית (2015) • מוסמך במדיניות ציבורית, אוניברסיטת תל אביב (2010) • תואר ראשון בפילוסופיה ומדעי המדינה, האוניברסיטה הפתוחה (2008)",
  communityService: "מייסדת שותפה של 'דמוקרטיה דיגיטלית ישראל' • חברת מועצת המנהלים ב'שקיפות ישראל' • מתנדבת במרכז לזכויות אדם • מרצה אורחת באוניברסיטאות שונות",
  publications: "מחברת של 15 מאמרים מחקריים בכתבי עת מובילים • כותבת טור שבועי בהארץ • מרואיינת קבועה ברדיו וטלוויזיה בנושאי דמוקרטיה • הרצאות TEDx על עתיד הפוליטיקה",
  awards: "זוכת פרס רוטשילד למדעי החברה (2022) • נבחרת לרשימת 40 תחת 40 של גלובס (2021) • מקבלת מלגת פולברייט לחקר דמוקרטיה דיגיטלית בארה״ב",
  skills: "עברית (שפת אם) • אנגלית (ברמת דובר יליד) • ערבית (שיחה) • מומחיות בניתוח נתונים, מחקר איכותני, מדיניות ציבורית, ניהול פרויקטים",
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
  const [isLoading, setIsLoading] = useState(true);
  const zoozBalance = 1250;

  useEffect(() => {
    // Set RTL direction
    document.documentElement.setAttribute('dir', 'rtl');
    
    // Fetch real user profile
    const fetchUserProfile = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser) {
          console.error('Error getting auth user:', authError);
          navigate('/auth');
          return;
        }

        console.log('Fetching profile for user:', authUser.id);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // If no profile found, redirect to auth
          if (profileError.code === 'PGRST116') {
            navigate('/auth');
          }
          return;
        }

        console.log('Profile fetched successfully:', {
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone
        });

        // Update user state with real profile data
        setUser(prev => ({
          ...prev,
          id: authUser.id,
          username: profile.first_name && profile.last_name 
            ? `${profile.first_name} ${profile.last_name}` 
            : 'משתמש',
          handle: authUser.email?.split('@')[0] || 'user',
          profileImage: profile.avatar_url || prev.profileImage,
          location: prev.location,
        }));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

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
            posts={user.posts.map(post => ({
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
                value="מנהלת מחקר במכון למדיניות ציבורית (2020-2024) • יועצת לוועדת הכנסת לחינוך (2018-2020) • חוקרת בכירה במכון הישראלי לדמוקרטיה (2015-2018)"
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
                value="דוקטורט במדעי המדינה, האוניברסיטה העברית (2015) • מוסמך במדיניות ציבורית, אוניברסיטת תל אביב (2010) • תואר ראשון בפילוסופיה ומדעי המדינה, האוניברסיטה הפתוחה (2008)"
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
                value="מייסדת שותפה של 'דמוקרטיה דיגיטלית ישראל' • חברת מועצת המנהלים ב'שקיפות ישראל' • מתנדבת במרכז לזכויות אדם • מרצה אורחת באוניברסיטאות שונות"
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
                value="מחברת של 15 מאמרים מחקריים בכתבי עת מובילים • כותבת טור שבועי בהארץ • מרואיינת קבועה ברדיו וטלוויזיה בנושאי דמוקרטיה • הרצאות TEDx על עתיד הפוליטיקה"
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
                value="זוכת פרס רוטשילד למדעי החברה (2022) • נבחרת לרשימת 40 תחת 40 של גלובס (2021) • מקבלת מלגת פולברייט לחקר דמוקרטיה דיגיטלית בארה״ב"
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
                value="עברית (שפת אם) • אנגלית (ברמת דובר יליד) • ערבית (שיחה) • מומחיות בניתוח נתונים, מחקר איכותני, מדיניות ציבורית, ניהול פרויקטים"
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
                    sarah.politics@gmail.com
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">LinkedIn</span>
                  <span className="text-primary">@sarahpolitics</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">רמת KYC</span>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>רמה {user.kycLevel} - מאומת</span>
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
            {/* Mock data for people who gave trust */}
            {[
              {
                id: '1',
                name: 'אמית כהן',
                avatar: amitProfile,
                username: 'amit_cohen',
                bio: 'מומחה כלכלה וטכנולוגיה, יועץ השקעות ומרצה בכיר',
                trustCount: 15000, // רמה 5 - מנהיג (יש לו קורונה)
                kycLevel: 3,
                trustDate: 'לפני שעתיים',
                verified: true
              },
              {
                id: '2',
                name: 'שרה לוי',
                avatar: sarahProfile,
                username: 'sarah_education',
                bio: 'חוקרת חינוך, מומחית פדגוגיה דיגיטלית ויועצת ארגונית',
                trustCount: 1523, // רמה 4 - מומחה (יש לו יהלום)
                kycLevel: 2,
                trustDate: 'לפני יום',
                verified: true
              },
              {
                id: '3',
                name: 'דוד מושקוביץ',
                avatar: davidProfile,
                username: 'david_security',
                bio: 'מומחה אבטחת מידע, יועץ סייבר וחוקר באקדמיה',
                trustCount: 156, // רמה 3 - מהימן (יש לו כוכב מלא)
                kycLevel: 2,
                trustDate: 'לפני 3 ימים',
                verified: true
              },
              {
                id: '4',
                name: 'מאיה רוזן',
                avatar: mayaProfile,
                username: 'maya_health',
                bio: 'רופאה מומחית, חוקרת בתחום הבריאות הדיגיטלית',
                trustCount: 45, // רמה 2 - חבר (יש לו כוכב)
                kycLevel: 3,
                trustDate: 'לפני שבוע',
                verified: true
              },
              {
                id: '5',
                name: 'רחל אברהם',
                avatar: rachelProfile,
                username: 'rachel_economy',
                bio: 'כלכלנית בכירה, יועצת עסקית ומומחית בשווקים פיננסיים',
                trustCount: 5, // רמה 1 - חדש (יש לו סמל משתמש)
                kycLevel: 2,
                trustDate: 'לפני שבועיים',
                verified: true
              }
            ].map((truster) => (
              <div key={truster.id}>
                <div 
                  className="flex items-start gap-3 p-4 hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/profile/${truster.id}`)}
                >
                  {/* Profile Avatar with KYC */}
                  <div className="relative shrink-0">
                    <img 
                      src={truster.avatar} 
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
            ))}
            
            {/* Empty state if no trusters */}
            {false && (
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
            {/* Mock data for people I gave trust to */}
            {[
              {
                id: '1',
                name: 'דן אבידן',
                avatar: amitProfile,
                username: 'dan_crypto',
                bio: 'מומחה קריפטו ובלוקצ\'יין, יועץ השקעות דיגיטליות',
                trustCount: 8500, // רמה 5 - מנהיג
                kycLevel: 3,
                trustDate: 'לפני שעה',
                verified: true
              },
              {
                id: '2',
                name: 'מיכל רוזן',
                avatar: mayaProfile,
                username: 'michal_health',
                bio: 'רופאה מתמחה, חוקרת בתחום הבריאות הציבורית',
                trustCount: 2100, // רמה 4 - מומחה
                kycLevel: 2,
                trustDate: 'לפני 2 ימים',
                verified: true
              },
              {
                id: '3',
                name: 'יוסי כהן',
                avatar: davidProfile,
                username: 'yossi_tech',
                bio: 'מהנדס תוכנה בכיר, מומחה בינה מלאכותית',
                trustCount: 750, // רמה 3 - מהימן
                kycLevel: 2,
                trustDate: 'לפני שבוע',
                verified: true
              },
              {
                id: '4',
                name: 'ליאת שמואל',
                avatar: rachelProfile,
                username: 'liat_law',
                bio: 'עורכת דין מומחית, מתמחה בדיני טכנולוגיה',
                trustCount: 320, // רמה 3 - מהימן
                kycLevel: 3,
                trustDate: 'לפני שבועיים',
                verified: true
              },
              {
                id: '5',
                name: 'רון פרידמן',
                avatar: sarahProfile,
                username: 'ron_business',
                bio: 'יזם סדרתי, מומחה בפיתוח עסקי ויועץ סטארטאפים',
                trustCount: 95, // רמה 2 - חבר
                kycLevel: 2,
                trustDate: 'לפני חודש',
                verified: true
              }
            ].map((trusted) => (
              <div key={trusted.id}>
                <div 
                  className="flex items-start gap-3 p-4 hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/profile/${trusted.id}`)}
                >
                  {/* Profile Avatar with KYC */}
                  <div className="relative shrink-0">
                    <img 
                      src={trusted.avatar} 
                      alt={trusted.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <TrustStatusIndicator kycLevel={trusted.kycLevel} />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground truncate">{trusted.name}</h4>
                      <TrustBadge trustCount={trusted.trustCount} className="shrink-0" />
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1">@{trusted.username}</p>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {trusted.bio}
                    </p>
                    
                    {/* Trust stats and date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="relative">
                          <Handshake className="w-3 h-3 text-trust" />
                          <Crown className="w-1 h-1 text-yellow-400 absolute -top-0.5 -right-0.5" />
                        </div>
                        <span className="text-xs font-medium text-trust">
                          {trusted.trustCount.toLocaleString()}
                        </span>
                      </div>
                      
                      <span className="text-xs text-muted-foreground">
                        {trusted.trustDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-border mx-4" />
              </div>
            ))}
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