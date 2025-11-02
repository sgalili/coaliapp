import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { ChannelSelector } from "@/components/ChannelSelector";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { Comments } from "@/components/Comments";
import { Heart, Eye, MessageCircle, Share2, Volume2, VolumeX, CheckCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useChannel } from "@/contexts/ChannelContext";
import { supabase } from "@/integrations/supabase/client";

// Local posters to avoid remote failures
import netanyahuProfile from "@/assets/netanyahu-profile.jpg";

export default function Index() {
  const navigate = useNavigate();
  const { selectedChannel, setSelectedChannel, availableChannels, selectedCategory, setSelectedCategory, showChannelIndicator, setShowChannelIndicator } = useChannel();
  const [posts, setPosts] = useState<any[]>([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [mutedVideos, setMutedVideos] = useState<{ [key: string]: boolean }>({});
  const [videoReady, setVideoReady] = useState<Record<string, boolean>>({});
  const [newDecisionsCount] = useState(3);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});


  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  useEffect(() => {
    setMutedVideos(Object.fromEntries(posts.map((p: any) => [p.id, true])));
  }, [posts]);

  // Filter posts by selected category
  useEffect(() => {
    const getCategoryApiValue = (hebrewCategory: string): string => {
      const categoryMap: Record<string, string> = {
        'הכל': 'politics',
        'פוליטיקה': 'politics',
        'כלכלה': 'economy',
        'טכנולוגיה': 'technology',
        'בריאות': 'health',
        'חברה': 'society',
        'תרבות': 'culture',
        'עסקים': 'business'
      };
      return categoryMap[hebrewCategory] || 'all';
    };

    const apiCategory = getCategoryApiValue(selectedCategory);
    

    // Fetch videos from edge function for selected category
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-category-videos', {
          body: { category: apiCategory }
        });

        if (error) {
          console.error('Edge function error:', error);
          setPosts([]);
        } else if (data?.videos?.length) {
          const mapped = data.videos.map((v: any, idx: number) => ({
            id: v.id || `${apiCategory}-${idx}`,
            username: v.source || 'News Source',
            expertise: selectedCategory,
            profileImage: v.thumbnail || netanyahuProfile,
            videoUrl: v.url,
            caption: v.title || '',
            location: 'ישראל',
            isVerified: true,
            isLive: false,
            category: apiCategory,
            voteCount: 0,
            zoozCount: 10000 + Math.floor(Math.random() * 90000),
            trustCount: 50000 + Math.floor(Math.random() * 200000),
            watchCount: 100000 + Math.floor(Math.random() * 2000000),
            commentCount: 1000 + Math.floor(Math.random() * 20000),
            hasUserTrusted: false,
            hasUserWatched: false,
          }));
          setPosts(mapped);
        } else {
          setPosts([]);
        }
      } catch (e) {
        console.error('Fetch category videos failed', e);
        setPosts([]);
      } finally {
        setCurrentPostIndex(0);
      }
    })();
  }, [selectedCategory]);

  const openComments = (postId: string) => {
    setActivePostId(postId);
    setCommentsOpen(true);
  };

  const closeComments = () => {
    setCommentsOpen(false);
    setActivePostId(null);
  };

  // Auto-play videos in viewport
  useEffect(() => {
    console.log('Video refs:', videoRefs.current);
    console.log('Current post index:', currentPostIndex);
    console.log('Current post:', posts[currentPostIndex]);
    
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

  return (
    <div className="relative w-full h-screen bg-black">
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
          variant="light"
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
        className="fixed inset-0 overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
        style={{ scrollSnapType: 'y mandatory', paddingBottom: '64px' }}
      >
        {posts.map((post, index) => (
          <div 
            key={post.id}
            className="relative snap-start snap-always w-full bg-black"
            style={{ height: '100vh', minHeight: '100vh' }}
          >
            {/* Video */}
            <video
              ref={(el) => (videoRefs.current[post.id] = el)}
              src={post.videoUrl}
              className="absolute inset-0 w-full h-full object-contain bg-black"
              style={{ zIndex: 0 }}
              loop
              playsInline
              autoPlay
              muted
              controls
              crossOrigin="anonymous"
              poster={post.profileImage}
              preload="auto"
              onLoadedMetadata={() => console.log('onLoadedMetadata:', post.id)}
              onCanPlay={() => console.log('onCanPlay:', post.id)}
              onProgress={(e) => console.log('onProgress:', post.id, (e.target as HTMLVideoElement).buffered?.length)}
              onStalled={() => console.warn('onStalled:', post.id)}
              onWaiting={() => console.warn('onWaiting:', post.id)}
              onLoadedData={() => console.log('onLoadedData:', post.id)}
              onError={(e) => {
                const v = e.currentTarget as HTMLVideoElement;
                console.error('Video error for post', post.id, e);
                console.log('Video URL:', post.videoUrl);
                console.log('NetworkState:', v.networkState, 'ReadyState:', v.readyState);
              }}
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 pointer-events-none" />

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
                    onError={(e) => {
                      console.error('Profile image failed to load:', post.username);
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                    }}
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

      {posts.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="px-4 py-6 rounded-xl bg-black/40 backdrop-blur-sm">
            <p className="text-white text-lg font-semibold">לא נמצאו סרטונים</p>
            <p className="text-white/70 text-sm mt-1">נסה לבחור קטגוריה אחרת למעלה</p>
          </div>
        </div>
      )}

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
