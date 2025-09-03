import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PositionCarousel } from "./PositionCarousel";
import { Profile } from "./ProfileCard";
import { FullscreenVideoPlayer } from "./FullscreenVideoPlayer";
import { PollCard, Poll } from "./PollCard";
import { OrganizationVoteCard, OrganizationVote } from "./OrganizationVoteCard";
import { FeedSection } from "./FeedSection";
import { VideoFeed, VideoPost } from "./VideoFeed";
import { useToast } from "@/hooks/use-toast";
import { useKYC } from "@/hooks/useKYC";
import { Building, MapPin, Flag, Users, GraduationCap, Home, AlertTriangle, BarChart3, MessageCircle } from "lucide-react";

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
  onFilterChange?: (filter: VoteFilterType) => void;
  isMuted?: boolean;
  onVolumeToggle?: () => void;
}

// Mock data for hyper-local to national content
const condoVotes: OrganizationVote[] = [
  {
    id: "condo1",
    organization: "בניין רמת אביב 15",
    organizationType: "community",
    title: "שיפוץ לובי הכניסה",
    description: "הצעה להחלפת ריצוף ותאורת לובי הכניסה הראשי. עלות משוערת: 35,000 ₪",
    targetPhones: ["+972-50-123-4567"],
    targetIds: ["123456789"],
    financialDetails: {
      amount: "35,000",
      currency: "₪",
      type: "cost"
    },
    options: [
      { id: "c1-o1", text: "בעד השיפוץ", votes: 18, percentage: 75 },
      { id: "c1-o2", text: "נגד השיפוץ", votes: 6, percentage: 25 }
    ],
    totalVotes: 24,
    totalMembers: 32,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    hasUserVoted: false,
    urgency: "medium"
  }
];

const schoolVotes: OrganizationVote[] = [
  {
    id: "school1",
    organization: "בי״ס יסודי ביאליק",
    organizationType: "school",
    title: "הרחבת זמני המגרש",
    description: "הצעה להרחיב את זמני השימוש במגרש הכדורסל עד 19:00 לפעילויות תלמידים",
    targetPhones: ["+972-50-123-4567"],
    targetIds: ["123456789"],
    options: [
      { id: "s1-o1", text: "בעד ההרחבה", votes: 89, percentage: 70 },
      { id: "s1-o2", text: "נגד ההרחבה", votes: 38, percentage: 30 }
    ],
    totalVotes: 127,
    totalMembers: 180,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    hasUserVoted: false,
    urgency: "low"
  }
];

const neighborhoodPolls: Poll[] = [
  {
    id: "nb1",
    question: "איזה שיפור הכי דחוף בשכונה?",
    description: "סקר דעת קהל לתושבי רמת אביב צפון",
    options: [
      { id: "nb1-o1", text: "תאורת רחוב", votes: 234, percentage: 45 },
      { id: "nb1-o2", text: "מעברי חצייה", votes: 156, percentage: 30 },
      { id: "nb1-o3", text: "גינות ציבוריות", votes: 130, percentage: 25 }
    ],
    totalVotes: 520,
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    category: "שכונה",
    hasUserVoted: false
  }
];

const cityVotes: OrganizationVote[] = [
  {
    id: "city1",
    organization: "עיריית תל אביב",
    organizationType: "community",
    title: "תקציב לתחבורה ציבורית 2025",
    description: "הצעה להגדלת התקציב לשיפור התחבורה הציבורית בעיר ב-20%",
    targetPhones: ["+972-50-123-4567"],
    targetIds: ["123456789"],
    financialDetails: {
      amount: "50M",
      currency: "₪",
      type: "investment"
    },
    options: [
      { id: "city1-o1", text: "בעד הגדלת התקציב", votes: 2134, percentage: 75 },
      { id: "city1-o2", text: "נגד הגדלת התקציב", votes: 713, percentage: 25 }
    ],
    totalVotes: 2847,
    totalMembers: 15000,
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    hasUserVoted: false,
    urgency: "high"
  }
];

const cityPolls: Poll[] = [
  {
    id: "cp1",
    question: "איזה פרויקט עירוני הכי חשוב?",
    description: "סקר דעת קהל לתושבי תל אביב",
    options: [
      { id: "cp1-o1", text: "רכבת קלה נוספת", votes: 4521, percentage: 42 },
      { id: "cp1-o2", text: "פארקים חדשים", votes: 3251, percentage: 30 },
      { id: "cp1-o3", text: "שיפור החופים", votes: 3018, percentage: 28 }
    ],
    totalVotes: 10790,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    category: "עירוני",
    hasUserVoted: false
  }
];

// National positions and candidates data
const positions = [
  {
    id: "pm",
    title: "מועמדים לראשות הממשלה",
    description: "בחירות 2024 - ראש הממשלה הבא של ישראל",
    level: "national",
    city: null,
    candidates: [
      {
        id: "1",
        name: "בנימין נתניהו", 
        position: "ראש הממשלה",
        city: "ירושלים",
        avatar: netanyahuProfile,
        videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755817615/netanyahu-debate_fitgzh.mp4",
        expertise: ["מדיניות", "ביטחון", "כלכלה"],
        voteCount: 89420,
        hasUserVoted: false,
        isVerified: true,
        type: 'candidate' as const,
        trustRank: 850,
        trustTrend: 'up' as const,
      },
      {
        id: "2",
        name: "יאיר לפיד",
        position: "ראש הממשלה", 
        city: "תל אביב",
        avatar: yaronProfile,
        videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755818123/%D7%90%D7%96_%D7%9E%D7%94_%D7%90%D7%AA%D7%94_%D7%91%D7%A2%D7%A6%D7%9D_%D7%9E%D7%A6%D7%99%D7%A2__jb7xb0.mp4",
        expertise: ["כלכלה", "דיפלומטיה", "שינוי"],
        voteCount: 67890,
        hasUserVoted: false,
        isVerified: true,
        type: 'candidate' as const,
        trustRank: 720,
        trustTrend: 'down' as const,
      }
    ]
  },
  {
    id: "mayor", 
    title: "מועמדים לראשות עיריית תל אביב",
    description: "בחירות מקומיות 2024",
    level: "local",
    city: "תל אביב",
    candidates: [
      {
        id: "3",
        name: "רון חולדאי",
        position: "ראש עירית תל אביב",
        city: "תל אביב", 
        avatar: sarahProfile,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        expertise: ["ניהול עירוני", "תחבורה", "תרבות"],
        voteCount: 23150,
        hasUserVoted: false,
        isVerified: true,
        type: 'candidate' as const,
        trustRank: 680,
        trustTrend: 'stable' as const,
      }
    ]
  }
];

const expertSections = [
  {
    id: "economists",
    title: "מומחי כלכלה מובילים",
    description: "תן אמון למומחים שדעתם חשובה לך",
    experts: [
      {
        id: "1",
        name: "ירון זליכה",
        position: "כלכלן ראשי",
        city: "תל אביב",
        avatar: yaronProfile,
        videoUrl: "https://res.cloudinary.com/drylxyich/video/upload/v1755818123/%D7%90%D7%96_%D7%9E%D7%94_%D7%90%D7%AA%D7%94_%D7%91%D7%A2%D7%A6%D7%9D_%D7%9E%D7%A6%D7%99%D7%A2__jb7xb0.mp4",
        expertise: ["כלכלה", "השקעות", "מדיניות פיסקלית"],
        trustCount: 12400,
        hasUserTrusted: false,
        isVerified: true,
        type: 'expert' as const,
        trustRank: 920,
        trustTrend: 'up' as const,
      },
      {
        id: "4", 
        name: "שרה כהן",
        position: "מומחית דמוקרטיה דיגיטלית",
        city: "חיפה",
        avatar: sarahProfile,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        expertise: ["טכנולוגיה", "דמוקרטיה", "חדשנות"],
        trustCount: 8900,
        hasUserTrusted: true,
        isVerified: true,
        type: 'expert' as const,
        trustRank: 760,
        trustTrend: 'stable' as const,
      }
    ]
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

// Mock organization votes data
const mockOrganizationVotes: OrganizationVote[] = [
  {
    id: "ov1",
    organization: "עמותת AMIT",
    organizationType: "foundation",
    title: "מכירת נכס ברחוב הרצל - החלטה דחופה",
    description: "העמותה קיבלה הצעה לרכישת הנכס ברחוב הרצל 15. ההצעה תקפה למשך 15 יום בלבד. הנכס נרכש לפני 8 שנים ב-1.2M ₪ והצעת הרכישה הנוכחית היא 3.7M ₪.",
    targetPhones: ["+972-50-123-4567", "+972-52-987-6543"],
    targetIds: ["123456789", "987654321"],
    financialDetails: {
      amount: "2.5M",
      currency: "₪",
      type: "profit"
    },
    options: [
      { id: "ov1-o1", text: "בעד מכירת הנכס", votes: 8, percentage: 67 },
      { id: "ov1-o2", text: "נגד מכירת הנכס", votes: 3, percentage: 25 },
      { id: "ov1-o3", text: "נמנע מהצבעה", votes: 1, percentage: 8 }
    ],
    totalVotes: 12,
    totalMembers: 25,
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    hasUserVoted: false,
    urgency: "high"
  }
];

export const VoteFeed = ({ filter, onFilterChange, isMuted = true, onVolumeToggle }: VoteFeedProps) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoComment | null>(null);
  const [dismissedProfiles, setDismissedProfiles] = useState<string[]>([]);
  const [fullscreenVideoData, setFullscreenVideoData] = useState<{comments: VideoComment[], index: number} | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useKYC();

  // Fonction pour convertir les données en format NewsComment pour FullscreenVideoPlayer
  const convertToNewsComments = (type: 'candidates' | 'experts'): VideoComment[] => {
    if (type === 'candidates') {
      return positions.flatMap(position => 
        position.candidates
          .filter(candidate => candidate.videoUrl && !dismissedProfiles.includes(candidate.id))
          .map(candidate => ({
            id: candidate.id,
            userId: candidate.id,
            username: candidate.name,
            userImage: candidate.avatar,
            videoUrl: candidate.videoUrl!,
            duration: 30,
            likes: Math.floor(Math.random() * 1000),
            replies: Math.floor(Math.random() * 100),
            trustLevel: Math.floor(Math.random() * 100),
            timestamp: "2h",
            category: `Candidat pour ${position.title}`,
            kycLevel: 3 as const,
            watchCount: Math.floor(Math.random() * 5000),
            shareCount: Math.floor(Math.random() * 50)
          }))
      );
    } else {
      return expertSections.flatMap(section =>
        section.experts
          .filter(expert => expert.videoUrl && !dismissedProfiles.includes(expert.id))
          .map(expert => ({
            id: expert.id,
            userId: expert.id,
            username: expert.name,
            userImage: expert.avatar,
            videoUrl: expert.videoUrl!,
            duration: 30,
            likes: Math.floor(Math.random() * 1000),
            replies: Math.floor(Math.random() * 100),
            trustLevel: Math.floor(Math.random() * 100),
            timestamp: "1h",
            category: `Expert en ${section.title}`,
            kycLevel: 3 as const,
            watchCount: Math.floor(Math.random() * 5000),
            shareCount: Math.floor(Math.random() * 50)
          }))
      );
    }
  };

  // Gérer les changements de filtre pour fermer/ouvrir le fullscreen
  useEffect(() => {
    if (filter === 'for-me' || filter === 'all') {
      setFullscreenVideoData(null);
    } else if ((filter === 'candidates' || filter === 'experts') && !fullscreenVideoData) {
      const comments = convertToNewsComments(filter);
      if (comments.length > 0) {
        setFullscreenVideoData({ comments, index: 0 });
      }
    }
  }, [filter]);

  const handleSwipeNavigation = (direction: 'left' | 'right') => {
    if (!onFilterChange) return;
    
    if (direction === 'left') {
      // Swipe gauche : retour vers FOR ME
      onFilterChange('for-me');
    } else if (direction === 'right') {
      // Swipe droit : aller vers experts si on est sur candidats
      if (filter === 'candidates') {
        onFilterChange('experts');
      }
    }
  };

  const handleProfileVideoClick = (profile: Profile) => {
    // Convert profile to VideoComment format for the player
    const videoComment: VideoComment = {
      id: profile.id,
      userId: profile.id,
      username: profile.name,
      userImage: profile.avatar,
      videoUrl: profile.videoUrl,
      duration: 180, // Mock duration
      likes: profile.voteCount || profile.trustCount || 0,
      replies: Math.floor((profile.voteCount || profile.trustCount || 0) * 0.1),
      trustLevel: profile.trustCount || profile.voteCount || 0,
      timestamp: "לפני שעה",
      category: profile.expertise[0] || "פוליטיקה",
      kycLevel: 3,
      watchCount: profile.trustCount || profile.voteCount || 0,
      shareCount: Math.floor((profile.voteCount || profile.trustCount || 0) * 0.2)
    };
    
    setSelectedVideo(videoComment);
  };

  const handleVote = (profileId: string) => {
    console.log(`Voted for: ${profileId}`);
  };

  const handleTrust = (profileId: string) => {
    console.log(`Trusted: ${profileId}`);
  };

  const handlePollVote = (pollId: string, optionId: string) => {
    console.log(`Voted in poll ${pollId} for option: ${optionId}`);
  };

  const handleOrganizationVote = (voteId: string, optionId: string) => {
    console.log(`Voted in organization vote ${voteId} for option: ${optionId}`);
  };

  const handleAddCandidate = () => {
    console.log('Add candidate clicked');
  };

  const handleProfileClick = (profileId: string) => {
    navigate(`/user/${profileId}`);
  };

  const handleDismissProfile = (profileId: string) => {
    setDismissedProfiles(prev => [...prev, profileId]);
    toast({
      title: "פרופיל הוסר",
      description: "הפרופיל הוסר מהפיד שלך",
    });
  };

  const getFilteredContent = () => {
    // Ouvrir automatiquement en fullscreen pour candidats et experts
    if (filter === 'candidates' || filter === 'experts') {
      const comments = convertToNewsComments(filter);
      if (comments.length > 0 && !fullscreenVideoData) {
        setFullscreenVideoData({ comments, index: 0 });
      }
      return null; // Le contenu sera affiché via FullscreenVideoPlayer
    }

    const filterProfiles = (profiles: Profile[]) => 
      profiles.filter(profile => !dismissedProfiles.includes(profile.id));

    if (filter === 'for-me') {
      // Filter organization votes by user's phone/ID
      const userCondoVotes = condoVotes.filter(vote => 
        vote.targetPhones?.includes(user.phoneNumber || '') ||
        vote.targetIds?.includes(user.idNumber || '')
      );

      const userSchoolVotes = schoolVotes.filter(vote => 
        vote.targetPhones?.includes(user.phoneNumber || '') ||
        vote.targetIds?.includes(user.idNumber || '')
      );

      const userCityVotes = cityVotes.filter(vote => 
        vote.targetPhones?.includes(user.phoneNumber || '') ||
        vote.targetIds?.includes(user.idNumber || '')
      );

      // Filter polls by location relevance
      const userNeighborhoodPolls = neighborhoodPolls;
      const userCityPolls = cityPolls;

      // Community polls from original data
      const communityPolls = mockPolls.filter(poll => poll.category !== 'שכונה' && poll.category !== 'עירוני').slice(0, 2);

      // Trusted experts (only if minimal other content)
      const trustedExperts = (userCondoVotes.length === 0 && userSchoolVotes.length === 0 && userCityVotes.length === 0) 
        ? expertSections.slice(0, 1).map(section => ({
            ...section,
            experts: filterProfiles(section.experts)
          }))
        : [];

      return {
        condoVotes: userCondoVotes,
        schoolVotes: userSchoolVotes,
        neighborhoodPolls: userNeighborhoodPolls,
        cityVotes: userCityVotes,
        cityPolls: userCityPolls,
        communityPolls,
        experts: trustedExperts,
        // Keep old structure for backward compatibility
        urgentOrgVotes: [],
        localPositions: [],
        nationalPositions: positions.filter(pos => pos.level === 'national').map(pos => ({
          ...pos,
          candidates: filterProfiles(pos.candidates)
        })),
        polls: []
      };
    }

    // For 'all' filter
    return { 
      positions: positions.map(pos => ({
        ...pos,
        candidates: filterProfiles(pos.candidates)
      })),
      experts: expertSections.map(section => ({
        ...section,
        experts: filterProfiles(section.experts)
      })),
      polls: mockPolls,
      organizationVotes: mockOrganizationVotes
    };
  };

  const filteredContent = getFilteredContent();

  // Handle "for-me" filter with hyper-local hierarchy
  if (filter === 'for-me') {
    const { condoVotes, schoolVotes, neighborhoodPolls, cityVotes, cityPolls, communityPolls, experts, nationalPositions } = filteredContent as any;
    const hasContent = condoVotes.length > 0 || schoolVotes.length > 0 || neighborhoodPolls.length > 0 || cityVotes.length > 0 || cityPolls.length > 0 || communityPolls.length > 0 || experts.length > 0 || nationalPositions.length > 0;

    return (
      <>
        <div className="pt-24 pb-20 w-full min-h-screen bg-background">
          {!hasContent ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">🗳️</div>
              <h3 className="text-lg font-semibold mb-2">אין תוכן להצבעה כרגע</h3>
              <p className="text-muted-foreground max-w-md">
                כשיהיו הצבעות רלוונטיות עבורך באזור המגורים או הקהילה שלך, הן יופיעו כאן
              </p>
              <button 
                onClick={() => navigate('/notifications-settings')}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                הגדר התראות
              </button>
            </div>
          ) : (
            <div className="w-full">
              <div className="space-y-1 px-1">
                {/* Building/Condo Votes - Highest Priority */}
                {condoVotes.map((vote) => (
                  <div key={vote.id} className="w-full px-4 py-6 bg-background border-b border-border/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Building className="w-5 h-5 text-primary" />
                      <span className="text-sm font-semibold text-primary">דירות</span>
                      {vote.urgency === 'high' && <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />}
                    </div>
                    <OrganizationVoteCard
                      vote={vote}
                      onVote={handleOrganizationVote}
                    />
                  </div>
                ))}

                {/* School Votes */}
                {schoolVotes.map((vote) => (
                  <div key={vote.id} className="w-full px-4 py-6 bg-background border-b border-border/10">
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap className="w-5 h-5 text-accent" />
                      <span className="text-sm font-semibold text-accent">בית ספר</span>
                      {vote.urgency === 'high' && <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />}
                    </div>
                    <OrganizationVoteCard
                      vote={vote}
                      onVote={handleOrganizationVote}
                    />
                  </div>
                ))}

                {/* Neighborhood Polls */}
                {neighborhoodPolls.map((poll) => (
                  <div key={poll.id} className="w-full px-4 py-6 bg-background border-b border-border/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Home className="w-5 h-5 text-secondary" />
                      <span className="text-sm font-semibold text-secondary">שכונה</span>
                    </div>
                    <PollCard
                      poll={poll}
                      onVote={handlePollVote}
                    />
                  </div>
                ))}

                {/* City Votes */}
                {cityVotes.map((vote) => (
                  <div key={vote.id} className="w-full px-4 py-6 bg-background border-b border-border/10">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm font-semibold text-muted-foreground">עיר</span>
                      {vote.urgency === 'high' && <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />}
                    </div>
                    <OrganizationVoteCard
                      vote={vote}
                      onVote={handleOrganizationVote}
                    />
                  </div>
                ))}

                {/* City Polls */}
                {cityPolls.map((poll) => (
                  <div key={poll.id} className="w-full px-4 py-6 bg-background border-b border-border/10">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-5 h-5 text-chart-1" />
                      <span className="text-sm font-semibold text-chart-1">סקר עירוני</span>
                    </div>
                    <PollCard
                      poll={poll}
                      onVote={handlePollVote}
                    />
                  </div>
                ))}

                {/* Community Polls */}
                {communityPolls.map((poll) => (
                  <div key={poll.id} className="w-full px-4 py-6 bg-background border-b border-border/10">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-5 h-5 text-chart-2" />
                      <span className="text-sm font-semibold text-chart-2">דעת קהל</span>
                    </div>
                    <PollCard
                      poll={poll}
                      onVote={handlePollVote}
                    />
                  </div>
                ))}

                {/* Trusted Experts */}
                {experts.map((section) => (
                  <div key={section.id} className="w-full py-6">
                    <div className="flex items-center gap-2 mb-4 px-4">
                      <Users className="w-5 h-5 text-trust" />
                      <span className="text-sm font-semibold text-trust">{section.title}</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto px-4">
                      {section.experts.map((expert: any) => (
                        <div
                          key={expert.id}
                          className="min-w-[120px] cursor-pointer"
                          onClick={() => handleProfileVideoClick(expert)}
                        >
                          <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                            <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
                          </div>
                          <p className="text-xs text-center font-medium">{expert.name}</p>
                          <p className="text-xs text-center text-muted-foreground">{expert.stats.trustRate}% אמון</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* National Positions */}
                {nationalPositions.map((position: any) => (
                  <div key={position.id} className="w-full py-6">
                    <div className="flex items-center gap-2 mb-4 px-4">
                      <Flag className="w-5 h-5 text-chart-3" />
                      <span className="text-sm font-semibold text-chart-3">בחירות ארציות</span>
                    </div>
                    <PositionCarousel
                      title={position.title}
                      description={position.description}
                      profiles={position.candidates}
                      type="candidate"
                      onVideoClick={handleProfileVideoClick}
                      onVote={handleVote}
                      onAddCandidate={handleAddCandidate}
                      onProfileClick={handleProfileClick}
                      onDismiss={handleDismissProfile}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FullscreenVideoPlayer pour candidats et experts */}
        {fullscreenVideoData && (
          <FullscreenVideoPlayer
            comments={fullscreenVideoData.comments}
            initialCommentIndex={fullscreenVideoData.index}
            onClose={() => {
              setFullscreenVideoData(null);
              onFilterChange?.('for-me');
            }}
            onTrust={handleTrust}
            onWatch={() => {}}
            onComment={() => {}}
            onShare={() => {}}
            onZooz={() => {}}
            onSwipeNavigation={handleSwipeNavigation}
          />
        )}

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
            onZooz={(id) => console.log('Zooz:', id)}
            userBalance={1000}
            currentUserId="user123"
          />
        )}
      </>
    );
  }

  // Handle other filters (candidates, experts, all)
  const { positions: filteredPositions, experts: filteredExperts, polls, organizationVotes } = filteredContent as any;
  const hasContent = filteredPositions?.length > 0 || filteredExperts?.length > 0 || polls?.length > 0 || organizationVotes?.length > 0;

  return (
    <>
      {/* Main Feed - Full Width */}
      <div className="pt-24 pb-20 w-full min-h-screen bg-background">
        {!hasContent ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🗳️</div>
            <h3 className="text-lg font-semibold mb-2">אין תוכן להצבעה כרגע</h3>
            <p className="text-muted-foreground">נסה לשנות את הפילטר או לחזור מאוחר יותר</p>
          </div>
        ) : (
          <div className="space-y-0">
            {/* Candidate Positions */}
            {filteredPositions.map((position) => (
              <PositionCarousel
                key={position.id}
                title={position.title}
                description={position.description}
                profiles={position.candidates}
                type="candidate"
                onVideoClick={handleProfileVideoClick}
                onVote={handleVote}
                onAddCandidate={handleAddCandidate}
                onProfileClick={handleProfileClick}
                onDismiss={handleDismissProfile}
              />
            ))}

            {/* Expert Sections */}
            {filteredExperts.map((section) => (
              <PositionCarousel
                key={section.id}
                title={section.title}
                description={section.description}
                profiles={section.experts}
                type="expert"
                onVideoClick={handleProfileVideoClick}
                onTrust={handleTrust}
                onProfileClick={handleProfileClick}
                onDismiss={handleDismissProfile}
              />
            ))}

            {/* Organization Votes */}
            {organizationVotes.map((vote) => (
              <div key={vote.id} className="w-full flex justify-center py-6">
                <OrganizationVoteCard
                  vote={vote}
                  onVote={handleOrganizationVote}
                />
              </div>
            ))}

            {/* Polls */}
            {polls.map((poll) => (
              <div key={poll.id} className="w-full px-4 py-6">
                <PollCard
                  poll={poll}
                  onVote={handlePollVote}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FullscreenVideoPlayer pour candidats et experts */}
      {fullscreenVideoData && (
        <FullscreenVideoPlayer
          comments={fullscreenVideoData.comments}
          initialCommentIndex={fullscreenVideoData.index}
          onClose={() => {
            setFullscreenVideoData(null);
            onFilterChange?.('for-me');
          }}
          onTrust={handleTrust}
          onWatch={() => {}}
          onComment={() => {}}
          onShare={() => {}}
          onZooz={() => {}}
          onSwipeNavigation={handleSwipeNavigation}
        />
      )}

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
          onZooz={(id) => console.log('Zooz:', id)}
          userBalance={1000}
          currentUserId="user123"
        />
      )}
    </>
  );
};
