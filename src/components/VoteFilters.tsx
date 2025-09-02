import { cn } from "@/lib/utils";

export type VoteFilterType = 'for-me' | 'candidates' | 'experts' | 'all';

interface VoteFiltersProps {
  activeFilter: VoteFilterType;
  onFilterChange: (filter: VoteFilterType) => void;
}

export const VoteFilters = ({ activeFilter, onFilterChange }: VoteFiltersProps) => {
  const filters = [
    { id: 'for-me' as const, label: 'עבורי', icon: '👤' },
    { id: 'candidates' as const, label: 'מועמדים', icon: '🗳️' },
    { id: 'experts' as const, label: 'מומחים', icon: '👨‍🎓' },
    { id: 'all' as const, label: 'הכל', icon: '📋' }
  ];

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-full px-2 py-1 shadow-lg">
        <div className="flex items-center gap-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 text-xs font-medium whitespace-nowrap",
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <span className="text-xs">{filter.icon}</span>
              <span className="text-xs">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};