import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, DollarSign, ArrowLeft } from "lucide-react";

interface BuyZoozModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = "card" | "paypal" | "usdt" | "usdc";

const paymentMethods = [
  { value: "card", label: "כרטיס אשראי", icon: CreditCard },
  { value: "paypal", label: "PayPal", icon: DollarSign },
  { value: "usdt", label: "USDT", icon: DollarSign },
  { value: "usdc", label: "USDC", icon: DollarSign },
];

const presetAmounts = [50, 100, 250, 500, 1000];

export const BuyZoozModal = ({ isOpen, onClose }: BuyZoozModalProps) => {
  const [step, setStep] = useState<"amount" | "payment" | "confirm">("amount");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isLoading, setIsLoading] = useState(false);

  const zoozAmount = amount ? parseInt(amount) : 0;
  const usdRate = 0.012; // Mock rate: 1 ZOOZ = $0.012
  const usdValue = zoozAmount * usdRate;

  const handleAmountSelect = (preset: number) => {
    setAmount(preset.toString());
  };

  const handleContinue = () => {
    if (step === "amount" && amount) {
      setStep("payment");
    } else if (step === "payment") {
      setStep("confirm");
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    onClose();
    // Reset state
    setStep("amount");
    setAmount("");
    setPaymentMethod("card");
  };

  const handleBack = () => {
    if (step === "payment") {
      setStep("amount");
    } else if (step === "confirm") {
      setStep("payment");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          {step !== "amount" && (
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
            {step === "amount" && "קניית ZOOZ"}
            {step === "payment" && "בחירת אמצעי תשלום"}
            {step === "confirm" && "אישור הזמנה"}
          </DialogTitle>
        </DialogHeader>

        {step === "amount" && (
          <div className="space-y-6">
            {/* Preset Amounts */}
            <div className="grid grid-cols-3 gap-3">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant={amount === preset.toString() ? "default" : "outline"}
                  onClick={() => handleAmountSelect(preset)}
                  className="h-12"
                >
                  {preset.toLocaleString()} Z
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label>סכום מותאם אישית</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="הכנס סכום"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-left pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  Z
                </span>
              </div>
            </div>

            {/* USD Equivalent */}
            {zoozAmount > 0 && (
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <div className="text-sm text-muted-foreground">שווה ערך</div>
                <div className="text-lg font-semibold">
                  ${usdValue.toFixed(2)} USD
                </div>
              </div>
            )}

            <Button 
              onClick={handleContinue} 
              disabled={!amount || zoozAmount <= 0}
              className="w-full"
            >
              המשך
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>כמות ZOOZ:</span>
                <span className="font-semibold">{zoozAmount.toLocaleString()} Z</span>
              </div>
              <div className="flex justify-between items-center">
                <span>מחיר:</span>
                <span className="font-semibold">${usdValue.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <Label>אמצעי תשלום</Label>
              <RadioGroup value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.value} className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value={method.value} id={method.value} />
                      <Label htmlFor={method.value} className="flex items-center gap-2 cursor-pointer flex-1">
                        <Icon className="h-4 w-4" />
                        {method.label}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            <Button onClick={handleContinue} className="w-full">
              המשך לתשלום
            </Button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-6">
            {/* Final Summary */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {zoozAmount.toLocaleString()} Z
                </div>
                <div className="text-sm text-muted-foreground">
                  ${usdValue.toFixed(2)} USD
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span>אמצעי תשלום:</span>
                  <span className="font-medium">
                    {paymentMethods.find(m => m.value === paymentMethod)?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details Mock */}
            {paymentMethod === "card" && (
              <div className="space-y-3">
                <Input placeholder="מספר כרטיס" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVV" />
                </div>
              </div>
            )}

            <Button 
              onClick={handleConfirm} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "מעבד תשלום..." : "אשר ורכוש"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};