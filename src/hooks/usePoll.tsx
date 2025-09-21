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
  'news-1': {
    id: 'poll-1',
    newsId: 'news-1',
    question: 'מה דעתך על חוק השידור החדש?',
    pollType: 'multiple_choice',
    options: ['תומך', 'מתנגד', 'צריך שינויים', 'לא בטוח'],
    isActive: true
  },
  'news-2': {
    id: 'poll-2',
    newsId: 'news-2',
    question: 'איך הבלוקצ\'יין ישפיע על הכלכלה?',
    pollType: 'multiple_choice',
    options: ['מהפכני', 'חיובי', 'מועט', 'שלילי'],
    isActive: true
  },
  'news-3': {
    id: 'poll-3',
    newsId: 'news-3',
    question: 'מה הפתרון הטוב ביותר למשבר הדיור?',
    pollType: 'multiple_choice',
    options: ['בנייה ממשלתית', 'הקלות מס', 'פיקוח מחירים', 'פתרונות חדשניים'],
    isActive: true
  },
  'news-4': {
    id: 'poll-4',
    newsId: 'news-4',
    question: 'מה דעתך על זכיית המכבי?',
    pollType: 'multiple_choice',
    options: ['מרגש מאוד', 'משמח', 'צפוי', 'לא מעניין'],
    isActive: true
  }
};

// Mock votes with avatars
const mockVotes: { [pollId: string]: PollVote[] } = {
  'poll-1': [
    { id: '1', pollId: 'poll-1', userId: '1', optionSelected: 'תומך', userImage: '/src/assets/sarah-profile.jpg', userName: 'שרה' },
    { id: '2', pollId: 'poll-1', userId: '2', optionSelected: 'מתנגד', userImage: '/src/assets/david-profile.jpg', userName: 'דוד' },
    { id: '3', pollId: 'poll-1', userId: '3', optionSelected: 'תומך', userImage: '/src/assets/maya-profile.jpg', userName: 'מיה' },
  ],
  'poll-2': [
    { id: '4', pollId: 'poll-2', userId: '4', optionSelected: 'מהפכני', userImage: '/src/assets/amit-profile.jpg', userName: 'עמית' },
    { id: '5', pollId: 'poll-2', userId: '5', optionSelected: 'חיובי', userImage: '/src/assets/rachel-profile.jpg', userName: 'רחל' },
  ],
  'poll-3': [
    { id: '6', pollId: 'poll-3', userId: '6', optionSelected: 'בנייה ממשלתית', userImage: '/src/assets/sarah-profile.jpg', userName: 'שרה' },
    { id: '7', pollId: 'poll-3', userId: '7', optionSelected: 'הקלות מס', userImage: '/src/assets/david-profile.jpg', userName: 'דוד' },
    { id: '8', pollId: 'poll-3', userId: '8', optionSelected: 'בנייה ממשלתית', userImage: '/src/assets/maya-profile.jpg', userName: 'מיה' },
    { id: '9', pollId: 'poll-3', userId: '9', optionSelected: 'פתרונות חדשניים', userImage: '/src/assets/amit-profile.jpg', userName: 'עמית' },
  ],
  'poll-4': [
    { id: '10', pollId: 'poll-4', userId: '10', optionSelected: 'מרגש מאוד', userImage: '/src/assets/sarah-profile.jpg', userName: 'שרה' },
    { id: '11', pollId: 'poll-4', userId: '11', optionSelected: 'משמח', userImage: '/src/assets/david-profile.jpg', userName: 'דוד' },
    { id: '12', pollId: 'poll-4', userId: '12', optionSelected: 'מרגש מאוד', userImage: '/src/assets/maya-profile.jpg', userName: 'מיה' },
    { id: '13', pollId: 'poll-4', userId: '13', optionSelected: 'צפוי', userImage: '/src/assets/amit-profile.jpg', userName: 'עמית' },
    { id: '14', pollId: 'poll-4', userId: '14', optionSelected: 'משמח', userImage: '/src/assets/rachel-profile.jpg', userName: 'רחל' },
    { id: 'current-user', pollId: 'poll-4', userId: 'current-user', optionSelected: 'מרגש מאוד', userImage: '/src/assets/sarah-profile.jpg', userName: 'את/ה' }
  ]
};

export const usePoll = (newsId: string) => {
  const [userVotes, setUserVotes] = useState<{ [pollId: string]: string }>(() => {
    // Initialize from localStorage
    const userVotesKey = `userVotes`;
    const stored = localStorage.getItem(userVotesKey);
    const storedVotes = stored ? JSON.parse(stored) : {};
    return {
      'poll-4': 'מרגש מאוד', // Simuler que l'utilisateur a voté sur la news 4
      ...storedVotes
    };
  });
  
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
    
    // Store in localStorage for persistence
    const userVotesKey = `userVotes`;
    const existingVotes = JSON.parse(localStorage.getItem(userVotesKey) || '{}');
    const updatedVotes = { 
      ...existingVotes, 
      [poll.id]: option 
    };
    localStorage.setItem(userVotesKey, JSON.stringify(updatedVotes));
    
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