import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera } from 'lucide-react';

interface ProfileCompletionProps {
  onBasicComplete: (firstName: string, lastName: string, profilePicture?: string) => void;
  onFullComplete: () => void;
  isLoading: boolean;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onBasicComplete, onFullComplete, isLoading }) => {
  const [step, setStep] = useState<'basic' | 'bio'>('basic');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [bio, setBio] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});
  const { t } = useTranslation();

  // Domaines disponibles
  const domains = [
    { id: 'tech', name: 'טכנולוגיה', icon: '💻', color: 'bg-blue-100 text-blue-800' },
    { id: 'finance', name: 'כלכלה ופיננסים', icon: '💰', color: 'bg-green-100 text-green-800' },
    { id: 'politics', name: 'פוליטיקה', icon: '🏛️', color: 'bg-red-100 text-red-800' },
    { id: 'sports', name: 'ספורט', icon: '⚽', color: 'bg-orange-100 text-orange-800' },
    { id: 'health', name: 'בריאות', icon: '🏥', color: 'bg-cyan-100 text-cyan-800' },
    { id: 'education', name: 'חינוך', icon: '📚', color: 'bg-purple-100 text-purple-800' }
  ];

  const handleBasicSubmit = (e: React.FormEvent) => {
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
    
    // Créer le profil de base dans Supabase
    onBasicComplete(firstName.trim(), lastName.trim(), profilePicture);
    
    // Passer à l'étape bio
    setStep('bio');
  };

  const handleBioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Sauvegarder la bio et les domaines
    onFullComplete();
  };

  const handleSkipBio = () => {
    onFullComplete();
  };

  const toggleDomain = (domainId: string) => {
    setSelectedDomains(prev => {
      if (prev.includes(domainId)) {
        return prev.filter(id => id !== domainId);
      } else if (prev.length < 3) {
        return [...prev, domainId];
      }
      return prev;
    });
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

  if (step === 'basic') {
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
            שלב 1 מתוך 2: פרטים בסיסיים
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleBasicSubmit} className="space-y-6">
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
                {isLoading ? 'יוצר פרופיל...' : 'המשך'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Bio and domains (optional)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          השלם את הפרופיל שלך
        </h1>
        <p className="text-muted-foreground">
          שלב 2 מתוך 2: תוכן אישי (אופציונלי)
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleBioSubmit} className="space-y-6">
            {/* Bio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                ביוגרפיה קצרה
              </label>
              <textarea
                placeholder="ספר קצת על עצמך..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 border rounded-md resize-none h-24"
                disabled={isLoading}
              />
            </div>

            {/* Domains */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                תחומי עניין (עד 3)
              </label>
              <div className="flex flex-wrap gap-2">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => toggleDomain(domain.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedDomains.includes(domain.id)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                    disabled={!selectedDomains.includes(domain.id) && selectedDomains.length >= 3}
                  >
                    <span>{domain.icon}</span>
                    <span>{domain.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="button"
                variant="outline"
                onClick={handleSkipBio}
                className="flex-1"
                disabled={isLoading}
              >
                דלג
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isLoading}
              >
                {isLoading ? 'שומר...' : 'סיום'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};