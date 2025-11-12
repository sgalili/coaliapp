import { useState } from "react";
import { ImpactItemComponent } from "@/components/ImpactItem";
import { ImpactFilters } from "@/components/ImpactFilters";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";

// Import profile images for mock data
import sarahProfile from "@/assets/sarah-profile.jpg";
import davidProfile from "@/assets/david-profile.jpg";
import mayaProfile from "@/assets/maya-profile.jpg";
import amitProfile from "@/assets/amit-profile.jpg";
import rachelProfile from "@/assets/rachel-profile.jpg";
import netanyahuProfile from "@/assets/netanyahu-profile.jpg";
import noaProfile from "@/assets/noa-profile.jpg";
import warrenProfile from "@/assets/warren-buffett-profile.jpg";
import yaronProfile from "@/assets/yaron-profile.jpg";
import yaronZelekhaProfile from "@/assets/yaron-zelekha-profile.jpg";
import yaakovProfile from "@/assets/yaakov-profile.jpg";

// Mock impact data
const mockImpacts = [
  {
    id: "impact-1",
    type: "decision" as const,
    title: "תמך בהצעת תקציב החינוך - השפיע על 234 משתמשים",
    description: "החלטה קריטית שעזרה למאות משתמשים להבין את ההשלכות של תקציב החינוך החדש והשפעתו על העתיד",
    thumbnail: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=200&fit=crop",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: "פוליטיקה",
    source: "Coali Trust Network",
    impactValue: 2340,
    delegatedVotes: 234,
    totalVotes: 1500,
    outcome: "אושרה",
    comments: [
      {
        id: "comment-1",
        userId: "1",
        username: "דוד לוי",
        userImage: davidProfile,
        videoUrl: "mock-video-1",
        duration: 45,
        likes: 234,
        replies: 45,
        trustLevel: 2340,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        category: "פוליטיקה",
        kycLevel: 3 as const
      },
      {
        id: "comment-2",
        userId: "2",
        username: "שרה כהן",
        userImage: sarahProfile,
        videoUrl: "mock-video-2",
        duration: 32,
        likes: 156,
        replies: 28,
        trustLevel: 1890,
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        category: "פוליטיקה",
        kycLevel: 2 as const
      },
      {
        id: "comment-3",
        userId: "3",
        username: "בנימין נתניהו",
        userImage: netanyahuProfile,
        videoUrl: "mock-video-3",
        duration: 58,
        likes: 567,
        replies: 89,
        trustLevel: 4560,
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        category: "פוליטיקה",
        kycLevel: 3 as const
      },
      {
        id: "comment-4",
        userId: "4",
        username: "ירון זליכה",
        userImage: yaronZelekhaProfile,
        videoUrl: "mock-video-4",
        duration: 41,
        likes: 289,
        replies: 52,
        trustLevel: 3120,
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        category: "פוליטיקה",
        kycLevel: 3 as const
      },
      {
        id: "comment-5",
        userId: "5",
        username: "יעקב אליעזרוב",
        userImage: yaakovProfile,
        videoUrl: "mock-video-5",
        duration: 35,
        likes: 178,
        replies: 31,
        trustLevel: 2450,
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        category: "פוליטיקה",
        kycLevel: 2 as const
      }
    ]
  },
  {
    id: "impact-2",
    type: "trust" as const,
    title: "קיבל אמון מ-45 משתמשים חדשים בתחום הכלכלה",
    description: "הפך למומחה מהימן בתחום הכלכלה והשקעות, משתמשים רבים מאצילים לו כוח הצבעה בנושאים כלכליים",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    category: "כלכלה",
    source: "Coali Trust Network",
    impactValue: 2250,
    comments: [
      {
        id: "comment-6",
        userId: "6",
        username: "וורן באפט",
        userImage: warrenProfile,
        videoUrl: "mock-video-6",
        duration: 52,
        likes: 892,
        replies: 134,
        trustLevel: 8920,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        category: "כלכלה",
        kycLevel: 3 as const
      },
      {
        id: "comment-7",
        userId: "7",
        username: "ירון לונדון",
        userImage: yaronProfile,
        videoUrl: "mock-video-7",
        duration: 38,
        likes: 445,
        replies: 67,
        trustLevel: 4230,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        category: "כלכלה",
        kycLevel: 3 as const
      },
      {
        id: "comment-8",
        userId: "8",
        username: "רחל גולד",
        userImage: rachelProfile,
        videoUrl: "mock-video-8",
        duration: 29,
        likes: 234,
        replies: 41,
        trustLevel: 2890,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        category: "כלכלה",
        kycLevel: 2 as const
      }
    ]
  },
  {
    id: "impact-3",
    type: "vote" as const,
    title: "השפיע על 120 קולות בהצבעה על מיסוי הייטק",
    description: "דעתו המקצועית שינתה את תוצאות ההצבעה והשפיעה על החלטה קריטית בנושא מיסוי חברות הייטק",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: "טכנולוגיה",
    source: "Coali Trust Network",
    impactValue: 600,
    delegatedVotes: 120,
    totalVotes: 450,
    outcome: "השפעה גבוהה",
    comments: [
      {
        id: "comment-9",
        userId: "9",
        username: "מיה רוזן",
        userImage: mayaProfile,
        videoUrl: "mock-video-9",
        duration: 31,
        likes: 123,
        replies: 19,
        trustLevel: 1560,
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        category: "טכנולוגיה",
        kycLevel: 2 as const
      },
      {
        id: "comment-10",
        userId: "10",
        username: "עמית שטיין",
        userImage: amitProfile,
        videoUrl: "mock-video-10",
        duration: 27,
        likes: 98,
        replies: 15,
        trustLevel: 1120,
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
        category: "טכנולוגיה",
        kycLevel: 1 as const
      }
    ]
  },
  {
    id: "impact-4",
    type: "achievement" as const,
    title: "הגיע ל-1000 עוקבים והפך למומחה בעל השפעה",
    description: "השיג ציון אמון גבוה והפך לאחד המומחים המשפיעים ביותר בתחום הבריאות והתזונה",
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: "בריאות",
    source: "Coali Trust Network",
    impactValue: 500,
    outcome: "הישג חדש",
    comments: [
      {
        id: "comment-11",
        userId: "11",
        username: "נועה קירל",
        userImage: noaProfile,
        videoUrl: "mock-video-11",
        duration: 24,
        likes: 567,
        replies: 78,
        trustLevel: 3450,
        timestamp: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
        category: "בריאות",
        kycLevel: 2 as const
      }
    ]
  },
  {
    id: "impact-5",
    type: "decision" as const,
    title: "תמך ברפורמת תחבורה - עזר ל-180 משתמשים להחליט",
    description: "עזר למשתמשים רבים להבין את ההשלכות של רפורמת התחבורה הציבורית ולקבל החלטה מושכלת",
    thumbnail: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: "תחבורה",
    source: "Coali Trust Network",
    impactValue: 1800,
    delegatedVotes: 180,
    totalVotes: 890,
    outcome: "נדחתה",
    comments: []
  }
];

const ImpactPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();

  const getFilteredImpacts = () => {
    if (activeFilter === "all") return mockImpacts;
    
    if (activeFilter === "trending") {
      // Show impacts with most trusted comments
      return [...mockImpacts].sort((a, b) => {
        const aTrustSum = a.comments.reduce((sum, comment) => sum + comment.trustLevel, 0);
        const bTrustSum = b.comments.reduce((sum, comment) => sum + comment.trustLevel, 0);
        return bTrustSum - aTrustSum;
      });
    }

    return mockImpacts.filter(impact => impact.type === activeFilter);
  };

  const handleImpactClick = (impactId: string) => {
    toast({
      title: "פותח אירוע השפעה",
      description: "מעבר לפרטי האירוע המלא...",
    });
  };

  const handleProfileClick = (impactId: string, comment: any) => {
    toast({
      title: "מפעיל תגובת וידאו",
      description: `מפעיל את התגובה של ${comment.username}`,
    });
  };

  return (
    <div className="h-screen bg-slate-100 overflow-hidden">
      {/* Filters */}
      <ImpactFilters 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Impact Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-20">
          {getFilteredImpacts().map((impactItem) => (
            <ImpactItemComponent
              key={impactItem.id}
              item={impactItem}
              onImpactClick={handleImpactClick}
              onProfileClick={handleProfileClick}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default ImpactPage;
