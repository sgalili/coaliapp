import { useState, useRef, useEffect } from "react";
import { X, Handshake, Crown, Eye, Share, MessageCircle, User, Shield, ShieldAlert, ShieldCheck, Volume2, VolumeX, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useZoozReactions, LiveZoozReaction } from "@/hooks/useZoozReactions";

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
  onZooz?: (commentId: string) => void;
  userBalance?: number;
  currentUserId?: string;
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
    <Handshake className="w-6 h-6 text-trust" />
    <Crown className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
  </div>
);

const ZoozIcon = ({ className = "w-6 h-6 text-zooz", isCoin = false }: { className?: string; isCoin?: boolean }) => {
  if (isCoin) {
    return (
      <div className="relative">
        <div className="w-8 h-8 rounded-full zooz-coin-3d flex items-center justify-center">
          <div className="font-black text-xl leading-none text-amber-900 drop-shadow-sm z-10 relative">Z</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative flex items-center justify-center">
      <div className={cn(
        "font-black text-xl leading-none drop-shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_hsl(var(--zooz-glow)/0.6)]", 
        className.includes('text-') ? className.split(' ').filter(c => c.startsWith('text-')).join(' ') : "text-zooz group-hover:text-zooz-glow"
      )}>Z</div>
    </div>
  );
};

export const FullscreenVideoPlayer = ({
  comments,
  initialCommentIndex,
  onClose,
  onTrust,
  onWatch,
  onComment,
  onShare,
  onZooz,
  userBalance = 0,
  currentUserId
}: FullscreenVideoPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialCommentIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [flyingZs, setFlyingZs] = useState<Array<{id: string, x: number, y: number}>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentComment = comments[currentIndex];
  const { liveReactions, addZoozReaction } = useZoozReactions(currentComment?.id || '', currentUserId);

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

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleZoozSend = async (e?: React.MouseEvent) => {
    if (userBalance < 1) {
      toast.error("Solde ZOOZ insuffisant", {
        position: "bottom-center",
        duration: 2000
      });
      return;
    }
    
    // Generate flying Z animation
    const buttonRect = (e?.currentTarget as HTMLElement)?.getBoundingClientRect();
    if (buttonRect && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = buttonRect.left - containerRect.left + buttonRect.width / 2;
      const y = buttonRect.top - containerRect.top + buttonRect.height / 2;
      
      // Create multiple flying Zs
      for (let i = 0; i < 3; i++) {
        const flyingZ = {
          id: `${Date.now()}-${i}`,
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20
        };
        
        setFlyingZs(prev => [...prev, flyingZ]);
        
        // Remove the flying Z after animation completes
        setTimeout(() => {
          setFlyingZs(prev => prev.filter(z => z.id !== flyingZ.id));
        }, 2000);
      }
    }
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && e) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      await addZoozReaction(x, y, 1);
    }
    
    if (onZooz) {
      onZooz(currentComment.id);
    }

    toast.success("1 ZOOZ envoyé! 🚀", {
      position: "bottom-center",
      duration: 1500
    });
  };

  const handleCreateContent = () => {
    toast.info("Ouverture du créateur de contenu...", {
      position: "bottom-center",
      duration: 2000
    });
  };

  const renderZoozReaction = (reaction: LiveZoozReaction) => {
    const coinCount = Math.min(reaction.amount, 3);
    const coins = [];
    
    for (let i = 0; i < coinCount; i++) {
      const animations = ['animate-zooz-coin-center', 'animate-zooz-coin-left', 'animate-zooz-coin-right'];
      const animationType = reaction.isOwn ? 'animate-zooz-coin-burst' : animations[i % animations.length];
      const delay = i * 200;
      
      coins.push(
        <div 
          key={`${reaction.animationId}-coin-${i}`}
          className="absolute pointer-events-none z-50"
          style={{ 
            animationDelay: `${delay}ms`,
            left: '50%',
            bottom: '100px',
            transform: 'translateX(-50%)'
          }}
        >
          <div className={cn(animationType)}>
            <ZoozIcon isCoin={true} />
          </div>
        </div>
      );
    }
    
    return (
      <div key={reaction.animationId} className="absolute inset-0 pointer-events-none">
        {coins}
      </div>
    );
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
          muted={isMuted}
          playsInline
        />

        {/* Live ZOOZ Reactions */}
        {liveReactions.map(renderZoozReaction)}

        {/* Flying Zs Animation */}
        {flyingZs.map(flyingZ => (
          <div
            key={flyingZ.id}
            className="absolute pointer-events-none z-50 animate-fly-up"
            style={{
              left: flyingZ.x,
              top: flyingZ.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="text-4xl font-black text-zooz drop-shadow-lg">
              Z
            </div>
          </div>
        ))}

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

        {/* Volume Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={handleVolumeToggle}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center group-active:scale-95 transition-transform">
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-white fill-white" />
              ) : (
                <Volume2 className="w-6 h-6 text-white fill-white" />
              )}
            </div>
          </button>
        </div>

        {/* Create Content Button */}
        <div className="absolute top-16 left-4">
          <button
            onClick={handleCreateContent}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center group-active:scale-95 transition-transform">
              <Plus className="w-6 h-6 text-primary" />
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-4">
          {/* ZOOZ Button */}
          {onZooz && (
            <button
              onClick={handleZoozSend}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-12 h-12 rounded-full bg-zooz/20 backdrop-blur-sm flex items-center justify-center group-active:scale-95 transition-transform relative overflow-hidden">
                <ZoozIcon />
                <div className="absolute inset-0 bg-zooz/10 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
              </div>
              <span className="text-white text-xs font-medium">
                {formatNumber(currentComment.likes)}
              </span>
            </button>
          )}

          {/* Trust Button */}
          <button
            onClick={() => onTrust(currentComment.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-full bg-trust/20 backdrop-blur-sm flex items-center justify-center group-active:scale-95 transition-transform">
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
            <div className="w-12 h-12 rounded-full bg-watch/20 backdrop-blur-sm flex items-center justify-center group-active:scale-95 transition-transform">
              <Eye className="w-6 h-6 text-watch" />
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
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-active:scale-95 transition-transform">
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
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-active:scale-95 transition-transform">
              <Share className="w-6 h-6 text-white" />
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