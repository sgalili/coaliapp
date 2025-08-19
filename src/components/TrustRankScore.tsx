import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrustRankScoreProps {
  score: number;
  trendDay: "up" | "down" | "stable";
  trendWeek: "up" | "down" | "stable";
}

export const TrustRankScore: React.FC<TrustRankScoreProps> = ({
  score,
  trendDay,
  trendWeek
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-trust" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-trust border-trust/20";
      case "down":
        return "text-destructive border-destructive/20";
      default:
        return "text-muted-foreground border-muted/20";
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case "up":
        return "עולה";
      case "down":
        return "יורד";
      default:
        return "יציב";
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="text-center p-8">
        <div className="space-y-4">
          {/* Main Score */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground font-medium">
              ציון TrustRank
            </div>
            <div 
              className="text-6xl font-bold text-primary tabular-nums transition-all duration-1000 ease-out"
              style={{
                transform: `scale(${animatedScore > 0 ? 1 : 0.9})`,
                opacity: animatedScore > 0 ? 1 : 0.5
              }}
            >
              {animatedScore.toLocaleString('he-IL')}
            </div>
            <div className="text-sm text-muted-foreground">
              מתוך 1,000
            </div>
          </div>

          {/* Trend Indicators */}
          <div className="flex items-center justify-center gap-6">
            <Badge variant="outline" className={`${getTrendColor(trendDay)} flex items-center gap-1`}>
              {getTrendIcon(trendDay)}
              <span className="text-xs">היום: {getTrendText(trendDay)}</span>
            </Badge>
            
            <Badge variant="outline" className={`${getTrendColor(trendWeek)} flex items-center gap-1`}>
              {getTrendIcon(trendWeek)}
              <span className="text-xs">השבוע: {getTrendText(trendWeek)}</span>
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out"
              style={{ width: `${(animatedScore / 1000) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};