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
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-200 text-xs font-medium whitespace-nowrap backdrop-blur-sm shadow-sm",
              activeFilter === filter.id
                ? "bg-white/90 text-black"
                : "bg-white/20 text-white hover:bg-white/30"
            )}
          >
            <span className="text-xs">{filter.icon}</span>
            <span className="text-xs">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};