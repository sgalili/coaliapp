import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, GraduationCap, Heart, Smartphone, Palette } from "lucide-react";
import type { ExpertDomain } from "@/types/expert";

const domains = [
  { id: 'all', name: 'הכל', icon: null, color: 'default' },
  { id: 'economy', name: 'כלכלה', icon: TrendingUp, color: 'green' },
  { id: 'security', name: 'ביטחון', icon: Shield, color: 'blue' },
  { id: 'education', name: 'חינוך', icon: GraduationCap, color: 'purple' },
  { id: 'health', name: 'רפואה', icon: Heart, color: 'red' },
  { id: 'tech', name: 'טכנולוגיה', icon: Smartphone, color: 'orange' },
  { id: 'culture', name: 'תרבות', icon: Palette, color: 'pink' }
] as const;

interface DomainFilterProps {
  selectedDomain: ExpertDomain | 'all';
  onDomainChange: (domain: ExpertDomain | 'all') => void;
}

export const DomainFilter = ({ selectedDomain, onDomainChange }: DomainFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      {domains.map((domain) => {
        const IconComponent = domain.icon;
        const isSelected = selectedDomain === domain.id;
        
        return (
          <button
            key={domain.id}
            onClick={() => onDomainChange(domain.id as ExpertDomain | 'all')}
            className="shrink-0"
          >
            <Badge 
              variant={isSelected ? "default" : "secondary"}
              className="flex items-center gap-1 px-3 py-1.5 transition-colors hover:bg-accent"
            >
              {IconComponent && <IconComponent className="w-3 h-3" />}
              <span className="text-xs font-medium">{domain.name}</span>
            </Badge>
          </button>
        );
      })}
    </div>
  );
};