import { Navigation } from "@/components/Navigation";

const Wallet = () => {
  const zoozBalance = 1250;

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">ארנק ZOOZ</h2>
          <div className="text-4xl font-bold text-zooz mb-2">{zoozBalance}</div>
          <p className="text-muted-foreground">אסימוני ZOOZ</p>
        </div>
      </div>
      <Navigation 
        activeTab="wallet" 
        onTabChange={() => {}} // Navigation will be handled by routing
        zoozBalance={zoozBalance}
      />
    </div>
  );
};

export default Wallet;