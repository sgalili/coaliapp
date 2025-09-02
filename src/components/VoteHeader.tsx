import { useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useKYC } from "@/hooks/useKYC";
import { KYCForm } from "@/components/KYCForm";
export const VoteHeader = () => {
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("תל אביב");
  const [showKycNotice, setShowKycNotice] = useState(true);
  const {
    showKYC,
    triggerKYCCheck,
    handleKYCSuccess,
    handleKYCClose
  } = useKYC();
  const cities = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "פתח תקווה", "נתניה", "אשדוד", "ראשון לציון", "הרצליה", "רעננה", "כפר סבא", "רחובות", "בת ים", "חולון", "גבעתיים", "קריית אונו"];
  return <>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Location Selector */}
          <button onClick={() => setShowCitySelector(true)} className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">{selectedLocation}</span>
          </button>

          {/* Create Vote Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="font-medium text-sm">יצירת הצבעה</span>
          </button>
        </div>

        {/* KYC Notice */}
        {showKycNotice && <div className="px-4 pt-0 pb-1">
            <div className="bg-blue-50 border border-blue-180 p-0 text-right relative rounded my-0 px-px mx-[42px]">
              <button onClick={() => setShowKycNotice(false)} className="absolute top-1 left-1 w-4 h-4 flex items-center justify-center transition-colors hover:opacity-70">
                <X className="w-2.5 h-2.5 text-blue-600" />
              </button>
              <button onClick={() => triggerKYCCheck()} className="text-blue-800 text-xs hover:underline cursor-pointer">
                💡 לתוכן מותאם אישית, השלימו אימות זהות
              </button>
            </div>
          </div>}
      </div>

      {/* City Selector Modal */}
      <Dialog open={showCitySelector} onOpenChange={setShowCitySelector}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-right">בחירת עיר</DialogTitle>
              <button onClick={() => setShowCitySelector(false)} className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          
          <div className="max-h-80 overflow-y-auto">
            <div className="space-y-1">
              {cities.map(city => <button key={city} onClick={() => {
              setSelectedLocation(city);
              setShowCitySelector(false);
            }} className="w-full text-right p-3 hover:bg-muted rounded-lg transition-colors border-b border-border last:border-b-0">
                  {city}
                </button>)}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* KYC Dialog */}
      {showKYC && <Dialog open={showKYC} onOpenChange={handleKYCClose}>
          <DialogContent className="sm:max-w-md">
            <KYCForm onSubmit={handleKYCSuccess} onBack={handleKYCClose} />
          </DialogContent>
        </Dialog>}
    </>;
};