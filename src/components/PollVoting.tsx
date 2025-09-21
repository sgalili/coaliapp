import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePoll } from '@/hooks/usePoll';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import { PollVoteAnimation } from '@/components/PollVoteAnimation';
import { cn } from '@/lib/utils';

interface PollVotingProps {
  newsId: string;
}

export const PollVoting = ({ newsId }: PollVotingProps) => {
  const { poll, submitVote, hasUserVoted } = usePoll(newsId);
  const { playVoteSubmit, playVoteSuccess } = useAudioFeedback();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  if (!poll || hasUserVoted) return null;

  const handleVoteClick = (option: string) => {
    if (isVoting) return;
    
    setSelectedOption(option);
    setShowAnimation(true);
    playVoteSubmit();
  };

  const handleConfirmVote = () => {
    setIsVoting(true);
    submitVote(selectedOption);
    playVoteSuccess();
  };

  const handleCloseAnimation = () => {
    setShowAnimation(false);
    setSelectedOption('');
    setIsVoting(false);
  };

  const renderVotingInterface = () => {
    switch (poll.pollType) {
      case 'yes_no':
        return (
          <div className="grid grid-cols-2 gap-3">
            {poll.options.map((option) => (
              <Button
                key={option}
                onClick={() => handleVoteClick(option)}
                variant="outline"
                disabled={isVoting}
                className={cn(
                  "h-12 text-lg font-medium transition-all duration-200 border-2 transform hover:scale-105 active:scale-95",
                  isVoting && "opacity-50 cursor-not-allowed",
                  option === 'בעד' 
                    ? "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-300 text-emerald-700 hover:text-emerald-800 hover:shadow-emerald-200/50 hover:shadow-lg"
                    : "border-rose-200 bg-rose-50/50 hover:bg-rose-100 hover:border-rose-300 text-rose-700 hover:text-rose-800 hover:shadow-rose-200/50 hover:shadow-lg"
                )}
              >
                {option}
              </Button>
            ))}
          </div>
        );

      case 'rating_1_5':
        return (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 text-right mb-3">
              דרג מ-1 (גרוע) עד 5 (מעולה)
            </div>
            <div className="grid grid-cols-5 gap-2">
              {poll.options.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleVoteClick(option)}
                  variant="outline"
                  disabled={isVoting}
                  className="h-12 text-lg font-bold border-2 border-blue-200 bg-blue-50/30 hover:bg-blue-100 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-blue-200/50 hover:shadow-lg"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {poll.options.map((option) => (
              <Button
                key={option}
                onClick={() => handleVoteClick(option)}
                variant="outline"
                disabled={isVoting}
                className="w-full h-12 text-right justify-start px-4 border-2 border-blue-200 bg-blue-50/20 hover:bg-blue-100/60 hover:border-blue-300 text-blue-800 hover:text-blue-900 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-blue-200/50 hover:shadow-md"
              >
                {option}
              </Button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-4">
        {renderVotingInterface()}
        
        <div className="text-xs text-blue-600/70 text-center pt-3 border-t border-blue-100/60">
          הצבעה פתוחה למשתמשים מאומתים בלבד
        </div>
      </div>

      <PollVoteAnimation
        isOpen={showAnimation}
        onClose={handleCloseAnimation}
        onConfirm={handleConfirmVote}
        selectedOption={selectedOption}
        pollQuestion={poll.question}
      />
    </>
  );
};