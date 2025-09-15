import { cn } from "@/lib/utils";
import { OrganizationType } from "./LocationBadge";

interface PollHeaderCardProps {
  organizationType: OrganizationType;
  organizationName: string;
  publishedDate: string;
  expiresAt: string;
  totalVotes: number;
  className?: string;
}

const calculateTimeRemaining = (expiresAt: string): string => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  
  if (diff <= 0) return "סגור";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days} ימים נותרו`;
  if (hours > 0) return `${hours} שעות נותרו`;
  return "פחות משעה נותרה";
};

const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return `לפני ${minutes} דקות`;
  } else if (hours < 24) {
    return `לפני ${hours} שעות`;
  } else {
    return `לפני ${days} ימים`;
  }
};

export const PollHeaderCard = ({ 
  organizationType, 
  organizationName, 
  publishedDate, 
  expiresAt, 
  totalVotes, 
  className 
}: PollHeaderCardProps) => {
  const timeRemaining = calculateTimeRemaining(expiresAt);
  const formattedDate = formatTimeAgo(publishedDate);

  return (
    <div className={cn(
      "flex flex-col items-center p-4 mt-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg animate-fade-in",
      className
    )}>
      {/* Organization Info */}
      <div className="flex items-center justify-center mb-3">
        <h3 className="text-white font-bold text-lg text-center">
          {organizationName}
        </h3>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-center gap-2 text-white/80 text-xs whitespace-nowrap">
        <span>{formattedDate}</span>
        <span>•</span>
        <span>{timeRemaining}</span>
        <span>•</span>
        <span>{totalVotes.toLocaleString()} הצבעות</span>
      </div>
    </div>
  );
};