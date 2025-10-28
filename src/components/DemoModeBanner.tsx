import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useIsDemoMode } from "@/hooks/useIsDemoMode";
import { useNavigate } from "react-router-dom";

export const DemoModeBanner = () => {
  const { isDemoMode, disableDemoMode } = useIsDemoMode();
  const navigate = useNavigate();

  if (!isDemoMode) return null;

  const handleExitDemo = () => {
    disableDemoMode();
    navigate('/auth');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="font-semibold">מצב דמו - Demo Mode</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleExitDemo}
        className="text-white hover:bg-white/20"
      >
        צא ממצב דמו
        <X className="h-4 w-4 mr-2" />
      </Button>
    </div>
  );
};
