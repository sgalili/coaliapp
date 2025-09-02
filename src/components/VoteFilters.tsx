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
      <div className="bg-black/10 backdrop-blur-sm border border-white/20 rounded-full px-1 py-1 shadow-lg">
        <div className="flex items-center gap-0.5">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full transition-all duration-200 text-xs font-medium whitespace-nowrap",
                activeFilter === filter.id
                  ? "bg-white text-black shadow-sm"
                  : "text-white/80 hover:text-white hover:bg-white/10"
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