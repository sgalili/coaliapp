import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share, Heart, MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { VideoFeed, VideoPost } from "@/components/VideoFeed";

// Mock data for posts
const mockPostsData = {
  "1": {
    id: "1",
    username: "שרה כהן",
    handle: "sarah_politics",
    profileImage: "/src/assets/sarah-profile.jpg",
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
  }
};

const PostDetailPage = () => {
  const { postId, userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const post = mockPostsData[postId as keyof typeof mockPostsData];

  if (!post) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">פוסט לא נמצא</h2>
          <Button onClick={() => navigate('/')}>חזור לעמוד הבית</Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    const url = userId 
      ? `${window.location.origin}/user/${userId}/post/${postId}`
      : `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "הקישור הועתק",
      description: "הקישור הועתק ללוח העתקות",
    });
  };

  const handleTrust = (id: string, post: VideoPost, isGivingTrust: boolean) => {
    const categoryName = getCategoryName(post.category || post.expertise);
    
    if (isGivingTrust) {
      toast({
        title: "אמון ניתן! ❤️",
        description: `נתת אמון ל-@${post.handle} בתחום ${categoryName} • עלות: 1 ZOOZ`,
      });
    } else {
      toast({
        title: "אמון הוסר",
        description: `האמון הוסר מ-@${post.handle} בתחום ${categoryName} • עלות: 1 ZOOZ`,
      });
    }
  };

  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'politics': 'פוליטיקה',
      'economy': 'כלכלה', 
      'technology': 'טכנולוגיה',
      'health': 'בריאות',
      'education': 'חינוך',
      'defense': 'ביטחון',
      'justice': 'משפטים',
      'environment': 'איכות הסביבה',
      'jewelry': 'תכשיטים ועסקים',
      'art': 'אמנות'
    };
    return categoryMap[category] || category;
  };

  const handleWatch = (id: string, isWatching?: boolean) => {
    toast({
      title: isWatching ? "עכשיו עוקב 👁️" : "הפסיק לעקוב",
      description: isWatching 
        ? `עכשיו אתה עוקב אחרי @${post.handle}. תראה יותר תוכן שלהם.`
        : `הפסקת לעקוב אחרי @${post.handle}.`,
    });
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 ml-2" />
          חזור
        </Button>
        <div className="text-center">
          <h2 className="font-semibold">{post.username}</h2>
          <p className="text-xs text-muted-foreground">@{post.handle}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share className="w-4 h-4" />
        </Button>
      </div>

      {/* Video Content */}
      <div className="flex-1">
        <VideoFeed 
          posts={[{...post, zoozCount: 0}]} 
          onTrust={handleTrust}
          onWatch={handleWatch}
          onZooz={() => {}}
          onVote={() => {}}
          userBalance={0}
          isMuted={true}
          onVolumeToggle={() => {}}
        />
      </div>

      {/* Engagement Stats */}
      <div className="bg-background/90 backdrop-blur-sm border-t border-border p-4">
        <div className="flex items-center justify-around text-sm">
          <div className="flex items-center gap-2 text-trust">
            <Heart className="w-4 h-4" />
            <span>{post.trustCount} Trust</span>
          </div>
          <div className="flex items-center gap-2 text-watch">
            <Eye className="w-4 h-4" />
            <span>{post.watchCount} Watch</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentCount} Comments</span>
          </div>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Share className="w-4 h-4" />
            <span>{post.shareCount} Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;