import { ShoppingCart, MessageSquare, Send, ArrowDownToLine } from "lucide-react";
import { Button } from "./ui/button";

interface WalletActionsProps {
  onBuyClick: () => void;
  onRequestClick: () => void;
  onSendClick: () => void;
  onWithdrawClick: () => void;
}

export const WalletActions = ({
  onBuyClick,
  onRequestClick,
  onSendClick,
  onWithdrawClick
}: WalletActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      <Button 
        onClick={onBuyClick}
        className="flex flex-col gap-2 h-20 bg-primary hover:bg-primary/90"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="text-sm font-medium">קניה</span>
      </Button>
      
      <Button 
        onClick={onRequestClick}
        variant="outline"
        className="flex flex-col gap-2 h-20"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-sm font-medium">בקש</span>
      </Button>
      
      <Button 
        onClick={onSendClick}
        variant="outline"
        className="flex flex-col gap-2 h-20"
      >
        <Send className="w-5 h-5" />
        <span className="text-sm font-medium">שלח</span>
      </Button>
      
      <Button 
        onClick={onWithdrawClick}
        variant="outline"
        className="flex flex-col gap-2 h-20 opacity-60"
      >
        <ArrowDownToLine className="w-5 h-5" />
        <span className="text-sm font-medium">משיכה</span>
      </Button>
    </div>
  );
};