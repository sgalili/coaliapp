import { useState, useEffect } from "react";
import { VoteFeed } from "@/components/VoteFeed";
import { VoteHeader } from "@/components/VoteHeader";
import { VoteFilters, VoteFilterType } from "@/components/VoteFilters";
import { Navigation } from "@/components/Navigation";
import { KYCForm } from "@/components/KYCForm";
import { VideoCreator } from "@/components/VideoCreator";
import { useToast } from "@/hooks/use-toast";
import { useKYC } from "@/hooks/useKYC";
import { X } from "lucide-react";

// Import profile images
import sarahProfile from "@/assets/sarah-profile.jpg";
import yaakovProfile from "@/assets/yaakov-profile.jpg";
import mayaProfile from "@/assets/maya-profile.jpg";
import amitProfile from "@/assets/amit-profile.jpg";
import rachelProfile from "@/assets/rachel-profile.jpg";
import noaProfile from "@/assets/noa-profile.jpg";
import netanyahuProfile from "@/assets/netanyahu-profile.jpg";
import yaronProfile from "@/assets/yaron-zelekha-profile.jpg";

// Mock data for development
const mockPosts = [
  {
    id: "1",
    username: "בנימין נתניהו",
    handle: "netanyahu_pm",
    profileImage: netanyahuProfile,
    videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755817615/netanyahu-debate_fitgzh.mp4",
    caption: "על העתיד של ישראל במזרח התיכון החדש. האתגרים הגדולים שלפנינו דורשים מנהיגות חזקה ועמידה בערכי היהדות והדמוקרטיה 🇮🇱",
    trustCount: 89420,
    watchCount: 125560,
    commentCount: 28821,
    shareCount: 15205,
    zoozCount: 45934,
    isVerified: true,
    kycLevel: 3 as const,
    expertise: "פוליטיקה",
    category: "politics" as const,
    isLive: false,
  },
  {
    id: "2",
    username: "ירון זליכה", 
    handle: "yaron_economy",
    profileImage: yaronProfile,
    videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755818123/%D7%90%D7%96_%D7%9E%D7%94_%D7%90%D7%AA%D7%94_%D7%91%D7%A2%D7%A6%D7%9D_%D7%9E%D7%A6%D7%99%D7%A2__jb7xb0.mp4",
    caption: "המשבר הכלכלי העולמי ומה שישראל צריכה לעשות עכשיו. האינפלציה, שוק הנדל״ן והטכנולוגיה - אסטרטגיה לעשור הבא 📈",
    trustCount: 2847,
    watchCount: 4156,
    commentCount: 892,
    shareCount: 234,
    zoozCount: 5420,
    isVerified: true,
    kycLevel: 3 as const,
    expertise: "כלכלה",
    category: "economy" as const,
    isLive: true,
  },
  {
    id: "7",
    username: "Warren Buffett",
    handle: "buffett_wisdom",
    profileImage: mayaProfile,
    videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755818920/Warren_Buffett_-_Best_advice_ever_lhuq7u.mp4",
    caption: "Investment principles that never change. Why patience and compound interest are still the most powerful forces in finance. The next decade outlook 💰",
    trustCount: 12650,
    watchCount: 45230,
    commentCount: 2341,
    shareCount: 892,
    zoozCount: 15670,
    isVerified: true,
    kycLevel: 3 as const,
    expertise: "השקעות",
    category: "economy" as const,
    isLive: false,
  },
  {
    id: "4",
    username: "שרה כהן",
    handle: "sarah_politics",
    profileImage: sarahProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    caption: "איך אמון דיגיטלי יכול לשנות את הדמוקרטיה שלנו? הנה הדעה שלי על העתיד של הצבעה ברשת. אין דבר כזה מאובטח או לא, הרי אפשר לגנוב קולות ולזייף גם בקלפי מסורתי 🗳️",
    trustCount: 1247,
    watchCount: 856,
    commentCount: 234,
    shareCount: 89,
    zoozCount: 3420,
    isVerified: true,
    kycLevel: 3 as const,
    expertise: "פוליטיקה",
    category: "politics" as const,
    isLive: true,
  },
  {
    id: "5",
    username: "יעקב אליעזרוב",
    handle: "david_tech",
    profileImage: yaakovProfile,
    videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755819172/Thank_you_Hashem_telaviv_israel_jewellery_diamonds_jeweler_gold_aupgtx.mp4",
    caption: "תכשיטים שמייצרים עם הלב משפיעים על אנרגיות האדם שנושא אותם - בואו לגלות תכשיטים מלא אנרגיות בלב תל אביב",
    trustCount: 892,
    watchCount: 1203,
    commentCount: 167,
    shareCount: 45,
    zoozCount: 2156,
    isVerified: true,
    kycLevel: 2 as const,
    expertise: "תכשיטים",
    category: "jewelry" as const,
  },
  {
    id: "6",
    username: "מיה רוזן",
    handle: "maya_edu",
    profileImage: mayaProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    caption: "איך אנחנו יכולים לשלב אמון דיגיטלי במערכת החינוך? רעיונות חדשניים לכיתת העתיד 📚",
    trustCount: 456,
    watchCount: 621,
    commentCount: 89,
    shareCount: 23,
    zoozCount: 887,
    isVerified: false,
    kycLevel: 2 as const,
    expertise: "חינוך",
    category: "education" as const,
    isLive: true,
  },
  {
    id: "8",
    username: "עמית שטיין",
    handle: "amit_startup",
    profileImage: amitProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    caption: "למה כל סטארט-אפ צריך לחשוב על רשתות אמון מהיום הראשון? הדוגמאות המוצלחות ביותר 💡",
    trustCount: 234,
    watchCount: 389,
    commentCount: 56,
    shareCount: 12,
    zoozCount: 543,
    isVerified: false,
    kycLevel: 1 as const,
    expertise: "יזמות",
    category: "startup" as const,
  },
  {
    id: "9",
    username: "רחל גולד",
    handle: "rachel_academic",
    profileImage: rachelProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    caption: "המחקר החדש שלנו על השפעת רשתות אמון על קבלת החלטות קהילתיות. תוצאות מפתיעות! 🔬",
    trustCount: 678,
    watchCount: 934,
    commentCount: 123,
    shareCount: 34,
    zoozCount: 1789,
    isVerified: true,
    kycLevel: 3 as const,
    expertise: "אקדמיה",
    category: "academia" as const,
    isLive: true,
  },
  {
    id: "10",
    username: "נועה ברק",
    handle: "noa_art",
    profileImage: noaProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    caption: "איך אמנות דיגיטלית יכולה לבטא אמון? הפרויקט החדש שלי בנושא NFT ואמון קהילתי 🎨",
    trustCount: 123,
    watchCount: 267,
    commentCount: 45,
    shareCount: 8,
    zoozCount: 298,
    isVerified: false,
    kycLevel: 1 as const,
    expertise: "אמנות",
    category: "art" as const,
  }
];

const Index = () => {
  const [isKYCVerified, setIsKYCVerified] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const [showVideoCreator, setShowVideoCreator] = useState(false);
  const [zoozBalance, setZoozBalance] = useState(1250);
  const [voteFilter, setVoteFilter] = useState<VoteFilterType>('for-me');
  const [showKycNotice, setShowKycNotice] = useState(true);
  const { toast } = useToast();
  
  const {
    showKYC: showKYCFromHook,
    triggerKYCCheck,
    handleKYCSuccess,
    handleKYCClose
  } = useKYC();

  useEffect(() => {
    // Set RTL direction for the entire app
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  const handleTrust = (postId: string) => {
    toast({
      title: "Trust Given! ❤️",
      description: "Your trust helps build a better network.",
    });
  };

  const handleWatch = (postId: string) => {
    toast({
      title: "Now Watching 👁️",
      description: "You'll see their content more often.",
    });
  };

  const handleZooz = (postId: string) => {
    if (zoozBalance < 1) {
      toast({
        title: "Insufficient ZOOZ",
        description: "You don't have enough ZOOZ to support this creator.",
      });
      return;
    }

    setZoozBalance(prev => prev - 1);
    
    toast({
      title: "ZOOZ Sent! 🚀",
      description: "Supporting amazing creators!",
    });
  };

  const handleCreateContent = () => {
    if (!isKYCVerified) {
      setShowKYC(true);
    } else {
      setShowVideoCreator(true);
    }
  };

  const handleKYCSubmit = (data: any) => {
    toast({
      title: "KYC Verified!",
      description: "Your verification is complete. You can now create content!",
    });
    setIsKYCVerified(true);
    setShowKYC(false);
    setShowVideoCreator(true);
  };

  const handleVideoPublish = (videoData: any) => {
    toast({
      title: "Video Published!",
      description: `Your ${videoData.mode} content has been published successfully.`,
    });
    setShowVideoCreator(false);
  };
  
  return (
    <div className="min-h-screen bg-background relative">
      {/* Vote Header */}
      <VoteHeader />
      
      {/* KYC Notice */}
      {showKycNotice && (
        <div className="pt-20 px-3 pb-0">
          <div className="bg-blue-50 border border-blue-180 p-0 text-right relative rounded my-0 px-px mx-[42px]">
            <button 
              onClick={() => setShowKycNotice(false)} 
              className="absolute top-1 left-1 w-4 h-4 flex items-center justify-center transition-colors hover:opacity-70"
            >
              <X className="w-2.5 h-2.5 text-blue-600" />
            </button>
            <button 
              onClick={() => triggerKYCCheck()} 
              className="text-blue-800 text-sm hover:underline cursor-pointer p-3 w-full font-medium"
            >
              🎉 אמתו זהות וזכו ב-10 Z + תוכן מותאם אישית רק בשבילכם! ✨
            </button>
          </div>
        </div>
      )}
      
      {/* Vote Filters */}
      <VoteFilters 
        activeFilter={voteFilter}
        onFilterChange={setVoteFilter}
      />
      
      {/* Vote Feed - Full Width Instagram Style */}
      <VoteFeed filter={voteFilter} />

      <Navigation zoozBalance={zoozBalance} />

      {(showKYC || showKYCFromHook) && (
        <div className="fixed inset-0 z-50">
          <KYCForm
            onSubmit={handleKYCSubmit}
            onBack={() => {
              setShowKYC(false);
              handleKYCClose();
            }}
          />
        </div>
      )}

      {showVideoCreator && (
        <VideoCreator
          onClose={() => setShowVideoCreator(false)}
          onPublish={handleVideoPublish}
        />
      )}
    </div>
  );
};

export default Index;