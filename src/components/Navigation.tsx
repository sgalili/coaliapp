import { Home, TrendingUp, Crown, User, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

interface NavigationProps {
  zoozBalance?: number;
}

const tabs = [
  { id: 'home', icon: Home, label: 'בית', path: '/' },
  { id: 'news', icon: TrendingUp, label: 'חדשות', path: '/news' },
  { id: 'toptrusted', icon: Crown, label: 'מובילים', path: '/toptrusted' },
  { id: 'wallet', icon: Wallet, label: 'ארנק', path: '/wallet' },
  { id: 'profile', icon: User, label: 'פרופיל', path: '/profile' },
];

export const Navigation = ({ zoozBalance = 0 }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/news')) return 'news';
    if (path.startsWith('/toptrusted')) return 'toptrusted';
    if (path.startsWith('/wallet')) return 'wallet';
    if (path.startsWith('/profile')) return 'profile';
    return 'home';
  };

  const activeTab = getActiveTab();
  const isHomePage = activeTab === 'home';

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 transition-colors duration-300",
      isHomePage 
        ? "bg-black border-t border-gray-800" 
        : "bg-card border-t border-border"
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
                {tab.id === 'wallet' && zoozBalance > 0 && (
                  <div className="absolute -top-2 -right-2 bg-zooz text-zooz-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {zoozBalance > 999 ? '999+' : zoozBalance}
                  </div>
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