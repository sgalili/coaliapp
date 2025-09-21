import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Download, RefreshCw, Share2, Loader2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAffiliateLinks } from "@/hooks/useAffiliateLinks";
import { CandidateData, SelectedCandidates, saveGovernmentImage, getExistingGovernmentImage, saveImageToLocalStorage, getImageFromLocalStorage } from "@/utils/governmentImageUtils";

// Ministry configurations matching MyGovPage
const ministries = [{
  id: 'defense',
  name: 'שר הביטחון',
  icon: '🛡️',
  description: 'אחראי על ביטחון המדינה והצבא'
}, {
  id: 'finance',
  name: 'שר האוצר',
  icon: '💰',
  description: 'אחראי על הכלכלה והתקציב'
}, {
  id: 'education',
  name: 'שר החינוך',
  icon: '📚',
  description: 'אחראי על מערכת החינוך'
}, {
  id: 'health',
  name: 'שר הבריאות',
  icon: '🏥',
  description: 'אחראי על מערכת הבריאות'
}, {
  id: 'justice',
  name: 'שר המשפטים',
  icon: '⚖️',
  description: 'אחראי על מערכת המשפט'
}, {
  id: 'transport',
  name: 'שר התחבורה',
  icon: '🚗',
  description: 'אחראי על תחבורה ותשתיות'
}, {
  id: 'housing',
  name: 'שר הבינוי והדיור',
  icon: '🏘️',
  description: 'אחראי על בינוי ודיור'
}, {
  id: 'economy',
  name: 'שר הכלכלה',
  icon: '📈',
  description: 'אחראי על התעשייה והמסחר'
}];

// Helper function to get ministry display names
function getMinistryDisplayName(ministryId: string): string {
  const ministryNames: Record<string, string> = {
    'defense': 'ביטחון',
    'finance': 'אוצר',
    'education': 'חינוך',
    'health': 'בריאות',
    'justice': 'משפטים',
    'transport': 'תחבורה',
    'housing': 'בינוי ודיור',
    'economy': 'כלכלה'
  };
  return ministryNames[ministryId] || 'משרד';
}
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
  const {
    getAffiliateRef
  } = useAffiliateLinks();
  const [popularSelections, setPopularSelections] = useState<PopularSelection[]>([]);
  const [pmSelection, setPmSelection] = useState<PopularCandidate | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<SelectedCandidates>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    loadPopularSelections();
  }, []);
  useEffect(() => {
    // Generate image when popular selections are loaded
    if (Object.keys(selectedCandidates).length > 0) {
      loadOrGenerateImage();
    }
  }, [selectedCandidates]);
  const loadPopularSelections = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const {
        data: sharedGovs,
        error
      } = await supabase.from('shared_governments').select('*');
      if (error) {
        console.error('Error loading shared governments:', error);
        setError('Failed to load popular selections');
        return;
      }
      if (!sharedGovs || sharedGovs.length === 0) {
        setError('No government data found');
        return;
      }

      // Count popularity for PM and ministers
      const pmCounts: Record<string, {
        count: number;
        avatar: string;
      }> = {};
      const ministryCounts: Record<string, Record<string, {
        count: number;
        avatar: string;
      }>> = {};

      // Initialize ministry counts
      ministries.forEach(ministry => {
        ministryCounts[ministry.id] = {};
      });
      sharedGovs.forEach(gov => {
        // Count PM
        if (gov.pm_name) {
          if (!pmCounts[gov.pm_name]) {
            pmCounts[gov.pm_name] = {
              count: 0,
              avatar: gov.pm_avatar || '/candidates/placeholder-defense.jpg'
            };
          }
          pmCounts[gov.pm_name].count++;
        }

        // Count ministers (8 positions)
        for (let i = 1; i <= 8; i++) {
          const ministerName = gov[`minister_${i}_name`];
          const ministerPosition = gov[`minister_${i}_position`];
          const ministerAvatar = gov[`minister_${i}_avatar`];
          if (ministerName && ministerPosition) {
            // Map position to ministry_id based on keywords
            let ministryId = '';
            if (ministerPosition.includes('ביטחון') || ministerPosition.includes('Defense')) {
              ministryId = 'defense';
            } else if (ministerPosition.includes('אוצר') || ministerPosition.includes('Finance')) {
              ministryId = 'finance';
            } else if (ministerPosition.includes('חינוך') || ministerPosition.includes('Education')) {
              ministryId = 'education';
            } else if (ministerPosition.includes('בריאות') || ministerPosition.includes('Health')) {
              ministryId = 'health';
            } else if (ministerPosition.includes('משפטים') || ministerPosition.includes('Justice')) {
              ministryId = 'justice';
            } else if (ministerPosition.includes('תחבורה') || ministerPosition.includes('Transport')) {
              ministryId = 'transport';
            } else if (ministerPosition.includes('בינוי') || ministerPosition.includes('דיור') || ministerPosition.includes('Housing')) {
              ministryId = 'housing';
            } else if (ministerPosition.includes('כלכלה') || ministerPosition.includes('Economy')) {
              ministryId = 'economy';
            }
            if (ministryId && ministryCounts[ministryId]) {
              if (!ministryCounts[ministryId][ministerName]) {
                ministryCounts[ministryId][ministerName] = {
                  count: 0,
                  avatar: ministerAvatar || '/candidates/placeholder-defense.jpg'
                };
              }
              ministryCounts[ministryId][ministerName].count++;
            }
          }
        }
      });

      // Find most popular PM
      let topPm: PopularCandidate | null = null;
      const pmTotalVotes = Object.values(pmCounts).reduce((total, data) => total + data.count, 0);
      if (pmTotalVotes > 0) {
        const topPmEntry = Object.entries(pmCounts).reduce((max, [name, data]) => data.count > max[1].count ? [name, data] : max);
        topPm = {
          name: topPmEntry[0],
          avatar: topPmEntry[1].avatar,
          voteCount: topPmEntry[1].count,
          percentage: Math.round(topPmEntry[1].count / pmTotalVotes * 100)
        };
      }

      // Process ministries
      const processedSelections: PopularSelection[] = ministries.map(ministry => {
        const ministryData = ministryCounts[ministry.id];
        let topCandidate: PopularCandidate | null = null;
        const totalVotes = Object.values(ministryData || {}).reduce((total, data) => total + data.count, 0);
        if (ministryData && totalVotes > 0) {
          const topEntry = Object.entries(ministryData).reduce((max, [name, data]) => data.count > max[1].count ? [name, data] : max);
          topCandidate = {
            name: topEntry[0],
            avatar: topEntry[1].avatar,
            voteCount: topEntry[1].count,
            percentage: Math.round(topEntry[1].count / totalVotes * 100)
          };
        }
        return {
          ministryId: ministry.id,
          candidate: topCandidate,
          totalVotes
        };
      });
      setPopularSelections(processedSelections);
      setPmSelection(topPm);

      // Create selectedCandidates object for image generation
      const candidates: SelectedCandidates = {};
      if (topPm) {
        candidates.pm = {
          name: topPm.name,
          avatar: topPm.avatar,
          expertise: 'Political Leadership',
          party: 'Popular Choice',
          experience: 'Most Popular Prime Minister'
        };
      }
      processedSelections.forEach(selection => {
        if (selection.candidate) {
          candidates[selection.ministryId] = {
            name: selection.candidate.name,
            avatar: selection.candidate.avatar,
            expertise: ministries.find(m => m.id === selection.ministryId)?.name || '',
            party: 'Popular Choice',
            experience: `Most Popular ${ministries.find(m => m.id === selection.ministryId)?.name || 'Minister'}`
          };
        }
      });
      setSelectedCandidates(candidates);
    } catch (error) {
      console.error('Error processing popular selections:', error);
      setError('שגיאה בטעינת הנתונים');
    } finally {
      setIsLoading(false);
    }
  };
  const loadOrGenerateImage = async () => {
    if (Object.keys(selectedCandidates).length === 0) return;
    setIsGenerating(true);
    setError(null);
    try {
      // Try to get existing image from database first
      const existingImage = await getExistingGovernmentImage(selectedCandidates);
      if (existingImage) {
        console.log('Found existing image in database:', existingImage.image_url);
        setGeneratedImage(existingImage.image_url);
        setPrompt(existingImage.prompt || '');
        setIsGenerating(false);
        return;
      }

      // If not found in database, try localStorage
      const localImage = getImageFromLocalStorage(selectedCandidates);
      if (localImage) {
        console.log('Found existing image in localStorage:', localImage.imageUrl);
        setGeneratedImage(localImage.imageUrl);
        setPrompt(localImage.prompt);
        setIsGenerating(false);
        return;
      }

      // No existing image found, generate a new one
      await generateImage();
    } catch (error) {
      console.error('Error loading existing image:', error);
      await generateImage();
    }
  };
  const generateImage = async (forceRegenerate = false) => {
    setIsGenerating(true);
    setError(null);
    try {
      if (forceRegenerate) {
        toast.info("יוצר תמונה חדשה...");
      }
      console.log('Calling generate-government-image function with:', selectedCandidates);
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-government-image', {
        body: {
          selectedCandidates
        }
      });
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'שגיאה ביצירת התמונה');
      }
      if (!data?.imageUrl) {
        throw new Error('לא התקבלה תמונה מהשרת');
      }
      setGeneratedImage(data.imageUrl);
      setPrompt(data.prompt || '');

      // Save the generated image
      try {
        await saveGovernmentImage(selectedCandidates, data.imageUrl, data.prompt || '', data.seed);
        console.log('Image saved to database');
      } catch (saveError) {
        console.warn('Failed to save to database, saving to localStorage:', saveError);
        saveImageToLocalStorage(selectedCandidates, data.imageUrl, data.prompt || '', data.seed);
      }
      toast.success("התמונה נוצרה בהצלחה!");
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error instanceof Error ? error.message : 'אירעה שגיאה לא צפויה');
      toast.error("שגיאה ביצירת התמונה");
    } finally {
      setIsGenerating(false);
    }
  };
  const downloadImage = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'popular-government.webp';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("התמונה הורדה בהצלחה!");
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error("שגיאה בהורדת התמונה");
    }
  };
  const shareImage = async () => {
    if (!generatedImage || !selectedCandidates) return;
    try {
      const shareUrl = `${window.location.origin}/mygov/popular`;
      if (navigator.share) {
        await navigator.share({
          title: 'הממשלה הפופולרית ביותר',
          text: 'הממשלה הפופולרית ביותר שנבחרה על ידי הציבור',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("קישור השיתוף הועתק ללוח");
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error("שגיאה בשיתוף התמונה");
    }
  };
  const candidateCount = Object.keys(selectedCandidates).length;
  const pmCandidate = selectedCandidates['pm'];
  if (isLoading) {
    return <div className="min-h-screen bg-background p-4 pb-20">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">טוען נתונים...</p>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background p-4 pb-20">
      {/* Back Button */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="absolute top-4 right-4 p-2 z-10">
        <ArrowRight className="h-5 w-5" />
      </Button>

      {/* Header */}
      <div className="text-center mb-6 pt-8">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          הממשלה הפופולרית ביותר
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          ממשלה זו מורכבת מהמועמדים שזכו בהכי הרבה קולות מהציבור לכל תפקיד ספציפי.<br />
          שתפו את הממשלה הזו עם חברים כדי להשיג ממשלת אחדות לאומית
        </p>
      </div>

      {/* Selection Summary */}
      <Card className="mb-6">
        
      </Card>

      {/* Generation Status */}
      {isGenerating && <Card className="mb-6">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">יוצר את הממשלה הפופולרית...</h3>
            <p className="text-muted-foreground text-center">
              זה עלול לקחת כמה רגעים. אנחנו יוצרים תמונה מקצועית של הממשלה הפופולרית ביותר באמצעות בינה מלאכותית.
            </p>
          </CardContent>
        </Card>}

      {/* Error State */}
      {error && !isGenerating && <Card className="mb-6 border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-destructive text-lg mb-4">⚠️ שגיאה</div>
            <p className="text-center mb-4">{error}</p>
            <Button onClick={() => generateImage(true)} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              נסה שוב
            </Button>
          </CardContent>
        </Card>}

      {/* Generated Image */}
      {generatedImage && <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-center">🎉 תמונת הממשלה הפופולרית ביותר!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <img src={generatedImage} alt="הממשלה הפופולרית ביותר" className="w-full h-auto rounded-lg shadow-lg" style={{
            maxHeight: '500px',
            objectFit: 'contain'
          }} />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              <Button onClick={downloadImage} variant="default" size="sm" className="flex-1 sm:flex-none min-w-0">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">הורד</span>
              </Button>
              <Button onClick={shareImage} variant="outline" size="sm" className="flex-1 sm:flex-none min-w-0">
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">שתף</span>
              </Button>
              <Button onClick={() => generateImage(true)} variant="outline" size="sm" className="flex-1 sm:flex-none min-w-0">
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">צור מחדש</span>
              </Button>
            </div>
          </CardContent>
        </Card>}

      {/* Popular Candidates Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">פירוט הבחירות הפופולריות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Prime Minister */}
            {pmSelection && <div className="border-2 border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏛️</span>
                  <h3 className="font-semibold">ראש הממשלה</h3>
                </div>
                <div className="flex items-center gap-4">
                  <img src={pmSelection.avatar} alt={pmSelection.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
                  <div className="flex-1">
                    <h4 className="font-medium">{pmSelection.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={pmSelection.percentage} className="flex-1 h-3" />
                      <span className="text-sm font-medium text-primary min-w-0">
                        {pmSelection.percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {pmSelection.voteCount} קולות
                    </p>
                  </div>
                </div>
              </div>}

            {/* Ministers */}
            <div className="space-y-3">
              {ministries.map(ministry => {
              const selection = popularSelections.find(s => s.ministryId === ministry.id);
              return <div key={ministry.id} className="border rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{ministry.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{ministry.name}</h4>
                        <p className="text-xs text-muted-foreground">{ministry.description}</p>
                      </div>
                    </div>
                    
                    {selection?.candidate ? <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-2">
                        <img src={selection.candidate.avatar} alt={selection.candidate.name} className="w-10 h-10 rounded-full object-cover border border-primary/20" />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{selection.candidate.name}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={selection.candidate.percentage} className="flex-1 h-2" />
                            <span className="text-xs font-medium text-primary min-w-0">
                              {selection.candidate.percentage}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {selection.candidate.voteCount} מתוך {selection.totalVotes} קולות
                          </p>
                        </div>
                      </div> : <div className="text-center py-4 text-muted-foreground text-sm">
                        אין בחירות זמינות למשרד זה
                      </div>}
                  </div>;
            })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}