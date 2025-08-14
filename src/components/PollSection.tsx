import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
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
  const { poll, hasUserVoted, totalVotes } = usePoll(newsId);

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

  return (
    <>
      <div className="border-t border-border/60 bg-muted/30">
        <Button
          variant="ghost"
          onClick={handleTogglePoll}
          className="w-full justify-between p-4 h-auto text-foreground hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div className="text-right">
              <div className="font-medium">דעת הקהילה</div>
              {totalVotes > 0 && (
                <div className="text-sm text-muted-foreground">
                  {totalVotes} משתתפים
                </div>
              )}
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>

        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          {isExpanded && isKYCVerified && (
            <div className="p-4 pt-0 border-t border-border/30">
              <div className="bg-background/50 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 text-right text-foreground">
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