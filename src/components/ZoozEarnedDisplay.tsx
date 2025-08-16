import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ZoozEarnedDisplayProps {
  zoozEarned: number;
  showAnimation?: boolean;
  className?: string;
}

export const ZoozEarnedDisplay = ({ 
  zoozEarned, 
  showAnimation = false,
  className 
}: ZoozEarnedDisplayProps) => {
  const formatZooz = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  return (
    <div className={cn("text-center", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <Sparkles className="w-6 h-6 text-zooz mx-auto mb-1 animate-pulse" />
              <div 
                className={cn(
                  "text-2xl font-bold text-zooz transition-all duration-300",
                  showAnimation && "animate-gentle-pulse"
                )}
              >
                {formatZooz(zoozEarned)}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>מספר המטבעות זוז מתמיכה ישירה בלייבים וסרטונים</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ZoozEarnedDisplay;