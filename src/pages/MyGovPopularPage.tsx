import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Ministry configurations matching MyGovPage
const ministries = [
  {
    id: 'defense',
    name: 'שר הביטחון',
    icon: '🛡️',
    description: 'אחראי על ביטחון המדינה והצבא'
  },
  {
    id: 'finance', 
    name: 'שר האוצר',
    icon: '💰',
    description: 'אחראי על הכלכלה והתקציב'
  },
  {
    id: 'education',
    name: 'שר החינוך', 
    icon: '📚',
    description: 'אחראי על מערכת החינוך'
  },
  {
    id: 'health',
    name: 'שר הבריאות',
    icon: '🏥', 
    description: 'אחראי על מערכת הבריאות'
  },
  {
    id: 'justice',
    name: 'שר המשפטים',
    icon: '⚖️',
    description: 'אחראי על מערכת המשפט'
  },
  {
    id: 'transport',
    name: 'שר התחבורה', 
    icon: '🚗',
    description: 'אחראי על תחבורה ותשתיות'
  },
  {
    id: 'housing',
    name: 'שר הבינוי והדיור',
    icon: '🏘️',
    description: 'אחראי על בינוי ודיור'
  },
  {
    id: 'economy',
    name: 'שר הכלכלה',
    icon: '📈', 
    description: 'אחראי על התעשייה והמסחר'
  }
];

interface PopularCandidate {
  name: string;
  avatar: string;
  voteCount: number;
  percentage: number;
}

interface PopularSelection {
  ministryId: string;
  candidate: PopularCandidate | null;
  totalVotes: number;
}

export default function MyGovPopularPage() {
  const navigate = useNavigate();
  const [popularSelections, setPopularSelections] = useState<PopularSelection[]>([]);
  const [pmSelection, setPmSelection] = useState<PopularCandidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPopularSelections();
  }, []);

  const loadPopularSelections = async () => {
    try {
      // Get all government selections
      const { data: selections, error } = await supabase
        .from('government_selections')
        .select('*');

      if (error) {
        console.error('Error loading selections:', error);
        setIsLoading(false);
        return;
      }

      if (!selections || selections.length === 0) {
        setIsLoading(false);
        return;
      }

      // Process data to find most popular candidates per ministry
      const ministryStats: { [key: string]: { [key: string]: { count: number; candidate: any } } } = {};
      let pmStats: { [key: string]: { count: number; candidate: any } } = {};

      selections.forEach((selection) => {
        const candidateData = typeof selection.candidate_data === 'string' 
          ? JSON.parse(selection.candidate_data) 
          : selection.candidate_data;

        if (selection.ministry_id === 'prime_minister') {
          const candidateName = candidateData.name;
          if (!pmStats[candidateName]) {
            pmStats[candidateName] = { count: 0, candidate: candidateData };
          }
          pmStats[candidateName].count++;
        } else {
          if (!ministryStats[selection.ministry_id]) {
            ministryStats[selection.ministry_id] = {};
          }
          
          const candidateName = candidateData.name;
          if (!ministryStats[selection.ministry_id][candidateName]) {
            ministryStats[selection.ministry_id][candidateName] = { count: 0, candidate: candidateData };
          }
          ministryStats[selection.ministry_id][candidateName].count++;
        }
      });

      // Find most popular PM
      let topPm: PopularCandidate | null = null;
      let pmTotalVotes = 0;
      
      Object.values(pmStats).forEach(stat => pmTotalVotes += stat.count);
      
      if (pmTotalVotes > 0) {
        const topPmEntry = Object.entries(pmStats).reduce((max, [name, stat]) => 
          stat.count > max[1].count ? [name, stat] : max
        );
        
        topPm = {
          name: topPmEntry[1].candidate.name,
          avatar: topPmEntry[1].candidate.avatar,
          voteCount: topPmEntry[1].count,
          percentage: Math.round((topPmEntry[1].count / pmTotalVotes) * 100)
        };
      }

      // Process ministries
      const processedSelections: PopularSelection[] = ministries.map(ministry => {
        const ministryData = ministryStats[ministry.id];
        let topCandidate: PopularCandidate | null = null;
        let totalVotes = 0;

        if (ministryData) {
          Object.values(ministryData).forEach(stat => totalVotes += stat.count);
          
          if (totalVotes > 0) {
            const topEntry = Object.entries(ministryData).reduce((max, [name, stat]) => 
              stat.count > max[1].count ? [name, stat] : max
            );
            
            topCandidate = {
              name: topEntry[1].candidate.name,
              avatar: topEntry[1].candidate.avatar,
              voteCount: topEntry[1].count,
              percentage: Math.round((topEntry[1].count / totalVotes) * 100)
            };
          }
        }

        return {
          ministryId: ministry.id,
          candidate: topCandidate,
          totalVotes
        };
      });

      setPopularSelections(processedSelections);
      setPmSelection(topPm);
      
    } catch (error) {
      console.error('Error processing popular selections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">טוען נתונים...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            הממשלה הפופולרית ביותר
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            הבחירות הפופולריות ביותר של הציבור
          </p>
        </div>
      </div>

      {/* Prime Minister Section */}
      <Card className="mb-6 border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-center">
            🏛️ ראש הממשלה
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pmSelection ? (
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <img 
                src={pmSelection.avatar} 
                alt={pmSelection.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{pmSelection.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Progress 
                    value={pmSelection.percentage} 
                    className="flex-1 h-3"
                  />
                  <span className="text-sm font-medium text-primary">
                    {pmSelection.percentage}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {pmSelection.voteCount} קולות
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              אין נתונים זמינים
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ministers Grid */}
      <div className="grid gap-4">
        {ministries.map((ministry) => {
          const selection = popularSelections.find(s => s.ministryId === ministry.id);
          
          return (
            <Card key={ministry.id} className="transition-all duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{ministry.icon}</span>
                  <div className="flex-1">
                    <div className="text-right">{ministry.name}</div>
                    <div className="text-xs text-muted-foreground font-normal">
                      {ministry.description}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selection?.candidate ? (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <img 
                      src={selection.candidate.avatar} 
                      alt={selection.candidate.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{selection.candidate.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress 
                          value={selection.candidate.percentage} 
                          className="flex-1 h-2"
                        />
                        <span className="text-xs font-medium text-primary">
                          {selection.candidate.percentage}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {selection.candidate.voteCount} מתוך {selection.totalVotes} קולות
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    אין בחירות זמינות למשרד זה
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}