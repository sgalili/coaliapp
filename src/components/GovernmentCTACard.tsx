import { Users } from "lucide-react";

interface GovernmentCTACardProps {
  onClick?: () => void;
}

export const GovernmentCTACard = ({ onClick }: GovernmentCTACardProps) => {
  return (
    <div className="px-4 pb-4">
      <div className="space-y-3 text-right">
        {/* Main CTA Button */}
        <button
          onClick={onClick}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">
              הממשלה שלי
            </h3>
          </div>
          
          <p className="text-lg font-semibold opacity-95">
            הרכיבו את הממשלה שלכם בקליק!
          </p>
        </button>

        {/* Subtitle below button */}
        <p className="text-xs text-muted-foreground text-center px-2 leading-relaxed">
          בחרו בטובים ביותר - לתפקידים הנכונים והמתאימים ביותר !
        </p>
      </div>
    </div>
  );
};