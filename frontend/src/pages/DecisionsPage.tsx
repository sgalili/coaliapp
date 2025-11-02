import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ChannelSelector } from "@/components/ChannelSelector";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChannel } from "@/contexts/ChannelContext";

const allDecisions = [
  {
    id: 'dec-1',
    channel_id: null, // Coali main
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
    id: 'dec-maccabi-1',
    channel_id: 'channel-maccabi',
    organization: 'מכבי צבי יבנה',
    question: 'איזה שחקן חדש להחתים?',
    description: 'הצבעת אוהדים על שחקן זר',
    postedDaysAgo: 5,
    daysRemaining: 20,
    totalVotes: 5678,
    options: [
      { id: '1', label: 'שחקן A', votes: 3407, percentage: 60 },
      { id: '2', label: 'שחקן B', votes: 2271, percentage: 40 },
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
    setDecisions(prev => prev.map(dec => {
      if (dec.id === currentDecision.id) {
        return { ...dec, hasVoted: true };
      }
      return dec;
    }));
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-black" />

      {/* Back Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Decision Card */}
      <div className="flex justify-center pt-[110px] px-4">
        <div className="flex flex-col items-center p-4 mt-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg animate-fade-in">
          <div className="flex items-center justify-center mb-3">
            <h3 className="text-white font-bold text-lg text-center">{currentDecision.organization}</h3>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/80 text-xs whitespace-nowrap">
            <span>לפני {currentDecision.postedDaysAgo} ימים</span>
            <span>•</span>
            <span>{currentDecision.daysRemaining} ימים נותרו</span>
            <span>•</span>
            <span>{currentDecision.totalVotes.toLocaleString()} הצבעות</span>
          </div>
        </div>
      </div>

      {/* Question and Options */}
      <div className="flex-1 flex flex-col justify-start px-6 py-4 pb-32 overflow-y-auto">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
            {currentDecision.question}
          </h2>
          <p className="text-white/90 text-base leading-relaxed">
            {currentDecision.description}
          </p>
        </div>

        {/* Voting Options */}
        <div className="space-y-4 max-w-md mx-auto w-full">
          {currentDecision.options.map(option => (
            <div key={option.id}>
              <button
                onClick={() => handleVote(option.id)}
                disabled={currentDecision.hasVoted}
                className="w-full p-4 rounded-2xl backdrop-blur-sm transition-all duration-200 text-white font-medium text-lg border-2 bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {option.label}
                {currentDecision.hasVoted && (
                  <span className="ml-3 text-sm">({option.percentage.toFixed(1)}%)</span>
                )}
              </button>
              {currentDecision.hasVoted && (
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

        {/* Vote Button */}
        <div className="mt-8 mb-40 md:mb-20 max-w-md mx-auto w-full">
          <button
            onClick={() => {
              if (!currentDecision.hasVoted && currentIndex < decisions.length - 1) {
                setCurrentIndex(currentIndex + 1);
              }
            }}
            disabled={!currentDecision.hasVoted}
            className="w-full py-4 text-lg font-bold rounded-2xl transition-all duration-200 bg-white/20 text-white/60 cursor-not-allowed disabled:opacity-50 enabled:bg-primary enabled:text-primary-foreground enabled:cursor-pointer"
          >
            {currentDecision.hasVoted ? 'הצבעת ✓' : 'הצבע עכשיו'}
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {decisions.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all ${
                idx === currentIndex ? 'w-6 bg-white' : 'w-1 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={999} />
    </div>
  );
}
