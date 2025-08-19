import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Zap, Info, Users, Target, Award, Eye, MousePointer, Clock, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsKpiCard } from "@/components/StatsKpiCard";
import { StatsMiniChart } from "@/components/StatsMiniChart";
import { TrustRankScore } from "@/components/TrustRankScore";
import { TrustWeightsAccordion } from "@/components/TrustWeightsAccordion";

// Mock data as specified
const mockStatsData = {
  kpis: {
    newTrust: { value: 124, deltaPct: 18.4 },
    trustRemovals: { value: 17, churnPct: 12.1 },
    profileViews: 4821,
    convPct: { value: 3.6, appAvg: 2.1 },
    velocityPerDay: 4.1,
    variance: "בינונית",
    netTrust: 107
  },
  dailyTrust: [
    { date: "2025-07-22", value: 3 },
    { date: "2025-07-23", value: 5 },
    { date: "2025-07-24", value: 2 },
    { date: "2025-07-25", value: 7 },
    { date: "2025-07-26", value: 4 },
    { date: "2025-07-27", value: 6 },
    { date: "2025-07-28", value: 3 }
  ],
  heatmap: [
    { day: "א", hour: 9, value: 1 },
    { day: "ב", hour: 14, value: 3 },
    { day: "ג", hour: 21, value: 6 },
    { day: "ד", hour: 11, value: 2 },
    { day: "ה", hour: 19, value: 5 },
    { day: "ו", hour: 16, value: 4 },
    { day: "ש", hour: 10, value: 2 }
  ],
  trustRank: {
    score: 734,
    trendDay: "up" as const,
    trendWeek: "down" as const,
    weights: {
      strongUserWeightPct: 62,
      avgTrustPower: 1.8,
      lastBoost: 24,
      gen: [55, 30, 15],
      removalsImpact: 12
    },
    qualityVsQuantity: {
      strongEqualsRegular: 1,
      kRegular: 12
    },
    supporters: [
      { name: "@LeaderOne", powerW: 5.2 },
      { name: "@CivicPro", powerW: 3.9 },
      { name: "@TechGuru", powerW: 4.1 },
      { name: "@CommunityChamp", powerW: 2.8 }
    ],
    ai: {
      percentileWeekTop: 22,
      forecastTarget7d: 780,
      top50Needed: 3,
      growthFasterThanPct: 64
    }
  }
};

const MyStatsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [earnedZooz] = useState(287); // Mock earned zooz from invites

  useEffect(() => {
    document.dir = "rtl";
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center gap-4 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          <Skeleton className="h-8 w-48" />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  const badges = ["אמון יציב", "משפיע צומח", "מוביל המרות"];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background" dir="rtl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">הסטטיסטיקות שלי</h1>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-[73px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
              <TabsTrigger value="general">נתונים כלליים</TabsTrigger>
              <TabsTrigger value="trustrank">דירוג־אמון</TabsTrigger>
            </TabsList>
          </div>

          {/* General Data Tab */}
          <TabsContent value="general" className="p-4 space-y-6" dir="rtl">
            <div className="text-right">
              <h2 className="text-2xl font-bold mb-6 text-right">הביצועים שלך ב־30 הימים האחרונים</h2>
              
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <StatsKpiCard
                  title="אמון חדש"
                  value={mockStatsData.kpis.newTrust.value}
                  delta={mockStatsData.kpis.newTrust.deltaPct}
                  icon={<TrendingUp className="h-4 w-4" />}
                />
                <StatsKpiCard
                  title="הסרת אמון"
                  value={mockStatsData.kpis.trustRemovals.value}
                  delta={-mockStatsData.kpis.trustRemovals.churnPct}
                  deltaLabel="שיעור נטישה"
                  icon={<TrendingDown className="h-4 w-4" />}
                />
                <StatsKpiCard
                  title="צפיות בפרופיל"
                  value={mockStatsData.kpis.profileViews}
                  icon={<Eye className="h-4 w-4" />}
                />
                <StatsKpiCard
                  title="המרה לאמון"
                  value={`${mockStatsData.kpis.convPct.value}%`}
                  subtitle={`ממוצע: ${mockStatsData.kpis.convPct.appAvg}%`}
                  icon={<MousePointer className="h-4 w-4" />}
                />
                <StatsKpiCard
                  title="מהירות אמון"
                  value={`${mockStatsData.kpis.velocityPerDay}/יום`}
                  icon={<Clock className="h-4 w-4" />}
                />
                <StatsKpiCard
                  title="נטו אמון"
                  value={mockStatsData.kpis.netTrust}
                  delta={15.3}
                  icon={<Target className="h-4 w-4" />}
                />
              </div>

              {/* Charts Section */}
              <div className="space-y-6">
                <StatsMiniChart
                  title="אמון יומי - 30 ימים"
                  data={mockStatsData.dailyTrust}
                  type="line"
                />
                
                <StatsMiniChart
                  title="מפת חום - שעות פעילות"
                  data={mockStatsData.heatmap}
                  type="heatmap"
                />
              </div>

              {/* AI Insights */}
              <Card className="bg-gradient-to-l from-primary/5 to-primary/10 border-primary/20">
                <CardHeader className="text-right">
                  <CardTitle className="flex items-center gap-2 justify-end">
                    <Zap className="h-5 w-5 text-primary" />
                    תובנות AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-right">
                  <p className="text-sm text-right">
                    את/ה בטופ <strong>{mockStatsData.trustRank.ai.percentileWeekTop}%</strong> בשבוע האחרון
                  </p>
                  <p className="text-sm">
                    אם תשמור/י על הקצב → תחזית: <strong>{mockStatsData.trustRank.ai.forecastTarget7d}</strong> בעוד 7 ימים
                  </p>
                </CardContent>
              </Card>

              {/* Dynamic Badges */}
              <div className="flex flex-wrap gap-2 justify-end">
                {badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="text-sm">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TrustRank Tab */}
          <TabsContent value="trustrank" className="p-4 space-y-6" dir="rtl">
            <div className="text-right">
              <h2 className="text-2xl font-bold mb-6 text-right">דירוג־האמון שלך</h2>
              
              {/* Big Score */}
              <TrustRankScore
                score={mockStatsData.trustRank.score}
                trendDay={mockStatsData.trustRank.trendDay}
                trendWeek={mockStatsData.trustRank.trendWeek}
              />

              {/* Weights & Transparency */}
              <TrustWeightsAccordion weights={mockStatsData.trustRank.weights} />

              {/* Quality vs Quantity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">איכות נגד כמות</CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                  <div className="flex items-center justify-center p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">5</div>
                      <div className="text-sm text-muted-foreground">אמונות חזקות</div>
                    </div>
                    <div className="mx-6 text-2xl text-muted-foreground">≈</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-muted-foreground mb-2">
                        {mockStatsData.trustRank.qualityVsQuantity.kRegular}
                      </div>
                      <div className="text-sm text-muted-foreground">רגילות</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Network */}
              <Card>
                <CardHeader className="text-right">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    נתמך ע״י {mockStatsData.trustRank.supporters.length} מובילי־קהילה
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                  <div className="grid grid-cols-1 gap-3">
                    {mockStatsData.trustRank.supporters.map((supporter) => (
                      <div key={supporter.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="font-medium">{supporter.name}</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline">
                              שווי אמון = {supporter.powerW} רגילות
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>משקל האמון של {supporter.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Explainer */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between text-right">
                    <span>איך הציון מחושב?</span>
                    <Info className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2">
                    <CardContent className="pt-6 text-right">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        הציון מחושב בדומה ל־PageRank של גוגל, כאשר איכות נותני האמון חשובה יותר מכמות. 
                        הציון מתעדכן יומית לפי איכות, כמות ויציבות האמון שקיבלת. 
                        אמון ממשתמשים עם דירוג גבוה שווה יותר מאמון ממשתמשים חדשים.
                      </p>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* AI Forecasts */}
              <Card className="bg-gradient-to-l from-trust/5 to-trust/10 border-trust/20">
                <CardHeader className="text-right">
                  <CardTitle className="flex items-center gap-2 justify-end">
                    <Award className="h-5 w-5 text-trust" />
                    תחזיות AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-right">
                    אם תשיג עוד <strong>{mockStatsData.trustRank.ai.top50Needed}</strong> אמונות מה־Top 10% → 
                    תגיע לטופ 50 הארצי
                  </p>
                  <p className="text-sm text-right">
                    קצב הצמיחה שלך מהיר ב־<strong>{mockStatsData.trustRank.ai.growthFasterThanPct}%</strong> מהממוצע
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default MyStatsPage;