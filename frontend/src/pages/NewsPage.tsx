import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ChevronUp, ChevronDown, Plus, Play, ThumbsUp, MessageCircle, Eye, Share2, Handshake, Crown, X } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: 'all', label: 'הכל' },
  { id: 'politics', label: 'פוליטיקה' },
  { id: 'tech', label: 'טכנולוגיה' },
  { id: 'economy', label: 'כלכלה' },
  { id: 'sport', label: 'ספורט' },
  { id: 'culture', label: 'תרבות' },
  { id: 'trending', label: 'חם עכשיו' },
];

const placeholderNews = [
  {
    id: '1',
    headline: 'הכנסת אישרה את חוק השידור החדש - מה זה אומר על העתיד של התקשורת?',
    category: 'פוליטיקה',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop',
    experts: [
      'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
      'https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg',
      'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
      'https://trust.coali.app/assets/netanyahu-profile-C6yQFuUl.jpg',
      'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg',
      'https://trust.coali.app/assets/warren-buffett-profile-Bfn-yren.jpg',
      'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
      'https://trust.coali.app/assets/yaron-profile-DuwqrcEK.jpg',
      'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
    ],
    pollQuestion: 'מה דעתך?',
    pollOptions: [
      { label: 'תומך', value: 67, color: 'bg-primary' },
      { label: 'מתנגד', value: 20, color: 'bg-gray-400' },
      { label: 'צריך שינויים', value: 10, color: 'bg-gray-300' },
      { label: 'לא בטוח', value: 3, color: 'bg-gray-200' },
    ],
  },
  {
    id: '2',
    headline: 'פריצת דרך בטכנולוגיית הבלוקצ\'יין - סטארט-אפ ישראלי פיתח פתרון חדשני',
    category: 'טכנולוגיה',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    experts: [
      'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg',
      'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
    ],
    pollQuestion: 'מה דעתך?',
    pollOptions: [
      { label: 'מהפכני', value: 50, color: 'bg-primary' },
      { label: 'חיובי', value: 35, color: 'bg-gray-400' },
      { label: 'צריך להמתין', value: 10, color: 'bg-gray-300' },
      { label: 'לא בטוח', value: 5, color: 'bg-gray-200' },
    ],
  },
  {
    id: '3',
    headline: 'עליה חדה במחירי הדיור - מה הפתרונות האפשריים?',
    category: 'כלכלה',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
    experts: [
      'https://trust.coali.app/assets/amit-profile-CprpaaC6.jpg',
      'https://trust.coali.app/assets/rachel-profile-w3gZXC9S.jpg',
      'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
    ],
    pollQuestion: 'מה דעתך?',
    pollOptions: [
      { label: 'בנייה ממשלתית', value: 50, color: 'bg-primary' },
      { label: 'הקלות מס', value: 25, color: 'bg-gray-400' },
      { label: 'שילוב פתרונות', value: 20, color: 'bg-gray-300' },
      { label: 'לא בטוח', value: 5, color: 'bg-gray-200' },
    ],
  },
  {
    id: '4',
    headline: 'המכבי תל אביב זכתה באליפות - חגיגות ברחובות העיר',
    category: 'ספורט',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop',
    experts: [
      'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
    ],
    pollQuestion: 'היה הראשון לתת את דעתך כמומחה',
    pollOptions: [
      { label: 'מרגש מאוד', value: 40, color: 'bg-primary' },
      { label: 'משמח', value: 40, color: 'bg-gray-400' },
      { label: 'מגיע להם', value: 15, color: 'bg-gray-300' },
      { label: 'אדיש', value: 5, color: 'bg-gray-200' },
    ],
  },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedNews, setExpandedNews] = useState<{ [key: string]: boolean }>({});
  const [expandedPolls, setExpandedPolls] = useState<{ [key: string]: boolean }>({});
  const [userVotes, setUserVotes] = useState<{ [key: string]: string }>({});
  const [selectedExpert, setSelectedExpert] = useState<{ newsId: string; expertIndex: number } | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

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
    // Collapse poll after voting
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

  const expertNames = ['יעקב אליעזרוב', 'שרה כהן', 'דוד לוי', 'בנימין נתניהו', 'נועה קירל', 'וורן באפט', 'ירון זלכה', 'ירון לונדון', 'יעקב נגוסה'];
  const expertOpinions = [
    'הניתוח שלי על החדשות האלה: ההשלכות הפוליטיות חשובות לשקול...',
    'מנקודת מבט כלכלית, השינויים האלה יכולים להשפיע משמעותית...',
    'אני רואה כאן הזדמנות ייחודית לשיפור המצב...',
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Category Filters */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
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
          <div key={news.id} className="mb-4">
            {/* News Image */}
            <div className="relative">
              <img
                src={news.image}
                alt={news.headline}
                className="w-full aspect-[2/1] object-cover"
              />
            </div>

            <div className="px-4 py-4">
              {/* Headline */}
              <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">
                {news.headline}
              </h3>

              {/* Category */}
              <p className="text-sm text-muted-foreground mb-4">{news.category}</p>

              {/* Expert Opinions Section - Collapsible */}
              <div className="mb-4">
                <button
                  onClick={() => toggleExperts(news.id)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="text-sm font-medium text-foreground">דעת המומחים</span>
                  {expandedNews[news.id] ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                {/* Expert Circles - Always visible */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {news.experts.map((expert, idx) => (
                    <button
                      key={idx}
                      onClick={() => openExpertDetail(news.id, idx)}
                      className="relative flex-shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={expert}
                        alt={`Expert ${idx + 1}`}
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      />
                      {idx === 0 && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <Plus className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Expanded Expert Details - Only show when expanded */}
                {expandedNews[news.id] && (
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p>פרטי דעות המומחים יוצגו כאן...</p>
                  </div>
                )}
              </div>

              {/* Poll Section */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {/* Poll Question Button - Always visible */}
                <button
                  onClick={() => togglePoll(news.id)}
                  className="flex items-center justify-between w-full p-4 hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{news.pollQuestion}</span>
                  {expandedPolls[news.id] ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                {/* Voting Options - Shown when expanded and not voted */}
                {expandedPolls[news.id] && !userVotes[news.id] && (
                  <div className="border-t border-border/50 p-4 pt-3">
                    <div className="bg-card p-4 border border-border/50 shadow-sm rounded-lg">
                      <h3 className="text-base font-semibold mb-4 text-right text-foreground leading-relaxed">
                        מה דעתך על {news.headline.split(' - ')[0]}?
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        {news.pollOptions.map((option, idx) => (
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

                {/* Results - Always shown when collapsed or after voting */}
                {(!expandedPolls[news.id] || userVotes[news.id]) && (
                  <div className="border-t border-border/50 p-4">
                    {/* Visual Bar */}
                    <div className="flex h-2 rounded-full overflow-hidden mb-2">
                      {news.pollOptions.map((option, idx) => (
                        <div
                          key={idx}
                          className={cn(option.color)}
                          style={{ width: `${option.value}%` }}
                        />
                      ))}
                    </div>

                    {/* Results Text */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {news.pollOptions.map((option, idx) => (
                        <span key={idx}>
                          {option.value}% {option.label}
                          {idx < news.pollOptions.length - 1 && ' •'}
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

      {/* Expert Detail Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-background w-full md:max-w-2xl md:rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
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
              {/* Video Player */}
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
                <div className="absolute bottom-3 left-3 bg-black/50 px-2 py-1 rounded text-white text-xs">
                  22s
                </div>
                <button className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 px-2 py-1 rounded text-white text-xs transition-colors">
                  ⛶ מסך מלא
                </button>
              </div>

              {/* Expert Info */}
              <div className="flex items-start gap-3 mb-3">
                <div className="relative">
                  <img
                    src={placeholderNews.find(n => n.id === selectedExpert.newsId)?.experts[selectedExpert.expertIndex]}
                    alt="Expert"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">
                      {expertNames[selectedExpert.expertIndex % expertNames.length]}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">לפני 1 שעות</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-primary font-medium">634 Trust</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>78</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>12</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>נצפה</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-3">
                    {expertOpinions[selectedExpert.expertIndex % expertOpinions.length]}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-6 pt-4 mt-4 border-t border-border">
                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center transition-colors group-active:scale-95">
                    <div className="relative">
                      <Handshake className="w-5 h-5 text-foreground" />
                      <Crown className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />
                    </div>
                  </div>
                  <span className="text-muted-foreground text-xs font-medium">634</span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center transition-colors group-active:scale-95">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground text-xs font-medium">78</span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center transition-colors group-active:scale-95">
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground text-xs font-medium">12</span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center transition-colors group-active:scale-95">
                    <Share2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground text-xs font-medium">12</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation zoozBalance={999} />
    </div>
  );
}
