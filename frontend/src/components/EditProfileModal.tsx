/**
 * User Edit Profile Modal
 * Allows users to edit their own profile
 */

import React, { useState, useEffect } from 'react';
import { X, Camera, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProfilePictureUpload } from '@/components/ProfilePictureUpload';
import { CityAutocomplete } from '@/components/CityAutocomplete';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface EditProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  missingFields?: string[];
  action?: string;
}

const ALL_EXPERTISE_FIELDS = [
  'פוליטיקה', 'כלכלה', 'בריאות', 'טכנולוגיה', 'חינוך', 'סביבה',
  'ביטחון', 'חברה', 'משפט', 'תקשורת', 'אמנות ותרבות', 'ספורט',
  'מדע ומחקר', 'עסקים ויזמות', 'נדל"ן', 'תחבורה', 'חקלאות',
  'תיירות', 'קולינריה ומזון', 'כללי'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  userId,
  isOpen,
  onClose,
  onSave,
  missingFields = [],
  action = ''
}) => {
  const [formData, setFormData] = useState({
    title: '',
    first_name: '',
    last_name: '',
    city: '',
    bio: '',
    avatar_url: '',
    id_number: '',
    expertise_fields: [] as string[]
  });
  
  const [loading, setLoading] = useState(false);
  const [hasIdNumber, setHasIdNumber] = useState(false); // Track if ID already set
  
  // Check if field is missing and needs highlighting
  const isFieldMissing = (fieldName: string) => missingFields.includes(fieldName);

  useEffect(() => {
    if (isOpen && userId) {
      loadUserProfile();
    }
  }, [isOpen, userId]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFormData({
          title: data.title || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          city: data.city || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          id_number: data.id_number || '',
          expertise_fields: data.expertise_fields || []
        });
        
        // Check if ID number already exists
        setHasIdNumber(!!(data.id_number && data.id_number.length === 9));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('שגיאה בטעינת הפרופיל');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Profile update error:', error);
        console.error('Form data:', formData);
        throw error;
      }
      
      toast.success('הפרופיל עודכן בהצלחה! ✨');
      onSave();
      onClose();
      
      // Auto-redirect to PROFILE page after save
      setTimeout(() => {
        window.location.href = '/profile';
      }, 500);
      
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(`שגיאה בשמירה: ${error.message || 'שגיאה לא ידועה'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldToggle = (field: string) => {
    setFormData(prev => ({
      ...prev,
      expertise_fields: prev.expertise_fields.includes(field)
        ? prev.expertise_fields.filter(f => f !== field)
        : prev.expertise_fields.length < 3
          ? [...prev.expertise_fields, field]
          : prev.expertise_fields
    }));
  };

  const handleAvatarClick = () => {
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    setFormData(prev => ({ ...prev, avatar_url: newAvatar }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:left-4 [&>button]:right-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">ערוך פרופיל</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Picture Upload - No button */}
          <ProfilePictureUpload
            currentImageUrl={formData.avatar_url}
            onImageChange={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
            userInitials={`${formData.first_name.charAt(0)}${formData.last_name.charAt(0)}`}
            hideUploadButton={true}
          />

          {/* Job Title Field */}
          <div>
            <label className="text-sm font-medium text-right block mb-1">
              Job Title
              {missingFields.includes('title') && <span className="text-red-500 mr-1">*</span>}
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder='e.g., Software Engineer, Product Manager'
              className={cn(
                "text-right",
                missingFields.includes('title') && "border-red-500 border-2"
              )}
            />
            {missingFields.includes('title') && (
              <p className="text-sm text-red-500 mt-1">שדה חובה לפרסום בקואלי</p>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-right block mb-1">שם פרטי</label>
              <Input
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="שם פרטי"
                className="text-right"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-right block mb-1">שם משפחה</label>
              <Input
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="שם משפחה"
                className="text-right"
              />
            </div>
          </div>

          {/* City with Autocomplete */}
          <div>
            <label className="text-sm font-medium text-right block mb-1">
              עיר מגורים
              {missingFields.includes('city') && <span className="text-red-500 mr-1">*</span>}
            </label>
            <CityAutocomplete
              value={formData.city}
              onChange={(city) => setFormData(prev => ({ ...prev, city }))}
              className={cn(
                "text-right",
                missingFields.includes('city') && "border-red-500 border-2"
              )}
            />
            {missingFields.includes('city') && (
              <p className="text-sm text-red-500 mt-1">שדה חובה לפרסום בקואלי</p>
            )}
          </div>

          {/* ID Number - Can't edit once set */}
          <div>
            <label className="text-sm font-medium text-right block mb-1">
              מספר תעודת זהות
              {missingFields.includes('id_number') && <span className="text-red-500 mr-1">*</span>}
            </label>
            {hasIdNumber ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700 font-medium">תעודת זהות אומתה ✓</span>
              </div>
            ) : (
              <>
                <Input
                  value={formData.id_number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                    setFormData(prev => ({ ...prev, id_number: value }));
                  }}
                  placeholder="9 ספרות"
                  maxLength={9}
                  className={cn(
                    "text-right",
                    missingFields.includes('id_number') && "border-red-500 border-2"
                  )}
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  🔒 המספר יישמר מוצפן ולא יוצג למשתמשים אחרים
                </p>
                {missingFields.includes('id_number') && (
                  <p className="text-sm text-red-500 mt-1">שדה חובה לפרסום בקואלי</p>
                )}
              </>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-medium">
              ביוגרפיה
              {missingFields.includes('bio') && <span className="text-red-500 mr-1">*</span>}
            </label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="ספר קצת על עצמך..."
              className={cn(
                "min-h-[100px]",
                missingFields.includes('bio') && "border-red-500 border-2"
              )}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.bio.length}/500 תווים
            </p>
            {missingFields.includes('bio') && (
              <p className="text-sm text-red-500 mt-1">שדה חובה לפרסום בקואלי</p>
            )}
          </div>

          {/* Expertise Fields - Max 3 */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              תחומי מומחיות (עד 3)
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg">
              {ALL_EXPERTISE_FIELDS.map(field => {
                const isSelected = formData.expertise_fields.includes(field);
                const isDisabled = !isSelected && formData.expertise_fields.length >= 3;
                
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => handleFieldToggle(field)}
                    disabled={isDisabled}
                    className={cn(
                      "p-2 rounded text-xs transition-all",
                      isSelected && "bg-primary text-primary-foreground shadow-md",
                      !isSelected && !isDisabled && "bg-muted hover:bg-muted/80",
                      isDisabled && "bg-muted/50 opacity-40 cursor-not-allowed"
                    )}
                  >
                    {field}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formData.expertise_fields.length}/3 נבחרו
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              שמור שינויים
            </Button>
            <Button onClick={onClose} variant="outline">
              ביטול
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
