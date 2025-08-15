import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, TrendingUp } from "lucide-react";
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
  return <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors">
      {/* Profile Picture */}
      <div className="relative cursor-pointer" onClick={onProfileClick}>
        <Avatar className="w-14 h-14 ring-2 ring-primary/20">
          <AvatarImage src={expert.avatar} alt={expert.name} />
          <AvatarFallback>{expert.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        
        {/* Status indicators */}
        {expert.verified && <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
            <TrendingUp className="w-3 h-3 text-primary-foreground" />
          </div>}
      </div>

      {/* User Info */}
      <div className="flex-1 cursor-pointer" onClick={onProfileClick}>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-foreground">{expert.name}</h3>
          {expert.trending && <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
              🔥
            </Badge>}
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
            <Heart className="w-3 h-3 text-trust" />
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

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <Button onClick={onTrustClick} variant={expert.trustedByUser ? "default" : "outline"} size="sm" className="min-w-[70px] h-8 text-xs">
          {expert.trustedByUser ? "אמון ✓" : "אמון"}
        </Button>
        
        <Button onClick={onWatchClick} variant="secondary" size="sm" className="min-w-[70px] h-8 text-xs">
          צפייה
        </Button>
      </div>
    </div>;
};