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
      setAuthError(''); // Clear any previous errors
      
      const { data, error } = await supabase.functions.invoke('whatsapp-otp-verify-and-login', {
        body: { phone: authData.phone, otp }
      });

      if (error) throw error;

      // Établir la session Supabase avec les tokens retournés
      await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      console.log('User session established:', data.user);
      toast.success('Vérification réussie !');
      
      // Send welcome WhatsApp message
      try {
        const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
        await fetch(`${backendUrl}/api/whatsapp/send-message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone_number: authData.phone,
            message: `🎉 תודה שהצטרפת ל-Coali!\n\nאנחנו שמחים שאת/ה כאן. בוא/י לגלות את רשת האמון שלנו, לקחת חלק בהחלטות חשובות ולבנות ביחד קהילה מבוססת אמון.\n\n🔗 התחל לפעול עכשיו: ${window.location.origin}\n\nבהצלחה! 💪`
          })
        });
        console.log('✅ Welcome WhatsApp message sent');
      } catch (whatsappError) {
        console.error('Failed to send welcome WhatsApp:', whatsappError);
        // Don't fail the auth flow if WhatsApp fails
      }
      
      setAuthData(prev => ({ ...prev, otp }));
      setCurrentStep('profile');
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      let errorMessage = 'שגיאה באימות הקוד';
      if (error.message?.includes('expired') || error.message?.includes('otp_expired')) {
        errorMessage = 'הקוד פג תוקף';
        toast.error('Code expiré');
      } else if (error.message?.includes('invalid') || error.message?.includes('otp_invalid')) {
        errorMessage = 'קוד לא נכון';
        toast.error('Code incorrect');
      } else if (error.message?.includes('not found') || error.message?.includes('otp_not_found')) {
        errorMessage = 'קוד לא נמצא';
        toast.error('Code non trouvé');
      } else {
        toast.error('Code incorrect');
      }
      
      setAuthError(errorMessage);
    }
  };

  const handleProfileComplete = async (firstName: string, lastName: string) => {
    try {
      setAuthError('');
      
      // Create simple profile with just phone + name
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      const { data: profile, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          phone: authData.phone,
          first_name: firstName,
          last_name: lastName,
          is_verified: true,
          zooz_balance: 10,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        toast.error('שגיאה ביצירת הפרופיל');
        return;
      }

      console.log('✅ Profile created:', profile);

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
