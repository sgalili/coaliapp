/**
 * Admin All Channels Management
 * View, edit, delete, manage all channels
 */

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Users, 
  Globe, 
  Lock,
  Settings,
  RefreshCw,
  Upload
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminAllChannels() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const area = searchParams.get('area') || 'production';
  
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChannel, setEditingChannel] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    loadChannels();
  }, [area]);

  const loadChannels = async () => {
    setLoading(true);
    try {
      console.log('📺 Loading all channels for area:', area);
      
      // Load from channel_requests (all channels)
      const { data, error } = await supabase
        .from('channel_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('✅ Loaded channels:', data?.length || 0);
      setChannels(data || []);
    } catch (error) {
      console.error('Error loading channels:', error);
      toast.error('שגיאה בטעינת ערוצים');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (channel: any) => {
    setEditingChannel(channel);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from('channel_requests')
        .update({
          channel_name: editingChannel.channel_name,
          description: editingChannel.description,
          logo_url: editingChannel.logo_url,
          is_private: editingChannel.is_private
        })
        .eq('id', editingChannel.id);

      if (error) throw error;

      toast.success('ערוץ עודכן! ✅');
      setShowEditDialog(false);
      loadChannels();
    } catch (error) {
      console.error('Error updating channel:', error);
      toast.error('שגיאה בעדכון');
    }
  };

  const handleDelete = async (channelId: string, channelName: string) => {
    if (!confirm(`האם למחוק את ערוץ "${channelName}"?\n\nפעולה זו תמחק את כל החברים והתוכן!`)) {
      return;
    }

    try {
      // Delete channel members
      await supabase
        .from('channel_members')
        .delete()
        .eq('channel_id', channelId);

      // Delete channel invitations
      await supabase
        .from('channel_invitations')
        .delete()
        .eq('channel_id', channelId);

      // Delete the channel
      await supabase
        .from('channel_requests')
        .delete()
        .eq('id', channelId);

      toast.success('ערוץ נמחק! 🗑️');
      loadChannels();
    } catch (error) {
      console.error('Error deleting channel:', error);
      toast.error('שגיאה במחיקה');
    }
  };

  const togglePrivacy = async (channelId: string, currentPrivate: boolean) => {
    try {
      await supabase
        .from('channel_requests')
        .update({ is_private: !currentPrivate })
        .eq('id', channelId);

      toast.success(currentPrivate ? 'הערוץ הפך לציבורי! 🌐' : 'הערוץ הפך לפרטי! 🔒');
      loadChannels();
    } catch (error) {
      console.error('Error toggling privacy:', error);
      toast.error('שגיאה בעדכון');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">ניהול כל הערוצים</h1>
              <p className="text-sm text-muted-foreground">
                {area === 'production' ? 'ייצור' : 'דמו'}
              </p>
            </div>
          </div>
          <Button onClick={loadChannels} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            רענן
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {channels.map(channel => (
          <div key={channel.id} className="bg-card border rounded-lg p-5">
            <div className="flex items-start gap-4">
              {/* Logo */}
              {channel.logo_url && (
                <img 
                  src={channel.logo_url} 
                  alt={channel.channel_name}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-primary"
                />
              )}

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{channel.channel_name}</h3>
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {channel.is_private ? (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        פרטי
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        ציבורי
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      channel.status === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : channel.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {channel.status === 'approved' ? 'אושר' : channel.status === 'pending' ? 'ממתין' : 'נדחה'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mb-3">
                  User ID: {channel.user_id?.slice(0, 8)}... • {new Date(channel.created_at).toLocaleDateString('he-IL')}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(channel)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    ערוך
                  </Button>
                  
                  <Button
                    onClick={() => togglePrivacy(channel.id, channel.is_private)}
                    size="sm"
                    variant="outline"
                  >
                    {channel.is_private ? (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        הפוך לציבורי
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        הפוך לפרטי
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => navigate(`/channel/${channel.id}/manage`)}
                    size="sm"
                    variant="outline"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    נהל
                  </Button>

                  <Button
                    onClick={() => handleDelete(channel.id, channel.channel_name)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    מחק
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {channels.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">אין ערוצים</p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>ערוך ערוץ</DialogTitle>
          </DialogHeader>
          
          {editingChannel && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">שם הערוץ</label>
                <Input
                  value={editingChannel.channel_name}
                  onChange={(e) => setEditingChannel({ ...editingChannel, channel_name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">תיאור</label>
                <Textarea
                  value={editingChannel.description}
                  onChange={(e) => setEditingChannel({ ...editingChannel, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">לוגו הערוץ</label>
                <div className="flex items-center gap-4 mt-2">
                  {editingChannel.logo_url && (
                    <img src={editingChannel.logo_url} className="w-16 h-16 rounded-lg object-cover border-2" alt="Logo" />
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditingChannel({ ...editingChannel, logo_url: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="admin-logo-upload"
                    />
                    <label
                      htmlFor="admin-logo-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                      <Upload className="w-4 h-4" />
                      {editingChannel.logo_url ? 'שנה לוגו' : 'העלה לוגו'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} className="flex-1">שמור</Button>
                <Button onClick={() => setShowEditDialog(false)} variant="outline">ביטול</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Navigation zoozBalance={999} />
    </div>
  );
}
