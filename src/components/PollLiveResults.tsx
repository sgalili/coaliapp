import { usePoll } from '@/hooks/usePoll';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface PollLiveResultsProps {
  newsId: string;
}

export const PollLiveResults = ({ newsId }: PollLiveResultsProps) => {
  const { poll, results, totalVotes, userVote, hasUserVoted } = usePoll(newsId);

  if (!poll) return null;

  const getBarColor = (option: string, isUserVote: boolean) => {
    if (isUserVote) return 'bg-green-500';
    
    switch (poll.pollType) {
      case 'yes_no':
        return option === 'בעד' ? 'bg-emerald-400' : 'bg-rose-400';
      case 'rating_1_5':
        const rating = parseInt(option);
        if (rating <= 2) return 'bg-rose-400';
        if (rating === 3) return 'bg-amber-400';
        return 'bg-emerald-400';
      default:
        return 'bg-blue-400';
    }
  };

  const renderLiveResults = () => {
    switch (poll.pollType) {
      case 'yes_no':
        return (
          <div className="grid grid-cols-2 gap-3">
            {poll.options.map((option) => {
              const result = results[option];
              const isUserVote = userVote === option;
              
              return (
                <div key={option} className={cn(
                  "relative h-12 border-2 rounded-md overflow-hidden transition-all duration-300",
                  isUserVote 
                    ? "border-green-300 bg-green-50" 
                    : option === 'בעד' 
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-rose-200 bg-rose-50/50"
                )}>
                  {/* Background bar */}
                  <div 
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-out opacity-20",
                      getBarColor(option, isUserVote)
                    )}
                    style={{ width: `${result?.percentage || 0}%` }}
                  />
                  
                  {/* Content */}
                  <div className="relative h-full flex items-center justify-center gap-2 px-3">
                    {isUserVote && <CheckCircle className="h-4 w-4 text-green-600" />}
                    <span className={cn(
                      "text-lg font-medium",
                      isUserVote 
                        ? "text-green-700" 
                        : option === 'בעד' 
                          ? "text-emerald-700" 
                          : "text-rose-700"
                    )}>
                      {option}
                    </span>
                    <Badge variant="secondary" className="text-xs font-bold">
                      {result?.percentage || 0}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'rating_1_5':
        return (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 text-right mb-3">
              דרג מ-1 (גרוע) עד 5 (מעולה)
            </div>
            <div className="grid grid-cols-5 gap-2">
              {poll.options.map((option) => {
                const result = results[option];
                const isUserVote = userVote === option;
                
                return (
                  <div key={option} className={cn(
                    "relative h-12 border-2 rounded-md overflow-hidden transition-all duration-300",
                    isUserVote ? "border-green-300 bg-green-50" : "border-blue-200 bg-blue-50/30"
                  )}>
                    {/* Background bar */}
                    <div 
                      className={cn(
                        "absolute inset-0 transition-all duration-700 ease-out opacity-20",
                        getBarColor(option, isUserVote)
                      )}
                      style={{ width: `${result?.percentage || 0}%` }}
                    />
                    
                    {/* Content */}
                    <div className="relative h-full flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1">
                        {isUserVote && <CheckCircle className="h-3 w-3 text-green-600" />}
                        <span className={cn(
                          "text-lg font-bold",
                          isUserVote ? "text-green-700" : "text-blue-700"
                        )}>
                          {option}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {result?.percentage || 0}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {poll.options.map((option) => {
              const result = results[option];
              const isUserVote = userVote === option;
              
              return (
                <div key={option} className={cn(
                  "relative h-12 border-2 rounded-md overflow-hidden transition-all duration-300",
                  isUserVote ? "border-green-300 bg-green-50" : "border-blue-200 bg-blue-50/20"
                )}>
                  {/* Background bar */}
                  <div 
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-out opacity-20",
                      getBarColor(option, isUserVote)
                    )}
                    style={{ width: `${result?.percentage || 0}%` }}
                  />
                  
                  {/* Content */}
                  <div className="relative h-full flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-bold">
                        {result?.percentage || 0}%
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ({result?.count || 0})
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isUserVote && <CheckCircle className="h-4 w-4 text-green-600" />}
                      <span className={cn(
                        "text-sm font-medium",
                        isUserVote ? "text-green-800" : "text-blue-800"
                      )}>
                        {option}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {renderLiveResults()}
      
      <div className="flex justify-between items-center pt-3 border-t border-border/50 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-muted-foreground">תוצאות חיות</span>
        </div>
        <span className="text-foreground font-medium">סה״כ: {totalVotes}</span>
      </div>
    </div>
  );
};