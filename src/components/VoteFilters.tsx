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
    <div className="fixed top-20 left-4 right-4 z-30">
      <div className="bg-background/70 backdrop-blur-md border border-border/50 rounded-full p-1 shadow-lg">
        <div className="flex justify-between gap-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-full transition-all duration-200 text-xs font-medium",
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <span className="text-xs mb-0.5">{filter.icon}</span>
              <span className="text-[10px]">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};