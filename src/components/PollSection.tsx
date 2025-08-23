import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Volume2, Vote } from 'lucide-react';
import { PollVoting } from './PollVoting';
import { PollResults } from './PollResults';
import { KYCForm } from './KYCForm';
import { useKYC } from '@/hooks/useKYC';
import { usePoll } from '@/hooks/usePoll';
import { cn } from '@/lib/utils';

interface PollSectionProps {
  newsId: string;
}

export const PollSection = ({ newsId }: PollSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isKYCVerified, showKYC, triggerKYCCheck, handleKYCSuccess, handleKYCClose } = useKYC();
  const { poll, hasUserVoted, totalVotes, results } = usePoll(newsId);

  if (!poll) return null;

  const handleTogglePoll = () => {
    if (!isExpanded) {
      triggerKYCCheck(() => {
        setIsExpanded(true);
      });
    } else {
      setIsExpanded(false);
    }
  };

  // Get top 2 options for mini display
  const sortedOptions = Object.entries(results)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 2);

  const [topOption, secondOption] = sortedOptions;
  const topPercentage = topOption ? topOption[1].percentage : 0;
  const secondPercentage = secondOption ? secondOption[1].percentage : 0;

  return (
    <>
      <div className="-mx-4 border-t border-slate-200/50 bg-card shadow-sm !rounded-none">
        <div 
          onClick={handleTogglePoll}
          className="w-full p-4 cursor-pointer hover:bg-muted/30 transition-all duration-200 rounded-none"
        >
          {/* Header with title and action */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 mr-2">
              <span className="font-medium text-foreground text-sm">📢 קול הציבור</span>
              {totalVotes > 0 && (
                <span className="text-xs text-muted-foreground">({totalVotes.toLocaleString()} הצבעות)</span>
              )}
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs border-primary/20 text-primary hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePoll();
                }}
              >
                <Vote className="h-3 w-3 ml-1" />
                {hasUserVoted ? (newsId === 'news-4' ? 'הצבעתי' : '👀 ראה תוצאות') : '💬 הביע דעתך'}
              </Button>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Mini poll display */}
          {totalVotes > 0 && (
            <div className="space-y-2">
              {/* Results preview */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mr-2">
                {topOption && (
                  <span>{topPercentage}% {topOption[0]}</span>
                )}
                {secondOption && (
                  <span>•</span>
                )}
                {secondOption && (
                  <span>{secondPercentage}% {secondOption[0]}</span>
                )}
              </div>
              
              {/* Mini horizontal gauge */}
              <div className="relative h-2 bg-muted overflow-hidden">
                <div 
                  className="absolute right-0 top-0 h-full bg-primary transition-all duration-500"
                  style={{ width: `${topPercentage}%` }}
                />
                {secondOption && (
                  <div 
                    className="absolute top-0 h-full bg-secondary transition-all duration-500"
                    style={{ 
                      right: `${topPercentage}%`, 
                      width: `${secondPercentage}%` 
                    }}
                  />
                )}
              </div>
            </div>
          )}
          
          {/* No votes yet state */}
          {totalVotes === 0 && (
            <div className="text-xs text-muted-foreground text-center py-2">
              היה הראשון להצביע בסקר
            </div>
          )}
        </div>

        {/* Expanded content */}
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out border-t border-border/50",
          isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}>
          {isExpanded && isKYCVerified && (
            <div className="p-4 pt-3">
              <div className="bg-card p-4 border border-border/50 shadow-sm">
                <h3 className="text-base font-semibold mb-4 text-right text-foreground leading-relaxed">
                  {poll.question}
                </h3>
                
                {hasUserVoted ? (
                  <PollResults newsId={newsId} />
                ) : (
                  <PollVoting newsId={newsId} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showKYC && (
        <KYCForm 
          onSubmit={handleKYCSuccess}
          onBack={handleKYCClose}
        />
      )}
    </>
  );
};