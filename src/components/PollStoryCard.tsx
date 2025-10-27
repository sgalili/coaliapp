import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, VolumeX, ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { OrganizationType } from "@/components/LocationBadge";
import { PollHeaderCard } from "@/components/PollHeaderCard";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  color?: string;
  // Profile details for expert polls
  avatar?: string;
  city?: string;
  expertise?: string[];
  videoUrl?: string;
  bio?: string;
  stats?: {
    trustScore?: number;
    posts?: number;
    followers?: number;
  };
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
  publishedDate: string;
  expiresAt: string;
  aiNarration: string;
  prosAndCons?: {
    option: string;
    pros: string[];
    cons: string[];
  }[];
  hasUserVoted: boolean;
  userVotedOption?: string;
  pollType: 'simple' | 'multiple' | 'expert' | 'government';
}

interface PollStoryCardProps {
  story: PollStory;
  onVote: (storyId: string, optionId: string) => void;
  onNext: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isActive: boolean;
  showResultsTemporarily?: boolean;
  showShareButton?: boolean;
}

export const PollStoryCard = ({ 
  story, 
  onVote, 
  onNext, 
  isMuted, 
  onToggleMute,
  isActive,
  showResultsTemporarily = false,
  showShareButton = false
}: PollStoryCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isVoting, setIsVoting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const toggleExpansion = (optionId: string) => {
    setExpandedOption(expandedOption === optionId ? null : optionId);
  };

  const handleShare = async () => {
    try {
      // Get current user for affiliate link
      const { data: { user } } = await supabase.auth.getUser();
      
      // Build share URL with affiliate ref if user is logged in
      const baseUrl = `${window.location.origin}/?pollId=${story.id}`;
      const shareUrl = user ? `${baseUrl}&ref=${user.id}` : baseUrl;
      
      // Try native share API first (mobile)
      if (navigator.share) {
        await navigator.share({
          title: story.question,
          text: story.description,
          url: shareUrl,
        });
        toast.success('הקישור שותף!');
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success('הקישור הועתק ללוח!');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share error:', error);
        toast.error('שגיאה בשיתוף');
      }
    }
  };

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

  // Update showResults based on temporary display or permanent vote status
  useEffect(() => {
    setShowResults(showResultsTemporarily || story.hasUserVoted);
  }, [showResultsTemporarily, story.hasUserVoted]);

  // Reset local state when story changes
  useEffect(() => {
    setSelectedOption("");
    setExpandedOption(null);
  }, [story.id]);

  const isExpired = () => {
    const now = new Date();
    const expiry = new Date(story.expiresAt);
    return expiry.getTime() <= now.getTime();
  };

  const handleVote = async () => {
    if (!selectedOption || isVoting || story.hasUserVoted || isExpired()) return;
    
    setIsVoting(true);
    
    setTimeout(() => {
      onVote(story.id, selectedOption);
      setShowResults(true);
      setIsVoting(false);
      
      toast.success("הצבעתך נרשמה בהצלחה! 🗳️", {
        position: "bottom-center",
        duration: 2000
      });

      // Auto-advance after seeing results for 5 seconds
      setTimeout(() => {
        onNext();
      }, 5000);
    }, 500);
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
        
        {/* Poll Header Card */}
        {/* Poll Header Card */}
        <div className="flex justify-center pt-[110px] px-4">
          <PollHeaderCard
            organizationType={story.organizationType}
            organizationName={story.organizationName}
            publishedDate={story.publishedDate}
            expiresAt={story.expiresAt}
            totalVotes={story.totalVotes}
          />
        </div>

        {/* Mute and Share buttons */}
        <div className="absolute top-16 left-4 z-20 flex flex-col gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
            className="w-10 h-10 rounded-full bg-black/30 text-white hover:bg-black/50"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
          
          {showShareButton && (
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="w-10 h-10 rounded-full bg-black/30 text-white hover:bg-black/50"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-start px-6 py-4 pb-32 overflow-y-auto">
          
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
            {story.pollType === 'government' ? (
              <div className="space-y-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/mygov', { replace: false });
                  }}
                  className="w-full p-6 rounded-2xl backdrop-blur-sm transition-all duration-200 text-white font-medium text-lg border-2 bg-white/30 border-white scale-105 hover:bg-white/40 hover:border-white hover:scale-110 active:scale-95"
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold">
                      הממשלה שלי
                    </h3>
                    <p className="text-base opacity-90">
                      הרכיבו את הממשלה שלכם בקליק!
                    </p>
                    <p className="text-sm opacity-75">
                      בחרו בטובים ביותר לתפקידים המתאימים
                    </p>
                  </div>
                </button>
              </div>
            ) : (
              story.options.map((option, index) => (
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
                  // Voting View
                  <div>
                    {story.pollType === 'expert' && option.avatar ? (
                      // Expert candidate with expandable details
                      <div className="space-y-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOption(option.id);
                          }}
                          className={cn(
                            "w-full p-4 rounded-2xl backdrop-blur-sm transition-all duration-200 text-white font-medium text-lg border-2",
                            selectedOption === option.id
                              ? "bg-white/30 border-white scale-105"
                              : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {option.avatar ? (
                                <img 
                                  src={option.avatar} 
                                  alt={option.text}
                                  className="w-10 h-10 rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={`w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ${option.avatar ? 'hidden' : ''}`}>
                                👤
                              </div>
                              <span>{option.text}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleExpansion(option.id);
                              }}
                              className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                            >
                              {expandedOption === option.id ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </button>
                        
                        <Collapsible open={expandedOption === option.id}>
                          <CollapsibleContent className="animate-accordion-down">
                            <div className="mt-2 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                              <div className="text-right space-y-3">
                                <div className="text-white/90 text-sm">
                                  <span className="font-medium">{option.city}</span>
                                </div>
                                
                                {option.expertise && (
                                  <div className="flex flex-wrap gap-1">
                                    {option.expertise.map((exp, idx) => (
                                      <span 
                                        key={idx}
                                        className="px-2 py-1 bg-white/20 rounded-full text-xs text-white text-right"
                                      >
                                        {exp}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                {option.bio && (
                                  <p className="text-white/80 text-sm leading-relaxed">
                                    {option.bio}
                                  </p>
                                )}
                                
                                {option.stats && (
                                  <div className="flex justify-end gap-4 text-xs text-white/70">
                                    {option.stats.trustScore && (
                                      <span>אמינות: {option.stats.trustScore}</span>
                                    )}
                                    {option.stats.posts && (
                                      <span>פוסטים: {option.stats.posts}</span>
                                    )}
                                    {option.stats.followers && (
                                      <span>עוקבים: {option.stats.followers.toLocaleString('he')}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ) : (
                      // Regular option
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOption(option.id);
                        }}
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
                )}
              </div>
              ))
            )}
          </div>

          {/* Vote Button - Only show for non-government polls */}
          {!showResults && story.pollType !== 'government' && (
            <div className="mt-8 mb-40 md:mb-20 max-w-md mx-auto w-full">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote();
                }}
                disabled={!selectedOption || isVoting || isExpired()}
                className={cn(
                  "w-full py-4 text-lg font-bold rounded-2xl transition-all duration-200",
                  selectedOption && !isVoting && !isExpired()
                    ? "bg-white text-black hover:bg-white/90 scale-105"
                    : "bg-white/20 text-white/60 cursor-not-allowed"
                )}
              >
                {isExpired() ? "ההצבעה הסתיימה" : (isVoting ? "מצביע..." : "הצבע עכשיו")}
              </Button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};