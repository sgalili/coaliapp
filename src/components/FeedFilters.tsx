import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FilterType = 'all' | 'trusted' | 'category';

export interface FilterState {
  type: FilterType;
  category?: string;
}

interface FeedFiltersProps {
  activeFilter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

const categories = [
  { key: 'politics', label: 'פוליטיקה' },
  { key: 'technology', label: 'טכנולוגיה' },
  { key: 'education', label: 'חינוך' },
  { key: 'academia', label: 'אקדמיה' },
  { key: 'startup', label: 'יזמות' },
  { key: 'art', label: 'אמנות' },
];

export const FeedFilters = ({ activeFilter, onFilterChange }: FeedFiltersProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFilterClick = (type: FilterType, category?: string) => {
    onFilterChange({ type, category });
    if (type === 'category') {
      setIsDropdownOpen(false);
    }
  };

  const getCategoryLabel = (categoryKey: string) => {
    return categories.find(cat => cat.key === categoryKey)?.label || categoryKey;
  };

  return (
    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-2 backdrop-blur-sm rounded-full">
      {/* Default Filter - עכשיו */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFilterClick('all')}
        className={`text-sm font-medium text-white hover:bg-white/20 border-none ${
          activeFilter.type === 'all' ? 'bg-white/30 font-bold' : ''
        }`}
      >
        עכשיו
      </Button>

      {/* Top Trusted Users Filter - מובילים */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFilterClick('trusted')}
        className={`text-sm font-medium text-white hover:bg-white/20 border-none ${
          activeFilter.type === 'trusted' ? 'bg-white/30 font-bold' : ''
        }`}
      >
        מובילים
      </Button>

      {/* Category Filter - קטגוריות */}
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`text-sm font-medium flex items-center gap-1 text-white hover:bg-white/20 border-none ${
              activeFilter.type === 'category' ? 'bg-white/30 font-bold' : ''
            }`}
          >
            {activeFilter.type === 'category' && activeFilter.category 
              ? getCategoryLabel(activeFilter.category)
              : 'קטגוריות'
            }
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48 bg-background border border-border z-50">
          {categories.map((category) => (
            <DropdownMenuItem
              key={category.key}
              onClick={() => handleFilterClick('category', category.key)}
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
            >
              {category.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};