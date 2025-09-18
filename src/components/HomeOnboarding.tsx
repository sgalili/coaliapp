import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
interface HomeOnboardingProps {
  onClose: () => void;
  onStartTour: () => void;
}
export const HomeOnboarding = ({
  onClose,
  onStartTour
}: HomeOnboardingProps) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };
  const handleStartTour = () => {
    setIsVisible(false);
    setTimeout(onStartTour, 300);
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className={cn("absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300", isVisible ? "opacity-100" : "opacity-0")} onClick={handleClose} />
      
      {/* Modal */}
      <div className={cn("relative bg-card rounded-2xl p-8 mx-4 max-w-md w-full shadow-2xl border border-border/20 transition-all duration-300", isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4")}>
        {/* Close button */}
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Hero text with emoji */}
          <div className="space-y-4">
            
            <h1 className="text-xl font-bold text-foreground">מוכנים לסיור קצר?</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              כאן תוכלו להכיר, לבחור ולהשפיע על העתיד שלנו.
            </p>
          </div>

          {/* Main description */}
          <div className="space-y-4 text-right">
            <p className="text-sm text-muted-foreground">דף הבית מחולק לשני מרחבים עיקריים:</p>
            
            <div className="space-y-4">
              {/* זירה section */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border/10">
                <div className="flex items-center gap-2 mb-2 justify-end">
                  <span className="font-semibold text-primary">זירה</span>
                  <div className="text-lg">👥</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  כאן תכירו מומחים ומועמדים לתפקידים - צפו בסרטונים שלהם, תנו להם אמון ובחרו במי לתמוך
                </p>
              </div>

              {/* החלטות section */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border/10">
                <div className="flex items-center gap-2 mb-2 justify-end">
                  <span className="font-semibold text-primary">החלטות</span>
                  <div className="text-lg">🗳️</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  השתתפו בהחלטות - הצביעו בסקרים, משאלי עם, בחירות וצרו את ה-MyGov האישי שלכם
                </p>
              </div>
            </div>

            <p className="text-sm font-medium text-foreground mt-4">
              עכשיו זה הזמן שלכם להיות חלק מהשינוי.
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4">
            <Button onClick={handleStartTour} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              הדרכה מהירה
            </Button>
            
            <Button onClick={handleClose} variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
              דלג
            </Button>
          </div>
        </div>
      </div>
    </div>;
};