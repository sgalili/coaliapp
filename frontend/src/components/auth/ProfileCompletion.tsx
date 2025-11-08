import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { ProfilePictureUpload } from '@/components/ProfilePictureUpload';
import { CityAutocomplete } from '@/components/CityAutocomplete';
import { cn } from '@/lib/utils';

interface ProfileCompletionProps {
  onComplete: (firstName: string, lastName: string) => void;
  isLoading: boolean;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onComplete, isLoading }) => {
  // Load saved state
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem('signup_basic_info');
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
    return null;
  };

  const savedState = loadSavedState();

  const [firstName, setFirstName] = useState(savedState?.firstName || '');
  const [lastName, setLastName] = useState(savedState?.lastName || '');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});

  // Save state to localStorage
  React.useEffect(() => {
    const stateToSave = { firstName, lastName };
    localStorage.setItem('signup_basic_info', JSON.stringify(stateToSave));
  }, [firstName, lastName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { firstName?: string; lastName?: string } = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'שם פרטי נדרש';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'שם משפחה נדרש';
    }
    
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
      {/* Clean Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold">
          ספר לנו קצת עליך
        </h1>
        
        <p className="text-muted-foreground text-sm">
          רק שני פרטים ואתה בפנים!
        </p>
      </div>

      {/* Simple Form - Just Names */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="שם פרטי *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={cn(
              "text-lg py-6 text-right",
              errors.firstName && "border-red-500"
            )}
            disabled={isLoading}
            autoFocus
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 text-right">{errors.firstName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="שם משפחה *"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={cn(
              "text-lg py-6 text-right",
              errors.lastName && "border-red-500"
            )}
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 text-right">{errors.lastName}</p>
          )}
        </div>

        {/* Clean Submit Button */}
        <Button 
          type="submit" 
          className="w-full py-6 text-lg font-bold" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>רגע...</span>
            </div>
          ) : (
            'התחל'
          )}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground mt-4">
          תוכל להשלים את הפרופיל שלך מאוחר יותר
        </p>
      </form>
    </div>
  );
};

const ALL_EXPERTISE_FIELDS = [
  { id: 'politics', label: 'פוליטיקה', icon: '🏛️' },
  { id: 'economy', label: 'כלכלה', icon: '💰' },
  { id: 'healthcare', label: 'בריאות', icon: '🏥' },
  { id: 'technology', label: 'טכנולוגיה', icon: '💻' },
  { id: 'education', label: 'חינוך', icon: '📚' },
  { id: 'environment', label: 'סביבה', icon: '🌍' },
  { id: 'security', label: 'ביטחון', icon: '🛡️' },
  { id: 'society', label: 'חברה', icon: '👥' },
  { id: 'law', label: 'משפט', icon: '⚖️' },
  { id: 'media', label: 'תקשורת', icon: '📺' },
  { id: 'arts', label: 'אמנות ותרבות', icon: '🎨' },
  { id: 'sports', label: 'ספורט', icon: '⚽' },
  { id: 'science', label: 'מדע ומחקר', icon: '🔬' },
  { id: 'business', label: 'עסקים ויזמות', icon: '📊' },
  { id: 'real-estate', label: 'נדל"ן', icon: '🏢' },
  { id: 'transportation', label: 'תחבורה', icon: '🚗' },
  { id: 'agriculture', label: 'חקלאות', icon: '🌾' },
  { id: 'tourism', label: 'תיירות', icon: '✈️' },
  { id: 'food', label: 'קולינריה ומזון', icon: '🍽️' },
  { id: 'general', label: 'כללי', icon: '📋' },
];

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onComplete, isLoading }) => {
  // Load saved state from localStorage
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem('signup_form_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
    return null;
  };

  const savedState = loadSavedState();

  const [title, setTitle] = useState(savedState?.title || '');
  const [firstName, setFirstName] = useState(savedState?.firstName || '');
  const [lastName, setLastName] = useState(savedState?.lastName || '');
  const [city, setCity] = useState(savedState?.city || '');
  const [dateOfBirth, setDateOfBirth] = useState(savedState?.dateOfBirth || '');
  const [idNumber, setIdNumber] = useState(savedState?.idNumber || '');
  const [profilePicture, setProfilePicture] = useState<string>(savedState?.profilePicture || '');
  const [selectedFields, setSelectedFields] = useState<string[]>(savedState?.selectedFields || []);
  const [errors, setErrors] = useState<{ 
    firstName?: string; 
    lastName?: string; 
    profilePicture?: string;
    city?: string;
    dateOfBirth?: string;
    idNumber?: string;
  }>({});
  const { t } = useTranslation();

  // Save state to localStorage whenever it changes
  React.useEffect(() => {
    const stateToSave = {
      title,
      firstName,
      lastName,
      city,
      dateOfBirth,
      idNumber,
      profilePicture,
      selectedFields
    };
    localStorage.setItem('signup_form_state', JSON.stringify(stateToSave));
  }, [title, firstName, lastName, city, dateOfBirth, idNumber, profilePicture, selectedFields]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { 
      firstName?: string; 
      lastName?: string; 
      profilePicture?: string;
      city?: string;
      dateOfBirth?: string;
      idNumber?: string;
    } = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'שם פרטי נדרש';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'שם משפחה נדרש';
    }
    
    if (!city.trim()) {
      newErrors.city = 'עיר מגורים נדרשת';
    }
    
    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'תאריך לידה נדרש';
    }
    
    if (!idNumber.trim()) {
      newErrors.idNumber = 'מספר תעודת זהות נדרש';
    } else if (!/^\d{9}$/.test(idNumber)) {
      newErrors.idNumber = 'מספר תעודת זהות חייב להיות 9 ספרות';
    }
    
    if (!profilePicture) {
      newErrors.profilePicture = 'תמונת פרופיל נדרשת';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Don't reset form - errors will be displayed but data is preserved
      return;
    }
    
    setErrors({});
    
    // Clear saved form state on successful submission
    localStorage.removeItem('signup_form_state');
    
    // Complete signup - no onboarding step
    onComplete(firstName.trim(), lastName.trim(), profilePicture, selectedFields);
  };

  const handleProfilePictureClick = () => {
    // TODO: Implement actual profile picture upload
    const placeholders = [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Date.now(),
      'https://api.dicebear.com/7.x/personas/svg?seed=' + Date.now(),
      'https://api.dicebear.com/7.x/fun-emoji/svg?seed=' + Date.now()
    ];
    const randomPicture = placeholders[Math.floor(Math.random() * placeholders.length)];
    setProfilePicture(randomPicture);
  };

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => {
      if (prev.includes(fieldId)) {
        // Remove if already selected
        return prev.filter(f => f !== fieldId);
      } else {
        // Add only if less than 3 selected
        if (prev.length < 3) {
          return [...prev, fieldId];
        }
        return prev; // Don't add if already 3 selected
      }
    });
  };

  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const enabledCount = Object.values(selectedFields).filter(Boolean).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Gamified Header - No Icon */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
          השלם את ההרשמה וקבל 10z מתנה
        </h1>
        
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>טלפון אומת</span>
          </div>
          <span className="text-muted-foreground">←</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
            <span className="text-primary font-medium">פרטים אישיים</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Upload - MANDATORY */}
        <Card className={cn(
          "border-2 transition-colors",
          errors.profilePicture ? "border-red-500" : profilePicture ? "border-green-500" : "border-dashed"
        )}>
          <CardContent className="p-6">
            <ProfilePictureUpload
              currentImageUrl={profilePicture}
              onImageChange={setProfilePicture}
              userInitials={`${firstName.charAt(0)}${lastName.charAt(0)}`}
            />
            {errors.profilePicture && (
              <p className="text-sm text-red-500 text-center mt-2">{errors.profilePicture}</p>
            )}
          </CardContent>
        </Card>

        {/* Title Field */}
        <div>
          <Input
            type="text"
            placeholder='תואר (אופציונלי) - לדוגמה: פרופ׳, ד"ר, עו"ד, מאמן'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg py-6 text-right"
            disabled={isLoading}
          />
        </div>

        {/* Name Inputs - Same Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="שם פרטי *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={cn(
                "text-lg py-6 text-right",
                errors.firstName && "border-red-500"
              )}
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 text-right">{errors.firstName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="שם משפחה *"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={cn(
                "text-lg py-6 text-right",
                errors.lastName && "border-red-500"
              )}
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 text-right">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Additional Required Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <CityAutocomplete
              value={city}
              onChange={setCity}
              placeholder="עיר מגורים *"
              className={cn(
                "text-lg py-6 text-right",
                errors.city && "border-red-500"
              )}
            />
            {errors.city && (
              <p className="text-sm text-red-500 text-right">{errors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="date"
              placeholder="תאריך לידה *"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className={cn(
                "text-lg py-6 text-right",
                errors.dateOfBirth && "border-red-500"
              )}
              disabled={isLoading}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500 text-right">{errors.dateOfBirth}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              placeholder="מספר תעודת זהות (9 ספרות) *"
              value={idNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                setIdNumber(value);
              }}
              maxLength={9}
              className={cn(
                "text-lg py-6 text-right",
                errors.idNumber && "border-red-500"
              )}
              disabled={isLoading}
            />
            {errors.idNumber && (
              <p className="text-sm text-red-500 text-right">{errors.idNumber}</p>
            )}
          </div>
        </div>

        {/* Expertise Fields Selection - Max 3 */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">באיזה תחומים אתה מתמחה? (לא חובה)</h3>
                <span className={cn(
                  "text-sm font-medium",
                  selectedFields.length >= 3 ? "text-primary" : "text-muted-foreground"
                )}>
                  {selectedFields.length}/3
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
                {ALL_EXPERTISE_FIELDS.map(field => {
                  const isSelected = selectedFields.includes(field.id);
                  const isDisabled = !isSelected && selectedFields.length >= 3;
                  
                  return (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => handleFieldToggle(field.id)}
                      disabled={isDisabled}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-right",
                        isSelected && "border-primary bg-primary/10 shadow-md scale-105",
                        !isSelected && !isDisabled && "border-border hover:border-primary/50 hover:bg-muted",
                        isDisabled && "border-border opacity-40 cursor-not-allowed"
                      )}
                    >
                      <span className="text-xl">{field.icon}</span>
                      <span className="text-sm font-medium flex-1">{field.label}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {selectedFields.length >= 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  הגעת למקסימום 3 תחומי התמחות
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Gamified Submit Button */}
        <Button 
          type="submit" 
          className="w-full py-6 text-lg font-bold bg-gradient-to-r from-primary via-primary/90 to-primary hover:scale-105 transition-transform shadow-lg relative overflow-hidden group" 
          disabled={isLoading}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>רק רגע...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>התחל וקבל 10z!</span>
                <Sparkles className="w-5 h-5" />
              </>
            )}
          </span>
        </Button>
      </form>
    </div>
  );
};