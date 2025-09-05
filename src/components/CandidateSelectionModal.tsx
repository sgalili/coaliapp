import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

export interface Candidate {
  id: string;
  name: string;
  avatar?: string;
  expertise: string[];
  party?: string;
  experience: string;
}

interface CandidateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (candidate: Candidate) => void;
  candidates: Candidate[];
  ministryName: string;
}

export const CandidateSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  candidates,
  ministryName
}: CandidateSelectionModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : candidates.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < candidates.length - 1 ? prev + 1 : 0));
  };

  const handleSelect = () => {
    if (candidates[currentIndex]) {
      onSelect(candidates[currentIndex]);
      onClose();
    }
  };

  if (!candidates.length) return null;

  const currentCandidate = candidates[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            בחירת מועמד ל{ministryName}
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          {/* Carousel Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} מתוך {candidates.length}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Candidate Card */}
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={currentCandidate.avatar} alt={currentCandidate.name} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{currentCandidate.name}</h3>
              
              {currentCandidate.party && (
                <Badge variant="secondary" className="mb-3">
                  {currentCandidate.party}
                </Badge>
              )}
              
              <p className="text-sm text-muted-foreground mb-4">
                {currentCandidate.experience}
              </p>
              
              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 justify-center">
                {currentCandidate.expertise.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Select Button */}
          <Button 
            onClick={handleSelect}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            size="lg"
          >
            בחר לתפקיד
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};