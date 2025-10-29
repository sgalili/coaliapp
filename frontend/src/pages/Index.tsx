import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Heart, Eye, MessageCircle, Share2, MapPin, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const placeholderExperts = [
  {
    id: '1',
    name: 'בנימין נתניהו',
    expertise: 'מנהיגות ופוליטיקה',
    content: 'עמדתי לגבי הרפורמה המשפטית ומה שצריך להיעשות עכשיו',
    location: 'ירושלים, ישראל',
    isAuthentic: true,
    isLive: true,
    voteCount: '1.2K',
    zooz: '89K',
    trust: '234.6K',
    watch: '1.2M',
    comments: '23.5K',
    image: 'https://trust.coali.app/assets/netanyahu-profile-C6yQFuUl.jpg',
  },
  {
    id: '2',
    name: 'ירון זליכה',
    expertise: 'כלכלה אקדמית',
    content: 'ניתוח כלכלי מעמיק של המצב הנוכחי ודרכי הפתרון',
    location: 'ירושלים, ישראל',
    isAuthentic: true,
    isLive: false,
    voteCount: '892',
    zooz: '67.2K',
    trust: '156.8K',
    watch: '890K',
    comments: '18.9K',
    image: 'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
  },
  {
    id: '3',
    name: 'יעקב אליעזרוב',
    expertise: 'תכשיטים ועסקים',
    content: 'תודה לה\' על הברכות בעסק התכשיטים והיהלומים',
    location: 'תל אביב, ישראל',
    isAuthentic: true,
    isLive: false,
    voteCount: '',
    zooz: '15.4K',
    trust: '45.7K',
    watch: '230K',
    comments: '4.6K',
    image: 'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
  },
  {
    id: '4',
    name: 'Warren Buffett',
    expertise: 'השקעות ופיננסים',
    content: 'Best investment advice ever - lessons for long-term wealth building',
    location: 'Omaha, USA',
    isAuthentic: true,
    isLive: false,
    voteCount: '',
    zooz: '123.5K',
    trust: '567.9K',
    watch: '2.1M',
    comments: '45.7K',
    image: 'https://trust.coali.app/assets/warren-buffett-profile-Bfn-yren.jpg',
  },
  {
    id: '5',
    name: 'ד״ר מאיה רוזמן',
    expertise: 'דיאטה ותזונה',
    content: 'משרד החקלאות - למה חשוב לשלב ירקות בכל ארוחה',
    location: 'חיפה, ישראל',
    isAuthentic: true,
    isLive: false,
    voteCount: '',
    zooz: '18.9K',
    trust: '67.2K',
    watch: '320K',
    comments: '6.8K',
    image: 'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg',
  },
  {
    id: '6',
    name: 'דוד ישראלי',
    expertise: 'אסטרטגיה וביטחון',
    content: 'ניתוח המצב הביטחוני והמלצות לדרך פעולה',
    location: 'תל אביב, ישראל',
    isAuthentic: true,
    isLive: false,
    voteCount: '',
    zooz: '45.2K',
    trust: '198.3K',
    watch: '650K',
    comments: '12.1K',
    image: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
  },
  {
    id: '7',
    name: 'רחל אברהם',
    expertise: 'כלכלה ופיננסים',
    content: 'השקעות חכמות בשוק ההון הישראלי',
    location: 'ירושלים, ישראל',
    isAuthentic: true,
    isLive: true,
    voteCount: '567',
    zooz: '92.4K',
    trust: '412.7K',
    watch: '1.8M',
    comments: '28.3K',
    image: 'https://trust.coali.app/assets/rachel-profile-w3gZXC9S.jpg',
  },
  {
    id: '8',
    name: 'נועה קירל',
    expertise: 'מוזיקה ותרבות',
    content: 'הופעה חיה מיוחדת - שירים חדשים והפתעות',
    location: 'תל אביב, ישראל',
    isAuthentic: true,
    isLive: false,
    voteCount: '',
    zooz: '156.8K',
    trust: '892.5K',
    watch: '3.4M',
    comments: '67.9K',
    image: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg',
  },
];

export default function Index() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < placeholderExperts.length) {
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex]);

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {placeholderExperts.map((expert, index) => (
        <div 
          key={expert.id}
          className="h-screen w-full relative flex items-center justify-center snap-start snap-always"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src={expert.image}
              alt={expert.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Crect fill="%23374151" width="400" height="600"/%3E%3C/svg%3E';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />
          </div>

          {/* Right Side Actions */}
          <div className="absolute left-4 bottom-32 flex flex-col gap-5 z-10">
            {expert.voteCount && (
              <button className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-vote/90 backdrop-blur-sm flex items-center justify-center">
                  <img src="https://trust.coali.app/vote.png" alt="Vote" className="w-6 h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
                <span className="text-white text-xs font-bold">{expert.voteCount}</span>
              </button>
            )}

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-zooz text-xl font-bold">Z</span>
              </div>
              <span className="text-white text-xs font-bold">{expert.zooz}</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Heart className="w-6 h-6 text-trust" />
              </div>
              <span className="text-white text-xs font-bold">{expert.trust}</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Eye className="w-6 h-6 text-watch" />
              </div>
              <span className="text-white text-xs font-bold">{expert.watch}</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs font-bold">{expert.comments}</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
            </button>
          </div>

          {/* Bottom Left - Profile Info Above Content */}
          <div className="absolute bottom-24 right-4 left-20 z-10">
            {/* Profile Circle, Name, and Expertise */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <img 
                  src={expert.image}
                  alt={expert.name}
                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%239ca3af" width="48" height="48" rx="24"/%3E%3C/svg%3E';
                  }}
                />
                {expert.isLive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                    LIVE
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-white font-bold text-base leading-tight">{expert.name}</h2>
                <p className="text-white/80 text-xs">{expert.expertise}</p>
              </div>
            </div>

            {/* Content */}
            <p className="text-white text-base mb-3 leading-relaxed">
              {expert.content}
            </p>

            {/* Location and Authenticity */}
            <div className="flex items-center gap-2 text-white/90 text-sm">
              {expert.isAuthentic && (
                <>
                  <CheckCircle className="w-4 h-4 text-trust" />
                  <span>אותנטי</span>
                  <span>|</span>
                </>
              )}
              <MapPin className="w-4 h-4" />
              <span>{expert.location}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation */}
      <Navigation zoozBalance={250} />
    </div>
  );
}
