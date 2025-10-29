import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
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
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=300&h=200&fit=crop',
    experts: [
      'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
      'https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg',
      'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
      'https://trust.coali.app/assets/netanyahu-profile-C6yQFuUl.jpg',
      'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg',
    ],
    pollResults: [{ label: 'תומך', value: 67 }, { label: 'מתנגד', value: 33 }],
  },
  {
    id: '2',
    headline: 'פריצת דרך בטכנולוגיית הבלוקצ\'יין - סטארט-אפ ישראלי פיתח פתרון חדשני',
    category: 'טכנולוגיה',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop',
    experts: [
      'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg',
      'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
    ],
    pollResults: [{ label: 'מהפכני', value: 50 }, { label: 'חיובי', value: 50 }],
  },
  {
    id: '3',
    headline: 'עליה חדה במחירי הדיור - מה הפתרונות האפשריים?',
    category: 'כלכלה',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop',
    experts: [
      'https://trust.coali.app/assets/amit-profile-CprpaaC6.jpg',
      'https://trust.coali.app/assets/rachel-profile-w3gZXC9S.jpg',
      'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
    ],
    pollResults: [{ label: 'בנייה ממשלתית', value: 50 }, { label: 'הקלות מס', value: 25 }],
  },
  {
    id: '4',
    headline: 'המכבי תל אביב זכתה באליפות - חגיגות ברחובות העיר',
    category: 'ספורט',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop',
    experts: [
      'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
    ],
    pollResults: [{ label: 'מרגש מאוד', value: 40 }, { label: 'משמח', value: 40 }],
  },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Category Filters */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex gap-2 overflow-x-auto">
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
          <div key={news.id} className="p-4 border-b border-border">
            {/* News Image */}
            <img
              src={news.image}
              alt={news.headline}
              className="w-full aspect-video object-cover rounded-lg mb-3"
            />

            {/* Headline */}
            <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">
              {news.headline}
            </h3>

            {/* Category */}
            <p className="text-sm text-muted-foreground mb-3">{news.category}</p>

            {/* Expert Opinions Section */}
            <div className="mb-3">
              <p className="text-sm font-medium text-foreground mb-2">דעת המומחים</p>
              <div className="flex items-center gap-2">
                {news.experts.map((expert, idx) => (
                  <img
                    key={idx}
                    src={expert}
                    alt="Expert"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
            </div>

            {/* Poll Question */}
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm font-medium text-foreground mb-2">מה דעתך?</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {news.pollResults.map((result, idx) => (
                  <span key={idx}>{result.value}% {result.label}</span>
                ))}
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
