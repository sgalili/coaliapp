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
    <div className={`fixed top-[73px] left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
    }`}>
      <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl p-1 shadow-lg shadow-black/5">
        <div className="flex items-center gap-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium whitespace-nowrap group",
                "hover:scale-105 active:scale-95",
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <span className="text-base transition-transform duration-300 group-hover:scale-110">
                {filter.icon}
              </span>
              <span className="font-semibold tracking-tight">{filter.label}</span>
              {activeFilter === filter.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};