import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, Clock } from "lucide-react";
import { toast } from "sonner";

export interface Poll {
  id: string;
  question: string;
  description: string;
  options: {
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }[];
  totalVotes: number;
  endDate: string;
  category: string;
  hasUserVoted: boolean;
  userChoice?: string;
}

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
}

export const PollCard = ({ poll, onVote }: PollCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (!selectedOption) {
      toast("בחר אפשרות לפני ההצבעה");
      return;
    }

    if (poll.hasUserVoted) {
      toast("כבר הצבעת בסקר זה");
      return;
    }

    setIsVoting(true);
    
    setTimeout(() => {
      onVote(poll.id, selectedOption);
      toast("ההצבעה נרשמה! 📊 תודה על השתתפותך");
      setIsVoting(false);
    }, 500);
  };

  const isExpired = new Date() > new Date(poll.endDate);
  
  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(poll.endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "הסקר הסתיים";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} ימים`;
    return `${hours} שעות`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <Badge variant="outline" className="text-xs">
              {poll.category}
            </Badge>
          </div>
          <h3 className="font-bold text-lg text-foreground leading-tight">
            {poll.question}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {poll.description}
          </p>
        </div>
      </div>

      {/* Poll Options */}
      <div className="space-y-3 mb-4">
        {poll.options.map((option) => (
          <div
            key={option.id}
            className={cn(
              "relative border rounded-lg p-3 cursor-pointer transition-all",
              poll.hasUserVoted 
                ? poll.userChoice === option.id 
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
                : selectedOption === option.id 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
            )}
            onClick={() => !poll.hasUserVoted && !isExpired && setSelectedOption(option.id)}
          >
            {/* Progress bar background for results */}
            {poll.hasUserVoted && (
              <div 
                className="absolute inset-0 bg-primary/10 rounded-lg transition-all duration-500"
                style={{ width: `${option.percentage}%` }}
              />
            )}
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!poll.hasUserVoted && !isExpired && (
                  <div className={cn(
                    "w-4 h-4 border-2 rounded-full transition-colors",
                    selectedOption === option.id 
                      ? "border-primary bg-primary" 
                      : "border-muted-foreground"
                  )}>
                    {selectedOption === option.id && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-full m-0.5" />
                    )}
                  </div>
                )}
                <span className="font-medium text-foreground">{option.text}</span>
              </div>
              
              {poll.hasUserVoted && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{option.percentage}%</span>
                  <span>({option.votes.toLocaleString()})</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{poll.totalVotes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{getTimeRemaining()}</span>
          </div>
        </div>

        {!poll.hasUserVoted && !isExpired && (
          <Button
            onClick={handleVote}
            disabled={isVoting || !selectedOption}
            className="text-sm font-medium"
            size="sm"
          >
            {isVoting ? "מצביע..." : "הצבע"}
          </Button>
        )}

        {poll.hasUserVoted && (
          <Badge variant="secondary" className="text-xs">
            הצבעת ✓
          </Badge>
        )}

        {isExpired && !poll.hasUserVoted && (
          <Badge variant="outline" className="text-xs">
            הסקר הסתיים
          </Badge>
        )}
      </div>
    </div>
  );
};

function cn(...args: any[]) {
  return args.filter(Boolean).join(' ');
}