import React from "react";
import { Info, Users, Zap, TrendingUp, TrendingDown, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WeightsData {
  strongUserWeightPct: number;
  avgTrustPower: number;
  lastBoost: number;
  gen: number[];
  removalsImpact: number;
}

interface TrustWeightsAccordionProps {
  weights: WeightsData;
}

export const TrustWeightsAccordion: React.FC<TrustWeightsAccordionProps> = ({ weights }) => {
  const weightItems = [
    {
      icon: <Users className="h-4 w-4" />,
      title: "משקל אמון ממשתמשים חזקים",
      value: `${weights.strongUserWeightPct}%`,
      description: "אחוז האמון שמגיע ממשתמשים עם דירוג TrustRank גבוה",
      color: "text-primary"
    },
    {
      icon: <Zap className="h-4 w-4" />,
      title: "כוח אמון ממוצע של נותני האמון",
      value: `${weights.avgTrustPower}`,
      description: "הציון הממוצע של המשתמשים שנתנו לך אמון",
      color: "text-trust"
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: "בוסט אחרון מאמון חזק",
      value: `+${weights.lastBoost}`,
      description: "התוספת האחרונה לציון מאמון של משתמש בדירוג גבוה",
      color: "text-trust"
    },
    {
      icon: <Target className="h-4 w-4" />,
      title: "תרמוית דורות",
      value: `${weights.gen[0]}% / ${weights.gen[1]}% / ${weights.gen[2]}%`,
      description: "התפלגות האמון לפי דורי הרשת (דור 1, 2, 3)",
      color: "text-secondary-foreground"
    },
    {
      icon: <TrendingDown className="h-4 w-4" />,
      title: "השפעת הסרות",
      value: `-${weights.removalsImpact}`,
      description: "הפגיעה בציון מהסרות אמון במהלך החודש האחרון",
      color: "text-destructive"
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          שקיפות משקלי הציון
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weightItems.map((item, index) => (
            <Collapsible key={index}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                  <div className="flex items-center gap-3">
                    <div className={item.color}>{item.icon}</div>
                    <div className="text-right">
                      <div className="font-medium">{item.title}</div>
                      <Badge variant="outline" className="mt-1">
                        {item.value}
                      </Badge>
                    </div>
                  </div>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Special visualization for generation distribution */}
                  {index === 3 && (
                    <div className="mt-3 space-y-2">
                      {weights.gen.map((percentage, genIndex) => (
                        <div key={genIndex} className="flex items-center gap-3">
                          <div className="w-16 text-sm">דור {genIndex + 1}</div>
                          <Progress value={percentage} className="flex-1" />
                          <div className="w-12 text-sm text-muted-foreground">{percentage}%</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Special visualization for strong users weight */}
                  {index === 0 && (
                    <div className="mt-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>משתמשים חזקים</span>
                                <span>{weights.strongUserWeightPct}%</span>
                              </div>
                              <Progress value={weights.strongUserWeightPct} className="h-2" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>משתמשים עם TrustRank מעל 500</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};