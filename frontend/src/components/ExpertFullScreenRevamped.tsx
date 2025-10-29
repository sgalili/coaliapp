import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Crown, Handshake, Eye, User, Play, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { TrustActionButton } from "@/components/TrustActionButton";
import { SwipeableCard } from "@/components/SwipeableCard";
import type { Expert } from "@/pages/TopTrustedPage";

interface ExpertFullScreenRevampedProps {
  expert: Expert;
  experts: Expert[];
  onClose: () => void;
  onExpertChange: (expert: Expert) => void;
}

export const ExpertFullScreenRevamped = ({ 
  expert, 
  experts, 
  onClose, 
  onExpertChange 
}: ExpertFullScreenRevampedProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const index = experts.findIndex(e => e.id === expert.id);
    setCurrentIndex(index);
  }, [expert, experts]);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % experts.length;
    onExpertChange(experts[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex = currentIndex === 0 ? experts.length - 1 : currentIndex - 1;
    onExpertChange(experts[prevIndex]);
  };

  const handleSwipeLeft = () => handleNext();
  const handleSwipeRight = () => handlePrev();

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-background via-primary/5 to-muted">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-background/90 to-transparent p-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="text-foreground hover:bg-primary/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2 text-foreground">
            <span className="text-sm font-medium bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full">
              {currentIndex + 1} / {experts.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Swipeable */}
      <SwipeableCard
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        className="h-full flex items-center justify-center"
      >
        <div className="max-w-sm w-full mx-4">
          {/* Expert Card */}
          <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-border/50">
            {/* Profile Section */}
            <div className="text-center mb-6">
              <div className="relative mb-4 inline-block">
                <div className="relative">
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/20 shadow-lg"
                  />
                  {expert.verified && (
                    <div className="absolute -top-2 -right-2 bg-primary rounded-full p-2 shadow-lg">
                      <Crown className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                  {expert.trustedByUser && (
                    <div className="absolute -bottom-2 -left-2 bg-trust rounded-full p-2 animate-gentle-pulse shadow-lg">
                      <Handshake className="w-5 h-5 text-trust-foreground" />
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">{expert.name}</h3>
              
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {expert.expertise.map((domain) => (
                  <Badge key={domain} variant="secondary" className="text-sm rounded-full">
                    {domain === 'economy' && 'כלכלה'}
                    {domain === 'tech' && 'טכנולוגיה'}
                    {domain === 'education' && 'חינוך'}
                    {domain === 'health' && 'רפואה'}
                    {domain === 'security' && 'ביטחון'}
                    {domain === 'culture' && 'תרבות'}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <p className="text-lg font-bold text-trust">{expert.stats.trustCount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">אמון</p>
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-xl">
                <p className="text-lg font-bold text-primary">{expert.stats.trustRate}%</p>
                <p className="text-xs text-muted-foreground">שיעור אמון</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <p className="text-lg font-bold text-foreground">{expert.stats.views.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">צפיות</p>
              </div>
            </div>

            {/* Video Section */}
            <div className="mb-6">
              <div className="relative bg-gradient-to-br from-primary/10 to-trust/10 rounded-xl p-6 text-center">
                <Play className="w-12 h-12 mx-auto mb-3 text-primary" />
                <p className="text-sm text-muted-foreground mb-3">צפה בסרטון האחרון</p>
                <Button 
                  variant="default" 
                  className="w-full rounded-full"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  הפעל סרטון
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <TrustActionButton expert={expert} />
              <Button variant="outline" size="sm" className="flex-1 rounded-full">
                <Eye className="w-4 h-4 mr-2" />
                פרופיל
              </Button>
            </div>
          </div>

          {/* Navigation Hints */}
          <div className="flex justify-between items-center mt-6 px-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ArrowRight className="w-4 h-4" />
              <span className="text-xs">החלק לקודם</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs text-primary font-medium">החלק לניווט</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xs">החלק להבא</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </div>
        </div>
      </SwipeableCard>
    </div>
  );
};