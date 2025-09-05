import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GovernmentCTACardProps {
  onClick?: () => void;
}

export const GovernmentCTACard = ({ onClick }: GovernmentCTACardProps) => {
  return (
    <div className="bg-background border-b border-border p-4">
      <div className="flex items-start gap-4 text-right">
        <div className="flex-1">
          <div className="flex items-center justify-end gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">
              הממשלה שלי
            </h3>
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
          
          <p className="text-sm font-medium text-foreground mb-2">
            הרכיבו את הממשלה שלכם בקליק!
          </p>
          
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            בחרו בטובים ביותר - לתפקידים הנכונים והמתאימים ביותר !
          </p>
          
          <div className="flex justify-end">
            <Button 
              onClick={onClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
            >
              בואו נתחיל!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};