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
      
      // Verify OTP via backend
      const backendUrl = 'https://trustflow-4.preview.emergentagent.com';
      const response = await fetch(`${backendUrl}/api/otp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: authData.phone, 
          otp: otp 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Invalid OTP');
      }

      const result = await response.json();
      console.log('✅ OTP verified successfully');
      console.log('📞 Phone verified:', authData.phone);
      
      // Check if user profile exists
      console.log('🔍 Checking if profile exists for phone:', authData.phone);
      
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', authData.phone)
        .maybeSingle();
      
      console.log('📊 Profile query result:', { 
        found: !!existingProfile, 
        error: profileError,
        user_id: existingProfile?.user_id,
        name: existingProfile ? `${existingProfile.first_name} ${existingProfile.last_name}` : 'N/A'
      });
      
      if (existingProfile) {
        // EXISTING USER - Log them in immediately
        console.log('✅ EXISTING USER FOUND');
        console.log('User ID:', existingProfile.user_id);
        console.log('User name:', existingProfile.first_name, existingProfile.last_name);
        console.log('Is demo?:', existingProfile.is_demo);
        
        console.log('💾 Storing session in localStorage...');
        localStorage.setItem('authenticated_user_id', existingProfile.user_id);
        localStorage.setItem('authenticated_user_phone', authData.phone);
        localStorage.setItem('authenticated_user_name', `${existingProfile.first_name} ${existingProfile.last_name}`);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.removeItem('demo_mode');
        
        console.log('✅ Session stored:');
        console.log('  - authenticated_user_id:', localStorage.getItem('authenticated_user_id'));
        console.log('  - authenticated_user_phone:', localStorage.getItem('authenticated_user_phone'));
        console.log('  - isAuthenticated:', localStorage.getItem('isAuthenticated'));
        
        toast.success(`ברוך הבא ${existingProfile.first_name}!`, { duration: 3000 });
        
        console.log('🔄 Redirecting to homepage in 1 second...');
        
        // Wait a bit to ensure localStorage is written
        setTimeout(() => {
          console.log('🚀 REDIRECTING NOW');
          window.location.href = '/';
        }, 1000);
      } else {
        // NEW USER - Go to profile completion
        console.log('📝 NEW USER - No profile found');
        console.log('📝 Going to profile completion step');
        toast.success('קוד אומת בהצלחה!');
        setAuthData(prev => ({ ...prev, otp }));
        setCurrentStep('profile');
      }
      
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      let errorMessage = 'שגיאה באימות הקוד';
      if (error.message?.includes('expired')) {
        errorMessage = 'הקוד פג תוקף';
      } else if (error.message?.includes('invalid') || error.message?.includes('Invalid')) {
        errorMessage = 'קוד לא נכון';
      } else if (error.message?.includes('Too many')) {
        errorMessage = 'יותר מדי ניסיונות';
      }
      
      setAuthError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleProfileComplete = async (firstName: string, lastName: string, profilePicture: string) => {
    try {
      setAuthError('');
      
      // Generate UUID for new user
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const userId = generateUUID();
      
      console.log('📝 Creating profile for new user:', userId);
      
      const profileData = {
        user_id: userId,
        phone: authData.phone,
        first_name: firstName,
        last_name: lastName,
        avatar_url: profilePicture,
        is_verified: true,
        zooz_balance: 10,
        is_demo: false,
        created_at: new Date().toISOString()
      };
      
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
      localStorage.setItem('authenticated_user_id', userId);
      localStorage.setItem('authenticated_user_phone', authData.phone);
      localStorage.setItem('authenticated_user_name', `${firstName} ${lastName}`);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.removeItem('demo_mode');
      
      console.log('✅ Session stored for real user:', userId);
      console.log('✅ Removing demo mode, setting authenticated');

      // Send welcome WhatsApp
      try {
        const backendUrl = 'https://trustflow-4.preview.emergentagent.com';
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
      
      console.log('🔄 Redirecting to homepage as REAL user');
      
      // Force page reload to ensure new session is loaded
      window.location.href = '/';
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
