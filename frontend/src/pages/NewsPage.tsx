import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ChannelSelector } from "@/components/ChannelSelector";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { ChevronUp, ChevronDown, Plus, Play, ThumbsUp, MessageCircle, Eye, Share2, Handshake, Crown, X, CheckCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChannel } from "@/contexts/ChannelContext";

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
      { id: "1", label: "תומך", value: 67 },
      { id: "2", label: "מתנגד", value: 20 },
      { id: "3", label: "צריך שינויים", value: 10 },
      { id: "4", label: "לא בטוח", value: 3 },
    ],
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
      { id: "1", label: "תומך", value: 45 },
      { id: "2", label: "מתנגד", value: 35 },
      { id: "3", label: "צריך שינויים", value: 15 },
      { id: "4", label: "לא בטוח", value: 5 },
    ],
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
      { id: "1", label: "בנייה ממשלתית", value: 50 },
      { id: "2", label: "הקלות מס", value: 25 },
      { id: "3", label: "שילוב פתרונות", value: 20 },
      { id: "4", label: "לא בטוח", value: 5 },
    ],
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
      { id: "1", label: "מעניין", value: 60 },
      { id: "2", label: "חשוב", value: 30 },
      { id: "3", label: "אחר", value: 10 },
    ],
  },
];

export default function NewsPage() {
  const { selectedChannel } = useChannel();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsArticles, setNewsArticles] = useState<any[]>(placeholderNewsData);
  const [loading, setLoading] = useState(false);
  const [expandedNews, setExpandedNews] = useState<{ [key: string]: boolean }>({});
  const [expandedPolls, setExpandedPolls] = useState<{ [key: string]: boolean }>({});
  const [userVotes, setUserVotes] = useState<{ [key: string]: string }>({});
  const [selectedExpert, setSelectedExpert] = useState<{ newsId: string; expertIndex: number } | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  // Reset category when channel changes
  useEffect(() => {
    setSelectedCategory('הכל');
  }, [selectedChannel.id]);

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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">אימפקט</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <ChannelSelector />
          </div>
        </div>
        
        {/* TikTok-Style Category Dropdown */}
        <div className="px-4 pb-3 flex justify-center">
          <CategoryDropdown
            categories={selectedChannel.categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
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
      {!loading && newsArticles.length > 0 && (
        <div className="max-w-2xl mx-auto">
          {newsArticles.map((news) => (
            <div key={news.id} className="mb-4">
              <img
                src={news.image}
                alt={news.title}
                className="w-full aspect-[2/1] object-cover"
              />

              <div className="px-4 py-4">
                <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">
                  {news.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4">{news.categoryLabel || news.category}</p>

                {/* Expert Comments Section - Expandable Accordion */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleExperts(news.id)}
                    className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">תגובות מומחים ({news.experts?.length || 0})</span>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-200",
                        expandedNews[news.id] && "rotate-180"
                      )} />
                    </div>

                    {/* Expert Avatars - Only when collapsed */}
                    {!expandedNews[news.id] && (
                      <div className="flex -space-x-2">
                        {news.experts?.slice(0, 3).map((expert: string, idx: number) => (
                          <img
                            key={idx}
                            src={expert}
                            alt={`Expert ${idx + 1}`}
                            className="w-8 h-8 rounded-full border-2 border-white object-cover"
                          />
                        ))}
                        {news.experts && news.experts.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs font-medium">
                            +{news.experts.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </button>

                  {/* Expanded Expert Comments */}
                  {expandedNews[news.id] && (
                    <div className="mt-2 space-y-2">
                      {news.experts?.slice(0, 3).map((expert: string, idx: number) => (
                        <div key={idx} className="p-4 bg-card rounded-lg border border-border">
                          <div className="flex items-start gap-3 mb-2">
                            <img
                              src={expert}
                              alt={expertNames[idx]}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{expertNames[idx % expertNames.length]}</span>
                                <CheckCircle className="w-4 h-4 text-trust" />
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">
                                {(Math.random() * 10000).toFixed(0)} Trust • לפני {Math.floor(Math.random() * 24) + 1} שעות
                              </div>
                              <p className="text-sm text-foreground leading-relaxed mb-3">
                                {idx === 0 ? news.content : 
                                 idx === 1 ? 'מסכים עם הניתוח, אבל חשוב לקחת בחשבון גם השלכות נוספות.' :
                                 'נקודה חשובה שלא הוזכרה - ההשפעה על המגזר הציבורי תהיה משמעותית.'}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{Math.floor(Math.random() * 300) + 50}</span>
                                </button>
                                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                  <MessageCircle className="w-3 h-3" />
                                  <span>{Math.floor(Math.random() * 50) + 5}</span>
                                </button>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>נצפה</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Poll Section */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => togglePoll(news.id)}
                    className="flex items-center justify-between w-full p-4 hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">מה דעתך?</span>
                    {expandedPolls[news.id] ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  {expandedPolls[news.id] && !userVotes[news.id] && (
                    <div className="border-t border-border/50 p-4 pt-3">
                      <div className="bg-card p-4 border border-border/50 shadow-sm rounded-lg">
                        <h3 className="text-base font-semibold mb-4 text-right text-foreground leading-relaxed">
                          מה דעתך על {news.title}?
                        </h3>
                        
                        <div className="space-y-2 mb-4">
                          {news.poll_options?.map((option: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => handleVote(news.id, option.label)}
                              className="w-full h-12 text-right justify-start px-4 border-2 border-blue-200 bg-blue-50/20 hover:bg-blue-100/60 hover:border-blue-300 text-blue-800 hover:text-blue-900 transition-all duration-200 rounded-md font-medium"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        
                        <div className="text-xs text-blue-600/70 text-center pt-3 border-t border-blue-100/60">
                          הצבעה פתוחה למשתמשים מאומתים בלבד
                        </div>
                      </div>
                    </div>
                  )}

                  {(!expandedPolls[news.id] || userVotes[news.id]) && (
                    <div className="border-t border-border/50 p-4">
                      <div className="flex h-2 rounded-full overflow-hidden mb-2">
                        {news.poll_options?.map((option: any, idx: number) => (
                          <div
                            key={idx}
                            className={cn(
                              idx === 0 ? 'bg-primary' : 
                              idx === 1 ? 'bg-gray-400' :
                              idx === 2 ? 'bg-gray-300' : 'bg-gray-200'
                            )}
                            style={{ width: `${option.value || 25}%` }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        {news.poll_options?.map((option: any, idx: number) => (
                          <span key={idx}>
                            {option.value || 25}% {option.label}
                            {idx < (news.poll_options?.length || 0) - 1 && ' •'}
                          </span>
                        ))}
                      </div>
                      
                      {userVotes[news.id] && (
                        <div className="mt-2 text-xs text-trust font-medium">
                          ✓ הצבעת: {userVotes[news.id]}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && newsArticles.length === 0 && (
        <div className="max-w-2xl mx-auto p-8 text-center">
          <p className="text-muted-foreground">אין חדשות להצגה</p>
        </div>
      )}

      {/* Expert Detail Modal */}
      {selectedExpert && (
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
