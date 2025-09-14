import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocationBadge, OrganizationType } from "@/components/LocationBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  color?: string;
}

export interface PollStory {
  id: string;
  question: string;
  description?: string;
  options: PollOption[];
  totalVotes: number;
  backgroundImage?: string;
  backgroundVideo?: string;
  organizationType: OrganizationType;
  organizationName: string;
  aiNarration: string;
  prosAndCons?: {
    option: string;
    pros: string[];
    cons: string[];
  }[];
  hasUserVoted: boolean;
  userVotedOption?: string;
  pollType: 'simple' | 'multiple' | 'expert';
}

interface PollStoryCardProps {
  story: PollStory;
  onVote: (storyId: string, optionId: string) => void;
  onNext: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isActive: boolean;
}

export const PollStoryCard = ({ 
  story, 
  onVote, 
  onNext, 
  isMuted, 
  onToggleMute,
  isActive 
}: PollStoryCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isVoting, setIsVoting] = useState(false);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);
  const [showResults, setShowResults] = useState(story.hasUserVoted);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play();
    } else {
      video.pause();
    }
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);

  const handleVote = async () => {
    if (!selectedOption || isVoting || story.hasUserVoted) return;
    
    setIsVoting(true);
    
    setTimeout(() => {
      onVote(story.id, selectedOption);
      setShowResults(true);
      setIsVoting(false);
      
      toast.success("הצבעתך נרשמה בהצלחה! 🗳️", {
        position: "bottom-center",
        duration: 2000
      });

      // Auto-advance after seeing results for 3 seconds
      setTimeout(() => {
        onNext();
      }, 3000);
    }, 500);
  };

  const playNarration = async () => {
    setIsNarrationPlaying(true);
    
    // Simulate AI narration (would use ElevenLabs in real implementation)
    setTimeout(() => {
      setIsNarrationPlaying(false);
    }, 5000);
    
    toast.success("מפעיל הסבר בינה מלאכותית...", {
      position: "bottom-center",
      duration: 2000
    });
  };

  const getBackgroundElement = () => {
    if (story.backgroundVideo) {
      return (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          playsInline
          muted={isMuted}
          autoPlay={isActive}
          src={story.backgroundVideo}
        />
      );
    }
    
    if (story.backgroundImage) {
      return (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${story.backgroundImage})` }}
        />
      );
    }
    
    // Default gradient background
    return (
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/80 via-primary/60 to-primary/40" />
    );
  };

  return (
    <div className="relative h-screen w-full snap-start snap-always flex flex-col">
      {/* Background */}
      {getBackgroundElement()}
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        
        {/* Top controls */}
        <div className="flex items-center justify-between p-4 pt-16">
          <LocationBadge 
            type={story.organizationType} 
            name={story.organizationName} 
          />
          
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={playNarration}
              className="w-10 h-10 rounded-full bg-black/30 text-white hover:bg-black/50"
              disabled={isNarrationPlaying}
            >
              {isNarrationPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={onToggleMute}
              className="w-10 h-10 rounded-full bg-black/30 text-white hover:bg-black/50"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-center px-6">
          
          {/* Question */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
              {story.question}
            </h2>
            {story.description && (
              <p className="text-white/90 text-base leading-relaxed">
                {story.description}
              </p>
            )}
          </div>

          {/* Poll Options */}
          <div className="space-y-4 max-w-md mx-auto w-full">
            {story.options.map((option, index) => (
              <div key={option.id}>
                {showResults ? (
                  // Results View
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/90 font-medium">
                        {option.percentage}%
                      </span>
                      <span className={cn(
                        "text-white font-medium",
                        story.userVotedOption === option.id && "font-bold"
                      )}>
                        {option.text}
                        {story.userVotedOption === option.id && " ✓"}
                      </span>
                    </div>
                    
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                      <div
                        className={cn(
                          "h-full transition-all duration-1000 ease-out rounded-full",
                          story.userVotedOption === option.id 
                            ? "bg-white" 
                            : "bg-white/60"
                        )}
                        style={{ width: `${option.percentage}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  // Voting View - Instagram Stories style
                  <button
                    onClick={() => setSelectedOption(option.id)}
                    className={cn(
                      "w-full p-4 rounded-2xl backdrop-blur-sm transition-all duration-200 text-white font-medium text-lg border-2",
                      selectedOption === option.id
                        ? "bg-white/30 border-white scale-105"
                        : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50"
                    )}
                  >
                    {option.text}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Vote Button */}
          {!showResults && (
            <div className="mt-8 max-w-md mx-auto w-full">
              <Button
                onClick={handleVote}
                disabled={!selectedOption || isVoting}
                className={cn(
                  "w-full py-4 text-lg font-bold rounded-2xl transition-all duration-200",
                  selectedOption && !isVoting
                    ? "bg-white text-black hover:bg-white/90 scale-105"
                    : "bg-white/20 text-white/60 cursor-not-allowed"
                )}
              >
                {isVoting ? "מצביע..." : "הצבע עכשיו"}
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">
              {story.totalVotes.toLocaleString('he')} משתתפים
            </p>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="p-6 text-center">
          <p className="text-white/60 text-sm">
            החליק למעלה להמשיך
          </p>
        </div>

      </div>
    </div>
  );
};