import { useState, useEffect } from "react";
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
];

export default function Index() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  const currentExpert = placeholderExperts[currentIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe up
      if (currentIndex < placeholderExperts.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }

    if (touchStart - touchEnd < -75) {
      // Swipe down
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && currentIndex < placeholderExperts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div 
      className="h-screen w-full bg-black overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Expert Card */}
      <div className="h-full w-full relative flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={currentExpert.image}
            alt={currentExpert.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Crect fill="%23374151" width="400" height="600"/%3E%3C/svg%3E';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />
        </div>

        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={currentExpert.image}
                alt={currentExpert.name}
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%239ca3af" width="48" height="48" rx="24"/%3E%3C/svg%3E';
                }}
              />
              <div>
                <h2 className="text-white font-bold text-lg">{currentExpert.name}</h2>
                <p className="text-white/80 text-sm">{currentExpert.expertise}</p>
              </div>
            </div>
            {currentExpert.isLive && (
              <div className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute left-4 bottom-32 flex flex-col gap-6 z-10">
          {currentExpert.voteCount && (
            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-vote/90 backdrop-blur-sm flex items-center justify-center">
                <img src="https://trust.coali.app/vote.png" alt="Vote" className="w-6 h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              <span className="text-white text-xs font-bold">{currentExpert.voteCount}</span>
            </button>
          )}

          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-zooz text-xl font-bold">Z</span>
            </div>
            <span className="text-white text-xs font-bold">{currentExpert.zooz}</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Heart className="w-6 h-6 text-trust" />
            </div>
            <span className="text-white text-xs font-bold">{currentExpert.trust}</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Eye className="w-6 h-6 text-watch" />
            </div>
            <span className="text-white text-xs font-bold">{currentExpert.watch}</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-bold">{currentExpert.comments}</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
          </button>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-24 right-4 left-20 z-10">
          <p className="text-white text-base mb-3 leading-relaxed">
            {currentExpert.content}
          </p>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            {currentExpert.isAuthentic && (
              <>
                <CheckCircle className="w-4 h-4 text-trust" />
                <span>אותנטי</span>
                <span>|</span>
              </>
            )}
            <MapPin className="w-4 h-4" />
            <span>{currentExpert.location}</span>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-20 flex gap-1 z-10">
          {placeholderExperts.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1 rounded-full transition-all",
                idx === currentIndex
                  ? "w-6 bg-white"
                  : "w-1 bg-white/50"
              )}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={250} />
    </div>
  );
}
