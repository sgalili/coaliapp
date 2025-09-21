import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Share2, Loader2, PlusCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface SharedGovernmentData {
  pm_name: string;
  pm_avatar?: string;
  ministers: Array<{
    name: string;
    position: string;
    avatar?: string;
  }>;
  generated_image_url: string;
  creator_name?: string;
  share_url: string;
}

export default function MyGovSharePage() {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [governmentData, setGovernmentData] = useState<SharedGovernmentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedGovernment = async () => {
      if (!shareId) {
        setError("מזהה ממשלה לא תקין");
        setIsLoading(false);
        return;
      }

      console.log('Loading shared government with shareId:', shareId);

      try {
        const { data, error } = await supabase
          .from('shared_governments')
          .select('*')
          .eq('share_id', shareId)
          .maybeSingle();

        console.log('Supabase response:', { data, error });

        if (error) {
          console.error('Database error loading shared government:', error);
          setError("שגיאה בטעינת הממשלה מהמסד נתונים");
          setIsLoading(false);
          return;
        }

        if (!data) {
          console.log('No data found for shareId:', shareId);
          setError("ממשלה לא נמצאה");
          setIsLoading(false);
          return;
        }

        // Transform database data to component format
        const ministers: Array<{name: string; position: string; avatar?: string}> = [];
        
        for (let i = 1; i <= 8; i++) {
          const ministerName = data[`minister_${i}_name` as keyof typeof data];
          const ministerPosition = data[`minister_${i}_position` as keyof typeof data];
          const ministerAvatar = data[`minister_${i}_avatar` as keyof typeof data];
          
          if (ministerName && ministerPosition) {
            ministers.push({
              name: ministerName as string,
              position: ministerPosition as string,
              avatar: ministerAvatar as string || undefined
            });
          }
        }

        setGovernmentData({
          pm_name: data.pm_name,
          pm_avatar: data.pm_avatar || undefined,
          ministers,
          generated_image_url: data.generated_image_url,
          creator_name: data.creator_name || undefined,
          share_url: data.share_url || `${window.location.origin}/mygov/share/${shareId}`
        });

      } catch (error) {
        console.error('Error loading shared government:', error);
        setError("שגיאה בטעינת הממשלה");
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedGovernment();
  }, [shareId]);

  const downloadImage = async () => {
    if (!governmentData?.generated_image_url) return;
    
    try {
      const response = await fetch(governmentData.generated_image_url);
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
    if (!governmentData?.share_url) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'הממשלה שלי',
          text: 'הממשלה שיצרתי באפליקציה',
          url: governmentData.share_url
        });
      } else {
        await navigator.clipboard.writeText(governmentData.share_url);
        toast.success("קישור התמונה הועתק ללוח");
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error("שגיאה בשיתוף התמונה");
    }
  };

  const createMyGovernment = () => {
    // Clear any existing local storage selections to start fresh
    localStorage.removeItem('selectedCandidates');
    localStorage.removeItem('governmentImages');
    
    // Navigate to MyGov page
    navigate('/mygov');
    toast.success("מעבר ליצירת ממשלה חדשה!");
  };

  const viewPopularGovernment = () => {
    navigate('/mygov/popular');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 pb-20">
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">טוען ממשלה...</h3>
            <p className="text-muted-foreground text-center">
              טוען את הממשלה שנוצרה...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !governmentData) {
    return (
      <div className="min-h-screen bg-background p-4 pb-20">
        <Card className="mb-6 border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-destructive text-lg mb-4">⚠️ שגיאה</div>
            <p className="text-center mb-4">{error || "ממשלה לא נמצאה"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const candidateCount = governmentData.ministers.length + 1; // +1 for PM

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold">הממשלה שלי</h1>
          <p className="text-sm text-muted-foreground mt-1">
            נוצר על ידי: {governmentData.creator_name || 'משתמש'}
          </p>
        </div>
      </div>

      {/* Selection Summary */}
      <Card className="mb-6">
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="font-medium border-b border-border/50 pb-2 py-[14px]">
              🏛️ ראש הממשלה: {governmentData.pm_name}
            </div>
            
            {/* Liste des ministres */}
            <div className="space-y-1">
              <div className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                שרים ({governmentData.ministers.length})
              </div>
              {governmentData.ministers.map((minister, index) => (
                <div key={index} className="flex justify-between items-center text-xs py-1">
                  <span className="font-medium">{minister.name}</span>
                  <span className="text-muted-foreground">{getMinistryDisplayName(minister.position)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Image */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-center">
            🎉 תמונת הממשלה שלי!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <img 
              src={governmentData.generated_image_url} 
              alt="הממשלה שלי" 
              className="w-full h-auto rounded-lg shadow-lg" 
              style={{
                maxHeight: '500px',
                objectFit: 'contain'
              }} 
            />
          </div>
          
          {/* Action Buttons - Only Download and Share */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            <Button onClick={downloadImage} variant="default" size="sm" className="flex-1 sm:flex-none min-w-0">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">הורד</span>
            </Button>
            <Button onClick={shareImage} variant="outline" size="sm" className="flex-1 sm:flex-none min-w-0">
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">שתף</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* New Action Buttons */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Button 
              onClick={createMyGovernment}
              variant="default"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              אני רוצה ליצור את הממשלה שלי
            </Button>
            
            <Button 
              onClick={viewPopularGovernment}
              variant="outline"
              size="lg"
              className="w-full border-primary/20 hover:bg-primary/5 text-primary hover:text-primary"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              הממשלה הפופולרית ביותר
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}