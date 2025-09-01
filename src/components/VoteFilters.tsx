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
    <div className="absolute bottom-20 right-4 left-4 z-30">
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-full p-1 shadow-lg">
        <div className="flex justify-between gap-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-full transition-all duration-200 text-xs font-medium",
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <span className="text-sm mb-1">{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};