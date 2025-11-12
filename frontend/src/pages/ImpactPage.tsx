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

export default function ImpactPage() {
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
    
    // Load news with latest votes from database
    loadNewsWithVotes();
  }, []);

  const initializePlaceholderVotes = () => {
    // Check if we have saved votes in localStorage
    const savedVotes = localStorage.getItem('impact_news_votes');
    if (savedVotes) {
      try {
        const votesData = JSON.parse(savedVotes);
        // Update placeholder news with saved votes
        const updatedNews = placeholderNewsData.map(news => {
          if (votesData[news.id]) {
            return {
              ...news,
              poll_options: votesData[news.id].poll_options,
              total_votes: votesData[news.id].total_votes
            };
          }
          return news;
        });
        setNewsArticles(updatedNews);
      } catch (e) {
        console.error('Error loading saved votes:', e);
      }
    }
  };

  // Fetch news when channel changes
  // useEffect(() => {
  //   fetchRealNews();
  // }, [selectedChannel.id]);

  const refreshNews = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const BACKEND_URL = '/api';
      
      if (selectedCategory !== 'הכל') {
        // Find the API value for selected category
        const cat = categories.find(c => c.label === selectedCategory);
        if (cat?.apiValue) {
          const url = `${BACKEND_URL}/news/by-category/${cat.apiValue}?max_results=5`;
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
      const BACKEND_URL = '/api';
      const allNews: any[] = [];
      
      // Fetch from all categories
      for (const cat of categories) {
        if (cat.apiValue) {
          try {
            const url = `${BACKEND_URL}/news/by-category/${cat.apiValue}?max_results=5`;
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

  // Filter news by selected category
  const filteredNews = selectedCategory === 'הכל' 
    ? newsArticles 
    : newsArticles.filter(news => news.categoryLabel === selectedCategory || news.category === selectedCategory);

  console.log('📰 ImpactPage render - newsArticles:', newsArticles.length);
  console.log('📰 filteredNews:', filteredNews.length);
  console.log('📰 loading:', loading);
  console.log('📰 selectedCategory:', selectedCategory);

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

      {/* Loading State */}
      {loading && (
        <div className="max-w-2xl mx-auto p-8 text-center">
          <p className="text-lg">טוען חדשות...</p>
        </div>
      )}

      {/* News Feed */}
      {!loading && filteredNews.length > 0 && (
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-4">מציג {filteredNews.length} חדשות</p>
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
