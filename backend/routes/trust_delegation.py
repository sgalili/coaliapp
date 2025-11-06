"""
Trust Delegation API Routes
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import logging
import os

router = APIRouter()
logger = logging.getLogger(__name__)

# Supabase client will be initialized when needed
from supabase import create_client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

if supabase_url and supabase_key:
    supabase = create_client(supabase_url, supabase_key)
else:
    supabase = None
    logger.warning("Supabase not configured")

# Import notification service
from services.auto_notification_service import auto_notification_service

class TrustDelegationCreate(BaseModel):
    truster_id: str
    trusted_id: str
    expertise_field: str

class TrustDelegationRevoke(BaseModel):
    truster_id: str
    trusted_id: str
    expertise_field: str

class ExpertVote(BaseModel):
    expert_id: str
    decision_id: str
    vote_value: str  # 'yes', 'no', 'abstain'

class VoteWithdrawal(BaseModel):
    user_id: str
    decision_id: str
    action: str  # 'change' or 'remove'
    new_vote_value: Optional[str] = None

@router.post("/create-delegation")
async def create_delegation(data: TrustDelegationCreate):
    """Create trust delegation"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        # Check if expert has this expertise
        expertise_check = supabase.table('user_expertise')\
            .select('*')\
            .eq('user_id', data.trusted_id)\
            .eq('expertise_field', data.expertise_field)\
            .execute()
        
        if not expertise_check.data:
            raise HTTPException(
                status_code=400, 
                detail=f"User {data.trusted_id} is not an expert in {data.expertise_field}"
            )
        
        # Create delegation
        result = supabase.table('trust_delegations').upsert({
            'truster_id': data.truster_id,
            'trusted_id': data.trusted_id,
            'expertise_field': data.expertise_field,
            'is_active': True
        }, on_conflict='truster_id,trusted_id,expertise_field').execute()
        
        return {
            'success': True,
            'delegation': result.data[0] if result.data else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating delegation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/revoke-delegation")
async def revoke_delegation(data: TrustDelegationRevoke):
    """Revoke trust delegation"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        result = supabase.table('trust_delegations')\
            .update({
                'is_active': False,
                'revoked_at': datetime.utcnow().isoformat()
            })\
            .eq('truster_id', data.truster_id)\
            .eq('trusted_id', data.trusted_id)\
            .eq('expertise_field', data.expertise_field)\
            .execute()
        
        return {
            'success': True,
            'revoked': len(result.data) if result.data else 0
        }
        
    except Exception as e:
        logger.error(f"Error revoking delegation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/expert-vote-and-delegate")
async def expert_vote_and_delegate(data: ExpertVote):
    """
    Expert votes and triggers delegated votes for all their followers
    """
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        # 1. Record expert's direct vote
        expert_vote = supabase.table('user_votes').upsert({
            'user_id': data.expert_id,
            'decision_id': data.decision_id,
            'vote_value': data.vote_value,
            'is_delegated': False
        }, on_conflict='user_id,decision_id').execute()
        
        # 2. Get decision category
        decision = supabase.table('demo_decisions')\
            .select('category, withdrawal_deadline')\
            .eq('id', data.decision_id)\
            .single()\
            .execute()
        
        if not decision.data:
            raise HTTPException(status_code=404, detail="Decision not found")
        
        category = decision.data.get('category', 'כללי')
        
        # 3. Get all active delegators in this field
        delegators = supabase.table('trust_delegations')\
            .select('truster_id')\
            .eq('trusted_id', data.expert_id)\
            .eq('expertise_field', category)\
            .eq('is_active', True)\
            .execute()
        
        triggered_votes = []
        
        # 4. Create delegated votes
        for delegator in (delegators.data or []):
            user_id = delegator['truster_id']
            
            # Skip if user already voted directly
            existing = supabase.table('user_votes')\
                .select('is_delegated')\
                .eq('user_id', user_id)\
                .eq('decision_id', data.decision_id)\
                .execute()
            
            if existing.data and not existing.data[0].get('is_delegated', True):
                continue  # User voted directly, don't override
            
            # Create/update delegated vote
            vote_result = supabase.table('user_votes').upsert({
                'user_id': user_id,
                'decision_id': data.decision_id,
                'vote_value': data.vote_value,
                'is_delegated': True,
                'delegated_by': data.expert_id,
                'can_withdraw': True
            }, on_conflict='user_id,decision_id').execute()
            
            triggered_votes.append(user_id)
            
            # Send notification
            supabase.table('delegation_notifications').insert({
                'user_id': user_id,
                'decision_id': data.decision_id,
                'expert_id': data.expert_id,
                'expert_vote': data.vote_value,
                'notification_type': 'vote_triggered'
            }).execute()
        
        # 5. Log delegation
        supabase.table('vote_delegations_log').insert({
            'decision_id': data.decision_id,
            'expert_id': data.expert_id,
            'expert_vote_value': data.vote_value,
            'affected_users_count': len(triggered_votes),
            'votes_triggered': triggered_votes
        }).execute()
        
        return {
            'success': True,
            'expert_vote': expert_vote.data[0] if expert_vote.data else None,
            'delegated_votes_triggered': len(triggered_votes),
            'affected_users': triggered_votes
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in expert vote: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/withdraw-vote")
async def withdraw_vote(data: VoteWithdrawal):
    """Withdraw or change delegated vote"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        # Check deadline
        decision = supabase.table('demo_decisions')\
            .select('withdrawal_deadline')\
            .eq('id', data.decision_id)\
            .single()\
            .execute()
        
        if not decision.data:
            raise HTTPException(status_code=404, detail="Decision not found")
        
        deadline = datetime.fromisoformat(decision.data['withdrawal_deadline'])
        if datetime.utcnow() >= deadline:
            raise HTTPException(
                status_code=400, 
                detail="Withdrawal deadline has passed"
            )
        
        # Get vote
        vote = supabase.table('user_votes')\
            .select('*')\
            .eq('user_id', data.user_id)\
            .eq('decision_id', data.decision_id)\
            .single()\
            .execute()
        
        if not vote.data:
            raise HTTPException(status_code=404, detail="Vote not found")
        
        original_value = vote.data['vote_value']
        
        if data.action == 'remove':
            # Delete vote
            supabase.table('user_votes').delete().eq('id', vote.data['id']).execute()
            
            # Log
            supabase.table('vote_withdrawals').insert({
                'vote_id': vote.data['id'],
                'user_id': data.user_id,
                'decision_id': data.decision_id,
                'original_vote': original_value,
                'action': 'removed'
            }).execute()
            
            return {'success': True, 'action': 'removed'}
            
        elif data.action == 'change':
            # Update to direct vote
            supabase.table('user_votes')\
                .update({
                    'vote_value': data.new_vote_value,
                    'is_delegated': False,
                    'delegated_by': None,
                    'withdrawn_at': datetime.utcnow().isoformat()
                })\
                .eq('id', vote.data['id'])\
                .execute()
            
            # Log
            supabase.table('vote_withdrawals').insert({
                'vote_id': vote.data['id'],
                'user_id': data.user_id,
                'decision_id': data.decision_id,
                'original_vote': original_value,
                'new_vote': data.new_vote_value,
                'action': 'changed'
            }).execute()
            
            return {'success': True, 'action': 'changed'}
        
        raise HTTPException(status_code=400, detail="Invalid action")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error withdrawing vote: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/my-delegations/{user_id}")
async def get_my_delegations(user_id: str):
    """Get all active trust delegations for a user"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        delegations = supabase.table('trust_delegations')\
            .select('*, expert:profiles!trust_delegations_trusted_id_fkey(*)')\
            .eq('truster_id', user_id)\
            .eq('is_active', True)\
            .execute()
        
        return {'delegations': delegations.data or []}
        
    except Exception as e:
        logger.error(f"Error getting delegations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/my-delegated-votes/{user_id}")
async def get_my_delegated_votes(user_id: str):
    """Get all active delegated votes with countdown"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        votes = supabase.table('user_votes')\
            .select('*, decision:demo_decisions(*)')\
            .eq('user_id', user_id)\
            .eq('is_delegated', True)\
            .eq('can_withdraw', True)\
            .execute()
        
        now = datetime.utcnow()
        result = []
        
        for vote in (votes.data or []):
            decision = vote.get('decision', {})
            if not decision:
                continue
            
            withdrawal_deadline_str = decision.get('withdrawal_deadline')
            if withdrawal_deadline_str:
                deadline = datetime.fromisoformat(withdrawal_deadline_str.replace('Z', '+00:00'))
                time_remaining = (deadline - now).total_seconds()
                
                result.append({
                    **vote,
                    'time_remaining_seconds': int(time_remaining),
                    'can_withdraw_now': time_remaining > 0
                })
        
        return {'delegated_votes': result}
        
    except Exception as e:
        logger.error(f"Error getting delegated votes: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/decision-results/{decision_id}")
async def get_decision_results(decision_id: str):
    """Get vote results including delegation power breakdown"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        votes = supabase.table('user_votes')\
            .select('*')\
            .eq('decision_id', decision_id)\
            .execute()
        
        results = {
            'yes': 0, 'no': 0, 'abstain': 0,
            'total': 0,
            'direct': 0,
            'delegated': 0,
            'expert_influence': {}
        }
        
        for vote in (votes.data or []):
            value = vote['vote_value']
            results[value] = results.get(value, 0) + 1
            results['total'] += 1
            
            if vote.get('is_delegated'):
                results['delegated'] += 1
                expert = vote.get('delegated_by')
                if expert:
                    results['expert_influence'][expert] = \
                        results['expert_influence'].get(expert, 0) + 1
            else:
                results['direct'] += 1
        
        return results
        
    except Exception as e:
        logger.error(f"Error calculating results: {e}")
        raise HTTPException(status_code=500, detail=str(e))
