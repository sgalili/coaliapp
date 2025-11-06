"""
ZOOZ Coin Management Routes
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

from services.auto_notification_service import auto_notification_service

class ZOOZTransfer(BaseModel):
    from_user_id: str
    to_user_id: str
    amount: int
    reason: Optional[str] = None

@router.post("/transfer")
async def transfer_zooz(data: ZOOZTransfer):
    """
    Transfer ZOOZ coins and send notification
    """
    try:
        # TODO: Implement actual ZOOZ balance management in database
        
        # Send WhatsApp notification
        # Get recipient phone
        try:
            from supabase import create_client
            import os
            
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_ANON_KEY")
            
            if supabase_url and supabase_key:
                supabase = create_client(supabase_url, supabase_key)
                
                # Get recipient profile
                recipient = supabase.table('profiles')\
                    .select('phone, first_name')\
                    .eq('user_id', data.to_user_id)\
                    .single()\
                    .execute()
                
                # Get sender profile
                sender = supabase.table('profiles')\
                    .select('first_name, last_name')\
                    .eq('user_id', data.from_user_id)\
                    .single()\
                    .execute()
                
                if recipient.data and recipient.data.get('phone'):
                    sender_name = f"{sender.data.get('first_name', '')} {sender.data.get('last_name', '')}".strip() if sender.data else 'משתמש'
                    
                    auto_notification_service.send_zooz_received_notification(
                        user_phone=recipient.data['phone'],
                        amount=data.amount,
                        from_user=sender_name,
                        reason=data.reason or ""
                    )
                    
                    # Also send push notification
                    auto_notification_service.send_push_notification(
                        user_id=data.to_user_id,
                        title='קיבלת ZOOZ! 🪙',
                        body=f'{data.amount} מטבעות ZOOZ מ-{sender_name}',
                        data={'type': 'zooz_received', 'amount': data.amount}
                    )
        except Exception as notif_error:
            logger.error(f"Failed to send ZOOZ notification: {notif_error}")
        
        return {
            'success': True,
            'transfer': {
                'from': data.from_user_id,
                'to': data.to_user_id,
                'amount': data.amount
            }
        }
        
    except Exception as e:
        logger.error(f"Error transferring ZOOZ: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/balance/{user_id}")
async def get_zooz_balance(user_id: str):
    """Get user's ZOOZ balance"""
    try:
        # TODO: Implement actual balance fetching from database
        # For now return demo balance
        return {'balance': 9957, 'user_id': user_id}
        
    except Exception as e:
        logger.error(f"Error getting balance: {e}")
        raise HTTPException(status_code=500, detail=str(e))
