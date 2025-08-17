import { useState } from "react";
import { Play, Heart, MessageCircle, Share } from "lucide-react";
import { FullscreenVideoPlayer } from "@/components/FullscreenVideoPlayer";

interface Post {
  id: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  caption: string;
  trustCount: number;
  watchCount: number;
  commentCount: number;
  shareCount: number;
  timestamp: string;
}

interface ProfilePostsGridProps {
  posts: Post[];
  className?: string;
}

export const ProfilePostsGrid = ({ posts, className = "" }: ProfilePostsGridProps) => {
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const handlePostClick = (index: number) => {
    setSelectedPostIndex(index);
    setIsFullscreenOpen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreenOpen(false);
    setSelectedPostIndex(null);
  };

  const handleSwipeToNext = () => {
    if (selectedPostIndex !== null && selectedPostIndex < posts.length - 1) {
      setSelectedPostIndex(selectedPostIndex + 1);
    }
  };

  const handleSwipeToPrevious = () => {
    if (selectedPostIndex !== null && selectedPostIndex > 0) {
      setSelectedPostIndex(selectedPostIndex - 1);
    }
  };

  // Mock video data for fullscreen player
  const getVideoForFullscreen = (index: number) => ({
    id: posts[index].id,
    username: "שרה_פוליטיקה",
    handle: "sarahp", 
    profileImage: "/src/assets/sarah-profile.jpg",
    videoUrl: posts[index].videoUrl || "/placeholder-video.mp4",
    caption: posts[index].caption,
    zoozCount: posts[index].trustCount,
    trustCount: posts[index].trustCount,
    watchCount: posts[index].watchCount,
    commentCount: posts[index].commentCount,
    shareCount: posts[index].shareCount,
    timestamp: posts[index].timestamp,
    isVerified: true,
    kycLevel: 2,
    expertise: "כלכלה",
    category: "economy",
    isLive: false
  });

  return (
    <div className={`${className}`} dir="rtl">
      {/* Grid de posts style Instagram */}
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post, index) => (
          <div 
            key={post.id}
            className="relative aspect-square bg-muted rounded-lg cursor-pointer group overflow-hidden"
            onClick={() => handlePostClick(index)}
          >
            {/* Thumbnail ou placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Play className="w-8 h-8 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {/* Overlay avec stats au hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center gap-4 text-white text-sm" dir="rtl">
                <div className="flex items-center gap-1">
                  {post.trustCount}
                  <Heart className="w-4 h-4 fill-current" />
                </div>
                <div className="flex items-center gap-1">
                  {post.commentCount}
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder pour la logique fullscreen - à implémenter plus tard */}
      {isFullscreenOpen && selectedPostIndex !== null && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-white">
            <p>Post {selectedPostIndex + 1} en fullscreen</p>
            <button onClick={handleCloseFullscreen} className="mt-4 px-4 py-2 bg-primary text-white rounded">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};