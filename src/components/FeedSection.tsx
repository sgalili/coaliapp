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
    <section className={`w-full h-screen flex flex-col ${className}`}>
      <SectionHeader 
        icon={icon}
        title={title}
        description={description}
        details={details}
        badge={badge}
        className="sticky top-16 z-10"
      />
      <div className="flex-1 overflow-y-auto animate-fade-in">
        {children}
      </div>
    </section>
  );
};