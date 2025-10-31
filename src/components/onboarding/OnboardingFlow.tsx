import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileOnboardingStep } from './ProfileOnboardingStep';
import { OnboardingSuccessStep } from './OnboardingSuccessStep';
import { LanguageSelector } from '@/components/auth/LanguageSelector';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type OnboardingStep = 'trust-received' | 'profile-completion' | 'success';

interface OnboardingFlowProps {
  initialStep?: OnboardingStep;
  userTrustsReceived?: number;
  onComplete?: () => void;
}

interface ProfileData {
  bio: string;
  selectedDomains: string[];
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ 
  initialStep = 'profile-completion',
  userTrustsReceived = 0,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleProfileNext = async (bio: string, selectedDomains: string[]) => {
    setIsLoading(true);
    try {
      // TODO: Save profile data to backend
      console.log('Saving profile data:', { bio, selectedDomains });
      
      setProfileData({ bio, selectedDomains });
      
      // Award 10 ZOOZ for profile completion
      // TODO: Integrate with ZOOZ system
      console.log('Awarding 10 ZOOZ for profile completion');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStep('success');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGiveTrust = () => {
    // TODO: Navigate to trust friends flow (Screen 4 - to be implemented later)
    console.log('Navigating to give trust flow');
    if (onComplete) {
      onComplete();
    }
    navigate('/'); // For now, go to home
  };

  const handleGoToWallet = () => {
    navigate('/wallet');
  };

  const handleBack = () => {
    if (currentStep === 'success') {
      setCurrentStep('profile-completion');
    } else {
      // Go back to auth or home
      navigate('/auth');
    }
  };

  const renderTrustReceivedStep = () => {
    // TODO: Implement this screen when we have trust detection logic
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">
          קיבלת אמון מ-{userTrustsReceived} אנשים!
        </h1>
        <p className="text-muted-foreground">
          השלם את הפרופיל שלך כדי לראות מי נתן לך אמון
        </p>
        <Button onClick={() => setCurrentStep('profile-completion')}>
          המשך
        </Button>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'trust-received':
        return renderTrustReceivedStep();
      
      case 'profile-completion':
        return (
          <ProfileOnboardingStep
            onNext={handleProfileNext}
            isLoading={isLoading}
          />
        );
      
      case 'success':
        return (
          <OnboardingSuccessStep
            onGiveTrust={handleGiveTrust}
            onGoToWallet={handleGoToWallet}
            isLoading={isLoading}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex-1" />
        
        <LanguageSelector />
      </div>

      {/* Progress indicator */}
      <div className="px-4 pb-4">
        <div className="flex space-x-2">
          <div className={`h-1 flex-1 rounded-full transition-colors ${
            currentStep === 'profile-completion' ? 'bg-primary' : 'bg-primary/30'
          }`} />
          <div className={`h-1 flex-1 rounded-full transition-colors ${
            currentStep === 'success' ? 'bg-primary' : 'bg-muted'
          }`} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center p-4 pt-8">
        <div className="w-full max-w-md">
          {renderCurrentStep()}
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