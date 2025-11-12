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
        } else {
          console.error('❌ No poll_options in response!');
        }
        
        console.log('✅ Vote saved successfully');
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to save vote. Status:', response.status);
        console.error('❌ Error:', errorText);
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

  // TEMPORARY: Minimal render for testing
  return (
    <article className="bg-white shadow-lg rounded-b-xl overflow-hidden mb-4 p-4">
      <h3 className="text-lg font-bold">{news.title}</h3>
      <p>Category: {news.categoryLabel || news.category}</p>
      <p>ID: {news.id}</p>
    </article>
  );
  );
}
