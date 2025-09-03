import { useState, useEffect } from "react";
import { VideoFeed, VideoPost } from "@/components/VideoFeed";
import { VoteFilters, VoteFilterType } from "@/components/VoteFilters";

interface VideoFeedPageProps {
  activeFilter: VoteFilterType;
  onFilterChange: (filter: VoteFilterType) => void;
  onTrust: (postId: string) => void;
  onWatch: (postId: string) => void;
  onZooz: (postId: string) => void;
  userBalance: number;
  currentUserId?: string;
  isMuted: boolean;
  onVolumeToggle: () => void;
}

// Mock data for candidates and experts videos
const mockCandidateVideos: VideoPost[] = [
  {
    id: "cand-1",
    username: "בנימין נתניהו",
    handle: "@netanyahu",
    profileImage: "/src/assets/netanyahu-profile.jpg",
    videoUrl: "/videos/netanyahu-debate.mp4",
    caption: "עמדתי לגבי הרפורמה המשפטית ומה שצריך להיעשות עכשיו",
    trustCount: 234567,
    watchCount: 1200000,
    commentCount: 45678,
    shareCount: 23456,
    zoozCount: 89012,
    isVerified: true,
    kycLevel: 3,
    expertise: "מנהיגות ופוליטיקה",
    category: "politics",
    isLive: true,
    authenticityData: {
      city: "ירושלים",
      country: "ישראל", 
      localTime: "14:30",
      isAuthentic: true
    }
  },
  {
    id: "cand-2", 
    username: "יאיר לפיד",
    handle: "@yairlapid",
    profileImage: "/src/assets/yaakov-profile.jpg",
    videoUrl: "/videos/netanyahu-debate.mp4",
    caption: "הדרך שלנו לשינוי - מה צריך לעשות אחרת",
    trustCount: 156789,
    watchCount: 890000,
    commentCount: 34567,
    shareCount: 18901,
    zoozCount: 67234,
    isVerified: true,
    kycLevel: 3,
    expertise: "כלכלה ופיננסים",
    category: "politics",
    authenticityData: {
      city: "תל אביב",
      country: "ישראל",
      localTime: "14:30", 
      isAuthentic: true
    }
  }
];

const mockExpertVideos: VideoPost[] = [
  {
    id: "exp-1",
    username: "פרופ' יאיר זלקה",
    handle: "@yaronzelekha", 
    profileImage: "/src/assets/yaron-zelekha-profile.jpg",
    videoUrl: "/videos/netanyahu-debate.mp4",
    caption: "ניתוח כלכלי של המצב הנוכחי והשלכותיו על העתיד",
    trustCount: 89012,
    watchCount: 450000,
    commentCount: 12345,
    shareCount: 8901,
    zoozCount: 23456,
    isVerified: true,
    kycLevel: 2,
    expertise: "כלכלה אקדמית",
    category: "economy",
    authenticityData: {
      city: "ירושלים",
      country: "ישראל",
      localTime: "14:30",
      isAuthentic: true
    }
  },
  {
    id: "exp-2",
    username: "ד״ר מאיה רוזן",
    handle: "@mayarosen",
    profileImage: "/src/assets/maya-profile.jpg", 
    videoUrl: "/videos/netanyahu-debate.mp4",
    caption: "השפעת הטכנולוגיה על החברה הישראלית - מבט מעמיק",
    trustCount: 67234,
    watchCount: 320000,
    commentCount: 9876,
    shareCount: 6789,
    zoozCount: 18901,
    isVerified: true,
    kycLevel: 2,
    expertise: "טכנולוגיה וחברה",
    category: "technology",
    authenticityData: {
      city: "חיפה",
      country: "ישראל",
      localTime: "14:30",
      isAuthentic: true
    }
  }
];

export const VideoFeedPage = ({ 
  activeFilter, 
  onFilterChange, 
  onTrust, 
  onWatch, 
  onZooz, 
  userBalance,
  currentUserId,
  isMuted,
  onVolumeToggle 
}: VideoFeedPageProps) => {
  const [touchStartX, setTouchStartX] = useState<number>(0);

  // Get appropriate videos based on filter
  const getVideos = (): VideoPost[] => {
    if (activeFilter === 'candidates') {
      return mockCandidateVideos;
    }
    if (activeFilter === 'experts') {
      return mockExpertVideos;
    }
    return [...mockCandidateVideos, ...mockExpertVideos];
  };

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    const threshold = 100;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // Swipe right - go to previous filter
        if (activeFilter === 'experts') {
          onFilterChange('candidates');
        } else if (activeFilter === 'candidates') {
          onFilterChange('for-me');
        }
      } else {
        // Swipe left - go to next filter  
        if (activeFilter === 'candidates') {
          onFilterChange('experts');
        } else if (activeFilter === 'all') {
          onFilterChange('candidates');
        }
      }
    }
  };

  useEffect(() => {
    const element = document.documentElement;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStartX, activeFilter]);

  return (
    <div className="relative min-h-screen">
      {/* Floating Filters */}
      <div className="fixed top-20 left-0 right-0 z-40 px-4">
        <VoteFilters 
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>

      {/* Video Feed */}
      <VideoFeed
        posts={getVideos()}
        onTrust={onTrust}
        onWatch={onWatch}
        onZooz={onZooz}
        userBalance={userBalance}
        currentUserId={currentUserId}
        isMuted={isMuted}
        onVolumeToggle={onVolumeToggle}
      />
    </div>
  );
};