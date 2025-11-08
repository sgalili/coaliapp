/**
 * Streamlined Profile Completion - Step 2 of Onboarding
 * Only asks for First Name + Last Name
 * Progressive completion happens later when needed
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCompletionProps {
  onComplete: (firstName: string, lastName: string) => void;
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
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});

  React.useEffect(() => {
    const stateToSave = { firstName, lastName };
    localStorage.setItem('signup_basic_info', JSON.stringify(stateToSave));
  }, [firstName, lastName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { firstName?: string; lastName?: string } = {};
    
    if (!firstName.trim()) newErrors.firstName = 'שם פרטי נדרש';
    if (!lastName.trim()) newErrors.lastName = 'שם משפחה נדרש';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    localStorage.removeItem('signup_basic_info');
    onComplete(firstName.trim(), lastName.trim());
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold">ספר לנו קצת עליך</h1>
        <p className="text-muted-foreground text-sm">רק שני פרטים ואתה בפנים!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Button type="submit" className="w-full py-6 text-lg font-bold" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>רגע...</span>
            </div>
          ) : 'התחל'}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground mt-4">
          תוכל להשלים את הפרופיל שלך מאוחר יותר
        </p>
      </form>
    </div>
  );
};
