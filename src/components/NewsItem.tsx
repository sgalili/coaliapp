import { useState } from "react";
import { Clock, MessageCircle, ThumbsUp, Eye, User, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  category: string;
  source: string;
  comments: NewsComment[];
}

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
}

interface NewsItemProps {
  item: NewsItem;
  onCommentClick: (newsId: string) => void;
  onVideoComment: (comment: NewsComment) => void;
}

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "עכשיו";
  if (diffInMinutes < 60) return `לפני ${diffInMinutes} דק'`;
  if (diffInMinutes < 1440) return `לפני ${Math.floor(diffInMinutes / 60)} שעות`;
  return `לפני ${Math.floor(diffInMinutes / 1440)} ימים`;
};

const categoryColors = {
  "פוליטיקה": "bg-red-500/20 text-red-400 border-red-500/30",
  "טכנולוגיה": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "כלכלה": "bg-green-500/20 text-green-400 border-green-500/30",
  "ספורט": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "תרבות": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "חדשות": "bg-gray-500/20 text-gray-400 border-gray-500/30"
};

const VideoCommentPreview = ({ comment, onPlay }: { comment: NewsComment; onPlay: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    onPlay();
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 mt-2 border border-border/30">
      <div className="flex items-start gap-3">
        <div className="relative">
          {comment.userImage ? (
            <img 
              src={comment.userImage} 
              alt={comment.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <button onClick={handlePlay} className="w-full h-full flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-3 h-3 text-primary-foreground" />
              ) : (
                <Play className="w-3 h-3 text-primary-foreground" />
              )}
            </button>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-foreground">{comment.username}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.timestamp)}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-trust font-medium">{comment.trustLevel} Trust</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              <span>{comment.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{comment.replies}</span>
            </div>
            <span>{comment.duration}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NewsItemComponent = ({ item, onCommentClick, onVideoComment }: NewsItemProps) => {
  const [showComments, setShowComments] = useState(false);

  const categoryStyle = categoryColors[item.category as keyof typeof categoryColors] || categoryColors["חדשות"];

  return (
    <article className="bg-card rounded-lg border border-border overflow-hidden mb-4">
      {/* News Header */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", categoryStyle)}>
            {item.category}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{item.source}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(item.publishedAt)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <img 
            src={item.thumbnail} 
            alt={item.title}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground leading-tight mb-2 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-4 py-3 border-t border-border bg-card/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setShowComments(!showComments);
              if (!showComments) onCommentClick(item.id);
            }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{item.comments.length} תגובות</span>
          </button>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>קרא עוד</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="mt-3">
            {item.comments.length > 0 ? (
              <div className="space-y-2">
                {item.comments.slice(0, 3).map((comment) => (
                  <VideoCommentPreview
                    key={comment.id}
                    comment={comment}
                    onPlay={() => onVideoComment(comment)}
                  />
                ))}
                {item.comments.length > 3 && (
                  <button className="text-sm text-primary hover:underline mt-2">
                    הצג עוד {item.comments.length - 3} תגובות
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                אין תגובות עדיין. היה הראשון להגיב!
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
};