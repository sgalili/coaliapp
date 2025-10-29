import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera } from 'lucide-react';

interface ProfileCompletionProps {
  onComplete: (firstName: string, lastName: string, profilePicture?: string) => void;
  isLoading: boolean;
  onStartOnboarding?: () => void; // New prop for triggering onboarding
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onComplete, isLoading, onStartOnboarding }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { firstName?: string; lastName?: string } = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = t('auth.firstNameRequired');
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = t('auth.lastNameRequired');
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    // Check if we should trigger onboarding flow
    if (onStartOnboarding) {
      // Save profile data first
      onComplete(firstName.trim(), lastName.trim(), profilePicture);
      // Then trigger onboarding
      onStartOnboarding();
    } else {
      onComplete(firstName.trim(), lastName.trim(), profilePicture);
    }
  };

  const handleProfilePictureClick = () => {
    // TODO: Implement profile picture upload
    // For now, just use a placeholder
    const placeholders = [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=user3'
    ];
    const randomPicture = placeholders[Math.floor(Math.random() * placeholders.length)];
    setProfilePicture(randomPicture);
  };

  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('auth.completeProfile')}
        </h1>
        <p className="text-muted-foreground">
          {t('auth.finalizeRegistration')}
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex justify-center">
              <div className="relative">
                <Avatar 
                  className="w-20 h-20 cursor-pointer" 
                  onClick={handleProfilePictureClick}
                >
                  <AvatarImage src={profilePicture} />
                  <AvatarFallback className="text-lg">
                    {getInitials() || <Camera className="w-8 h-8" />}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Camera className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
            </div>

            {/* Name inputs */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder={t('auth.firstName')}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="text-lg py-3"
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder={t('auth.lastName')}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="text-lg py-3"
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-3 text-lg" 
              disabled={isLoading}
            >
              {isLoading ? t('auth.finalizing') : t('auth.start')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};