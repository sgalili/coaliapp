import { Heart, Calendar } from "lucide-react";
import { TrustedUserCard } from "@/components/TrustedUserCard";
import { TrustStatusIndicator } from "@/components/TrustStatusIndicator";
import { Badge } from "@/components/ui/badge";
import { getDomainConfig, getDomainBadgeClasses, type ExpertDomain } from "@/lib/domainConfig";

interface TrustedUser {
  id: string;
  username: string;
  profileImage: string;
  kycLevel: number;
  trustersCount: number;
  domain: ExpertDomain;
  trustDate: string;
  bio: string;
}

interface ProfileTrustedTabProps {
  trustedUsers: TrustedUser[];
  className?: string;
}

export const ProfileTrustedTab = ({ trustedUsers, className = "" }: ProfileTrustedTabProps) => {
  // Tri par dernier trust donné (plus récent en premier)
  const sortedTrustedUsers = [...trustedUsers].sort((a, b) => 
    new Date(b.trustDate).getTime() - new Date(a.trustDate).getTime()
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-sm text-muted-foreground text-center mb-4">
        {trustedUsers.length} אנשים שאני נותן להם אמון
      </div>

      {sortedTrustedUsers.map((user) => {
        const domainConfig = getDomainConfig(user.domain);
        const badgeClasses = getDomainBadgeClasses(user.domain);
        
        return (
          <div key={user.id} className="bg-card rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="relative">
                <img 
                  src={user.profileImage} 
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <TrustStatusIndicator kycLevel={user.kycLevel} />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-right">{user.username}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Heart className="w-3 h-3 text-trust" />
                      <span>{user.trustersCount} נותני אמון</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <Badge className={badgeClasses}>
                      {domainConfig.icon && <domainConfig.icon className="w-3 h-3 ml-1" />}
                      {domainConfig.hebrewName}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground text-right line-clamp-2">
                  {user.bio}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{user.trustDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {trustedUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">עדיין לא נתת אמון לאנשים</p>
        </div>
      )}
    </div>
  );
};