import { Badge } from "@/components/ui/badge";
import { Crown, Flame } from "lucide-react";
import type { Expert } from "@/types/expert";

interface ExpertStoriesCircleProps {
  expert: Expert;
  onClick: () => void;
}

export const ExpertStoriesCircle = ({ expert, onClick }: ExpertStoriesCircleProps) => {
  return (
    <div 
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative">
        {/* Trust Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-trust to-primary p-0.5 group-hover:animate-pulse">
          <div className="rounded-full bg-background p-0.5">
            <img
              src={expert.avatar}
              alt={expert.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
        </div>
        
        {/* Trending indicator */}
        {expert.trending && (
          <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
            <Flame className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
        
        {/* KYC Badge */}
        <div className="absolute -bottom-1 -right-1">
          <Badge 
            variant="secondary" 
            className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
          >
            <Crown className="w-3 h-3" />
          </Badge>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-xs font-medium text-foreground line-clamp-1">
          {expert.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {expert.stats.trustRate}% אמון
        </p>
      </div>
    </div>
  );
};