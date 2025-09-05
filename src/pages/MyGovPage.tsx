import { ArrowRight, User, Shield, DollarSign, GraduationCap, Heart, Leaf, Scale, Car, Home, Globe, Palette, Beaker, Users, Wheat, Camera, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Ministry {
  id: string;
  name: string;
  icon: LucideIcon;
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

  const handleMinistryClick = (ministryId: string) => {
    console.log(`Selected ministry: ${ministryId}`);
    // TODO: Navigate to ministry selection page
  };

  const handlePMClick = () => {
    console.log("Selected Prime Minister position");
    // TODO: Navigate to PM selection page
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
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">ראש הממשלה</h3>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                לחצו לבחירה
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Ministries Grid */}
        <div className="grid grid-cols-2 gap-4">
          {ministries.map((ministry) => {
            const IconComponent = ministry.icon;
            return (
              <Card 
                key={ministry.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => handleMinistryClick(ministry.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium mb-3 leading-tight">{ministry.name}</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-xs"
                  >
                    לחצו לבחירה
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}