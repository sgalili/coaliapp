import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Shield, Smartphone, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

type SecurityMethod = "none" | "otp" | "password";

export const WalletSettings = ({ isOpen, onClose }: WalletSettingsProps) => {
  const [currentView, setCurrentView] = useState<"main" | "security" | "limits">("main");
  const [securityMethod, setSecurityMethod] = useState<SecurityMethod>("none");
  const [walletPassword, setWalletPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dailyLimit, setDailyLimit] = useState("10000");
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const { toast } = useToast();

  const handleSaveSecurity = () => {
    if (securityMethod === "password") {
      if (!walletPassword || walletPassword !== confirmPassword) {
        toast({
          title: "שגיאה",
          description: "הסיסמאות אינן תואמות",
          variant: "destructive",
        });
        return;
      }
      setIsPasswordEnabled(true);
    } else if (securityMethod === "otp") {
      if (!phoneNumber) {
        toast({
          title: "שגיאה", 
          description: "נא להזין מספר טלפון",
          variant: "destructive",
        });
        return;
      }
      setIsOtpEnabled(true);
    }

    toast({
      title: "הגדרות נשמרו",
      description: "הגדרות האבטחה עודכנו בהצלחה",
    });
    setCurrentView("main");
  };

  const handleSaveLimits = () => {
    toast({
      title: "הגדרות נשמרו",
      description: "גבולות הארנק עודכנו בהצלחה",
    });
    setCurrentView("main");
  };

  const handleBack = () => {
    setCurrentView("main");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          {currentView !== "main" && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle className="text-center">
            {currentView === "main" && "הגדרות ארנק"}
            {currentView === "security" && "אבטחת ארנק"}
            {currentView === "limits" && "גבולות ארנק"}
          </DialogTitle>
        </DialogHeader>

        {currentView === "main" && (
          <div className="space-y-4">
            {/* Security Settings */}
            <div 
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => setCurrentView("security")}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">אבטחת העברות</div>
                  <div className="text-sm text-muted-foreground">
                    {isOtpEnabled && "OTP פעיל"}
                    {isPasswordEnabled && "סיסמת ארנק פעילה"}
                    {!isOtpEnabled && !isPasswordEnabled && "לא הוגדר"}
                  </div>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
            </div>

            {/* Limits Settings */}
            <div 
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => setCurrentView("limits")}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">גבולות העברה</div>
                  <div className="text-sm text-muted-foreground">
                    יומי: {parseInt(dailyLimit).toLocaleString()} Z
                  </div>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
            </div>
          </div>
        )}

        {currentView === "security" && (
          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-right">
                  הוסף שכבת אבטחה נוספת לאישור העברות
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>בחר שיטת אבטחה</Label>
              <RadioGroup value={securityMethod} onValueChange={(value: SecurityMethod) => setSecurityMethod(value)}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="cursor-pointer">ללא אבטחה נוספת</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="otp" id="otp" />
                  <Label htmlFor="otp" className="flex items-center gap-2 cursor-pointer">
                    <Smartphone className="h-4 w-4" />
                    OTP בסמס
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="password" id="password" />
                  <Label htmlFor="password" className="flex items-center gap-2 cursor-pointer">
                    <Lock className="h-4 w-4" />
                    סיסמת ארנק
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {securityMethod === "otp" && (
              <div className="space-y-2">
                <Label>מספר טלפון</Label>
                <Input
                  type="tel"
                  placeholder="05X-XXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            )}

            {securityMethod === "password" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>סיסמת ארנק</Label>
                  <Input
                    type="password"
                    placeholder="הזן סיסמה"
                    value={walletPassword}
                    onChange={(e) => setWalletPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>אישור סיסמה</Label>
                  <Input
                    type="password"
                    placeholder="אשר סיסמה"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button onClick={handleSaveSecurity} className="w-full">
              שמור הגדרות
            </Button>
          </div>
        )}

        {currentView === "limits" && (
          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-right">
                  הגדר גבולות לשליחת ZOOZ להגנה על הארנק
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>גבול יומי לשליחה</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="text-left pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Z
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  הגבול מתאפס כל יום ב-00:00
                </div>
              </div>

              {/* Preset Limits */}
              <div className="grid grid-cols-3 gap-2">
                {[5000, 10000, 25000].map((limit) => (
                  <Button
                    key={limit}
                    variant={dailyLimit === limit.toString() ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDailyLimit(limit.toString())}
                  >
                    {limit.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={handleSaveLimits} className="w-full">
              שמור הגדרות
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};