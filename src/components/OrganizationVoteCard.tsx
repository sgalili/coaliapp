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
}
export const OrganizationVoteCard = ({
  vote,
  onVote
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
  return <Card className="w-full max-w-2xl mx-4 mb-6 border border-border/50 bg-card/90 backdrop-blur-sm relative overflow-hidden">
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
            <span className="text-xl">{getOrganizationIcon()}</span>
            <div>
              <h3 className="font-semibold text-foreground">{vote.organization}</h3>
              <p className="text-xs text-muted-foreground">
                {vote.organizationType === 'foundation' ? 'עמותה' : vote.organizationType === 'company' ? 'חברה' : vote.organizationType === 'school' ? 'מוסד חינוך' : 'קהילה'}
              </p>
            </div>
          </div>
          
          {/* Urgency & Time */}
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", getUrgencyColor())} />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formatTimeLeft()}</span>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-right">
          <h2 className="text-lg font-bold text-foreground mb-2">{vote.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{vote.description}</p>
          
          {/* Financial Details */}
          {vote.financialDetails && <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">💰</span>
                <div className="text-center">
                  <p className="font-bold text-lg text-primary">
                    {vote.financialDetails.amount} {vote.financialDetails.currency}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {vote.financialDetails.type === 'profit' ? 'רווח משוער' : vote.financialDetails.type === 'cost' ? 'עלות משוערת' : 'השקעה נדרשת'}
                  </p>
                </div>
              </div>
            </div>}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Voting Options */}
        <div className="space-y-3 mb-4">
          {vote.options.map(option => {
          const IconComponent = getOptionIcon(option.text);
          const isSelected = selectedOption === option.id;
          const isUserVote = vote.userVotedOption === option.id;
          return <button 
            key={option.id} 
            onClick={() => handleVote(option.id)} 
            disabled={hasVoted || isVoting} 
            className={cn(
              "w-full p-3 rounded-lg border transition-all duration-300 text-right relative overflow-hidden",
              hasVoted ? "cursor-not-allowed" : "hover:border-primary/50 cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
              isSelected && !hasVoted && "border-primary bg-primary/5 animate-pulse",
              isUserVote && "border-green-500 bg-green-50 ring-2 ring-green-200",
              isVoting && selectedOption === option.id && "animate-pulse bg-primary/20"
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className={cn("w-4 h-4", option.text.includes('בעד') ? "text-green-500" : option.text.includes('נגד') ? "text-red-500" : "text-gray-500")} />
                    <span className="text-xs font-medium">{option.percentage}%</span>
                  </div>
                  
                  <div className="flex-1 text-right py-0 mx-[10px] my-0">
                    <p className="font-medium text-sm">{option.text}</p>
                    <div className="mt-1">
                      <Progress value={option.percentage} className="h-1" />
                    </div>
                  </div>
                </div>
              </button>;
        })}
        </div>

        {/* Vote Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
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