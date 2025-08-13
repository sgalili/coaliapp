import { useState } from "react";
import { Clock, MessageCircle, ThumbsUp, Eye, User, Play, Pause, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
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
  kycLevel: 1 | 2 | 3;
}

interface NewsItemProps {
  item: NewsItem;
  onNewsClick: (newsId: string) => void;
  onProfileClick: (newsId: string, comment: NewsComment) => void;
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

const VideoCommentPreview = ({ comment, onPlay }: { comment: NewsComment; onPlay: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    onPlay();
  };

  return (
    <div className="bg-white rounded-lg p-4 mt-2 border border-slate-200 shadow-sm">
      {/* Video Player Section */}
      <div className="relative w-full h-48 bg-slate-900 rounded-lg mb-3 overflow-hidden">
        {!isPlaying ? (
          // Thumbnail with play button
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <button 
              onClick={handlePlay}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/50 px-2 py-1 rounded text-white text-xs">
              {comment.duration}s
            </div>
          </div>
        ) : (
          // Mock video playing state
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-pulse mb-2">🎥</div>
              <p className="text-sm">En train de lire la vidéo de {comment.username}</p>
              <button 
                onClick={handlePlay}
                className="mt-2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Pause className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Info and Stats */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative">
          {comment.userImage ? (
            <img 
              src={comment.userImage} 
              alt={comment.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-500" />
            </div>
          )}
          <KYCBadge level={comment.kycLevel} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-slate-800">{comment.username}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-500">{formatTimeAgo(comment.timestamp)}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-blue-600 font-medium">{comment.trustLevel} Trust</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-slate-600 mb-2">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              <span>{comment.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{comment.replies}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>Regardé</span>
            </div>
          </div>

          {/* Comment content */}
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            "הניתוח שלי על חדשות היום: {comment.category === 'פוליטיקה' ? 'המגמה הכללית מוכיחה שוב שהכלכלה מושפעת מהמדיניות...' : 
             comment.category === 'טכנולוגיה' ? 'Cette innovation pourrait transformer le secteur...' :
             comment.category === 'כלכלה' ? 'Les données économiques montrent une tendance...' :
             'Voici mon point de vue d\'expert sur le sujet...'}"
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span>J'aime ({comment.likes})</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>Répondre</span>
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium">
          <span>🤝</span>
          <span>Faire confiance</span>
        </button>
      </div>
    </div>
  );
};

export const NewsItemComponent = ({ item, onNewsClick, onProfileClick }: NewsItemProps) => {
  const [activeComment, setActiveComment] = useState<string | null>(null);

  const categoryStyle = categoryColors[item.category as keyof typeof categoryColors] || categoryColors["חדשות"];

  return (
    <article className="bg-white rounded-xl border border-slate-200/60 overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow">
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

        <div 
          className="flex gap-3 cursor-pointer" 
          onClick={() => onNewsClick(item.id)}
        >
          <img 
            src={item.thumbnail} 
            alt={item.title}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 leading-tight mb-2 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>
      </div>

      {/* Trusted Users Profiles */}
      {item.comments.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">תגובות מומחים:</span>
            <div className="flex -space-x-2">
              {item.comments.slice(0, 6).map((comment) => (
                <button
                  key={comment.id}
                  onClick={() => {
                    if (activeComment === comment.id) {
                      setActiveComment(null);
                    } else {
                      setActiveComment(comment.id);
                    }
                  }}
                  className="relative"
                >
                  {comment.userImage ? (
                    <img 
                      src={comment.userImage} 
                      alt={comment.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm hover:scale-110 transition-transform">
                      <User className="w-6 h-6 text-slate-500" />
                    </div>
                  )}
                  <KYCBadge level={comment.kycLevel} />
                </button>
              ))}
              {item.comments.length > 6 && (
                <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center">
                  <span className="text-xs text-slate-600">+{item.comments.length - 6}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Comment Video */}
      {activeComment && (
        <div className="px-4 pb-4 border-t border-slate-100">
          <div className="mt-3">
            {(() => {
              const comment = item.comments.find(c => c.id === activeComment);
              return comment ? (
                <VideoCommentPreview
                  comment={comment}
                  onPlay={() => onProfileClick(item.id, comment)}
                />
              ) : null;
            })()}
          </div>
        </div>
      )}
    </article>
  );
};