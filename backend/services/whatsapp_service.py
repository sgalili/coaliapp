import os
import requests
import logging

logger = logging.getLogger(__name__)

class WhatsAppService:
    """GreenAPI WhatsApp integration for sending messages"""
    
    def __init__(self):
        self.api_url = os.getenv('GREENAPI_URL', 'https://7107.api.green-api.com')
        self.instance_id = os.getenv('GREENAPI_INSTANCE_ID', '7107359199')
        self.token = os.getenv('GREENAPI_TOKEN', '')
        
    def send_message(self, phone_number: str, message: str):
        """
        Send WhatsApp message to a phone number
        
        Args:
            phone_number: Phone number in format: 972501234567 (country code + number)
            message: Message text to send
        """
        try:
            url = f"{self.api_url}/waInstance{self.instance_id}/sendMessage/{self.token}"
            
            payload = {
                "chatId": f"{phone_number}@c.us",
                "message": message
            }
            
            response = requests.post(url, json=payload)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"WhatsApp message sent: {result}")
            return result
            
        except Exception as e:
            logger.error(f"Failed to send WhatsApp: {str(e)}")
            raise
    
    def send_bulk_message(self, phone_numbers: list, message: str):
        """Send message to multiple recipients"""
        results = []
        for phone in phone_numbers:
            try:
                result = self.send_message(phone, message)
                results.append({'phone': phone, 'success': True, 'result': result})
            except Exception as e:
                results.append({'phone': phone, 'success': False, 'error': str(e)})
        
        return results
