import { ArrowRight, User, Shield, DollarSign, GraduationCap, Heart, Leaf, Scale, Car, Home, Globe, Palette, Beaker, Users, Wheat, Camera, LucideIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CandidateSelectionModal, Candidate } from "@/components/CandidateSelectionModal";

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

  const handleMinistryClick = (ministry: Ministry) => {
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
    const pmMinistry: Ministry = { id: "pm", name: "ראש הממשלה", icon: User };
    setSelectedMinistry(pmMinistry);
    setIsModalOpen(true);
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
            className="w-full max-w-sm cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={handlePMClick}
          >
            <CardContent className="p-6 text-center">
              {selectedCandidates["pm"] ? (
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

      {/* Candidate Selection Modal */}
      <CandidateSelectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMinistry(null);
        }}
        onSelect={handleCandidateSelect}
        candidates={mockCandidates}
        ministryName={selectedMinistry?.name || ""}
      />
    </div>
  );
}