import { Plus } from "lucide-react";
import { ProfileCard, Profile } from "./ProfileCard";
import { cn } from "@/lib/utils";

interface PositionCarouselProps {
  title: string;
  description?: string;
  profiles: Profile[];
  type: 'candidate' | 'expert';
  onVideoClick: (profile: Profile) => void;
  onVote?: (profileId: string) => void;
  onTrust?: (profileId: string) => void;
  onAddCandidate?: () => void;
  onProfileClick?: (profileId: string) => void;
  onDismiss?: (profileId: string) => void;
}

export const PositionCarousel = ({ 
  title, 
  description, 
  profiles, 
  type,
  onVideoClick, 
  onVote, 
  onTrust,
  onAddCandidate,
  onProfileClick,
  onDismiss 
}: PositionCarouselProps) => {
  
  return (
    <div className="bg-background border-t border-l border-b border-border rounded-l-xl p-4 shadow-sm mb-4">
      {/* Section Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 text-right">
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          
          {/* Add Candidate Button */}
          {type === 'candidate' && onAddCandidate && (
            <button
              onClick={onAddCandidate}
              className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors mr-4"
              title="הוסף מועמדות"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{profiles.length} {type === 'candidate' ? 'מועמדים' : 'מומחים'}</span>
          {type === 'candidate' && (
            <span className="text-xs bg-muted px-2 py-1 rounded-full">
              ניתן להצביע למועמד אחד בלבד
            </span>
          )}
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div className="overflow-x-auto -mr-4">
        <div className="flex gap-4 pr-4 pb-2">
          {profiles.length === 0 ? (
            <div className="flex-shrink-0 w-48 h-64 bg-muted/30 border-2 border-dashed border-muted-foreground/30 rounded-xl flex flex-col items-center justify-center text-center p-4">
              <div className="text-4xl mb-2">
                {type === 'candidate' ? '🗳️' : '👨‍🎓'}
              </div>
              <p className="text-sm text-muted-foreground">
                {type === 'candidate' ? 'אין מועמדים כרגע' : 'אין מומחים כרגע'}
              </p>
              {type === 'candidate' && onAddCandidate && (
                <button
                  onClick={onAddCandidate}
                  className="mt-2 text-xs text-primary hover:text-primary/80 underline"
                >
                  הוסף מועמדות
                </button>
              )}
            </div>
          ) : (
            profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onVideoClick={onVideoClick}
                onVote={type === 'candidate' ? onVote : undefined}
                onTrust={type === 'expert' ? onTrust : undefined}
                onProfileClick={onProfileClick}
                onDismiss={onDismiss}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};