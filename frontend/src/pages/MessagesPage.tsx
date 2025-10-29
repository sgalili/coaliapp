import { Navigation } from "@/components/Navigation";

const MessagesPage = () => {
  const zoozBalance = 1250;

  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">הודעות</h2>
          <p className="text-muted-foreground">התחבר עם חברים מהימנים</p>
        </div>
      </div>
      <Navigation zoozBalance={zoozBalance} />
    </div>
  );
};

export default MessagesPage;