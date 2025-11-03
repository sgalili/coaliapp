import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ChannelSelector } from "@/components/ChannelSelector";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChannel } from "@/contexts/ChannelContext";

const allDecisions = [
  // Coali Main Decisions (3)
  {
    id: 'dec-1',
    channel_id: null,
    organization: 'עיריית תל אביב',
    question: 'האם להקים פארק חדש ברחוב הרצל?',
    description: 'העירייה מציעה להקים פארק משפחות במקום חניון ישן',
    postedDaysAgo: 50,
    daysRemaining: 13,
    totalVotes: 1245,
    options: [
      { id: '1', label: 'בעד', votes: 780, percentage: 62.7 },
      { id: '2', label: 'נגד', votes: 465, percentage: 37.3 },
    ],
    hasVoted: false,
  },
  {
    id: 'dec-2',
    channel_id: null,
    organization: 'משרד החינוך',
    question: 'האם להאריך את שנת הלימודים ב-10 ימים?',
    description: 'הצעה להאריך את שנת הלימודים כדי להשלים חומר לימוד',
    postedDaysAgo: 30,
    daysRemaining: 25,
    totalVotes: 2890,
    options: [
      { id: '1', label: 'בעד', votes: 867, percentage: 30 },
      { id: '2', label: 'נגד', votes: 2023, percentage: 70 },
    ],
    hasVoted: false,
  },
  {
    id: 'dec-3',
    channel_id: null,
    organization: 'משרד התחבורה',
    question: 'האם לפתוח נתיב תחבורה ציבורית בכביש איילון?',
    description: 'פתיחת נתיב ייעודי לתחבורה ציבורית בשעות העומס',
    postedDaysAgo: 15,
    daysRemaining: 45,
    totalVotes: 1567,
    options: [
      { id: '1', label: 'בעד', votes: 1097, percentage: 70 },
      { id: '2', label: 'נגד', votes: 470, percentage: 30 },
    ],
    hasVoted: false,
  },
  
  // Channel 10 Decisions (3)
  {
    id: 'dec-10-1',
    channel_id: 'channel-10-economy',
    organization: 'ערוץ 10 - סקר כלכלי',
    question: 'מה צריך להיות העדיפות הכלכלית של הממשלה?',
    description: 'סקר דעת קהל על מדיניות כלכלית',
    postedDaysAgo: 20,
    daysRemaining: 30,
    totalVotes: 3456,
    options: [
      { id: '1', label: 'הפחתת יוקר המחיה', votes: 1555, percentage: 45 },
      { id: '2', label: 'תמיכה בהייטק', votes: 968, percentage: 28 },
      { id: '3', label: 'שיפור תחבורה', votes: 622, percentage: 18 },
      { id: '4', label: 'חיזוק שוק הדיור', votes: 311, percentage: 9 },
    ],
    hasVoted: false,
  },
  {
    id: 'dec-10-2',
    channel_id: 'channel-10-economy',
    organization: 'ערוץ 10',
    question: 'האם להעלות את שכר המינימום ל-7000 ש״ח?',
    description: 'הצבעה על העלאת שכר המינימום',
    postedDaysAgo: 12,
    daysRemaining: 18,
    totalVotes: 4567,
    options: [
      { id: '1', label: 'בעד', votes: 3197, percentage: 70 },
      { id: '2', label: 'נגד', votes: 1370, percentage: 30 },
    ],
    hasVoted: false,
  },
  {
    id: 'dec-10-3',
    channel_id: 'channel-10-economy',
    organization: 'ערוץ 10 - סקר טכנולוגיה',
    question: 'איזו טכנולוגיה תשנה הכי הרבה את העולם ב-5 השנים הקרובות?',
    description: 'סקר על טכנולוגיות עתיד',
    postedDaysAgo: 8,
    daysRemaining: 22,
    totalVotes: 2345,
    options: [
      { id: '1', label: 'בינה מלאכותית', votes: 1056, percentage: 45 },
      { id: '2', label: 'קריפטו', votes: 703, percentage: 30 },
      { id: '3', label: 'אנרגיה מתחדשת', votes: 586, percentage: 25 },
    ],
    hasVoted: false,
  },
  
  // Achva College Decisions (2)
  {
    id: 'dec-achva-1',
    channel_id: 'channel-achva',
    organization: 'מכללת אחווה',
    question: 'האם לפתוח קורסים נוספים בסופי שבוע?',
    description: 'הצבעה על הרחבת שעות הלימוד',
    postedDaysAgo: 10,
    daysRemaining: 40,
    totalVotes: 890,
    options: [
      { id: '1', label: 'בעד', votes: 623, percentage: 70 },
      { id: '2', label: 'נגד', votes: 267, percentage: 30 },
    ],
    hasVoted: false,
  },
  {
    id: 'dec-achva-2',
    channel_id: 'channel-achva',
    organization: 'מכללת אחווה - אגודת הסטודנטים',
    question: 'היכן לקיים את מסיבת הסיום של השנה?',
    description: 'בחירת מקום למסיבת סיום שנה',
    postedDaysAgo: 5,
    daysRemaining: 15,
    totalVotes: 567,
    options: [
      { id: '1', label: 'אולם המכללה', votes: 227, percentage: 40 },
      { id: '2', label: 'חוף הים', votes: 340, percentage: 60 },
    ],
    hasVoted: false,
  },
  
  // Maccabi Decisions (3)
  {
    id: 'dec-maccabi-1',
    channel_id: 'channel-maccabi',
    organization: 'מכבי צבי יבנה',
    question: 'איזה שחקן חדש להחתים?',
    description: 'הצבעת אוהדים על שחקן זר',
    postedDaysAgo: 5,
    daysRemaining: 20,
    totalVotes: 5678,
    options: [
      { id: '1', label: 'שחקן A - ארה״ב', votes: 3407, percentage: 60 },
      { id: '2', label: 'שחקן B - אירופה', votes: 2271, percentage: 40 },
    ],
    hasVoted: false,
  },
  {
    id: 'dec-maccabi-2',
    channel_id: 'channel-maccabi',
    organization: 'מכבי צבי יבנה - אוהדים',
    question: 'איזה צבע יהיה החולצה החדשה?',
    description: 'בחירת עיצוב החולצה לעונה הבאה',
    postedDaysAgo: 25,
    daysRemaining: 35,
    totalVotes: 3456,
    options: [
      { id: '1', label: 'כחול קלאסי', votes: 2075, percentage: 60 },
      { id: '2', label: 'כחול-זהב', votes: 1035, percentage: 30 },
      { id: '3', label: 'עיצוב חדש', votes: 346, percentage: 10 },
    ],
    hasVoted: false,
  },
  {
    id: 'dec-maccabi-3',
    channel_id: 'channel-maccabi',
    organization: 'מכבי - הנהלה',
    question: 'האם לשדרג את אולם האימונים?',
    description: 'השקעה בשדרוג מתקני האימון',
    postedDaysAgo: 35,
    daysRemaining: 5,
    totalVotes: 1234,
    options: [
      { id: '1', label: 'בעד', votes: 987, percentage: 80 },
      { id: '2', label: 'נגד', votes: 247, percentage: 20 },
    ],
    hasVoted: false,
  },
];

export default function DecisionsPage() {
  const navigate = useNavigate();
  const { selectedChannel } = useChannel();
  const [filteredDecisions, setFilteredDecisions] = useState(allDecisions);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  // Filter decisions by channel
  useEffect(() => {
    const filtered = allDecisions.filter(decision => {
      if (selectedChannel.id === null) {
        return decision.channel_id === null;
      } else {
        return decision.channel_id === selectedChannel.id;
      }
    });
    
    setFilteredDecisions(filtered);
    setCurrentIndex(0); // Reset to first decision
  }, [selectedChannel.id]);

  const currentDecision = filteredDecisions[currentIndex];

  const handleVote = (optionId: string) => {
    const updatedDecisions = filteredDecisions.map(dec => {
      if (dec.id === currentDecision.id) {
        return { ...dec, hasVoted: true };
      }
      return dec;
    });
    
    setFilteredDecisions(updatedDecisions);
    
    // Show results for 5 seconds then auto-advance
    setTimeout(() => {
      if (currentIndex < filteredDecisions.length - 1) {
        // Scroll to next decision
        const container = document.querySelector('.decisions-container');
        if (container) {
          container.scrollTo({
            top: (currentIndex + 1) * window.innerHeight,
            behavior: 'smooth'
          });
        }
        setCurrentIndex(currentIndex + 1);
      }
    }, 5000);
  };

  if (!currentDecision) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900/40 to-black pb-20">
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="fixed top-4 left-4 z-50">
          <ChannelSelector />
        </div>

        <div className="flex flex-col items-center justify-center h-screen text-white px-6">
          <div className="text-6xl mb-4">🗳️</div>
          <h3 className="text-2xl font-bold mb-2">אין החלטות פעילות</h3>
          <p className="text-white/60 text-center">
            {selectedChannel.id === null 
              ? 'אין החלטות פעילות כרגע ב-Coali'
              : `אין החלטות פעילות ב${selectedChannel.name}`
            }
          </p>
        </div>
        
        <Navigation zoozBalance={999} />
      </div>
    );
  }

  if (!currentDecision) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900/40 to-black pb-20">
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="fixed top-4 right-4 z-50">
          <ChannelSelector />
        </div>

        <div className="flex flex-col items-center justify-center h-screen text-white px-6">
          <div className="text-6xl mb-4">🗳️</div>
          <h3 className="text-2xl font-bold mb-2">אין החלטות פעילות</h3>
          <p className="text-white/60 text-center">
            {selectedChannel.id === null 
              ? 'אין החלטות פעילות כרגע ב-Coali'
              : `אין החלטות פעילות ב${selectedChannel.name}`
            }
          </p>
        </div>
        
        <Navigation zoozBalance={999} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-black" />

      {/* Back Button - Left */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Channel Selector - Right */}
      <div className="fixed top-4 right-4 z-50">
        <ChannelSelector />
      </div>

      {/* Scrollable Decisions Feed */}
      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory pt-[80px] pb-20" style={{ scrollSnapType: 'y mandatory' }}>
        {filteredDecisions.map((decision, idx) => (
          <div key={decision.id} className="h-screen w-full snap-start snap-always flex flex-col relative">
            {/* Decision Card */}
            <div className="flex justify-center pt-8 px-4">
              <div className="flex flex-col items-center p-4 mt-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <div className="flex items-center justify-center mb-3">
                  <h3 className="text-white font-bold text-lg text-center">{decision.organization}</h3>
                </div>
                <div className="flex items-center justify-center gap-2 text-white/80 text-xs whitespace-nowrap">
                  <span>לפני {decision.postedDaysAgo} ימים</span>
                  <span>•</span>
                  <span>{decision.daysRemaining} ימים נותרו</span>
                  <span>•</span>
                  <span>{decision.totalVotes.toLocaleString()} הצבעות</span>
                </div>
              </div>
            </div>

            {/* Question and Options */}
            <div className="flex-1 flex flex-col justify-start px-6 py-4 overflow-y-auto">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
                  {decision.question}
                </h2>
                <p className="text-white/90 text-base leading-relaxed">
                  {decision.description}
                </p>
              </div>

              {/* Voting Options */}
              <div className="space-y-4 max-w-md mx-auto w-full">
                {decision.options.map((option: any) => (
                  <div key={option.id}>
                    <button
                      onClick={() => handleVote(option.id)}
                      disabled={decision.hasVoted}
                      className="w-full p-4 rounded-2xl backdrop-blur-sm transition-all duration-200 text-white font-medium text-lg border-2 bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {option.label}
                      {decision.hasVoted && (
                        <span className="ml-3 text-sm">({option.percentage.toFixed(1)}%)</span>
                      )}
                    </button>
                    {decision.hasVoted && (
                      <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white/40"
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Vote Status */}
              <div className="mt-8 mb-8 max-w-md mx-auto w-full">
                <button
                  disabled={!decision.hasVoted}
                  className="w-full py-4 text-lg font-bold rounded-2xl transition-all duration-200 bg-white/20 text-white/60 cursor-not-allowed disabled:opacity-50 enabled:bg-primary enabled:text-primary-foreground enabled:cursor-pointer"
                >
                  {decision.hasVoted ? 'הצבעת ✓' : 'הצבע עכשיו'}
                </button>
              </div>
            </div>

            {/* Scroll indicator */}
            {idx < filteredDecisions.length - 1 && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60 text-sm animate-bounce">
                ↑ החלטה הבאה
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={999} />
    </div>
  );
}
