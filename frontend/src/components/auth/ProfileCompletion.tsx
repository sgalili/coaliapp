/**
 * Streamlined Profile Completion - Step 2
 * Profile Picture + First Name + Last Name (all mandatory)
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfilePictureUpload } from '@/components/ProfilePictureUpload';
import { cn } from '@/lib/utils';

interface ProfileCompletionProps {
  onComplete: (firstName: string, lastName: string, profilePicture: string) => void;
  isLoading: boolean;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onComplete, isLoading }) => {
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem('signup_basic_info');
      if (saved) return JSON.parse(saved);
    } catch (error) {
      return null;
    }
    return null;
  };

  const savedState = loadSavedState();

  const [firstName, setFirstName] = useState(savedState?.firstName || '');
  const [lastName, setLastName] = useState(savedState?.lastName || '');
  const [profilePicture, setProfilePicture] = useState(savedState?.profilePicture || '');
  const [errors, setErrors] = useState<{ 
    firstName?: string; 
    lastName?: string;
    profilePicture?: string;
  }>({});

  React.useEffect(() => {
    const stateToSave = { firstName, lastName, profilePicture };
    localStorage.setItem('signup_basic_info', JSON.stringify(stateToSave));
  }, [firstName, lastName, profilePicture]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { firstName?: string; lastName?: string; profilePicture?: string } = {};
    
    if (!firstName.trim()) newErrors.firstName = 'שם פרטי נדרש';
    if (!lastName.trim()) newErrors.lastName = 'שם משפחה נדרש';
    if (!profilePicture) newErrors.profilePicture = 'תמונת פרופיל נדרשת';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    localStorage.removeItem('signup_basic_info');
    onComplete(firstName.trim(), lastName.trim(), profilePicture);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6">ברוכים הבאים לקואלי</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture - No Box, With Placeholder */}
        <div className="flex flex-col items-center">
          <ProfilePictureUpload
            currentImageUrl={profilePicture}
            onImageChange={setProfilePicture}
            userInitials={`${firstName.charAt(0)}${lastName.charAt(0)}`}
            hideUploadButton={true}
          />
          {!profilePicture && (
            <p className="text-xs text-muted-foreground mt-2">לחץ להוספת תמונת פרופיל</p>
          )}
          {errors.profilePicture && (
            <p className="text-sm text-red-500 text-center mt-2">{errors.profilePicture}</p>
          )}
        </div>

        {/* Name Fields - Same Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="שם פרטי *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={cn("text-lg py-6 text-right", errors.firstName && "border-red-500")}
              disabled={isLoading}
              autoFocus
            />
            {errors.firstName && <p className="text-sm text-red-500 text-right">{errors.firstName}</p>}
          </div>
          
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="שם משפחה *"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={cn("text-lg py-6 text-right", errors.lastName && "border-red-500")}
              disabled={isLoading}
            />
            {errors.lastName && <p className="text-sm text-red-500 text-right">{errors.lastName}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full py-6 text-lg font-bold" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>רגע...</span>
            </div>
          ) : 'התחל'}
        </Button>
      </form>
    </div>
  );
};
