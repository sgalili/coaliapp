import { useState } from "react";
import { Building2, Clock, Users, CheckCircle, XCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface OrganizationVote {
  id: string;
  organization: string;
  organizationType: "foundation" | "company" | "school" | "community";
  title: string;
  description: string;
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

export const OrganizationVoteCard = ({ vote, onVote }: OrganizationVoteCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(vote.userVotedOption || null);

  const getOrganizationIcon = () => {
    switch (vote.organizationType) {
      case 'foundation': return '🏛️';
      case 'company': return '🏢';
      case 'school': return '🏫';
      case 'community': return '🏘️';
      default: return '🏢';
    }
  };

  const getUrgencyColor = () => {
    switch (vote.urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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

  const handleVote = (optionId: string) => {
    if (vote.hasUserVoted) return;
    setSelectedOption(optionId);
    onVote(vote.id, optionId);
  };

  return (
    <Card className="w-full max-w-2xl mx-4 mb-6 border border-border/50 bg-card/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        {/* Organization Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getOrganizationIcon()}</span>
            <div>
              <h3 className="font-semibold text-foreground">{vote.organization}</h3>
              <p className="text-xs text-muted-foreground">
                {vote.organizationType === 'foundation' ? 'עמותה' : 
                 vote.organizationType === 'company' ? 'חברה' :
                 vote.organizationType === 'school' ? 'מוסד חינוך' : 'קהילה'}
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
          {vote.financialDetails && (
            <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">💰</span>
                <div className="text-center">
                  <p className="font-bold text-lg text-primary">
                    {vote.financialDetails.amount} {vote.financialDetails.currency}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {vote.financialDetails.type === 'profit' ? 'רווח משוער' :
                     vote.financialDetails.type === 'cost' ? 'עלות משוערת' : 'השקעה נדרשת'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Voting Options */}
        <div className="space-y-3 mb-4">
          {vote.options.map((option) => {
            const IconComponent = getOptionIcon(option.text);
            const isSelected = selectedOption === option.id;
            const isUserVote = vote.userVotedOption === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                disabled={vote.hasUserVoted}
                className={cn(
                  "w-full p-3 rounded-lg border transition-all duration-200 text-right",
                  vote.hasUserVoted 
                    ? "cursor-not-allowed opacity-70"
                    : "hover:border-primary/50 cursor-pointer",
                  isSelected && !vote.hasUserVoted && "border-primary bg-primary/5",
                  isUserVote && "border-primary bg-primary/10"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent 
                      className={cn(
                        "w-4 h-4",
                        option.text.includes('בעד') ? "text-green-500" :
                        option.text.includes('נגד') ? "text-red-500" : "text-gray-500"
                      )} 
                    />
                    <span className="text-xs font-medium">{option.percentage}%</span>
                  </div>
                  
                  <div className="flex-1 text-right">
                    <p className="font-medium text-sm">{option.text}</p>
                    <div className="mt-1">
                      <Progress value={option.percentage} className="h-1" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Vote Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{vote.totalVotes} הצביעו מתוך {vote.totalMembers}</span>
          </div>
          
          {vote.hasUserVoted && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle className="w-3 h-3" />
              <span>הצבעתך נרשמה</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};