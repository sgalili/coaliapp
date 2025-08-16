import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, ShieldAlert, ShieldCheck, ArrowUp, Sparkles, Trophy, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useKYC } from "@/hooks/useKYC";
import { KYCForm } from "@/components/KYCForm";

interface KYCManagementProps {
  className?: string;
}

export const KYCManagement = ({ className }: KYCManagementProps) => {
  const { user, isKYCVerified, showKYC, triggerKYCCheck, handleKYCSuccess, handleKYCClose } = useKYC();
  const [showUpgrade, setShowUpgrade] = useState(false);

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

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current KYC Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-full", currentLevel.bg)}>
                <IconComponent className={cn("w-5 h-5", currentLevel.color)} />
              </div>
              <div>
                <CardTitle className="text-lg">{currentLevel.title}</CardTitle>
                <CardDescription>{currentLevel.description}</CardDescription>
              </div>
            </div>
            <Badge variant="secondary">רמה {user.kycLevel}</Badge>
          </div>
        </CardHeader>
        
        {nextLevel && (
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">שדרג לרמה {user.kycLevel + 1}</h4>
                <div className="flex items-center gap-1 text-zooz font-bold">
                  <Sparkles className="w-4 h-4" />
                  +{nextLevel.reward} ZOOZ
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{nextLevel.description}</p>
              <Button onClick={handleUpgrade} className="w-full">
                <ArrowUp className="w-4 h-4 ml-2" />
                שדרג עכשיו
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Future BVI Message */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">העתיד: BVI Blockchain</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            בקרוב נשחרר את האפליקציה הנייטיב שלנו עם טכנולוגיית הבלוקצ'יין. 
            תוכל לחתום על ה-KYC שלך ישירות על הבלוקצ'יין ולקבל זהות מאומתת (BVI - Blockchain Verified Identity). 
            כל הנתונים יישמרו מקומית אצלך, ואנחנו לא נצטרך לשמור דבר!
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-primary">
            <Trophy className="w-4 h-4" />
            <span>המהפכה הבאה בזהות דיגיטלית</span>
          </div>
        </CardContent>
      </Card>

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