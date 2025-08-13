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
    <div className="flex items-center justify-center gap-4 px-4 py-3 bg-background/90 backdrop-blur-sm border-b border-border/50">
      {/* Default Filter - עכשיו */}
      <Button
        variant={activeFilter.type === 'all' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleFilterClick('all')}
        className="text-sm font-medium"
      >
        עכשיו
      </Button>

      {/* Top Trusted Users Filter - מובילים */}
      <Button
        variant={activeFilter.type === 'trusted' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleFilterClick('trusted')}
        className="text-sm font-medium"
      >
        מובילים
      </Button>

      {/* Category Filter - קטגוריות */}
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={activeFilter.type === 'category' ? 'default' : 'ghost'}
            size="sm"
            className="text-sm font-medium flex items-center gap-1"
          >
            {activeFilter.type === 'category' && activeFilter.category 
              ? getCategoryLabel(activeFilter.category)
              : 'קטגוריות'
            }
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48 bg-background border border-border">
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