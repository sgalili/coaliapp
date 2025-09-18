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
      {/* Dots forming a clear "C" shape */}
      <circle cx="15" cy="5" r="1.2" fill="currentColor" />
      <circle cx="11" cy="4" r="1.2" fill="currentColor" />
      <circle cx="7" cy="5" r="1.2" fill="currentColor" />
      <circle cx="4" cy="8" r="1.2" fill="currentColor" />
      <circle cx="3" cy="12" r="1.2" fill="currentColor" />
      <circle cx="4" cy="16" r="1.2" fill="currentColor" />
      <circle cx="7" cy="19" r="1.2" fill="currentColor" />
      <circle cx="11" cy="20" r="1.2" fill="currentColor" />
      <circle cx="15" cy="19" r="1.2" fill="currentColor" />
    </svg>
  );
};