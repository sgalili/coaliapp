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
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useWalletData } from "@/hooks/useWalletData";
import { useToast } from "@/hooks/use-toast";

const WalletPage = () => {
  const { zoozBalance, usdValue, percentageChange, transactions } = useWalletData();
  const { toast } = useToast();
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

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 border-b px-4 py-4">
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