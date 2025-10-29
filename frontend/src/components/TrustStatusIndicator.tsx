import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TrustStatusIndicatorProps {
  kycLevel: number;
}

export const TrustStatusIndicator = ({ kycLevel }: TrustStatusIndicatorProps) => {
  // KYC Configuration - exact same as VideoFeed
  const kycConfig = {
    1: { icon: Shield, color: "text-gray-400", tooltip: "רמת KYC 1 - אימות בסיסי" },
    2: { icon: ShieldAlert, color: "text-blue-500", tooltip: "רמת KYC 2 - אימות מתקדם" },
    3: { icon: ShieldCheck, color: "text-green-500", tooltip: "רמת KYC 3 - אימות מלא" }
  };

  // Return KYC badge directly without wrapper
  if (kycLevel > 0) {
    const kyc = kycConfig[kycLevel as keyof typeof kycConfig];
    const IconComponent = kyc.icon;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center cursor-help z-30")}>
              <IconComponent className={cn("w-4 h-4", kyc.color)} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{kyc.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return null;
};