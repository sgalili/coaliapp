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
    <div className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-slate-200/50 z-40">
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                "border border-slate-200/50 backdrop-blur-sm flex-shrink-0",
                activeFilter === filter.id
                  ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/25"
                  : "bg-white/70 text-slate-600 hover:bg-white hover:text-slate-800 hover:shadow-sm"
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