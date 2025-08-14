import { usePoll } from '@/hooks/usePoll';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PollResultsProps {
  newsId: string;
}

export const PollResults = ({ newsId }: PollResultsProps) => {
  const { poll, results, totalVotes, userVote } = usePoll(newsId);

  if (!poll) return null;

  const getBarColor = (option: string, isUserVote: boolean) => {
    if (isUserVote) return 'bg-primary';
    
    switch (poll.pollType) {
      case 'yes_no':
        return option === 'בעד' ? 'bg-green-500' : 'bg-red-500';
      case 'rating_1_5':
        const rating = parseInt(option);
        if (rating <= 2) return 'bg-red-500';
        if (rating === 3) return 'bg-yellow-500';
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatOptionLabel = (option: string) => {
    if (poll.pollType === 'rating_1_5') {
      const labels: { [key: string]: string } = {
        '1': 'גרוע מאוד',
        '2': 'גרוע',
        '3': 'בסדר',
        '4': 'טוב',
        '5': 'מעולה'
      };
      return `${option} - ${labels[option]}`;
    }
    return option;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {poll.options.map((option) => {
          const result = results[option];
          const isUserVote = userVote === option;
          
          return (
            <div key={option} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {result?.percentage || 0}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({result?.count || 0})
                  </span>
                  {isUserVote && (
                    <Badge variant="default" className="text-xs">
                      הבחירה שלך
                    </Badge>
                  )}
                </div>
                <span className="text-sm font-medium text-right">
                  {formatOptionLabel(option)}
                </span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500 ease-out rounded-full",
                    getBarColor(option, isUserVote)
                  )}
                  style={{ width: `${result?.percentage || 0}%` }}
                />
              </div>
              
              {result?.voters && result.voters.length > 0 && (
                <div className="flex -space-x-2 justify-end">
                  {result.voters.slice(0, 5).map((voter, index) => (
                    <Avatar key={voter.id} className="w-6 h-6 border-2 border-background">
                      <AvatarImage src={voter.userImage} alt={voter.userName} />
                      <AvatarFallback className="text-xs">
                        {voter.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {result.voters.length > 5 && (
                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        +{result.voters.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t border-border/30 text-sm text-muted-foreground">
        <span>סה״כ משתתפים: {totalVotes}</span>
        <span>תוצאות בזמן אמת</span>
      </div>
    </div>
  );
};