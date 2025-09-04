import { useState, useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DecisionsOnboardingProps {
  onClose: () => void;
  onStartTour: () => void;
}

export const DecisionsOnboarding = ({ onClose, onStartTour }: DecisionsOnboardingProps) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={cn(
          "relative bg-card rounded-2xl p-8 mx-4 max-w-md w-full shadow-2xl border border-border/20 transition-all duration-300",
          isVisible 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-4"
        )}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Hero text with emoji */}
          <div className="space-y-4">
            <div className="text-4xl mb-2">✊</div>
            <h1 className="text-xl font-bold text-foreground">
              החלטות — עכשיו זה תלוי בך
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              הפעם אתה לא רק צופה — אתה משפיע.
            </p>
          </div>

          {/* Main description */}
          <div className="space-y-4 text-right">
            <p className="text-sm text-muted-foreground">
              מהיום, תוכל להשתתף בהחלטות שמשפיעות על החיים שלך:
            </p>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• לבחור נציגים ואנשים שאתה סומך עליהם</p>
              <p>• להצביע בסקרים ולשנות סדר יום</p>
              <p>• להאציל סמכויות ולבנות קהילה אמינה</p>
              <p>• להשפיע מקומית, אזורית וארצית</p>
            </div>

            <p className="text-sm font-medium text-foreground mt-4">
              הדעה שלך לא רק נשמעת — היא נחשבת.
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleStartTour}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              גלה את האפליקציה
            </Button>
            
            <Button
              onClick={handleClose}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              דלג
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};