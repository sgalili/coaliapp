import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown, Handshake, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Expert } from "@/pages/TopTrustedPage";

interface TrustActionButtonProps {
  expert: Expert;
}

export const TrustActionButton = ({ expert }: TrustActionButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [localTrusted, setLocalTrusted] = useState(expert.trustedByUser);
  const { toast } = useToast();

  const handleTrustClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setLocalTrusted(!localTrusted);
    
    toast({
      title: localTrusted ? "הוסר אמון" : "נתן אמון",
      description: localTrusted 
        ? `הוסר האמון מ${expert.name}` 
        : `נתת אמון ל${expert.name}`,
      duration: 2000,
    });

    // Reset animation after delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <Button
      onClick={handleTrustClick}
      variant={localTrusted ? "default" : "outline"}
      size="sm"
      className={`flex-1 relative overflow-hidden ${
        isAnimating ? 'animate-pulse' : ''
      }`}
      disabled={isAnimating}
    >
      <div className="flex items-center gap-1.5">
        {localTrusted ? (
          <>
            <Check className="w-4 h-4" />
            <span>אמון</span>
          </>
        ) : (
          <>
            <Crown className="w-3 h-3" />
            <Handshake className="w-3 h-3" />
            <span>תן אמון</span>
          </>
        )}
      </div>
      
      {/* Animation particles */}
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          <Crown className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-zooz-burst" />
          <Handshake className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-trust animate-zooz-float" />
        </div>
      )}
    </Button>
  );
};