import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Smartphone, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TransactionConfirmationProps {
  recipient: string;
  amount: number;
  note?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TransactionConfirmation = ({ 
  recipient, 
  amount, 
  note, 
  onConfirm, 
  onCancel 
}: TransactionConfirmationProps) => {
  const [securityStep, setSecurityStep] = useState<"summary" | "otp" | "password">("summary");
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock settings - in real app this would come from user settings
  const hasOtpEnabled = true;
  const hasPasswordEnabled = false;

  const handleContinue = () => {
    if (hasOtpEnabled) {
      setSecurityStep("otp");
      // Mock sending OTP
      toast({
        title: "קוד OTP נשלח",
        description: "קוד אימות נשלח לטלפון שלך",
      });
    } else if (hasPasswordEnabled) {
      setSecurityStep("password");
    } else {
      // No security enabled, proceed directly
      handleFinalConfirm();
    }
  };

  const handleSecurityConfirm = async () => {
    setIsLoading(true);
    
    // Mock validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (securityStep === "otp") {
      if (otpCode.length !== 6) {
        toast({
          title: "קוד שגוי",
          description: "נא להזין קוד בן 6 ספרות",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    } else if (securityStep === "password") {
      if (!password) {
        toast({
          title: "סיסמה שגויה",
          description: "נא להזין את סיסמת הארנק",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    handleFinalConfirm();
  };

  const handleFinalConfirm = () => {
    setIsLoading(false);
    toast({
      title: "העברה בוצעה בהצלחה",
      description: `${amount.toLocaleString()} Z נשלחו אל ${recipient}`,
    });
    onConfirm();
  };

  return (
    <div className="space-y-6">
      {securityStep === "summary" && (
        <>
          {/* Transaction Summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {amount.toLocaleString()} Z
              </div>
              <div className="text-sm text-muted-foreground">
                אל {recipient}
              </div>
            </div>
            
            {note && (
              <div className="border-t pt-3">
                <div className="text-sm font-medium mb-1">הערה:</div>
                <div className="text-sm text-muted-foreground">{note}</div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          {(hasOtpEnabled || hasPasswordEnabled) && (
            <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-right">
                  {hasOtpEnabled && "יישלח קוד אימות לטלפון שלך"}
                  {hasPasswordEnabled && "תתבקש להזין את סיסמת הארנק"}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleContinue} className="w-full">
              אשר העברה
            </Button>
            <Button variant="outline" onClick={onCancel} className="w-full">
              ביטול
            </Button>
          </div>
        </>
      )}

      {securityStep === "otp" && (
        <>
          {/* OTP Input */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">קוד אימות</h3>
              <p className="text-sm text-muted-foreground">
                הזן את הקוד בן 6 הספרות שנשלח לטלפון שלך
              </p>
            </div>

            <div className="space-y-2">
              <Label>קוד OTP</Label>
              <Input
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleSecurityConfirm} 
              disabled={otpCode.length !== 6 || isLoading}
              className="w-full"
            >
              {isLoading ? "מאמת..." : "אמת ואשר"}
            </Button>
            <Button variant="outline" onClick={onCancel} className="w-full">
              ביטול
            </Button>
          </div>
        </>
      )}

      {securityStep === "password" && (
        <>
          {/* Password Input */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">סיסמת ארנק</h3>
              <p className="text-sm text-muted-foreground">
                הזן את סיסמת הארנק לאישור ההעברה
              </p>
            </div>

            <div className="space-y-2">
              <Label>סיסמת ארנק</Label>
              <Input
                type="password"
                placeholder="הזן סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleSecurityConfirm} 
              disabled={!password || isLoading}
              className="w-full"
            >
              {isLoading ? "מאמת..." : "אמת ואשר"}
            </Button>
            <Button variant="outline" onClick={onCancel} className="w-full">
              ביטול
            </Button>
          </div>
        </>
      )}
    </div>
  );
};