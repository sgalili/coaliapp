/**
 * Trust Delegation Service
 * Frontend service for trust-based delegated voting
 */

import { supabase } from '@/integrations/supabase/client';

export interface TrustDelegation {
  id: string;
  truster_id: string;
  trusted_id: string;
  expertise_field: string;
  is_active: boolean;
  created_at: string;
  revoked_at?: string;
}

export interface DelegatedVote {
  id: string;
  user_id: string;
  decision_id: string;
  vote_value: string;
  is_delegated: boolean;
  delegated_by?: string;
  can_withdraw: boolean;
  created_at: string;
  withdrawn_at?: string;
  decision?: any;
  time_remaining_seconds?: number;
  can_withdraw_now?: boolean;
}

export const trustDelegationService = {
  /**
   * Create trust delegation to an expert in a specific field
   */
  async createDelegation(trusterId: string, trustedId: string, expertiseField: string) {
    try {
      const { data, error } = await supabase
        .from('trust_delegations')
        .upsert({
          truster_id: trusterId,
          trusted_id: trustedId,
          expertise_field: expertiseField,
          is_active: true
        }, { onConflict: 'truster_id,trusted_id,expertise_field' })
        .select()
        .single();

      if (error) throw error;

      return { success: true, delegation: data };
    } catch (error) {
      console.error('Error creating delegation:', error);
      return { success: false, error };
    }
  },

  /**
   * Revoke trust delegation
   */
  async revokeDelegation(trusterId: string, trustedId: string, expertiseField: string) {
    try {
      const { data, error } = await supabase
        .from('trust_delegations')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString()
        })
        .eq('truster_id', trusterId)
        .eq('trusted_id', trustedId)
        .eq('expertise_field', expertiseField)
        .select();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error revoking delegation:', error);
      return { success: false, error };
    }
  },

  /**
   * Expert votes and triggers delegated votes
   */
  async expertVote(expertId: string, decisionId: string, voteValue: string) {
    try {
      // 1. Record expert's vote
      const { data: expertVote, error: voteError } = await supabase
        .from('user_votes')
        .upsert({
          user_id: expertId,
          decision_id: decisionId,
          vote_value: voteValue,
          is_delegated: false
        }, { onConflict: 'user_id,decision_id' })
        .select()
        .single();

      if (voteError) throw voteError;

      // 2. Get decision details
      const { data: decision, error: decisionError } = await supabase
        .from('demo_decisions')
        .select('category, withdrawal_deadline')
        .eq('id', decisionId)
        .single();

      if (decisionError) throw decisionError;

      const category = decision?.category || 'כללי';

      // 3. Get all users who trust this expert in this field
      const { data: delegators, error: delegatorsError } = await supabase
        .from('trust_delegations')
        .select('truster_id')
        .eq('trusted_id', expertId)
        .eq('expertise_field', category)
        .eq('is_active', true);

      if (delegatorsError) throw delegatorsError;

      const triggeredVotes = [];

      // 4. Create delegated votes
      for (const delegator of (delegators || [])) {
        const userId = delegator.truster_id;

        // Skip if user already voted directly
        const { data: existing } = await supabase
          .from('user_votes')
          .select('is_delegated')
          .eq('user_id', userId)
          .eq('decision_id', decisionId)
          .maybeSingle();

        if (existing && !existing.is_delegated) {
          continue; // User voted directly
        }

        // Create delegated vote
        await supabase.from('user_votes').upsert({
          user_id: userId,
          decision_id: decisionId,
          vote_value: voteValue,
          is_delegated: true,
          delegated_by: expertId,
          can_withdraw: true
        }, { onConflict: 'user_id,decision_id' });

        triggeredVotes.push(userId);

        // Send notification
        await supabase.from('delegation_notifications').insert({
          user_id: userId,
          decision_id: decisionId,
          expert_id: expertId,
          expert_vote: voteValue,
          notification_type: 'vote_triggered'
        });
      }

      // 5. Log delegation
      await supabase.from('vote_delegations_log').insert({
        decision_id: decisionId,
        expert_id: expertId,
        expert_vote_value: voteValue,
        affected_users_count: triggeredVotes.length,
        votes_triggered: triggeredVotes
      });

      return {
        success: true,
        expertVote,
        delegatedVotesTriggered: triggeredVotes.length,
        affectedUsers: triggeredVotes
      };
    } catch (error) {
      console.error('Error in expert vote:', error);
      return { success: false, error };
    }
  },

  /**
   * Withdraw or change delegated vote
   */
  async withdrawVote(
    userId: string,
    decisionId: string,
    action: 'change' | 'remove',
    newVoteValue?: string
  ) {
    try {
      // Check deadline
      const { data: decision } = await supabase
        .from('demo_decisions')
        .select('withdrawal_deadline')
        .eq('id', decisionId)
        .single();

      if (!decision) {
        return { success: false, error: 'Decision not found' };
      }

      const deadline = new Date(decision.withdrawal_deadline);
      if (new Date() >= deadline) {
        return { success: false, error: 'Withdrawal deadline has passed' };
      }

      // Get vote
      const { data: vote } = await supabase
        .from('user_votes')
        .select('*')
        .eq('user_id', userId)
        .eq('decision_id', decisionId)
        .single();

      if (!vote) {
        return { success: false, error: 'Vote not found' };
      }

      const originalValue = vote.vote_value;

      if (action === 'remove') {
        // Delete vote
        await supabase.from('user_votes').delete().eq('id', vote.id);

        // Log withdrawal
        await supabase.from('vote_withdrawals').insert({
          vote_id: vote.id,
          user_id: userId,
          decision_id: decisionId,
          original_vote: originalValue,
          action: 'removed'
        });

        return { success: true, action: 'removed' };
      } else if (action === 'change') {
        // Update to direct vote
        await supabase
          .from('user_votes')
          .update({
            vote_value: newVoteValue,
            is_delegated: false,
            delegated_by: null,
            can_withdraw: false,
            withdrawn_at: new Date().toISOString()
          })
          .eq('id', vote.id);

        // Log withdrawal
        await supabase.from('vote_withdrawals').insert({
          vote_id: vote.id,
          user_id: userId,
          decision_id: decisionId,
          original_vote: originalValue,
          new_vote: newVoteValue,
          action: 'changed'
        });

        return { success: true, action: 'changed', newVote: newVoteValue };
      }

      return { success: false, error: 'Invalid action' };
    } catch (error) {
      console.error('Error withdrawing vote:', error);
      return { success: false, error };
    }
  },

  /**
   * Get user's active delegated votes with countdown info
   */
  async getMyDelegatedVotes(userId: string): Promise<DelegatedVote[]> {
    try {
      const { data, error } = await supabase
        .from('user_votes')
        .select(`
          *,
          decision:demo_decisions(*),
          expert:profiles!user_votes_delegated_by_fkey(*)
        `)
        .eq('user_id', userId)
        .eq('is_delegated', true)
        .eq('can_withdraw', true);

      if (error) throw error;

      const now = new Date();
      
      return (data || []).map(vote => {
        const decision = vote.decision;
        const deadline = new Date(decision?.withdrawal_deadline);
        const timeRemaining = Math.floor((deadline.getTime() - now.getTime()) / 1000);

        return {
          ...vote,
          time_remaining_seconds: Math.max(0, timeRemaining),
          can_withdraw_now: timeRemaining > 0
        };
      });
    } catch (error) {
      console.error('Error getting delegated votes:', error);
      return [];
    }
  },

  /**
   * Calculate time remaining formatted
   */
  formatTimeRemaining(seconds: number): string {
    if (seconds <= 0) return 'פג תוקף';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} שעות ו-${minutes} דקות`;
    } else if (minutes > 0) {
      return `${minutes} דקות`;
    } else {
      return `${seconds} שניות`;
    }
  }
};
