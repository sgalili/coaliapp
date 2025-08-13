import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { NewsItemComponent } from "@/components/NewsItem";
import { NewsFilters } from "@/components/NewsFilters";
import { FullscreenVideoPlayer } from "@/components/FullscreenVideoPlayer";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Import profile images for mock data
import sarahProfile from "@/assets/sarah-profile.jpg";
import davidProfile from "@/assets/david-profile.jpg";
import mayaProfile from "@/assets/maya-profile.jpg";
import amitProfile from "@/assets/amit-profile.jpg";
import rachelProfile from "@/assets/rachel-profile.jpg";

// Mock news data with real video URLs
const mockNews = [
  {
    id: "news-1",
    title: "הכנסת אישרה את חוק השידור החדש - מה זה אומר על העתיד של התקשורת?",
    description: "החוק החדש יעמיד אתגרים חדשים בפני התאגיד החדש של השידור הישראלי ויכול לשנות את פני התקשורת",
    thumbnail: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=300&h=200&fit=crop",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: "פוליטיקה",
    source: "חדשות 12",
    comments: [
      {
        id: "comment-1",
        userId: "1",
        username: "שרה כהן",
        userImage: sarahProfile,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration: 25,
        likes: 45,
        replies: 8,
        trustLevel: 1247,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        category: "פוליטיקה",
        kycLevel: 3 as const,
        watchCount: 156,
        shareCount: 12
      },
      {
        id: "comment-2",
        userId: "2",
        username: "דוד לוי",
        userImage: davidProfile,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        duration: 18,
        likes: 23,
        replies: 3,
        trustLevel: 892,
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        category: "פוליטיקה",
        kycLevel: 2 as const,
        watchCount: 89,
        shareCount: 7
      }
    ]
  },
  {
    id: "news-2",
    title: "פריצת דרך בטכנולוגיית הבלוקצ'יין - סטארט-אפ ישראלי פיתח פתרון חדשני",
    description: "הטכנולוגיה החדשה יכולה לשנות את עולם הפיננסים הדיגיטליים ולהביא לשקיפות רבה יותר",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    category: "טכנולוגיה",
    source: "גלובס",
    comments: [
      {
        id: "comment-3",
        userId: "3",
        username: "מיה רוזן",
        userImage: mayaProfile,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration: 30,
        likes: 67,
        replies: 12,
        trustLevel: 456,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        category: "טכנולוגיה",
        kycLevel: 1 as const,
        watchCount: 234,
        shareCount: 18
      }
    ]
  },
  {
    id: "news-3",
    title: "עליה חדה במחירי הדיור - מה הפתרונות האפשריים?",
    description: "מחירי הדיור ממשיכים לטפס ומעוררים דאגה רבה בקרב צעירים הרוצים לרכוש דירה ראשונה",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    category: "כלכלה",
    source: "כלכליסט",
    comments: [
      {
        id: "comment-4",
        userId: "4",
        username: "עמית שטיין",
        userImage: amitProfile,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        duration: 22,
        likes: 34,
        replies: 5,
        trustLevel: 234,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        category: "כלכלה",
        kycLevel: 2 as const,
        watchCount: 98,
        shareCount: 5
      },
      {
        id: "comment-5",
        userId: "5",
        username: "רחל גולד",
        userImage: rachelProfile,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        duration: 28,
        likes: 89,
        replies: 15,
        trustLevel: 678,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        category: "כלכלה",
        kycLevel: 3 as const,
        watchCount: 167,
        shareCount: 23
      }
    ]
  },
  {
    id: "news-4",
    title: "המכבי תל אביב זכתה באליפות - חגיגות ברחובות העיר",
    description: "אלפי אוהדים יצאו לרחובות לחגוג את הזכייה המרגשת של המכבי תל אביב באליפות המדינה",
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    category: "ספורט",
    source: "ספורט 5",
    comments: []
  }
];

const NewsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [zoozBalance] = useState(1250);
  const [fullscreenVideo, setFullscreenVideo] = useState<{
    comments: any[];
    commentIndex: number;
  } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getFilteredNews = () => {
    if (activeFilter === "all") return mockNews;
    
    const filterMap: { [key: string]: string } = {
      politics: "פוליטיקה",
      technology: "טכנולוגיה", 
      economy: "כלכלה",
      sports: "ספורט",
      culture: "תרבות"
    };

    if (activeFilter === "trending") {
      return [...mockNews].sort((a, b) => {
        const aTrustSum = a.comments.reduce((sum, comment) => sum + comment.trustLevel, 0);
        const bTrustSum = b.comments.reduce((sum, comment) => sum + comment.trustLevel, 0);
        return bTrustSum - aTrustSum;
      });
    }

    return mockNews.filter(news => news.category === filterMap[activeFilter]);
  };

  const handleNewsClick = (newsId: string) => {
    navigate(`/news/${newsId}`);
  };

  const handleProfileClick = (newsId: string, comment: any) => {
    // Find the news item and get all its comments for fullscreen navigation
    const newsItem = mockNews.find(news => news.id === newsId);
    if (newsItem && newsItem.comments.length > 0) {
      const commentIndex = newsItem.comments.findIndex(c => c.id === comment.id);
      setFullscreenVideo({
        comments: newsItem.comments,
        commentIndex: commentIndex >= 0 ? commentIndex : 0
      });
    }
  };

  const handleVideoInteraction = (commentId: string, action: string) => {
    const actionTexts: { [key: string]: { title: string; description: string } } = {
      Trust: { title: "אמון נוסף!", description: "הוספת אמון לתגובה זו." },
      Watch: { title: "נצפה!", description: "התגובה נוספה לרשימת הצפייה שלך." },
      Comment: { title: "תגובה!", description: "פתח חלון תגובה חדשה." },
      Share: { title: "שותף!", description: "התגובה שותפה בהצלחה." }
    };
    
    const actionText = actionTexts[action] || { title: action, description: `פעולה ${action} בוצעה.` };
    
    toast({
      title: actionText.title,
      description: actionText.description,
    });
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <NewsFilters 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4">
          {getFilteredNews().map((newsItem) => (
            <NewsItemComponent
              key={newsItem.id}
              item={newsItem}
              onNewsClick={handleNewsClick}
              onProfileClick={handleProfileClick}
            />
          ))}
        </div>
      </div>

      <Navigation zoozBalance={zoozBalance} />

      {/* Fullscreen Video Player */}
      {fullscreenVideo && (
        <FullscreenVideoPlayer
          comments={fullscreenVideo.comments}
          initialCommentIndex={fullscreenVideo.commentIndex}
          onClose={() => setFullscreenVideo(null)}
          onTrust={(commentId) => handleVideoInteraction(commentId, "Trust")}
          onWatch={(commentId) => handleVideoInteraction(commentId, "Watch")}
          onComment={(commentId) => handleVideoInteraction(commentId, "Comment")}
          onShare={(commentId) => handleVideoInteraction(commentId, "Share")}
        />
      )}
    </div>
  );
};

export default NewsPage;