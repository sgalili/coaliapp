import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, Crown, Handshake } from "lucide-react";
import { TrustStatusIndicator } from "@/components/TrustStatusIndicator";
import { TrustIconFillable } from "@/components/FillableIcons";
import { getDomainConfig, getDomainBadgeClasses } from "@/lib/domainConfig";
import { cn } from "@/lib/utils";
import type { Expert } from "@/pages/TopTrustedPage";

const TrustIcon = ({ isFilled }: { isFilled?: boolean }) => {
  return (
    <div className={cn(
      "w-11 h-11 rounded-full flex items-center justify-center group-active:scale-95 transition-all duration-300 relative border-2",
      isFilled 
        ? "bg-trust/10 border-trust" 
        : "bg-muted/30 border-border hover:border-trust/50"
    )}>
      <div className="relative">
        <TrustIconFillable isFilled={isFilled} />
        <Crown className="w-3 h-3 text-primary absolute -top-1 -right-1" />
      </div>
    </div>
  );
};
interface TrustedUserCardProps {
  expert: Expert;
  onProfileClick: () => void;
  onTrustClick: () => void;
  onWatchClick: () => void;
}
export const TrustedUserCard = ({
  expert,
  onProfileClick,
  onTrustClick,
  onWatchClick
}: TrustedUserCardProps) => {
  return <>
      <div className="flex items-start gap-3 p-3 hover:bg-accent/30 transition-colors">
        {/* Profile section with status indicators */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative cursor-pointer" onClick={onProfileClick}>
            <Avatar className="w-14 h-14">
              <AvatarImage src={expert.avatar} alt={expert.name} />
              <AvatarFallback>{expert.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <TrustStatusIndicator kycLevel={expert.stats.kycLevel} />
          </div>
          
          {/* Watch button under avatar */}
          
        </div>

        {/* User Info - expanded for more content space */}
        <div className="flex-1 cursor-pointer min-w-0" onClick={onProfileClick}>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{expert.name}</h3>
            {expert.trending}
          </div>
          
          
          
          {/* Domain badges using new config system */}
          <div className="flex flex-wrap gap-1 mb-2">
            {expert.expertise.slice(0, 3).map(domain => {
            const config = getDomainConfig(domain);
            const badgeClasses = getDomainBadgeClasses(domain);
            return <Badge key={domain} className={`text-xs px-2 py-0.5 rounded-full font-medium border backdrop-blur-sm ${badgeClasses}`}>
                  {config.name}
                </Badge>;
          })}
            {expert.expertise.length > 3 && <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-full">
                +{expert.expertise.length - 3}
              </Badge>}
          </div>
          
          {/* Bio with more space */}
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {expert.bio || "מומחה מוכר ואמין בתחום"}
          </p>
          
          {/* Trust Score */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="relative">
                <Handshake className="w-3 h-3 text-trust" />
                <Crown className="w-1 h-1 text-yellow-400 absolute -top-0.5 -right-0.5" />
              </div>
              <span className="text-xs font-medium text-trust">
                {expert.stats.trustCount.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {expert.stats.views.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Main Trust CTA */}
        <div className="flex items-start pt-2">
          <button 
            onClick={onTrustClick}
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <TrustIcon isFilled={expert.trustedByUser} />
          </button>
        </div>
      </div>
      <Separator />
    </>;
};