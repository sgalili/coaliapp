import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";
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
      { label: 'מתנגד', value: 33, color: 'bg-gray-300' },
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
      { label: 'חיובי', value: 50, color: 'bg-gray-300' },
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
      { label: 'הקלות מס', value: 25, color: 'bg-gray-300' },
      { label: 'אחר', value: 25, color: 'bg-gray-200' },
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
      { label: 'משמח', value: 40, color: 'bg-gray-300' },
      { label: 'אחר', value: 20, color: 'bg-gray-200' },
    ],
  },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedNews, setExpandedNews] = useState<{ [key: string]: boolean }>({});
  const [expandedPolls, setExpandedPolls] = useState<{ [key: string]: boolean }>({});
  const [userVotes, setUserVotes] = useState<{ [key: string]: string }>({});

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
                    <div key={idx} className="relative flex-shrink-0">
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
                    </div>
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
              <div className="bg-muted/50 rounded-lg p-4">
                {/* Poll Question with Dropdown */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">{news.pollQuestion}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>

                {/* Voting Bar */}
                <div className="space-y-2">
                  {/* Visual Bar */}
                  <div className="flex h-2 rounded-full overflow-hidden">
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={999} />
    </div>
  );
}
