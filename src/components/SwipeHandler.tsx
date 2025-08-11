import { useEffect, useRef, useState } from "react";
import { Heart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeHandlerProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  className?: string;
}

export const SwipeHandler = ({ children, onSwipeLeft, onSwipeRight, className }: SwipeHandlerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const startX = useRef(0);
  const currentX = useRef(0);
  const threshold = 100;

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startX.current = clientX;
    currentX.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    currentX.current = clientX;
    const deltaX = currentX.current - startX.current;
    setSwipeDistance(Math.abs(deltaX));
    
    if (Math.abs(deltaX) > 20) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    const deltaX = currentX.current - startX.current;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
    
    setIsDragging(false);
    setSwipeDirection(null);
    setSwipeDistance(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const opacity = Math.min(swipeDistance / threshold, 0.8);

  return (
    <div
      ref={containerRef}
      className={cn("relative select-none", className)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      
      {/* Swipe indicators */}
      {swipeDirection === 'right' && (
        <div 
          className="absolute inset-0 bg-trust/20 flex items-center justify-center pointer-events-none transition-opacity"
          style={{ opacity }}
        >
          <div className="bg-trust text-trust-foreground p-4 rounded-full">
            <Heart className="w-8 h-8 fill-current" />
          </div>
        </div>
      )}
      
      {swipeDirection === 'left' && (
        <div 
          className="absolute inset-0 bg-watch/20 flex items-center justify-center pointer-events-none transition-opacity"
          style={{ opacity }}
        >
          <div className="bg-watch text-watch-foreground p-4 rounded-full">
            <Eye className="w-8 h-8" />
          </div>
        </div>
      )}
    </div>
  );
};