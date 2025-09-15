import { PollStory } from "@/components/PollStoryCard";

// Helper function to get future dates
const getFutureDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

const getPastDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const mockPollStories: PollStory[] = [
  {
    id: "1",
    question: "האם להקים פארק חדש ברחוב הרצל?",
    description: "העירייה מציעה להקים פארק משפחות במקום חניון ישן",
    options: [
      { id: "yes", text: "בעד", votes: 847, percentage: 68 },
      { id: "no", text: "נגד", votes: 398, percentage: 32 }
    ],
    totalVotes: 1245,
    backgroundImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=800&fit=crop",
    organizationType: "city",
    organizationName: "עיריית תל אביב",
    publishedDate: getPastDate(5),
    expiresAt: getFutureDate(15),
    aiNarration: "שלום, אני אסביר לכם על החלטת הפארק החדש...",
    prosAndCons: [
      {
        option: "בעד",  
        pros: ["שטח ירוק נוסף", "מקום משחק לילדים", "שיפור איכות החיים"],
        cons: ["פחות מקומות חניה", "עלות גבוהה", "תחזוקה שוטפת"]
      }
    ],
    hasUserVoted: false,
    pollType: "simple"
  },
  {
    id: "2",
    question: "איך לפתור את פקיקות התנועה בעיר?",
    description: "בחרו את הפתרון המועדף עליכם",
    options: [
      { id: "public", text: "חיזוק תחבורה ציבורית", votes: 452, percentage: 45 },
      { id: "bike", text: "הרחבת שבילי אופניים", votes: 291, percentage: 29 },
      { id: "parking", text: "מגבלות חניה מרכז העיר", votes: 167, percentage: 17 },
      { id: "remote", text: "עידוד עבודה מרחוק", votes: 90, percentage: 9 }
    ],
    totalVotes: 1000,
    backgroundVideo: "/public/videos/traffic-bg.mp4",
    organizationType: "city",
    organizationName: "עיריית חיפה",
    publishedDate: getPastDate(8),
    expiresAt: getFutureDate(12),
    aiNarration: "הבה נדון בפתרונות לבעיית התנועה...",
    hasUserVoted: false,
    pollType: "multiple"
  },
  {
    id: "3",
    question: "מי המועמד המועדף עליכם לשר החינוך?",
    description: "בחרו מבין המועמדים הבאים",
    options: [
      { 
        id: "candidate1", 
        text: "ד״ר רחל כהן", 
        votes: 523, 
        percentage: 41,
        avatar: "/src/assets/rachel-profile.jpg",
        city: "תל אביב",
        expertise: ["פדגוגיה", "מדיניות חינוך", "ניהול מערכות"],
        bio: "בעלת ניסיון של 15 שנה בחינוך, התמחות בפיתוח תכניות לימוד חדשניות",
        stats: { trustScore: 8.4, posts: 127, followers: 15400 }
      },
      { 
        id: "candidate2", 
        text: "פרופ׳ יוסי לוי", 
        votes: 398, 
        percentage: 31,
        avatar: "/src/assets/yaakov-profile.jpg",
        city: "ירושלים",
        expertise: ["מחקר חינוכי", "טכנולוגיה בחינוך", "פסיכולוגיה חינוכית"],
        bio: "פרופסור במדעי החינוך, חלוץ בשילוב טכנולוגיה בלמידה",
        stats: { trustScore: 7.9, posts: 89, followers: 12300 }
      },
      { 
        id: "candidate3", 
        text: "ד״ר מירי דוד", 
        votes: 279, 
        percentage: 22,
        avatar: "/src/assets/maya-profile.jpg",
        city: "חיפה",
        expertise: ["חינוך מיוחד", "הכלה", "רב-תרבותיות"],
        bio: "מומחית בחינוך מיוחד וקידום שוויון הזדמנויות בחינוך",
        stats: { trustScore: 8.7, posts: 156, followers: 9800 }
      },
      { id: "candidate4", text: "אחר", votes: 78, percentage: 6 }
    ],
    totalVotes: 1278,
    backgroundImage: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&h=800&fit=crop",
    organizationType: "country",
    organizationName: "מדינת ישראל",
    publishedDate: getPastDate(7),
    expiresAt: getFutureDate(10),
    aiNarration: "בואו נבחן את המועמדים השונים לתפקיד...",
    hasUserVoted: false,
    pollType: "expert"
  },
  {
    id: "4",
    question: "האם לאשר תקציב נוסף לבתי ספר?",
    description: "התקציב יועבר לשיפור מתקנים ולמוע מורים",
    options: [
      { id: "approve", text: "לאשר התקציב", votes: 1789, percentage: 72 },
      { id: "reject", text: "לדחות ההצעה", votes: 695, percentage: 28 }
    ],
    totalVotes: 2484,
    backgroundImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=800&fit=crop",
    organizationType: "foundation",
    organizationName: "קרן החינוך",
    publishedDate: getPastDate(10),
    expiresAt: getFutureDate(5),
    aiNarration: "נדון בחשיבות השקעה בחינוך...",
    hasUserVoted: true,
    userVotedOption: "approve",
    pollType: "simple"
  },
  {
    id: "5",
    question: "איזה פרויקט סביבתי לקדם השנה?",
    description: "החברה מחליטה על פרויקט הקיימות הבא",
    options: [
      { id: "solar", text: "פאנלים סולריים", votes: 234, percentage: 38 },
      { id: "recycling", text: "מערכת מיחזור", votes: 187, percentage: 30 },
      { id: "garden", text: "גינה קהילתית", votes: 134, percentage: 22 },
      { id: "water", text: "חיסכון במים", votes: 61, percentage: 10 }
    ],
    totalVotes: 616,
    backgroundImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=800&fit=crop",
    organizationType: "company",
    organizationName: "טבע פארמצבטיקל",
    publishedDate: getPastDate(12),
    expiresAt: getFutureDate(3),
    aiNarration: "כל פרויקט סביבתי יש לו יתרונות...",
    hasUserVoted: false,
    pollType: "multiple"
  }
];