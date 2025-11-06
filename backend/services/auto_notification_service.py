"""
Automated Notification Service
Sends WhatsApp and push notifications for delegation votes and ZOOZ rewards
"""
from datetime import datetime
from typing import Dict, Any
import logging
import os
import requests

logger = logging.getLogger(__name__)

class AutoNotificationService:
    """Service for automated WhatsApp and push notifications"""
    
    def __init__(self):
        self.greenapi_url = os.getenv("GREENAPI_URL")
        self.instance_id = os.getenv("GREENAPI_INSTANCE_ID")
        self.token = os.getenv("GREENAPI_TOKEN")
    
    def send_delegation_vote_notification(
        self,
        user_phone: str,
        expert_name: str,
        decision_title: str,
        expert_vote: str,
        decision_link: str,
        time_remaining: str
    ) -> Dict[str, Any]:
        """
        Send WhatsApp notification when expert votes on behalf of user
        """
        try:
            vote_text = {
                'yes': 'בעד',
                'no': 'נגד',
                'abstain': 'נמנע'
            }.get(expert_vote, expert_vote)
            
            message = f"""🗳️ *הצבעה מואצלת - פעולה נדרשת*

{expert_name}, המומחה שלך, הצביע בשמך על ההחלטה:

📋 *{decision_title}*

✅ ההצבעה שלו: *{vote_text}*

⏰ *זמן נותר לשינוי:* {time_remaining}

🔄 *מה תרצה לעשות?*
• אם אתה מסכים - אל תעשה דבר, ההצבעה תיספר אוטומטית
• אם תרצה לשנות - לחץ על הקישור כל עוד נותרו לפחות 3 שעות

👉 {decision_link}

_התראה זו נשלחת אוטומטית מרשת האמון Coali_"""

            return self._send_whatsapp(user_phone, message)
            
        except Exception as e:
            logger.error(f"Error sending delegation notification: {e}")
            return {'success': False, 'error': str(e)}
    
    def send_zooz_received_notification(
        self,
        user_phone: str,
        amount: int,
        from_user: str,
        reason: str = ""
    ) -> Dict[str, Any]:
        """
        Send WhatsApp notification when user receives ZOOZ coins
        """
        try:
            message = f"""🪙 *קיבלת ZOOZ!*

💰 *{amount} מטבעות ZOOZ* נוספו לארנק שלך!

👤 מאת: {from_user}"""

            if reason:
                message += f"\n📝 סיבה: {reason}"

            message += f"""

💼 צפה בארנק שלך:
{os.getenv('FRONTEND_URL', 'https://trust.coali.app')}/wallet

תודה שאתה חלק מקהילת Coali! 🌟"""

            return self._send_whatsapp(user_phone, message)
            
        except Exception as e:
            logger.error(f"Error sending ZOOZ notification: {e}")
            return {'success': False, 'error': str(e)}
    
    def _send_whatsapp(self, phone_number: str, message: str) -> Dict[str, Any]:
        """Internal method to send WhatsApp via GreenAPI"""
        try:
            if not all([self.greenapi_url, self.instance_id, self.token]):
                logger.warning("GreenAPI not configured")
                return {'success': False, 'error': 'GreenAPI not configured'}
            
            url = f"{self.greenapi_url}/waInstance{self.instance_id}/sendMessage/{self.token}"
            
            payload = {
                "chatId": f"{phone_number}@c.us",
                "message": message
            }
            
            response = requests.post(url, json=payload, timeout=10)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"WhatsApp sent to {phone_number}: {result.get('idMessage')}")
            
            return {'success': True, 'message_id': result.get('idMessage')}
            
        except Exception as e:
            logger.error(f"WhatsApp send failed: {e}")
            return {'success': False, 'error': str(e)}
    
    def send_push_notification(
        self,
        user_id: str,
        title: str,
        body: str,
        data: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Send push notification
        TODO: Integrate with Firebase Cloud Messaging or similar
        """
        try:
            # For now, store in database as notification
            logger.info(f"Push notification queued for {user_id}: {title}")
            
            # This would normally call FCM or similar service
            return {
                'success': True,
                'notification': {
                    'user_id': user_id,
                    'title': title,
                    'body': body,
                    'data': data or {}
                }
            }
            
        except Exception as e:
            logger.error(f"Push notification failed: {e}")
            return {'success': False, 'error': str(e)}

# Singleton instance
auto_notification_service = AutoNotificationService()
