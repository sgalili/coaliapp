/**
 * Channel Join Verification Flow
 * OTP + Custom Fields Verification
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';

export default function ChannelJoinVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const channelId = searchParams.get('channel');
  
  const [step, setStep] = useState<'otp' | 'verification'>('otp');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [invitation, setInvitation] = useState<any>(null);
  const [verificationData, setVerificationData] = useState<any>({});
  
  useEffect(() => {
    if (channelId) {
      console.log('📺 Channel join request for:', channelId);
    }
  }, [channelId]);

  const handleOTPSubmit = async () => {
    try {
      // Verify OTP via backend
      const backendUrl = 'https://trustflow-4.preview.emergentagent.com';
      const response = await fetch(`${backendUrl}/api/otp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });

      if (!response.ok) throw new Error('Invalid OTP');

      console.log('✅ OTP verified');

      // Get invitation details
      const { data: invite } = await supabase
        .from('channel_invitations')
        .select('*')
        .eq('channel_id', channelId)
        .eq('phone_number', phone)
        .eq('status', 'pending')
        .single();

      if (!invite) {
        toast.error('לא נמצאה הזמנה פעילה למספר זה');
        return;
      }

      setInvitation(invite);
      
      // Check if custom verification needed
      if (invite.verification_fields && Object.keys(invite.verification_fields).length > 0) {
        setStep('verification');
        toast.success('נא להשלים אימות נוסף');
      } else {
        // No custom verification - join directly
        await joinChannel(invite);
      }
    } catch (error) {
      console.error('OTP error:', error);
      toast.error('קוד שגוי');
    }
  };

  const handleVerificationSubmit = async () => {
    try {
      // Validate custom fields
      const requiredFields = invitation.verification_fields || {};
      
      for (const [key, expectedValue] of Object.entries(requiredFields)) {
        if (verificationData[key] !== expectedValue) {
          const fieldNames: any = {
            id_number: 'מספר תעודת זהות',
            student_number: 'מספר סטודנט'
          };
          toast.error(`${fieldNames[key] || key} לא תואם`);
          return;
        }
      }

      console.log('✅ Verification successful');
      await joinChannel(invitation);
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('שגיאה באימות');
    }
  };

  const joinChannel = async (invite: any) => {
    try {
      // Create user account if doesn't exist
      // Add to channel members
      const { error } = await supabase
        .from('channel_members')
        .insert({
          channel_id: channelId,
          user_id: 'new-user-id', // TODO: Get from signup
          role: 'member',
          verification_data: verificationData,
          invited_by: invite.created_by
        });

      if (error) throw error;

      // Update invitation status
      await supabase
        .from('channel_invitations')
        .update({ status: 'accepted' })
        .eq('id', invite.id);

      toast.success('🎉 הצטרפת בהצלחה לערוץ!');
      
      // Redirect to channel
      setTimeout(() => {
        navigate(`/?channel=${channelId}`);
      }, 2000);
    } catch (error) {
      console.error('Join error:', error);
      toast.error('שגיאה בהצטרפות');
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">אימות הצטרפות לערוץ</h1>
            <p className="text-muted-foreground">נא להזין את הקוד שנשלח אליך ב-WhatsApp</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>מספר טלפון</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+972501234567"
                type="tel"
                dir="ltr"
              />
            </div>

            <div>
              <Label>קוד אימות (6 ספרות)</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                dir="ltr"
              />
            </div>

            <Button onClick={handleOTPSubmit} className="w-full">
              המשך
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">אימות נוסף נדרש</h1>
          <p className="text-muted-foreground">נא למלא את הפרטים הבאים לאימות</p>
        </div>

        <div className="space-y-4">
          {invitation?.verification_fields && Object.entries(invitation.verification_fields).map(([key, value]: [string, any]) => {
            const fieldNames: any = {
              id_number: 'מספר תעודת זהות',
              student_number: 'מספר סטודנט'
            };
            
            return (
              <div key={key}>
                <Label>{fieldNames[key] || key}</Label>
                <Input
                  value={verificationData[key] || ''}
                  onChange={(e) => setVerificationData({ ...verificationData, [key]: e.target.value })}
                  placeholder={`הזן ${fieldNames[key] || key}`}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  הערך הצפוי: {value}
                </p>
              </div>
            );
          })}

          <Button onClick={handleVerificationSubmit} className="w-full">
            אמת והצטרף לערוץ
          </Button>
        </div>
      </div>
    </div>
  );
}
