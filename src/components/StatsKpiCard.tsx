import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsKpiCardProps {
  title: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const StatsKpiCard: React.FC<StatsKpiCardProps> = ({
  title,
  value,
  delta,
  deltaLabel,
  subtitle,
  icon,
  onClick
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString('he-IL');
    }
    return val;
  };

  const getDeltaColor = (delta: number) => {
    if (delta > 0) return "text-trust";
    if (delta < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  const getDeltaIcon = (delta: number) => {
    if (delta > 0) return <TrendingUp className="h-3 w-3" />;
    if (delta < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  return (
    <Card 
      className={`hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          {icon && (
            <div className="text-primary">{icon}</div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="text-2xl font-bold tabular-nums">
            {formatValue(value)}
          </div>
          
          {subtitle && (
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          )}
          
          {delta !== undefined && (
            <Badge 
              variant="outline" 
              className={`text-xs ${getDeltaColor(delta)} border-current`}
            >
              <div className="flex items-center gap-1">
                {getDeltaIcon(delta)}
                <span>
                  {deltaLabel || 'שינוי'}: {Math.abs(delta).toFixed(1)}%
                </span>
              </div>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};