import { useState } from "react";
import { cn } from "@/lib/utils";

interface NewsFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: 'all', label: 'הכל' },
  { id: 'politics', label: 'פוליטיקה' },
  { id: 'technology', label: 'טכנולוגיה' },
  { id: 'economy', label: 'כלכלה' },
  { id: 'sports', label: 'ספורט' },
  { id: 'culture', label: 'תרבות' },
  { id: 'trending', label: 'חם עכשיו' }
];

export const NewsFilters = ({ activeFilter, onFilterChange }: NewsFiltersProps) => {
  return (
    <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-40">
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                "border border-border backdrop-blur-sm flex-shrink-0",
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                  : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};