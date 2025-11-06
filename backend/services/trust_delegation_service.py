"""
Trust Delegation Service
Handles trust-based delegated voting logic
"""
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class TrustDelegationService:
    """Service for managing trust delegations and delegated voting"""
    
    def __init__(self, supabase_client):
        self.supabase = supabase_client
    
    async def create_trust_delegation(
        self, 
        truster_id: str, 
        trusted_id: str, 
        expertise_field: str
    ) -> Dict[str, Any]:
        """
        Create a trust delegation from one user to an expert in a specific field
        """
        try:
            # Check if expert has this expertise
            expertise_check = self.supabase.table('user_expertise')\
                .select('*')\
                .eq('user_id', trusted_id)\
                .eq('expertise_field', expertise_field)\
                .execute()
            
            if not expertise_check.data:
                return {
                    'success': False,
                    'error': 'User is not an expert in this field'
                }
            
            # Create delegation
            delegation = self.supabase.table('trust_delegations').upsert({
                'truster_id': truster_id,
                'trusted_id': trusted_id,
                'expertise_field': expertise_field,
                'is_active': True,
                'revoked_at': None
            }, on_conflict='truster_id,trusted_id,expertise_field').execute()
            
            logger.info(f"Trust delegation created: {truster_id} → {trusted_id} in {expertise_field}")
            
            return {
                'success': True,
                'delegation': delegation.data[0] if delegation.data else None
            }
            
        except Exception as e:
            logger.error(f"Error creating trust delegation: {e}")
            return {'success': False, 'error': str(e)}
    
    async def revoke_trust_delegation(
        self,
        truster_id: str,
        trusted_id: str,
        expertise_field: str
    ) -> Dict[str, Any]:
        """Revoke trust delegation"""
        try:
            result = self.supabase.table('trust_delegations')\
                .update({
                    'is_active': False,
                    'revoked_at': datetime.now(timezone.utc).isoformat()
                })\
                .eq('truster_id', truster_id)\
                .eq('trusted_id', trusted_id)\
                .eq('expertise_field', expertise_field)\
                .execute()
            
            return {'success': True, 'updated': len(result.data) if result.data else 0}
        except Exception as e:
            logger.error(f"Error revoking trust: {e}")
            return {'success': False, 'error': str(e)}
    
    async def trigger_delegated_votes(
        self,
        expert_id: str,
        decision_id: str,
        vote_value: str
    ) -> Dict[str, Any]:
        """
        When expert votes, auto-trigger votes for all users who trust them in this field
        """
        try:
            # Get decision details
            decision = self.supabase.table('demo_decisions')\
                .select('*')\
                .eq('id', decision_id)\
                .single()\
                .execute()
            
            if not decision.data:
                return {'success': False, 'error': 'Decision not found'}
            
            decision_category = decision.data.get('category', 'כללי')
            
            # Get all users who trust this expert in this field
            delegators = self.supabase.table('trust_delegations')\
                .select('truster_id')\
                .eq('trusted_id', expert_id)\
                .eq('expertise_field', decision_category)\
                .eq('is_active', True)\
                .execute()
            
            if not delegators.data:
                logger.info(f"No delegators found for expert {expert_id} in {decision_category}")
                return {'success': True, 'affected_users': 0}
            
            triggered_user_ids = []
            
            # Create delegated votes for each user
            for delegator in delegators.data:
                user_id = delegator['truster_id']
                
                # Check if user already voted directly
                existing_vote = self.supabase.table('user_votes')\
                    .select('*')\
                    .eq('user_id', user_id)\
                    .eq('decision_id', decision_id)\
                    .execute()
                
                if existing_vote.data:
                    # User already voted directly, don't override
                    continue
                
                # Create delegated vote
                self.supabase.table('user_votes').upsert({
                    'user_id': user_id,
                    'decision_id': decision_id,
                    'vote_value': vote_value,
                    'is_delegated': True,
                    'delegated_by': expert_id,
                    'can_withdraw': True,
                    'created_at': datetime.now(timezone.utc).isoformat()
                }, on_conflict='user_id,decision_id').execute()
                
                triggered_user_ids.append(user_id)
                
                # Send notification
                await self.send_delegation_notification(
                    user_id, decision_id, expert_id, vote_value
                )
            
            # Log delegation trigger
            self.supabase.table('vote_delegations_log').insert({
                'decision_id': decision_id,
                'expert_id': expert_id,
                'expert_vote_value': vote_value,
                'affected_users_count': len(triggered_user_ids),
                'votes_triggered': triggered_user_ids
            }).execute()
            
            logger.info(f"Delegated votes triggered: {len(triggered_user_ids)} votes")
            
            return {
                'success': True,
                'affected_users': len(triggered_user_ids),
                'triggered_user_ids': triggered_user_ids
            }
            
        except Exception as e:
            logger.error(f"Error triggering delegated votes: {e}")
            return {'success': False, 'error': str(e)}
    
    async def send_delegation_notification(
        self,
        user_id: str,
        decision_id: str,
        expert_id: str,
        vote_value: str
    ) -> None:
        """Send notification to user about delegated vote"""
        try:
            self.supabase.table('delegation_notifications').insert({
                'user_id': user_id,
                'decision_id': decision_id,
                'expert_id': expert_id,
                'expert_vote': vote_value,
                'notification_type': 'vote_triggered',
                'is_read': False
            }).execute()
        except Exception as e:
            logger.error(f"Error sending notification: {e}")
    
    async def withdraw_delegated_vote(
        self,
        user_id: str,
        decision_id: str,
        action: str,  # 'change' or 'remove'
        new_vote_value: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Allow user to withdraw or change their delegated vote
        Only allowed before withdrawal deadline (3 hours before decision end)
        """
        try:
            # Check if withdrawal is still allowed
            decision = self.supabase.table('demo_decisions')\
                .select('withdrawal_deadline, end_date')\
                .eq('id', decision_id)\
                .single()\
                .execute()
            
            if not decision.data:
                return {'success': False, 'error': 'Decision not found'}
            
            withdrawal_deadline = datetime.fromisoformat(decision.data['withdrawal_deadline'])
            now = datetime.now(timezone.utc)
            
            if now >= withdrawal_deadline:
                return {
                    'success': False, 
                    'error': 'Withdrawal deadline passed',
                    'deadline': withdrawal_deadline.isoformat()
                }
            
            # Get original vote
            original_vote = self.supabase.table('user_votes')\
                .select('*')\
                .eq('user_id', user_id)\
                .eq('decision_id', decision_id)\
                .eq('is_delegated', True)\
                .single()\
                .execute()
            
            if not original_vote.data:
                return {'success': False, 'error': 'No delegated vote found'}
            
            vote_id = original_vote.data['id']
            original_value = original_vote.data['vote_value']
            
            if action == 'remove':
                # Delete the vote
                self.supabase.table('user_votes')\
                    .delete()\
                    .eq('id', vote_id)\
                    .execute()
                
                # Log withdrawal
                self.supabase.table('vote_withdrawals').insert({
                    'vote_id': vote_id,
                    'user_id': user_id,
                    'decision_id': decision_id,
                    'original_vote': original_value,
                    'new_vote': None,
                    'action': 'removed'
                }).execute()
                
                return {'success': True, 'action': 'removed'}
                
            elif action == 'change':
                if not new_vote_value:
                    return {'success': False, 'error': 'New vote value required'}
                
                # Update vote to direct vote
                self.supabase.table('user_votes')\
                    .update({
                        'vote_value': new_vote_value,
                        'is_delegated': False,
                        'delegated_by': None,
                        'can_withdraw': False,
                        'withdrawn_at': datetime.now(timezone.utc).isoformat()
                    })\
                    .eq('id', vote_id)\
                    .execute()
                
                # Log withdrawal
                self.supabase.table('vote_withdrawals').insert({
                    'vote_id': vote_id,
                    'user_id': user_id,
                    'decision_id': decision_id,
                    'original_vote': original_value,
                    'new_vote': new_vote_value,
                    'action': 'changed'
                }).execute()
                
                return {'success': True, 'action': 'changed', 'new_vote': new_vote_value}
            
            return {'success': False, 'error': 'Invalid action'}
            
        except Exception as e:
            logger.error(f"Error withdrawing vote: {e}")
            return {'success': False, 'error': str(e)}
    
    async def get_delegated_votes_for_user(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all active delegated votes for a user with countdown info"""
        try:
            votes = self.supabase.table('user_votes')\
                .select('*, decision:demo_decisions(*), expert:profiles(*)')\
                .eq('user_id', user_id)\
                .eq('is_delegated', True)\
                .eq('can_withdraw', True)\
                .execute()
            
            result = []
            now = datetime.now(timezone.utc)
            
            for vote in votes.data or []:
                decision = vote.get('decision', {})
                withdrawal_deadline = datetime.fromisoformat(decision.get('withdrawal_deadline'))
                time_remaining = withdrawal_deadline - now
                
                result.append({
                    **vote,
                    'time_remaining_seconds': int(time_remaining.total_seconds()),
                    'time_remaining_formatted': self.format_time_remaining(time_remaining),
                    'can_withdraw_now': time_remaining.total_seconds() > 0
                })
            
            return result
            
        except Exception as e:
            logger.error(f"Error getting delegated votes: {e}")
            return []
    
    @staticmethod
    def format_time_remaining(delta: timedelta) -> str:
        """Format time remaining in Hebrew"""
        total_seconds = int(delta.total_seconds())
        
        if total_seconds <= 0:
            return "פג תוקף"
        
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        
        if hours > 0:
            return f"{hours} שעות ו-{minutes} דקות"
        elif minutes > 0:
            return f"{minutes} דקות"
        else:
            return f"{total_seconds} שניות"
    
    async def calculate_vote_results(self, decision_id: str) -> Dict[str, Any]:
        """Calculate vote results including delegation power"""
        try:
            # Get all votes
            votes = self.supabase.table('user_votes')\
                .select('*, delegated_by')\
                .eq('decision_id', decision_id)\
                .execute()
            
            results = {
                'yes': 0,
                'no': 0,
                'abstain': 0,
                'total_votes': 0,
                'direct_votes': 0,
                'delegated_votes': 0,
                'expert_influence': {}
            }
            
            for vote in votes.data or []:
                vote_value = vote['vote_value']
                is_delegated = vote.get('is_delegated', False)
                
                results[vote_value] = results.get(vote_value, 0) + 1
                results['total_votes'] += 1
                
                if is_delegated:
                    results['delegated_votes'] += 1
                    expert_id = vote.get('delegated_by')
                    if expert_id:
                        if expert_id not in results['expert_influence']:
                            results['expert_influence'][expert_id] = 0
                        results['expert_influence'][expert_id] += 1
                else:
                    results['direct_votes'] += 1
            
            return results
            
        except Exception as e:
            logger.error(f"Error calculating results: {e}")
            return {'error': str(e)}
