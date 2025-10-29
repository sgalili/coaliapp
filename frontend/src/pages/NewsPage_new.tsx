import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { MessageCircle, Eye, Heart, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: 'all', label: 'הכל' },
  { id: 'politics', label: 'פוליטיקה' },
  { id: 'tech', label: 'טכנולוגיה' },
  { id: 'economy', label: 'כלכלה' },
  { id: 'social', label: 'חברה' },
];

const placeholderNews = [
  { id: '1', headline: 'כותרת חדשה חשובה על אירוע משמעותי בארץ', source: 'מקור חדשות', time: 'לפני 2 שעות', comments: '45', watch: '1.2K', trust: '230' },
  { id: '2', headline: 'פיתוח טכנולוגי חדש שמשנה את השוק הישראלי', source: 'טכנולוגיה עכשיו', time: 'לפני 3 שעות', comments: '67', watch: '2.4K', trust: '415' },
  { id: '3', headline: 'שינוי כלכלי משמעותי צפוי בחודשים הקרובים', source: 'כלכליסט', time: 'לפני 5 שעות', comments: '89', watch: '3.1K', trust: '520' },
  { id: '4', headline: 'דיון חברתי חם סביב נושא רגיש במדינה', source: 'חברה וכלכלה', time: 'לפני 6 שעות', comments: '123', watch: '4.2K', trust: '680' },
  { id: '5', headline: 'עדכון חשוב על מצב הביטחון והפוליטיקה', source: 'חדשות 12', time: 'לפני 8 שעות', comments: '34', watch: '950', trust: '180' },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">אימפקט</h1>
        </div>
        
        {/* Category Filters */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div className="max-w-2xl mx-auto">
        {placeholderNews.map((news) => (
          <div key={news.id} className="border-b border-border bg-card hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="p-4">
              {/* News Thumbnail */}
              <div className="w-full aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">📰 תמונה</span>
              </div>

              {/* News Content */}
              <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">
                {news.headline}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span>{news.source}</span>
                <span>•</span>
                <span>{news.time}</span>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span>{news.comments}</span>
                </div>
                
                <div className="flex items-center gap-1 text-watch">
                  <Eye className="w-4 h-4" />
                  <span>{news.watch}</span>
                </div>
                
                <div className="flex items-center gap-1 text-trust">
                  <Heart className="w-4 h-4" />
                  <span>{news.trust}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={250} />
    </div>
  );
}
