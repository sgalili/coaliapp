import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DataPoint {
  date?: string;
  value: number;
  day?: string;
  hour?: number;
}

interface StatsMiniChartProps {
  title: string;
  data: DataPoint[];
  type: "line" | "heatmap";
}

export const StatsMiniChart: React.FC<StatsMiniChartProps> = ({ title, data, type }) => {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  if (type === "line") {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    // Create SVG path for line chart
    const pathData = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((point.value - minValue) / range) * 80;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 relative">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--muted))" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
              
              {/* Area under curve */}
              <path
                d={`${pathData} L 100 100 L 0 100 Z`}
                fill="hsl(var(--primary) / 0.1)"
                className="transition-all duration-300"
              />
              
              {/* Line */}
              <path
                d={pathData}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                className="transition-all duration-300"
              />
              
              {/* Data points */}
              {data.map((point, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - ((point.value - minValue) / range) * 80;
                return (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <circle
                          cx={x}
                          cy={y}
                          r="3"
                          fill="hsl(var(--primary))"
                          className="cursor-pointer hover:r-4 transition-all duration-200"
                          onMouseEnter={() => setHoveredPoint(point)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <div className="font-medium">{point.date}</div>
                          <div className="text-sm text-muted-foreground">
                            {point.value} אמונות
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </svg>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "heatmap") {
    const maxValue = Math.max(...data.map(d => d.value));
    const days = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getIntensity = (value: number) => {
      const intensity = value / maxValue;
      return `hsl(var(--primary) / ${intensity * 0.8})`;
    };

    const getCellValue = (day: string, hour: number) => {
      const cell = data.find(d => d.day === day && d.hour === hour);
      return cell?.value || 0;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>00:00</span>
            <span>23:00</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {days.map((day) => (
              <div key={day} className="flex items-center gap-1">
                <div className="w-4 text-xs text-muted-foreground text-center">{day}</div>
                <div className="flex gap-0.5">
                  {hours.map((hour) => {
                    const value = getCellValue(day, hour);
                    return (
                      <TooltipProvider key={`${day}-${hour}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110"
                              style={{
                                backgroundColor: value > 0 ? getIntensity(value) : 'hsl(var(--muted))'
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-center">
                              <div className="font-medium">יום {day}, {hour.toString().padStart(2, '0')}:00</div>
                              <div className="text-sm text-muted-foreground">
                                {value} אמונות
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>פחות</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: `hsl(var(--primary) / ${(i + 1) * 0.2})`
                  }}
                />
              ))}
            </div>
            <span>יותר</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};