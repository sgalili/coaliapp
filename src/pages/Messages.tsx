import { Navigation } from "@/components/Navigation";

const Messages = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">הודעות</h2>
          <p className="text-muted-foreground">התחבר עם חברים מהימנים</p>
        </div>
      </div>
      <Navigation 
        activeTab="messages" 
        onTabChange={() => {}} // Navigation will be handled by routing
        zoozBalance={1250}
      />
    </div>
  );
};

export default Messages;