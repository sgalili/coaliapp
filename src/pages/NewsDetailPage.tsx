import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app this would come from API
const mockNewsData = {
  "news-1": {
    id: "news-1",
    title: "הכנסת אישרה את חוק השידור החדש - מה זה אומר על העתיד של התקשורת?",
    description: "החוק החדש יעמיד אתגרים חדשים בפני התאגיד החדש של השידור הישראלי ויכול לשנות את פני התקשורת",
    content: `
      <p>הכנסת אישרה היום בקריאה שלישית את חוק השידור החדש, אשר יקבע את פעילות התאגיד הישראלי לשידור לשנים הבאות.</p>
      
      <h3>עיקרי החוק:</h3>
      <ul>
        <li>הקמת מנגנון חדש לפיקוח על התוכן</li>
        <li>הגדלת התקציב המוקדש לתוכן מקורי</li>
        <li>חיזוק הרגולציה על תוכן דיגיטלי</li>
      </ul>
      
      <p>שר התקשורת הצהיר כי "זהו יום היסטורי עבור התקשורת הישראלית".</p>
    `,
    thumbnail: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: "פוליטיקה",
    source: "חדשות 12",
    likes: 234,
    comments: 45,
    shares: 89
  }
};

const NewsDetailPage = () => {
  const { newsId, commentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const newsItem = mockNewsData[newsId as keyof typeof mockNewsData];

  if (!newsItem) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">כתבה לא נמצאה</h2>
          <Button onClick={() => navigate('/news')}>חזור לחדשות</Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    const url = `${window.location.origin}/news/${newsId}${commentId ? `/comment/${commentId}` : ''}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "הקישור הועתק",
      description: "הקישור הועתק ללוח העתקות",
    });
  };

  const handleLike = () => {
    toast({
      title: "אהבתי!",
      description: "התגובה נוספה בהצלחה",
    });
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => navigate('/news')}>
          <ArrowLeft className="w-4 h-4 ml-2" />
          חזור
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 max-w-4xl mx-auto">
          {/* Article Image */}
          <img 
            src={newsItem.thumbnail} 
            alt={newsItem.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          {/* Article Meta */}
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
            <span>{newsItem.source}</span>
            <span>{new Date(newsItem.publishedAt).toLocaleDateString('he-IL')}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-4 text-right">{newsItem.title}</h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-6 text-right leading-relaxed">
            {newsItem.description}
          </p>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none text-right [&>*]:text-right"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          />

          {/* Engagement */}
          <div className="flex items-center justify-center gap-6 py-8 border-t border-border mt-8">
            <button 
              onClick={handleLike}
              className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>{newsItem.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>{newsItem.comments}</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors"
            >
              <Share className="w-5 h-5" />
              <span>{newsItem.shares}</span>
            </button>
          </div>

          {commentId && (
            <div className="bg-muted/50 p-4 rounded-lg mt-6">
              <h3 className="font-semibold mb-2">תגובת מומחה מודגשת</h3>
              <p className="text-sm text-muted-foreground">
                התגובה עם ID: {commentId} מוצגת כאן
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;