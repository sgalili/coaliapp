import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPInput } from '@/components/auth/OTPInput';
import { ProfileCompletion } from '@/components/auth/ProfileCompletion';
import { LanguageSelector } from '@/components/auth/LanguageSelector';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useAffiliateLinks } from '@/hooks/useAffiliateLinks';

type AuthStep = 'phone' | 'otp' | 'profile' | 'onboarding';

interface AuthData {
  phone: string;
  otp: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

const AuthPage = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('phone');
  const [authData, setAuthData] = useState<AuthData>({
    phone: '',
    otp: '',
    firstName: '',
    lastName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { saveAffiliateLink } = useAffiliateLinks();

  useEffect(() => {
    // Save affiliate link if present in URL
    const urlParams = new URLSearchParams(location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      saveAffiliateLink(ref);
    }
  }, [location, saveAffiliateLink]);

  const handlePhoneSubmit = async (phone: string) => {
    setIsLoading(true);
    try {
      console.log('=== SENDING OTP ===');
      console.log('Phone being sent:', phone);
      
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error: fnError } = await supabase.functions.invoke('whatsapp-otp-send', {
        body: { phone }
      });
      
      console.log('Function response:', data);
      console.log('Function error:', fnError);
      
      if (fnError) {
        console.error('Error sending OTP:', fnError);
        throw fnError;
      }
      
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
      // TODO: Create user profile in Supabase
      console.log('Creating profile:', { firstName, lastName, profilePicture });
      
      setAuthData(prev => ({ ...prev, firstName, lastName, profilePicture }));
      
      // Profile completed, but don't redirect yet - onboarding will handle it
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

  const handleDemoAccount = async () => {
    setIsLoading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Use a predefined demo user UUID
      const demoUserId = '00000000-0000-0000-0000-000000000001';
      
      // Create or update demo profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: demoUserId,
          first_name: 'Demo',
          last_name: 'User',
          phone: '+972501111111',
          is_demo: true
        });

      if (profileError) {
        console.error('Error creating demo profile:', profileError);
      }

      // Store demo session in localStorage
      localStorage.setItem('demo_user_id', demoUserId);
      localStorage.setItem('is_demo', 'true');
      
      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Error setting up demo account:', error);
    } finally {
      setIsLoading(false);
    }
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
          {currentStep === 'phone' && (
            <>
              <PhoneInput
                onSubmit={handlePhoneSubmit}
                isLoading={isLoading}
              />
              <div className="mt-6">
                <button
                  onClick={handleDemoAccount}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-semibold transition-colors disabled:opacity-50"
                >
                  {t('auth.demoAccount', 'Demo Account')}
                </button>
              </div>
            </>
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

export { AuthPage };
