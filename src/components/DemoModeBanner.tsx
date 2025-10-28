import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useIsDemoMode } from "@/hooks/useIsDemoMode";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const DemoModeBanner = () => {
  const { isDemoMode, disableDemoMode } = useIsDemoMode();
  const navigate = useNavigate();
  const [showExitDialog, setShowExitDialog] = useState(false);

  if (!isDemoMode) return null;

  const handleExitDemo = () => {
    disableDemoMode();
    // Force page reload to clear all state
    window.location.href = '/auth';
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-3 flex items-center justify-between shadow-lg border-b-2 border-orange-600">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-sm" />
          <span className="font-bold text-sm">🎭 מצב דמו - Demo Mode</span>
          <span className="text-xs opacity-90 hidden sm:inline">כל הפעולות והנתונים הם לדוגמה בלבד</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowExitDialog(true)}
          className="text-white hover:bg-white/20 font-semibold"
        >
          צא ממצב דמו
          <X className="h-4 w-4 mr-2" />
        </Button>
      </div>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>יציאה ממצב דמו</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              רוצה לצאת ממצב הדמו ולהתחבר לחשבון אמיתי?
              <br />
              כל הנתונים והפעולות במצב הדמו לא ישמרו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction onClick={handleExitDemo}>
              כן, צא ממצב דמו
            </AlertDialogAction>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
