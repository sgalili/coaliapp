/**
 * Progressive Profile Completion Modals
 * Triggered when user tries specific actions
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CityAutocomplete } from '@/components/CityAutocomplete';
import { AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CATEGORIES = [
  { id: 'politics', label: 'פוליטיקה', icon: '🏛️' },
  { id: 'economy', label: 'כלכלה', icon: '💰' },
  { id: 'healthcare', label: 'בריאות', icon: '🏥' },
  { id: 'technology', label: 'טכנולוגיה', icon: '💻' },
  { id: 'education', label: 'חינוך', icon: '📚' },
  { id: 'sports', label: 'ספורט', icon: '⚽' },
  { id: 'society', label: 'חברה', icon: '👥' },
  { id: 'environment', label: 'סביבה', icon: '🌍' },
];

// Modal 1: Categories + City (for publishing content)
export const PublishContentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userId: string;
}> = ({ isOpen, onClose, onComplete, userId }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (selectedCategories.length === 0 || !city) {
      toast.error('נא לבחור קטגוריה ועיר');
      return;
    }

    setLoading(true);
    try {
      await supabase
        .from('profiles')
        .update({
          expertise_fields: selectedCategories,
          city: city
        })
        .eq('user_id', userId);

      toast.success('פרטים נשמרו!');
      onComplete();
      onClose();
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('שגיאה בשמירה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>עוד צעד קטן</DialogTitle>
          <DialogDescription>
            כדי לפרסם תוכן, נצטרך עוד כמה פרטים
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">קטגוריות שמעניינות אותך</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategories(prev =>
                      prev.includes(cat.id)
                        ? prev.filter(c => c !== cat.id)
                        : [...prev, cat.id]
                    );
                  }}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    selectedCategories.includes(cat.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span>{cat.icon}</span>
                  <span className="text-sm">{cat.label}</span>
                  {selectedCategories.includes(cat.id) && (
                    <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">עיר מגורים</label>
            <CityAutocomplete value={city} onChange={setCity} />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            שמור והמשך לפרסום
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal 2: Expert Verification (for commenting as expert)
export const ExpertVerificationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userId: string;
}> = ({ isOpen, onClose, onComplete, userId }) => {
  const [expertiseFields, setExpertiseFields] = useState<string[]>([]);
  const [idNumber, setIdNumber] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (expertiseFields.length === 0) {
      toast.error('נא לבחור תחומי מומחיות');
      return;
    }

    if (!/^\d{9}$/.test(idNumber)) {
      toast.error('מספר תעודת זהות חייב להיות 9 ספרות');
      return;
    }

    if (!agreedToTerms) {
      toast.error('יש לאשר את תנאי השימוש');
      return;
    }

    setLoading(true);
    try {
      await supabase
        .from('profiles')
        .update({
          expertise_fields: expertiseFields,
          id_number: idNumber,
          is_verified: true
        })
        .eq('user_id', userId);

      toast.success('✅ אומת כמומחה!');
      onComplete();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('שגיאה באימות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            אימות מומחה
          </DialogTitle>
          <DialogDescription>
            <AlertCircle className="w-4 h-4 inline ml-1 text-yellow-600" />
            נדרש אימות זהות להגיבים כמומחה
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">תחומי מומחיות</label>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setExpertiseFields(prev =>
                      prev.includes(cat.id) ? prev.filter(c => c !== cat.id) : [...prev, cat.id]
                    );
                  }}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border-2 text-sm",
                    expertiseFields.includes(cat.id)
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  )}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">מספר תעודת זהות</label>
            <Input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
              placeholder="9 ספרות"
              maxLength={9}
              className="text-right"
            />
            <p className="text-xs text-muted-foreground mt-1">
              🔒 נשאר פרטי ומשמש לאימות בלבד
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">אני מסכים לתנאי השימוש למומחים</span>
          </label>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            אמת ופתח הרשאות מומחה
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal 3: Wallet Activation
export const WalletActivationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userId: string;
}> = ({ isOpen, onClose, onComplete, userId }) => {
  const [idNumber, setIdNumber] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!/^\d{9}$/.test(idNumber)) {
      toast.error('מספר תעודת זהות חייב להיות 9 ספרות');
      return;
    }

    if (!city) {
      toast.error('נא לבחור עיר');
      return;
    }

    setLoading(true);
    try {
      await supabase
        .from('profiles')
        .update({
          id_number: idNumber,
          city: city,
          wallet_activated: true
        })
        .eq('user_id', userId);

      toast.success('✅ הארנק הופעל!');
      onComplete();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('שגיאה בהפעלת הארנק');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>הפעלת ארנק Zooz</DialogTitle>
          <DialogDescription>
            <AlertCircle className="w-4 h-4 inline ml-1 text-blue-600" />
            נדרש לפי תקנות למניעת הלבנת הון
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              ⚖️ דרישה חוקית: אימות זהות נדרש לשימוש בארנק דיגיטלי
            </p>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">מספר תעודת זהות</label>
            <Input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
              placeholder="9 ספרות"
              maxLength={9}
              className="text-right"
            />
            <p className="text-xs text-muted-foreground mt-1">
              🔒 המידע מוצפן ונשאר פרטי לחלוטין
            </p>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">עיר מגורים</label>
            <CityAutocomplete value={city} onChange={setCity} />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            הפעל ארנק
          </Button>
          
          <Button variant="ghost" onClick={onClose} className="w-full">
            אשלים מאוחר יותר
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
