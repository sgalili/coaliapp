"""
OTP Management Routes
Handles OTP generation, storage, and verification
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
import random
import logging
import os

router = APIRouter()
logger = logging.getLogger(__name__)

from services.whatsapp_service import WhatsAppService

whatsapp_service = WhatsAppService()

# Simple in-memory OTP storage (in production, use Redis or database)
otp_storage = {}

class OTPSendRequest(BaseModel):
    phone: str

class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str

@router.post("/send-otp")
async def send_otp(request: OTPSendRequest):
    """Send OTP via WhatsApp"""
    try:
        # Generate 6-digit OTP
        otp_code = str(random.randint(100000, 999999))
        
        # Store OTP with expiration (5 minutes)
        otp_storage[request.phone] = {
            'code': otp_code,
            'expires_at': datetime.utcnow() + timedelta(minutes=5),
            'attempts': 0
        }
        
        # Send via WhatsApp
        message = f"""🔐 קוד האימות שלך ב-Coali:

{otp_code}

הקוד תקף ל-5 דקות.
אל תשתף את הקוד עם אף אחד."""
        
        try:
            result = whatsapp_service.send_message(request.phone, message)
            logger.info(f"OTP sent to {request.phone} via WhatsApp")
        except Exception as whatsapp_error:
            logger.error(f"WhatsApp send failed: {whatsapp_error}")
            # Continue anyway - OTP is stored
        
        # Always return success (even if WhatsApp fails)
        # In production, user will receive OTP via WhatsApp
        # In development, show OTP in response
        return {
            'success': True,
            'message': 'OTP sent successfully',
            'otp': otp_code,  # Show OTP for testing (remove in production)
            'debug_message': 'Check console for OTP code'
        }
        
    except Exception as e:
        logger.error(f"Error sending OTP: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-otp")
async def verify_otp(request: OTPVerifyRequest):
    """Verify OTP code"""
    try:
        stored_otp = otp_storage.get(request.phone)
        
        if not stored_otp:
            raise HTTPException(status_code=400, detail="No OTP found for this phone")
        
        # Check if expired
        if datetime.utcnow() > stored_otp['expires_at']:
            del otp_storage[request.phone]
            raise HTTPException(status_code=400, detail="OTP expired")
        
        # Check attempts
        if stored_otp['attempts'] >= 3:
            del otp_storage[request.phone]
            raise HTTPException(status_code=400, detail="Too many attempts")
        
        # Verify code
        if stored_otp['code'] != request.otp:
            stored_otp['attempts'] += 1
            raise HTTPException(status_code=400, detail="Invalid OTP")
        
        # Success - remove OTP
        del otp_storage[request.phone]
        
        logger.info(f"OTP verified successfully for {request.phone}")
        
        return {
            'success': True,
            'message': 'OTP verified',
            'phone': request.phone
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying OTP: {e}")
        raise HTTPException(status_code=500, detail=str(e))
