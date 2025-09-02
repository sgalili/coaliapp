import { useState } from "react";
import { CandidateCard, Candidate } from "./CandidateCard";
import { PollCard, Poll } from "./PollCard";
import { FullscreenVideoPlayer } from "./FullscreenVideoPlayer";

// Import profile images
import netanyahuProfile from "@/assets/netanyahu-profile.jpg";
import yaronProfile from "@/assets/yaron-zelekha-profile.jpg";
import sarahProfile from "@/assets/sarah-profile.jpg";
import yaakovProfile from "@/assets/yaakov-profile.jpg";
import mayaProfile from "@/assets/maya-profile.jpg";

interface VideoComment {
  id: string;
  userId: string;
  username: string;
  userImage?: string;
  videoUrl: string;
  duration: number;
  likes: number;
  replies: number;
  trustLevel: number;
  timestamp: string;
  category: string;
  kycLevel: 1 | 2 | 3;
  watchCount?: number;
  shareCount?: number;
}

export type VoteFilterType = 'for-me' | 'candidates' | 'experts' | 'all';

interface VoteFeedProps {
  filter: VoteFilterType;
}

// Mock candidates data
const mockCandidates: Candidate[] = [
  {
    id: "c1",
    name: "בנימין נתניהו",
    position: "ראש הממשלה",
    city: "ירושלים",
    avatar: netanyahuProfile,
    videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755817615/netanyahu-debate_fitgzh.mp4",
    expertise: ["מדיניות", "ביטחון", "כלכלה"],
    voteCount: 89420,
    supporterCount: 234567,
    hasUserVoted: false,
    isVerified: true,
    program: "המשך החזקת הביטחון הלאומי ופיתוח כלכלי מתקדם. חיזוק הקשרים הבינלאומיים ושמירה על הערכים היהודיים והדמוקרטיים של המדינה."
  },
  {
    id: "c2", 
    name: "ירון זליכה",
    position: "כלכלן ראשי",
    city: "תל אביב",
    avatar: yaronProfile,
    videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755818123/%D7%90%D7%96_%D7%9E%D7%94_%D7%90%D7%AA%D7%94_%D7%91%D7%A2%D7%A6%D7%9D_%D7%9E%D7%A6%D7%99%D7%A2__jb7xb0.mp4",
    expertise: ["כלכלה", "השקעות", "מדיניות פיסקלית"],
    voteCount: 45230,
    supporterCount: 89456,
    hasUserVoted: false,
    isVerified: true,
    program: "רפורמה כלכלית מקיפה, הקלות מס למעמד הבינוני, פיתוח תשתיות טכנולוגיות וחיזוק התחרותיות הישראלית בשוק העולמי."
  },
  {
    id: "c3",
    name: "שרה כהן",
    position: "מומחית דמוקרטיה דיגיטלית",
    city: "חיפה", 
    avatar: sarahProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    expertise: ["טכנולוגיה", "דמוקרטיה", "חדשנות"],
    voteCount: 23150,
    supporterCount: 45678,
    hasUserVoted: true,
    isVerified: true,
    program: "דיגיטציה של השירותים הממשלתיים, הטמעת בלוקצ'יין בהצבעות, ושיפור השקיפות והנגישות הדמוקרטית באמצעות טכנולוגיה."
  }
];

// Mock polls data
const mockPolls: Poll[] = [
  {
    id: "p1",
    question: "האם אתה תומך בהעברת הכנסת לתל אביב?",
    description: "השאלה עוסקת בהעברת מקום ישיבות הכנסת מירושלים לתל אביב בכדי להתמודד עם עומסי התנועה ולשפר נגישות.",
    options: [
      { id: "o1", text: "בעד - העברה לתל אביב", votes: 12450, percentage: 45 },
      { id: "o2", text: "נגד - להשאיר בירושלים", votes: 10890, percentage: 40 },
      { id: "o3", text: "אין לי דעה", votes: 4110, percentage: 15 }
    ],
    totalVotes: 27450,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    category: "מדיניות",
    hasUserVoted: false
  },
  {
    id: "p2", 
    question: "איזה נושא הכי חשוב לך בבחירות הקרובות?",
    description: "רנקינג הנושאים החשובים ביותר לציבור הישראלי קראת בחירות 2024.",
    options: [
      { id: "o1", text: "ביטחון ומדיניות חוץ", votes: 18930, percentage: 35 },
      { id: "o2", text: "כלכלה ויוקר המחיה", votes: 16200, percentage: 30 },
      { id: "o3", text: "חינוך ורווחה", votes: 10800, percentage: 20 },
      { id: "o4", text: "איכות הסביבה", votes: 8100, percentage: 15 }
    ],
    totalVotes: 54030,
    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    category: "כללי",
    hasUserVoted: true,
    userVotedOption: "o2"
  }
];

export const VoteFeed = ({ filter }: VoteFeedProps) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoComment | null>(null);

  const handleCandidateVideoClick = (candidate: Candidate) => {
    // Convert candidate to VideoComment format for the player
    const videoComment: VideoComment = {
      id: candidate.id,
      userId: candidate.id,
      username: candidate.name,
      userImage: candidate.avatar,
      videoUrl: candidate.videoUrl,
      duration: 180, // Mock duration
      likes: candidate.voteCount,
      replies: Math.floor(candidate.voteCount * 0.1),
      trustLevel: candidate.supporterCount,
      timestamp: "לפני שעה",
      category: candidate.expertise[0] || "פוליטיקה",
      kycLevel: 3,
      watchCount: candidate.supporterCount,
      shareCount: Math.floor(candidate.voteCount * 0.2)
    };
    
    setSelectedVideo(videoComment);
  };

  const handleVote = (candidateId: string) => {
    // Mock vote logic - in real app would update backend
    console.log(`Voted for candidate: ${candidateId}`);
  };

  const handlePollVote = (pollId: string, optionId: string) => {
    // Mock poll vote logic - in real app would update backend
    console.log(`Voted in poll ${pollId} for option: ${optionId}`);
  };

  const getFilteredContent = () => {
    switch (filter) {
      case 'candidates':
        return { candidates: mockCandidates, polls: [] };
      case 'experts':
        return { candidates: mockCandidates.filter(c => c.expertise.includes('טכנולוגיה')), polls: [] };
      case 'for-me':
        return { 
          candidates: mockCandidates.slice(0, 2), 
          polls: mockPolls.slice(0, 1) 
        };
      case 'all':
      default:
        return { candidates: mockCandidates, polls: mockPolls };
    }
  };

  const { candidates, polls } = getFilteredContent();

  // Mix candidates and polls for display
  const mixedContent = [];
  const maxItems = Math.max(candidates.length, polls.length);
  
  for (let i = 0; i < maxItems; i++) {
    if (i < candidates.length) {
      mixedContent.push({ type: 'candidate', data: candidates[i] });
    }
    if (i < polls.length) {
      mixedContent.push({ type: 'poll', data: polls[i] });
    }
  }

  return (
    <>
      {/* Main Feed - Full Width */}
      <div className="pt-32 pb-20 w-full min-h-screen bg-background">
        {mixedContent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🗳️</div>
            <h3 className="text-lg font-semibold mb-2">אין תוכן להצבעה כרגע</h3>
            <p className="text-muted-foreground">נסה לשנות את הפילטר או לחזור מאוחר יותר</p>
          </div>
        ) : (
          <div className="space-y-0">
            {mixedContent.map((item, index) => (
              <div key={`${item.type}-${item.data.id}-${index}`}>
                {item.type === 'candidate' ? (
                  <CandidateCard
                    candidate={item.data as Candidate}
                    onVideoClick={handleCandidateVideoClick}
                    onVote={handleVote}
                  />
                ) : (
                  <PollCard
                    poll={item.data as Poll}
                    onVote={handlePollVote}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Video Player */}
      {selectedVideo && (
        <FullscreenVideoPlayer
          comments={[selectedVideo]}
          initialCommentIndex={0}
          onClose={() => setSelectedVideo(null)}
          onTrust={(id) => console.log('Trust:', id)}
          onWatch={(id) => console.log('Watch:', id)}
          onComment={(id) => console.log('Comment:', id)}
          onShare={(id) => console.log('Share:', id)}
        />
      )}
    </>
  );
};