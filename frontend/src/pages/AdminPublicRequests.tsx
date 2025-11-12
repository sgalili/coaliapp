/**
 * Admin Go Public Requests Management
 * Approve/Reject channel public requests
 */

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, Globe, CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminPublicRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('channel_public_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Load channel names for each request
      const requestsWithChannels = [];
      for (const req of data || []) {
        const { data: channel } = await supabase
          .from('channel_requests')
          .select('channel_name, user_id')
          .eq('id', req.channel_id)
          .single();
        
        requestsWithChannels.push({
          ...req,
          channel_name: channel?.channel_name || 'Unknown',
          channel_owner: channel?.user_id
        });
      }

      setRequests(requestsWithChannels);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('שגיאה בטעינת בקשות');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: any) => {
    try {
      // Update public request
      await supabase
        .from('channel_public_requests')
        .update({
          status: 'approved',
          reviewed_by: 'admin',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', request.id);

      // Update channel to public
      await supabase
        .from('channel_requests')
        .update({
          is_private: false,
          is_public: true
        })
        .eq('id', request.channel_id);

      // Send WhatsApp notification
      try {
        const backendUrl = 'https://user-impact.preview.emergentagent.com';
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('phone, first_name')
          .eq('user_id', request.requested_by)
          .single();

        if (userProfile?.phone) {
          await fetch(`${backendUrl}/api/whatsapp/send-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone_number: userProfile.phone,
              message: `🌐 הערוץ שלך הפך לציבורי!

ערוץ "${request.channel_name}" אושר כערוץ ציבורי!

עכשיו:
✓ כל המשתמשים יכולים לראות את הערוץ
✓ הצטרפות חופשית
✓ חשיפה מקסימלית

מזל טוב! 🎉
צוות Coali`
            })
          });
        }
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
      }

      toast.success('הערוץ הפך לציבורי! 🌐');
      loadRequests();
    } catch (error) {
      console.error('Error approving:', error);
      toast.error('שגיאה באישור');
    }
  };

  const handleReject = async (request: any) => {
    if (!confirm(`האם לדחות את הבקשה להפוך "${request.channel_name}" לציבורי?`)) return;

    try {
      await supabase
        .from('channel_public_requests')
        .update({
          status: 'rejected',
          reviewed_by: 'admin',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', request.id);

      // Send notification
      try {
        const backendUrl = 'https://user-impact.preview.emergentagent.com';
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('phone')
          .eq('user_id', request.requested_by)
          .single();

        if (userProfile?.phone) {
          await fetch(`${backendUrl}/api/whatsapp/send-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone_number: userProfile.phone,
              message: `📋 עדכון לגבי הערוץ שלך

הבקשה להפוך את "${request.channel_name}" לערוץ ציבורי לא אושרה.

הערוץ נשאר פרטי. ניתן לשלוח בקשה חדשה או ליצור קשר עם התמיכה.

צוות Coali`
            })
          });
        }
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
      }

      toast.success('הבקשה נדחתה');
      loadRequests();
    } catch (error) {
      console.error('Error rejecting:', error);
      toast.error('שגיאה בדחייה');
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="flex items-center gap-4 p-4">
          <button onClick={() => navigate('/admin')} className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">בקשות להפוך לציבורי</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {pendingRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4">ממתינות לאישור ({pendingRequests.length})</h2>
            <div className="space-y-4">
              {pendingRequests.map(request => (
                <div key={request.id} className="bg-card border rounded-lg p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        {request.channel_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        בקשה להפוך לערוץ ציבורי
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ממתין
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground mb-4">
                    {new Date(request.created_at).toLocaleDateString('he-IL')}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(request)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      אשר הפיכה לציבורי
                    </Button>
                    <Button
                      onClick={() => handleReject(request)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      דחה
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {processedRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4">היסטוריה</h2>
            <div className="space-y-3">
              {processedRequests.map(request => (
                <div key={request.id} className="bg-card border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{request.channel_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      request.status === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {request.status === 'approved' ? 'אושר' : 'נדחה'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {requests.length === 0 && !loading && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">אין בקשות</p>
          </div>
        )}
      </div>

      <Navigation zoozBalance={999} />
    </div>
  );
}
