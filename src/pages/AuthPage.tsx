import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPInput } from '@/components/auth/OTPInput';
import { ProfileCompletion } from '@/components/auth/ProfileCompletion';
import { LanguageSelector } from '@/components/auth/LanguageSelector';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useAffiliateLinks } from '@/hooks/useAffiliateLinks';
import { useToast } from '@/hooks/use-toast';
import { useIsDemoMode } from '@/hooks/useIsDemoMode';

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
  const { toast } = useToast();
  const { enableDemoMode } = useIsDemoMode();

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
      const { supabase } = await import('@/integrations/supabase/client');
      
      console.log('Verifying OTP:', otp, 'for phone:', authData.phone);
      
      // Call the verify and login edge function
      const { data, error } = await supabase.functions.invoke('whatsapp-otp-verify-and-login', {
        body: { phone: authData.phone, otp }
      });

      console.log('OTP verification response:', data);

      if (error) {
        console.error('Error verifying OTP:', error);
        toast({
          title: "שגיאה",
          description: "קוד האימות שגוי או פג תוקפו",
          variant: "destructive"
        });
        return;
      }

      if (!data.user || !data.session) {
        throw new Error('No user or session returned from verification');
      }

      // Set the session in Supabase client
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      });

      if (sessionError) {
        console.error('Error setting session:', sessionError);
        throw sessionError;
      }

      console.log('Session set successfully for user:', data.user.id);
      console.log('Session set, user:', data.user.id, 'phone:', data.user.phone);
      console.log('Profile exists:', data.profile_exists, '| Profile complete:', data.profile_complete);

      setAuthData(prev => ({ ...prev, otp }));
      
      // Fetch the actual profile to check completeness
      console.log('Fetching user profile after OTP verification...');
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        console.log('No profile found, showing profile completion');
        setCurrentStep('profile');
        return;
      }
      
      console.log('Profile after OTP:', {
        user_id: userProfile.user_id,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        phone: userProfile.phone
      });
      
      // Check if profile is complete (has first_name and last_name)
      const isProfileComplete = userProfile.first_name && userProfile.last_name;
      
      if (isProfileComplete) {
        console.log('Profile is complete, redirecting to home');
        navigate('/');
      } else {
        console.log('Profile exists but incomplete, showing profile completion');
        setCurrentStep('profile');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה באימות הקוד",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileComplete = async (firstName: string, lastName: string, profilePicture?: string) => {
    setIsLoading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Get the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting user:', userError);
        toast({
          title: "שגיאה",
          description: "לא ניתן לאמת את המשתמש",
          variant: "destructive"
        });
        return;
      }

      console.log('Current auth user:', user.id);
      console.log('Creating profile:', { firstName, lastName, phone: authData.phone });
      
      // Create profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          phone: authData.phone,
          avatar_url: profilePicture,
          is_demo: false
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast({
          title: "שגיאה",
          description: "לא ניתן ליצור פרופיל",
          variant: "destructive"
        });
        return;
      }

      console.log('Profile created successfully for user:', user.id);
      
      setAuthData(prev => ({ ...prev, firstName, lastName, profilePicture }));
      
      // Start onboarding flow
      setCurrentStep('onboarding');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת הפרופיל",
        variant: "destructive"
      });
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
      // Enable demo mode without any authentication
      await enableDemoMode();
      
      toast({
        title: "ברוכים הבאים למצב דמו!",
        description: "אתם כעת צופים בחשבון הדמו של ירון זלקה",
      });
      
      // Redirect directly to home
      navigate('/');
    } catch (error) {
      console.error('Demo mode error:', error);
      toast({ 
        title: 'שגיאה', 
        description: 'לא ניתן להיכנס למצב דמו', 
        variant: 'destructive' 
      });
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
                  {t('auth.demoAccount', 'כניסה לחשבון הדגמה')}
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
