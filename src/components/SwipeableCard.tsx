import { useState, useRef, useEffect } from "react";
import { motion, PanInfo, useAnimation } from "framer-motion";

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export const SwipeableCard = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  className = "" 
}: SwipeableCardProps) => {
  const [exitX, setExitX] = useState(0);
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 150;
    
    if (info.offset.x > threshold) {
      // Swipe right
      setExitX(1000);
      controls.start({ x: 1000, opacity: 0 });
      setTimeout(() => onSwipeRight?.(), 200);
    } else if (info.offset.x < -threshold) {
      // Swipe left  
      setExitX(-1000);
      controls.start({ x: -1000, opacity: 0 });
      setTimeout(() => onSwipeLeft?.(), 200);
    } else {
      // Return to center
      controls.start({ x: 0, rotate: 0, scale: 1 });
    }
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const rotation = info.offset.x * 0.1;
    const scale = 1 - Math.abs(info.offset.x) * 0.0001;
    
    controls.start({ 
      rotate: rotation,
      scale: Math.max(scale, 0.8),
      transition: { duration: 0 }
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`touch-none ${className}`}
      drag="x"
      dragConstraints={{ left: -300, right: 300 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
    >
      {children}
    </motion.div>
  );
};