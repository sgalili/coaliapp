import { useState, useRef, useEffect } from "react";
import { X, Handshake, Crown, Eye, MessageCircle, Share2, User, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsComment {
  id: string;
  userId: string;
  username: string;
  userImage?: string;
  videoUrl: string;
  duration: number;
  likes: number;
  replies: number;
  trustLevel: number;
  timestamp: string;
  category: string;
  kycLevel: 1 | 2 | 3;
  watchCount?: number;
  shareCount?: number;
}

interface FullscreenVideoPlayerProps {
  comments: NewsComment[];
  initialCommentIndex: number;
  onClose: () => void;
  onTrust: (commentId: string) => void;
  onWatch: (commentId: string) => void;
  onComment: (commentId: string) => void;
  onShare: (commentId: string) => void;
}

const KYCBadge = ({ level }: { level: 1 | 2 | 3 }) => {
  const config = {
    1: { icon: Shield, color: "text-gray-400" },
    2: { icon: ShieldAlert, color: "text-blue-500" },
    3: { icon: ShieldCheck, color: "text-green-500" }
  };
  
  const { icon: IconComponent, color } = config[level];
  
  return (
    <div className={cn("absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-30")}>
      <IconComponent className={cn("w-4 h-4", color)} />
    </div>
  );
};

const TrustIcon = () => (
  <div className="relative">
    <Handshake className="w-5 h-5" />
    <Crown className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />
  </div>
);

export const FullscreenVideoPlayer = ({
  comments,
  initialCommentIndex,
  onClose,
  onTrust,
  onWatch,
  onComment,
  onShare
}: FullscreenVideoPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialCommentIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentComment = comments[currentIndex];

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0 && currentIndex < comments.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentIndex < comments.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const startY = e.touches[0].clientY;
      
      const handleTouchMove = (e: TouchEvent) => {
        const deltaY = startY - e.touches[0].clientY;
        
        if (Math.abs(deltaY) > 50) { // Minimum swipe distance
          if (deltaY > 0 && currentIndex < comments.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else if (deltaY < 0 && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
          }
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        }
      };
      
      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentIndex, comments.length]);

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Video Container */}
      <div className="relative w-full h-full max-w-md mx-auto">
        {/* Video */}
        <video
          ref={videoRef}
          src={currentComment.videoUrl}
          className="w-full h-full object-cover"
          onClick={handleVideoClick}
          loop
          muted
          playsInline
        />

        {/* Video Index Indicator */}
        <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
          {currentIndex + 1} / {comments.length}
        </div>

        {/* User Info Overlay */}
        <div className="absolute bottom-20 left-4 right-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              {currentComment.userImage ? (
                <img 
                  src={currentComment.userImage} 
                  alt={currentComment.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <KYCBadge level={currentComment.kycLevel} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white">{currentComment.username}</span>
                <span className="bg-blue-500 px-2 py-0.5 rounded-full text-xs text-white font-medium">
                  {formatNumber(currentComment.trustLevel)} Trust
                </span>
              </div>
              <p className="text-white/80 text-sm">
                Expert en {currentComment.category === 'פוליטיקה' ? 'Politique' : 
                         currentComment.category === 'טכנולוגיה' ? 'Technologie' :
                         currentComment.category === 'כלכלה' ? 'Économie' :
                         currentComment.category === 'ספורט' ? 'Sport' : 'Actualités'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-4">
          {/* Trust Button */}
          <button
            onClick={() => onTrust(currentComment.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors group-active:scale-95">
              <TrustIcon />
            </div>
            <span className="text-white text-xs font-medium">
              {formatNumber(currentComment.trustLevel)}
            </span>
          </button>

          {/* Watch Button */}
          <button
            onClick={() => onWatch(currentComment.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors group-active:scale-95">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">
              {formatNumber(currentComment.watchCount || 0)}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => onComment(currentComment.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors group-active:scale-95">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">
              {formatNumber(currentComment.replies)}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => onShare(currentComment.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors group-active:scale-95">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">
              {formatNumber(currentComment.shareCount || 0)}
            </span>
          </button>
        </div>

        {/* Navigation Hint */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/60 text-xs">
          Scroll pour voir la vidéo suivante
        </div>
      </div>
    </div>
  );
};