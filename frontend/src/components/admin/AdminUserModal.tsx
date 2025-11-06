/**
 * Admin User Management Modal
 * Complete user editing, ZOOZ management, notes, and login-as-user
 */

import React, { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Coins, Edit2, Plus, Save, AlertTriangle, LogIn, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface AdminUserModalProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isNewUser?: boolean;
}

export const AdminUserModal: React.FC<AdminUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  isNewUser = false
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    date_of_birth: '',
    id_number: '',
    bio: '',
    avatar_url: '',
    zooz_balance: 0,
    is_verified: false,
    is_demo: false,
    expertise_fields: [] as string[]
  });
  
  const [notes, setNotes] = useState('');
  const [alerts, setAlerts] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [addZoozAmount, setAddZoozAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const ALL_EXPERTISE_FIELDS = [
    'פוליטיקה', 'כלכלה', 'בריאות', 'טכנולוגיה', 'חינוך', 'סביבה',
    'ביטחון', 'חברה', 'משפט', 'תקשורת', 'אמנות ותרבות', 'ספורט',
    'מדע ומחקר', 'עסקים ויזמות', 'נדל"ן', 'תחבורה', 'חקלאות',
    'תיירות', 'קולינריה ומזון', 'כללי'
  ];

  useEffect(() => {
    if (user && !isNewUser) {
      loadUserData();
    }
  }, [user, isNewUser]);

  const loadUserData = async () => {
    if (!user?.user_id) return;
    
    try {
      // Load complete user profile from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.user_id)
        .maybeSingle();
      
      if (profile) {
        setFormData({
          first_name: profile.first_name || user.first_name || '',
          last_name: profile.last_name || user.last_name || '',
          phone: profile.phone || user.phone || '',
          city: profile.city || '',
          date_of_birth: profile.date_of_birth || '',
          id_number: profile.id_number || '',
          bio: profile.bio || '',
          avatar_url: profile.avatar_url || user.profile_image || '',
          zooz_balance: profile.zooz_balance || user.total_zooz || 0,
          is_verified: profile.is_verified || user.is_verified || false,
          is_demo: profile.is_demo || user.is_demo || false,
          expertise_fields: profile.expertise_fields || []
        });
      } else {
        // Use user data from props if no profile found
        setFormData({
          first_name: user.first_name || user.username || '',
          last_name: user.last_name || '',
          phone: user.phone || '',
          city: user.city || '',
          date_of_birth: user.date_of_birth || '',
          id_number: user.id_number || '',
          bio: user.bio || '',
          avatar_url: user.profile_image || user.avatar_url || '',
          zooz_balance: user.total_zooz || 0,
          is_verified: user.is_verified || false,
          is_demo: user.is_demo || false,
          expertise_fields: user.expertise || []
        });
      }
      
      loadUserNotes();
      loadTransactionHistory();
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadUserNotes = async () => {
    if (!user?.user_id) return;
    
    try {
      const { data } = await supabase
        .from('admin_user_notes')
        .select('notes, alerts')
        .eq('user_id', user.user_id)
        .maybeSingle();
      
      if (data) {
        setNotes(data.notes || '');
        setAlerts(data.alerts || '');
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const loadTransactionHistory = async () => {
    if (!user?.user_id) return;
    
    try {
      const { data } = await supabase
        .from('zooz_transactions')
        .select('*')
        .or(`from_user_id.eq.${user.user_id},to_user_id.eq.${user.user_id}`)
        .order('created_at', { ascending: false })
        .limit(20);
      
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isNewUser) {
        // Create new user
        const { error } = await supabase
          .from('profiles')
          .insert({
            ...formData,
            user_id: `user_${Date.now()}`,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
        toast.success('משתמש נוצר בהצלחה');
      } else {
        // Update existing user
        const { error } = await supabase
          .from('profiles')
          .update(formData)
          .eq('user_id', user.user_id);
        
        if (error) throw error;
        toast.success('משתמש עודכן בהצלחה');
      }

      // Save notes if provided
      if (notes || alerts) {
        await supabase.from('admin_user_notes').upsert({
          user_id: user.user_id,
          notes,
          alerts,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('שגיאה בשמירת המשתמש');
    } finally {
      setLoading(false);
    }
  };

  const handleAddZooz = async () => {
    const amount = parseInt(addZoozAmount);
    if (!amount || amount <= 0) {
      toast.error('נא להזין סכום תקין');
      return;
    }

    setLoading(true);
    try {
      // Add ZOOZ transaction
      await supabase.from('zooz_transactions').insert({
        from_user_id: 'admin',
        to_user_id: user.user_id,
        amount,
        type: 'admin_grant',
        reason: 'Admin added ZOOZ',
        created_at: new Date().toISOString()
      });

      // Update balance
      const newBalance = formData.zooz_balance + amount;
      await supabase
        .from('profiles')
        .update({ zooz_balance: newBalance })
        .eq('user_id', user.user_id);

      setFormData(prev => ({ ...prev, zooz_balance: newBalance }));
      setAddZoozAmount('');
      toast.success(`נוספו ${amount}z למשתמש`);
      loadTransactionHistory();
    } catch (error) {
      console.error('Error adding ZOOZ:', error);
      toast.error('שגיאה בהוספת ZOOZ');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAsUser = async () => {
    if (!confirm('האם אתה בטוח שברצונך להתחבר כמשתמש זה? פעולה זו תעביר אותך לחשבון שלו.')) {
      return;
    }

    try {
      // Store admin session
      localStorage.setItem('admin_impersonating', user.user_id);
      localStorage.setItem('admin_return_url', window.location.href);
      
      // Set user session
      // Note: In production, this would call a secure backend API
      toast.success(`מתחבר כ-${formData.first_name} ${formData.last_name}...`);
      
      // Navigate to user's profile
      setTimeout(() => {
        window.location.href = `/profile?impersonate=${user.user_id}`;
      }, 1000);
    } catch (error) {
      console.error('Error logging in as user:', error);
      toast.error('שגיאה בהתחברות כמשתמש');
    }
  };

  const handleWhatsApp = () => {
    const phone = formData.phone.replace(/\+/g, '');
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${formData.phone}`, '_self');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {isNewUser ? 'הוסף משתמש חדש' : `עריכת משתמש: ${formData.first_name} ${formData.last_name}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          {!isNewUser && (
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleWhatsApp}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
                WhatsApp
              </Button>
              <Button
                onClick={handleCall}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                התקשר
              </Button>
              <Button
                onClick={handleLoginAsUser}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-200"
              >
                <LogIn className="w-4 h-4 text-red-600" />
                התחבר כמשתמש
              </Button>
            </div>
          )}

          {/* Personal Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">שם פרטי *</label>
              <Input
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="שם פרטי"
              />
            </div>
            <div>
              <label className="text-sm font-medium">שם משפחה *</label>
              <Input
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="שם משפחה"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">טלפון *</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+972501234567"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-sm font-medium">עיר מגורים</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="תל אביב"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">תאריך לידה</label>
              <Input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">מספר תעודת זהות</label>
              <Input
                value={formData.id_number}
                onChange={(e) => setFormData(prev => ({ ...prev, id_number: e.target.value.replace(/\D/g, '').slice(0, 9) }))}
                placeholder="123456789"
                maxLength={9}
              />
            </div>
          </div>

          {/* Profile Picture URL */}
          <div>
            <label className="text-sm font-medium">כתובת תמונת פרופיל</label>
            <Input
              value={formData.avatar_url}
              onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
              placeholder="https://..."
              dir="ltr"
            />
            {formData.avatar_url && (
              <div className="mt-2">
                <img src={formData.avatar_url} className="w-16 h-16 rounded-full object-cover" alt="Preview" />
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-medium">ביוגרפיה</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="תיאור קצר על המשתמש..."
              className="min-h-[80px]"
            />
          </div>

          {/* Expertise Fields */}
          <div>
            <label className="text-sm font-medium mb-2 block">תחומי מומחיות</label>
            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg">
              {ALL_EXPERTISE_FIELDS.map(field => {
                const isSelected = formData.expertise_fields.includes(field);
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        expertise_fields: isSelected
                          ? prev.expertise_fields.filter(f => f !== field)
                          : [...prev.expertise_fields, field]
                      }));
                    }}
                    className={cn(
                      "p-2 rounded text-xs transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {field}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formData.expertise_fields.length} תחומים נבחרו
            </p>
          </div>

          {/* User Type */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_verified}
                onChange={(e) => setFormData(prev => ({ ...prev, is_verified: e.target.checked }))}
                className="w-4 h-4"
              />
              <span>מאומת</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_demo}
                onChange={(e) => setFormData(prev => ({ ...prev, is_demo: e.target.checked }))}
                className="w-4 h-4"
              />
              <span>משתמש דמו</span>
            </label>
          </div>

          {/* ZOOZ Balance Management */}
          <div className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                ארנק ZOOZ
              </h3>
              <span className="text-2xl font-bold text-primary">{formData.zooz_balance}z</span>
            </div>

            <div className="flex gap-2 mb-3">
              <Input
                type="number"
                value={addZoozAmount}
                onChange={(e) => setAddZoozAmount(e.target.value)}
                placeholder="כמות להוספה"
                className="flex-1"
              />
              <Button onClick={handleAddZooz} disabled={loading}>
                <Plus className="w-4 h-4 mr-1" />
                הוסף
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTransactions(!showTransactions)}
              className="w-full"
            >
              {showTransactions ? 'הסתר' : 'הצג'} היסטוריית עסקאות ({transactions.length})
            </Button>

            {showTransactions && (
              <div className="mt-3 max-h-[200px] overflow-y-auto space-y-2">
                {transactions.length > 0 ? (
                  transactions.map((tx, i) => (
                    <div key={i} className="bg-background p-2 rounded text-sm">
                      <div className="flex justify-between">
                        <span className={cn(
                          "font-medium",
                          tx.to_user_id === user?.user_id ? "text-green-600" : "text-red-600"
                        )}>
                          {tx.to_user_id === user?.user_id ? '+' : '-'}{tx.amount}z
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString('he-IL')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{tx.reason || tx.type}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">אין עסקאות</p>
                )}
              </div>
            )}
          </div>

          {/* Admin Notes */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Edit2 className="w-4 h-4" />
              הערות מנהל
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="הערות פנימיות למשתמש..."
              className="min-h-[80px]"
            />
          </div>

          {/* Alerts */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              התראות/אזהרות
            </label>
            <Textarea
              value={alerts}
              onChange={(e) => setAlerts(e.target.value)}
              placeholder="התראות חשובות או אזהרות..."
              className="min-h-[60px] border-red-200 focus:border-red-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {isNewUser ? 'צור משתמש' : 'שמור שינויים'}
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
