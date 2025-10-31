import { useState } from "react";
import { EnhancedExpertCircle } from "@/components/EnhancedExpertCircle";
import { ExpertFullScreenRevamped } from "@/components/ExpertFullScreenRevamped";
import type { Expert, ExpertDomain } from "@/types/expert";

interface MixedExpertCarouselProps {
  experts: Expert[];
  domain: ExpertDomain;
}

export const MixedExpertCarousel = ({ experts, domain }: MixedExpertCarouselProps) => {
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  // Filter experts for this domain
  const domainExperts = experts.filter(expert => 
    expert.expertise.includes(domain)
  );

  // Sort by trusted first, then by trust rate
  const sortedExperts = domainExperts.sort((a, b) => {
    if (a.trustedByUser && !b.trustedByUser) return -1;
    if (!a.trustedByUser && b.trustedByUser) return 1;
    return b.stats.trustRate - a.stats.trustRate;
  });

  // Take maximum 8 experts
  const displayedExperts = sortedExperts.slice(0, 8);

  if (displayedExperts.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <p className="text-sm">אין מומחים בתחום זה כרגע</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {displayedExperts.map((expert) => (
          <EnhancedExpertCircle
            key={expert.id}
            expert={expert}
            onClick={() => setSelectedExpert(expert)}
            isTopCommunity={!expert.trustedByUser}
          />
        ))}
      </div>

      {selectedExpert && (
        <ExpertFullScreenRevamped
          expert={selectedExpert}
          experts={displayedExperts}
          onClose={() => setSelectedExpert(null)}
          onExpertChange={setSelectedExpert}
        />
      )}
    </>
  );
};