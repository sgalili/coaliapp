import { cn } from "@/lib/utils";
import { MapPin, Building2, Globe, Users, Landmark } from "lucide-react";

export type OrganizationType = 'neighborhood' | 'city' | 'country' | 'foundation' | 'company';

interface LocationBadgeProps {
  type: OrganizationType;
  name: string;
  className?: string;
}

const organizationConfig = {
  neighborhood: {
    icon: MapPin,
    emoji: "🏘️",
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30"
  },
  city: {
    icon: Building2,
    emoji: "🏙️",
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30"
  },
  country: {
    icon: Globe,
    emoji: "🇮🇱",
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/30"
  },
  foundation: {
    icon: Landmark,
    emoji: "🏛️",
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30"
  },
  company: {
    icon: Users,
    emoji: "🏢",
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    border: "border-cyan-500/30"
  }
};

export const LocationBadge = ({ type, name, className }: LocationBadgeProps) => {
  const config = organizationConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border backdrop-blur-sm",
      config.bg,
      config.text,
      config.border,
      className
    )}>
      <span className="text-xs">{config.emoji}</span>
      <Icon className="w-3 h-3" />
      <span>{name}</span>
    </div>
  );
};