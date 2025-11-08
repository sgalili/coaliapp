import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPInput } from '@/components/auth/OTPInput';
import { ProfileCompletion } from '@/components/auth/ProfileCompletion';
import { LanguageSelector } from '@/components/auth/LanguageSelector';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { Navigation } from '@/components/Navigation';
import { useAffiliateLinks } from '@/hooks/useAffiliateLinks';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AuthStep = 'phone' | 'otp' | 'profile' | 'onboarding';

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
  const [currentStep, setCurrentStep] = useState<AuthStep>('phone');
  const [authData, setAuthData] = useState<AuthData>({
    phone: '',
    otp: '',
    firstName: '',
    lastName: ''
  });
  const [authError, setAuthError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { saveAffiliateLink } = useAffiliateLinks();
  const { user, loading: authLoading, signInWithPhone, verifyOTP, updateProfile } = useAuth();

  useEffect(() => {
    // Check for optional referral code in URL
    const urlParams = new URLSearchParams(location.search);
    const ref = urlParams.get('ref');
    
    if (ref) {
      saveAffiliateLink(ref);
      setAuthData(prev => ({ ...prev, invitationCode: ref }));
    }
  }, [location, saveAffiliateLink]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handlePhoneSubmit = async (phone: string) => {
    // L'OTP WhatsApp a déjà été envoyé avec succès par PhoneInput
    // On passe directement à l'étape de vérification
    setAuthError(''); // Clear any previous errors
    toast.success('Code envoyé via WhatsApp !');
    setAuthData(prev => ({ ...prev, phone }));
    setCurrentStep('otp');
  };

  const handleOTPVerify = async (otp: string) => {
    try {
      setAuthError('');
      
      // Verify OTP and create auth session
      const { data, error } = await supabase.functions.invoke('whatsapp-otp-verify-and-login', {
        body: { phone: authData.phone, otp }
      });

      if (error) throw error;

      // Set Supabase auth session
      if (data.access_token && data.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
      }

      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('✅ User authenticated:', user.id);
        
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', authData.phone)
          .maybeSingle();
        
        if (existingProfile) {
          // Existing user - log in
          console.log('✅ Existing user, logging in');
          localStorage.setItem('authenticated_user_id', existingProfile.user_id);
          localStorage.setItem('authenticated_user_phone', authData.phone);
          localStorage.setItem('isAuthenticated', 'true');
          toast.success('ברוך הבא חזרה!');
          navigate('/');
        } else {
          // New user - go to profile completion
          console.log('📝 New user, needs profile');
          toast.success('קוד אומת בהצלחה!');
          setAuthData(prev => ({ ...prev, otp }));
          setCurrentStep('profile');
        }
      } else {
        throw new Error('No user returned from auth');
      }
      
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      let errorMessage = 'שגיאה באימות הקוד';
      if (error.message?.includes('expired')) {
        errorMessage = 'הקוד פג תוקף';
      } else if (error.message?.includes('invalid')) {
        errorMessage = 'קוד לא נכון';
      }
      
      setAuthError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleProfileComplete = async (firstName: string, lastName: string, profilePicture: string) => {
    try {
      setAuthError('');
      
      // Get authenticated user from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('אין משתמש מאומת');
        return;
      }
      
      console.log('📝 Creating profile for authenticated user:', user.id);
      
      const profileData = {
        user_id: user.id, // Use REAL Supabase auth user ID
        phone: authData.phone,
        first_name: firstName,
        last_name: lastName,
        avatar_url: profilePicture,
        is_verified: true,
        zooz_balance: 10,
        is_demo: false, // Mark as REAL user
        created_at: new Date().toISOString()
      };
      
      console.log('📤 Inserting profile for REAL user');
      
      const { data: profile, error: createError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (createError) {
        console.error('❌ Profile creation error:', createError);
        toast.error(`שגיאה: ${createError.message}`);
        return;
      }

      console.log('✅ REAL user profile created:', profile);

      // Store REAL user session
      localStorage.setItem('authenticated_user_id', user.id);
      localStorage.setItem('authenticated_user_phone', authData.phone);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.removeItem('demo_mode');
      
      console.log('✅ Session stored for real user:', user.id);

      // Send welcome WhatsApp
      try {
        const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
        await fetch(`${backendUrl}/api/whatsapp/send-message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone_number: authData.phone,
            message: `🎉 ברוך הבא ל-Coali, ${firstName}!

ההרשמה הושלמה בהצלחה! 

🪙 קיבלת 10z מתנה לחשבון שלך

התחל עכשיו:
• גלה תכנים מעניינים
• תן אמון למומחים
• שמור פוסטים למועדפים

🔗 ${window.location.origin}

בהצלחה! 💪
צוות Coali`
          })
        });
        console.log('✅ Welcome WhatsApp sent');
      } catch (whatsappError) {
        console.error('Failed to send welcome WhatsApp:', whatsappError);
      }
      
      localStorage.removeItem('signup_basic_info');
      
      setAuthData(prev => ({ ...prev, firstName, lastName }));
      toast.success('🎉 ברוך הבא ל-Coali!');
      navigate('/');
    } catch (error) {
      console.error('Error creating profile:', error);
      setAuthError('שגיאה טכנית');
      toast.error('שגיאה טכנית');
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
    // Pour renvoyer l'OTP, on revient à l'étape phone qui enverra via WhatsApp
    setCurrentStep('phone');
  };

  const handleAlternativeMethod = () => {
    toast.info('Changement de méthode non disponible pour le moment');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          
          {currentStep === 'phone' && (
            <PhoneInput
              onSubmit={handlePhoneSubmit}
              isLoading={authLoading}
            />
          )}
          
          {currentStep === 'otp' && (
            <OTPInput
              phone={authData.phone}
              onVerify={handleOTPVerify}
              onResend={handleResendOTP}
              onAlternativeMethod={handleAlternativeMethod}
              isLoading={authLoading}
            />
          )}
          
          {currentStep === 'profile' && (
            <ProfileCompletion
              onComplete={handleProfileComplete}
              isLoading={authLoading}
            />
          )}

          {authError && (
            <div className="text-center">
              <p className="text-sm text-destructive">{authError}</p>
            </div>
          )}
          
          {/* Demo Mode Button */}
          {currentStep === 'phone' && (
            <div className="mt-8">
              <button
                onClick={() => {
                  localStorage.setItem('isAuthenticated', 'true');
                  navigate('/');
                }}
                className="w-full py-3 bg-gradient-to-r from-primary to-watch text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                🎮 כניסה למצב דמו
              </button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                גישה מיידית ללא הרשמה
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          © 2024 Coali Trust Network
        </p>
      </div>
      
      {/* Bottom Navigation - Always Visible */}
      <Navigation zoozBalance={9957} />
    </div>
  );
};
