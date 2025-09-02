import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: number;
  className?: string;
}

export const SectionHeader = ({ 
  icon: Icon, 
  title, 
  description, 
  badge, 
  className = "" 
}: SectionHeaderProps) => {
  return (
    <div className={`w-full px-4 py-3 bg-blue-50/90 hover:bg-blue-50 transition-colors ${className}`}>
      <div className="flex items-center gap-2">
        <Icon className="w-3 h-3 text-muted-foreground" />
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
        {badge !== undefined && badge > 0 && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-4">
            {badge}
          </Badge>
        )}
      </div>
    </div>
  );
};