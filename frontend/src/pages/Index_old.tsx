import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Heart, Eye, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: 'all', label: 'הכל' },
  { id: 'politics', label: 'פוליטיקה' },
  { id: 'tech', label: 'טכנולוגיה' },
  { id: 'economy', label: 'כלכלה' },
];

const placeholderPosts = [
  { id: '1', username: 'שם משתמש 1', content: 'זהו פוסט לדוגמה. תוכן יטען כאן בקרוב...', trust: '1.2K', watch: '3.4K', comments: '45', zooz: '250' },
  { id: '2', username: 'שם משתמש 2', content: 'דוגמה נוספת לפוסט שיכול להכיל תוכן מעניין ורלוונטי למשתמשים.', trust: '856', watch: '2.1K', comments: '28', zooz: '180' },
  { id: '3', username: 'שם משתמש 3', content: 'פוסט שלישי עם תוכן מדומה להדגמת הממשק והעיצוב של הפלטפורמה.', trust: '2.3K', watch: '5.2K', comments: '67', zooz: '420' },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);
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
        onClick={() => executeProtectedAction(
          () => setShowVideoCreator(true),
          'kyc1',
          {
            authMessage: 'יש להתחבר כדי ליצור פוסט',
            kycMessage: 'נדרש אימות KYC רמה 1 כדי ליצור פוסט'
          }
        )}
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