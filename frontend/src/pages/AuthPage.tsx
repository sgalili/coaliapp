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
      
      console.log('🔐 STARTING OTP VERIFICATION');
      console.log('Phone:', authData.phone);
      console.log('OTP:', otp);
      
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

      console.log('✅ OTP VERIFIED BY BACKEND');
      
      // CRITICAL: IMMEDIATELY clear any demo mode
      localStorage.removeItem('demo_mode');
      localStorage.removeItem('isAuthenticated'); // Clear old auth
      console.log('🧹 Cleared demo mode and old auth');
      
      // Check if profile already exists - FLEXIBLE phone search
      console.log('🔍 Checking for existing profile with phone:', authData.phone);
      
      // Try exact match first
      let { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', authData.phone)
        .maybeSingle();
      
      // If not found, try without country code prefix
      if (!existingProfile) {
        const phoneDigits = authData.phone.replace(/\D/g, ''); // Only digits
        console.log('🔍 Trying with digits only:', phoneDigits);
        
        const { data: profile2 } = await supabase
          .from('profiles')
          .select('*')
          .ilike('phone', `%${phoneDigits.slice(-9)}%`) // Last 9 digits
          .maybeSingle();
        
        existingProfile = profile2;
      }
      
      console.log('📊 Profile query result:');
      console.log('  Found:', !!existingProfile);
      console.log('  Error:', profileError);
      if (existingProfile) {
        console.log('  Profile data:', {
          user_id: existingProfile.user_id,
          first_name: existingProfile.first_name,
          last_name: existingProfile.last_name,
          phone: existingProfile.phone,
          is_demo: existingProfile.is_demo
        });
      }
      
      if (existingProfile) {
        // EXISTING REAL USER - LOGIN
        console.log('🔵 EXISTING USER FOUND - LOGGING IN');
        console.log('User: שי גלילי');
        console.log('Phone match:', existingProfile.phone, '===', authData.phone);
        
        // FORCE set as real user
        localStorage.clear(); // Clear EVERYTHING first
        localStorage.setItem('authenticated_user_id', existingProfile.user_id);
        localStorage.setItem('authenticated_user_phone', authData.phone);
        localStorage.setItem('authenticated_user_name', `${existingProfile.first_name} ${existingProfile.last_name}`);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user_is_real', 'true'); // Extra flag
        
        console.log('✅ REAL USER SESSION STORED');
        console.log('Stored user_id:', localStorage.getItem('authenticated_user_id'));
        
        toast.success(`ברוך הבא ${existingProfile.first_name}!`, { duration: 2000 });
        
        console.log('🚀 REDIRECTING TO HOMEPAGE IMMEDIATELY');
        
        // Immediate redirect (no delay)
        window.location.href = '/';
      } else {
        // NEW USER - Go to profile creation
        console.log('🟢 NEW USER - Going to profile completion');
        toast.success('קוד אומת! עוד צעד אחד');
        setAuthData(prev => ({ ...prev, otp }));
        setCurrentStep('profile');
      }
      
    } catch (error: any) {
      console.error('❌ OTP verification error:', error);
      setAuthError(error.message || 'שגיאה באימות הקוד');
      toast.error(error.message || 'קוד לא נכון');
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

      console.log('✅ REAL user profile created successfully');
      console.log('📊 Profile details:', {
        user_id: profile.user_id,
        phone: profile.phone,
        name: `${profile.first_name} ${profile.last_name}`,
        is_demo: profile.is_demo,
        zooz_balance: profile.zooz_balance
      });

      // Store REAL user session
      console.log('💾 Storing REAL user session...');
      localStorage.setItem('authenticated_user_id', userId);
      localStorage.setItem('authenticated_user_phone', authData.phone);
      localStorage.setItem('authenticated_user_name', `${firstName} ${lastName}`);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.removeItem('demo_mode');
      
      console.log('✅ Session stored for REAL user:', userId);
      console.log('✅ Removing demo mode, setting authenticated');
      console.log('📋 localStorage contents:');
      console.log('  - authenticated_user_id:', localStorage.getItem('authenticated_user_id'));
      console.log('  - authenticated_user_phone:', localStorage.getItem('authenticated_user_phone'));
      console.log('  - authenticated_user_name:', localStorage.getItem('authenticated_user_name'));
      console.log('  - isAuthenticated:', localStorage.getItem('isAuthenticated'));
      console.log('  - demo_mode:', localStorage.getItem('demo_mode'));

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
