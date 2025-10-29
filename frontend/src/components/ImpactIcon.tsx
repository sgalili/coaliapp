import React from 'react';
import { cn } from '@/lib/utils';

interface ImpactIconProps {
  className?: string;
  isActive?: boolean;
}

export const ImpactIcon = ({ className, isActive }: ImpactIconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-6", className)}
    >
      {/* Radiating waves on the left */}
      <path
        d="M4 12C4 10.5 5 9.5 6 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          isActive && "animate-pulse"
        )}
        opacity="0.6"
      />
      <path
        d="M2 12C2 9 4 7 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          isActive && "animate-pulse"
        )}
        opacity="0.4"
      />
      
      {/* Central circle (stamp) */}
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="currentColor"
        className={cn(
          "transition-all duration-300",
          isActive && "animate-[pulse_0.6s_ease-in-out_2]"
        )}
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={cn(
          "transition-all duration-300",
          isActive && "animate-[pulse_0.6s_ease-in-out_2]"
        )}
      />
      
      {/* Radiating waves on the right */}
      <path
        d="M20 12C20 10.5 19 9.5 18 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          isActive && "animate-pulse"
        )}
        opacity="0.6"
      />
      <path
        d="M22 12C22 9 20 7 18 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          isActive && "animate-pulse"
        )}
        opacity="0.4"
      />
      
      {/* Bottom waves */}
      <path
        d="M12 20C10.5 20 9.5 19 9 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          isActive && "animate-pulse"
        )}
        opacity="0.6"
      />
      <path
        d="M12 22C9 22 7 20 6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          isActive && "animate-pulse"
        )}
        opacity="0.4"
      />
      
      {/* Top waves */}
      <path
        d="M12 4C10.5 4 9.5 5 9 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          isActive && "animate-pulse"
        )}
        opacity="0.6"
      />
      <path
        d="M12 2C9 2 7 4 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          isActive && "animate-pulse"
        )}
        opacity="0.4"
      />
    </svg>
  );
};