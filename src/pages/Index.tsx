import { useState, useEffect } from "react";
import { VideoFeed } from "@/components/VideoFeed";
import { Navigation } from "@/components/Navigation";
import { SwipeHandler } from "@/components/SwipeHandler";
import { KYCForm } from "@/components/KYCForm";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

// Mock data for development
const mockPosts = [
  {
    id: "1",
    username: "sarah_politics",
    handle: "sarahp",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b57da81f?w=150&h=150&fit=crop&crop=face",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    caption: "The future of democracy depends on trust networks. Here's why we need to rethink how we choose our representatives... #TrustNetwork #Democracy",
    trustCount: 1247,
    watchCount: 856,
    commentCount: 234,
    shareCount: 89,
    isVerified: true,
    kycLevel: 3 as const,
  },
  {
    id: "2", 
    username: "tech_expert_mike",
    handle: "techexpert",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    caption: "Breaking down blockchain voting systems and why transparency matters. Trust should be earned, not assumed. 🔗 #Blockchain #Trust",
    trustCount: 892,
    watchCount: 1203,
    commentCount: 167,
    shareCount: 45,
    isVerified: false,
    kycLevel: 2 as const,
  },
  {
    id: "3",
    username: "climate_activist_anna",
    handle: "climateanna",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", 
    caption: "Climate action needs trusted voices, not corporate interests. Here's how we can build a movement based on real expertise... 🌱",
    trustCount: 2156,
    watchCount: 1834,
    commentCount: 445,
    shareCount: 156,
    isVerified: true,
    kycLevel: 3 as const,
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [zoozBalance] = useState(125);
  const [showKYC, setShowKYC] = useState(false);
  const [isKYCVerified] = useState(false); // Mock KYC status
  const { toast } = useToast();

  // Set RTL direction for Hebrew
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
    return () => {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    };
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
    if (!isKYCVerified) {
      setShowKYC(true);
    } else {
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

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <SwipeHandler
            onSwipeLeft={() => {
              // Handle watch action for current video
              toast({
                title: "Watch Added! 👁️",
                description: "You're now watching this creator.",
              });
            }}
            onSwipeRight={() => {
              // Handle trust action for current video  
              toast({
                title: "Trust Given! ❤️",
                description: "Your trust helps build a better network.",
              });
            }}
            className="h-screen"
          >
            <VideoFeed 
              posts={mockPosts}
              onTrust={handleTrust}
              onWatch={handleWatch}
            />
          </SwipeHandler>
        );
      case "trending":
        return (
          <div className="h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">תוכן פופולרי</h2>
              <p className="text-muted-foreground">התוכן הכי מהימן השבוע</p>
            </div>
          </div>
        );
      case "messages":
        return (
          <div className="h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">הודעות</h2>
              <p className="text-muted-foreground">התחבר עם חברים מהימנים</p>
            </div>
          </div>
        );
      case "wallet":
        return (
          <div className="h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">ארנק ZOOZ</h2>
              <div className="text-4xl font-bold text-zooz mb-2">{zoozBalance}</div>
              <p className="text-muted-foreground">אסימוני ZOOZ</p>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">הפרופיל שלך</h2>
              <p className="text-muted-foreground">נהל את רשת האמון שלך</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (showKYC) {
    return <KYCForm onSubmit={handleKYCSubmit} onBack={() => setShowKYC(false)} />;
  }

  return (
    <div className="h-screen bg-background relative overflow-hidden">
      {/* Add Content Button */}
      {activeTab === "home" && (
        <button
          onClick={handleCreateContent}
          className="absolute top-4 right-4 z-50 w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/30 hover:bg-primary/30 transition-colors"
        >
          <Plus className="w-6 h-6 text-primary" />
        </button>
      )}
      
      {renderContent()}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        zoozBalance={zoozBalance}
      />
    </div>
  );
};

export default Index;
