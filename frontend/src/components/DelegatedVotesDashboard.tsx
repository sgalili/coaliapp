/**
 * My Delegated Votes Dashboard
 * Shows all active delegated votes with countdown and withdrawal options
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, ThumbsUp, ThumbsDown, MinusCircle, Edit3, X } from 'lucide-react';
import { trustDelegationService, DelegatedVote } from '@/services/trustDelegationService';
import { cn } from '@/lib/utils';

interface DelegatedVotesDashboardProps {
  userId: string;
}

export const DelegatedVotesDashboard: React.FC<DelegatedVotesDashboardProps> = ({ userId }) => {
  const [delegatedVotes, setDelegatedVotes] = useState<DelegatedVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<{[key: string]: number}>({});

  useEffect(() => {
    loadDelegatedVotes();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadDelegatedVotes, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        const updated = {...prev};
        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) {
            updated[key] -= 1;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadDelegatedVotes = async () => {
    setLoading(true);
    try {
      const votes = await trustDelegationService.getMyDelegatedVotes(userId);
      setDelegatedVotes(votes);

      // Initialize countdown
      const initialCountdown: {[key: string]: number} = {};
      votes.forEach(vote => {
        if (vote.time_remaining_seconds) {
          initialCountdown[vote.id] = vote.time_remaining_seconds;
        }
      });
      setCountdown(initialCountdown);
    } catch (error) {
      console.error('Error loading delegated votes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (voteId: string, decisionId: string, action: 'change' | 'remove', newValue?: string) => {
    try {
      const result = await trustDelegationService.withdrawVote(userId, decisionId, action, newValue);
      
      if (result.success) {
        // Reload votes
        await loadDelegatedVotes();
      } else {
        alert(result.error || 'שגיאה בביטול ההצבעה');
      }
    } catch (error) {
      console.error('Error withdrawing vote:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-muted-foreground mt-2">טוען הצבעות...</p>
      </div>
    );
  }

  if (delegatedVotes.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">אין לך הצבעות מואצלות פעילות</p>
        <p className="text-sm text-muted-foreground mt-2">
          כאשר מומחה שאתה נותן לו אמון מצביע, תקבל הודעה כאן
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">ההצבעות המואצלות שלי</h2>
      
      {delegatedVotes.map(vote => {
        const decision = vote.decision || {};
        const timeLeft = countdown[vote.id] || 0;
        const canWithdraw = timeLeft > 0;

        return (
          <div 
            key={vote.id}
            className={cn(
              "bg-card border rounded-lg p-4 space-y-3",
              !canWithdraw && "opacity-60"
            )}
          >
            {/* Decision Info */}
            <div>
              <h3 className="font-medium mb-1">{decision.title}</h3>
              <p className="text-sm text-muted-foreground">{decision.description}</p>
            </div>

            {/* Expert Vote Info */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">מומחה הצביע:</span>{' '}
                  <span className={cn(
                    "font-bold",
                    vote.vote_value === 'yes' && "text-green-600",
                    vote.vote_value === 'no' && "text-red-600"
                  )}>
                    {vote.vote_value === 'yes' ? 'בעד' : vote.vote_value === 'no' ? 'נגד' : 'נמנע'}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  על ידי {vote.expert?.full_name || 'מומחה'}
                </p>
              </div>
              {vote.vote_value === 'yes' && <ThumbsUp className="w-5 h-5 text-green-600" />}
              {vote.vote_value === 'no' && <ThumbsDown className="w-5 h-5 text-red-600" />}
              {vote.vote_value === 'abstain' && <MinusCircle className="w-5 h-5 text-gray-600" />}
            </div>

            {/* Countdown */}
            <div className={cn(
              "flex items-center gap-2 p-2 rounded",
              canWithdraw ? "bg-yellow-50 border border-yellow-200" : "bg-gray-100"
            )}>
              <Clock className={cn(
                "w-4 h-4",
                canWithdraw ? "text-yellow-600" : "text-gray-400"
              )} />
              <span className="text-sm font-medium">
                {canWithdraw 
                  ? `זמן לשינוי: ${trustDelegationService.formatTimeRemaining(timeLeft)}`
                  : 'ההצבעה ננעלה'}
              </span>
            </div>

            {/* Action Buttons */}
            {canWithdraw && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleWithdraw(vote.id, decision.id, 'remove')}
                  className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <X className="w-4 h-4 inline mr-1" />
                  ביטול הצבעה
                </button>
                <button
                  onClick={() => {
                    const newValue = prompt('בחר הצבעה חדשה: yes (בעד), no (נגד), abstain (נמנע)');
                    if (newValue && ['yes', 'no', 'abstain'].includes(newValue)) {
                      handleWithdraw(vote.id, decision.id, 'change', newValue);
                    }
                  }}
                  className="flex-1 py-2 px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <Edit3 className="w-4 h-4 inline mr-1" />
                  שנה הצבעה
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
