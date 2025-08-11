import { useState, useRef, useEffect } from "react";
import { Heart, Eye, MessageCircle, Share, User, CheckCircle } from "lucide-react";
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
}

interface VideoFeedProps {
  posts: VideoPost[];
  onTrust: (postId: string) => void;
  onWatch: (postId: string) => void;
}

const KYCBadge = ({ level }: { level: 1 | 2 | 3 }) => {
  const colors = {
    1: "bg-yellow-500",
    2: "bg-blue-500", 
    3: "bg-green-500"
  };
  
  return (
    <div className={cn("absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white", colors[level])}>
      {level}
    </div>
  );
};

const VideoCard = ({ post, onTrust, onWatch }: { post: VideoPost; onTrust: (id: string) => void; onWatch: (id: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      
      {/* Profile section */}
      <div className="absolute top-4 left-4 flex items-center gap-3">
        <div className="relative">
          {post.profileImage ? (
            <img src={post.profileImage} alt={post.username} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <KYCBadge level={post.kycLevel} />
        </div>
        
        <div>
          <div className="flex items-center gap-1">
            <span className="text-white font-semibold text-sm">{post.username}</span>
            {post.isVerified && <CheckCircle className="w-4 h-4 text-blue-400" />}
          </div>
          <span className="text-white/70 text-xs">@{post.handle}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute right-4 bottom-20 flex flex-col gap-6">
        {/* Trust button */}
        <button
          onClick={() => onTrust(post.id)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-trust/20 backdrop-blur-sm flex items-center justify-center group-active:scale-95 transition-transform">
            <Heart className="w-6 h-6 text-trust fill-trust" />
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

      {/* Caption */}
      <div className="absolute bottom-4 left-4 right-20">
        <p className="text-white text-sm leading-relaxed">{post.caption}</p>
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