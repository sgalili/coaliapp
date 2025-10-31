import { useState } from "react";
import { ChevronDown, Users, MessageCircle, FileText, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface EarnMoreZoozProps {
  onRewardClick: (type: string) => void;
}

const rewardItems = [
  {
    id: "referral",
    icon: Users,
    title: "הזמן חברים",
    description: "5Z לדור ראשון, 2Z לשני, 1Z לשלישי",
    reward: "עד 8Z",
    color: "text-blue-500"
  },
  {
    id: "comments",
    icon: MessageCircle,
    title: "הגב על חדשות",
    description: "כתוב תגובות איכותיות",
    reward: "10Z",
    color: "text-green-500"
  },
  {
    id: "surveys",
    icon: FileText,
    title: "השתתף בסקרים",
    description: "עזור לנו לשפר את האפליקציה",
    reward: "1Z",
    color: "text-purple-500"
  },
  {
    id: "kyc",
    icon: Shield,
    title: "אימות KYC",
    description: "רמה 2/3 - עד 20Z",
    reward: "10Z",
    color: "text-orange-500"
  }
];

export const EarnMoreZooz = ({ onRewardClick }: EarnMoreZoozProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="px-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 px-4 text-right bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-colors"
      >
        <h3 className="text-lg font-semibold">גלה איך להרוויח יותר זוז</h3>
        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {rewardItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onRewardClick(item.id)}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-background ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </div>
              <div className="text-primary font-bold text-sm">{item.reward}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};