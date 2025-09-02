import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PositionCarousel } from "./PositionCarousel";
import { Profile } from "./ProfileCard";
import { FullscreenVideoPlayer } from "./FullscreenVideoPlayer";
import { PollCard, Poll } from "./PollCard";
import { OrganizationVoteCard, OrganizationVote } from "./OrganizationVoteCard";
import { FeedSection } from "./FeedSection";
import { useToast } from "@/hooks/use-toast";
import { useKYC } from "@/hooks/useKYC";
import { Building, MapPin, Flag, Users, GraduationCap } from "lucide-react";

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

// Mock positions and candidates data
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

export const VoteFeed = ({ filter }: VoteFeedProps) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoComment | null>(null);
  const [dismissedProfiles, setDismissedProfiles] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useKYC();

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
    const filterProfiles = (profiles: Profile[]) => 
      profiles.filter(profile => !dismissedProfiles.includes(profile.id));

    switch (filter) {
      case 'candidates':
        return { 
          positions: positions.map(pos => ({
            ...pos,
            candidates: filterProfiles(pos.candidates)
          })),
          experts: [],
          polls: [],
          organizationVotes: []
        };
      case 'experts':
        return { 
          positions: [],
          experts: expertSections.map(section => ({
            ...section,
            experts: filterProfiles(section.experts)
          })),
          polls: [],
          organizationVotes: []
        };
      case 'for-me':
        // Filter organization votes by user's phone/ID
        const urgentOrgVotes = mockOrganizationVotes.filter(vote => 
          vote.urgency === 'high' && (
            vote.targetPhones?.includes(user.phoneNumber || '') ||
            vote.targetIds?.includes(user.idNumber || '')
          )
        );

        // Filter local positions by user's city
        const localPositions = positions.filter(pos => 
          pos.level === 'local' && pos.city === user.city
        ).map(pos => ({
          ...pos,
          candidates: filterProfiles(pos.candidates)
        }));

        // National positions
        const nationalPositions = positions.filter(pos => 
          pos.level === 'national'
        ).map(pos => ({
          ...pos,
          candidates: filterProfiles(pos.candidates)
        }));

        return {
          urgentOrgVotes,
          localPositions,
          nationalPositions,
          polls: mockPolls.slice(0, 2),
          experts: urgentOrgVotes.length === 0 && localPositions.length === 0 && nationalPositions.length === 0 
            ? expertSections.slice(0, 1).map(section => ({
                ...section,
                experts: filterProfiles(section.experts)
              }))
            : []
        };
      case 'all':
      default:
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
    }
  };

  const filteredContent = getFilteredContent();

  // Handle "for-me" filter with sections
  if (filter === 'for-me') {
    const { urgentOrgVotes, localPositions, nationalPositions, polls, experts } = filteredContent as any;
    const hasContent = urgentOrgVotes.length > 0 || localPositions.length > 0 || nationalPositions.length > 0 || polls.length > 0 || experts.length > 0;

    return (
      <>
        <div className="pt-24 pb-20 w-full min-h-screen bg-background">
          {!hasContent ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">🗳️</div>
              <h3 className="text-lg font-semibold mb-2">אין תוכן להצבעה כרגע</h3>
              <p className="text-muted-foreground">נסה לשנות את הפילטר או לחזור מאוחר יותר</p>
            </div>
          ) : (
            <div className="space-y-0">
              {/* Urgent Organization Votes */}
              <FeedSection
                icon={Building}
                title="הצבעות דחופות בארגון שלך"
                description="החלטות חשובות הדורשות הצבעה מיידית מחברי הארגון"
                badge={urgentOrgVotes.length}
                isEmpty={urgentOrgVotes.length === 0}
              >
                {urgentOrgVotes.map((vote: any) => (
                  <div key={vote.id} className="w-full flex justify-center py-6">
                    <OrganizationVoteCard
                      vote={vote}
                      onVote={handleOrganizationVote}
                    />
                  </div>
                ))}
              </FeedSection>

              {/* Local City Votes */}
              <FeedSection
                icon={MapPin}
                title={`הצבעות בעיר שלך: ${user.city || 'העיר שלך'}`}
                description="מועמדים ובחירות מקומיות המשפיעות ישירות על חייך"
                badge={localPositions.reduce((acc: number, pos: any) => acc + pos.candidates.length, 0)}
                isEmpty={localPositions.length === 0}
              >
                {localPositions.map((position: any) => (
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
              </FeedSection>

              {/* National Votes */}
              <FeedSection
                icon={Flag}
                title="בחירות לכנסת ישראל"
                description="מועמדים למשרות הכי חשובות במדינה - ראש הממשלה, שרים וחברי כנסת"
                badge={nationalPositions.reduce((acc: number, pos: any) => acc + pos.candidates.length, 0)}
                isEmpty={nationalPositions.length === 0}
              >
                {nationalPositions.map((position: any) => (
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
              </FeedSection>

              {/* Community Polls */}
              <FeedSection
                icon={Users}
                title="סקרי דעת קהילתיים"
                description="הביעו את דעתכם בסוגיות החשובות לציבור הישראלי"
                badge={polls.length}
                isEmpty={polls.length === 0}
              >
                {polls.map((poll: any) => (
                  <div key={poll.id} className="w-full px-4 py-6">
                    <PollCard
                      poll={poll}
                      onVote={handlePollVote}
                    />
                  </div>
                ))}
              </FeedSection>

              {/* Trusted Experts - Only if no votes available */}
              <FeedSection
                icon={GraduationCap}
                title="מומחים מהימנים"
                description="מומחים איכותיים בתחומים השונים שיכולים לעזור לכם להחליט"
                badge={experts.reduce((acc: number, section: any) => acc + section.experts.length, 0)}
                isEmpty={experts.length === 0}
              >
                {experts.map((section: any) => (
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
              </FeedSection>
            </div>
          )}
        </div>

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