import { useNavigate } from "react-router-dom";

interface GovernmentCTACardProps {
  onClick?: () => void;
}
export const GovernmentCTACard = ({
  onClick
}: GovernmentCTACardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/mygov');
    }
  };
  return <div className="px-4 pb-4">
      <div className="space-y-3 text-right">
        {/* Main CTA Button */}
        <button onClick={handleClick} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
          <div className="flex items-center justify-center mb-2">
            <h3 className="text-xl font-bold">
              הממשלה שלי
            </h3>
          </div>
          
          <p className="text-lg font-semibold opacity-95">
            הרכיבו את הממשלה שלכם בקליק!
          </p>
        </button>

        {/* Subtitle below button */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed px-[4px]">בחרו בטובים ביותר - לתפקידים המתאימים ביותר!</p>
      </div>
    </div>;
};