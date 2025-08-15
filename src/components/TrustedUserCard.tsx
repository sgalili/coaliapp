import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Crown, TrendingUp } from "lucide-react";
import type { Expert } from "@/pages/TopTrustedPage";
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
  return (
    <>
      <div className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors">
        {/* Profile Picture */}
        <div className="relative cursor-pointer" onClick={onProfileClick}>
          <Avatar className="w-14 h-14">
            <AvatarImage src={expert.avatar} alt={expert.name} />
            <AvatarFallback>{expert.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          {/* Status indicators */}
          {expert.verified && (
            <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
              <TrendingUp className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 cursor-pointer" onClick={onProfileClick}>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{expert.name}</h3>
            {expert.trending && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                🔥
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-1">
            @{expert.username || expert.name.replace(/\s+/g, '').toLowerCase()}
          </p>
          
          <p className="text-xs text-muted-foreground line-clamp-1">
            {expert.bio || expert.expertise.join(' • ')}
          </p>
          
          {/* Trust Score */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Crown className="w-3 h-3 text-trust" />
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

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onTrustClick} 
            className={`p-2 rounded-full transition-colors ${
              expert.trustedByUser 
                ? "bg-trust text-trust-foreground" 
                : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Crown className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onWatchClick} 
            className="p-2 rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
      <Separator />
    </>
  );
};