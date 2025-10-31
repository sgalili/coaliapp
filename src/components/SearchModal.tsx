import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { TrustedUserCard } from "@/components/TrustedUserCard";
import { ProfileOverlay } from "@/components/ProfileOverlay";
import type { Expert } from "@/types/expert";
import { useToast } from "@/hooks/use-toast";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allExperts: Expert[];
}

export const SearchModal = ({ isOpen, onClose, allExperts }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const { toast } = useToast();

  // Filter experts based on search query
  const filteredExperts = searchQuery.length >= 2 
    ? allExperts.filter(expert => 
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.expertise.some(domain => domain.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleTrustClick = (expert: Expert) => {
    toast({
      title: expert.trustedByUser ? "הוסר אמון" : "נתן אמון",
      description: expert.trustedByUser 
        ? `הוסר האמון מ${expert.name}` 
        : `נתת אמון ל${expert.name}`,
      duration: 2000,
    });
  };

  const handleWatchClick = (expert: Expert) => {
    toast({
      title: "פתיחת פרופיל",
      description: `צפייה בתוכן של ${expert.name}`,
      duration: 2000,
    });
  };

  const handleMessageClick = () => {
    toast({
      title: "שליחת הודעה",
      description: "פתיחת צ'אט עם המשתמש",
      duration: 2000,
    });
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedExpert(null);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg h-[80vh] p-0 gap-0">
          <DialogHeader className="p-4 pb-0 border-b border-border">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">חיפוש משתמשים</DialogTitle>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search Input */}
            <div className="relative mt-4">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="חפש לפי שם או תחום..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                autoFocus
              />
            </div>
          </DialogHeader>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {searchQuery.length < 2 ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <p className="text-sm">הקלד לפחות 2 תווים לחיפוש</p>
              </div>
            ) : filteredExperts.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <p className="text-sm">לא נמצאו תוצאות עבור "{searchQuery}"</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground mb-4">
                  נמצאו {filteredExperts.length} תוצאות
                </p>
                
                {filteredExperts.map((expert) => (
                  <TrustedUserCard
                    key={expert.id}
                    expert={expert}
                    onProfileClick={() => setSelectedExpert(expert)}
                    onTrustClick={() => handleTrustClick(expert)}
                    onWatchClick={() => handleWatchClick(expert)}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Overlay */}
      {selectedExpert && (
        <ProfileOverlay
          expert={selectedExpert}
          isOpen={!!selectedExpert}
          onClose={() => setSelectedExpert(null)}
          onTrustClick={() => handleTrustClick(selectedExpert)}
          onMessageClick={handleMessageClick}
        />
      )}
    </>
  );
};