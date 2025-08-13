import News from "./News";
import { Navigation } from "@/components/Navigation";

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <News />
      <Navigation 
        activeTab="trending" 
        onTabChange={() => {}} // Navigation will be handled by routing
        zoozBalance={1250}
      />
    </div>
  );
};

export default NewsPage;