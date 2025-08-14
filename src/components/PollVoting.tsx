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
      title: "הקול נשלח בהצלחה!",
      description: "תוכל לראות את התוצאות כעת",
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
                  "h-12 text-lg font-medium transition-all duration-200",
                  option === 'בעד' 
                    ? "hover:bg-green-50 hover:border-green-200 hover:text-green-700"
                    : "hover:bg-red-50 hover:border-red-200 hover:text-red-700"
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
            <div className="text-sm text-muted-foreground text-right mb-2">
              דרג מ-1 (גרוע) עד 5 (מעולה)
            </div>
            <div className="grid grid-cols-5 gap-2">
              {poll.options.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleVote(option)}
                  variant="outline"
                  className="h-12 text-lg font-bold hover:bg-primary/10 hover:border-primary hover:text-primary"
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
                className="w-full h-12 text-right justify-start px-4 hover:bg-primary/5 hover:border-primary/50"
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
      
      <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/30">
        הצבעה פתוחה למשתמשים מאומתים בלבד
      </div>
    </div>
  );
};