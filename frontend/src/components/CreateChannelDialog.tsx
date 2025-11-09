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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('נא לבחור קובץ תמונה');
      return;
    }

    setLogoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!channelName.trim()) {
      toast.error('נא להזין שם לערוץ');
      return;
    }

    if (!description.trim()) {
      toast.error('נא להוסיף תיאור');
      return;
    }

    if (!logoFile && !logoPreview) {
      toast.error('נא להעלות לוגו לערוץ');
      return;
    }

    setLoading(true);
    try {
      // Create channel request with logo
      const { error } = await supabase
        .from('channel_requests')
        .insert({
          user_id: userId,
          channel_name: channelName.trim(),
          description: description.trim(),
          logo_url: logoPreview, // Base64 or URL
          status: 'pending',
          is_private: true,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('הבקשה נשלחה! ✨ נעדכן אותך כשהערוץ יאושר');
      
      // Reset and close
      setChannelName('');
      setDescription('');
      setLogoFile(null);
      setLogoPreview('');
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
          {/* Channel Logo Upload */}
          <div>
            <label className="text-sm font-medium block mb-2 text-right">לוגו הערוץ *</label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="w-16 h-16 rounded-lg object-cover border-2 border-primary"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {logoPreview ? 'שנה לוגו' : 'העלה לוגו'}
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG או SVG (מומלץ: 200x200px)
                </p>
              </div>
            </div>
          </div>
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
