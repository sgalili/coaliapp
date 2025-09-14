import { PollStory } from "@/components/PollStoryCard";

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
    aiNarration: "הבה נדון בפתרונות לבעיית התנועה...",
    hasUserVoted: false,
    pollType: "multiple"
  },
  {
    id: "3",
    question: "מי המועמד המועדף עליכם לשר החינוך?",
    description: "בחרו מבין המועמדים הבאים",
    options: [
      { id: "candidate1", text: "ד״ר רחל כהן", votes: 523, percentage: 41 },
      { id: "candidate2", text: "פרופ׳ יוסי לוי", votes: 398, percentage: 31 },
      { id: "candidate3", text: "ד״ר מירי דוד", votes: 279, percentage: 22 },
      { id: "candidate4", text: "אחר", votes: 78, percentage: 6 }
    ],
    totalVotes: 1278,
    backgroundImage: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&h=800&fit=crop",
    organizationType: "country",
    organizationName: "מדינת ישראל",
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
    aiNarration: "כל פרויקט סביבתי יש לו יתרונות...",
    hasUserVoted: false,
    pollType: "multiple"
  }
];