import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedStatBadgeProps {
  count: number;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  activeColor?: string;
  className?: string;
}


export const AnimatedStatBadge: React.FC<AnimatedStatBadgeProps> = ({
  count,
  label,
  icon,
  onClick,
  isActive = false,
  activeColor = "bg-white/20",
  className = ""
}) => {
  const [phase, setPhase] = useState<'numbers' | 'transitioning-to-label' | 'labels' | 'transitioning-to-numbers'>('numbers');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 18-second cycle: 5s numbers, 6s labels, 7s numbers
    const startCycle = () => {
      // Phase 1: Show numbers for 5 seconds
      setTimeout(() => {
        setIsAnimating(true);
        setPhase('transitioning-to-label');
        
        // After 300ms transition, show labels
        setTimeout(() => {
          setPhase('labels');
          setIsAnimating(false);
          
          // Phase 2: Show labels for 6 seconds
          setTimeout(() => {
            setIsAnimating(true);
            setPhase('transitioning-to-numbers');
            
            // After 300ms transition, show numbers
            setTimeout(() => {
              setPhase('numbers');
              setIsAnimating(false);
              
              // Phase 3: Show numbers for 7 more seconds before restarting
              setTimeout(() => {
                startCycle();
              }, 7000);
            }, 300);
          }, 6000);
        }, 300);
      }, 5000);
    };

    startCycle();
  }, []);

  const renderContent = () => {
    if (phase === 'numbers' || phase === 'transitioning-to-numbers') {
      return (
        <span 
          className={cn(
            "text-white text-xs font-medium transition-all duration-300",
            phase === 'transitioning-to-numbers' && !isAnimating ? "animate-slide-up-in" : "",
            phase === 'numbers' && isAnimating ? "animate-slide-up-out" : ""
          )}
        >
          {count.toLocaleString()}
        </span>
      );
    } else {
      return (
        <span 
          className={cn(
            "text-white text-xs font-medium transition-all duration-300",
            phase === 'transitioning-to-label' && !isAnimating ? "animate-slide-down-in" : "",
            phase === 'labels' && isAnimating ? "animate-slide-down-out" : ""
          )}
          dir="rtl"
        >
          {label}
        </span>
      );
    }
  };

  return (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-1 group", className)}>
      <div className={cn(
        "w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center group-active:scale-95 transition-transform",
        isActive ? activeColor : "bg-white/20"
      )}>
        {icon}
      </div>
      <div className="h-4 w-16 flex items-center justify-center">
        {renderContent()}
      </div>
    </button>
  );
};