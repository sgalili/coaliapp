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
  const [phase, setPhase] = useState<'numbers' | 'labels'>('numbers');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 15-second cycle: 10s numbers, 5s labels
    const startCycle = () => {
      // Phase 1: Show numbers for 10 seconds
      const timer1 = setTimeout(() => {
        setIsAnimating(true);
        
        // After 300ms transition, show labels
        const timer2 = setTimeout(() => {
          setPhase('labels');
          setIsAnimating(false);
          
          // Phase 2: Show labels for 5 seconds
          const timer3 = setTimeout(() => {
            setIsAnimating(true);
            
            // After 300ms transition, show numbers
            const timer4 = setTimeout(() => {
              setPhase('numbers');
              setIsAnimating(false);
              
              // Restart cycle
              startCycle();
            }, 300);
          }, 5000);
        }, 300);
      }, 10000);
    };

    startCycle();
  }, []);

  const renderContent = () => {
    if (phase === 'numbers') {
      return (
        <span 
          className={cn(
            "text-white text-xs font-medium transition-all duration-300",
            isAnimating ? "animate-slide-up-out" : ""
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
            isAnimating ? "animate-slide-down-out" : ""
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