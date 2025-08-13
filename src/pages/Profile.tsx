import { Navigation } from "@/components/Navigation";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">הפרופיל שלך</h2>
          <p className="text-muted-foreground">נהל את רשת האמון שלך</p>
        </div>
      </div>
      <Navigation 
        activeTab="profile" 
        onTabChange={() => {}} // Navigation will be handled by routing
        zoozBalance={1250}
      />
    </div>
  );
};

export default Profile;