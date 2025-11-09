/**
 * Create Channel Request Dialog
 * Users can request to create a new channel (admin approval required)
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CreateChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const CreateChannelDialog: React.FC<CreateChannelDialogProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!channelName.trim()) {
      toast.error('נא להזין שם לערוץ');
      return;
    }

    if (!description.trim()) {
      toast.error('נא להוסיף תיאור');
      return;
    }

    setLoading(true);
    try {
      // Create channel request (pending admin approval)
      const { error } = await supabase
        .from('channel_requests')
        .insert({
          user_id: userId,
          channel_name: channelName.trim(),
          description: description.trim(),
          status: 'pending',
          is_private: true, // All new channels start as private
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('הבקשה נשלחה! ✨ נעדכן אותך כשהערוץ יאושר');
      
      // Reset and close
      setChannelName('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error creating channel request:', error);
      toast.error('שגיאה בשליחת הבקשה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right">
            <Users className="w-5 h-5 text-primary" />
            בקש ליצור ערוץ חדש
          </DialogTitle>
          <DialogDescription className="text-right">
            <AlertCircle className="w-4 h-4 inline ml-1 text-amber-600" />
            הערוץ ייווצר לאחר אישור מנהל
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 ערוצים חדשים מתחילים כ<strong>פרטיים</strong> ויאושרו תוך 24 שעות
            </p>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2 text-right">שם הערוץ *</label>
            <Input
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder='לדוגמה: "קהילת היזמים הישראלית"'
              className="text-right"
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {channelName.length}/50 תווים
            </p>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2 text-right">תיאור הערוץ *</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ספר קצת על הערוץ, מה המטרה שלו ולמי הוא מיועד..."
              className="text-right min-h-[100px]"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {description.length}/200 תווים
            </p>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !channelName.trim() || !description.trim()}
              className="w-full"
            >
              {loading ? 'שולח בקשה...' : 'שלח בקשה ליצירת ערוץ'}
            </Button>
            
            <Button 
              onClick={onClose} 
              variant="ghost" 
              className="w-full"
            >
              ביטול
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
