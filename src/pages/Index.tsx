import { useState, useEffect } from "react";
import { VideoFeed } from "@/components/VideoFeed";
import { Navigation } from "@/components/Navigation";
import { SwipeHandler } from "@/components/SwipeHandler";
import { KYCForm } from "@/components/KYCForm";
import { VideoCreator } from "@/components/VideoCreator";
import { FeedFilters, FilterState } from "@/components/FeedFilters";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import News from "./News";

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
    expertise: "טכנולוגיה",
    category: "technology" as const,
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
  const [feedFilter, setFeedFilter] = useState<FilterState>({ type: 'all' });
  const { toast } = useToast();

  useEffect(() => {
    // Set RTL direction for the entire app
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  const handleTrust = (postId: string) => {
    const post = mockPosts.find(p => p.id === postId);
    toast({
      title: "Trust Given! ❤️",
      description: `You trusted @${post?.handle}. Your trust helps build a better network.`,
    });
  };

  const handleWatch = (postId: string) => {
    const post = mockPosts.find(p => p.id === postId);
    toast({
      title: "Now Watching 👁️",
      description: `You're now watching @${post?.handle}. You'll see their content more often.`,
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

    const post = mockPosts.find(p => p.id === postId);
    setZoozBalance(prev => prev - 1);
    
    // Update the post's zooz count
    const postIndex = mockPosts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      mockPosts[postIndex].zoozCount += 1;
    }

    toast({
      title: "ZOOZ Sent! 🚀",
      description: `You sent 1 ZOOZ to @${post?.handle}. Supporting amazing creators!`,
    });
  };

  const handleCreateContent = () => {
    console.log("+ button clicked!", { isKYCVerified, showKYC });
    if (!isKYCVerified) {
      console.log("Setting showKYC to true");
      setShowKYC(true);
    } else {
      console.log("Opening video creator");
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
    console.log("Published video data:", videoData);
  };

  const getFilteredPosts = () => {
    switch (feedFilter.type) {
      case 'trusted':
        // Sort by trust count descending to show top trusted users
        return [...mockPosts].sort((a, b) => b.trustCount - a.trustCount);
      case 'category':
        if (feedFilter.category) {
          return mockPosts.filter(post => post.category === feedFilter.category);
        }
        return mockPosts;
      case 'all':
      default:
        // Show all posts, newest first (assuming ID order represents recency)
        return mockPosts;
    }
  };


  console.log("Posts filtrés:", getFilteredPosts().map(p => ({ id: p.id, username: p.username })));
  
  return (
    <div className="h-screen bg-background relative">
      {/* Add Content Button */}
      <button
        onClick={handleCreateContent}
        className="absolute top-4 left-4 z-50 w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/30 hover:bg-primary/30 transition-colors"
      >
        <Plus className="w-6 h-6 text-primary" />
      </button>
      
      <div className="h-screen relative">
        <SwipeHandler
          onSwipeLeft={() => {
            toast({
              title: "Watch Added! 👁️",
              description: "You're now watching this creator.",
            });
          }}
          onSwipeRight={() => {
            toast({
              title: "Trust Given! ❤️",
              description: "Your trust helps build a better network.",
            });
          }}
        >
          <VideoFeed
            posts={getFilteredPosts()}
            onTrust={handleTrust}
            onWatch={handleWatch}
            onZooz={handleZooz}
            userBalance={zoozBalance}
            currentUserId="550e8400-e29b-41d4-a716-446655440000" // Valid UUID for testing
          />
        </SwipeHandler>
        <FeedFilters 
          activeFilter={feedFilter}
          onFilterChange={setFeedFilter}
        />
      </div>

      <Navigation zoozBalance={zoozBalance} />

      {showKYC && (
        <div className="fixed inset-0 z-50">
          <KYCForm
            onSubmit={handleKYCSubmit}
            onBack={() => setShowKYC(false)}
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