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
      const scrollContainer = document.querySelector('.h-screen.overflow-y-scroll');
      if (!scrollContainer) return;
      
      const currentScrollY = scrollContainer.scrollTop;
      
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

    const scrollContainer = document.querySelector('.h-screen.overflow-y-scroll');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  const filters = [
    { id: 'for-me' as const, label: 'החלטות' },
    { id: 'candidates' as const, label: 'המעגל שלי' },
    { id: 'experts' as const, label: 'סייר' }
  ];

  return (
    <div className={`fixed top-[68px] left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
    }`}>
      <div className="flex items-center gap-1 px-2 py-1">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            data-tour-id={filter.id === 'for-me' ? 'decisions-filter' : filter.id === 'candidates' ? 'circle-filter' : 'explore-filter'}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200",
              activeFilter === filter.id
                ? "bg-primary/20 text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
            )}
          >
            <span className="text-xs">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};