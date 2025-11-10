/**
 * Excel Member Upload Component
 * Upload member list with custom verification fields
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ExcelUploadProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
}

export const ExcelMemberUpload: React.FC<ExcelUploadProps> = ({
  isOpen,
  onClose,
  channelId
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [memberList, setMemberList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    // Validate file type
    const validTypes = ['.xlsx', '.xls', '.csv'];
    const fileExt = uploadedFile.name.substring(uploadedFile.name.lastIndexOf('.'));
    
    if (!validTypes.includes(fileExt.toLowerCase())) {
      toast.error('נא להעלות קובץ Excel או CSV');
      return;
    }

    setFile(uploadedFile);
    parseExcelFile(uploadedFile);
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        
        // Parse CSV (simple parsing)
        const members = lines.slice(1).map(line => {
          const [phone, name, id_number, student_number] = line.split(',').map(s => s.trim());
          
          if (!phone) return null;
          
          return {
            phone: phone.replace(/[^\d+]/g, ''),
            name: name || '',
            verification_fields: {
              id_number: id_number || '',
              student_number: student_number || ''
            }
          };
        }).filter(Boolean);
        
        console.log('📋 Parsed members:', members.length);
        setMemberList(members);
        toast.success(`נמצאו ${members.length} חברים ברשימה`);
      } catch (error) {
        console.error('Parse error:', error);
        toast.error('שגיאה בקריאת הקובץ');
      }
    };
    
    reader.readAsText(file);
  };

  const handleSendInvitations = async () => {
    if (memberList.length === 0) {
      toast.error('אין חברים ברשימה');
      return;
    }

    setSending(true);
    try {
      const backendUrl = 'https://trustflow-4.preview.emergentagent.com';
      let successCount = 0;
      let errorCount = 0;

      // Save member list to database
      for (const member of memberList) {
        try {
          // Save invitation
          const { error: inviteError } = await supabase
            .from('channel_invitations')
            .insert({
              channel_id: channelId,
              phone_number: member.phone,
              invitee_name: member.name,
              verification_fields: member.verification_fields,
              status: 'pending',
              expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            });

          if (inviteError) {
            console.error('Error saving invitation:', inviteError);
            errorCount++;
            continue;
          }

          // Send WhatsApp
          const verificationText = Object.entries(member.verification_fields)
            .filter(([_, value]) => value)
            .map(([key, value]) => {
              const fieldNames: any = {
                id_number: 'מספר תעודת זהות',
                student_number: 'מספר סטודנט'
              };
              return `${fieldNames[key] || key}: ${value}`;
            })
            .join('\n');

          await fetch(`${backendUrl}/api/whatsapp/send-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone_number: member.phone,
              message: `🎓 הוזמנת להצטרף לערוץ פרטי!

${member.name ? `שלום ${member.name},\n` : ''}הוזמנת להצטרף לערוץ פרטי ב-Coali.

📋 פרטי אימות שלך:
${verificationText}

לחץ להרשמה ואימות:
${window.location.origin}/auth?channel=${channelId}

ההזמנה תקפה למשך 7 יום.

בהצלחה! 🚀
צוות Coali`
            })
          });

          successCount++;
          console.log(`✅ Sent to ${member.phone}`);
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error sending to ${member.phone}:`, error);
          errorCount++;
        }
      }

      toast.success(`נשלחו ${successCount} הזמנות! ${errorCount > 0 ? `(${errorCount} נכשלו)` : ''}`);
      
      if (errorCount === 0) {
        onClose();
        setFile(null);
        setMemberList([]);
      }
    } catch (error) {
      console.error('Error sending invitations:', error);
      toast.error('שגיאה בשליחת הזמנות');
    } finally {
      setSending(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `טלפון,שם מלא,מספר תעודת זהות,מספר סטודנט
+972501234567,ישראל ישראלי,123456789,2024001
+972521234567,שרה לוי,987654321,2024002`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'channel_members_template.csv';
    link.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>העלאת רשימת חברים</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-3">📋 פורמט הקובץ:</p>
            <div className="space-y-2 text-xs text-blue-700">
              <div className="flex items-start gap-2">
                <span>1️⃣</span>
                <div>
                  <p className="font-medium">עמודה A: מספר טלפון (חובה)</p>
                  <p className="text-blue-600">פורמט: +972501234567</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span>2️⃣</span>
                <div>
                  <p className="font-medium">עמודה B: שם מלא (אופציונלי)</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span>3️⃣</span>
                <div>
                  <p className="font-medium">עמודה C: מספר תעודת זהות (אופציונלי)</p>
                  <p className="text-blue-600">לאימות נוסף</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span>4️⃣</span>
                <div>
                  <p className="font-medium">עמודה D: מספר סטודנט (אופציונלי)</p>
                  <p className="text-blue-600">או שדה אימות אחר</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={downloadTemplate}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              <Download className="w-4 h-4 mr-2" />
              הורד קובץ לדוגמה
            </Button>
          </div>

          {/* File Upload */}
          <div>
            <Label>בחר קובץ Excel/CSV</Label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="w-full mt-2 p-2 border rounded"
            />
            {file && (
              <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {file.name} ({memberList.length} חברים)
              </p>
            )}
          </div>

          {/* Member Preview */}
          {memberList.length > 0 && (
            <div>
              <Label>תצוגה מקדימה ({memberList.length} חברים)</Label>
              <div className="mt-2 max-h-[200px] overflow-y-auto space-y-2">
                {memberList.slice(0, 5).map((member, i) => (
                  <div key={i} className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium">{member.name || 'ללא שם'}</p>
                    <p className="text-xs text-muted-foreground">{member.phone}</p>
                    {Object.keys(member.verification_fields).length > 0 && (
                      <p className="text-xs text-primary">
                        + שדות אימות: {Object.values(member.verification_fields).filter(Boolean).length}
                      </p>
                    )}
                  </div>
                ))}
                {memberList.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    ועוד {memberList.length - 5} חברים...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSendInvitations}
              disabled={memberList.length === 0 || sending}
              className="flex-1"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  שולח...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  שלח הזמנות ל-{memberList.length} חברים
                </>
              )}
            </Button>
            <Button onClick={onClose} variant="outline">
              ביטול
            </Button>
          </div>

          {/* Warning */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-4 h-4 inline ml-1 text-yellow-600" />
            <span className="text-sm text-yellow-900">
              הזמנה תישלח ב-WhatsApp לכל מספר ברשימה
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
