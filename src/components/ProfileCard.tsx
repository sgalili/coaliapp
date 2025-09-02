import { useState } from "react";
import { Play, CheckCircle, Vote, Heart, TrendingUp, TrendingDown, X, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  name: string;
  position: string;
  city: string;
  avatar: string;
  videoUrl: string;
  expertise: string[];
  voteCount?: number;
  trustCount?: number;
  hasUserVoted?: boolean;
  hasUserTrusted?: boolean;
  isVerified: boolean;
  type: 'candidate' | 'expert';
  trustRank?: number;
  trustTrend?: 'up' | 'down' | 'stable';
}

interface ProfileCardProps {
  profile: Profile;
  onVideoClick: (profile: Profile) => void;
  onVote?: (profileId: string) => void;
  onTrust?: (profileId: string) => void;
  onProfileClick?: (profileId: string) => void;
  onDismiss?: (profileId: string) => void;
}

export const ProfileCard = ({ profile, onVideoClick, onVote, onTrust, onProfileClick, onDismiss }: ProfileCardProps) => {
  const [isVoting, setIsVoting] = useState(false);
  const [isTrusting, setIsTrusting] = useState(false);
  const { toast } = useToast();

  const handleVote = async () => {
    if (profile.hasUserVoted || isVoting || !onVote) return;
    
    setIsVoting(true);
    setTimeout(() => {
      onVote(profile.id);
      setIsVoting(false);
      toast({
        title: "קול נרשם! ✅",
        description: `הצבעת עבור ${profile.name}`,
      });
    }, 500);
  };

  const handleTrust = async () => {
    if (profile.hasUserTrusted || isTrusting || !onTrust) return;
    
    setIsTrusting(true);
    setTimeout(() => {
      onTrust(profile.id);
      setIsTrusting(false);
      toast({
        title: "אמון נשלח! 💙",
        description: `נתת אמון ל${profile.name}`,
      });
    }, 500);
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick(profile.id);
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDismiss) {
      onDismiss(profile.id);
    }
  };

  const getTrustTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-trust" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-shrink-0 w-48 bg-background border border-border rounded-xl p-3 shadow-sm relative">
      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="absolute top-1 left-1 w-5 h-5 flex items-center justify-center z-10 transition-colors hover:opacity-70"
        >
          <X className="w-3 h-3 text-muted-foreground" />
        </button>
      )}

      {/* Profile Header */}
      <div 
        className="flex items-center gap-2 mb-3 cursor-pointer"
        onClick={handleProfileClick}
      >
        <div className="relative">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {profile.isVerified && (
            <CheckCircle className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-background rounded-full text-blue-500 fill-current" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground truncate text-right">
            {profile.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate text-right">
            {profile.city}
          </p>
        </div>
      </div>

      {/* Video Thumbnail */}
      <div 
        onClick={() => onVideoClick(profile)}
        className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer group mb-3"
      >
        <video
          src={profile.videoUrl}
          className="w-full h-full object-cover"
          muted
          preload="metadata"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-3 h-3 text-primary fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Expertise Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {profile.expertise.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {profile.type === 'candidate' && onVote && (
          <button
            onClick={handleVote}
            disabled={profile.hasUserVoted || isVoting}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm",
              profile.hasUserVoted 
                ? "bg-green-100 text-green-700 cursor-not-allowed"
                : isVoting
                ? "bg-primary/70 text-primary-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95"
            )}
          >
            <Vote className="w-4 h-4" />
            <span>
              {profile.hasUserVoted ? "הצבעת" : isVoting ? "מצביע..." : "הצבע"}
            </span>
          </button>
        )}

        {profile.type === 'expert' && onTrust && (
          <button
            onClick={handleTrust}
            disabled={profile.hasUserTrusted || isTrusting}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm",
              profile.hasUserTrusted 
                ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                : isTrusting
                ? "bg-blue-600/70 text-white"
                : "bg-blue-600 text-white hover:bg-blue-600/90 hover:scale-105 active:scale-95"
            )}
          >
            <Heart className="w-4 h-4" />
            <span>
              {profile.hasUserTrusted ? "נתת אמון" : isTrusting ? "שולח..." : "אמון"}
            </span>
          </button>
        )}

        {/* Stats */}
        <div 
          className="flex items-center justify-center gap-3 text-xs text-muted-foreground cursor-pointer"
          onClick={handleProfileClick}
        >
          {profile.type === 'candidate' && profile.voteCount && (
            <div className="flex items-center gap-1">
              <Vote className="w-3 h-3" />
              <span>{profile.voteCount.toLocaleString('he')}</span>
            </div>
          )}
          {profile.type === 'expert' && profile.trustCount && (
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{profile.trustCount.toLocaleString('he')}</span>
            </div>
          )}
          {profile.trustRank && (
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3 text-trust" />
              <span>{profile.trustRank}</span>
              {getTrustTrendIcon(profile.trustTrend)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};