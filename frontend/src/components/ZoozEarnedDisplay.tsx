import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ZoozEarnedDisplayProps {
  zoozEarned: number;
  showAnimation?: boolean;
  className?: string;
  textColorClass?: string;
}

export const ZoozEarnedDisplay = ({ 
  zoozEarned, 
  showAnimation = false,
  className,
  textColorClass = "text-zooz"
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

  const ZoozIcon = () => (
    <div className="w-6 h-6 bg-zooz text-white rounded-full flex items-center justify-center font-bold text-sm mb-1 mx-auto">
      Z
    </div>
  );

  return (
    <div className={cn("text-center", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <ZoozIcon />
              <div 
                className={cn(
                  "text-2xl font-bold transition-all duration-300",
                  textColorClass,
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