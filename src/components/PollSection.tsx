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
  const { poll, hasUserVoted, showResults, totalVotes } = usePoll(newsId);

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
      <div className="border-t border-blue-100/80 bg-gradient-to-r from-blue-50/40 to-indigo-50/40">
        <Button
          variant="ghost"
          onClick={handleTogglePoll}
          className="w-full justify-between p-4 h-auto text-foreground hover:bg-blue-50/60 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <div className="text-right">
              <div className="font-medium text-gray-800">דעת הקהילה</div>
              {totalVotes > 0 && (
                <div className="text-sm text-blue-600/80">
                  {totalVotes} משתתפים
                </div>
              )}
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-blue-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-blue-500" />
          )}
        </Button>

        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}>
          {isExpanded && isKYCVerified && (
            <div className="p-4 pt-2 border-t border-blue-100/60">
              <div className="bg-background/95 rounded-xl p-5 backdrop-blur-sm border border-border shadow-sm">
                <h3 className="text-lg font-semibold mb-5 text-right text-foreground leading-relaxed">
                  {poll.question}
                </h3>
                
                {showResults ? (
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