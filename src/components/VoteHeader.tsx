import { useState, useEffect } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useKYC } from "@/hooks/useKYC";
import { KYCForm } from "@/components/KYCForm";
export const VoteHeader = () => {
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("תל אביב");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const {
    showKYC,
    triggerKYCCheck,
    handleKYCSuccess,
    handleKYCClose
  } = useKYC();
  
  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show header at the top
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsHeaderVisible(false);
      } else if (lastScrollY - currentScrollY > 5) {
        // Scrolling up by at least 5px
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const cities = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "פתח תקווה", "נתניה", "אשדוד", "ראשון לציון", "הרצליה", "רעננה", "כפר סבא", "רחובות", "בת ים", "חולון", "גבעתיים", "קריית אונו"];
  return <>
      {/* Fixed Header */}
      <div className={`fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
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