import { ReactNode } from "react";
import { SectionHeader } from "./SectionHeader";
import { LucideIcon } from "lucide-react";

interface FeedSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  details?: string;
  badge?: number;
  children: ReactNode;
  isEmpty?: boolean;
  className?: string;
}

export const FeedSection = ({ 
  icon, 
  title, 
  description, 
  details,
  badge, 
  children, 
  isEmpty = false,
  className = ""
}: FeedSectionProps) => {
  // Don't render anything if section is empty
  if (isEmpty) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <SectionHeader 
        icon={icon}
        title={title}
        description={description}
        details={details}
        badge={badge}
      />
      <div className="animate-fade-in">
        {children}
      </div>
    </div>
  );
};