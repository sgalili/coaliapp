import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export type VoteFilterType = 'for-me' | 'candidates' | 'experts' | 'all';

interface VoteFiltersProps {
  activeFilter: VoteFilterType;
  onFilterChange: (filter: VoteFilterType) => void;
}

export const VoteFilters = ({ activeFilter, onFilterChange }: VoteFiltersProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show filter at the top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false);
      } else if (lastScrollY - currentScrollY > 5) {
        // Scrolling up by at least 5px
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const filters = [
    { id: 'for-me' as const, label: 'עבורי', icon: '👤' },
    { id: 'candidates' as const, label: 'מועמדים', icon: '🗳️' },
    { id: 'experts' as const, label: 'מומחים', icon: '👨‍🎓' },
    { id: 'all' as const, label: 'הכל', icon: '📋' }
  ];

  return (
    <div className={`fixed top-[78px] left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="flex items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-200 text-xs font-medium whitespace-nowrap backdrop-blur-sm shadow-sm",
              activeFilter === filter.id
                ? "bg-white/90 text-black"
                : "bg-black/20 text-white/90 hover:bg-black/30 hover:text-white"
            )}
          >
            <span className="text-xs">{filter.icon}</span>
            <span className="text-xs">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};