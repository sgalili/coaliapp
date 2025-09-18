import React from 'react';
import { Handshake, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FillableIconProps {
  className?: string;
  isFilled?: boolean;
}

export const TrustIconFillable: React.FC<FillableIconProps> = ({ className, isFilled = false }) => {
  return (
    <Handshake 
      className={cn("w-6 h-6 text-white transition-all duration-300", className)}
      fill={isFilled ? "white" : "none"}
      strokeWidth={isFilled ? 1 : 2}
    />
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