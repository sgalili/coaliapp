import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, Share2, MoreVertical, Heart, Eye, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewsDetailPage() {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const [newsArticle, setNewsArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
    
    // Fetch news details
    fetchNewsDetail();
  }, [newsId]);

  const fetchNewsDetail = async () => {
    setLoading(true);
    try {
      // For now, fetch from the same endpoint and find the article
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';
      
      // Extract category from newsId (format: category_index_timestamp)
      const parts = newsId?.split('_') || [];
      const category = parts[0];
      
      if (category) {
        const response = await fetch(`${BACKEND_URL}/api/news/by-category/${category}?max_results=10`);
        const data = await response.json();
        
        // Find the specific article
        const article = data.articles?.find((a: any) => a.id === newsId);
        
        if (article) {
          // Extract image URL from content
          let imageUrl = '';
          let cleanContent = article.content;
          if (article.content.startsWith('IMAGE_URL:')) {
            const parts = article.content.split('\n\n');
            imageUrl = parts[0].replace('IMAGE_URL:', '');
            cleanContent = parts.slice(1).join('\n\n');
          }
          
          setNewsArticle({
            ...article,
            content: cleanContent,
            image: imageUrl || `https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=600&fit=crop`,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching news detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="p-4 space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-64 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
        </div>
        <Navigation zoozBalance={999} />
      </div>
    );
  }

  if (!newsArticle) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">החדשה לא נמצאה</p>
          <button
            onClick={() => navigate('/news')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            חזרה לחדשות
          </button>
        </div>
        <Navigation zoozBalance={999} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Hero Image */}
        <img
          src={newsArticle.image}
          alt={newsArticle.title}
          className="w-full aspect-[2/1] object-cover"
        />

        {/* Article Content */}
        <div className="px-4 py-6">
          {/* Category Badge */}
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-3">
            {newsArticle.category}
          </span>

          {/* Headline */}
          <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">
            {newsArticle.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
            <span>{newsArticle.source}</span>
            <span>•</span>
            <span>{new Date(newsArticle.published_at).toLocaleDateString('he-IL')}</span>
          </div>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            {newsArticle.content.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx} className="text-foreground leading-relaxed mb-4 text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Engagement Bar */}
          <div className="flex items-center gap-4 py-6 border-y border-border my-6">
            <button className="flex items-center gap-2 hover:text-trust transition-colors">
              <Heart className="w-5 h-5" />
              <span className="font-medium">אמון</span>
            </button>
            <button className="flex items-center gap-2 hover:text-primary transition-colors">
              <Eye className="w-5 h-5" />
              <span className="font-medium">צפייה</span>
            </button>
            <button className="flex items-center gap-2 hover:text-primary transition-colors">
              <Bookmark className="w-5 h-5" />
              <span className="font-medium">שמור</span>
            </button>
          </div>

          {/* Source Credit */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">
              מקור: <span className="font-medium text-foreground">{newsArticle.source}</span>
            </p>
          </div>
        </div>
      </div>

      <Navigation zoozBalance={999} />
    </div>
  );
}
