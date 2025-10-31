import { useState } from "react";
import { ExpertStoriesCircle } from "@/components/ExpertStoriesCircle";
import { ExpertFullScreen } from "@/components/ExpertFullScreen";
import type { Expert } from "@/types/expert";

interface ExpertStoriesSectionProps {
  experts: Expert[];
}

export const ExpertStoriesSection = ({ experts }: ExpertStoriesSectionProps) => {
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {experts.map((expert) => (
          <ExpertStoriesCircle
            key={expert.id}
            expert={expert}
            onClick={() => setSelectedExpert(expert)}
          />
        ))}
      </div>

      {selectedExpert && (
        <ExpertFullScreen
          expert={selectedExpert}
          experts={experts}
          onClose={() => setSelectedExpert(null)}
          onExpertChange={setSelectedExpert}
        />
      )}
    </>
  );
};