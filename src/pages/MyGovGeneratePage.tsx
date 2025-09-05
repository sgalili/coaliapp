import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Download, RefreshCw, Share2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAffiliateLinks } from "@/hooks/useAffiliateLinks";
import { CandidateData, SelectedCandidates, saveGovernmentImage, getExistingGovernmentImage, saveImageToLocalStorage, getImageFromLocalStorage } from "@/utils/governmentImageUtils";

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
  const {
    getAffiliateRef
  } = useAffiliateLinks();
  const [selectedCandidates, setSelectedCandidates] = useState<SelectedCandidates>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{first_name: string, last_name: string} | null>(null);
  useEffect(() => {
    // Load user profile
    const loadUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
        }
      }
    };
    
    loadUserProfile();
  }, []);

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
    // Load existing image or generate new one when candidates are loaded
    const loadOrGenerateImage = async () => {
      if (Object.keys(selectedCandidates).length === 0) return;
      setIsLoading(true);
      setError(null);
      try {
        // Try to get existing image from database first
        const existingImage = await getExistingGovernmentImage(selectedCandidates);
        if (existingImage) {
          console.log('Found existing image in database:', existingImage.image_url);
          setGeneratedImage(existingImage.image_url);
          setPrompt(existingImage.prompt || '');
          setIsLoading(false);
          return;
        }

        // If not found in database, try localStorage
        const localImage = getImageFromLocalStorage(selectedCandidates);
        if (localImage) {
          console.log('Found existing image in localStorage:', localImage.imageUrl);
          setGeneratedImage(localImage.imageUrl);
          setPrompt(localImage.prompt);
          setIsLoading(false);
          return;
        }

        // No existing image found, generate a new one
        await generateImage(false);
      } catch (error) {
        console.error('Error loading existing image:', error);
        // If there's an error loading, try to generate a new image
        await generateImage(false);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrGenerateImage();
  }, [selectedCandidates]);
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
  return <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/mygov')} className="p-2">
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold">הממשלה שלי</h1>
          <p className="text-sm text-muted-foreground mt-1">
            נוצר על ידי: {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'משתמש'}
          </p>
        </div>
        <div className="w-10"></div> {/* Spacer for balance */}
      </div>

      {/* Selection Summary */}
      <Card className="mb-6">
        <CardContent>
          <div className="space-y-3 text-sm">
            {pmCandidate && <div className="font-medium border-b border-border/50 pb-2">
                🏛️ ראש הממשלה: {pmCandidate.name}
              </div>}
            
            {/* Liste des ministres */}
            <div className="space-y-1">
              <div className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                שרים ({candidateCount - 1})
              </div>
              {Object.entries(selectedCandidates).filter(([key]) => key !== 'pm').map(([ministryId, candidate]) => <div key={ministryId} className="flex justify-between items-center text-xs py-1">
                    <span className="font-medium">{candidate.name}</span>
                    <span className="text-muted-foreground">{getMinistryDisplayName(ministryId)}</span>
                  </div>)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Status */}
      {(isGenerating || isLoading) && <Card className="mb-6">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {isGenerating ? "יוצר את הממשלה שלך..." : "טוען תמונה קיימת..."}
            </h3>
            <p className="text-muted-foreground text-center">
              {isGenerating ? "זה עלול לקחת כמה רגעים. אנחנו יוצרים תמונה מקצועית של הממשלה שבחרת באמצעות בינה מלאכותית." : "בודק אם יש תמונה קיימת עבור הבחירה שלך..."}
            </p>
          </CardContent>
        </Card>}

      {/* Error State */}
      {error && !isGenerating && !isLoading && <Card className="mb-6 border-destructive">
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
            <CardTitle className="text-lg text-center">
              🎉 הממשלה שלך מוכנה!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <img src={generatedImage} alt="הממשלה שלי" className="w-full h-auto rounded-lg shadow-lg" style={{
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

            {/* Back to Selection */}
            <div className="text-center pt-4">
              <Button onClick={() => navigate('/mygov')} variant="ghost" className="text-muted-foreground">
                חזור לבחירת מועמדים
              </Button>
            </div>
          </CardContent>
        </Card>}

      {/* Debug Info (only in development) */}
      {prompt && process.env.NODE_ENV === 'development' && <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle className="text-sm">AI Prompt (Debug)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{prompt}</p>
          </CardContent>
        </Card>}
    </div>;
}