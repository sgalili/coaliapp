import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPInput } from '@/components/auth/OTPInput';
import { ProfileCompletion } from '@/components/auth/ProfileCompletion';
import { LanguageSelector } from '@/components/auth/LanguageSelector';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useAffiliateLinks } from '@/hooks/useAffiliateLinks';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, Sparkles } from 'lucide-react';

type AuthStep = 'invitation' | 'phone' | 'otp' | 'profile' | 'onboarding';

interface AuthData {
  phone: string;
  otp: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  invitationCode?: string;
  hasTrustIntent?: boolean;
}

export const AuthPage = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('invitation');
  const [authData, setAuthData] = useState<AuthData>({
    phone: '',
    otp: '',
    firstName: '',
    lastName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [invitationError, setInvitationError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { saveAffiliateLink } = useAffiliateLinks();

  useEffect(() => {
    // Check for invitation code in URL
    const urlParams = new URLSearchParams(location.search);
    const ref = urlParams.get('ref');
    
    if (ref) {
      saveAffiliateLink(ref);
      setAuthData(prev => ({ ...prev, invitationCode: ref }));
      // Skip invitation step if we have a valid code from URL
      validateInvitationCode(ref);
    }
  }, [location, saveAffiliateLink]);

  const validateInvitationCode = async (code: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('validate_invitation_code', {
        invitation_code: code
      });

      if (error) throw error;

      if (data) {
        setAuthData(prev => ({ ...prev, invitationCode: code }));
        setCurrentStep('phone');
        setInvitationError('');
      } else {
        setInvitationError('קוד הזמנה לא תקין או פג תוקף');
      }
    } catch (error) {
      console.error('Error validating invitation:', error);
      setInvitationError('שגיאה בבדיקת קוד ההזמנה');
    } finally {
      setIsLoading(false);
    }
  };

  const checkTrustIntent = async (phone: string) => {
    try {
      const { data, error } = await supabase.rpc('hash_phone', {
        phone_number: phone
      });

      if (error) throw error;

      const phoneHash = data;
      const { data: hasTrust, error: trustError } = await supabase.rpc('has_trust_for_phone_hash', {
        phone_hash: phoneHash
      });

      if (trustError) throw trustError;

      return hasTrust;
    } catch (error) {
      console.error('Error checking trust intent:', error);
      return false;
    }
  };

  const handleInvitationSubmit = async (code: string) => {
    await validateInvitationCode(code);
  };

  const handlePhoneSubmit = async (phone: string) => {
    setIsLoading(true);
    try {
      // If no invitation code, check for trust intent
      if (!authData.invitationCode) {
        const hasTrust = await checkTrustIntent(phone);
        if (!hasTrust) {
          setInvitationError('אין לך הזמנה לגשת לאפליקציה');
          setCurrentStep('invitation');
          return;
        }
        setAuthData(prev => ({ ...prev, hasTrustIntent: true }));
      }

      // TODO: Integrate with Ultramsg API for WhatsApp OTP
      console.log('Sending OTP to:', phone);
      
      setAuthData(prev => ({ ...prev, phone }));
      setCurrentStep('otp');
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setIsLoading(true);
    try {
      // TODO: Verify OTP with backend
      console.log('Verifying OTP:', otp);
      
      setAuthData(prev => ({ ...prev, otp }));
      
      // Check if user is new (mock logic for now)
      const isNewUser = true; // TODO: Check from backend
      
      if (isNewUser) {
        setCurrentStep('profile');
      } else {
        // Existing user, redirect to home
        navigate('/');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileComplete = async (firstName: string, lastName: string, profilePicture?: string) => {
    setIsLoading(true);
    try {
      // TODO: Create user profile in Supabase with auth
      console.log('Creating profile:', { firstName, lastName, profilePicture });
      
      setAuthData(prev => ({ ...prev, firstName, lastName, profilePicture }));
      
      // TODO: Consume invitation code or trust intent
      if (authData.invitationCode) {
        console.log('Consuming invitation code:', authData.invitationCode);
      } else if (authData.hasTrustIntent) {
        console.log('Consuming trust intent for phone:', authData.phone);
      }
      
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOnboarding = () => {
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    // Navigate to home after onboarding is complete
    navigate('/');
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      // TODO: Resend OTP
      console.log('Resending OTP to:', authData.phone);
    } catch (error) {
      console.error('Error resending OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlternativeMethod = () => {
    // TODO: Switch to SMS instead of WhatsApp
    console.log('Switching to SMS method');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Language selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {currentStep === 'invitation' && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">גישה בהזמנה בלבד</CardTitle>
                <p className="text-sm text-muted-foreground">
                  זוז פתוח רק למוזמנים. הזן את קוד ההזמנה שלך
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="קוד הזמנה"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) => {
                      setInvitationError('');
                      setAuthData(prev => ({ ...prev, invitationCode: e.target.value }));
                    }}
                    value={authData.invitationCode || ''}
                  />
                  {invitationError && (
                    <p className="text-sm text-destructive">{invitationError}</p>
                  )}
                </div>
                
                <Button 
                  onClick={() => authData.invitationCode && handleInvitationSubmit(authData.invitationCode)}
                  className="w-full"
                  disabled={isLoading || !authData.invitationCode}
                >
                  {isLoading ? 'בודק...' : 'המשך'}
                </Button>

                <div className="text-center pt-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-primary mr-2" />
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      אין לך הזמנה? בקש מחבר שכבר ברשת להזמין אותך או לתת לך אמון
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {currentStep === 'phone' && (
            <PhoneInput
              onSubmit={handlePhoneSubmit}
              isLoading={isLoading}
            />
          )}
          
          {currentStep === 'otp' && (
            <OTPInput
              phone={authData.phone}
              onVerify={handleOTPVerify}
              onResend={handleResendOTP}
              onAlternativeMethod={handleAlternativeMethod}
              isLoading={isLoading}
            />
          )}
          
          {currentStep === 'profile' && (
            <ProfileCompletion
              onComplete={handleProfileComplete}
              onStartOnboarding={handleStartOnboarding}
              isLoading={isLoading}
            />
          )}
          
          {currentStep === 'onboarding' && (
            <OnboardingFlow
              initialStep="profile-completion"
              onComplete={handleOnboardingComplete}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Coalichain LTD
        </p>
      </div>
    </div>
  );
};
