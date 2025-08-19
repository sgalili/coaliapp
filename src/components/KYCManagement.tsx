import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, ShieldAlert, ShieldCheck, ArrowUp, Sparkles, Trophy, Crown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useKYC } from "@/hooks/useKYC";
import { KYCForm } from "@/components/KYCForm";

interface KYCManagementProps {
  className?: string;
}

export const KYCManagement = ({ className }: KYCManagementProps) => {
  const { user, isKYCVerified, showKYC, triggerKYCCheck, handleKYCSuccess, handleKYCClose } = useKYC();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isKYCHidden, setIsKYCHidden] = useState(false);

  const kycLevels = {
    0: {
      icon: Shield,
      title: "לא מאומת",
      description: "השלם אימות בסיסי",
      color: "text-gray-500",
      bg: "bg-gray-100",
      reward: 0
    },
    1: {
      icon: Shield,
      title: "אימות בסיסי",
      description: "אימות דוא\"ל וטלפון",
      color: "text-blue-500",
      bg: "bg-blue-100",
      reward: 50
    },
    2: {
      icon: ShieldAlert,
      title: "אימות קהילתי",
      description: "אושר על ידי 3 חברי קהילה",
      color: "text-purple-500",
      bg: "bg-purple-100",
      reward: 200
    },
    3: {
      icon: ShieldCheck,
      title: "אימות מלא",
      description: "זהות מאומתת עם מסמכים",
      color: "text-green-500",
      bg: "bg-green-100",
      reward: 500
    }
  };

  const currentLevel = kycLevels[user.kycLevel as keyof typeof kycLevels];
  const nextLevel = user.kycLevel < 3 ? kycLevels[(user.kycLevel + 1) as keyof typeof kycLevels] : null;
  const IconComponent = currentLevel.icon;

  const handleUpgrade = () => {
    if (user.kycLevel < 3) {
      setShowUpgrade(true);
    }
  };

  // Don't render if hidden
  if (isKYCHidden) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Current KYC Status */}
      <div className="relative">
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-red-100">
                  <IconComponent className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-base">{currentLevel.title}</CardTitle>
                  <CardDescription className="text-xs">{currentLevel.description}</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">רמה {user.kycLevel}</Badge>
            </div>
          </CardHeader>
        
          {nextLevel && (
            <CardContent className="pt-0 pb-3">
              <div className="bg-red-100/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">שדרג לרמה {user.kycLevel + 1}</h4>
                  <div className="flex items-center gap-1 text-zooz font-bold text-xs">
                    <Sparkles className="w-3 h-3" />
                    +{nextLevel.reward} ZOOZ
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">עיר, תאריך לידה, מספר זהות</p>
                <Button onClick={handleUpgrade} className="w-full h-8 text-xs bg-red-600 hover:bg-red-700 text-white">
                  <ArrowUp className="w-3 h-3 ml-1" />
                  שדרג עכשיו
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
        
        {/* Close button positioned outside the card */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 shadow-sm"
          onClick={() => setIsKYCHidden(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>


      {/* KYC Upgrade Dialog */}
      <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>שדרוג KYC לרמה {user.kycLevel + 1}</DialogTitle>
            <DialogDescription>
              השלם את תהליך האימות כדי לקבל יותר הרשאות ו-ZOOZ
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {user.kycLevel === 0 && "השלם אימות בסיסי כדי להתחיל"}
              {user.kycLevel === 1 && "אימות קהילתי - צפה בוידאו חי ויאמת על ידי 3 חברי קהילה"}
              {user.kycLevel === 2 && "אימות מלא - העלה תמונת זהות וסלפי"}
            </p>
            <Button onClick={() => setShowUpgrade(false)} className="w-full">
              סגור
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Base KYC Dialog */}
      {showKYC && (
        <Dialog open={showKYC} onOpenChange={handleKYCClose}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>אימות KYC נדרש</DialogTitle>
              <DialogDescription>
                כדי להמשיך, עליך להשלים אימות בסיסי
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                כדי להמשיך, עליך להשלים אימות בסיסי
              </p>
              <Button onClick={handleKYCClose} className="w-full">
                סגור
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default KYCManagement;