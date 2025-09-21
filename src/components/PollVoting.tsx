import { Button } from '@/components/ui/button';
import { usePoll } from '@/hooks/usePoll';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PollVotingProps {
  newsId: string;
}

export const PollVoting = ({ newsId }: PollVotingProps) => {
  const { poll, submitVote } = usePoll(newsId);
  const { toast } = useToast();

  if (!poll) return null;

  const handleVote = (option: string) => {
    submitVote(option);
    toast({
      title: "הקול נשלח בהצלחה! 🗳️",
      description: "זכית ב-1 ZOOZ • התוצאות מעודכנות בזמן אמת",
    });
  };

  const renderVotingInterface = () => {
    switch (poll.pollType) {
      case 'yes_no':
        return (
          <div className="grid grid-cols-2 gap-3">
            {poll.options.map((option) => (
              <Button
                key={option}
                onClick={() => handleVote(option)}
                variant="outline"
                className={cn(
                  "h-12 text-lg font-medium transition-all duration-200 border-2",
                  option === 'בעד' 
                    ? "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-300 text-emerald-700 hover:text-emerald-800"
                    : "border-rose-200 bg-rose-50/50 hover:bg-rose-100 hover:border-rose-300 text-rose-700 hover:text-rose-800"
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
                  onClick={() => handleVote(option)}
                  variant="outline"
                  className="h-12 text-lg font-bold border-2 border-blue-200 bg-blue-50/30 hover:bg-blue-100 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200"
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
                onClick={() => handleVote(option)}
                variant="outline"
                className="w-full h-12 text-right justify-start px-4 border-2 border-blue-200 bg-blue-50/20 hover:bg-blue-100/60 hover:border-blue-300 text-blue-800 hover:text-blue-900 transition-all duration-200"
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
    <div className="space-y-4">
      {renderVotingInterface()}
      
      <div className="text-xs text-blue-600/70 text-center pt-3 border-t border-blue-100/60">
        הצבעה פתוחה למשתמשים מאומתים בלבד
      </div>
    </div>
  );
};