import React from 'react';
import { Handshake, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FillableIconProps {
  className?: string;
  isFilled?: boolean;
}

export const TrustIconFillable: React.FC<FillableIconProps> = ({ className, isFilled = false }) => {
  if (isFilled) {
    return (
      <svg 
        className={cn("w-6 h-6 text-white transition-all duration-300", className)} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        {/* Using exact Handshake paths from Lucide React but with white fill */}
        <path 
          d="m11 17 2 2a1 1 0 1 0 3-3" 
          fill="white"
          stroke="black" 
          strokeWidth="1.5"
        />
        <path 
          d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" 
          fill="white"
          stroke="black" 
          strokeWidth="1.5"
        />
        <path 
          d="m21 3 1 11h-2" 
          fill="none"
          stroke="black" 
          strokeWidth="1.5"
        />
        <path 
          d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" 
          fill="white"
          stroke="black" 
          strokeWidth="1.5"
        />
        <path 
          d="M3 4h8" 
          fill="none"
          stroke="black" 
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Handshake 
        className="w-6 h-6 text-white transition-all duration-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </div>
  );
};

export const WatchIconFillable: React.FC<FillableIconProps> = ({ className, isFilled = false }) => {
  return (
    <svg 
      className={cn("w-6 h-6 text-white transition-all duration-300", className)} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      {/* Outer eye shape */}
      <path 
        d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" 
        fill={isFilled ? "white" : "none"}
        stroke="currentColor" 
      />
      {/* Inner pupil - always stays transparent with stroke */}
      <circle 
        cx="12" 
        cy="12" 
        r="3" 
        fill="none" 
        stroke={isFilled ? "black" : "currentColor"} 
        strokeWidth={isFilled ? "1.5" : "2"}
      />
    </svg>
  );
};

export const VoteIconFillable: React.FC<FillableIconProps> = ({ className, isFilled = false }) => {
  return (
    <svg 
      className={cn("w-6 h-6 text-white transition-all duration-300", className)} 
      viewBox="0 0 24 24" 
      fill={isFilled ? "white" : "none"} 
      stroke="currentColor" 
      strokeWidth={isFilled ? 1 : 2}
    >
      <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"/>
      <path d="M13 11h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"/>
      <path d="M9 11V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
      <circle cx="12" cy="6" r="3" fill={isFilled ? "white" : "none"}/>
    </svg>
  );
};