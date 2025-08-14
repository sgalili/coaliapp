import { TrustStatusIndicator } from "@/components/TrustStatusIndicator";
import type { Expert } from "@/pages/TopTrustedPage";

interface EnhancedExpertCircleProps {
  expert: Expert;
  onClick: () => void;
  isTopCommunity?: boolean;
}

export const EnhancedExpertCircle = ({ expert, onClick, isTopCommunity = false }: EnhancedExpertCircleProps) => {
  // Determine border color and animation based on trust rate and user trust
  const getBorderColor = (trustRate: number) => {
    if (trustRate >= 8) return "border-trust";
    if (trustRate >= 6) return "border-primary";
    return "border-border";
  };

  const getAnimation = () => {
    if (expert.trustedByUser) return "animate-gentle-pulse";
    if (expert.stats.trustRate >= 8) return "animate-primary-glow";
    return "";
  };

  return (
    <div 
      className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px]"
      onClick={onClick}
    >
      <div className="relative">
        {/* Main avatar with colored border */}
        <div className={`
          relative w-20 h-20 rounded-full border-2 transition-all duration-500 
          ${getBorderColor(expert.stats.trustRate)}
          ${getAnimation()}
          group-hover:scale-105 group-hover:shadow-xl
        `}>
          <img
            src={expert.avatar}
            alt={expert.name}
            className="w-full h-full rounded-full object-cover"
          />
          
          {/* Trust Status Indicators */}
          <TrustStatusIndicator
            trustedByUser={expert.trustedByUser}
            trending={expert.trending}
            kycLevel={expert.stats.kycLevel}
            isTopCommunity={isTopCommunity}
          />
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-xs font-medium text-foreground line-clamp-1 max-w-[80px]">
          {expert.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {expert.stats.trustRate}% אמון
        </p>
      </div>
    </div>
  );
};