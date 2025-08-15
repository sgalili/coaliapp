import { Shield, ShieldAlert, ShieldCheck, Flame } from "lucide-react";

interface TrustStatusIndicatorProps {
  trending: boolean;
  kycLevel: number;
  className?: string;
}

export const TrustStatusIndicator = ({ 
  trending, 
  kycLevel, 
  className = "" 
}: TrustStatusIndicatorProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Trending indicator - top right */}
      {trending && (
        <div className="absolute -top-1 -right-1 bg-destructive rounded-full p-1">
          <Flame className="w-3 h-3 text-destructive-foreground" />
        </div>
      )}
      
      {/* KYC Badge - bottom right */}
      {kycLevel > 0 && (
        <div className="absolute -top-1 -right-1 bg-background rounded-full p-1 border w-6 h-6 flex items-center justify-center">
          {kycLevel === 1 && (
            <Shield className="w-4 h-4 text-gray-400" />
          )}
          {kycLevel === 2 && (
            <ShieldAlert className="w-4 h-4 text-blue-500" />
          )}
          {kycLevel === 3 && (
            <ShieldCheck className="w-4 h-4 text-green-500" />
          )}
        </div>
      )}
    </div>
  );
};