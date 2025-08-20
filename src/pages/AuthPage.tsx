import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPInput } from '@/components/auth/OTPInput';
import { ProfileCompletion } from '@/components/auth/ProfileCompletion';
import { LanguageSelector } from '@/components/auth/LanguageSelector';
import { useAffiliateLinks } from '@/hooks/useAffiliateLinks';

type AuthStep = 'phone' | 'otp' | 'profile';

interface AuthData {
  phone: string;
  otp: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export const AuthPage = () => {
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
      // TODO: Create user profile in Supabase
      console.log('Creating profile:', { firstName, lastName, profilePicture });
      
      setAuthData(prev => ({ ...prev, firstName, lastName, profilePicture }));
      
      // Redirect to home
      navigate('/');
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setIsLoading(false);
    }
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
              isLoading={isLoading}
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
