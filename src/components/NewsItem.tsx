import { useState, useRef } from "react";
import { Clock, MessageCircle, ThumbsUp, Eye, User, Play, Pause, Shield, ShieldAlert, ShieldCheck, Handshake, Crown, Share2, VideoIcon, Plus, GraduationCap, ChevronDown, ChevronUp, Users, Smartphone, TrendingUp, Trophy, Palette, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { PollSection } from "./PollSection";
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import yaakovProfile from '@/assets/yaakov-profile.jpg';
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
  onExpertReply?: (newsId: string) => void;
  expertsVisible?: boolean;
  onToggleExperts?: () => void;
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
const categoryIcons = {
  "פוליטיקה": Users,
  "טכנולוגיה": Smartphone,
  "כלכלה": TrendingUp,
  "ספורט": Trophy,
  "תרבות": Palette,
  "חדשות": Newspaper
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
const TrustIcon = () => <div className="relative">
    <Handshake className="w-5 h-5" />
    <Crown className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />
  </div>;
const VideoCommentPreview = ({
  comment,
  onPlay
}: {
  comment: NewsComment;
  onPlay: () => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const handleFullscreen = () => {
    onPlay();
  };
  return <div className="p-4 mt-2">
      {/* Video Player Section */}
      <div className="relative w-full h-48 bg-slate-900 rounded-lg mb-3 overflow-hidden">
        <video ref={videoRef} src={comment.videoUrl} className="w-full h-full object-cover" onClick={handlePlay} muted playsInline poster={`https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop`} />
        
        {/* Play/Pause overlay */}
        {!isPlaying && <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button onClick={handlePlay} className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <Play className="w-8 h-8 text-white ml-1" />
            </button>
          </div>}
        
        {/* Duration and fullscreen button */}
        <div className="absolute bottom-3 left-3 bg-black/50 px-2 py-1 rounded text-white text-xs">
          {comment.duration}s
        </div>
        <button onClick={handleFullscreen} className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 px-2 py-1 rounded text-white text-xs transition-colors">
          ⛶ Full screen
        </button>
      </div>

      {/* User Info and Stats */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative">
          {comment.userImage ? <img src={comment.userImage} alt={comment.username} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-500" />
            </div>}
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
            "Mon analyse sur cette actualité: {comment.category === 'פוליטיקה' ? 'Les implications politiques sont importantes à considérer...' : comment.category === 'טכנולוגיה' ? 'Cette innovation pourrait transformer le secteur...' : comment.category === 'כלכלה' ? 'Les données économiques montrent une tendance...' : 'Voici mon point de vue d\'expert sur le sujet...'}"
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 pt-4 mt-4 border-t border-slate-100/50">
        {/* Trust Button */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors group-active:scale-95">
            <TrustIcon />
          </div>
          <span className="text-slate-600 text-xs font-medium">
            {comment.trustLevel > 1000 ? `${(comment.trustLevel / 1000).toFixed(1)}k` : comment.trustLevel}
          </span>
        </button>

        {/* Watch Button */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors group-active:scale-95">
            <Eye className="w-5 h-5 text-slate-600" />
          </div>
          <span className="text-slate-600 text-xs font-medium">
            {comment.likes}
          </span>
        </button>

        {/* Comment Button */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors group-active:scale-95">
            <MessageCircle className="w-5 h-5 text-slate-600" />
          </div>
          <span className="text-slate-600 text-xs font-medium">
            {comment.replies}
          </span>
        </button>

        {/* Share Button */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors group-active:scale-95">
            <Share2 className="w-5 h-5 text-slate-600" />
          </div>
          <span className="text-slate-600 text-xs font-medium">
            12
          </span>
        </button>
      </div>
    </div>;
};
export const NewsItemComponent = ({
  item,
  onNewsClick,
  onProfileClick,
  onExpertReply,
  expertsVisible = true,
  onToggleExperts
}: NewsItemProps) => {
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const CategoryIcon = categoryIcons[item.category as keyof typeof categoryIcons] || Newspaper;
  
  return <article className="bg-white shadow-lg rounded-b-xl overflow-hidden mb-4 transition-shadow">
      {/* News Header */}
      <div className="px-2 py-5">
        <div className="flex gap-3 cursor-pointer" onClick={() => onNewsClick(item.id)}>
          <img src={item.thumbnail} alt={item.title} className="w-24 h-18 rounded-md object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 leading-tight mb-2 line-clamp-2">
              {item.title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CategoryIcon className="w-3 h-3" />
              <span>{item.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Opinions Section */}
      <div className="w-full px-2 pb-1 -mt-1">
        {/* Title positioned above everything */}
        <div className="flex items-center gap-1 mb-1">
          <span className="font-medium text-foreground text-sm">
            {item.comments.length === 0 ? "היה הראשון לתת את דעתך כמומחה" : "דעת המומחים"}
          </span>
          {item.comments.length > 0 && onToggleExperts && <button onClick={onToggleExperts} className="ml-auto p-1 hover:bg-muted rounded-sm transition-colors">
              {expertsVisible ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>}
        </div>
        
        {/* Expert photos row - conditional layout based on expert count */}
        {expertsVisible && <div className="relative animate-fade-in">
            {item.comments.length < 6 ?
        // Simple flex layout for < 6 experts: experts first, then user with +
        <div className="flex gap-1 pt-1">
                {/* Expert photos */}
                {item.comments.map(comment => <button key={comment.id} onClick={() => {
            if (activeComment === comment.id) {
              setActiveComment(null);
            } else {
              setActiveComment(comment.id);
            }
          }} className="relative flex-shrink-0">
                    {comment.userImage ? <img src={comment.userImage} alt={comment.username} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm hover:scale-110 transition-transform" /> : <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm hover:scale-110 transition-transform">
                        <User className="w-6 h-6 text-slate-500" />
                      </div>}
                     <KYCBadge level={comment.kycLevel} />
                  </button>)}
                
                {/* User Reply Button (Yaakov's photo with Plus icon) - At the end */}
                <button onClick={() => onExpertReply?.(item.id)} className="group flex-shrink-0">
                  <div className="relative">
                    <img src={yaakovProfile} alt="יעקב אליעזרוב" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-110 transition-transform" />
                    {/* Plus icon overlay */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </button>
              </div> :
        // Scrollable layout for 6+ experts: user fixed right, experts scrollable left
        <div className="relative">
                {/* White fade overlay to indicate scroll */}
                <div className="absolute left-0 top-0 w-20 h-12 bg-gradient-to-r from-white from-75% to-white/50 z-40"></div>
                
                {/* User Reply Button (Yaakov's photo with Plus icon) - Fixed on the left */}
                <button onClick={() => onExpertReply?.(item.id)} className="absolute left-0 top-0 z-50 group">
                  <div className="relative">
                    <img src={yaakovProfile} alt="יעקב אליעזרוב" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-110 transition-transform" />
                    {/* Plus icon overlay */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </button>
                
                {/* Expert photos carousel - scrollable, with space for user on left */}
                <div className="overflow-x-auto pl-16 scrollbar-hide" dir="rtl">
                  <div className="flex gap-1 pt-1">
                    {item.comments.map(comment => <button key={comment.id} onClick={() => {
                if (activeComment === comment.id) {
                  setActiveComment(null);
                } else {
                  setActiveComment(comment.id);
                }
              }} className="relative flex-shrink-0">
                        {comment.userImage ? <img src={comment.userImage} alt={comment.username} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm hover:scale-110 transition-transform" /> : <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm hover:scale-110 transition-transform">
                            <User className="w-6 h-6 text-slate-500" />
                          </div>}
                         <KYCBadge level={comment.kycLevel} />
                      </button>)}
                  </div>
                </div>
              </div>}
          </div>}
      </div>

      {/* Active Comment Video */}
      {activeComment && <div className="px-6 pb-5 border-t border-slate-100/50">
          <div className="mt-3">
            {(() => {
          const comment = item.comments.find(c => c.id === activeComment);
          return comment ? <VideoCommentPreview comment={comment} onPlay={() => onProfileClick(item.id, comment)} /> : null;
        })()}
          </div>
        </div>}

      {/* Community Poll Section */}
      <PollSection newsId={item.id} />
    </article>;
};