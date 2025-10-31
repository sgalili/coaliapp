import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X, MessageCircle, Handshake, Eye, Users, TrendingUp, Crown } from "lucide-react";
import type { Expert } from "@/types/expert";

interface ProfileOverlayProps {
  expert: Expert;
  isOpen: boolean;
  onClose: () => void;
  onTrustClick: () => void;
  onMessageClick: () => void;
}

export const ProfileOverlay = ({ 
  expert, 
  isOpen, 
  onClose, 
  onTrustClick,
  onMessageClick 
}: ProfileOverlayProps) => {
  const getDomainLabel = (domain: string) => {
    const labels = {
      economy: 'כלכלה',
      tech: 'טכנולוגיה', 
      education: 'חינוך',
      health: 'בריאות',
      security: 'ביטחון',
      culture: 'תרבות'
    };
    return labels[domain as keyof typeof labels] || domain;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 pb-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="w-20 h-20 ring-4 ring-background shadow-lg">
                <AvatarImage src={expert.avatar} alt={expert.name} />
                <AvatarFallback className="text-lg">{expert.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              
              {expert.verified && (
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5">
                  <TrendingUp className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-foreground mt-4">{expert.name}</h2>
            <p className="text-sm text-muted-foreground">
              @{expert.username || expert.name.replace(/\s+/g, '').toLowerCase()}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Bio */}
          <div>
            <h3 className="font-medium text-foreground mb-2">אודות</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {expert.bio || `מומחה ${expert.expertise.map(getDomainLabel).join(', ')} עם ניסיון רב בתחום. חבר מוערך בקהילת Coali עם רמת אמון גבוהה.`}
            </p>
          </div>

          {/* Expertise Categories */}
          <div>
            <h3 className="font-medium text-foreground mb-2">תחומי התמחות</h3>
            <div className="flex flex-wrap gap-2">
              {expert.expertise.map((domain) => (
                <Badge key={domain} variant="secondary" className="text-xs">
                  {getDomainLabel(domain)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Handshake className="w-4 h-4 text-trust" />
                <span className="font-semibold text-foreground">
                  {expert.stats.trustCount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">אמון</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">
                  {expert.stats.views.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">צפיות</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">
                  {expert.followers?.toLocaleString() || '1.2K'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">עוקבים</p>
            </div>
          </div>

          {/* Trust Score */}
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {expert.stats.trustRate}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground">ציון אמון</p>
            <p className="text-xs text-muted-foreground">רמת KYC {expert.stats.kycLevel}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onTrustClick}
              variant={expert.trustedByUser ? "default" : "outline"}
              className="flex-1"
            >
              {expert.trustedByUser ? "אמון ✓" : "תן אמון"}
            </Button>
            
            <Button
              onClick={onMessageClick}
              variant="secondary"
              className="flex-1"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              שלח הודעה
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};