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
import { useUserStats } from "@/hooks/useUserStats";

// Mock data as specified - default empty data structure
const getEmptyStatsData = () => ({
  kpis: {
    newTrust: { value: 0, deltaPct: 0 },
    trustRemovals: { value: 0, churnPct: 0 },
    profileViews: 0,
    convPct: { value: 0, appAvg: 2.1 },
    velocityPerDay: 0,
    variance: "נמוכה",
    netTrust: 0
  },
  dailyTrust: [],
  heatmap: [],
  trustRank: {
    score: 0,
    trendDay: "neutral" as const,
    trendWeek: "neutral" as const,
    weights: {
      strongUserWeightPct: 0,
      avgTrustPower: 0,
      lastBoost: 0,
      gen: [0, 0, 0],
      removalsImpact: 0
    },
    qualityVsQuantity: {
      strongEqualsRegular: 0,
      kRegular: 0
    },
    supporters: [],
    ai: {
      percentileWeekTop: 0,
      forecastTarget7d: 0,
      top50Needed: 0,
      growthFasterThanPct: 0
    }
  }
});

const MyStatsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [earnedZooz] = useState(287); // Mock earned zooz from invites
  const { stats, trustRank, loading: isLoading } = useUserStats();

  console.log('MyStatsPage render:', { isLoading, stats });
  const statsData = stats ? {
    kpis: {
      newTrust: { value: stats.trust_received || 0, deltaPct: 0 },
      trustRemovals: { value: 0, churnPct: 0 },
      profileViews: stats.profile_views || 0,
      convPct: { value: 0, appAvg: 2.1 },
      velocityPerDay: 0,
      variance: "נמוכה",
      netTrust: stats.trust_received || 0
    },
    dailyTrust: [],
    heatmap: []
  } : getEmptyStatsData();

  useEffect(() => {
    document.dir = "rtl";
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

  const badges = stats?.trust_received > 0 ? ["משתמש פעיל"] : ["משתמש חדש"];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background" dir="rtl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/profile")}
              className="h-10 w-10"
              aria-label="חזור"
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
                  title="אמון שהתקבל"
                  value={stats?.trust_received || 0}
                  delta={18.4}
                  icon={<TrendingUp className="h-4 w-4" />}
                />
                <StatsKpiCard
                  title="אמון שניתן"
                  value={stats?.trust_given || 0}
                  delta={-12.1}
                  deltaLabel="שיעור נטישה"
                  icon={<TrendingDown className="h-4 w-4" />}
                />
                <StatsKpiCard
                  title="צפיות בפרופיל"
                  value={stats?.profile_views || 0}
                  icon={<Eye className="h-4 w-4" />}
                />
                <StatsKpiCard
                  title="פוסטים"
                  value={stats?.posts_count || 0}
                  icon={<MousePointer className="h-4 w-4" />}
                />
                <StatsKpiCard
                  title="תגובות"
                  value={stats?.comments_count || 0}
                  icon={<Clock className="h-4 w-4" />}
                />
                <StatsKpiCard
                  title="ציון אמון"
                  value={stats?.trust_score || 0}
                  delta={15.3}
                  icon={<Target className="h-4 w-4" />}
                />
              </div>

              {/* Charts Section */}
              <div className="space-y-6">
                <StatsMiniChart
                  title="אמון יומי - 30 ימים"
                  data={statsData.dailyTrust}
                  type="line"
                />
                
                <StatsMiniChart
                  title="מפת חום - שעות פעילות"
                  data={statsData.heatmap}
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
                    את/ה בטופ <strong>{trustRank?.ai?.percentileWeekTop || 0}%</strong> בשבוע האחרון
                  </p>
                  <p className="text-sm text-right">
                    אם תשמור/י על הקצב → תחזית: <strong>{trustRank?.ai?.forecastTarget7d || 0}</strong> בעוד 7 ימים
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
              {trustRank ? (
                <TrustRankScore
                  score={trustRank.score}
                  trendDay={trustRank.trendDay}
                  trendWeek={trustRank.trendWeek}
                />
              ) : (
                <Card className="text-center p-8">
                  <CardContent>
                    <div className="text-6xl font-bold text-muted-foreground mb-2">0</div>
                    <p className="text-muted-foreground">עדיין אין דירוג אמון</p>
                    <p className="text-sm text-muted-foreground mt-2">קבל אמון ממשתמשים אחרים כדי לבנות את הדירוג שלך</p>
                  </CardContent>
                </Card>
              )}

              {/* Weights & Transparency */}
              {trustRank && <TrustWeightsAccordion weights={trustRank.weights} />}

              {/* Quality vs Quantity */}
              {trustRank ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">איכות נגד כמות</CardTitle>
                  </CardHeader>
                  <CardContent className="text-right">
                    <div className="flex items-center justify-center p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {trustRank.qualityVsQuantity?.strongEqualsRegular || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">אמונות חזקות</div>
                      </div>
                      <div className="mx-6 text-2xl text-muted-foreground">≈</div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-muted-foreground mb-2">
                          {trustRank.qualityVsQuantity?.kRegular || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">רגילות</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {/* Trust Network */}
              {trustRank && trustRank.supporters && trustRank.supporters.length > 0 ? (
                <Card>
                  <CardHeader className="text-right">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      נתמך ע״י {trustRank.supporters.length} מובילי־קהילה
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-right">
                    <div className="grid grid-cols-1 gap-3">
                      {trustRank.supporters.map((supporter) => (
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
              ) : (
                <Card>
                  <CardHeader className="text-right">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      רשת האמון שלך
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">עדיין אין לך תומכים</p>
                    <p className="text-sm text-muted-foreground mt-2">צור תוכן איכותי ובנה מוניטין כדי לקבל תמיכה ממובילי קהילה</p>
                  </CardContent>
                </Card>
              )}

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
              {trustRank && trustRank.ai ? (
                <Card className="bg-gradient-to-l from-trust/5 to-trust/10 border-trust/20">
                  <CardHeader className="text-right">
                    <CardTitle className="flex items-center gap-2 justify-end text-right" dir="rtl">
                      <Award className="h-5 w-5 text-trust" />
                      תחזיות AI
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-right">
                    <p className="text-sm text-right">
                      אם תשיג עוד <strong>{trustRank.ai.top50Needed || 0}</strong> אמונות מה־Top 10% → 
                      תגיע לטופ 50 הארצי
                    </p>
                    <p className="text-sm text-right">
                      קצב הצמיחה שלך מהיר ב־<strong>{trustRank.ai.growthFasterThanPct || 0}%</strong> מהממוצע
                    </p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default MyStatsPage;