import { useState, useRef, useEffect } from "react";
import { Handshake, Crown, Eye, Share, User, Shield, ShieldAlert, ShieldCheck, Volume2, VolumeX, Vote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useZoozReactions, LiveZoozReaction } from "@/hooks/useZoozReactions";
import { AnimatedStatBadge } from "./AnimatedStatBadge";
import { TrustIconFillable, WatchIconFillable } from "./FillableIcons";
export interface VideoPost {
  id: string;
  username: string;
  handle: string;
  profileImage?: string;
  videoUrl: string;
  caption: string;
  trustCount: number;
  watchCount: number;
  commentCount: number;
  shareCount: number;
  zoozCount: number;
  isVerified?: boolean;
  kycLevel: 1 | 2 | 3;
  expertise: string;
  category: 'politics' | 'technology' | 'education' | 'academia' | 'startup' | 'art' | 'expert' | 'influencer' | 'economy' | 'jewelry';
  isLive?: boolean;
  authenticityData?: {
    city?: string;
    country?: string;
    localTime: string;
    isAuthentic: boolean;
  };
  // Vote-related properties
  isVotable?: boolean;
  ministryPosition?: string;
  voteCount?: number;
  // User interaction states
  hasUserVoted?: boolean;
  hasUserTrusted?: boolean;
  hasUserWatched?: boolean;
  userZoozSent?: number;
}
interface VideoFeedProps {
  posts: VideoPost[];
  onTrust: (postId: string, post: VideoPost, isGivingTrust: boolean) => void;
  onWatch: (postId: string, isWatching?: boolean) => void;
  onZooz: (postId: string) => void;
  onVote: (postId: string, ministryPosition: string) => void;
  userBalance: number;
  currentUserId?: string;
  isMuted: boolean;
  onVolumeToggle: () => void;
}
const TrustIcon = () => {
  return <div className="relative">
      <Handshake className="w-6 h-6 text-trust" />
      <Crown className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1" />
    </div>;
};
const ExpertiseBadge = ({
  expertise,
  category
}: {
  expertise: string;
  category: string;
}) => {
  const categoryConfig = {
    politics: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/30"
    },
    technology: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/30"
    },
    education: {
      bg: "bg-green-500/20",
      text: "text-green-400",
      border: "border-green-500/30"
    },
    academia: {
      bg: "bg-purple-500/20",
      text: "text-purple-400",
      border: "border-purple-500/30"
    },
    startup: {
      bg: "bg-orange-500/20",
      text: "text-orange-400",
      border: "border-orange-500/30"
    },
    art: {
      bg: "bg-pink-500/20",
      text: "text-pink-400",
      border: "border-pink-500/30"
    },
    jewelry: {
      bg: "bg-fuchsia-500/20",
      text: "text-fuchsia-400",
      border: "border-fuchsia-500/30"
    },
    expert: {
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/30"
    },
    influencer: {
      bg: "bg-cyan-500/20",
      text: "text-cyan-400",
      border: "border-cyan-500/30"
    },
    economy: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      border: "border-emerald-500/30"
    }
  };
  const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.expert;
  return <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm", config.bg, config.text, config.border)}>
      {expertise}
    </span>;
};
const KYCBadge = ({
  level
}: {
  level: 1 | 2 | 3;
}) => {
  const config = {
    1: {
      icon: Shield,
      color: "text-gray-400"
    },
    2: {
      icon: ShieldAlert,
      color: "text-blue-500"
    },
    3: {
      icon: ShieldCheck,
      color: "text-green-500"
    }
  };
  const {
    icon: IconComponent,
    color
  } = config[level];
  return <div className={cn("absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-30")}>
      <IconComponent className={cn("w-4 h-4", color)} />
    </div>;
};
const VoteIcon = () => {
  return (
    <img 
      src="/vote.png" 
      alt="Vote" 
      className="w-6 h-6 brightness-0 invert"
    />
  );
};

const ZoozIcon = ({
  className = "w-6 h-6 text-zooz",
  isCoin = false
}: {
  className?: string;
  isCoin?: boolean;
}) => {
  if (isCoin) {
    return (
      <div className="relative">
        <div className="w-8 h-8 rounded-full zooz-coin-3d flex items-center justify-center">
          <div className="font-black text-xl leading-none text-amber-900 drop-shadow-sm z-10 relative">Z</div>
        </div>
      </div>
    );
  }
  
  return <div className="relative flex items-center justify-center">
      <div className={cn(
        "font-black text-xl leading-none drop-shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_hsl(var(--zooz-glow)/0.6)]", 
        className.includes('text-') ? className.split(' ').filter(c => c.startsWith('text-')).join(' ') : "text-zooz group-hover:text-zooz-glow"
      )}>Z</div>
    </div>;
};
const LiveBadge = () => {
  return <div className="absolute top-16 right-4 z-10">
      <div className="bg-red-500 text-white py-1 rounded text-xs font-bold animate-pulse shadow-lg px-[10px]">
        LIVE
      </div>
    </div>;
};
const VideoCard = ({
  post,
  onTrust,
  onWatch,
  onZooz,
  onVote,
  userBalance,
  currentUserId,
  isMuted,
  onVolumeToggle
}: {
  post: VideoPost;
  onTrust: (id: string, post: VideoPost, isGivingTrust: boolean) => void;
  onWatch: (id: string, isWatching?: boolean) => void;
  onZooz: (id: string) => void;
  onVote: (id: string, ministryPosition: string) => void;
  userBalance: number;
  currentUserId?: string;
  isMuted: boolean;
  onVolumeToggle: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [lastClick, setLastClick] = useState(0);
  const [isAuthenticityExpanded, setIsAuthenticityExpanded] = useState(false);
  const navigate = useNavigate();
  const {
    liveReactions,
    addZoozReaction
  } = useZoozReactions(post.id, currentUserId);
  
  // Only show authenticity info if real metadata exists in video file
  const hasAuthenticityData = post.authenticityData?.isAuthentic === true;
  const authenticityLocation = hasAuthenticityData 
    ? `✓ אותנטי | 📍 ${post.authenticityData.city}, ${post.authenticityData.country}`
    : null;
  const authenticityDateTime = hasAuthenticityData ? post.authenticityData?.localTime : null;
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }, {
      threshold: 0.5
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Synchronize video muted attribute with global state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);
  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Single click - toggle play/pause immediately
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVolumeToggle();
  };
  const handleZoozSend = async (e?: React.MouseEvent) => {
    if (userBalance < 1) {
      toast.error("Solde ZOOZ insuffisant", {
        position: "bottom-center",
        duration: 2000
      });
      return;
    }
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && e) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      await addZoozReaction(x, y, 1);
    }
    onZooz(post.id);

    // Bottom toast only - no top popup
    toast.success("1 ZOOZ envoyé! 🚀", {
      position: "bottom-center",
      duration: 1500
    });
  };
  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };
  const renderZoozReaction = (reaction: LiveZoozReaction) => {
    // Generate multiple flying coins for each reaction
    const coinCount = Math.min(reaction.amount, 3); // Max 3 coins per reaction for better visibility
    const coins = [];
    
    for (let i = 0; i < coinCount; i++) {
      // Random animation type for variety
      const animations = ['animate-zooz-coin-center', 'animate-zooz-coin-left', 'animate-zooz-coin-right'];
      const animationType = reaction.isOwn ? 'animate-zooz-coin-burst' : animations[i % animations.length];
      
      // Random delay for staggered effect
      const delay = i * 200; // 200ms delay between coins
      
      coins.push(
        <div 
          key={`${reaction.animationId}-coin-${i}`}
          className="absolute pointer-events-none z-50"
          style={{ 
            animationDelay: `${delay}ms`,
            left: '50%',
            bottom: '100px', // Start from near the button
            transform: 'translateX(-50%)'
          }}
        >
          <div 
            className={cn(
              animationType,
              post.isLive && "drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]" // Golden glow for live
            )}
          >
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
  return <div ref={containerRef} className="relative h-screen w-full snap-start snap-always">
      <video 
        ref={videoRef} 
        className="h-full w-full object-cover" 
        loop 
        playsInline 
        muted={isMuted}
        preload="metadata"
        onClick={handleVideoClick} 
        src={post.videoUrl} 
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Live Badge */}
      {post.isLive && <LiveBadge />}

      {/* Live ZOOZ Reactions */}
      {liveReactions.map(renderZoozReaction)}
      
      {/* Profile section */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <div className="relative cursor-pointer" onClick={() => navigate(`/user/${post.id}`)}>
          {post.profileImage ? <img src={post.profileImage} alt={post.username} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" /> : <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-white/20">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>}
          <KYCBadge level={post.kycLevel} />
        </div>
        
        <div className="cursor-pointer text-right" onClick={() => navigate(`/user/${post.id}`)}>
          <div className="flex items-right gap-1">
            <span className="text-white font-semibold text-sm text-right">{post.username}</span>
          </div>
          <div className="mt-1 text-right">
            <ExpertiseBadge expertise={post.expertise} category={post.category} />
          </div>
        </div>
      </div>

      {/* Volume button - positioned below + button */}
      <div className="absolute top-16 left-4">
        <button onClick={handleVolumeToggle} className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full flex items-center justify-center group-active:scale-95 transition-transform">
            {isMuted ? <VolumeX className="w-6 h-6 text-white fill-white" /> : <Volume2 className="w-6 h-6 text-white fill-white" />}
          </div>
        </button>
      </div>

      {/* Action buttons */}
      <div className="absolute left-4 bottom-20 flex flex-col gap-6">

        {/* VOTE button - only for votable posts */}
        {post.isVotable && (
          <AnimatedStatBadge
            count={post.voteCount}
            label="הצבעות"
            icon={<VoteIcon />}
            onClick={() => onVote(post.id, post.ministryPosition!)}
            isActive={post.hasUserVoted}
            activeColor="bg-vote/60"
          />
        )}

        {/* ZOOZ button */}
        <AnimatedStatBadge
          count={post.zoozCount}
          label="ZOOZ"
          icon={
            <div className="relative">
              <ZoozIcon className="text-white" />
              <div className="absolute inset-0 bg-zooz/10 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </div>
          }
          onClick={handleZoozSend}
          isActive={post.userZoozSent && post.userZoozSent > 0}
          activeColor="bg-zooz/30"
        />

        {/* Trust button */}
        <AnimatedStatBadge
          count={post.trustCount}
          label="אמון"
          icon={
            <div className="relative">
              <TrustIconFillable isFilled={post.hasUserTrusted} />
              <Crown className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1" />
            </div>
          }
          onClick={() => onTrust(post.id, post, !post.hasUserTrusted)}
          isActive={post.hasUserTrusted}
          activeColor="bg-trust/30"
        />

        {/* Watch button */}
        <AnimatedStatBadge
          count={post.watchCount}
          label="עוקבים"
          icon={<WatchIconFillable isFilled={post.hasUserWatched} />}
          onClick={() => onWatch(post.id, !post.hasUserWatched)}
          isActive={post.hasUserWatched}
          activeColor="bg-watch/30"
        />

        {/* Share button */}
        <AnimatedStatBadge
          count={post.shareCount}
          label="שיתופים"
          icon={<Share className="w-6 h-6 text-white" />}
          onClick={handlePostClick}
          isActive={false}
          activeColor="bg-white/20"
        />
      </div>

      {/* Caption */}
      <div className="absolute bottom-20 right-4 left-20">
        <div className="cursor-pointer" onClick={() => setIsTextExpanded(!isTextExpanded)}>
          <p className={cn("text-white text-sm leading-relaxed text-right", !isTextExpanded && "line-clamp-3")}>
            {post.caption}
          </p>
          {post.caption.split('\n').length > 3 && !isTextExpanded && <span className="text-white/70 text-xs text-right block mt-1">
              more...
            </span>}
        </div>
        
        {/* Authenticity Info - only shown if video has embedded metadata */}
        {authenticityLocation && (
          <div className="mb-2">
            <div 
              className="text-white/90 text-xs text-right font-medium cursor-pointer transition-all duration-200 hover:text-white"
              onClick={() => setIsAuthenticityExpanded(!isAuthenticityExpanded)}
            >
              <p>{authenticityLocation}</p>
              {isAuthenticityExpanded && authenticityDateTime && (
                <p className="animate-fade-in mt-1 text-white/70">
                  {authenticityDateTime}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

    </div>;
};
export const VideoFeed = ({
  posts,
  onTrust,
  onWatch,
  onZooz,
  onVote,
  userBalance,
  currentUserId,
  isMuted,
  onVolumeToggle
}: VideoFeedProps) => {
  return <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {posts.map(post => <VideoCard key={post.id} post={post} onTrust={onTrust} onWatch={onWatch} onZooz={onZooz} onVote={onVote} userBalance={userBalance} currentUserId={currentUserId} isMuted={isMuted} onVolumeToggle={onVolumeToggle} />)}
    </div>;
};
