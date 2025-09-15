import { ArrowRight, User, Shield, DollarSign, GraduationCap, Heart, Leaf, Scale, Car, Home, Globe, Palette, Beaker, Users, Wheat, Camera, LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CandidateSelectionModal, Candidate } from "@/components/CandidateSelectionModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Import profile images
import amitProfile from "@/assets/amit-profile.jpg";
import davidProfile from "@/assets/david-profile.jpg";
import mayaProfile from "@/assets/maya-profile.jpg";
import netanyahuProfile from "@/assets/netanyahu-profile.jpg";
import noaProfile from "@/assets/noa-profile.jpg";
import rachelProfile from "@/assets/rachel-profile.jpg";
import sarahProfile from "@/assets/sarah-profile.jpg";
import yaakovProfile from "@/assets/yaakov-profile.jpg";
import yaronProfile from "@/assets/yaron-profile.jpg";
import yaronZelekhaProfile from "@/assets/yaron-zelekha-profile.jpg";

// Import PM candidates photos
import netanyahuCandidateProfile from "@/assets/candidates/netanyahu.jpg";
import lapidProfile from "@/assets/candidates/lapid.jpg";
import bennettProfile from "@/assets/candidates/bennett.jpg";
import gantzProfile from "@/assets/candidates/gantz.jpg";
import saarProfile from "@/assets/candidates/saar.jpg";
import liebermanProfile from "@/assets/candidates/lieberman.jpg";
import benGvirProfile from "@/assets/candidates/ben-gvir.jpg";
import livniProfile from "@/assets/candidates/livni.jpg";
import barakProfile from "@/assets/candidates/barak.jpg";
import shakedProfile from "@/assets/candidates/shaked.jpg";

// Import PM candidates hook
import { usePrimeMinisters, PMCandidate } from "@/hooks/usePrimeMinisters";
import { useDefenseCandidates, DefenseCandidate } from "@/hooks/useDefenseCandidates";
import { useEconomicsCandidates, EconomicsCandidate } from "@/hooks/useEconomicsCandidates";
import { useEducationCandidates, EducationCandidate } from "@/hooks/useEducationCandidates";

// Mock candidates data
const mockCandidates: Candidate[] = [
  {
    id: "amit1",
    name: "עמית כהן",
    avatar: amitProfile,
    expertise: ["ביטחון", "צבא", "מדיניות"],
    party: "ליכוד",
    experience: "קצין לשעבר ביחידת שלדג, יועץ ביטחון"
  },
  {
    id: "david2", 
    name: "דוד לוי",
    avatar: davidProfile,
    expertise: ["כלכלה", "פיננסים", "בנקאות"],
    party: "יש עתיד",
    experience: "כלכלן ראשי בבנק ישראל לשעבר"
  },
  {
    id: "maya3",
    name: "מיה רוזן",
    avatar: mayaProfile,
    expertise: ["חינוך", "חברה", "נוער"],
    party: "העבודה",
    experience: "מנהלת מערכת חינוך עירונית"
  },
  {
    id: "noa4",
    name: "נועה שמיר",
    avatar: noaProfile,
    expertise: ["בריאות", "רפואה", "מחקר"],
    party: "כחול לבן",
    experience: "רופאה בכירה בשיבא, חוקרת"
  },
  {
    id: "rachel5",
    name: "רחל אברהם",
    avatar: rachelProfile,
    expertise: ["סביבה", "קיימות", "אקלים"],
    party: "מרץ",
    experience: "פעילת סביבה, מומחית באקלים"
  },
  {
    id: "sarah6",
    name: "שרה גולדמן",
    avatar: sarahProfile,
    expertise: ["משפטים", "חוק", "זכויות"],
    party: "ליכוד",
    experience: "שופטת בית משפט מחוזי לשעבר"
  },
  {
    id: "yaakov7",
    name: "יעקב מזרחי",
    avatar: yaakovProfile,
    expertise: ["תחבורה", "תשתיות", "הנדסה"],
    party: "יש עתיד", 
    experience: "מהندס תחבורה, מנהל פרויקטים"
  },
  {
    id: "yaron8",
    name: "ירון זלקה",
    avatar: yaronZelekhaProfile,
    expertise: ["כלכלה", "אוצר", "מדיניות"],
    party: "כחול לבן",
    experience: "חשב כללי לשעבר, כלכלן"
  }
];

interface Ministry {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface SelectedCandidate {
  [ministryId: string]: Candidate;
}

const ministries: Ministry[] = [
  { id: "defense", name: "ביטחון", icon: Shield },
  { id: "finance", name: "כלכלה ואוצר", icon: DollarSign },
  { id: "education", name: "חינוך", icon: GraduationCap },
  { id: "health", name: "בריאות", icon: Heart },
  { id: "environment", name: "סביבה", icon: Leaf },
  { id: "justice", name: "משפטים", icon: Scale },
  { id: "transport", name: "תחבורה", icon: Car },
  { id: "interior", name: "פנים", icon: Home },
  { id: "foreign", name: "חוץ", icon: Globe },
  { id: "culture", name: "תרבות וספורט", icon: Palette },
  { id: "science", name: "מדע וטכנולוגיה", icon: Beaker },
  { id: "immigration", name: "קליטת עלייה", icon: Users },
  { id: "agriculture", name: "חקלאות", icon: Wheat },
  { id: "tourism", name: "תיירות", icon: Camera },
];

export default function MyGovPage() {
  const navigate = useNavigate();
  const [selectedCandidates, setSelectedCandidates] = useState<SelectedCandidate>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load PM candidates from Supabase
  const { candidates: pmCandidates, isLoading: pmLoading, error: pmError } = usePrimeMinisters();
  
  // Load defense candidates from Supabase
  const { candidates: defenseCandidates, isLoading: defenseLoading, error: defenseError } = useDefenseCandidates();
  
  // Load economics candidates from Supabase
  const { candidates: economicsCandidates, isLoading: economicsLoading, error: economicsError } = useEconomicsCandidates();
  
  // Load education candidates from Supabase
  const { candidates: educationCandidates, isLoading: educationLoading, error: educationError } = useEducationCandidates();

  // Load existing government selections on component mount
  useEffect(() => {
    loadGovernmentSelections();
  }, []);

  const loadGovernmentSelections = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Try to load from Supabase if user is logged in
        const { data: selections, error } = await supabase
          .from('government_selections')
          .select('ministry_id, candidate_data')
          .eq('user_id', user.id);

        if (error) throw error;

        if (selections && selections.length > 0) {
          const loadedSelections: SelectedCandidate = {};
          selections.forEach(selection => {
            loadedSelections[selection.ministry_id] = selection.candidate_data as unknown as Candidate;
          });
          setSelectedCandidates(loadedSelections);
          return;
        }
      }
      
      // Fallback to localStorage if no user or no Supabase data
      const saved = localStorage.getItem('myGovSelections');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSelectedCandidates(parsed);
          console.log('Loaded from localStorage:', parsed);
        } catch (parseError) {
          console.error('Error parsing localStorage data:', parseError);
        }
      }
      
    } catch (error) {
      console.error('Error loading government selections:', error);
      
      // Try localStorage as fallback on error
      const saved = localStorage.getItem('myGovSelections');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSelectedCandidates(parsed);
        } catch (parseError) {
          console.error('Error parsing localStorage fallback:', parseError);
        }
      }
      
      toast({
        title: "שגיאה בטעינה",
        description: "לא הצלחנו לטעון את הבחירות שלך",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('myGovSelections', JSON.stringify(selectedCandidates));
      console.log('Saved to localStorage:', selectedCandidates);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const navigateToGeneration = async () => {
    try {
      setIsSaving(true);
      
      // Always save to localStorage for persistence
      saveToLocalStorage();
      
      // If user is logged in, also save to Supabase in background
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          // Delete existing selections for this user
          await supabase
            .from('government_selections')
            .delete()
            .eq('user_id', user.id);

          // Insert new selections
          const selectionsToSave = Object.entries(selectedCandidates).map(([ministryId, candidate]) => ({
            user_id: user.id,
            ministry_id: ministryId,
            candidate_data: candidate as unknown as any
          }));

          if (selectionsToSave.length > 0) {
            const { error } = await supabase
              .from('government_selections')
              .insert(selectionsToSave);

            if (error) {
              console.error('Background save error:', error);
              // Don't block navigation on Supabase error
            } else {
              console.log('Successfully saved to Supabase');
            }
          }
        } catch (error) {
          console.error('Background save error:', error);
          // Don't block navigation
        }
      }

      // Navigate to generation page with candidates data
      navigate('/mygov/generate', { 
        state: { selectedCandidates }
      });
      
    } catch (error) {
      console.error('Error in navigation:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה. מנסה שוב...",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveGovernmentSelections = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "שגיאה",
          description: "עליך להתחבר כדי לשמור את הבחירות",
          variant: "destructive",
        });
        return;
      }

      // Delete existing selections for this user
      await supabase
        .from('government_selections')
        .delete()
        .eq('user_id', user.id);

      // Insert new selections
      const selectionsToSave = Object.entries(selectedCandidates).map(([ministryId, candidate]) => ({
        user_id: user.id,
        ministry_id: ministryId,
        candidate_data: candidate as unknown as any
      }));

      if (selectionsToSave.length > 0) {
        const { error } = await supabase
          .from('government_selections')
          .insert(selectionsToSave);

        if (error) throw error;
      }

      toast({
        title: "נשמר בהצלחה!",
        description: "הממשלה שלך נשמרה בהצלחה",
      });
    } catch (error) {
      console.error('Error saving government selections:', error);
      toast({
        title: "שגיאה בשמירה",
        description: "לא הצלחנו לשמור את הבחירות שלך",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Check if we have enough selections to show the save button
  const hasMinimumSelections = () => {
    const hasPM = selectedCandidates["pm"];
    const ministerCount = Object.keys(selectedCandidates).filter(key => key !== "pm").length;
    return hasPM && ministerCount >= 2;
  };

  const handleMinistryClick = (ministry: Ministry) => {
    // Don't open modal while candidates are loading for specific ministries
    if (ministry.id === "defense" && defenseLoading) return;
    if (ministry.id === "finance" && economicsLoading) return;
    if (ministry.id === "education" && educationLoading) return;
    setSelectedMinistry(ministry);
    setIsModalOpen(true);
  };

  const handleCandidateSelect = (candidate: Candidate) => {
    if (selectedMinistry) {
      setSelectedCandidates(prev => ({
        ...prev,
        [selectedMinistry.id]: candidate
      }));
    }
    setIsModalOpen(false);
    setSelectedMinistry(null);
  };

  const handlePMClick = () => {
    // Don't open modal while loading or if no candidates are available
    if (pmLoading || !pmCandidates.length) return;
    const pmMinistry: Ministry = { id: "pm", name: "ראש הממשלה", icon: User };
    setSelectedMinistry(pmMinistry);
    setIsModalOpen(true);
  };

  // Convert PM candidates to the expected Candidate format
  const convertPMCandidates = (pmCandidates: PMCandidate[]): Candidate[] => {
    return pmCandidates.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      avatar: candidate.avatar,
      expertise: candidate.expertise,
      party: candidate.party,
      experience: candidate.experience
    }));
  };

  // Convert Defense candidates to the expected Candidate format
  const convertDefenseCandidates = (defenseCandidates: DefenseCandidate[]): Candidate[] => {
    return defenseCandidates.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      avatar: candidate.avatar,
      expertise: candidate.expertise,
      party: candidate.party,
      experience: candidate.experience
    }));
  };

  // Convert Economics candidates to the expected Candidate format
  const convertEconomicsCandidates = (economicsCandidates: EconomicsCandidate[]): Candidate[] => {
    return economicsCandidates.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      avatar: candidate.avatar,
      expertise: candidate.expertise,
      party: candidate.party,
      experience: candidate.experience
    }));
  };

  // Convert Education candidates to the expected Candidate format
  const convertEducationCandidates = (educationCandidates: EducationCandidate[]): Candidate[] => {
    return educationCandidates.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      avatar: candidate.avatar,
      expertise: candidate.expertise,
      party: candidate.party,
      experience: candidate.experience
    }));
  };

  // Determine which candidates to show in modal
  const getCurrentCandidates = (): Candidate[] => {
    if (selectedMinistry?.id === "pm") {
      return convertPMCandidates(pmCandidates);
    }
    if (selectedMinistry?.id === "defense") {
      return convertDefenseCandidates(defenseCandidates);
    }
    if (selectedMinistry?.id === "finance") {
      return convertEconomicsCandidates(economicsCandidates);
    }
    if (selectedMinistry?.id === "education") {
      return convertEducationCandidates(educationCandidates);
    }
    return mockCandidates;
  };

  return (
    <div className="min-h-screen bg-background text-right" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="ml-auto"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-center flex-1">הממשלה שלי</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Prime Minister Section */}
        <div className="flex justify-center">
          <Card 
            className={`w-full max-w-sm cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${pmLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={pmLoading ? undefined : handlePMClick}
          >
            <CardContent className="p-6 text-center">
              {pmLoading ? (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">ראש הממשלה</h3>
                  <p className="text-sm text-muted-foreground">טוען מועמדים...</p>
                </>
              ) : selectedCandidates["pm"] ? (
                <>
                  <div className="flex justify-center mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={selectedCandidates["pm"].avatar} alt={selectedCandidates["pm"].name} />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">ראש הממשלה</h3>
                  <p className="text-base font-medium text-primary mb-2">{selectedCandidates["pm"].name}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    שנה בחירה
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">ראש הממשלה</h3>
                  <Button variant="outline" size="sm" className="w-full">
                    לחצו לבחירה
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ministries Grid */}
        <div className="grid grid-cols-2 gap-4">
          {ministries.map((ministry) => {
            const IconComponent = ministry.icon;
            const selectedCandidate = selectedCandidates[ministry.id];
            
            return (
              <Card 
                key={ministry.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => handleMinistryClick(ministry)}
              >
                <CardContent className="p-4 text-center">
                  {selectedCandidate ? (
                    <>
                      <div className="flex justify-center mb-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={selectedCandidate.avatar} alt={selectedCandidate.name} />
                          <AvatarFallback>
                            <IconComponent className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <h3 className="text-sm font-medium mb-1 leading-tight">{ministry.name}</h3>
                      <p className="text-xs font-medium text-primary mb-3 leading-tight">{selectedCandidate.name}</p>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        שנה בחירה
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium mb-3 leading-tight">{ministry.name}</h3>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        לחצו לבחירה
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>

      {/* Fixed Generate Government Button */}
      {hasMinimumSelections() && (
        <div className="fixed bottom-0 left-0 right-0 p-2 z-50">
          <Button 
            onClick={navigateToGeneration}
            disabled={isSaving}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm py-2 px-4 rounded-md"
          >
            {isSaving ? "יוצר..." : "סיימתי ! צור את הממשלה שלי"}
          </Button>
        </div>
      )}

      {/* Candidate Selection Modal */}
      <CandidateSelectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMinistry(null);
        }}
        onSelect={handleCandidateSelect}
        candidates={getCurrentCandidates()}
        ministryName={selectedMinistry?.name || ""}
      />
    </div>
  );
}