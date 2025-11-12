import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ChannelSelector } from "@/components/ChannelSelector";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { NewsCard } from "@/components/NewsCard";
import { Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChannel } from "@/contexts/ChannelContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const categories = [
  { id: 'all', label: 'הכל', apiValue: null },
  { id: 'politics', label: 'פוליטיקה', apiValue: 'politics' },
  { id: 'technology', label: 'טכנולוגיה', apiValue: 'technology' },
  { id: 'economy', label: 'כלכלה', apiValue: 'economy' },
  { id: 'society', label: 'חברה', apiValue: 'society' },
  { id: 'health', label: 'בריאות', apiValue: 'health' },
  { id: 'culture', label: 'תרבות', apiValue: 'culture' },
];

const expertProfiles = [
  'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
  'https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg',
  'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
  'https://trust.coali.app/assets/netanyahu-profile-C6yQFuUl.jpg',
  'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg',
  'https://trust.coali.app/assets/warren-buffett-profile-Bfn-yren.jpg',
  'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
  'https://trust.coali.app/assets/yaron-profile-DuwqrcEK.jpg',
  'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg',
];

const expertNames = ['יעקב אליעזרוב', 'שרה כהן', 'דוד לוי', 'בנימין נתניהו', 'נועה קירל', 'וורן באפט', 'ירון זלכה', 'ירון לונדון', 'מאיה רוזמן'];

const placeholderNewsData = [
  {
    id: 'placeholder-1',
    title: 'ההייטק הישראלי שבר שיאים בהשקעות ואקזיטים ב-2025',
    content: 'בשנת 2025 שבר ההייטק הישראלי שיאים בהיקף ההשקעות והאקזיטים, כאשר תחום הסייבר מוביל עם כ-30% מההשקעות.',
    category: 'technology',
    categoryLabel: 'טכנולוגיה',
    source: 'כלכליסט',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    experts: expertProfiles.slice(0, 5),
    poll_options: [
      { id: "1", label: "תומך", votes: 67, voter_ids: [] },
      { id: "2", label: "מתנגד", votes: 20, voter_ids: [] },
      { id: "3", label: "צריך שינויים", votes: 10, voter_ids: [] },
      { id: "4", label: "לא בטוח", votes: 3, voter_ids: [] },
    ],
    total_votes: 100,
  },
  {
    id: 'placeholder-2',
    title: 'הכנסת אישרה את חוק השידור החדש - מה זה אומר על עתיד התקשורת?',
    content: 'הכנסת אישרה את חוק השידור החדש בקריאה שנייה ושלישית. השינויים החדשים צפויים להשפיע על עתיד התקשורת בישראל.',
    category: 'politics',
    categoryLabel: 'פוליטיקה',
    source: 'חדשות 13',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop',
    experts: expertProfiles.slice(0, 7),
    poll_options: [
      { id: "1", label: "תומך", votes: 45, voter_ids: [] },
      { id: "2", label: "מתנגד", votes: 35, voter_ids: [] },
      { id: "3", label: "צריך שינויים", votes: 15, voter_ids: [] },
      { id: "4", label: "לא בטוח", votes: 5, voter_ids: [] },
    ],
    total_votes: 100,
  },
  {
    id: 'placeholder-3',
    title: 'עליה חדה במחירי הדיור - מה הפתרונות האפשריים?',
    content: 'מחירי הדיור בישראל ממשיכים לעלות. המומחים דנים בפתרונות אפשריים למשבר.',
    category: 'economy',
    categoryLabel: 'כלכלה',
    source: 'גלובס',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
    experts: expertProfiles.slice(0, 4),
    poll_options: [
      { id: "1", label: "בנייה ממשלתית", votes: 50, voter_ids: [] },
      { id: "2", label: "הקלות מס", votes: 25, voter_ids: [] },
      { id: "3", label: "שילוב פתרונות", votes: 20, voter_ids: [] },
      { id: "4", label: "לא בטוח", votes: 5, voter_ids: [] },
    ],
    total_votes: 100,
  },
  {
    id: 'placeholder-4',
    title: 'מחקר חדש בתחום הבריאות מגלה דרכים לשיפור איכות החיים',
    content: 'מחקר חדש שפורסם היום מראה כי שינויים פשוטים בהרגלי התזונה יכולים להוביל לשיפור משמעותי בבריאות.',
    category: 'health',
    categoryLabel: 'בריאות',
    source: 'הארץ',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop',
    experts: expertProfiles.slice(0, 3),
    poll_options: [
      { id: "1", label: "מעניין", votes: 60, voter_ids: [] },
      { id: "2", label: "חשוב", votes: 30, voter_ids: [] },
      { id: "3", label: "אחר", votes: 10, voter_ids: [] },
    ],
    total_votes: 100,
  },
];

export default function NewsPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { selectedChannel, setSelectedChannel, availableChannels, selectedCategory, setSelectedCategory, showChannelIndicator, setShowChannelIndicator } = useChannel();
  const [newsArticles, setNewsArticles] = useState<any[]>(placeholderNewsData);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Demo count

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  // Fetch news when channel changes
  useEffect(() => {
    fetchRealNews();
  }, [selectedChannel.id]);

  const refreshNews = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';
      
      if (selectedCategory !== 'הכל') {
        // Find the API value for selected category
        const cat = categories.find(c => c.label === selectedCategory);
        if (cat?.apiValue) {
          const url = `${BACKEND_URL}/api/news/by-category/${cat.apiValue}?max_results=5`;
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.articles && data.articles.length > 0) {
            const newArticles = data.articles.map((article: any) => {
              let imageUrl = '';
              let cleanContent = article.content;
              if (article.content.startsWith('IMAGE_URL:')) {
                const parts = article.content.split('\n\n');
                imageUrl = parts[0].replace('IMAGE_URL:', '');
                cleanContent = parts.slice(1).join('\n\n');
              }
              
              return {
                ...article,
                id: `${article.id}_refresh_${Date.now()}`, // Unique ID for refresh
                content: cleanContent,
                categoryLabel: cat.label,
                image: imageUrl || `https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop`,
                experts: expertProfiles.slice(0, Math.floor(Math.random() * 7) + 3),
              };
            });
            
            // Prepend new articles to top
            setNewsArticles(prev => [...newArticles, ...prev]);
          }
        }
      } else {
        // Refresh all categories
        fetchRealNews();
      }
    } catch (error) {
      console.error('Error refreshing news:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchRealNews = async () => {
    setLoading(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';
      const allNews: any[] = [];
      
      // Fetch from all categories
      for (const cat of categories) {
        if (cat.apiValue) {
          try {
            const url = `${BACKEND_URL}/api/news/by-category/${cat.apiValue}?max_results=5`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.articles && data.articles.length > 0) {
              allNews.push(...data.articles.map((article: any) => {
                // Extract image URL from content
                let imageUrl = '';
                let cleanContent = article.content;
                if (article.content.startsWith('IMAGE_URL:')) {
                  const parts = article.content.split('\n\n');
                  imageUrl = parts[0].replace('IMAGE_URL:', '');
                  cleanContent = parts.slice(1).join('\n\n');
                }
                
                return {
                  ...article,
                  content: cleanContent,
                  categoryLabel: cat.label,
                  image: imageUrl || `https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop`,
                  experts: expertProfiles.slice(0, Math.floor(Math.random() * 7) + 3),
                };
              }));
            }
          } catch (err) {
            console.error(`Error fetching ${cat.apiValue}:`, err);
          }
        }
      }
      
      if (allNews.length > 0) {
        setNewsArticles(allNews);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExperts = (newsId: string) => {
    setExpandedNews(prev => ({
      ...prev,
      [newsId]: !prev[newsId]
    }));
  };

  const togglePoll = (newsId: string) => {
    setExpandedPolls(prev => ({
      ...prev,
      [newsId]: !prev[newsId]
    }));
  };

  const handleVote = (newsId: string, option: string) => {
    setUserVotes(prev => ({
      ...prev,
      [newsId]: option
    }));
    setTimeout(() => {
      setExpandedPolls(prev => ({
        ...prev,
        [newsId]: false
      }));
    }, 500);
  };

  const openExpertDetail = (newsId: string, expertIndex: number) => {
    setSelectedExpert({ newsId, expertIndex });
  };

  const closeExpertDetail = () => {
    setSelectedExpert(null);
  };

  // Filter news by selected category
  const filteredNews = selectedCategory === 'הכל' 
    ? newsArticles 
    : newsArticles.filter(news => news.categoryLabel === selectedCategory || news.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Right - Channel Selector (same layout as homepage) */}
          <div className="flex items-center gap-2">
            <ChannelSelector />
          </div>
          
          {/* Center - Category Dropdown (TikTok Style) */}
          <div className="category-dropdown-dark">
            <CategoryDropdown
              categories={selectedChannel.categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
          
          {/* Left - Search, Bell & Refresh Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={refreshNews}
              disabled={isRefreshing}
              className="p-2 hover:bg-muted rounded-full transition-colors disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn("text-muted-foreground", isRefreshing && "animate-spin")}
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 hover:bg-muted rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-[1px] right-[17px] min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-2xl mx-auto p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4 animate-pulse">
              <div className="w-full aspect-[2/1] bg-muted rounded-lg mb-3" />
              <div className="h-6 bg-muted rounded mb-2 w-3/4" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </div>
          ))}
        </div>
      )}

      {/* News Feed */}
      {!loading && filteredNews.length > 0 && (
        <div className="max-w-2xl mx-auto px-4">
          {filteredNews.map((news) => (
            <NewsCard
              key={news.id}
              news={news}
              currentUser={user}
              userProfile={profile}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredNews.length === 0 && (
        <div className="max-w-2xl mx-auto p-8 text-center">
          <p className="text-muted-foreground">אין חדשות בקטגוריה {selectedCategory}</p>
          <button
            onClick={() => setSelectedCategory('הכל')}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            הצג את כל החדשות
          </button>
        </div>
      )}

      <Navigation zoozBalance={999} />
    </div>
  );
}

        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-background w-full md:max-w-2xl md:rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-3 flex justify-between items-center">
              <h3 className="font-semibold">דעת מומחה</h3>
              <button
                onClick={closeExpertDetail}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="relative w-full h-48 bg-slate-900 rounded-lg mb-3 overflow-hidden">
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
                  className="w-full h-full object-cover"
                  playsInline
                  poster="https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/50 px-2 py-1 rounded text-white text-xs">22s</div>
              </div>

              <div className="flex items-start gap-3 mb-3">
                <img
                  src={newsArticles.find(n => n.id === selectedExpert.newsId)?.experts?.[selectedExpert.expertIndex] || expertProfiles[selectedExpert.expertIndex]}
                  alt="Expert"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">
                      {expertNames[selectedExpert.expertIndex % expertNames.length]}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">לפני 1 שעות</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-3">
                    {newsArticles.find(n => n.id === selectedExpert.newsId)?.content || 'דעת המומחה על החדשות...'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4 mt-4 border-t border-border">
                <button className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center">
                    <Handshake className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="text-muted-foreground text-xs">634</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground text-xs">78</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground text-xs">12</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground text-xs">12</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navigation zoozBalance={999} />
    </div>
  );
}
