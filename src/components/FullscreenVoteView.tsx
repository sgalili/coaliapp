import { useState, useEffect } from "react";
import { X, ChevronUp, ChevronDown, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrganizationVoteCard, OrganizationVote } from "./OrganizationVoteCard";

interface FullscreenVoteViewProps {
  votes: OrganizationVote[];
  currentIndex: number;
  onClose: () => void;
  onVote: (voteId: string, optionId: string) => void;
  onNavigate: (direction: 'up' | 'down') => void;
}

export const FullscreenVoteView = ({
  votes,
  currentIndex,
  onClose,
  onVote,
  onNavigate
}: FullscreenVoteViewProps) => {
  const [showHeader, setShowHeader] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentVote = votes[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === votes.length - 1;

  // Auto-hide header after 3 seconds
  useEffect(() => {
    if (showHeader) {
      const timer = setTimeout(() => setShowHeader(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showHeader]);

  // Handle swipe gestures
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > minSwipeDistance;
    const isSwipeDown = distance < -minSwipeDistance;

    // Swipe down from top 20% shows header
    if (isSwipeDown && touchStart < window.innerHeight * 0.2) {
      setShowHeader(true);
      return;
    }

    // Navigate between cards
    if (isSwipeUp && !isLast) {
      onNavigate('up');
    } else if (isSwipeDown && !isFirst) {
      onNavigate('down');
    }
  };

  // Get dynamic background based on organization type
  const getBackgroundGradient = () => {
    switch (currentVote?.organizationType) {
      case 'community':
        return 'from-blue-900/90 via-blue-800/85 to-blue-900/90';
      case 'school':
        return 'from-green-900/90 via-green-800/85 to-green-900/90';
      case 'foundation':
        return 'from-purple-900/90 via-purple-800/85 to-purple-900/90';
      default:
        return 'from-gray-900/90 via-gray-800/85 to-gray-900/90';
    }
  };

  if (!currentVote) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-gradient-to-br transition-all duration-500",
        getBackgroundGradient()
      )}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:60px_60px]" />
      </div>

      {/* Header - Slides down when visible */}
      <div className={cn(
        "absolute top-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-md transition-transform duration-300",
        showHeader ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="flex items-center justify-between p-4 pb-20">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
            <span className="text-sm">חזרה</span>
          </button>
          
          <div className="text-center text-white">
            <p className="text-sm opacity-80">
              {currentIndex + 1} מתוך {votes.length}
            </p>
          </div>

          <button
            onClick={() => {/* TODO: Implement share */}}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm">שתף</span>
          </button>
        </div>
      </div>

      {/* Navigation Hints */}
      {!isFirst && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronUp className="w-6 h-6" />
        </div>
      )}
      
      {!isLast && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pb-20 px-4">
        <div className="w-full max-w-lg">
          <OrganizationVoteCard
            vote={currentVote}
            onVote={onVote}
            isFullscreen={true}
          />
        </div>
      </div>

      {/* Tap Hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/50 text-xs text-center">
        <p>הקש בכל מקום מחוץ לכפתורי הצבעה לחזרה למצב רגיל</p>
      </div>
    </div>
  );
};