import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Heart, Eye, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: 'all', label: 'הכל' },
  { id: 'politics', label: 'פוליטיקה' },
  { id: 'tech', label: 'טכנולוגיה' },
  { id: 'economy', label: 'כלכלה' },
];

const placeholderPosts = [
  { id: '1', username: 'שם משתמש 1', content: 'זהו פוסט לדוגמה. תוכן יטען כאן בקרוב...', trust: '1.2K', watch: '3.4K', comments: '45', zooz: '250' },
  { id: '2', username: 'שם משתמש 2', content: 'דוגמה נוספת לפוסט שיכול להכיל תוכן מעניין ורלוונטי למשתמשים.', trust: '856', watch: '2.1K', comments: '28', zooz: '180' },
  { id: '3', username: 'שם משתמש 3', content: 'פוסט שלישי עם תוכן מדומה להדגמת הממשק והעיצוב של הפלטפורמה.', trust: '2.3K', watch: '5.2K', comments: '67', zooz: '420' },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-bold text-foreground">בית</h1>
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

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto">
        {placeholderPosts.map((post) => (
          <div key={post.id} className="border-b border-border bg-card">
            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">👤</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{post.username}</p>
                  <p className="text-xs text-muted-foreground">לפני 2 שעות</p>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

              {/* Engagement Buttons */}
              <div className="flex items-center justify-around border-t border-border pt-3">
                <button className="flex flex-col items-center gap-1 text-trust hover:text-trust/80 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-xs font-medium">{post.trust}</span>
                </button>
                
                <button className="flex flex-col items-center gap-1 text-watch hover:text-watch/80 transition-colors">
                  <Eye className="w-5 h-5" />
                  <span className="text-xs font-medium">{post.watch}</span>
                </button>
                
                <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-xs font-medium">{post.comments}</span>
                </button>
                
                <button className="flex flex-col items-center gap-1 text-zooz hover:text-zooz/80 transition-colors">
                  <span className="text-lg font-bold">Z</span>
                  <span className="text-xs font-medium">{post.zooz}</span>
                </button>
                
                <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-xs font-medium">שתף</span>
                </button>
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
