import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  details?: string; // Additional details like building name, city, etc.
  badge?: number;
  className?: string;
}

export const SectionHeader = ({ 
  icon: Icon, 
  title, 
  description, 
  details,
  badge, 
  className = "" 
}: SectionHeaderProps) => {
  return (
    <div className={`w-full py-4 bg-background/95 backdrop-blur-sm border-b transition-colors sticky top-0 z-50 ${className}`}>
      <div className="flex items-center gap-3 px-4">
        <div className="p-2 rounded-lg bg-muted">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-foreground">
            {title}
            {details && (
              <span className="text-muted-foreground font-normal">: {details}</span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {badge !== undefined && badge > 0 && (
          <Badge variant="secondary" className="text-xs px-2 py-1">
            {badge}
          </Badge>
        )}
      </div>
    </div>
  );
};