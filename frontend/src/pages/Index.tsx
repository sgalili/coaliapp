import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Heart, Eye, MessageCircle, Share2, Volume2, VolumeX, CheckCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Sample VIDEO posts ONLY - verified users
const samplePosts = [
  {
    id: '1',
    type: 'video' as const,
    category: 'פוליטיקה',
    author: {
      name: 'בנימין נתניהו',
      avatar: 'https://trust.coali.app/assets/netanyahu-profile-C6yQFuUl.jpg',
      verified: true,
    },
    content: 'עמדתי לגבי הרפורמה המשפטית ומה שצריך להיעשות עכשיו',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoPoster: 'https://trust.coali.app/assets/netanyahu-profile-C6yQFuUl.jpg',
    timestamp: 'לפני 2 שעות',
    trustCount: 2346,
    watchCount: 12000,
    commentCount: 235,
    zoozCount: 890,
    isTrusted: false,
    isWatched: false,
  },
  {
    id: '4',
    type: 'video' as const,
    category: 'חברה',
    author: {
      name: 'נועה קירל',
      avatar: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg',
      verified: true,
    },
    content: 'שיר חדש! תגידו לי מה אתם חושבים 🎵',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoPoster: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg',
    timestamp: 'לפני שעה',
    trustCount: 8925,
    watchCount: 34000,
    commentCount: 679,
    zoozCount: 1568,
    isTrusted: false,
    isWatched: false,
  },
  {
    id: '6',
    type: 'video' as const,
    category: 'טכנולוגיה',
    author: {
      name: 'ירון זליכה',
      avatar: 'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
      verified: true,
    },
    content: 'המהפכה הטכנולוגית הבאה - מה שאתם חייבים לדעת',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    videoPoster: 'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
    timestamp: 'לפני 3 שעות',
    trustCount: 1567,
    watchCount: 8900,
    commentCount: 89,
    zoozCount: 672,
    isTrusted: false,
    isWatched: true,
  },
  {
    id: '7',
    type: 'video' as const,
    category: 'כלכלה',
    author: {
      name: 'רחל אברהם',
      avatar: 'https://trust.coali.app/assets/rachel-profile-w3gZXC9S.jpg',
      verified: true,
    },
    content: 'הסבר על המצב הכלכלי והשפעתו עלינו',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    videoPoster: 'https://trust.coali.app/assets/rachel-profile-w3gZXC9S.jpg',
    timestamp: 'לפני 4 שעות',
    trustCount: 3421,
    watchCount: 15600,
    commentCount: 234,
    zoozCount: 987,
    isTrusted: true,
    isWatched: false,
  },
  {
    id: '8',
    type: 'video' as const,
    category: 'בריאות',
    author: {
      name: 'ד״ר מאיה רוזמן',
      avatar: 'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg',
      verified: true,
    },
    content: '5 טיפים לבריאות טובה שכולם צריכים לדעת',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoPoster: 'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg',
    timestamp: 'לפני 5 שעות',
    trustCount: 2890,
    watchCount: 13400,
    commentCount: 167,
    zoozCount: 756,
    isTrusted: false,
    isWatched: false,
  },
];

const categories = [
  { id: 'all', label: 'הכל' },
  { id: 'politics', label: 'פוליטיקה' },
  { id: 'tech', label: 'טכנולוגיה' },
  { id: 'economy', label: 'כלכלה' },
  { id: 'society', label: 'חברה' },
  { id: 'health', label: 'בריאות' },
];

export default function Index() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [posts, setPosts] = useState(samplePosts);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [mutedVideos, setMutedVideos] = useState<{ [key: string]: boolean }>({});
  const [newDecisionsCount, setNewDecisionsCount] = useState(3); // Mock count
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  // Auto-play videos in viewport
  useEffect(() => {
    const currentPost = posts[currentPostIndex];
    if (currentPost?.type === 'video') {
      const video = videoRefs.current[currentPost.id];
      if (video) {
        video.play().catch(() => {
          // Auto-play prevented, mute and try again
          video.muted = true;
          setMutedVideos(prev => ({ ...prev, [currentPost.id]: true }));
          video.play();
        });
      }
    }

    // Pause other videos
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (id !== currentPost?.id && video) {
        video.pause();
      }
    });
  }, [currentPostIndex, posts]);

  // Scroll handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight - 64; // minus nav height
      const newIndex = Math.round(scrollTop / windowHeight);
      
      if (newIndex !== currentPostIndex && newIndex >= 0 && newIndex < posts.length) {
        setCurrentPostIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentPostIndex, posts.length]);

  const toggleTrust = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isTrusted: !post.isTrusted,
          trustCount: post.isTrusted ? post.trustCount - 1 : post.trustCount + 1
        };
      }
      return post;
    }));
  };

  const toggleWatch = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isWatched: !post.isWatched,
          watchCount: post.isWatched ? post.watchCount - 1 : post.watchCount + 1
        };
      }
      return post;
    }));
  };

  const toggleMute = (postId: string) => {
    setMutedVideos(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    const video = videoRefs.current[postId];
    if (video) {
      video.muted = !video.muted;
    }
  };

  const votePoll = (postId: string, optionId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId && post.type === 'poll') {
        return {
          ...post,
          userVoted: true,
          pollOptions: post.pollOptions?.map(opt => 
            opt.id === optionId 
              ? { ...opt, votes: opt.votes + 1, percentage: ((opt.votes + 1) / (post.totalVotes! + 1)) * 100 }
              : { ...opt, percentage: (opt.votes / (post.totalVotes! + 1)) * 100 }
          ),
          totalVotes: (post.totalVotes || 0) + 1
        };
      }
      return post;
    }));
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Category Filter */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div 
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory pt-[68px]"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {posts.map((post) => (
          <div 
            key={post.id}
            className="relative snap-start snap-always"
            style={{ height: 'calc(100vh - 132px)' }}
          >
            {/* Post Content Based on Type */}
            {post.type === 'video' && (
              <div className="relative h-full w-full bg-black">
                <video
                  ref={(el) => (videoRefs.current[post.id] = el)}
                  src={post.videoUrl}
                  poster={post.videoPoster}
                  className="h-full w-full object-contain"
                  loop
                  playsInline
                  muted={mutedVideos[post.id]}
                  onClick={() => toggleMute(post.id)}
                />
                
                {/* Mute Button */}
                <button
                  onClick={() => toggleMute(post.id)}
                  className="absolute top-4 left-4 p-2 bg-black/50 rounded-full backdrop-blur-sm"
                >
                  {mutedVideos[post.id] ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            )}

            {post.type === 'text' && (
              <div 
                className="h-full w-full flex items-center justify-center p-8"
                style={{ background: post.background }}
              >
                <p className="text-white text-2xl font-bold text-center leading-relaxed max-w-2xl">
                  {post.content}
                </p>
              </div>
            )}

            {post.type === 'poll' && (
              <div className="h-full w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-6">
                <div className="w-full max-w-lg">
                  <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                    {post.content}
                  </h3>
                  
                  <div className="space-y-3">
                    {post.pollOptions?.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => !post.userVoted && votePoll(post.id, option.id)}
                        disabled={post.userVoted}
                        className={cn(
                          "w-full p-4 rounded-xl border-2 transition-all text-right",
                          post.userVoted
                            ? "bg-card border-border cursor-default"
                            : "bg-card border-primary/20 hover:border-primary/50 hover:bg-card/80"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{option.text}</span>
                          {post.userVoted && (
                            <span className="text-sm text-primary font-bold">
                              {option.percentage.toFixed(0)}%
                            </span>
                          )}
                        </div>
                        {post.userVoted && (
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${option.percentage}%` }}
                            />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {post.userVoted && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      {post.totalVotes} הצבעות
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium rounded-full">
                {post.category}
              </span>
            </div>

            {/* Author Info */}
            <div className="absolute top-4 left-20 right-20 z-10">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-medium text-sm drop-shadow-lg">
                      {post.author.name}
                    </span>
                    {post.author.verified && (
                      <CheckCircle className="w-4 h-4 text-trust" />
                    )}
                  </div>
                  <span className="text-white/80 text-xs drop-shadow-lg">
                    {post.timestamp}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="absolute left-4 bottom-32 flex flex-col gap-5 z-10">
              {/* Trust Button */}
              <button
                onClick={() => toggleTrust(post.id)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-all",
                  post.isTrusted 
                    ? "bg-trust/90 scale-110" 
                    : "bg-black/50 hover:bg-black/70"
                )}>
                  <Heart 
                    className={cn(
                      "w-6 h-6 transition-all",
                      post.isTrusted ? "text-white fill-white" : "text-white"
                    )} 
                  />
                </div>
                <span className="text-white text-xs font-bold drop-shadow-lg">
                  {formatCount(post.trustCount)}
                </span>
              </button>

              {/* Watch Button */}
              <button
                onClick={() => toggleWatch(post.id)}
                className="flex flex-col items-center gap-1"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-all",
                  post.isWatched 
                    ? "bg-watch/90" 
                    : "bg-black/50 hover:bg-black/70"
                )}>
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-xs font-bold drop-shadow-lg">
                  {formatCount(post.watchCount)}
                </span>
              </button>

              {/* Comment Button */}
              <button className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-xs font-bold drop-shadow-lg">
                  {formatCount(post.commentCount)}
                </span>
              </button>

              {/* Zooz Button */}
              <button className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-zooz backdrop-blur-sm flex items-center justify-center hover:opacity-90 transition-all">
                  <span className="text-zooz-foreground text-xl font-bold">Z</span>
                </div>
                <span className="text-white text-xs font-bold drop-shadow-lg">
                  {formatCount(post.zoozCount)}
                </span>
              </button>

              {/* Share Button */}
              <button className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
              </button>
            </div>

            {/* Caption at Bottom */}
            {(post.type === 'video' || post.type === 'poll') && (
              <div className="absolute bottom-20 right-4 left-20 z-10">
                <p className="text-white text-sm leading-relaxed drop-shadow-lg">
                  {post.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={250} />
    </div>
  );
}
