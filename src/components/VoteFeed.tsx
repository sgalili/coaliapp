import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PollCard, Poll } from "./PollCard";
import { OrganizationVoteCard, OrganizationVote } from "./OrganizationVoteCard";
import { FeedSection } from "./FeedSection";
import { DecisionsOnboarding } from "./DecisionsOnboarding";
import { GuidedTour } from "./GuidedTour";
import { useToast } from "@/hooks/use-toast";
import { useKYC } from "@/hooks/useKYC";
import { Building, GraduationCap, Home, BarChart3 } from "lucide-react";
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
      id: "city-votes",
      title: "העיר שלי",
      description: "החלטות עירוניות חשובות לתושבים",
      details: "תל אביב יפו",
      icon: Building,
      content: userCityVotes,
      type: "organizationVote" as const
    }, {
      id: "city-polls",
      title: "סקרי דעת קהל עירוניים",
      description: "מה דעת התושבים על נושאים חשובים",
      details: "תל אביב יפו",
      icon: BarChart3,
      content: cityPolls,
      type: "poll" as const
    }]
  };
  return <>
      <div className="overflow-y-scroll snap-y snap-mandatory">
        {/* Intro Section - Non-sticky intro content */}
        <div className="min-h-screen pt-20 px-4 pb-8 snap-start">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-foreground">
                ברוכים הבאים לפלטפורמת ההצבעות
              </h1>
              <p className="text-muted-foreground">
                כאן תוכלו להשתתף בהחלטות חשובות ברמות השונות - מהבניין שלכם ועד לעיר
              </p>
            </div>
            
            {!user.isVerified && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-primary">השלימו את האימות שלכם</h3>
                <p className="text-sm text-muted-foreground">
                  כדי להשתתף בהצבעות ולהרוויח ZOOZ, יש להשלים את תהליך האימות (KYC)
                </p>
                <button 
                  onClick={() => navigate('/wallet')}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  השלימו אימות והרוויחו ZOOZ
                </button>
              </div>
            )}
            
            <div className="text-center text-sm text-muted-foreground">
              גללו למטה כדי לראות את ההצבעות הרלוונטיות עבורכם
            </div>
          </div>
        </div>

        {/* All sections as full-height sticky sections */}
        {[...content.hyperLocal, ...content.local, ...content.city].map(section => (
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
      </div>

    {/* Onboarding Components */}
    {showOnboarding && <DecisionsOnboarding onClose={handleCloseOnboarding} onStartTour={handleStartTour} />}
    
    {showGuidedTour && <GuidedTour onClose={handleCloseTour} />}
  </>;
};