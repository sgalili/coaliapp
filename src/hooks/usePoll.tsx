import { useMemo } from 'react';
import { usePollContext, mockPolls, Poll, PollVote, PollResults } from '../contexts/PollContext';

export const usePoll = (newsId: string) => {
  const { votes, userVotes, submitVote } = usePollContext();
  
  const poll = mockPolls[newsId];
  const pollVotes = poll ? votes[poll.id] || [] : [];
  
  const hasUserVoted = poll ? !!userVotes[poll.id] : false;

  const calculateResults = useMemo((): PollResults => {
    if (!poll) return {};
    
    const results: PollResults = {};
    const totalVotes = pollVotes.length;
    
    // Initialize all options
    poll.options.forEach(option => {
      results[option] = {
        count: 0,
        percentage: 0,
        voters: []
      };
    });
    
    // Count votes
    pollVotes.forEach(vote => {
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
  }, [poll, pollVotes]);

  const handleSubmitVote = (option: string) => {
    if (!poll || hasUserVoted) return;
    submitVote(poll.id, option);
  };

  return {
    poll,
    hasUserVoted,
    userVote: poll ? userVotes[poll.id] : undefined,
    results: calculateResults,
    totalVotes: pollVotes.length,
    submitVote: handleSubmitVote
  };
};