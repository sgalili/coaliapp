import React from 'react';

interface SparklesProps {
  isActive: boolean;
}

export const Sparkles: React.FC<SparklesProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full animate-sparkle-1">
        <div className="w-full h-full bg-white rounded-full opacity-80" />
      </div>
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-sparkle-2">
        <div className="w-full h-full bg-white rounded-full opacity-60" />
      </div>
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full animate-sparkle-3">
        <div className="w-full h-full bg-white rounded-full opacity-80" />
      </div>
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-sparkle-4">
        <div className="w-full h-full bg-white rounded-full opacity-70" />
      </div>
    </div>
  );
};