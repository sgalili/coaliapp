import { useState } from "react";
import { CandidateCard, type Candidate } from "./CandidateCard";
import { PollCard, type Poll } from "./PollCard";
import { FullscreenVideoPlayer } from "./FullscreenVideoPlayer";

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

// Mock data for candidates
import sarahProfile from "@/assets/sarah-profile.jpg";
import yaakovProfile from "@/assets/yaakov-profile.jpg";
import mayaProfile from "@/assets/maya-profile.jpg";
import amitProfile from "@/assets/amit-profile.jpg";
import rachelProfile from "@/assets/rachel-profile.jpg";
import noaProfile from "@/assets/noa-profile.jpg";
import netanyahuProfile from "@/assets/netanyahu-profile.jpg";
import yaronProfile from "@/assets/yaron-zelekha-profile.jpg";

interface VoteFeedProps {
  filter: 'for-me' | 'candidates' | 'experts' | 'all';
}

const mockCandidates: Candidate[] = [
  {
    id: "cand-1",
    name: "בנימין נתניהו",
    position: "ראש ממשלה",
    city: "ירושלים",
    avatar: netanyahuProfile,
    videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755817615/netanyahu-debate_fitgzh.mp4",
    expertise: ["פוליטיקה", "ביטחון", "דיפלומטיה"],
    voteCount: 89420,
    supporterCount: 125560,
    hasUserVoted: false,
    isVerified: true,
    program: "חיזוק הביטחון הלאומי והמשך הקפיצה הטכנולוגית של ישראל במזרח התיכון החדש"
  },
  {
    id: "cand-2", 
    name: "ירון זליכה",
    position: "מומחה כלכלה",
    city: "תל-אביב",
    avatar: yaronProfile,
    videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755818123/%D7%90%D7%96_%D7%9E%D7%94_%D7%90%D7%AA%D7%94_%D7%91%D7%A2%D7%A6%D7%9D_%D7%9E%D7%A6%D7%99%D7%A2__jb7xb0.mp4",
    expertise: ["כלכלה", "פיננסים", "השקעות"],
    voteCount: 2847,
    supporterCount: 4156,
    hasUserVoted: true,
    isVerified: true,
    program: "רפורמה כלכלית מקיפה, הורדת מחירי המחיה וחיזוק השקל מול המטבעות העולמיים"
  },
  {
    id: "cand-3",
    name: "שרה כהן",
    position: "מומחת חינוך",
    city: "חיפה", 
    avatar: sarahProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    expertise: ["חינוך", "טכנולוגיה", "חדשנות"],
    voteCount: 1247,
    supporterCount: 856,
    hasUserVoted: false,
    isVerified: true,
    program: "דיגיטציה של מערכת החינוך ושילוב בינה מלאכותית בכיתות הלימוד"
  },
  {
    id: "cand-4",
    name: "מיה רוזן",
    position: "מומחת סביבה",
    city: "באר שבע",
    avatar: mayaProfile,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    expertise: ["סביבה", "אקלים", "קיימות"],
    voteCount: 456,
    supporterCount: 621,
    hasUserVoted: false,
    isVerified: false,
    program: "מעבר לאנרגיות מתחדשות ויצירת כלכלה ירוקה ברחבי ישראל"
  }
];

const mockPolls: Poll[] = [
  {
    id: "poll-1",
    question: "מה דעתכם על מס השבח החדש?",
    description: "הממשלה מציעה להעלות את מס השבח ל-30%. האם אתם תומכים?",
    options: [
      { id: "opt-1", text: "תומך מאוד", votes: 1240, percentage: 15 },
      { id: "opt-2", text: "תומך במידה מסוימת", votes: 2480, percentage: 30 },
      { id: "opt-3", text: "מתנגד", votes: 2890, percentage: 35 },
      { id: "opt-4", text: "מתנגד בתוקף", votes: 1650, percentage: 20 }
    ],
    totalVotes: 8260,
    endDate: "2024-12-31T23:59:59",
    category: "כלכלה",
    hasUserVoted: false
  },
  {
    id: "poll-2",
    question: "איך לשפר את מערכת החינוך?",
    description: "מה השינוי החשוב ביותר שנדרש במערכת החינוך הישראלית?",
    options: [
      { id: "opt-1", text: "הקטנת כיתות", votes: 3420, percentage: 45 },
      { id: "opt-2", text: "שיפור שכר המורים", votes: 2280, percentage: 30 },
      { id: "opt-3", text: "שילוב טכנולוגיה", votes: 1140, percentage: 15 },
      { id: "opt-4", text: "שינוי תכנית הלימודים", votes: 760, percentage: 10 }
    ],
    totalVotes: 7600,
    endDate: "2024-12-25T23:59:59",
    category: "חינוך",
    hasUserVoted: true,
    userChoice: "opt-1"
  }
];

export const VoteFeed = ({ filter }: VoteFeedProps) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoComment | null>(null);

  const handleCandidateVideoClick = (candidate: Candidate) => {
    // Convert candidate to VideoComment format for FullscreenVideoPlayer
    const videoComment: VideoComment = {
      id: candidate.id,
      userId: candidate.id,
      username: candidate.name,
      userImage: candidate.avatar,
      videoUrl: candidate.videoUrl,
      duration: 120, // Mock duration
      likes: candidate.voteCount,
      replies: Math.floor(candidate.voteCount * 0.1),
      trustLevel: candidate.voteCount,
      timestamp: "2h",
      category: candidate.expertise[0],
      kycLevel: 3,
      watchCount: candidate.supporterCount,
      shareCount: Math.floor(candidate.voteCount * 0.05)
    };
    
    setSelectedVideo(videoComment);
  };

  const handleVote = (candidateId: string) => {
    // Update candidate vote status
    const candidateIndex = mockCandidates.findIndex(c => c.id === candidateId);
    if (candidateIndex !== -1) {
      mockCandidates[candidateIndex].hasUserVoted = true;
      mockCandidates[candidateIndex].voteCount += 1;
    }
  };

  const handlePollVote = (pollId: string, optionId: string) => {
    const pollIndex = mockPolls.findIndex(p => p.id === pollId);
    if (pollIndex !== -1) {
      mockPolls[pollIndex].hasUserVoted = true;
      mockPolls[pollIndex].userChoice = optionId;
      // Update vote counts (simplified)
      const optionIndex = mockPolls[pollIndex].options.findIndex(opt => opt.id === optionId);
      if (optionIndex !== -1) {
        mockPolls[pollIndex].options[optionIndex].votes += 1;
        mockPolls[pollIndex].totalVotes += 1;
      }
    }
  };

  const getFilteredContent = () => {
    let candidates = [...mockCandidates];
    let polls = [...mockPolls];

    switch (filter) {
      case 'for-me':
        // Show personalized content based on location/interests
        candidates = candidates.slice(0, 2);
        polls = polls.slice(0, 1);
        break;
      case 'candidates':
        // Show only political candidates
        candidates = candidates.filter(c => c.position.includes('ראש') || c.position.includes('שר'));
        polls = [];
        break;
      case 'experts':
        // Show only expert candidates
        candidates = candidates.filter(c => c.position.includes('מומחה'));
        polls = [];
        break;
      case 'all':
      default:
        // Show everything
        break;
    }

    return { candidates, polls };
  };

  const { candidates, polls } = getFilteredContent();

  return (
    <>
      <div className="pb-32 px-4 pt-4">
        {/* Mix candidates and polls */}
        {candidates.map((candidate, index) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onVideoClick={handleCandidateVideoClick}
            onVote={handleVote}
          />
        ))}
        
        {polls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            onVote={handlePollVote}
          />
        ))}
        
        {candidates.length === 0 && polls.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">אין תוכן זמין לפילטר שנבחר</p>
          </div>
        )}
      </div>

      {/* Fullscreen Video Player */}
      {selectedVideo && (
        <FullscreenVideoPlayer
          comments={[selectedVideo]}
          initialCommentIndex={0}
          onClose={() => setSelectedVideo(null)}
          onTrust={() => {}}
          onWatch={() => {}}
          onComment={() => {}}
          onShare={() => {}}
        />
      )}
    </>
  );
};