import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { VideoCreator } from "@/components/VideoCreator";
import { VideoFeed } from "@/components/VideoFeed";
import { FeedFilters } from "@/components/FeedFilters";
import { useToast } from "@/hooks/use-toast";
import { usePosts, PostData } from "@/hooks/usePosts";
import { usePostInteractions } from "@/hooks/usePostInteractions";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimePosts } from "@/hooks/useRealtimePosts";
import { Plus } from "lucide-react";

export default function Index() {
  const [showVideoCreator, setShowVideoCreator] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [feedFilter, setFeedFilter] = useState<{
    type: 'all' | 'trusted' | 'category';
    category?: string;
  }>({ type: 'all' });

  const { toast } = useToast();
  const { user } = useAuth();
  const { posts, loading, createPost, updatePostCounts } = usePosts();
  const { 
    userBalance, 
    giveTrust, 
    toggleWatch, 
    sendZooz, 
    updateView,
    isTrusted,
    isWatched
  } = usePostInteractions();

  // Real-time updates
  useRealtimePosts(
    posts,
    (postId, updates) => updatePostCounts(postId, updates),
    (newPost) => {
      // New post added - could show a notification or auto-refresh
      console.log('New post received:', newPost);
    }
  );

  useEffect(() => {
    // Set RTL direction for the entire app
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  const handleTrust = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const success = await giveTrust(postId, post.user_id);
    if (success) {
      // Update local post counts
      const newCount = isTrusted(postId, post.user_id) 
        ? post.trust_count + 1 
        : post.trust_count - 1;
      // Note: We could implement a real-time count update here
    }
  };

  const handleWatch = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const success = await toggleWatch(postId, post.user_id);
    if (success) {
      // Update local counts if needed
      const newCount = isWatched(postId, post.user_id) 
        ? post.watch_count + 1 
        : post.watch_count - 1;
    }
  };

  const handleZooz = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const success = await sendZooz(postId, post.user_id, 1);
    // Success feedback is handled in the hook
  };

  const handlePublish = async (postData: {
    content: string;
    videoBlob?: Blob;
    category?: string;
    isLive?: boolean;
  }): Promise<boolean> => {
    const result = await createPost(postData);
    return result !== null;
  };

  const convertPostsToVideoFeed = (postsData: PostData[]) => {
    return postsData.map(post => ({
      id: post.id,
      username: `${post.profiles?.first_name} ${post.profiles?.last_name}` || 'Utilisateur',
      handle: `user_${post.user_id.slice(0, 8)}`,
      profileImage: post.profiles?.avatar_url || undefined,
      videoUrl: post.video_url || '',
      caption: post.content || '',
      trustCount: post.trust_count,
      watchCount: post.watch_count, 
      commentCount: post.comment_count,
      shareCount: post.share_count,
      zoozCount: post.zooz_earned,
      isVerified: true, // TODO: Add verification logic
      kycLevel: 2 as const, // TODO: Get from user KYC
      expertise: post.category || 'Expert',
      category: post.category as any || 'expert',
      isLive: post.is_live,
      authenticityData: {
        city: "Non disponible",
        country: "Non disponible", 
        localTime: new Date(post.created_at).toLocaleString('fr-FR'),
        isAuthentic: false // TODO: Add authenticity verification
      }
    }));
  };

  const getFilteredPosts = () => {
    const convertedPosts = convertPostsToVideoFeed(posts);
    
    switch (feedFilter.type) {
      case 'trusted':
        return convertedPosts.sort((a, b) => b.trustCount - a.trustCount);
      case 'category':
        if (feedFilter.category) {
          return convertedPosts.filter(post => post.category === feedFilter.category);
        }
        return convertedPosts;
      case 'all':
      default:
        return convertedPosts;
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background relative overflow-hidden" dir="rtl">
      {/* Create Post Button */}
      <button
        onClick={() => setShowVideoCreator(true)}
        className="fixed top-6 left-6 z-50 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Créer un post"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Video Feed */}
      <VideoFeed
        posts={getFilteredPosts()}
        onTrust={handleTrust}
        onWatch={handleWatch}
        onZooz={handleZooz}
        userBalance={userBalance}
        currentUserId={user?.id}
        isMuted={isMuted}
        onVolumeToggle={() => setIsMuted(!isMuted)}
      />

      {/* Feed Filters */}
      <FeedFilters 
        activeFilter={feedFilter}
        onFilterChange={setFeedFilter}
      />

      {/* Navigation */}
      <Navigation zoozBalance={userBalance} />

      {/* Video Creator Modal */}
      {showVideoCreator && (
        <VideoCreator
          onClose={() => setShowVideoCreator(false)}
          onPublish={handlePublish}
        />
      )}
    </div>
  );
}