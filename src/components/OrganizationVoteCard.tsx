import { useState, useEffect } from "react";
import { Building2, Clock, Users, CheckCircle, XCircle, MinusCircle, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
export interface OrganizationVote {
  id: string;
  organization: string;
  organizationType: "foundation" | "company" | "school" | "community";
  title: string;
  description: string;
  targetPhones?: string[];
  targetIds?: string[];
  financialDetails?: {
    amount: string;
    currency: string;
    type: "profit" | "cost" | "investment";
  };
  options: {
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }[];
  totalVotes: number;
  totalMembers: number;
  endDate: Date;
  hasUserVoted: boolean;
  userVotedOption?: string;
  urgency: "low" | "medium" | "high";
}
interface OrganizationVoteCardProps {
  vote: OrganizationVote;
  onVote: (voteId: string, optionId: string) => void;
  onCardTap?: (voteId: string, isVoteButton: boolean) => void;
  isFullscreen?: boolean;
}
export const OrganizationVoteCard = ({
  vote,
  onVote,
  onCardTap,
  isFullscreen = false
}: OrganizationVoteCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(vote.userVotedOption || null);
  const [isVoting, setIsVoting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [hasVoted, setHasVoted] = useState(vote.hasUserVoted);
  const { toast } = useToast();
  const getOrganizationIcon = () => {
    switch (vote.organizationType) {
      case 'foundation':
        return '🏛️';
      case 'company':
        return '🏢';
      case 'school':
        return '🏫';
      case 'community':
        return '🏘️';
      default:
        return '🏢';
    }
  };
  const getUrgencyColor = () => {
    switch (vote.urgency) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getOptionIcon = (optionText: string) => {
    if (optionText.includes('בעד') || optionText.includes('תמיכה')) return CheckCircle;
    if (optionText.includes('נגד') || optionText.includes('התנגדות')) return XCircle;
    return MinusCircle;
  };
  const formatTimeLeft = () => {
    const now = new Date();
    const timeDiff = vote.endDate.getTime() - now.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} ימים`;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    if (hours > 0) return `${hours} שעות`;
    const minutes = Math.floor(timeDiff / (1000 * 60));
    return `${minutes} דקות`;
  };
  const handleVote = async (optionId: string) => {
    if (hasVoted) return;
    
    setIsVoting(true);
    setSelectedOption(optionId);
    
    // Simulate vote processing
    setTimeout(() => {
      setIsVoting(false);
      setShowConfetti(true);
      setEarnedPoints(5);
      setHasVoted(true); // Prevent further voting
      
      // Show success toast with gamification
      toast({
        title: "🎉 הצבעה נרשמה בהצלחה!",
        description: "זכית ב-5 ZooZ! המשך להשפיע על הקהילה שלך",
      });

      onVote(vote.id, optionId);
      
      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }, 1000);
  };

  // Handle card tap for fullscreen toggle
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isVoteButton = target.closest('button')?.getAttribute('data-vote-button') === 'true';
    
    if (onCardTap && !isVoteButton) {
      onCardTap(vote.id, false);
    }
  };

  // Dynamic background for fullscreen mode
  const getFullscreenBackground = () => {
    switch (vote.organizationType) {
      case 'community':
        return 'from-blue-600/20 via-blue-500/10 to-blue-600/20';
      case 'school':
        return 'from-green-600/20 via-green-500/10 to-green-600/20';
      case 'foundation':
        return 'from-purple-600/20 via-purple-500/10 to-purple-600/20';
      default:
        return 'from-gray-600/20 via-gray-500/10 to-gray-600/20';
    }
  };

  // Confetti effect component
  const ConfettiEffect = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 opacity-80 ${
            i % 4 === 0 ? 'bg-yellow-400' :
            i % 4 === 1 ? 'bg-blue-400' :
            i % 4 === 2 ? 'bg-green-400' : 'bg-pink-400'
          } rounded-full`}
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animationDelay: `${Math.random() * 1}s`,
            animation: `confetti-fall-${i} ${2 + Math.random() * 2}s ease-out forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{
        __html: `
          ${[...Array(20)].map((_, i) => `
            @keyframes confetti-fall-${i} {
              0% {
                transform: translateY(-10px) translateX(0) rotate(${Math.random() * 360}deg);
                opacity: 1;
              }
              50% {
                transform: translateY(200px) translateX(${(Math.random() - 0.5) * 100}px) rotate(${Math.random() * 720}deg);
                opacity: 0.8;
              }
              100% {
                transform: translateY(400px) translateX(${(Math.random() - 0.5) * 150}px) rotate(${Math.random() * 1080}deg);
                opacity: 0;
              }
            }
          `).join('')}
        `
      }} />
    </div>
  );
  return <Card 
    className={cn(
      "relative overflow-hidden transition-all duration-500 cursor-pointer",
      isFullscreen 
        ? `w-full h-auto bg-gradient-to-br ${getFullscreenBackground()} backdrop-blur-md border-white/20 shadow-2xl`
        : "w-full max-w-2xl mx-4 mb-6 bg-card/90 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]"
    )}
    onClick={handleCardClick}
  >
      {showConfetti && <ConfettiEffect />}
      
      {/* Points notification */}
      {earnedPoints > 0 && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
          <Trophy className="w-4 h-4" />
          +{earnedPoints} ZooZ!
        </div>
      )}
      <CardHeader className="pb-3">
        {/* Organization Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("text-xl", isFullscreen && "text-2xl")}>{getOrganizationIcon()}</span>
            <div>
              <h3 className={cn(
                "font-semibold",
                isFullscreen ? "text-white text-lg" : "text-foreground"
              )}>{vote.organization}</h3>
              <p className={cn(
                "text-xs",
                isFullscreen ? "text-white/70" : "text-muted-foreground"
              )}>
                {vote.organizationType === 'foundation' ? 'עמותה' : vote.organizationType === 'company' ? 'חברה' : vote.organizationType === 'school' ? 'מוסד חינוך' : 'קהילה'}
              </p>
            </div>
          </div>
          
          {/* Urgency & Time */}
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", getUrgencyColor())} />
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isFullscreen ? "text-white/70" : "text-muted-foreground"
            )}>
              <Clock className="w-3 h-3" />
              <span>{formatTimeLeft()}</span>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-right">
          <h2 className={cn(
            "font-bold mb-2",
            isFullscreen ? "text-2xl text-white mb-4" : "text-lg text-foreground"
          )}>{vote.title}</h2>
          <p className={cn(
            "leading-relaxed",
            isFullscreen ? "text-white/80 text-base" : "text-sm text-muted-foreground"
          )}>{vote.description}</p>
          
          {/* Financial Details */}
          {vote.financialDetails && <div className={cn(
            "mt-3 p-3 rounded-lg border",
            isFullscreen 
              ? "bg-white/10 border-white/20 backdrop-blur-sm" 
              : "bg-primary/5 border-primary/20"
          )}>
              <div className="flex items-center justify-center gap-2">
                <span className={cn("text-2xl", isFullscreen && "text-3xl")}>💰</span>
                <div className="text-center">
                  <p className={cn(
                    "font-bold",
                    isFullscreen 
                      ? "text-2xl text-white" 
                      : "text-lg text-primary"
                  )}>
                    {vote.financialDetails.amount} {vote.financialDetails.currency}
                  </p>
                  <p className={cn(
                    "text-xs",
                    isFullscreen ? "text-white/70" : "text-muted-foreground"
                  )}>
                    {vote.financialDetails.type === 'profit' ? 'רווח משוער' : vote.financialDetails.type === 'cost' ? 'עלות משוערת' : 'השקעה נדרשת'}
                  </p>
                </div>
              </div>
            </div>}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Voting Options */}
        <div className={cn(
          "mb-4",
          isFullscreen && vote.options.length === 2 
            ? "space-y-6" // Vertical layout for fullscreen with 2 options
            : "space-y-3"
        )}>
          {vote.options.map(option => {
          const IconComponent = getOptionIcon(option.text);
          const isSelected = selectedOption === option.id;
          const isUserVote = vote.userVotedOption === option.id;
          return <button 
            key={option.id} 
            onClick={() => handleVote(option.id)} 
            disabled={hasVoted || isVoting} 
            data-vote-button="true"
            className={cn(
              "w-full rounded-lg border transition-all duration-300 text-right relative overflow-hidden",
              hasVoted ? "cursor-not-allowed" : "hover:border-primary/50 cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
              isSelected && !hasVoted && "border-primary bg-primary/5 animate-pulse",
              isUserVote && "border-green-500 bg-green-50 ring-2 ring-green-200",
              isVoting && selectedOption === option.id && "animate-pulse bg-primary/20",
              // Fullscreen specific styles
              isFullscreen && vote.options.length === 2 
                ? "p-6 min-h-[120px] flex items-center" 
                : "p-3"
            )}
          >
            {/* Voting loading effect */}
            {isVoting && selectedOption === option.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 animate-pulse" />
            )}
            
            {/* Already voted indicator */}
            {isUserVote && (
              <div className="absolute top-1 right-1 flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                <CheckCircle className="w-3 h-3" />
                <span>בחירתך</span>
              </div>
            )}
                <div className={cn(
                  "flex items-center",
                  isFullscreen && vote.options.length === 2 
                    ? "flex-col gap-4 text-center w-full" 
                    : "justify-between"
                )}>
                  {/* Percentage and Icon */}
                  <div className={cn(
                    "flex items-center gap-2",
                    isFullscreen && vote.options.length === 2 && "flex-col gap-3"
                  )}>
                    <IconComponent className={cn(
                      option.text.includes('בעד') ? "text-green-500" : option.text.includes('נגד') ? "text-red-500" : "text-gray-500",
                      isFullscreen ? "w-8 h-8" : "w-4 h-4"
                    )} />
                    <span className={cn(
                      "font-bold",
                      isFullscreen ? "text-4xl text-white" : "text-xs font-medium"
                    )}>{option.percentage}%</span>
                  </div>
                  
                  {/* Option Text and Progress */}
                  <div className={cn(
                    isFullscreen && vote.options.length === 2 
                      ? "w-full text-center" 
                      : "flex-1 text-right py-0 mx-[10px] my-0"
                  )}>
                    <p className={cn(
                      "font-medium",
                      isFullscreen ? "text-xl text-white mb-3" : "text-sm"
                    )}>{option.text}</p>
                    <div className={cn(
                      isFullscreen && vote.options.length === 2 ? "mt-3" : "mt-1"
                    )}>
                      <Progress 
                        value={option.percentage} 
                        className={cn(
                          isFullscreen ? "h-3" : "h-1"
                        )} 
                      />
                    </div>
                  </div>
                </div>
              </button>;
        })}
        </div>

        {/* Vote Stats */}
        <div className={cn(
          "flex items-center justify-between pt-3 border-t",
          isFullscreen ? "border-white/20" : "border-border/50"
        )}>
          <div className={cn(
            "flex items-center gap-1 text-xs",
            isFullscreen ? "text-white/70" : "text-muted-foreground"
          )}>
            <Users className="w-3 h-3" />
            <span>{vote.totalVotes} הצביעו מתוך {vote.totalMembers}</span>
          </div>
          
          {hasVoted ? (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>הצבעתך נרשמה בהצלחה!</span>
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </div>
          ) : isVoting ? (
            <div className="flex items-center gap-2 text-primary font-medium">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>רושם הצבעה...</span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>;
};