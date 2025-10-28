import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { WalletBalance } from "@/components/WalletBalance";
import { WalletActions } from "@/components/WalletActions";
import { EarnMoreZooz } from "@/components/EarnMoreZooz";
import { TransactionHistory } from "@/components/TransactionHistory";
import { BuyZoozModal } from "@/components/BuyZoozModal";
import { SendZoozModal } from "@/components/SendZoozModal";
import { RequestZoozModal } from "@/components/RequestZoozModal";
import { WithdrawModal } from "@/components/WithdrawModal";
import { WalletSettings } from "@/components/WalletSettings";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useWalletData } from "@/hooks/useWalletData";
import { useToast } from "@/hooks/use-toast";
import { useIsDemoMode } from "@/hooks/useIsDemoMode";

const WalletPage = () => {
  const { zoozBalance, usdValue, percentageChange, transactions } = useWalletData();
  const { toast } = useToast();
  const { isDemoMode } = useIsDemoMode();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleBuyClick = () => setShowBuyModal(true);
  const handleRequestClick = () => setShowRequestModal(true);
  const handleSendClick = () => setShowSendModal(true);
  const handleWithdrawClick = () => setShowWithdrawModal(true);

  const handleRewardClick = (type: string) => {
    const rewardTitles: Record<string, string> = {
      referral: "הזמנת חברים",
      comments: "תגובות על חדשות", 
      surveys: "סקרים",
      kyc: "אימות KYC"
    };
    
    toast({
      title: rewardTitles[type],
      description: "פתיחת מידע נוסף...",
    });
  };

  // Calculate stats from transactions
  const totalEarned = transactions
    .filter(tx => ['reward', 'receive'].includes(tx.type))
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalSent = transactions
    .filter(tx => tx.type === 'send')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalReceived = transactions
    .filter(tx => tx.type === 'receive')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const thisMonth = transactions
    .filter(tx => {
      const txDate = new Date(tx.timestamp);
      const now = new Date();
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, tx) => {
      if (tx.type === 'send' || tx.type === 'withdrawal' || tx.type === 'purchase') {
        return sum - tx.amount;
      }
      return sum + tx.amount;
    }, 0);

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Demo Mode Banner */}
      <DemoModeBanner />
      
      {/* Header */}
      <div className={`sticky ${isDemoMode ? 'top-12' : 'top-0'} bg-background z-10 border-b px-4 py-4`}>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettingsModal(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">ארנק ZOOZ</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-4 pb-24">
          {/* Balance Card */}
          <WalletBalance 
            zoozBalance={zoozBalance}
            usdValue={usdValue}
            percentageChange={percentageChange}
          />

          {/* Action Buttons */}
          <WalletActions
            onBuyClick={handleBuyClick}
            onRequestClick={handleRequestClick}
            onSendClick={handleSendClick}
            onWithdrawClick={handleWithdrawClick}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="text-xs text-muted-foreground mb-1">סה"כ הרווחת</div>
              <div className="text-xl font-bold text-green-600">{totalEarned.toLocaleString()}Z</div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="text-xs text-muted-foreground mb-1">סה"כ שלחת</div>
              <div className="text-xl font-bold text-red-600">{totalSent.toLocaleString()}Z</div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="text-xs text-muted-foreground mb-1">סה"כ קיבלת</div>
              <div className="text-xl font-bold text-blue-600">{totalReceived.toLocaleString()}Z</div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="text-xs text-muted-foreground mb-1">החודש</div>
              <div className={`text-xl font-bold ${thisMonth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {thisMonth >= 0 ? '+' : ''}{thisMonth.toLocaleString()}Z
              </div>
            </div>
          </div>

          {/* Earn More Section */}
          <EarnMoreZooz onRewardClick={handleRewardClick} />

          {/* Transaction History */}
          <TransactionHistory transactions={transactions} />
        </div>
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={Math.floor(zoozBalance)} />

      {/* Modals */}
      <BuyZoozModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} />
      <SendZoozModal 
        isOpen={showSendModal} 
        onClose={() => setShowSendModal(false)} 
        currentBalance={zoozBalance}
      />
      <RequestZoozModal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} />
      <WithdrawModal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} />
      <WalletSettings isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </div>
  );
};

export default WalletPage;