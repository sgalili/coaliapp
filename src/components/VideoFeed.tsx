import { useState, useRef, useEffect } from "react";
import { Handshake, Crown, Eye, MessageCircle, Share, User, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useZoozReactions, LiveZoozReaction } from "@/hooks/useZoozReactions";
interface VideoPost {
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
  category: 'politics' | 'technology' | 'education' | 'academia' | 'startup' | 'art' | 'expert' | 'influencer';
  isLive?: boolean;
}
interface VideoFeedProps {
  posts: VideoPost[];
  onTrust: (postId: string) => void;
  onWatch: (postId: string) => void;
  onZooz: (postId: string) => void;
  userBalance: number;
  currentUserId?: string;
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
    expert: {
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/30"
    },
    influencer: {
      bg: "bg-cyan-500/20",
      text: "text-cyan-400",
      border: "border-cyan-500/30"
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
      color: "text-gray-400",
      bg: "bg-gray-400/20"
    },
    2: {
      icon: ShieldAlert,
      color: "text-blue-500",
      bg: "bg-blue-500/20"
    },
    3: {
      icon: ShieldCheck,
      color: "text-green-500",
      bg: "bg-green-500/20"
    }
  };
  const {
    icon: IconComponent,
    color,
    bg
  } = config[level];
  return <div className={cn("absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center", bg)}>
      <IconComponent className={cn("w-4 h-4", color)} />
    </div>;
};
const ZoozIcon = ({
  className = "w-6 h-6 text-zooz"
}: {
  className?: string;
}) => {
  return <div className="relative flex items-center justify-center">
      <div className={cn("font-black text-lg leading-none", className.includes('text-') ? className.split(' ').filter(c => c.startsWith('text-')).join(' ') : "text-zooz")}>Z</div>
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
  userBalance,
  currentUserId
}: {
  post: VideoPost;
  onTrust: (id: string) => void;
  onWatch: (id: string) => void;
  onZooz: (id: string) => void;
  userBalance: number;
  currentUserId?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [lastClick, setLastClick] = useState(0);
  const navigate = useNavigate();
  const {
    liveReactions,
    addZoozReaction
  } = useZoozReactions(post.id, currentUserId);
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
  const handleVideoClick = async (e: React.MouseEvent) => {
    const now = Date.now();
    const timeDiff = now - lastClick;
    if (timeDiff < 300 && timeDiff > 0) {
      // Double click - send ZOOZ with burst animation
      e.preventDefault();
      e.stopPropagation();
      if (userBalance >= 1) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          await addZoozReaction(x, y, 1);
          onZooz(post.id);

          // Bottom toast only
          toast.success("💥 Double ZOOZ envoyé!", {
            position: "bottom-center",
            duration: 1500
          });
        }
      } else {
        toast.error("Solde ZOOZ insuffisant", {
          position: "bottom-center",
          duration: 2000
        });
      }
      return;
    }
    setLastClick(now);

    // Single click - toggle play/pause (with delay to detect double click)
    setTimeout(() => {
      if (Date.now() - lastClick >= 300) {
        const video = videoRef.current;
        if (!video) return;
        if (isPlaying) {
          video.pause();
          setIsPlaying(false);
        } else {
          video.play();
          setIsPlaying(true);
        }
      }
    }, 300);
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
    // Enhanced animation for live videos
    const animationType = post.isLive ? reaction.isOwn ? 'animate-zooz-burst' : 'animate-[zooz-float_2s_ease-out_forwards,pulse_1s_ease-in-out_infinite]' : reaction.isOwn ? 'animate-zooz-burst' : 'animate-zooz-float';
    const basePosition = reaction.x_position && reaction.y_position ? {
      left: `${reaction.x_position}px`,
      top: `${reaction.y_position}px`
    } : {
      left: '50%',
      top: '50%'
    };
    return <div key={reaction.animationId} className="absolute pointer-events-none z-50" style={basePosition}>
        <div className={cn("transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1", animationType, post.isLive && "drop-shadow-[0_0_8px_rgba(255,69,69,0.8)]" // Red glow for live
      )}>
          <span className={cn("font-bold text-lg drop-shadow-lg", reaction.isOwn ? "text-zooz-glow" : post.isLive ? "text-red-400" : "text-white")}>
            +{reaction.amount}
          </span>
          <div className={cn("font-black text-2xl leading-none drop-shadow-lg", reaction.isOwn ? "text-zooz-glow" : post.isLive ? "text-red-500" : "text-zooz")}>
            Z
          </div>
        </div>
      </div>;
  };
  return <div ref={containerRef} className="relative h-screen w-full snap-start snap-always">
      <video ref={videoRef} className="h-full w-full object-cover" loop muted playsInline onClick={handleVideoClick} src={post.videoUrl} />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Live ZOOZ Reactions */}
      {liveReactions.map(renderZoozReaction)}

      {/* Action buttons */}
      <div className="absolute left-4 bottom-20 flex flex-col gap-6">
...
      </div>

      {/* Live Badge and Profile section - positioned above caption */}
      {post.isLive && (
        <div className="absolute bottom-40 right-4 z-10">
          <div className="bg-red-500 text-white py-1 rounded text-xs font-bold animate-pulse shadow-lg px-[10px]">
            LIVE
          </div>
        </div>
      )}

      <div className="absolute bottom-32 right-4 flex items-center gap-3">
        <div className="relative cursor-pointer" onClick={() => navigate(`/user/${post.id}`)}>
          {post.profileImage ? <img src={post.profileImage} alt={post.username} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" /> : <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-white/20">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>}
          <KYCBadge level={post.kycLevel} />
        </div>
        
        <div className="cursor-pointer text-right" onClick={() => navigate(`/user/${post.id}`)}>
          <div className="flex items-center justify-end gap-1">
            <span className="text-white font-semibold text-sm">{post.username}</span>
          </div>
          <div className="mt-1">
            <ExpertiseBadge expertise={post.expertise} category={post.category} />
          </div>
        </div>
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
      </div>

    </div>;
};
export const VideoFeed = ({
  posts,
  onTrust,
  onWatch,
  onZooz,
  userBalance,
  currentUserId
}: VideoFeedProps) => {
  return <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {posts.map(post => <VideoCard key={post.id} post={post} onTrust={onTrust} onWatch={onWatch} onZooz={onZooz} userBalance={userBalance} currentUserId={currentUserId} />)}
    </div>;
};