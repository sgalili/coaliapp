import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Handshake, Eye, X, User, Flame } from "lucide-react";
import { TrustActionButton } from "@/components/TrustActionButton";
import type { Expert } from "@/types/expert";

interface ExpertDiscoveryStackProps {
  experts: Expert[];
}

export const ExpertDiscoveryStack = ({ experts }: ExpertDiscoveryStackProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < experts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePass = () => {
    handleNext();
  };

  if (currentIndex >= experts.length || experts.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="text-center py-8 max-w-sm">
          <CardContent>
            <Crown className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">סיימת לעבור על כולם!</h3>
            <p className="text-muted-foreground text-sm">
              בדוק שוב מאוחר יותר להמלצות חדשות
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentExpert = experts[currentIndex];
  const remainingCount = experts.length - currentIndex - 1;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 relative">
      {/* Progress indicator */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>מומלצים עבורך</span>
          <span>{remainingCount} נותרו</span>
        </div>
        <div className="w-full bg-muted h-1 rounded-full mt-2">
          <div 
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / experts.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Expert Card Stack */}
      <div className="relative w-full max-w-sm">
        {/* Background cards for depth effect */}
        {experts.slice(currentIndex + 1, currentIndex + 3).map((expert, index) => (
          <Card 
            key={expert.id}
            className={`absolute inset-0 bg-card border transition-all duration-300`}
            style={{
              transform: `translateY(${(index + 1) * 4}px) scale(${1 - (index + 1) * 0.02})`,
              zIndex: 10 - index,
              opacity: 0.5 - index * 0.2
            }}
          >
            <div className="h-96" />
          </Card>
        ))}

        {/* Main card */}
        <Card className="relative z-20 bg-card border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="relative mb-4">
                <img
                  src={currentExpert.avatar}
                  alt={currentExpert.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-trust"
                />
                {currentExpert.trending && (
                  <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                    <Flame className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                {currentExpert.verified && (
                  <div className="absolute -bottom-1 -right-1">
                    <Badge variant="secondary" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                      <Crown className="w-3 h-3" />
                    </Badge>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">{currentExpert.name}</h3>
              
              <div className="flex flex-wrap gap-1 justify-center mb-4">
                {currentExpert.expertise.map((domain) => (
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
                  <p className="text-lg font-bold text-foreground">{currentExpert.stats.trustCount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">אמון</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-trust">{currentExpert.stats.trustRate}%</p>
                  <p className="text-xs text-muted-foreground">שיעור אמון</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{currentExpert.stats.views.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">צפיות</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mb-4">
                <TrustActionButton expert={currentExpert} />
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  צפה
                </Button>
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </div>

              {/* Swipe actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handlePass}
                >
                  <X className="w-4 h-4 mr-1" />
                  דלג
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Swipe hint */}
      <p className="text-xs text-muted-foreground mt-4 text-center">
        החלק ימינה לתת אמון • החלק שמאלה לדלג
      </p>
    </div>
  );
};