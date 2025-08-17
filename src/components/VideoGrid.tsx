import { useState } from "react";
import { Heart, Eye, MessageCircle, Share, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPost {
  id: string;
  videoUrl?: string;
  thumbnail?: string;
  caption: string;
  trustCount: number;
  watchCount: number;
  commentCount: number;
  shareCount: number;
  duration?: string;
}

interface VideoGridProps {
  posts: VideoPost[];
  onVideoClick: (postId: string, index: number) => void;
  className?: string;
}

export const VideoGrid = ({ posts, onVideoClick, className }: VideoGridProps) => {
  const [loadedThumbnails, setLoadedThumbnails] = useState<Set<string>>(new Set());

  const handleThumbnailLoad = (postId: string) => {
    setLoadedThumbnails(prev => new Set(prev).add(postId));
  };

  return (
    <div className={cn("w-full", className)} dir="rtl">
      {/* Grid container - 3 columns like Instagram, full width */}
      <div className="grid grid-cols-3 gap-0.5 w-full">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="relative aspect-[3/4] bg-muted cursor-pointer group overflow-hidden"
            onClick={() => onVideoClick(post.id, index)}
          >
            {/* Thumbnail or placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center">
              {post.thumbnail ? (
                <>
                  <img
                    src={post.thumbnail}
                    alt={post.caption}
                    className={cn(
                      "w-full h-full object-cover transition-opacity duration-300",
                      loadedThumbnails.has(post.id) ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => handleThumbnailLoad(post.id)}
                  />
                  {!loadedThumbnails.has(post.id) && (
                    <div className="absolute inset-0 bg-muted animate-pulse" />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Play className="w-8 h-8 mb-2" />
                  <span className="text-xs text-center px-2 leading-tight">
                    {post.caption.slice(0, 30)}...
                  </span>
                </div>
              )}
            </div>

            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
              <Play className="w-6 h-6 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>

            {/* Duration badge */}
            {post.duration && (
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {post.duration}
              </div>
            )}

            {/* Stats overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="flex items-center gap-4 text-white text-sm">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{post.trustCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.watchCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Play className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            אין פוסטים עדיין
          </h3>
          <p className="text-sm text-muted-foreground">
            כשתפרסם פוסטים, הם יופיעו כאן
          </p>
        </div>
      )}
    </div>
  );
};