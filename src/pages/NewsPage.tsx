import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { NewsFilters } from "@/components/NewsFilters";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { useNavigate } from "react-router-dom";
import { useNews } from "@/hooks/useNews";
import { useIsDemoMode } from "@/hooks/useIsDemoMode";

const NewsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [zoozBalance] = useState(1250);
  const navigate = useNavigate();
  const { news, isLoading } = useNews();

  const categoryMap: { [key: string]: string } = {
    politics: "פוליטיקה",
    technology: "טכנולוגיה", 
    economy: "כלכלה",
    health: "בריאות",
    education: "חינוך",
    society: "חברה",
    environment: "סביבה"
  };

  const getFilteredNews = () => {
    if (activeFilter === "all") return news;

    if (activeFilter === "trending") {
      return [...news].sort((a, b) => b.comment_count - a.comment_count);
    }

    const filterCategory = categoryMap[activeFilter];
    return news.filter(item => item.category === filterCategory);
  };

  const handleNewsClick = (newsId: string) => {
    navigate(`/news/${newsId}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-100 flex flex-col">
      <DemoModeBanner />
      
      <NewsFilters 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="flex-1 overflow-y-auto pb-20">
        <div>
          {getFilteredNews().map((newsItem) => (
            <div
              key={newsItem.id}
              onClick={() => handleNewsClick(newsItem.id)}
              className="bg-white border-b border-border p-4 hover:bg-accent/50 cursor-pointer transition-colors"
            >
              <div className="flex gap-3">
                {newsItem.thumbnail_url && (
                  <img
                    src={newsItem.thumbnail_url}
                    alt={newsItem.title}
                    className="w-24 h-24 object-cover rounded-lg shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{newsItem.title}</h3>
                  {newsItem.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{newsItem.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{newsItem.source}</span>
                    <span>•</span>
                    <span>{newsItem.category}</span>
                    <span>•</span>
                    <span>{newsItem.comment_count} תגובות</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Navigation zoozBalance={zoozBalance} />
    </div>
  );
};

export default NewsPage;