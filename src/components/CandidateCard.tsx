import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Eye, CheckCircle } from "lucide-react";
import { toast } from "sonner";

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

  const handleVote = async () => {
    if (candidate.hasUserVoted) {
      toast("כבר הצבעת - ניתן להצביע רק פעם אחת לכל תחום");
      return;
    }

    setIsVoting(true);
    
    setTimeout(() => {
      onVote(candidate.id);
      toast(`ההצבעה נשלחה! 🗳️ הצבעת עבור ${candidate.name}`);
      setIsVoting(false);
    }, 500);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4 shadow-sm">
      {/* Header with avatar and basic info */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative">
          <img
            src={candidate.avatar}
            alt={candidate.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
          />
          {candidate.isVerified && (
            <div className="absolute -top-1 -left-1 bg-primary rounded-full p-1">
              <CheckCircle className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-foreground">{candidate.name}</h3>
            <Badge variant="outline" className="text-xs bg-primary/10">
              {candidate.position}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{candidate.city}</span>
          </div>
          
          {/* Expertise tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {candidate.expertise.map((domain) => (
              <Badge key={domain} variant="secondary" className="text-xs">
                {domain}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Program excerpt */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {candidate.program}
      </p>

      {/* Video thumbnail */}
      <div 
        className="relative bg-muted rounded-lg h-32 mb-3 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => onVideoClick(candidate)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <Eye className="w-3 h-3" />
          צפה
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent mr-1" />
          </div>
        </div>
      </div>

      {/* Stats and vote button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{candidate.voteCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{candidate.supporterCount.toLocaleString()}</span>
          </div>
        </div>

        <Button
          onClick={handleVote}
          disabled={isVoting || candidate.hasUserVoted}
          className={cn(
            "text-sm font-medium",
            candidate.hasUserVoted 
              ? "bg-success text-success-foreground" 
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          )}
          size="sm"
        >
          {isVoting ? (
            "מצביע..."
          ) : candidate.hasUserVoted ? (
            "הצבעת ✓"
          ) : (
            "הצבע"
          )}
        </Button>
      </div>
    </div>
  );
};

function cn(...args: any[]) {
  return args.filter(Boolean).join(' ');
}