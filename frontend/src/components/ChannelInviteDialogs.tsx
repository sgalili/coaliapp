/**
 * Channel Member Invitation Dialogs
 * WhatsApp invite + Excel upload with custom verification
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, Upload, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// WhatsApp Invite Dialog
export const WhatsAppInviteDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
}> = ({ isOpen, onClose, channelId }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!phone) {
      toast.error('נא להזין מספר טלפון');
      return;
    }

    setLoading(true);
    try {
      // Save invitation
      await supabase.from('channel_invitations').insert({
        channel_id: channelId,
        phone_number: phone,
        invitee_name: name,
        status: 'pending'
      });

      // Send WhatsApp
      const backendUrl = 'https://trustflow-4.preview.emergentagent.com';
      await fetch(`${backendUrl}/api/whatsapp/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phone,
          message: `🎉 הוזמנת להצטרף לערוץ!

${name ? `שלום ${name},\n` : ''}הוזמנת להצטרף לערוץ פרטי ב-Coali.

לחץ על הקישור להרשמה:
${window.location.origin}/auth?channel=${channelId}

בהצלחה!
צוות Coali`
        })
      });

      toast.success('הזמנה נשלחה! 📱');
      setPhone('');
      setName('');
      onClose();
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error('שגיאה בשליחת הזמנה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>הזמן חבר ל-WhatsApp</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>מספר טלפון *</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+972501234567"
              type="tel"
              dir="ltr"
            />
          </div>
          
          <div>
            <Label>שם (אופציונלי)</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="שם החבר"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleInvite} disabled={loading} className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              שלח הזמנה
            </Button>
            <Button onClick={onClose} variant="outline">ביטול</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Excel Upload Dialog
export const ExcelUploadDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
}> = ({ isOpen, onClose, channelId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [verificationFields, setVerificationFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error('נא לבחור קובץ Excel');
      return;
    }

    setLoading(true);
    try {
      // Parse Excel file
      const reader = new FileReader();
      reader.onload = async (e) => {
        // TODO: Parse Excel with library like xlsx
        // For now, simulate
        toast.success('קובץ הועלה! מעבד...');
        
        // Save member list
        // Each row: phone, name, student_id, etc.
        
        onClose();
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error uploading:', error);
      toast.error('שגיאה בהעלאה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>העלאת רשימת חברים</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">פורמט Excel:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• עמודה A: מספר טלפון (+972...)</li>
              <li>• עמודה B: שם מלא</li>
              <li>• עמודה C: מספר תעודת זהות (אופציונלי)</li>
              <li>• עמודה D: מספר סטודנט (אופציונלי)</li>
            </ul>
          </div>

          <div>
            <Label>העלה קובץ Excel</Label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full mt-2"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleUpload} disabled={loading || !file} className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              העלה ושלח הזמנות
            </Button>
            <Button onClick={onClose} variant="outline">ביטול</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Go Public Request Dialog
export const GoPublicDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  onSubmit: () => void;
}> = ({ isOpen, onClose, channelId, onSubmit }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>בקש להפוך לערוץ ציבורי</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              ⚠️ הבקשה תישלח לבדיקת מנהל. ערוצים ציבוריים נבדקים לתוכן מתאים ועמידה בתנאים.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">יתרונות ערוץ ציבורי:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ חשיפה לכל המשתמשים</li>
              <li>✓ הצטרפות חופשית</li>
              <li>✓ גידול מהיר במספר החברים</li>
              <li>✓ הופעה בחיפוש ובהמלצות</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={onSubmit} className="flex-1">שלח בקשה</Button>
            <Button onClick={onClose} variant="outline">ביטול</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
