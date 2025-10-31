import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown, Handshake, Check, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useInvitation } from "@/hooks/useInvitation";
import { useActionProtection } from "@/hooks/useActionProtection";
import type { Expert } from "@/types/expert";

interface TrustActionButtonProps {
  expert: Expert;
}

export const TrustActionButton = ({ expert }: TrustActionButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [localTrusted, setLocalTrusted] = useState(expert.trustedByUser);
  const { toast } = useToast();
  const { createTrustIntent, generateInvitationLink } = useInvitation();
  const { executeProtectedAction } = useActionProtection();

  const handleTrustClick = async () => {
    if (isAnimating) return;
    
    executeProtectedAction(async () => {
      setIsAnimating(true);
      
      if (!localTrusted) {
        // When trusting someone, check if they need an invitation
        const mockPhone = "+972-50-000-0000"; // In real app, this would come from expert data
        
        // Create trust intent for unregistered experts
        const trustCreated = await createTrustIntent(mockPhone);
        
        if (trustCreated) {
          // Generate invitation link with user's referral code
          const inviteLink = generateInvitationLink();
          
          // TODO: Send invitation via WhatsApp/SMS with the link
          console.log('Sending invitation to expert:', inviteLink);
          
          toast({
            title: "אמון נתן + הזמנה נשלחה",
            description: `נתת אמון ל${expert.name} והזמנה נשלחה אליו`,
            duration: 3000,
          });
        } else {
          // Regular trust action
          toast({
            title: "נתן אמון",
            description: `נתת אמון ל${expert.name}`,
            duration: 2000,
          });
        }
      } else {
        // Remove trust
        toast({
          title: "הוסר אמון",
          description: `הוסר האמון מ${expert.name}`,
          duration: 2000,
        });
      }
      
      setLocalTrusted(!localTrusted);

      // Reset animation after delay
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }, 'kyc1', {
      kycMessage: 'נדרש אימות זהות כדי לתת אמון למשתמשים אחרים'
    });
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