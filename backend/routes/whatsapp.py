from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
from services.whatsapp_service import WhatsAppService
import os

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize WhatsApp service
whatsapp_service = WhatsAppService()

class WhatsAppMessage(BaseModel):
    phone_number: str
    message: str

class BulkWhatsAppMessage(BaseModel):
    phone_numbers: list[str]
    message: str

@router.post("/send-message")
async def send_whatsapp_message(data: WhatsAppMessage):
    """Send WhatsApp message to single recipient"""
    try:
        result = whatsapp_service.send_message(data.phone_number, data.message)
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"WhatsApp send failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send-bulk")
async def send_bulk_whatsapp(data: BulkWhatsAppMessage):
    """Send WhatsApp message to multiple recipients"""
    try:
        results = whatsapp_service.send_bulk_message(data.phone_numbers, data.message)
        success_count = sum(1 for r in results if r['success'])
        
        return {
            "success": True,
            "total": len(results),
            "sent": success_count,
            "failed": len(results) - success_count,
            "details": results
        }
    except Exception as e:
        logger.error(f"Bulk WhatsApp send failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test")
async def test_whatsapp():
    """Test WhatsApp connection"""
    try:
        # Test connection by checking credentials
        return {
            "configured": bool(whatsapp_service.token),
            "instance_id": whatsapp_service.instance_id,
            "api_url": whatsapp_service.api_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
