import { Home, Crown, User, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { ImpactIcon } from "./ImpactIcon";

interface NavigationProps {
  zoozBalance?: number;
  show?: boolean;
}

const tabs = [
  { id: 'home', icon: Home, label: 'בית', path: '/' },
  { id: 'impact', icon: ImpactIcon, label: 'אימפקט', path: '/impact' },
  { id: 'toptrusted', icon: Crown, label: 'מובילים', path: '/toptrusted' },
  { id: 'wallet', icon: Wallet, label: 'ארנק', path: '/wallet' },
  { id: 'profile', icon: User, label: 'פרופיל', path: '/profile' },
];

export const Navigation = ({ zoozBalance = 0, show = true }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/impact')) return 'impact';
    if (path.startsWith('/news')) return 'impact'; // Keep news pages under impact tab
    if (path.startsWith('/toptrusted')) return 'toptrusted';
    if (path.startsWith('/wallet')) return 'wallet';
    if (path.startsWith('/profile')) return 'profile';
    return 'home';
  };

  const activeTab = getActiveTab();
  const isHomePage = activeTab === 'home';

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 transition-all duration-300",
      isHomePage 
        ? "bg-black border-t border-gray-800" 
        : "bg-card border-t border-border",
      !show && "translate-y-full"
    )}>
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 min-w-0 flex-1 relative",
                "transition-colors duration-200"
              )}
            >
              <div className="relative">
                {tab.id === 'impact' ? (
                  <ImpactIcon 
                    className={cn(
                      "w-6 h-6 transition-colors",
                      isActive 
                        ? "text-primary" 
                        : isHomePage 
                          ? "text-white" 
                          : "text-muted-foreground"
                    )} 
                    isActive={isActive}
                  />
                ) : (
                  <IconComponent 
                    className={cn(
                      "w-6 h-6 transition-colors",
                      isActive 
                        ? "text-primary" 
                        : isHomePage 
                          ? "text-white" 
                          : "text-muted-foreground"
                    )} 
                  />
                )}
              </div>
              <span className={cn(
                "text-xs transition-colors",
                isActive 
                  ? "text-primary font-medium" 
                  : isHomePage 
                    ? "text-white" 
                    : "text-muted-foreground"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};