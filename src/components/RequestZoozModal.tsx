import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Share2, QrCode, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeDisplay } from "./QRCodeDisplay";

interface RequestZoozModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestZoozModal = ({ isOpen, onClose }: RequestZoozModalProps) => {
  const [step, setStep] = useState<"details" | "share">("details");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const zoozAmount = amount ? parseInt(amount) : 0;
  const requestId = "req_" + Math.random().toString(36).substr(2, 9);
  const requestLink = `https://zooz.app/pay/${requestId}`;

  const handleCreateRequest = () => {
    if (zoozAmount > 0) {
      setStep("share");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(requestLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "קישור הועתק",
        description: "הקישור הועתק ללוח",
      });
    } catch (err) {
      toast({
        title: "שגיאה",
        description: "לא ניתן להעתיק את הקישור",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "בקשת ZOOZ",
      text: `בקשה לתשלום של ${zoozAmount.toLocaleString()} ZOOZ${description ? `: ${description}` : ""}`,
      url: requestLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Sharing cancelled");
      }
    } else {
      // Fallback to clipboard
      handleCopyLink();
    }
  };

  const handleBack = () => {
    setStep("details");
  };

  const handleClose = () => {
    onClose();
    // Reset state
    setStep("details");
    setAmount("");
    setDescription("");
    setCopied(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === "details" ? "בקשת ZOOZ" : "שתף את הבקשה"}
          </DialogTitle>
        </DialogHeader>

        {step === "details" && (
          <div className="space-y-4">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label>סכום מבוקש</Label>
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

            {/* Description */}
            <div className="space-y-2">
              <Label>תיאור (אופציונלי)</Label>
              <Textarea
                placeholder="תאר את מטרת הבקשה..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Preview */}
            {zoozAmount > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {zoozAmount.toLocaleString()} Z
                  </div>
                  {description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {description}
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button 
              onClick={handleCreateRequest} 
              disabled={zoozAmount <= 0}
              className="w-full"
            >
              צור בקשת תשלום
            </Button>
          </div>
        )}

        {step === "share" && (
          <div className="space-y-6">
            {/* Request Summary */}
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {zoozAmount.toLocaleString()} Z
              </div>
              {description && (
                <div className="text-sm text-muted-foreground">
                  {description}
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <QRCodeDisplay value={requestLink} size={180} />
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              {/* Copy Link */}
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="w-full justify-start"
              >
                {copied ? (
                  <Check className="w-4 h-4 ml-2" />
                ) : (
                  <Copy className="w-4 h-4 ml-2" />
                )}
                {copied ? "הועתק!" : "העתק קישור"}
              </Button>

              {/* Share */}
              <Button
                variant="outline"
                onClick={handleShare}
                className="w-full justify-start"
              >
                <Share2 className="w-4 h-4 ml-2" />
                שתף
              </Button>

              {/* Back */}
              <Button
                variant="ghost"
                onClick={handleBack}
                className="w-full"
              >
                חזור לעריכה
              </Button>
            </div>

            {/* Link Preview */}
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">קישור הבקשה:</div>
              <div className="text-xs font-mono break-all">
                {requestLink}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};