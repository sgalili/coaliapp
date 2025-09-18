import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuidedTourProps {
  onClose: () => void;
}

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: "circle",
    title: "זירה - מעגל האמון והבחירה שלך",
    description: "גלה מומחים ומועמדים לתפקידים - תן להם אמון בתחומי המומחיות שלהם או הצבע עבורם לתפקידים. אפשר גם לתמוך כלכלית באמצעות המטבע ZOOZ.",
    targetSelector: "[data-tour-id='circle-filter']",
    position: "bottom"
  },
  {
    id: "decisions",
    title: "החלטות - השפע על העתיד שלך",
    description: "השתתף בהחלטות שמשפיעות עליך - הצבע בסקרים, משאלי עם ובחירות, וצור את הממשלה שלך עם המועמדים הנבחרים שלך.",
    targetSelector: "[data-tour-id='decisions-filter']",
    position: "bottom"
  },
  {
    id: "impact",
    title: "אימפקט",
    description: "קרא חדשות עם דעות מומחים והשפע ישירות עם הדעה האישית שלך.",
    targetSelector: "[data-tour-id='news-tab']",
    position: "top"
  },
  {
    id: "leaders",
    title: "מובילים",
    description: "מצא את האנשים שזכו בהכי הרבה אמון והצבעות, לפי תחום.",
    targetSelector: "[data-tour-id='leaders-tab']",
    position: "top"
  },
  {
    id: "wallet",
    title: "ארנק",
    description: "ה-ZOOZ שזכית בהם והוצאת יוצגו כאן. החלף, תגמל, קנה ומכור עם הטוקן ששייך לקהילה. ZOOZ!",
    targetSelector: "[data-tour-id='wallet-tab']",
    position: "top"
  },
  {
    id: "profile",
    title: "פרופיל",
    description: "הפרופיל שלך. מי סומך עליך, על מי אתה סומך, ההגדרות שלך והפתעות נוספות :)",
    targetSelector: "[data-tour-id='profile-tab']",
    position: "top"
  }
];

export const GuidedTour = ({ onClose }: GuidedTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    positionTooltip();
  }, []);

  useEffect(() => {
    positionTooltip();
  }, [currentStep]);

  const positionTooltip = () => {
    const step = tourSteps[currentStep];
    const targetElement = document.querySelector(step.targetSelector);
    
    if (!targetElement) {
      console.warn(`Target element not found: ${step.targetSelector}`);
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const tooltipElement = tooltipRef.current;
    
    if (!tooltipElement) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    console.log(`Step ${currentStep + 1}: Positioning logic`, { currentStep, stepId: step.id });

    // For steps 4-7 (navigation tabs), use ONLY bottom positioning logic
    if (currentStep >= 3) {
      console.log(`Step ${currentStep + 1}: Using bottom navigation logic`);
      top = viewportHeight - 280; // Fixed position near bottom for all navigation tabs
      left = rect.left + (rect.width / 2) - 150; // Center the tooltip on the tab
      
      // Only adjust left to stay within viewport
      if (left < 10) left = 10;
      if (left + 300 > viewportWidth - 10) left = viewportWidth - 310;
      
      console.log(`Step ${currentStep + 1}: Final position`, { top, left, viewportHeight });
    } else {
      // For steps 1-3, use the switch statement
      console.log(`Step ${currentStep + 1}: Using switch statement logic`);
      switch (step.position) {
        case 'bottom':
          top = rect.bottom + 15;
          left = rect.left + (rect.width / 2) - 150; // 150 is half tooltip width
          break;
        case 'top':
          top = rect.top - 15;
          left = rect.left + (rect.width / 2) - 150;
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - 60;
          left = rect.left - 315; // 300 + 15 margin
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - 60;
          left = rect.right + 15;
          break;
      }

      // Viewport adjustments for steps 1-3
      if (left < 10) left = 10;
      if (left + 300 > viewportWidth - 10) left = viewportWidth - 310;
      if (top < 10) top = 10;
      if (top + 120 > viewportHeight - 10) top = viewportHeight - 130;
      
      console.log(`Step ${currentStep + 1}: Final position after switch`, { top, left });
    }

    setTooltipPosition({ top, left });
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const currentStepData = tourSteps[currentStep];
  const targetElement = document.querySelector(currentStepData.targetSelector);

  const getArrowIcon = () => {
    switch (currentStepData.position) {
      case 'top': return <ArrowDown className="w-4 h-4" />;
      case 'bottom': return <ArrowUp className="w-4 h-4" />;
      case 'left': return <ArrowRight className="w-4 h-4" />;
      case 'right': return <ArrowLeft className="w-4 h-4" />;
      default: return <ArrowUp className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Spotlight overlay for all steps */}
      {targetElement ? (
        <>
          {/* Top overlay */}
          <div 
            className={cn(
              "absolute bg-black/70 backdrop-blur-sm transition-opacity duration-300",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: targetElement.getBoundingClientRect().top - 8,
            }}
          />
          
          {/* Bottom overlay */}
          <div 
            className={cn(
              "absolute bg-black/70 backdrop-blur-sm transition-opacity duration-300",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{
              top: targetElement.getBoundingClientRect().bottom + 8,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          
          {/* Left overlay */}
          <div 
            className={cn(
              "absolute bg-black/70 backdrop-blur-sm transition-opacity duration-300",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{
              top: targetElement.getBoundingClientRect().top - 8,
              left: 0,
              width: targetElement.getBoundingClientRect().left - 8,
              height: targetElement.getBoundingClientRect().height + 16,
            }}
          />
          
          {/* Right overlay */}
          <div 
            className={cn(
              "absolute bg-black/70 backdrop-blur-sm transition-opacity duration-300",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{
              top: targetElement.getBoundingClientRect().top - 8,
              left: targetElement.getBoundingClientRect().right + 8,
              right: 0,
              height: targetElement.getBoundingClientRect().height + 16,
            }}
          />
          
          {/* Glowing border around the spotlight */}
          <div
            className="absolute border-2 border-primary rounded-lg shadow-lg shadow-primary/50 transition-all duration-300 pointer-events-none"
            style={{
              top: targetElement.getBoundingClientRect().top - 8,
              left: targetElement.getBoundingClientRect().left - 8,
              width: targetElement.getBoundingClientRect().width + 16,
              height: targetElement.getBoundingClientRect().height + 16,
            }}
          />
        </>
      ) : (
        /* Fallback overlay if target element not found */
        <div 
          className={cn(
            "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={cn(
          "absolute bg-card border border-border/20 rounded-xl p-6 shadow-2xl max-w-sm transition-all duration-300",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted/50 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Arrow indicator */}
        <div className="flex items-center gap-2 mb-3">
          <div className="text-primary">
            {getArrowIcon()}
          </div>
          <h3 className="font-semibold text-foreground text-sm">
            {currentStepData.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed text-right mb-4">
          {currentStepData.description}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {currentStep + 1} מתוך {tourSteps.length}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              דלג על הסיור
            </Button>
            
            <Button
              onClick={handleNext}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {currentStep === tourSteps.length - 1 ? "סיים" : "הבא"}
              <ChevronLeft className="w-3 h-3 mr-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};