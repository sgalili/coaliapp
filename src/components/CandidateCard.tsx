import { useState } from "react";
import { Play, CheckCircle, Vote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface Candidate {
  id: string;
  name: string;
  position: string;
  city: string;
  avatar: string;
  videoUrl: string;
  expertise: string[];
  voteCount: number;
  supporterCount: number;
  hasUserVoted: boolean;
  isVerified: boolean;
  program: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  onVideoClick: (candidate: Candidate) => void;
  onVote: (candidateId: string) => void;
}

export const CandidateCard = ({ candidate, onVideoClick, onVote }: CandidateCardProps) => {
  const [isVoting, setIsVoting] = useState(false);
  const { toast } = useToast();

  const handleVote = async () => {
    if (candidate.hasUserVoted || isVoting) return;
    
    setIsVoting(true);
    
    setTimeout(() => {
      onVote(candidate.id);
      setIsVoting(false);
      
      toast({
        title: "קול נרשם בהצלחה! ✅",
        description: `הצבעת עבור ${candidate.name}`,
      });
    }, 500);
  };

  return (
    <div className="w-full bg-background border-b border-border">
      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Header with Avatar and Info */}
        <div className="flex items-start gap-3">
          <div className="relative">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {candidate.isVerified && (
              <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full text-blue-500 fill-current" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground text-right">{candidate.name}</h3>
                <p className="text-muted-foreground text-sm text-right">
                  {candidate.position} • {candidate.city}
                </p>
              </div>
              
              {/* Vote Button */}
              <button
                onClick={handleVote}
                disabled={candidate.hasUserVoted || isVoting}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200",
                  candidate.hasUserVoted 
                    ? "bg-green-100 text-green-700 cursor-not-allowed"
                    : isVoting
                    ? "bg-primary/70 text-primary-foreground"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95"
                )}
              >
                <Vote className="w-4 h-4" />
                <span>
                  {candidate.hasUserVoted ? "הצבעת" : isVoting ? "מצביע..." : "הצבע"}
                </span>
              </button>
            </div>
            
            {/* Expertise Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {candidate.expertise.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Program Excerpt */}
        <div className="text-right">
          <p className="text-foreground text-sm leading-relaxed">
            {candidate.program}
          </p>
        </div>

        {/* Video Thumbnail */}
        <div className="relative">
          <div 
            onClick={() => onVideoClick(candidate)}
            className="relative aspect-video bg-muted rounded-xl overflow-hidden cursor-pointer group"
          >
            <video
              src={candidate.videoUrl}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
            />
            
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-primary fill-current ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Vote className="w-4 h-4" />
              <span>{candidate.voteCount.toLocaleString('he')} קולות</span>
            </div>
            <div className="flex items-center gap-1">
              <span>👥</span>
              <span>{candidate.supporterCount.toLocaleString('he')} תומכים</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};