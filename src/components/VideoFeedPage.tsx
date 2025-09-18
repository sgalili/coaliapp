import React, { useState } from "react";
import { VideoFeed, VideoPost } from "@/components/VideoFeed";
import { VoteFilters, VoteFilterType } from "@/components/VoteFilters";
import { Plus } from "lucide-react";

// Import profile images
import netanyahuProfile from "@/assets/netanyahu-profile.jpg";
import yaakovProfile from "@/assets/yaakov-profile.jpg";
import yaronProfile from "@/assets/yaron-zelekha-profile.jpg";
import mayaProfile from "@/assets/maya-profile.jpg";
import warrenBuffettProfile from "@/assets/warren-buffett-profile.jpg";

interface VideoFeedPageProps {
  activeFilter: VoteFilterType;
  onFilterChange: (filter: VoteFilterType) => void;
  onTrust: (postId: string, post: VideoPost, isGivingTrust: boolean) => void;
  onWatch: (postId: string, isWatching?: boolean) => void;
  onZooz: (postId: string) => void;
  onVote: (postId: string, ministryPosition: string, isCurrentlyVoted: boolean) => void;
  onCreateContent?: () => void;
  userBalance: number;
  currentUserId?: string;
  isMuted: boolean;
  onVolumeToggle: () => void;
}

// Mock data for candidates and experts videos
const mockCandidateVideos: VideoPost[] = [
  {
    id: "cand-1",
    username: "בנימין נתניהו",
    handle: "@netanyahu",
    profileImage: netanyahuProfile,
    videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755817615/netanyahu-debate_fitgzh.mp4",
    caption: "עמדתי לגבי הרפורמה המשפטית ומה שצריך להיעשות עכשיו",
    trustCount: 234567,
    watchCount: 1200000,
    commentCount: 45678,
    shareCount: 23456,
    zoozCount: 89012,
    isVerified: true,
    kycLevel: 3,
    expertise: "מנהיגות ופוליטיקה",
    category: "politics",
    isLive: true,
    // Vote properties
    isVotable: true,
    ministryPosition: "prime_minister",
    voteCount: 1247,
    hasUserVoted: false,
    hasUserTrusted: false,
    hasUserWatched: false,
    userZoozSent: 0,
    authenticityData: {
      city: "ירושלים",
      country: "ישראל", 
      localTime: "14:30",
      isAuthentic: true
    }
  },
  {
    id: "cand-2", 
    username: "ירון זליכה",
    handle: "@yaronzelekha",
    profileImage: yaronProfile,
    videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755818123/%D7%90%D7%96_%D7%9E%D7%94_%D7%90%D7%AA%D7%94_%D7%91%D7%A2%D7%A6%D7%9D_%D7%9E%D7%A6%D7%99%D7%A2__jb7xb0.mp4",
    caption: "ניתוח כלכלי מעמיק של המצב הנוכחי ודרכי הפתרון",
    trustCount: 156789,
    watchCount: 890000,
    commentCount: 34567,
    shareCount: 18901,
    zoozCount: 67234,
    isVerified: true,
    kycLevel: 3,
    expertise: "כלכלה אקדמית",
    category: "economy",
    // Vote properties
    isVotable: true,
    ministryPosition: "economics",
    voteCount: 892,
    hasUserVoted: false,
    hasUserTrusted: false,
    hasUserWatched: false,
    userZoozSent: 0,
    authenticityData: {
      city: "ירושלים",
      country: "ישראל",
      localTime: "14:30", 
      isAuthentic: true
    }
  }
];

const mockExpertVideos: VideoPost[] = [
  {
    id: "exp-1",
    username: "יעקב אליעזרוב",
    handle: "@yaakoveliezerov", 
    profileImage: yaakovProfile,
    videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755819172/Thank_you_Hashem_telaviv_israel_jewellery_diamonds_jeweler_gold_aupgtx.mp4",
    caption: "תודה לה' על הברכות בעסק התכשיטים והיהלומים",
    trustCount: 45678,
    watchCount: 230000,
    commentCount: 8901,
    shareCount: 4567,
    zoozCount: 15432,
    isVerified: true,
    kycLevel: 2,
    expertise: "תכשיטים ועסקים",
    category: "jewelry",
    // Not votable - expert only
    isVotable: false,
    hasUserTrusted: false,
    hasUserWatched: false,
    userZoozSent: 0,
    authenticityData: {
      city: "תל אביב",
      country: "ישראל",
      localTime: "14:30",
      isAuthentic: true
    }
  },
  {
    id: "exp-2",
    username: "Warren Buffett",
    handle: "@warrenbuffett",
    profileImage: warrenBuffettProfile, 
    videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755818920/Warren_Buffett_-_Best_advice_ever_lhuq7u.mp4",
    caption: "Best investment advice ever - lessons for long-term wealth building",
    trustCount: 567890,
    watchCount: 2100000,
    commentCount: 89012,
    shareCount: 45678,
    zoozCount: 123456,
    isVerified: true,
    kycLevel: 3,
    expertise: "השקעות ופיננסים",
    category: "economy",
    // Not votable - expert only
    isVotable: false,
    hasUserTrusted: false,
    hasUserWatched: false,
    userZoozSent: 0,
    authenticityData: {
      city: "Omaha",
      country: "USA",
      localTime: "07:30",
      isAuthentic: true
    }
  },
  {
    id: "exp-3",
    username: "ד״ר מאיה רוזמן",
    handle: "@mayarosman",
    profileImage: mayaProfile, 
    videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1758201447/%D7%9E%D7%A9%D7%A8%D7%93_%D7%94%D7%97%D7%A7%D7%9C%D7%90%D7%95%D7%AA_-_%D7%9C%D7%9E%D7%94_%D7%97%D7%A9%D7%95%D7%91_%D7%9C%D7%A9%D7%9C%D7%91_%D7%99%D7%A8%D7%A7%D7%95%D7%AA_%D7%91%D7%9B%D7%9C_%D7%90%D7%A8%D7%95%D7%97%D7%94_-_%D7%93_%D7%A8_%D7%9E%D7%90%D7%99%D7%94_%D7%A8%D7%95%D7%96%D7%9E%D7%9F_zl4xtm.mp4",
    caption: "משרד החקלאות - למה חשוב לשלב ירקות בכל ארוחה",
    trustCount: 67234,
    watchCount: 320000,
    commentCount: 9876,
    shareCount: 6789,
    zoozCount: 18901,
    isVerified: true,
    kycLevel: 2,
    expertise: "דיאטה ותזונה",
    category: "technology",
    // Not votable - expert only
    isVotable: false,
    hasUserTrusted: false,
    hasUserWatched: false,
    userZoozSent: 0,
    authenticityData: {
      city: "חיפה",
      country: "ישראל",
      localTime: "14:30",
      isAuthentic: true
    }
  }
];

export const VideoFeedPage = ({ 
  activeFilter, 
  onFilterChange, 
  onTrust, 
  onWatch, 
  onZooz, 
  onVote,
  onCreateContent,
  userBalance,
  currentUserId,
  isMuted,
  onVolumeToggle 
}: VideoFeedPageProps) => {
  // State to track user interactions with posts
  const [postStates, setPostStates] = useState<Record<string, {
    hasUserTrusted: boolean;
    hasUserWatched: boolean;
    hasUserVoted: boolean;
    userZoozSent: number;
  }>>({});

  // Enhanced handlers that update local state + call parent callbacks
  const handleTrustWithState = (postId: string, post: VideoPost, isGivingTrust: boolean) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        hasUserTrusted: !prev[postId]?.hasUserTrusted
      }
    }));
    onTrust(postId, post, isGivingTrust);
  };

  const handleWatchWithState = (postId: string) => {
    const isCurrentlyWatched = postStates[postId]?.hasUserWatched;
    const willWatch = !isCurrentlyWatched;
    
    setPostStates(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        hasUserWatched: !prev[postId]?.hasUserWatched
      }
    }));
    
    // Pass watch status to parent
    onWatch(postId, willWatch);
  };

  const handleZoozWithState = (postId: string) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        userZoozSent: (prev[postId]?.userZoozSent || 0) + 1
      }
    }));
    onZooz(postId);
  };

  const handleVoteWithState = (postId: string, ministryPosition: string) => {
    const isCurrentlyVoted = postStates[postId]?.hasUserVoted ?? false;
    
    setPostStates(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        hasUserVoted: !prev[postId]?.hasUserVoted
      }
    }));
    onVote(postId, ministryPosition, isCurrentlyVoted);
  };
  // Get appropriate videos based on filter with updated states
  const getVideos = (): VideoPost[] => {
    const baseVideos = activeFilter === 'candidates' 
      ? [...mockCandidateVideos, ...mockExpertVideos]
      : mockCandidateVideos;
    
    // Merge with current user interaction states
    return baseVideos.map(post => ({
      ...post,
      hasUserTrusted: postStates[post.id]?.hasUserTrusted ?? post.hasUserTrusted,
      hasUserWatched: postStates[post.id]?.hasUserWatched ?? post.hasUserWatched,
      hasUserVoted: postStates[post.id]?.hasUserVoted ?? post.hasUserVoted,
      userZoozSent: postStates[post.id]?.userZoozSent ?? post.userZoozSent,
    }));
  };

  return (
    <div className="relative min-h-screen">
      {/* Floating Filters */}
      <div className="fixed top-4 left-0 right-0 z-40 px-4">
        <VoteFilters 
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>

      {/* Create Content Button */}
      {onCreateContent && (
        <button
          onClick={onCreateContent}
          className="fixed top-4 left-6 z-50 w-8 h-8 bg-muted/80 text-foreground rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors backdrop-blur-sm border border-border/20"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}

      {/* Video Feed */}
      <VideoFeed
        posts={getVideos()}
        onTrust={handleTrustWithState}
        onWatch={handleWatchWithState}
        onZooz={handleZoozWithState}
        onVote={handleVoteWithState}
        userBalance={userBalance}
        currentUserId={currentUserId}
        isMuted={isMuted}
        onVolumeToggle={onVolumeToggle}
      />
    </div>
  );
};