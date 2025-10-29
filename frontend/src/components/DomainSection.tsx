import { MixedExpertCarousel } from "@/components/MixedExpertCarousel";
import { TrendingUp, Shield, GraduationCap, Heart, Smartphone, Palette } from "lucide-react";
import type { Expert, ExpertDomain } from "@/pages/TopTrustedPage";

const domainConfig = {
  economy: { name: 'כלכלה', icon: TrendingUp, color: 'text-trust' },
  security: { name: 'ביטחון', icon: Shield, color: 'text-primary' },
  education: { name: 'חינוך', icon: GraduationCap, color: 'text-primary' },
  health: { name: 'רפואה', icon: Heart, color: 'text-destructive' },
  tech: { name: 'טכנולוגיה', icon: Smartphone, color: 'text-primary' },
  culture: { name: 'תרבות', icon: Palette, color: 'text-trust' }
};

interface DomainSectionProps {
  domain: ExpertDomain;
  experts: Expert[];
}

export const DomainSection = ({ domain, experts }: DomainSectionProps) => {
  const config = domainConfig[domain];
  const IconComponent = config.icon;
  
  // Get experts for this domain
  const domainExperts = experts.filter(expert => 
    expert.expertise.includes(domain)
  );
  
  const trustedCount = domainExperts.filter(expert => expert.trustedByUser).length;
  const totalCount = domainExperts.length;

  if (totalCount === 0) return null;

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4 px-4">
        <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-foreground">{config.name}</h2>
          <p className="text-xs text-muted-foreground">
            {trustedCount > 0 ? `${trustedCount} אמונים` : 'גלה מומחים'} • {totalCount} סה"כ
          </p>
        </div>
      </div>

      {/* Expert Carousel */}
      <div className="px-4">
        <MixedExpertCarousel experts={experts} domain={domain} />
      </div>
    </div>
  );
};