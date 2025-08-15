import { Crown, Handshake, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrustStatusIndicatorProps {
  trustedByUser: boolean;
  trending: boolean;
  kycLevel: number;
  isTopCommunity?: boolean;
  className?: string;
}

export const TrustStatusIndicator = ({ 
  trustedByUser, 
  trending, 
  kycLevel, 
  isTopCommunity,
  className = "" 
}: TrustStatusIndicatorProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Trust by me indicator - bottom left */}
      {trustedByUser && (
        <div className="absolute -bottom-1 -left-1 bg-trust rounded-full p-1 animate-pulse">
          <Handshake className="w-3 h-3 text-trust-foreground" />
        </div>
      )}
      
      {/* Community top indicator - top left */}
      {isTopCommunity && !trustedByUser && (
        <div className="absolute -top-1 -left-1 bg-primary rounded-full p-1 shadow-lg">
          <Crown className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
      
      {/* Trending indicator - top right */}
      {trending && (
        <div className="absolute -top-1 -right-1 bg-destructive rounded-full p-1">
          <Flame className="w-3 h-3 text-destructive-foreground" />
        </div>
      )}
      
      {/* KYC Badge - bottom right */}
      <div className="absolute -bottom-1 -right-1">
        <Badge 
          variant="secondary" 
          className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-muted border"
        >
          <Crown className="w-3 h-3" />
        </Badge>
      </div>
    </div>
  );
};