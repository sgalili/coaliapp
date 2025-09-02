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
    <div className={`px-4 py-6 border-b border-border/50 bg-gradient-to-l from-background to-background/95 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {badge !== undefined && badge > 0 && (
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground mr-11 leading-relaxed">
        {description}
      </p>
    </div>
  );
};