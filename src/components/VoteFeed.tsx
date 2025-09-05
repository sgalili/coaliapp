import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PollCard, Poll } from "./PollCard";
import { OrganizationVoteCard, OrganizationVote } from "./OrganizationVoteCard";
import { FeedSection } from "./FeedSection";
import { DecisionsOnboarding } from "./DecisionsOnboarding";
import { GuidedTour } from "./GuidedTour";
import { useToast } from "@/hooks/use-toast";
import { useKYC } from "@/hooks/useKYC";
import { Building, GraduationCap, Home, BarChart3, MapPin } from "lucide-react";
import { PositionCarousel } from "./PositionCarousel";
import { Profile } from "./ProfileCard";

// Profile images
import amitProfile from "@/assets/amit-profile.jpg";
import davidProfile from "@/assets/david-profile.jpg";
import mayaProfile from "@/assets/maya-profile.jpg";
import netanyahuProfile from "@/assets/netanyahu-profile.jpg";
import noaProfile from "@/assets/noa-profile.jpg";
import rachelProfile from "@/assets/rachel-profile.jpg";
import sarahProfile from "@/assets/sarah-profile.jpg";
import warrenBuffettProfile from "@/assets/warren-buffett-profile.jpg";
import yaakovProfile from "@/assets/yaakov-profile.jpg";
import yaronProfile from "@/assets/yaron-profile.jpg";
import yaronZelekhaProfile from "@/assets/yaron-zelekha-profile.jpg";
export type VoteFilterType = 'for-me' | 'candidates' | 'experts' | 'all';
interface VoteFeedProps {
  filter: VoteFilterType;
}

// Mock data for hyper-local to national content
const condoVotes: OrganizationVote[] = [{
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
  options: [{
    id: "c1-o1",
    text: "בעד השיפוץ",
    votes: 18,
    percentage: 75
  }, {
    id: "c1-o2",
    text: "נגד השיפוץ",
    votes: 6,
    percentage: 25
  }],
  totalVotes: 24,
  totalMembers: 32,
  endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  hasUserVoted: false,
  urgency: "medium"
}];
const schoolVotes: OrganizationVote[] = [{
  id: "school1",
  organization: "בי״ס יסודי ביאליק",
  organizationType: "school",
  title: "הרחבת זמני המגרש",
  description: "הצעה להרחיב את זמני השימוש במגרש הכדורסל עד 19:00 לפעילויות תלמידים",
  targetPhones: ["+972-50-123-4567"],
  targetIds: ["123456789"],
  options: [{
    id: "s1-o1",
    text: "בעד ההרחבה",
    votes: 89,
    percentage: 70
  }, {
    id: "s1-o2",
    text: "נגד ההרחבה",
    votes: 38,
    percentage: 30
  }],
  totalVotes: 127,
  totalMembers: 180,
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  hasUserVoted: false,
  urgency: "low"
}];
const neighborhoodPolls: Poll[] = [{
  id: "nb1",
  question: "איזה שיפור הכי דחוף בשכונה?",
  description: "סקר דעת קהל לתושבי רמת אביב צפון",
  options: [{
    id: "nb1-o1",
    text: "תאורת רחוב",
    votes: 234,
    percentage: 45
  }, {
    id: "nb1-o2",
    text: "מעברי חצייה",
    votes: 156,
    percentage: 30
  }, {
    id: "nb1-o3",
    text: "גינות ציבוריות",
    votes: 130,
    percentage: 25
  }],
  totalVotes: 520,
  endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  category: "שכונה",
  hasUserVoted: false
}];
const cityVotes: OrganizationVote[] = [{
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
  options: [{
    id: "city1-o1",
    text: "בעד הגדלת התקציב",
    votes: 2134,
    percentage: 75
  }, {
    id: "city1-o2",
    text: "נגד הגדלת התקציב",
    votes: 713,
    percentage: 25
  }],
  totalVotes: 2847,
  totalMembers: 15000,
  endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  hasUserVoted: false,
  urgency: "high"
}];
const cityPolls: Poll[] = [{
  id: "cp1",
  question: "איזה פרויקט עירוני הכי חשוב?",
  description: "סקר דעת קהל לתושבי תל אביב",
  options: [{
    id: "cp1-o1",
    text: "רכבת קלה נוספת",
    votes: 4521,
    percentage: 42
  }, {
    id: "cp1-o2",
    text: "פארקים חדשים",
    votes: 3251,
    percentage: 30
  }, {
    id: "cp1-o3",
    text: "שיפור החופים",
    votes: 3018,
    percentage: 28
  }],
  totalVotes: 10790,
  endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  category: "עירוני",
  hasUserVoted: false
}];

// Mock data for municipal council candidates
const municipalCandidates: Profile[] = [
  {
    id: "municipal1",
    name: "אמיר כהן",
    position: "מועמד למועצת העיר",
    city: "תל אביב",
    avatar: amitProfile,
    videoUrl: "/videos/candidate1.mp4",
    expertise: ["תחבורה", "איכות סביבה", "דיור"],
    voteCount: 1247,
    hasUserVoted: false,
    isVerified: true,
    type: "candidate" as const,
    trustRank: 8.4,
    trustTrend: "up" as const
  },
  {
    id: "municipal2", 
    name: "שרה לוי",
    position: "מועמדת למועצת העיר",
    city: "תל אביב",
    avatar: sarahProfile,
    videoUrl: "/videos/candidate2.mp4",
    expertise: ["חינוך", "רווחה", "תרבות"],
    voteCount: 892,
    hasUserVoted: false,
    isVerified: true,
    type: "candidate" as const,
    trustRank: 7.8,
    trustTrend: "stable" as const
  },
  {
    id: "municipal3",
    name: "דוד רוזן",
    position: "מועמד למועצת העיר", 
    city: "תל אביב",
    avatar: davidProfile,
    videoUrl: "/videos/candidate3.mp4",
    expertise: ["כלכלה", "עסקים", "פיתוח"],
    voteCount: 1156,
    hasUserVoted: false,
    isVerified: true,
    type: "candidate" as const,
    trustRank: 7.2,
    trustTrend: "up" as const
  }
];

// Mock data for national candidates (PM)
const nationalCandidates: Profile[] = [
  {
    id: "pm1",
    name: "בנימין נתניהו",
    position: "מועמד לראשות הממשלה",
    city: "ירושלים",
    avatar: netanyahuProfile, 
    videoUrl: "/videos/netanyahu-debate.mp4",
    expertise: ["ביטחון", "כלכלה", "דיפלומטיה"],
    voteCount: 875432,
    hasUserVoted: false,
    isVerified: true,
    type: "candidate" as const,
    trustRank: 6.2,
    trustTrend: "down" as const
  },
  {
    id: "pm2",
    name: "יאיר לפיד",
    position: "מועמד לראשות הממשלה",
    city: "תל אביב",
    avatar: yaronProfile,
    videoUrl: "/videos/candidate-yair.mp4", 
    expertise: ["כלכלה", "חוץ", "חברה"],
    voteCount: 623891,
    hasUserVoted: false,
    isVerified: true,
    type: "candidate" as const,
    trustRank: 7.1,
    trustTrend: "up" as const
  },
  {
    id: "pm3",
    name: "בני גנץ",
    position: "מועמד לראשות הממשלה",
    city: "רמת גן",
    avatar: yaakovProfile,
    videoUrl: "/videos/candidate-benny.mp4",
    expertise: ["ביטחון", "הגנה", "מדיניות"],
    voteCount: 456723,
    hasUserVoted: false,
    isVerified: true,
    type: "candidate" as const,  
    trustRank: 7.5,
    trustTrend: "stable" as const
  }
];

// Mock data for Palestinian state referendum
const palestinianStateReferendum: Poll = {
  id: "referendum1",
  question: "האם אתה בעד הקמת מדינה פלסטינית?",
  description: "משאל עם לכלל האזרחים בנוגע למדיניות ישראל כלפי הקמת מדינה פלסטינית",
  options: [
    {
      id: "ref1-o1",
      text: "בעד",
      votes: 234567,
      percentage: 42
    },
    {
      id: "ref1-o2", 
      text: "נגד",
      votes: 325890,
      percentage: 58
    }
  ],
  totalVotes: 560457,
  endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  category: "משאל עם",
  hasUserVoted: false
};
export const VoteFeed = ({
  filter
}: VoteFeedProps) => {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const {
    user
  } = useKYC();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Toujours afficher l'onboarding au chargement initial de la page
  useEffect(() => {
    if (filter === 'for-me' && isInitialLoad) {
      setShowOnboarding(true);
      setIsInitialLoad(false);
    }
  }, [filter, isInitialLoad]);
  const handlePollVote = (pollId: string, optionId: string) => {
    console.log(`Voted in poll ${pollId} for option: ${optionId}`);
  };
  const handleOrganizationVote = (voteId: string, optionId: string) => {
    console.log(`Voted in organization vote ${voteId} for option: ${optionId}`);
  };
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenDecisionsOnboarding', 'true');
  };
  const handleStartTour = () => {
    setShowOnboarding(false);
    setShowGuidedTour(true);
    localStorage.setItem('hasSeenDecisionsOnboarding', 'true');
  };
  const handleCloseTour = () => {
    setShowGuidedTour(false);
  };

  // Handle candidate video clicks  
  const handleVideoClick = (profile: Profile) => {
    console.log(`Playing video for candidate: ${profile.name}`);
    // TODO: Open video player with profile.videoUrl
  };

  // Handle candidate votes
  const handleCandidateVote = (profileId: string) => {
    console.log(`Voted for candidate: ${profileId}`);
    toast({
      title: "הצבעה נשמרה",
      description: "ההצבעה שלך נרשמה בהצלחה",
    });
  };

  // Handle profile clicks
  const handleProfileClick = (profileId: string) => {
    console.log(`Viewing profile: ${profileId}`);
    // TODO: Navigate to profile page
  };

  // Only handle 'for-me' filter in VoteFeed
  if (filter !== 'for-me') {
    return null;
  }

  // Filter organization votes by user's phone/ID
  const userCondoVotes = condoVotes.filter(vote => vote.targetPhones?.includes(user.phoneNumber || '') || vote.targetIds?.includes(user.idNumber || ''));
  const userSchoolVotes = schoolVotes.filter(vote => vote.targetPhones?.includes(user.phoneNumber || '') || vote.targetIds?.includes(user.idNumber || ''));
  const userCityVotes = cityVotes.filter(vote => vote.targetPhones?.includes(user.phoneNumber || '') || vote.targetIds?.includes(user.idNumber || ''));
  const content = {
    hyperLocal: [{
      id: "condo",
      title: "בניין שלי",
      description: "החלטות הנוגעות לדירה ולבניין",
      details: userCondoVotes.length > 0 ? userCondoVotes[0].organization.replace("בניין ", "") : "רמת אביב צפון 15",
      icon: Home,
      content: userCondoVotes,
      type: "organizationVote" as const
    }, {
      id: "school",
      title: "בית הספר",
      description: "החלטות נוגעות לילדים ולמוסד החינוכי",
      details: userSchoolVotes.length > 0 ? userSchoolVotes[0].organization.replace("בי״ס יסודי ", "") : "ביאליק",
      icon: GraduationCap,
      content: userSchoolVotes,
      type: "organizationVote" as const
    }],
    local: [{
      id: "neighborhood",
      title: "השכונה שלי",
      description: "שיפורים ושינויים ברמה השכונתית",
      details: "רמת אביב צפון",
      icon: Building,
      content: neighborhoodPolls,
      type: "poll" as const
    }],
    city: [{
      id: "city-mixed",
      title: "העיר שלי",
      description: "החלטות עירוניות והצבעות למועצת העיר",
      details: "תל אביב יפו",
      icon: Building,
      content: {
        votes: userCityVotes,
        candidates: municipalCandidates,
        polls: cityPolls
      },
      type: "mixed" as const
    }],
    country: [{
      id: "country-referendum",
      title: "המדינה שלי",
      description: "משאלי עם והצבעות לראשות הממשלה",
      details: "מדינת ישראל",
      icon: MapPin,
      content: {
        referendum: palestinianStateReferendum,
        nationalCandidates: nationalCandidates
      },
      type: "national" as const
    }]
  };
  return <>
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-slate-900">
        {/* Hyperlocal and Local sections (unchanged) */}
        {[...content.hyperLocal, ...content.local].map(section => (
          <FeedSection 
            key={section.id} 
            title={section.title} 
            description={section.description} 
            details={section.details} 
            icon={section.icon}
            className="snap-start"
          >
            <div className="h-full overflow-y-auto px-4 pb-24">
              {section.content.map(item => (
                <div key={item.id} className="w-full py-4">
                  {section.type === 'organizationVote' ? (
                    <OrganizationVoteCard vote={item as OrganizationVote} onVote={handleOrganizationVote} />
                  ) : (
                    <PollCard poll={item as Poll} onVote={handlePollVote} />
                  )}
                </div>
              ))}
            </div>
          </FeedSection>
        ))}

        {/* City section (mixed content) */}
        {content.city.map(section => (
          <FeedSection 
            key={section.id} 
            title={section.title} 
            description={section.description} 
            details={section.details} 
            icon={section.icon}
            className="snap-start"
          >
            <div className="h-full overflow-y-auto px-4 pb-24">
              {/* City votes */}
              {section.content.votes.map(item => (
                <div key={item.id} className="w-full py-4">
                  <OrganizationVoteCard vote={item} onVote={handleOrganizationVote} />
                </div>
              ))}
              
              {/* Municipal council elections */}
              <div className="w-full py-6">
                <PositionCarousel
                  title="בחירות למועצת העיר 2026"
                  description="בחר את נציגיך במועצת העיר שיובילו את השינוי"
                  profiles={section.content.candidates}
                  type="candidate"
                  onVideoClick={handleVideoClick}
                  onVote={handleCandidateVote}
                  onProfileClick={handleProfileClick}
                />
              </div>

              {/* City polls */}
              {section.content.polls.map(item => (
                <div key={item.id} className="w-full py-4">
                  <PollCard poll={item} onVote={handlePollVote} />
                </div>
              ))}
            </div>
          </FeedSection>
        ))}

        {/* Country section */}
        {content.country.map(section => (
          <FeedSection 
            key={section.id} 
            title={section.title} 
            description={section.description} 
            details={section.details} 
            icon={section.icon}
            className="snap-start"
          >
            <div className="h-full overflow-y-auto px-4 pb-24">
              {/* Palestinian state referendum */}
              <div className="w-full py-4">
                <PollCard poll={section.content.referendum} onVote={handlePollVote} />
              </div>
              
              {/* National PM elections */}
              <div className="w-full py-6">
                <PositionCarousel
                  title="בחירות לראש הממשלה 2026"
                  description="בחר את ראש הממשלה הבא של מדינת ישראל"
                  profiles={section.content.nationalCandidates}
                  type="candidate"
                  onVideoClick={handleVideoClick}
                  onVote={handleCandidateVote}
                  onProfileClick={handleProfileClick}
                />
              </div>
            </div>
          </FeedSection>
        ))}
      </div>

    {/* Onboarding Components */}
    {showOnboarding && <DecisionsOnboarding onClose={handleCloseOnboarding} onStartTour={handleStartTour} />}
    
    {showGuidedTour && <GuidedTour onClose={handleCloseTour} />}
  </>;
};