import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

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
      <div className="relative flex items-center justify-center">
        <div 
          className={cn(
            "text-2xl font-bold text-zooz transition-all duration-300",
            showAnimation && "animate-gentle-pulse"
          )}
        >
          {formatZooz(zoozEarned)}
        </div>
        <Sparkles className="w-4 h-4 text-zooz mr-1 animate-pulse" />
      </div>
      <div className="text-sm text-muted-foreground">ZOOZ הרוויחו</div>
      <div className="text-xs text-muted-foreground mt-1">
        מתמיכה ישירה בלייבים
      </div>
    </div>
  );
};

export default ZoozEarnedDisplay;