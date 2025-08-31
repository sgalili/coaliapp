import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPInput } from '@/components/auth/OTPInput';
import { ProfileCompletion } from '@/components/auth/ProfileCompletion';
import { LanguageSelector } from '@/components/auth/LanguageSelector';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
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
      
      // Vérifier l'OTP via notre fonction WhatsApp
      const { data, error: fnError } = await supabase.functions.invoke('whatsapp-otp-verify', {
        body: { phone: authData.phone, otp },
      });

      if (fnError) {
        console.error('Error verifying OTP:', fnError);
        toast.error('Code incorrect');
        setAuthError('Code de vérification incorrect');
        return;
      }

      if (!data?.success) {
        toast.error('Code incorrect');
        setAuthError('Code de vérification incorrect');
        return;
      }
      
      console.log('OTP verified successfully:', data);
      toast.success('Vérification réussie !');
      setAuthData(prev => ({ ...prev, otp }));
      
      // Passer directement à l'étape profil - on créera l'utilisateur Supabase après
      setCurrentStep('profile');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setAuthError('Erreur de vérification');
    }
  };

  const handleBasicProfileComplete = async (firstName: string, lastName: string, profilePicture?: string) => {
    // Stocker les données de profil et passer à l'étape suivante
    // La création de l'utilisateur Supabase se fera plus tard dans le process
    setAuthData(prev => ({ ...prev, firstName, lastName, profilePicture }));
    
    // Handle invitation code or trust intent if present
    if (authData.invitationCode) {
      // TODO: Consume invitation code
      console.log('Invitation code present:', authData.invitationCode);
    }
    
    // L'utilisateur reste dans ProfileCompletion pour l'étape 2 (bio/domaines)
  };

  const handleFullProfileComplete = async () => {
    try {
      setAuthError('');
      
      // Créer l'utilisateur Supabase maintenant que tout le profil est complété
      const tempEmail = `${authData.phone.replace(/[^0-9]/g, '')}@temp.coalichain.com`;
      const tempPassword = `temp_${Math.random().toString(36).substring(2, 15)}`;
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: tempEmail,
        password: tempPassword,
        options: {
          data: {
            phone: authData.phone,
            first_name: authData.firstName,
            last_name: authData.lastName,
            temp_auth: true
          }
        }
      });

      if (signUpError) {
        console.error('Error creating Supabase user:', signUpError);
        toast.error('Erreur lors de la création du compte');
        setAuthError('Impossible de créer le compte');
        return;
      }
      
      // Connecter l'utilisateur
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password: tempPassword,
      });

      if (signInError) {
        console.error('Error signing in user:', signInError);
        toast.error('Erreur lors de la connexion');
        setAuthError('Impossible de se connecter');
        return;
      }

      // Mettre à jour l'avatar si présent
      if (authData.profilePicture && signUpData.user) {
        await supabase
          .from('profiles')
          .update({ avatar_url: authData.profilePicture })
          .eq('user_id', signUpData.user.id);
      }
      
      // Gérer le code d'invitation si présent
      if (authData.invitationCode) {
        console.log('Consuming invitation code:', authData.invitationCode);
      }
      
      toast.success('Compte créé avec succès !');
      // Navigation vers l'app
      navigate('/');
    } catch (error) {
      console.error('Error creating account:', error);
      setAuthError('Erreur technique');
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
              onBasicComplete={handleBasicProfileComplete}
              onFullComplete={handleFullProfileComplete}
              isLoading={authLoading}
            />
          )}

          {authError && (
            <div className="text-center">
              <p className="text-sm text-destructive">{authError}</p>
            </div>
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
