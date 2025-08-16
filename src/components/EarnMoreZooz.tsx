import { ChevronLeft, Users, MessageCircle, FileText, Shield } from "lucide-react";
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
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">גלה איך להרוויח יותר Zooz</h3>
        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <div className="space-y-3">
        {rewardItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => onRewardClick(item.id)}
            className="w-full justify-between p-3 h-auto text-right"
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
          </Button>
        ))}
      </div>
    </Card>
  );
};