import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { isRealUser } from "@/utils/demoFilter";

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    image: string;
    category: string;
    categoryLabel: string;
    expert_comments?: Array<{
      user_id: string;
      user_name: string;
      user_avatar: string;
    }>;
    poll_options: Array<{
      id: string;
      label: string;
      votes: number;
      voter_ids?: string[];
    }>;
    total_votes?: number;
  };
  currentUser?: any;
  userProfile?: any;
}

// Demo users from database (matching WalletPage structure)
const demoExpertUsers = [
  { id: '1', name: 'נועה רותם', avatar: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg' },
  { id: '2', name: 'דוד לוי', avatar: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg' },
  { id: '3', name: 'רחל כהן', avatar: 'https://trust.coali.app/assets/rachel-profile-w3gZXC9S.jpg' },
  { id: '4', name: 'אמית ברק', avatar: 'https://trust.coali.app/assets/amit-profile-CprpaaC6.jpg' },
  { id: '5', name: 'מיכל שמיר', avatar: 'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg' },
  { id: '6', name: 'יוסי בן-דוד', avatar: 'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg' },
  { id: '7', name: 'תמר פרץ', avatar: 'https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg' },
];

export function NewsCard({ news, currentUser, userProfile }: NewsCardProps) {
  console.log('🎴 NewsCard rendering for:', news.id);
  
  const navigate = useNavigate();
  const [expertsExpanded, setExpertsExpanded] = useState(true);
  const [pollExpanded, setPollExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [localPollOptions, setLocalPollOptions] = useState(news.poll_options || []);
  const [localTotalVotes, setLocalTotalVotes] = useState(news.total_votes || 0);
  const [manuallyOpened, setManuallyOpened] = useState(false);
  // FIXED: Use real demo users from database, pick random 3-6 experts per news
  const [demoExperts] = useState(() => {
    const shuffled = [...demoExpertUsers].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * 4) + 3; // 3-6 experts
    return shuffled.slice(0, count);
  });
  
  console.log('🎴 Poll options:', localPollOptions);

  // Check if current user is expert in this category
  const isExpertInCategory = () => {
    if (!isRealUser() || !userProfile) return false;
    const expertises = userProfile.expertises || [];
    return expertises.some((exp: string) => 
      exp.toLowerCase() === news.category.toLowerCase()
    );
  };

  // Debug: Log when poll options change
  useEffect(() => {
    console.log('🔄 Poll options updated:', localPollOptions);
    console.log('🔄 Total votes:', localTotalVotes);
  }, [localPollOptions, localTotalVotes]);

  // Calculate poll percentages - simple and safe
  const totalVotes = localTotalVotes || localPollOptions.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 100;
  const pollWithPercentages = localPollOptions.map(opt => ({
    ...opt,
    percentage: totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0
  }));

  // Get top 2 options for progress bar
  const sortedOptions = [...pollWithPercentages].sort((a, b) => b.votes - a.votes);
  const topTwo = sortedOptions.slice(0, 2);

  // Get user ID
  const getUserId = () => {
    if (isRealUser() && currentUser) {
      return currentUser.id;
    }
    // Demo mode: use localStorage
    let demoUserId = localStorage.getItem('demo_user_id');
    if (!demoUserId) {
      demoUserId = `demo-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('demo_user_id', demoUserId);
    }
    return demoUserId;
  };

  const handleVote = async (optionId: string) => {
    console.log('🎯 handleVote CALLED!', optionId);
    
    if (isVoting) {
      console.log('⏳ Already voting, returning...');
      return;
    }
    
    console.log('✅ Starting vote process...');
    setIsVoting(true);
    setSelectedOption(optionId);
    
    try {
      const userId = getUserId();
      // Always use /api path (Kubernetes ingress routes to backend)
      const BACKEND_URL = '/api';
      
      console.log('🔗 Backend URL:', BACKEND_URL);
      console.log('🔗 Full vote URL:', `${BACKEND_URL}/news/vote`);
      console.log('🔗 Voting for news:', news.id, 'option:', optionId, 'user:', userId);
      
      const response = await fetch(`${BACKEND_URL}/news/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          news_id: news.id,
          option_id: optionId,
          user_id: userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        console.log('📊 Vote response data:', JSON.stringify(data, null, 2));
        console.log('📊 Old poll options:', JSON.stringify(localPollOptions, null, 2));
        console.log('📊 Old total votes:', localTotalVotes);
        
        // Update local state with new vote data
        if (data.poll_options) {
          console.log('✅ NEW poll options from API:', JSON.stringify(data.poll_options, null, 2));
          console.log('✅ NEW total votes from API:', data.total_votes);
          
          // Force new array to trigger re-render
          setLocalPollOptions([...data.poll_options]);
          setLocalTotalVotes(data.total_votes || 0);
          
          // Also save to localStorage for persistence
          saveVoteToLocalStorage(news.id, data.poll_options, data.total_votes);
        } else {
          console.error('❌ No poll_options in response!');
        }
        
        console.log('✅ Vote saved successfully');
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to save vote. Status:', response.status);
        console.error('❌ Error:', errorText);
        
        // If API fails (e.g., news not in DB), handle vote locally
        if (response.status === 404 || response.status === 400) {
          console.log('📱 Handling vote locally for placeholder news');
          handleLocalVote(optionId, userId);
        }
      }
    } catch (error) {
      console.error('❌ Error voting:', error);
    } finally {
      setIsVoting(false);
      
      // Always close poll after 3.5 seconds after voting
      setTimeout(() => {
        setPollExpanded(false);
        setManuallyOpened(false); // Reset flag
      }, 3500);
    }
  };

  const handleRecordVideo = () => {
    // Phase 3: Open video recorder
    console.log('Open video recorder for news:', news.id);
  };

  // Safety check
  if (!news || !news.id || !localPollOptions) {
    console.error('❌ Invalid news data:', news);
    return null;
  }

  console.log('🎴 About to render JSX for:', news.id);

  return (
    <article className="bg-white shadow-lg rounded-b-xl overflow-hidden mb-4 transition-shadow">
      <div className="px-2 py-5">
        <div className="flex gap-3 cursor-pointer" onClick={() => navigate(`/news/${news.id}`)}>
          <img
            src={news.image || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=300&h=200&fit=crop'}
            alt={news.title || 'News'}
            className="w-24 h-18 rounded-md object-cover flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 leading-tight mb-2 line-clamp-2">
              {news.title || 'כותרת'}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{news.categoryLabel || news.category || 'כללי'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Comments Section */}
      <div className="w-full px-2 pb-1 -mt-1">
        <div className="flex items-center gap-1 mb-1">
          <span className="font-medium text-foreground text-sm">דעת המומחים</span>
          <button
            onClick={() => setExpertsExpanded(!expertsExpanded)}
            className="ml-auto p-1 hover:bg-muted rounded-sm transition-colors"
          >
            {expertsExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {expertsExpanded && (
          <div className="relative animate-fade-in">
            <div className="relative">
              {/* Gradient overlay on left */}
              <div className="absolute left-0 top-0 w-20 h-12 bg-gradient-to-r from-white from-75% to-white/50 z-40" />
              
              {/* Current user with + button (if expert in category) */}
              {isExpertInCategory() && (
                <button
                  onClick={handleRecordVideo}
                  className="absolute left-0 top-0 z-50 group"
                >
                  <div className="relative">
                    <img
                      src={userProfile?.avatar_url || '/assets/yaakov-profile-B9QmZK8h.jpg'}
                      alt={userProfile?.full_name || 'User'}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </button>
              )}

              {/* Scrollable expert list */}
              <div className="overflow-x-auto pl-16 scrollbar-hide" dir="rtl">
                <div className="flex gap-1 pt-1">
                  {demoExperts.map((expert) => (
                    <button
                      key={expert.id}
                      className="relative flex-shrink-0"
                      onClick={() => console.log('Open expert video:', expert.name)}
                    >
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm hover:scale-110 transition-transform"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Poll Section */}
      <div className="-mx-4 border-t border-slate-200/50 bg-card shadow-sm !rounded-none">
        <div
          className="w-full p-4 cursor-pointer hover:bg-muted/30 transition-all duration-200 rounded-none"
          onClick={() => {
            if (!pollExpanded) {
              setPollExpanded(true);
              setManuallyOpened(true);
            } else {
              setPollExpanded(false);
              setManuallyOpened(false);
            }
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 ml-2 px-[7px]">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:text-accent-foreground rounded-md h-7 px-2 text-xs border-primary/20 text-primary hover:bg-primary/10">
                מה דעתך?
              </button>
              <ChevronDown className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                pollExpanded && "rotate-180"
              )} />
            </div>
          </div>

          {/* Progress bar with top 2 options */}
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground mr-2">
              <span>{topTwo[0]?.percentage || 0}% {topTwo[0]?.label}</span>
              <span>•</span>
              <span>{topTwo[1]?.percentage || 0}% {topTwo[1]?.label}</span>
            </div>
            <div className="relative h-2 bg-muted overflow-hidden">
              <div
                className="absolute right-0 top-0 h-full bg-primary transition-all duration-500"
                style={{ width: `${topTwo[0]?.percentage || 0}%` }}
              />
              <div
                className="absolute top-0 h-full bg-secondary transition-all duration-500"
                style={{
                  right: `${topTwo[0]?.percentage || 0}%`,
                  width: `${topTwo[1]?.percentage || 0}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Expanded poll options */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out border-t border-border/50",
            pollExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {pollExpanded && (
            <div className="p-4 space-y-3">
              <div className="text-center mb-4">
                <h4 className="font-semibold text-lg mb-1">מה דעתך על {news.categoryLabel}?</h4>
              </div>

              {pollWithPercentages.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={isVoting}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 transition-all duration-200 text-right",
                    selectedOption === option.id
                      ? "bg-green-50 border-green-500"
                      : "bg-white border-slate-200 hover:border-primary/50",
                    isVoting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedOption === option.id && !isVoting && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      {isVoting && selectedOption === option.id && (
                        <div className="w-6 h-6">
                          <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      )}
                      <span className="font-medium text-base">{option.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{option.percentage}%</span>
                      <span className="text-sm text-muted-foreground">({option.votes})</span>
                    </div>
                  </div>
                </button>
              ))}

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-muted-foreground">תוצאות חיות</span>
                <span className="text-sm font-medium">סה״כ: {totalVotes}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
