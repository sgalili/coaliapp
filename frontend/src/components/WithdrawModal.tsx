import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock } from "lucide-react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal = ({ isOpen, onClose }: WithdrawModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">משיכה</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">זמין בקרוב!</h3>
            <p className="text-muted-foreground">
              תכונת המשיכה נמצאת בפיתוח ותהיה זמינה בקרוב.
            </p>
          </div>

          {/* Features Preview */}
          <div className="bg-muted/50 p-4 rounded-lg text-right space-y-2">
            <div className="text-sm font-medium mb-3">תכונות שיהיו זמינות:</div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>• משיכה לארנק קריפטו</div>
              <div>• המרה למטבע רגיל</div>
              <div>• העברה בנקאית</div>
              <div>• גבולות משיכה יומיים</div>
            </div>
          </div>

          {/* Notification */}
          <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-right">
                נשלח לך הודעה כשהתכונה תהיה זמינה
              </div>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            הבנתי
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};