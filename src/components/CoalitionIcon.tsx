import React from 'react';

interface CoalitionIconProps {
  className?: string;
  size?: number;
}

export const CoalitionIcon: React.FC<CoalitionIconProps> = ({ 
  className = "", 
  size = 16 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Outer circle border */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Dots forming a "C" shape */}
      <circle cx="8" cy="6" r="1.5" fill="currentColor" />
      <circle cx="6" cy="8" r="1.5" fill="currentColor" />
      <circle cx="5" cy="11" r="1.5" fill="currentColor" />
      <circle cx="5" cy="13" r="1.5" fill="currentColor" />
      <circle cx="6" cy="16" r="1.5" fill="currentColor" />
      <circle cx="8" cy="18" r="1.5" fill="currentColor" />
      <circle cx="11" cy="19" r="1.5" fill="currentColor" />
      <circle cx="13" cy="19" r="1.5" fill="currentColor" />
      <circle cx="16" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
};