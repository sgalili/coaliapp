import { Home, TrendingUp, MessageCircle, User, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  zoozBalance?: number;
}

const tabs = [
  { id: 'home', icon: Home, label: 'בית' },
  { id: 'trending', icon: TrendingUp, label: 'פופולרי' },
  { id: 'messages', icon: MessageCircle, label: 'הודעות' },
  { id: 'wallet', icon: Wallet, label: 'ארנק' },
  { id: 'profile', icon: User, label: 'פרופיל' },
];

export const Navigation = ({ activeTab, onTabChange, zoozBalance = 0 }: NavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 min-w-0 flex-1 relative",
                "transition-colors duration-200"
              )}
            >
              <div className="relative">
                <IconComponent 
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
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
                isActive ? "text-primary font-medium" : "text-muted-foreground"
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