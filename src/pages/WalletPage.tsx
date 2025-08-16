import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { WalletBalance } from "@/components/WalletBalance";
import { WalletActions } from "@/components/WalletActions";
import { EarnMoreZooz } from "@/components/EarnMoreZooz";
import { TransactionHistory } from "@/components/TransactionHistory";
import { useWalletData } from "@/hooks/useWalletData";
import { useToast } from "@/hooks/use-toast";

const WalletPage = () => {
  const { zoozBalance, usdValue, percentageChange, transactions } = useWalletData();
  const { toast } = useToast();

  const handleBuyClick = () => {
    toast({
      title: "קניית ZOOZ",
      description: "פתיחת ממשק קנייה...",
    });
  };

  const handleRequestClick = () => {
    toast({
      title: "בקשת ZOOZ",
      description: "יצירת קישור בקשה...",
    });
  };

  const handleSendClick = () => {
    toast({
      title: "שליחת ZOOZ",
      description: "פתיחת ממשק שליחה...",
    });
  };

  const handleWithdrawClick = () => {
    toast({
      title: "משיכה",
      description: "זמין בקרוב!",
      variant: "destructive",
    });
  };

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
        <h1 className="text-xl font-bold text-center">ארנק ZOOZ</h1>
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
    </div>
  );
};

export default WalletPage;