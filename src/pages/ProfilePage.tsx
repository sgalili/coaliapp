import { Navigation } from "@/components/Navigation";

const ProfilePage = () => {
  const zoozBalance = 1250;

  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">הפרופיל שלך</h2>
          <p className="text-muted-foreground">נהל את רשת האמון שלך</p>
        </div>
      </div>
      <Navigation zoozBalance={zoozBalance} />
    </div>
  );
};

export default ProfilePage;