import { useState } from 'react';

export interface Poll {
  id: string;
  newsId: string;
  question: string;
  pollType: 'yes_no' | 'rating_1_5' | 'multiple_choice';
  options: string[];
  isActive: boolean;
}

export interface PollVote {
  id: string;
  pollId: string;
  userId: string;
  optionSelected: string;
  userImage: string;
  userName: string;
}

export interface PollResults {
  [option: string]: {
    count: number;
    percentage: number;
    voters: PollVote[];
  };
}

// Mock poll data
const mockPolls: { [newsId: string]: Poll } = {
  'news-4': {
    id: 'poll-4',
    newsId: 'news-4',
    question: 'מה דעתך על התפתחויות הטכנולוגיה בחינוך?',
    pollType: 'multiple_choice',
    options: ['מהפכני', 'חיובי', 'צריך שיפורים', 'לא רלוונטי'],
    isActive: true
  }
};

// Mock votes with avatars
const mockVotes: { [pollId: string]: PollVote[] } = {
  'poll-4': [
    { id: '1', pollId: 'poll-4', userId: '1', optionSelected: 'מהפכני', userImage: '/src/assets/sarah-profile.jpg', userName: 'שרה' },
    { id: '2', pollId: 'poll-4', userId: '2', optionSelected: 'חיובי', userImage: '/src/assets/david-profile.jpg', userName: 'דוד' },
    { id: '3', pollId: 'poll-4', userId: '3', optionSelected: 'מהפכני', userImage: '/src/assets/maya-profile.jpg', userName: 'מיה' },
    { id: '4', pollId: 'poll-4', userId: '4', optionSelected: 'צריך שיפורים', userImage: '/src/assets/amit-profile.jpg', userName: 'עמית' },
    { id: '5', pollId: 'poll-4', userId: '5', optionSelected: 'חיובי', userImage: '/src/assets/rachel-profile.jpg', userName: 'רחל' },
  ]
};

export const usePoll = (newsId: string) => {
  const [userVotes, setUserVotes] = useState<{ [pollId: string]: string }>({});
  const [showResults, setShowResults] = useState<{ [pollId: string]: boolean }>({});
  
  const poll = mockPolls[newsId];
  const votes = poll ? mockVotes[poll.id] || [] : [];
  
  const hasUserVoted = poll ? !!userVotes[poll.id] : false;
  const shouldShowResults = poll ? showResults[poll.id] || false : false;

  const calculateResults = (): PollResults => {
    if (!poll) return {};
    
    const currentVotes = mockVotes[poll.id] || [];
    const results: PollResults = {};
    const totalVotes = currentVotes.length;
    
    // Initialize all options
    poll.options.forEach(option => {
      results[option] = {
        count: 0,
        percentage: 0,
        voters: []
      };
    });
    
    // Count votes
    currentVotes.forEach(vote => {
      if (results[vote.optionSelected]) {
        results[vote.optionSelected].count++;
        results[vote.optionSelected].voters.push(vote);
      }
    });
    
    // Calculate percentages
    Object.keys(results).forEach(option => {
      results[option].percentage = totalVotes > 0 
        ? Math.round((results[option].count / totalVotes) * 100)
        : 0;
    });
    
    return results;
  };

  const submitVote = (option: string) => {
    if (!poll || hasUserVoted) return;
    
    setUserVotes(prev => ({
      ...prev,
      [poll.id]: option
    }));
    
    // Show results immediately after voting
    setShowResults(prev => ({
      ...prev,
      [poll.id]: true
    }));
    
    // Add mock vote to results
    const newVote: PollVote = {
      id: `vote-${Date.now()}`,
      pollId: poll.id,
      userId: 'current-user',
      optionSelected: option,
      userImage: '/src/assets/sarah-profile.jpg',
      userName: 'את/ה'
    };
    
    mockVotes[poll.id] = [...(mockVotes[poll.id] || []), newVote];
  };

  return {
    poll,
    hasUserVoted,
    showResults: shouldShowResults,
    userVote: poll ? userVotes[poll.id] : undefined,
    results: calculateResults(),
    totalVotes: poll ? (mockVotes[poll.id] || []).length : 0,
    submitVote
  };
};