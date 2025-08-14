import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Crown, Handshake, Eye, User, ChevronLeft, ChevronRight } from "lucide-react";
import { TrustActionButton } from "@/components/TrustActionButton";
import type { Expert } from "@/pages/TopTrustedPage";

interface ExpertFullScreenProps {
  expert: Expert;
  experts: Expert[];
  onClose: () => void;
  onExpertChange: (expert: Expert) => void;
}

export const ExpertFullScreen = ({ expert, experts, onClose, onExpertChange }: ExpertFullScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      handleNext();
    } else {
      handlePrev();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm font-medium">{currentIndex + 1} / {experts.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Content */}
      <div 
        className="h-full flex items-center justify-center bg-gradient-to-br from-muted via-background to-accent"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${expert.avatar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-sm w-full mx-4 bg-card/95 backdrop-blur-sm rounded-lg p-6 text-center">
          <div className="relative mb-4">
            <img
              src={expert.avatar}
              alt={expert.name}
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-trust"
            />
            {expert.verified && (
              <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                <Crown className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">{expert.name}</h3>
          
          <div className="flex flex-wrap gap-1 justify-center mb-4">
            {expert.expertise.map((domain) => (
              <Badge key={domain} variant="outline" className="text-xs">
                {domain === 'economy' && 'כלכלה'}
                {domain === 'tech' && 'טכנולוגיה'}
                {domain === 'education' && 'חינוך'}
                {domain === 'health' && 'רפואה'}
                {domain === 'security' && 'ביטחון'}
                {domain === 'culture' && 'תרבות'}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div>
              <p className="text-lg font-bold text-foreground">{expert.stats.trustCount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">אמון</p>
            </div>
            <div>
              <p className="text-lg font-bold text-trust">{expert.stats.trustRate}%</p>
              <p className="text-xs text-muted-foreground">שיעור אמון</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{expert.stats.views.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">צפיות</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <TrustActionButton expert={expert} />
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              צפה
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};