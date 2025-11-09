/**
 * Channel Management Dashboard
 * Complete management interface for channel owners
 */

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { 
  ArrowRight, 
  Users, 
  FileText, 
  Settings, 
  Upload, 
  MessageCircle,
  Crown,
  UserPlus,
  Globe,
  Lock
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ExcelMemberUpload } from '@/components/ExcelMemberUpload';
import { WhatsAppInviteDialog, GoPublicDialog } from '@/components/ChannelInviteDialogs';

export default function ChannelManagement() {
  const navigate = useNavigate();
  const { channelId } = useParams();
  
  const [channel, setChannel] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    members: 0,
    posts: 0,
    engagement: 0
  });
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [showGoPublicDialog, setShowGoPublicDialog] = useState(false);

  useEffect(() => {
    loadChannelData();
  }, [channelId]);

  const loadChannelData = async () => {
    try {
      console.log('📺 Loading channel data for ID:', channelId);
      
      // Load from channel_requests (approved channels)
      const { data: channelData, error: channelError } = await supabase
        .from('channel_requests')
        .select('*')
        .eq('id', channelId)
        .single();
      
      console.log('📊 Channel data:', channelData);
      console.log('Error:', channelError);
      
      if (channelData) {
        setChannel({
          id: channelData.id,
          name: channelData.channel_name,
          description: channelData.description,
          logo_url: channelData.logo_url,
          is_private: channelData.is_private,
          is_public: false, // New channels start as private
          created_by: channelData.user_id,
          status: channelData.status
        });
      }

      // Load members (will be empty initially)
      const { data: memberData } = await supabase
        .from('channel_members')
        .select('*')
        .eq('channel_id', channelId);
      
      setMembers(memberData || []);

      // Load posts
      const { data: postData } = await supabase
        .from('demo_posts')
        .select('*')
        .eq('channel_id', channelId);
      
      setPosts(postData || []);

      setStats({
        members: memberData?.length || 0,
        posts: postData?.length || 0,
        engagement: 0
      });
    } catch (error) {
      console.error('Error loading channel:', error);
    }
  };

  const handleRequestGoPublic = async () => {
    try {
      const { error } = await supabase
        .from('channel_public_requests')
        .insert({
          channel_id: channelId,
          requested_by: channel.created_by,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('הבקשה נשלחה למנהל! ✨');
      setShowGoPublicDialog(false);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('שגיאה בשליחת הבקשה');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="flex items-center gap-4 p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{channel?.name || 'טוען...'}</h1>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {channel?.is_private || channel?.is_public === false ? '🔒 ערוץ פרטי' : '🌐 ערוץ ציבורי'}
              </p>
              {channel?.is_private && (
                <button
                  onClick={() => setShowGoPublicDialog(true)}
                  className="text-xs text-primary hover:underline"
                >
                  ← בקש להפוך לציבורי
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{stats.members}</span>
            </div>
            <p className="text-sm text-muted-foreground">חברים</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{stats.posts}</span>
            </div>
            <p className="text-sm text-muted-foreground">פוסטים</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{stats.engagement}</span>
            </div>
            <p className="text-sm text-muted-foreground">מעורבות</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-4">
          <h3 className="font-bold mb-4">פעולות מהירות</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setShowInviteDialog(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              הזמן חבר
            </Button>
            
            <Button
              onClick={() => setShowExcelUpload(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              העלה רשימה
            </Button>
            
            {channel?.is_private && (
              <Button
                onClick={() => setShowGoPublicDialog(true)}
                variant="outline"
                className="flex items-center gap-2 col-span-2"
              >
                <Globe className="w-4 h-4" />
                בקש להפוך לציבורי
              </Button>
            )}
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="members" dir="rtl">
          <TabsList className="w-full">
            <TabsTrigger value="members" className="flex-1">חברים</TabsTrigger>
            <TabsTrigger value="posts" className="flex-1">פוסטים</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">הגדרות</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <Card className="p-4">
              <h3 className="font-bold mb-4">רשימת חברים ({members.length})</h3>
              <div className="space-y-2">
                {members.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{member.user_name || 'משתמש'}</p>
                      <p className="text-xs text-muted-foreground">{member.role || 'חבר'}</p>
                    </div>
                    <Button size="sm" variant="ghost">ניהול</Button>
                  </div>
                ))}
                {members.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">אין חברים עדיין</p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <Card className="p-4">
              <h3 className="font-bold mb-4">פוסטים בערוץ ({posts.length})</h3>
              <div className="grid grid-cols-3 gap-2">
                {posts.map(post => (
                  <div key={post.id} className="aspect-square bg-muted rounded-lg overflow-hidden">
                    {post.video_url && (
                      <video src={post.video_url} className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
                {posts.length === 0 && (
                  <p className="col-span-3 text-center py-8 text-muted-foreground">אין פוסטים עדיין</p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-4">
              <h3 className="font-bold mb-4">הגדרות ערוץ</h3>
              <div className="space-y-6">
                {/* Channel Logo */}
                <div>
                  <label className="text-sm font-medium block mb-2">לוגו הערוץ</label>
                  <div className="flex items-center gap-4">
                    {channel?.logo_url && (
                      <img 
                        src={channel.logo_url} 
                        alt="Channel logo" 
                        className="w-20 h-20 rounded-lg object-cover border-2 border-primary"
                      />
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              try {
                                await supabase
                                  .from('channel_requests')
                                  .update({ logo_url: reader.result as string })
                                  .eq('id', channelId);
                                
                                toast.success('הלוגו עודכן! ✨');
                                loadChannelData();
                              } catch (error) {
                                toast.error('שגיאה בעדכון לוגו');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="channel-logo-upload"
                      />
                      <label
                        htmlFor="channel-logo-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        {channel?.logo_url ? 'שנה לוגו' : 'העלה לוגו'}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG (מומלץ: 200x200px)
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Channel Name */}
                <div>
                  <label className="text-sm font-medium">שם הערוץ</label>
                  <input 
                    type="text" 
                    defaultValue={channel?.name}
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">תיאור</label>
                  <textarea 
                    defaultValue={channel?.description}
                    className="w-full px-3 py-2 border rounded-lg mt-1 min-h-[100px]"
                  />
                </div>
                <Button>שמור שינויים</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Navigation zoozBalance={999} />
      
      {/* Dialogs */}
      <WhatsAppInviteDialog
        isOpen={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        channelId={channelId || ''}
      />
      
      <ExcelMemberUpload
        isOpen={showExcelUpload}
        onClose={() => setShowExcelUpload(false)}
        channelId={channelId || ''}
      />
      
      <GoPublicDialog
        isOpen={showGoPublicDialog}
        onClose={() => setShowGoPublicDialog(false)}
        channelId={channelId || ''}
        onSubmit={handleRequestGoPublic}
      />
    </div>
  );
}
