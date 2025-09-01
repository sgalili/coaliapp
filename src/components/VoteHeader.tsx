import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Plus, ChevronDown } from "lucide-react";

export const VoteHeader = () => {
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("תל-אביב - ישראל");

  const cities = [
    "תל-אביב - ישראל",
    "ירושלים - ישראל", 
    "חיפה - ישראל",
    "באר שבע - ישראל",
    "פתח תקווה - ישראל",
    "נתניה - ישראל",
    "רמת גן - ישראל"
  ];

  return (
    <>
      <div className="bg-card/95 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Location Selector */}
          <button
            onClick={() => setShowCitySelector(true)}
            className="flex items-center gap-2 bg-accent/50 hover:bg-accent rounded-lg px-3 py-2 transition-colors"
          >
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{selectedLocation}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Create Vote Button */}
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 ml-2" />
            צור הצבעה
          </Button>
        </div>

        {/* KYC Notice */}
        <div className="mt-3 bg-primary/10 border border-primary/20 rounded-lg p-3">
          <p className="text-xs text-primary text-center">
            💡 השלם אימות KYC כדי לראות הצבעות מותאמות לאזור שלך
          </p>
        </div>
      </div>

      {/* City Selector Modal */}
      <Dialog open={showCitySelector} onOpenChange={setShowCitySelector}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">בחר מיקום</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedLocation(city);
                  setShowCitySelector(false);
                }}
                className={`w-full text-right p-3 rounded-lg border transition-colors ${
                  selectedLocation === city 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-card hover:bg-accent border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{city}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              המיקום שלך מסייע להציג הצבעות רלוונטיות לאזור שלך
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};