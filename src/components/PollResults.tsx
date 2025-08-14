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
    if (isUserVote) return 'bg-blue-600';
    
    switch (poll.pollType) {
      case 'yes_no':
        return option === 'בעד' ? 'bg-emerald-500' : 'bg-rose-500';
      case 'rating_1_5':
        const rating = parseInt(option);
        if (rating <= 2) return 'bg-rose-400';
        if (rating === 3) return 'bg-amber-400';
        return 'bg-emerald-500';
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
    <div className="space-y-5">
      <div className="space-y-4">
        {poll.options.map((option) => {
          const result = results[option];
          const isUserVote = userVote === option;
          
          return (
            <div key={option} className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-blue-700">
                    {result?.percentage || 0}%
                  </span>
                  <span className="text-sm text-blue-600/70">
                    ({result?.count || 0})
                  </span>
                  {isUserVote && (
                    <Badge className="text-xs bg-blue-600 text-white px-2 py-1">
                      הבחירה שלך
                    </Badge>
                  )}
                </div>
                <span className="text-sm font-medium text-right text-gray-800">
                  {formatOptionLabel(option)}
                </span>
              </div>
              
              <div className="w-full bg-blue-50/60 rounded-full h-3 overflow-hidden border border-blue-100/80">
                <div
                  className={cn(
                    "h-full transition-all duration-700 ease-out rounded-full animate-scale-in",
                    getBarColor(option, isUserVote)
                  )}
                  style={{ width: `${result?.percentage || 0}%` }}
                />
              </div>
              
              {result?.voters && result.voters.length > 0 && (
                <div className="flex -space-x-2 justify-end">
                  {result.voters.slice(0, 6).map((voter, index) => (
                    <Avatar key={voter.id} className="w-7 h-7 border-2 border-white shadow-sm">
                      <AvatarImage src={voter.userImage} alt={voter.userName} />
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                        {voter.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {result.voters.length > 6 && (
                    <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center shadow-sm">
                      <span className="text-xs font-medium text-blue-700">
                        +{result.voters.length - 6}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-blue-100/60 text-sm">
        <span className="text-blue-600 font-medium">סה״כ משתתפים: {totalVotes}</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-600/80">תוצאות בזמן אמת</span>
        </div>
      </div>
    </div>
  );
};