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
  '1': {
    id: 'poll-1',
    newsId: '1',
    question: 'מה דעתך על הצעת החוק החדשה?',
    pollType: 'yes_no',
    options: ['בעד', 'נגד'],
    isActive: true
  },
  '2': {
    id: 'poll-2',
    newsId: '2',
    question: 'איך אתה מדרג את הביצועים הכלכליים?',
    pollType: 'rating_1_5',
    options: ['1', '2', '3', '4', '5'],
    isActive: true
  },
  '3': {
    id: 'poll-3',
    newsId: '3',
    question: 'איזה פתרון הכי טוב לבעיית התחבורה?',
    pollType: 'multiple_choice',
    options: ['תחבורה ציבורית', 'אופניים חשמליים', 'מכוניות חשמליות', 'הליכה רגלית'],
    isActive: true
  }
};

// Mock votes with avatars
const mockVotes: { [pollId: string]: PollVote[] } = {
  'poll-1': [
    { id: '1', pollId: 'poll-1', userId: '1', optionSelected: 'בעד', userImage: '/src/assets/sarah-profile.jpg', userName: 'שרה' },
    { id: '2', pollId: 'poll-1', userId: '2', optionSelected: 'בעד', userImage: '/src/assets/david-profile.jpg', userName: 'דוד' },
    { id: '3', pollId: 'poll-1', userId: '3', optionSelected: 'נגד', userImage: '/src/assets/maya-profile.jpg', userName: 'מיה' },
    { id: '4', pollId: 'poll-1', userId: '4', optionSelected: 'בעד', userImage: '/src/assets/amit-profile.jpg', userName: 'עמית' },
  ],
  'poll-2': [
    { id: '5', pollId: 'poll-2', userId: '1', optionSelected: '4', userImage: '/src/assets/rachel-profile.jpg', userName: 'רחל' },
    { id: '6', pollId: 'poll-2', userId: '2', optionSelected: '3', userImage: '/src/assets/noa-profile.jpg', userName: 'נועה' },
    { id: '7', pollId: 'poll-2', userId: '3', optionSelected: '4', userImage: '/src/assets/sarah-profile.jpg', userName: 'שרה' },
  ]
};

export const usePoll = (newsId: string) => {
  const [userVotes, setUserVotes] = useState<{ [pollId: string]: string }>({});
  
  const poll = mockPolls[newsId];
  const votes = poll ? mockVotes[poll.id] || [] : [];
  
  const hasUserVoted = poll ? !!userVotes[poll.id] : false;

  const calculateResults = (): PollResults => {
    if (!poll) return {};
    
    const results: PollResults = {};
    const totalVotes = votes.length;
    
    // Initialize all options
    poll.options.forEach(option => {
      results[option] = {
        count: 0,
        percentage: 0,
        voters: []
      };
    });
    
    // Count votes
    votes.forEach(vote => {
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
    userVote: poll ? userVotes[poll.id] : undefined,
    results: calculateResults(),
    totalVotes: votes.length,
    submitVote
  };
};