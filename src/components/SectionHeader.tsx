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
    <div className={`w-full px-4 py-3 relative overflow-hidden
      bg-gradient-to-r from-blue-50/40 to-blue-50/20 
      hover:from-blue-50/60 hover:to-blue-50/40 
      transition-all duration-200 
      border-l-2 border-primary/20 hover:border-primary/40 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors">
          <Icon className="w-3 h-3 text-primary/70" />
        </div>
        <h3 className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">{title}</h3>
        {badge !== undefined && badge > 0 && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-4 bg-primary/10 text-primary/80 border-primary/20">
            {badge}
          </Badge>
        )}
      </div>
    </div>
  );
};