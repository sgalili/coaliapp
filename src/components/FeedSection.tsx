import { ReactNode } from "react";
import { SectionHeader } from "./SectionHeader";
import { LucideIcon } from "lucide-react";
import { useScrollState } from "@/hooks/useScrollState";

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
  const { isHeaderVisible, isFilterVisible } = useScrollState();
  
  // Don't render anything if section is empty
  if (isEmpty) {
    return null;
  }

  // Calculate sticky position based on header and filter visibility
  const getStickyTop = () => {
    if (isHeaderVisible && isFilterVisible) {
      return "top-[130px]"; // Below header (73px) + filter (57px)
    } else if (isHeaderVisible && !isFilterVisible) {
      return "top-[73px]"; // Below header only
    } else if (!isHeaderVisible && isFilterVisible) {
      return "top-[57px]"; // Below filter only
    } else {
      return "top-0"; // At the very top
    }
  };

  return (
    <section className={`w-full h-screen flex flex-col ${className}`}>
      <SectionHeader 
        icon={icon}
        title={title}
        description={description}
        details={details}
        badge={badge}
        stickyTop={getStickyTop()}
      />
      <div className="flex-1 overflow-y-auto animate-fade-in">
        {children}
      </div>
    </section>
  );
};