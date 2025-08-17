import { Heart, Calendar } from "lucide-react";
import { TrustedUserCard } from "@/components/TrustedUserCard";
import { TrustStatusIndicator } from "@/components/TrustStatusIndicator";
import { Badge } from "@/components/ui/badge";
import { getDomainConfig, getDomainBadgeClasses, type ExpertDomain } from "@/lib/domainConfig";

interface Truster {
  id: string;
  username: string;
  profileImage: string;
  kycLevel: number;
  trustersCount: number;
  domain: ExpertDomain;
  trustDate: string;
  bio: string;
}

interface ProfileTrustersTabProps {
  trusters: Truster[];
  className?: string;
}

export const ProfileTrustersTab = ({ trusters, className = "" }: ProfileTrustersTabProps) => {
  // Tri par dernier trust donné (plus récent en premier)
  const sortedTrusters = [...trusters].sort((a, b) => 
    new Date(b.trustDate).getTime() - new Date(a.trustDate).getTime()
  );

  return (
    <div className={`space-y-4 ${className}`} dir="rtl">
      <div className="text-sm text-muted-foreground text-center mb-4">
        {trusters.length} אנשים נותנים לי אמון
      </div>

      {sortedTrusters.map((truster) => {
        const domainConfig = getDomainConfig(truster.domain);
        const badgeClasses = getDomainBadgeClasses(truster.domain);
        
        return (
          <div key={truster.id} className="bg-card rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3 flex-row-reverse">
              <div className="text-right">
                <Badge className={badgeClasses}>
                  {domainConfig.hebrewName}
                  {domainConfig.icon && <domainConfig.icon className="w-3 h-3 mr-1" />}
                </Badge>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between flex-row-reverse">
                  <div className="relative">
                    <img 
                      src={truster.profileImage} 
                      alt={truster.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <TrustStatusIndicator kycLevel={truster.kycLevel} />
                  </div>
                  <div className="text-right">
                    <h4 className="font-medium text-right">{truster.username}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground flex-row-reverse">
                      <span>{truster.trustersCount} נותני אמון</span>
                      <Heart className="w-3 h-3 text-trust" />
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground text-right line-clamp-2">
                  {truster.bio}
                </p>
                
                <div className="flex items-center justify-end text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 flex-row-reverse">
                    <span>{truster.trustDate}</span>
                    <Calendar className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {trusters.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">עדיין לא קיבלת אמון מאנשים</p>
        </div>
      )}
    </div>
  );
};