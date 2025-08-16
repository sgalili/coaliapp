import { Badge } from "@/components/ui/badge";
import { Star, StarIcon, Gem, Crown, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  trustCount: number;
  className?: string;
}

export const TrustBadge = ({ trustCount, className }: TrustBadgeProps) => {
  const getTrustLevel = (count: number) => {
    if (count >= 1000) return 5; // Leader
    if (count >= 500) return 4;  // Expert
    if (count >= 100) return 3;  // Trusted
    if (count >= 20) return 2;   // Member
    return 1; // Nouveau
  };

  const level = getTrustLevel(trustCount);

  const levelConfig = {
    1: {
      icon: User,
      label: "חדש",
      color: "text-muted-foreground",
      bg: "bg-muted",
      permissions: ["פרסום תגובות בסיסיות"]
    },
    2: {
      icon: Star,
      label: "חבר",
      color: "text-blue-600",
      bg: "bg-blue-100",
      permissions: ["פרסום תגובות", "השתתפות בדיונים"]
    },
    3: {
      icon: StarIcon,
      label: "מהימן",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      permissions: ["מודרציה של תוכן", "אימות KYC רמה 2", "פרסום תגובות בחדשות"]
    },
    4: {
      icon: Gem,
      label: "מומחה",
      color: "text-purple-600",
      bg: "bg-purple-100",
      permissions: ["מודרציה מתקדמת", "הצבעה על תוכן", "ניהול קהילה"]
    },
    5: {
      icon: Crown,
      label: "מנהיג",
      color: "text-amber-600",
      bg: "bg-amber-100",
      permissions: ["כפתור הצבעה", "ניהול רשת האמון", "גישה למערכות מתקדמות"]
    }
  };

  const config = levelConfig[level as keyof typeof levelConfig];
  const IconComponent = config.icon;

  return (
    <Badge 
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold border-0",
        config.bg,
        config.color,
        className
      )}
      title={`רמת אמון ${level}: ${config.label} (${trustCount} נקודות אמון)`}
    >
      <IconComponent className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

export default TrustBadge;