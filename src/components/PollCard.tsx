import { useState } from "react";
import { Vote, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  endDate: Date;
  category: string;
  hasUserVoted: boolean;
  userVotedOption?: string;
}

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
}

export const PollCard = ({ poll, onVote }: PollCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (!selectedOption || isVoting || poll.hasUserVoted) return;
    
    setIsVoting(true);
    
    setTimeout(() => {
      onVote(poll.id, selectedOption);
      setIsVoting(false);
    }, 500);
  };

  const isExpired = new Date() > poll.endDate;

  const getTimeRemaining = () => {
    const now = new Date();
    const diff = poll.endDate.getTime() - now.getTime();
    
    if (diff <= 0) return "הסתיים";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} ימים נותרו`;
    return `${hours} שעות נותרו`;
  };

  return (
    <div className="w-full bg-background border border-border rounded-xl shadow-sm mx-0">
      <div className="p-4 space-y-4">
        {/* Poll Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-right text-lg mb-2">
              {poll.question}
            </h3>
            
            {poll.description && (
              <p className="text-muted-foreground text-sm text-right leading-relaxed">
                {poll.description}
              </p>
            )}
          </div>
        </div>

        {/* Poll Options */}
        <div className="space-y-3">
          {poll.options.map((option) => (
            <div key={option.id} className="space-y-2">
              {/* Option Button/Result */}
              {poll.hasUserVoted || isExpired ? (
                // Results View
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {option.percentage}% • {option.votes.toLocaleString('he')} קולות
                    </span>
                    <span className={cn(
                      "text-right",
                      poll.userVotedOption === option.id ? "font-bold text-primary" : ""
                    )}>
                      {option.text}
                      {poll.userVotedOption === option.id && " ✓"}
                    </span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-1000 ease-out",
                        poll.userVotedOption === option.id 
                          ? "bg-primary" 
                          : "bg-muted-foreground/50"
                      )}
                      style={{ width: `${option.percentage}%` }}
                    />
                  </div>
                </div>
              ) : (
                // Voting View
                <button
                  onClick={() => setSelectedOption(option.id)}
                  className={cn(
                    "w-full p-3 rounded-xl border-2 transition-all duration-200 text-right",
                    selectedOption === option.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-muted-foreground/50 hover:bg-muted/50"
                  )}
                >
                  <span className="font-medium">{option.text}</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Vote Button (if not voted) */}
        {!poll.hasUserVoted && !isExpired && (
          <button
            onClick={handleVote}
            disabled={!selectedOption || isVoting}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200",
              selectedOption && !isVoting
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Vote className="w-4 h-4" />
            <span>{isVoting ? "מצביע..." : "הצבע עכשיו"}</span>
          </button>
        )}

        {/* Poll Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{getTimeRemaining()}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Vote className="w-4 h-4" />
            <span>{poll.totalVotes.toLocaleString('he')} הצבעות</span>
          </div>
        </div>
      </div>
    </div>
  );
};