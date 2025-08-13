import { useState, useRef, useEffect } from "react";
import { Handshake, Crown, Eye, MessageCircle, Share, User, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  isVerified?: boolean;
  kycLevel: 1 | 2 | 3;
  expertise: string;
  category: 'politics' | 'technology' | 'education' | 'academia' | 'startup' | 'art' | 'expert' | 'influencer';
}

interface VideoFeedProps {
  posts: VideoPost[];
  onTrust: (postId: string) => void;
  onWatch: (postId: string) => void;
}

const TrustIcon = () => {
  return (
    <div className="relative">
      <Handshake className="w-6 h-6 text-trust" />
      <Crown className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1" />
    </div>
  );
};

const ExpertiseBadge = ({ expertise, category }: { expertise: string; category: string }) => {
  const categoryConfig = {
    politics: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
    technology: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
    education: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
    academia: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
    startup: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
    art: { bg: "bg-pink-500/20", text: "text-pink-400", border: "border-pink-500/30" },
    expert: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
    influencer: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" }
  };
  
  const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.expert;
  
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm",
      config.bg,
      config.text,
      config.border
    )}>
      {expertise}
    </span>
  );
};

const KYCBadge = ({ level }: { level: 1 | 2 | 3 }) => {
  const config = {
    1: { icon: Shield, color: "text-gray-400", bg: "bg-gray-400/20" },
    2: { icon: ShieldAlert, color: "text-blue-500", bg: "bg-blue-500/20" },
    3: { icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/20" }
  };
  
  const { icon: IconComponent, color, bg } = config[level];
  
  return (
    <div className={cn("absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center", bg)}>
      <IconComponent className={cn("w-4 h-4", color)} />
    </div>
  );
};

const VideoCard = ({ post, onTrust, onWatch }: { post: VideoPost; onTrust: (id: string) => void; onWatch: (id: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const handleVideoClick = () => {
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

  return (
    <div className="relative h-screen w-full snap-start snap-always">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
        onClick={handleVideoClick}
        src={post.videoUrl}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Caption */}
      <div 
        className="absolute left-0 pl-4" 
        style={{ 
          bottom: `calc(5rem + env(safe-area-inset-bottom))`,
          maxHeight: `calc(40vh - env(safe-area-inset-bottom))`,
          overflowY: 'auto'
        }}
      >
        {/* Profile section - positioned directly above caption text */}
        <div className="flex items-start gap-3 justify-start mb-2">
          <div 
            className="cursor-pointer text-right" 
            onClick={() => navigate(`/user/${post.id}`)}
          >
            <div className="flex items-center justify-end">
              <span className="text-white font-semibold text-sm">{post.username}</span>
            </div>
            <div className="mt-1 flex justify-end">
              <ExpertiseBadge expertise={post.expertise} category={post.category} />
            </div>
          </div>
          
          <div 
            className="relative cursor-pointer flex-shrink-0" 
            onClick={() => navigate(`/user/${post.id}`)}
          >
            {post.profileImage ? (
              <img src={post.profileImage} alt={post.username} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-white/20">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <KYCBadge level={post.kycLevel} />
          </div>
        </div>
        
        <div 
          className="cursor-pointer"
          onClick={() => setIsTextExpanded(!isTextExpanded)}
        >
          <p className={cn(
            "text-white text-sm leading-relaxed text-right",
            !isTextExpanded && "line-clamp-3"
          )}>
            {post.caption}
          </p>
          {post.caption.split('\n').length > 3 && !isTextExpanded && (
            <span className="text-white/70 text-xs text-right block mt-1">
              more...
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div 
        className="absolute left-4 flex flex-col gap-6" 
        style={{ bottom: `calc(5rem + env(safe-area-inset-bottom))` }}
      >
        {/* Trust button */}
        <button
          onClick={() => onTrust(post.id)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-trust/20 backdrop-blur-sm flex items-center justify-center group-active:scale-95 transition-transform">
            <TrustIcon />
          </div>
          <span className="text-white text-xs font-medium">{post.trustCount}</span>
        </button>

        {/* Watch button */}
        <button
          onClick={() => onWatch(post.id)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-watch/20 backdrop-blur-sm flex items-center justify-center group-active:scale-95 transition-transform">
            <Eye className="w-6 h-6 text-watch" />
          </div>
          <span className="text-white text-xs font-medium">{post.watchCount}</span>
        </button>

        {/* Comment button */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-active:scale-95 transition-transform">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">{post.commentCount}</span>
        </button>

        {/* Share button */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-active:scale-95 transition-transform">
            <Share className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">{post.shareCount}</span>
        </button>
      </div>

    </div>
  );
};

export const VideoFeed = ({ posts, onTrust, onWatch }: VideoFeedProps) => {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {posts.map((post) => (
        <VideoCard 
          key={post.id} 
          post={post} 
          onTrust={onTrust} 
          onWatch={onWatch} 
        />
      ))}
    </div>
  );
};