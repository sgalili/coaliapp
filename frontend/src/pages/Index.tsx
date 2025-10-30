import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { ChannelSelector } from "@/components/ChannelSelector";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { Comments } from "@/components/Comments";
import { Heart, Eye, MessageCircle, Share2, Volume2, VolumeX, CheckCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useChannel } from "@/contexts/ChannelContext";

// Sample VIDEO posts ONLY - verified users
const samplePosts = [
  {
    id: '1',
    username: 'בנימין נתניהו',
    expertise: 'מנהיגות ופוליטיקה',
    profileImage: 'https://trust.coali.app/assets/netanyahu-profile-C6yQFuUl.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: 'עמדתי לגבי הרפורמה המשפטית ומה שצריך להיעשות עכשיו',
    location: 'ירושלים, ישראל',
    isVerified: true,
    isLive: true,
    category: 'politics',
    voteCount: 1200,
    zoozCount: 89000,
    trustCount: 234600,
    watchCount: 1200000,
    commentCount: 23500,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: '2',
    username: 'ירון זליכה',
    expertise: 'כלכלה אקדמית',
    profileImage: 'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    caption: 'ניתוח כלכלי מעמיק של המצב הנוכחי ודרכי הפתרון',
    location: 'ירושלים, ישראל',
    isVerified: true,
    isLive: false,
    category: 'economy',
    voteCount: 892,
    zoozCount: 67200,
    trustCount: 156800,
    watchCount: 890000,
    commentCount: 18900,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: '3',
    username: 'יעקב אליעזרוב',
    expertise: 'תכשיטים ועסקים',
    profileImage: 'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    caption: 'תודה לה\' על הברכות בעסק התכשיטים והיהלומים',
    location: 'תל אביב, ישראל',
    isVerified: true,
    isLive: false,
    category: 'business',
    voteCount: 0,
    zoozCount: 15400,
    trustCount: 45700,
    watchCount: 230000,
    commentCount: 4600,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: '4',
    username: 'Warren Buffett',
    expertise: 'השקעות ופיננסים',
    profileImage: 'https://trust.coali.app/assets/warren-buffett-profile-Bfn-yren.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    caption: 'Best investment advice ever - lessons for long-term wealth building',
    location: 'Omaha, USA',
    isVerified: true,
    isLive: false,
    category: 'economy',
    voteCount: 0,
    zoozCount: 123500,
    trustCount: 567900,
    watchCount: 2100000,
    commentCount: 45700,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: '5',
    username: 'ד״ר מאיה רוזמן',
    expertise: 'דיאטה ותזונה',
    profileImage: 'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    caption: 'משרד החקלאות - למה חשוב לשלב ירקות בכל ארוחה',
    location: 'חיפה, ישראל',
    isVerified: true,
    isLive: false,
    category: 'health',
    voteCount: 0,
    zoozCount: 18900,
    trustCount: 67200,
    watchCount: 320000,
    commentCount: 6800,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { selectedChannel, setSelectedChannel, availableChannels } = useChannel();
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [posts, setPosts] = useState(samplePosts);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [mutedVideos, setMutedVideos] = useState<{ [key: string]: boolean }>({});
  const [newDecisionsCount] = useState(3);
  const [showChannelIndicator, setShowChannelIndicator] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  // Reset channel indicator when channel changes
  useEffect(() => {
    setShowChannelIndicator(true);
    setSelectedCategory('הכל'); // Reset category when channel changes
  }, [selectedChannel.id]);

  const openComments = (postId: string) => {
    setActivePostId(postId);
    setCommentsOpen(true);
  };

  const closeComments = () => {
    setCommentsOpen(false);
    setActivePostId(null);
  };

  // Show channel indicator when channel changes
  useEffect(() => {
    setShowChannelIndicator(true);
  }, [selectedChannel]);

  // Auto-play videos in viewport
  useEffect(() => {
    const currentPost = posts[currentPostIndex];
    const video = videoRefs.current[currentPost?.id];
    if (video) {
      video.play().catch(() => {
        video.muted = true;
        setMutedVideos(prev => ({ ...prev, [currentPost.id]: true }));
        video.play();
      });
    }

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
      const windowHeight = window.innerHeight - 64;
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
          hasUserTrusted: !post.hasUserTrusted,
          trustCount: post.hasUserTrusted ? post.trustCount - 1 : post.trustCount + 1
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
          hasUserWatched: !post.hasUserWatched,
          watchCount: post.hasUserWatched ? post.watchCount - 1 : post.watchCount + 1
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

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const closeComments = () => {
    setCommentsOpen(false);
    setActivePostId(null);
  };

  return (
    <div className="h-screen bg-black overflow-hidden">
      {/* Top Left Corner - החלטות Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate('/decisions')}
          data-tour-id="decisions-filter"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 text-white/80 hover:text-white bg-white/10 relative"
        >
          <span className="text-xs">החלטות</span>
          {newDecisionsCount > 0 && (
            <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {newDecisionsCount}
            </span>
          )}
        </button>
      </div>

      {/* Category Dropdown - Center Top (TikTok Style) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <CategoryDropdown
          categories={selectedChannel.categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Top Right Corner - Channel Selector */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ChannelSelector />
        
        {/* Channel Indicator (if not Coali main) - Same row, to the left of selector */}
        {selectedChannel.id !== null && showChannelIndicator && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full text-xs">
            <span className="text-xs font-medium">{selectedChannel.name}</span>
            <button
              onClick={() => setShowChannelIndicator(false)}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Posts Feed */}
      <div 
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {posts.map((post) => (
          <div 
            key={post.id}
            className="relative snap-start snap-always h-screen w-full"
          >
            {/* Video - 9:16 aspect ratio, full cover */}
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <video
                ref={(el) => (videoRefs.current[post.id] = el)}
                src={post.videoUrl}
                poster={post.profileImage}
                className="w-full h-full object-cover"
                loop
                playsInline
                muted={mutedVideos[post.id]}
                onClick={() => toggleMute(post.id)}
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            </div>

            {/* Mute Button - Top right, below channel selector */}
            <button
              onClick={() => toggleMute(post.id)}
              className="absolute top-16 right-4 p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors z-10"
            >
              {mutedVideos[post.id] ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            {/* LEFT Side Action Buttons */}
            <div className="absolute left-4 bottom-32 flex flex-col gap-5 z-10">
              {/* Vote Button (if applicable) */}
              {post.voteCount > 0 && (
                <button className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-vote/90 backdrop-blur-sm flex items-center justify-center hover:bg-vote transition-all">
                    <img 
                      src="https://trust.coali.app/vote.png" 
                      alt="Vote" 
                      className="w-6 h-6"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="text-white text-xs font-bold drop-shadow-lg">
                    {formatCount(post.voteCount)}
                  </span>
                </button>
              )}

              {/* Zooz Button */}
              <button className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all">
                  <span className="text-zooz text-xl font-bold">Z</span>
                </div>
                <span className="text-white text-xs font-bold drop-shadow-lg">
                  {formatCount(post.zoozCount)}
                </span>
              </button>

              {/* Trust Button */}
              <button
                onClick={() => toggleTrust(post.id)}
                className="flex flex-col items-center gap-1"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-all",
                  post.hasUserTrusted 
                    ? "bg-trust/90 scale-110" 
                    : "bg-black/50 hover:bg-black/70"
                )}>
                  <Heart 
                    className={cn(
                      "w-6 h-6 transition-all",
                      post.hasUserTrusted ? "text-white fill-white" : "text-white"
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
                  post.hasUserWatched 
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
              <button 
                onClick={() => openComments(post.id)}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-xs font-bold drop-shadow-lg">
                  {formatCount(post.commentCount)}
                </span>
              </button>

              {/* Share Button */}
              <button className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
              </button>
            </div>

            {/* Bottom Right - Caption and Info */}
            <div className="absolute bottom-20 right-4 left-20 z-10">
              {/* Profile and Name */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <img
                    src={post.profileImage}
                    alt={post.username}
                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                  />
                  {/* LIVE Badge below profile - 50% smaller */}
                  {post.isLive && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 whitespace-nowrap">
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base drop-shadow-lg">
                    {post.username}
                  </h3>
                  <p className="text-white/90 text-sm drop-shadow-lg">
                    {post.expertise}
                  </p>
                </div>
              </div>

              {/* Caption */}
              <p className="text-white text-sm leading-relaxed mb-2 drop-shadow-lg">
                {post.caption}
              </p>

              {/* Location and Authenticity */}
              <div className="flex items-center gap-2 text-white/90 text-xs">
                {post.isVerified && (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-trust" />
                    <span className="drop-shadow-lg">אותנטי</span>
                    <span>|</span>
                  </>
                )}
                <MapPin className="w-3.5 h-3.5" />
                <span className="drop-shadow-lg">{post.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={999} />

      {/* Comments Modal */}
      {activePostId && (
        <Comments
          postId={activePostId}
          isOpen={commentsOpen}
          onClose={closeComments}
          commentCount={posts.find(p => p.id === activePostId)?.commentCount || 0}
        />
      )}
    </div>
  );
}
