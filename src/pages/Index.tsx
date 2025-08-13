import { useState, useEffect } from "react";
import { VideoFeed } from "@/components/VideoFeed";
import { Navigation } from "@/components/Navigation";
import { SwipeHandler } from "@/components/SwipeHandler";
import { KYCForm } from "@/components/KYCForm";
import { FeedFilters, FilterState } from "@/components/FeedFilters";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import News from "./News";

// Import profile images
import sarahProfile from "@/assets/sarah-profile.jpg";
import davidProfile from "@/assets/david-profile.jpg";
import mayaProfile from "@/assets/maya-profile.jpg";
import amitProfile from "@/assets/amit-profile.jpg";
import rachelProfile from "@/assets/rachel-profile.jpg";
import noaProfile from "@/assets/noa-profile.jpg";

// Mock data for development
const mockPosts = [
  {
    id: "1",
    username: "שרה כהן",
    handle: "sarah_politics",
    profileImage: sarahProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    caption: "איך אמון דיגיטלי יכול לשנות את הדמוקרטיה שלנו? הנה הדעה שלי על העתיד של הצבעה ברשת. אין דבר כזה מאובטח או לא, הרי אפשר לגנוב קולות ולזייף גם בקלפי מסורתי. הנושא המרכזי נמצא באמון הציבור למערכת, ולכן, מהרגע שאפשר למדוד את זה בזמן אמת ברשת, אמון הציבור עולה והתוצאות הן מהפכניות 🗳️",
    trustCount: 1247,
    watchCount: 856,
    commentCount: 234,
    shareCount: 89,
    isVerified: true,
    kycLevel: 3 as const,
    expertise: "פוליטיקה",
    category: "politics" as const,
  },
  {
    id: "2", 
    username: "דוד לוי",
    handle: "david_tech",
    profileImage: davidProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    caption: "בלוקצ'יין + רשתות אמון = העתיד של הטכנולוגיה החברתית. מסבירים איך זה עובד! 🚀",
    trustCount: 892,
    watchCount: 1203,
    commentCount: 167,
    shareCount: 45,
    isVerified: true,
    kycLevel: 2 as const,
    expertise: "טכנולוגיה",
    category: "technology" as const,
  },
  {
    id: "3",
    username: "מיה רוזן",
    handle: "maya_edu",
    profileImage: mayaProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    caption: "איך אנחנו יכולים לשלב אמון דיגיטלי במערכת החינוך? רעיונות חדשניים לכיתת העתיד 📚",
    trustCount: 456,
    watchCount: 621,
    commentCount: 89,
    shareCount: 23,
    isVerified: false,
    kycLevel: 2 as const,
    expertise: "חינוך",
    category: "education" as const,
  },
  {
    id: "4",
    username: "עמית שטיין",
    handle: "amit_startup",
    profileImage: amitProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    caption: "למה כל סטארט-אפ צריך לחשוב על רשתות אמון מהיום הראשון? הדוגמאות המוצלחות ביותר 💡",
    trustCount: 234,
    watchCount: 389,
    commentCount: 56,
    shareCount: 12,
    isVerified: false,
    kycLevel: 1 as const,
    expertise: "יזמות",
    category: "startup" as const,
  },
  {
    id: "5",
    username: "רחל גולד",
    handle: "rachel_academic",
    profileImage: rachelProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    caption: "המחקר החדש שלנו על השפעת רשתות אמון על קבלת החלטות קהילתיות. תוצאות מפתיעות! 🔬",
    trustCount: 678,
    watchCount: 934,
    commentCount: 123,
    shareCount: 34,
    isVerified: true,
    kycLevel: 3 as const,
    expertise: "אקדמיה",
    category: "academia" as const,
  },
  {
    id: "6",
    username: "נועה ברק",
    handle: "noa_art",
    profileImage: noaProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    caption: "איך אמנות דיגיטלית יכולה לבטא אמון? הפרויקט החדש שלי בנושא NFT ואמון קהילתי 🎨",
    trustCount: 123,
    watchCount: 267,
    commentCount: 45,
    shareCount: 8,
    isVerified: false,
    kycLevel: 1 as const,
    expertise: "אמנות",
    category: "art" as const,
  }
];

const Index = () => {
  const [isKYCVerified, setIsKYCVerified] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const [zoozBalance] = useState(1250);
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

  const handleCreateContent = () => {
    console.log("+ button clicked!", { isKYCVerified, showKYC });
    if (!isKYCVerified) {
      console.log("Setting showKYC to true");
      setShowKYC(true);
    } else {
      console.log("Showing create content toast");
      toast({
        title: "Create Content",
        description: "Opening content creation...",
      });
    }
  };

  const handleKYCSubmit = (data: any) => {
    toast({
      title: "KYC Submitted",
      description: "Your verification is being processed...",
    });
    setShowKYC(false);
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
    </div>
  );
};

export default Index;