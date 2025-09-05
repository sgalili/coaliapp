import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, RefreshCw, Share2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CandidateData {
  name: string;
  avatar: string;
  expertise: string;
  party: string;
  experience: string;
}

interface SelectedCandidates {
  [key: string]: CandidateData;
}

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
    'economy': 'כלכלה',
    'interior': 'פנים',
    'foreign': 'חוץ',
    'culture': 'תרבות וספורט',
    'science': 'מדע וטכנולוגיה',
    'immigration': 'קליטת עלייה',
    'agriculture': 'חקלאות',
    'tourism': 'תיירות'
  };
  return ministryNames[ministryId] || 'משרד';
}

export default function MyGovGeneratePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCandidates, setSelectedCandidates] = useState<SelectedCandidates>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get candidates from navigation state first
    if (location.state?.selectedCandidates) {
      setSelectedCandidates(location.state.selectedCandidates);
    } else {
      // Fallback to localStorage
      const saved = localStorage.getItem('myGovSelections');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSelectedCandidates(parsed);
        } catch (error) {
          console.error('Error parsing saved selections:', error);
          toast.error("אירעה שגיאה בטעינת הבחירות");
          navigate('/mygov');
          return;
        }
      } else {
        toast.error("לא נמצאו בחירות. אנא בחר מועמדים תחילה");
        navigate('/mygov');
        return;
      }
    }
  }, [location.state, navigate]);

  useEffect(() => {
    // Auto-generate when candidates are loaded
    if (Object.keys(selectedCandidates).length > 0 && !generatedImage && !isGenerating) {
      generateImage();
    }
  }, [selectedCandidates, generatedImage, isGenerating]);

  const generateImage = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Calling generate-government-image function with:', selectedCandidates);
      
      const { data, error } = await supabase.functions.invoke('generate-government-image', {
        body: { selectedCandidates }
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
      a.download = 'my-government.webp';
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
    if (!generatedImage) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'הממשלה שלי',
          text: 'הממשלה שיצרתי באפליקציה',
          url: generatedImage
        });
      } else {
        await navigator.clipboard.writeText(generatedImage);
        toast.success("קישור התמונה הועתק ללוח");
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      toast.error("שגיאה בשיתוף התמונה");
    }
  };

  const candidateCount = Object.keys(selectedCandidates).length;
  const pmCandidate = selectedCandidates['pm'];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/mygov')}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-center flex-1">
          🎨 יצירת הממשלה שלי
        </h1>
      </div>

      {/* Selection Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">סיכום הבחירות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            {pmCandidate && (
              <div className="font-medium border-b border-border/50 pb-2">
                🏛️ ראש הממשלה: {pmCandidate.name}
              </div>
            )}
            
            {/* Liste des ministres */}
            <div className="space-y-1">
              <div className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                שרים ({candidateCount - 1})
              </div>
              {Object.entries(selectedCandidates)
                .filter(([key]) => key !== 'pm')
                .map(([ministryId, candidate]) => (
                  <div key={ministryId} className="flex justify-between items-center text-xs py-1">
                    <span className="font-medium">{candidate.name}</span>
                    <span className="text-muted-foreground">{getMinistryDisplayName(ministryId)}</span>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Status */}
      {isGenerating && (
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">יוצר את הממשלה שלך...</h3>
            <p className="text-muted-foreground text-center">
              זה עלול לקחת כמה רגעים. אנחנו יוצרים תמונה מקצועית של הממשלה שבחרת באמצעות בינה מלאכותית.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !isGenerating && (
        <Card className="mb-6 border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-destructive text-lg mb-4">⚠️ שגיאה</div>
            <p className="text-center mb-4">{error}</p>
            <Button onClick={generateImage} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              נסה שוב
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generated Image */}
      {generatedImage && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-center">
              🎉 הממשלה שלך מוכנה!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <img 
                src={generatedImage} 
                alt="הממשלה שלי"
                className="w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <Button onClick={downloadImage} variant="default">
                <Download className="h-4 w-4 mr-2" />
                הורד תמונה
              </Button>
              <Button onClick={shareImage} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                שתף
              </Button>
              <Button onClick={generateImage} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                צור מחדש
              </Button>
            </div>

            {/* Back to Selection */}
            <div className="text-center pt-4">
              <Button 
                onClick={() => navigate('/mygov')} 
                variant="ghost"
                className="text-muted-foreground"
              >
                חזור לבחירת מועמדים
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Info (only in development) */}
      {prompt && process.env.NODE_ENV === 'development' && (
        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle className="text-sm">AI Prompt (Debug)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{prompt}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}