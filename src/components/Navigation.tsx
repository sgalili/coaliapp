import { Link, useLocation } from "react-router-dom";
import { Home, TrendingUp, MessageCircle, User, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  zoozBalance: number;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Navigation = ({ zoozBalance, activeTab, onTabChange }: NavigationProps) => {
  const location = useLocation();
  
  // Determine active tab from route if not provided
  const currentTab = activeTab || (() => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/news') return 'trending';
    if (path === '/messages') return 'messages';
    if (path === '/wallet') return 'wallet';
    if (path === '/profile') return 'profile';
    return 'home';
  })();

  const navItems = [
    { id: "home", icon: Home, label: "בית", path: "/" },
    { id: "trending", icon: TrendingUp, label: "מגמות", path: "/news" },
    { id: "messages", icon: MessageCircle, label: "הודעות", path: "/messages" },
    { id: "wallet", icon: Wallet, label: "ארנק", path: "/wallet" },
    { id: "profile", icon: User, label: "פרופיל", path: "/profile" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 transition-colors ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.id === "wallet" && (
                <span className="text-xs text-zooz font-bold">{zoozBalance}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};