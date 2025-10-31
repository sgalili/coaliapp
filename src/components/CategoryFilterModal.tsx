import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { ExpertDomain } from "@/types/expert";

interface CategoryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: ExpertDomain[];
  onCategoryChange: (categories: ExpertDomain[]) => void;
}

export const CategoryFilterModal = ({ 
  isOpen, 
  onClose, 
  selectedCategories, 
  onCategoryChange 
}: CategoryFilterModalProps) => {
  const categories: { key: ExpertDomain; label: string; emoji: string }[] = [
    { key: 'economy', label: 'כלכלה', emoji: '💰' },
    { key: 'tech', label: 'טכנולוגיה', emoji: '💻' },
    { key: 'education', label: 'חינוך', emoji: '📚' },
    { key: 'health', label: 'בריאות', emoji: '🏥' },
    { key: 'security', label: 'ביטחון', emoji: '🛡️' },
    { key: 'culture', label: 'תרבות', emoji: '🎭' },
  ];

  const toggleCategory = (category: ExpertDomain) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const clearAll = () => {
    onCategoryChange([]);
  };

  const selectAll = () => {
    onCategoryChange(categories.map(c => c.key));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">סינון לפי תחום</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
              className="flex-1"
            >
              בחר הכל
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAll}
              className="flex-1"
            >
              נקה הכל
            </Button>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">תחומי התמחות:</p>
            
            <div className="space-y-2">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.key);
                
                return (
                  <div
                    key={category.key}
                    onClick={() => toggleCategory(category.key)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-background border-border hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category.emoji}</span>
                      <span className="font-medium">{category.label}</span>
                    </div>
                    
                    {isSelected && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Count */}
          {selectedCategories.length > 0 && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">נבחרו:</span>
                <Badge variant="secondary" className="text-xs">
                  {selectedCategories.length} תחומים
                </Badge>
              </div>
            </div>
          )}

          {/* Apply Button */}
          <Button onClick={onClose} className="w-full">
            החל סינון
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};