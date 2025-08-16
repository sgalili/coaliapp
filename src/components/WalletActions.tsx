import { CreditCard, MessageSquare, Send, ArrowDownToLine } from "lucide-react";

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
    <div className="px-4 py-6">
      <div className="grid grid-cols-4 gap-4">
        {/* Buy Button */}
        <button 
          onClick={onBuyClick}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-16 h-16 bg-green-500/10 hover:bg-green-500/20 rounded-full flex items-center justify-center transition-colors">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-xs font-medium text-center">קניה</span>
        </button>

        {/* Request Button */}
        <button 
          onClick={onRequestClick}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-16 h-16 bg-blue-500/10 hover:bg-blue-500/20 rounded-full flex items-center justify-center transition-colors">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-center">בקש</span>
        </button>

        {/* Send Button */}
        <button 
          onClick={onSendClick}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-16 h-16 bg-purple-500/10 hover:bg-purple-500/20 rounded-full flex items-center justify-center transition-colors">
            <Send className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-xs font-medium text-center">שלח</span>
        </button>

        {/* Withdraw Button */}
        <button 
          onClick={onWithdrawClick}
          className="flex flex-col items-center gap-2 group opacity-60"
        >
          <div className="w-16 h-16 bg-gray-500/10 hover:bg-gray-500/20 rounded-full flex items-center justify-center transition-colors">
            <ArrowDownToLine className="w-6 h-6 text-gray-600" />
          </div>
          <span className="text-xs font-medium text-center">משיכה</span>
        </button>
      </div>
    </div>
  );
};