import { TrendingUp, Vote, Users, Target, Award, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImpactFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: "all", label: "הכל", icon: Sparkles },
  { id: "trending", label: "פופולרי", icon: TrendingUp },
  { id: "decision", label: "החלטות", icon: Vote },
  { id: "trust", label: "אמון", icon: Users },
  { id: "vote", label: "הצבעות", icon: Target },
  { id: "achievement", label: "הישגים", icon: Award },
];

export const ImpactFilters = ({ activeFilter, onFilterChange }: ImpactFiltersProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <Icon className="w-4 h-4" />
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
