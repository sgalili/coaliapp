import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useKYC } from "@/hooks/useKYC";
import { KYCForm } from "@/components/KYCForm";
import { SectionHeader } from "@/components/SectionHeader";
import { Vote } from "lucide-react";
export const VoteHeader = () => {
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
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return <>
      {/* Fixed Header */}
      <div className={`fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center justify-between pr-4">
          {/* Section Header */}
          <div className="flex-1">
            <SectionHeader 
              icon={Vote}
              title="החלטות"
              description="הצבע על הנושאים החשובים לך"
              className="pt-3 pb-3 border-b-0"
            />
          </div>

          {/* Create Vote Button */}
          <button className="w-10 h-10 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center ml-2">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* KYC Dialog */}
      {showKYC && <Dialog open={showKYC} onOpenChange={handleKYCClose}>
          <DialogContent className="sm:max-w-md">
            <KYCForm onSubmit={handleKYCSuccess} onBack={handleKYCClose} />
          </DialogContent>
        </Dialog>}
    </>;
};