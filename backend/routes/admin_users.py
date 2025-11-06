"""
Admin User Management Routes
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import logging
import os

router = APIRouter()
logger = logging.getLogger(__name__)

from supabase import create_client

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

if supabase_url and supabase_key:
    supabase = create_client(supabase_url, supabase_key)
else:
    supabase = None
    logger.warning("Supabase not configured")

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    phone: str
    city: Optional[str] = None
    id_number: Optional[str] = None
    is_demo: bool = False
    expertise_fields: Optional[List[str]] = []

class UserUpdate(BaseModel):
    user_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    id_number: Optional[str] = None
    zooz_balance: Optional[int] = None
    is_verified: Optional[bool] = None
    is_demo: Optional[bool] = None

class ZoozGrant(BaseModel):
    admin_id: str
    user_id: str
    amount: int
    reason: Optional[str] = "Admin grant"

class AdminNote(BaseModel):
    user_id: str
    notes: Optional[str] = None
    alerts: Optional[str] = None

class LoginAsUser(BaseModel):
    admin_id: str
    target_user_id: str

@router.post("/users/create")
async def create_user(data: UserCreate):
    """Admin creates a new user"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        user_data = {
            'user_id': f"user_{int(datetime.utcnow().timestamp())}",
            'first_name': data.first_name,
            'last_name': data.last_name,
            'phone': data.phone,
            'city': data.city,
            'id_number': data.id_number,
            'is_demo': data.is_demo,
            'is_verified': True,
            'zooz_balance': 10 if not data.is_demo else 0,
            'expertise_fields': data.expertise_fields,
            'created_at': datetime.utcnow().isoformat()
        }
        
        result = supabase.table('profiles').insert(user_data).execute()
        
        logger.info(f"Admin created user: {user_data['user_id']}")
        
        return {'success': True, 'user': result.data[0] if result.data else None}
        
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/users/update")
async def update_user(data: UserUpdate):
    """Admin updates user info"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        update_data = {k: v for k, v in data.dict().items() if v is not None and k != 'user_id'}
        
        result = supabase.table('profiles')\
            .update(update_data)\
            .eq('user_id', data.user_id)\
            .execute()
        
        return {'success': True, 'updated': len(result.data) if result.data else 0}
        
    except Exception as e:
        logger.error(f"Error updating user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/zooz/grant")
async def grant_zooz(data: ZoozGrant):
    """Admin grants ZOOZ to user"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        # Create transaction
        tx_result = supabase.table('zooz_transactions').insert({
            'from_user_id': data.admin_id,
            'to_user_id': data.user_id,
            'amount': data.amount,
            'type': 'admin_grant',
            'reason': data.reason
        }).execute()
        
        # Update user balance
        user = supabase.table('profiles')\
            .select('zooz_balance')\
            .eq('user_id', data.user_id)\
            .single()\
            .execute()
        
        new_balance = (user.data.get('zooz_balance', 0) if user.data else 0) + data.amount
        
        supabase.table('profiles')\
            .update({'zooz_balance': new_balance})\
            .eq('user_id', data.user_id)\
            .execute()
        
        # Log admin action
        supabase.table('admin_activity_log').insert({
            'admin_user_id': data.admin_id,
            'target_user_id': data.user_id,
            'action': 'add_zooz',
            'details': {'amount': data.amount, 'reason': data.reason}
        }).execute()
        
        return {'success': True, 'new_balance': new_balance}
        
    except Exception as e:
        logger.error(f"Error granting ZOOZ: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/notes/save")
async def save_admin_notes(data: AdminNote):
    """Save admin notes and alerts for user"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        result = supabase.table('admin_user_notes').upsert({
            'user_id': data.user_id,
            'notes': data.notes,
            'alerts': data.alerts,
            'updated_at': datetime.utcnow().isoformat()
        }, on_conflict='user_id').execute()
        
        return {'success': True}
        
    except Exception as e:
        logger.error(f"Error saving notes: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login-as-user")
async def login_as_user(data: LoginAsUser):
    """
    Admin logs in as user (impersonation)
    WARNING: This is a powerful feature - use with caution
    """
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        # Log admin action
        supabase.table('admin_activity_log').insert({
            'admin_user_id': data.admin_id,
            'target_user_id': data.target_user_id,
            'action': 'login_as_user',
            'details': {'timestamp': datetime.utcnow().isoformat()}
        }).execute()
        
        # In production, this would:
        # 1. Verify admin permissions
        # 2. Create temporary impersonation token
        # 3. Return session data
        
        logger.warning(f"Admin {data.admin_id} logged in as user {data.target_user_id}")
        
        return {
            'success': True,
            'impersonation_token': 'temp_token',
            'user_id': data.target_user_id
        }
        
    except Exception as e:
        logger.error(f"Error in login-as-user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions/{user_id}")
async def get_user_transactions(user_id: str):
    """Get ZOOZ transaction history for user"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        result = supabase.table('zooz_transactions')\
            .select('*')\
            .or_(f'from_user_id.eq.{user_id},to_user_id.eq.{user_id}')\
            .order('created_at', desc=True)\
            .limit(50)\
            .execute()
        
        return {'transactions': result.data or []}
        
    except Exception as e:
        logger.error(f"Error getting transactions: {e}")
        raise HTTPException(status_code=500, detail=str(e))
