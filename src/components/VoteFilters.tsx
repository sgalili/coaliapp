import { cn } from "@/lib/utils";

export type VoteFilterType = 'for-me' | 'candidates' | 'experts' | 'all';

interface VoteFiltersProps {
  activeFilter: VoteFilterType;
  onFilterChange: (filter: VoteFilterType) => void;
}

export const VoteFilters = ({ activeFilter, onFilterChange }: VoteFiltersProps) => {

  const filters = [
    { id: 'for-me' as const, label: 'החלטות' },
    { id: 'candidates' as const, label: 'המעגל שלי' },
    { id: 'experts' as const, label: 'סייר' }
  ];

  return (
    <div className="fixed top-[68px] left-1/2 transform -translate-x-1/2 z-50">
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
                : "text-muted-foreground hover:text-foreground bg-muted/20"
            )}
          >
            <span className="text-xs">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};