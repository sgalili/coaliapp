import { cn } from "@/lib/utils";
import { MapPin, Building2, Globe, Users, Landmark, Clock, Calendar } from "lucide-react";
import { OrganizationType } from "./LocationBadge";

interface PollHeaderCardProps {
  organizationType: OrganizationType;
  organizationName: string;
  publishedDate: string;
  expiresAt: string;
  totalVotes: number;
  className?: string;
}

const organizationConfig = {
  neighborhood: {
    icon: MapPin,
    emoji: "🏘️",
    color: "text-emerald-400"
  },
  city: {
    icon: Building2,
    emoji: "🏙️",
    color: "text-blue-400"
  },
  country: {
    icon: Globe,
    emoji: "🇮🇱",
    color: "text-purple-400"
  },
  foundation: {
    icon: Landmark,
    emoji: "🏛️",
    color: "text-amber-400"
  },
  company: {
    icon: Users,
    emoji: "🏢",
    color: "text-cyan-400"
  }
};

const calculateTimeRemaining = (expiresAt: string): string => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  
  if (diff <= 0) return "סגור";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days} ימים`;
  if (hours > 0) return `${hours} שעות`;
  return "פחות משעה";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('he-IL', { 
    day: 'numeric', 
    month: 'short' 
  });
};

export const PollHeaderCard = ({ 
  organizationType, 
  organizationName, 
  publishedDate, 
  expiresAt, 
  totalVotes, 
  className 
}: PollHeaderCardProps) => {
  const config = organizationConfig[organizationType];
  const Icon = config.icon;
  const timeRemaining = calculateTimeRemaining(expiresAt);
  const formattedDate = formatDate(publishedDate);

  return (
    <div className={cn(
      "flex flex-col items-center p-4 mt-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg animate-fade-in",
      className
    )}>
      {/* Organization Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.emoji}</span>
          <Icon className={cn("w-5 h-5", config.color)} />
        </div>
        <h3 className="text-white font-bold text-lg text-center">
          {organizationName}
        </h3>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-center gap-6 text-white/80 text-sm">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="w-px h-4 bg-white/30" />
        
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{timeRemaining}</span>
        </div>
        
        <div className="w-px h-4 bg-white/30" />
        
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{totalVotes.toLocaleString()} משתתפים</span>
        </div>
      </div>
    </div>
  );
};