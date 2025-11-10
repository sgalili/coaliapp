/**
 * Admin Channel Requests Management
 * Approve/Reject user channel creation requests
 */

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminChannelRequests() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const area = searchParams.get('area') || 'production';
  
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [area]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('channel_requests')
        .select('*') // ✅ Simple select (profiles join might fail)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading requests:', error);
        throw error;
      }

      console.log('✅ Loaded channel requests:', data?.length || 0);
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('שגיאה בטעינת בקשות');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: any) => {
    try {
      console.log('✅ Approving channel:', request.channel_name);
      
      // Update request status
      const { error: updateError } = await supabase
        .from('channel_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: 'admin'
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      console.log('✅ Request approved in database');
      
      // Send WhatsApp notification to user
      try {
        const backendUrl = 'https://trustflow-4.preview.emergentagent.com';
        
        // Get user phone from profiles
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('phone, first_name')
          .eq('user_id', request.user_id)
          .single();
        
        if (userProfile?.phone) {
          await fetch(`${backendUrl}/api/whatsapp/send-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone_number: userProfile.phone,
              message: `🎉 הערוץ שלך אושר!

ערוץ "${request.channel_name}" אושר על ידי המנהל!

עכשיו אתה יכול:
• לפרסם תוכן בערוץ
• להזמין חברים
• לנהל את הערוץ

התחל לפרסם: ${window.location.origin}

בהצלחה! 🚀
צוות Coali`
            })
          });
          console.log('✅ WhatsApp notification sent');
        }
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
      }

      toast.success(`ערוץ "${request.channel_name}" אושר! ✅`);
      loadRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('שגיאה באישור');
    }
  };

  const handleReject = async (request: any) => {
    if (!confirm(`האם לדחות את הבקשה ליצירת "${request.channel_name}"?`)) return;

    try {
      console.log('❌ Rejecting channel:', request.channel_name);
      
      const { error } = await supabase
        .from('channel_requests')
        .update({
          status: 'rejected',
          approved_at: new Date().toISOString(),
          approved_by: 'admin'
        })
        .eq('id', request.id);

      if (error) throw error;

      console.log('✅ Request rejected in database');
      
      // Send WhatsApp notification
      try {
        const backendUrl = 'https://trustflow-4.preview.emergentagent.com';
        
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('phone, first_name')
          .eq('user_id', request.user_id)
          .single();
        
        if (userProfile?.phone) {
          await fetch(`${backendUrl}/api/whatsapp/send-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone_number: userProfile.phone,
              message: `📋 עדכון לגבי הערוץ שלך

לצערנו, הבקשה ליצירת ערוץ "${request.channel_name}" לא אושרה.

אתה יכול:
• לשלוח בקשה חדשה עם תיאור מפורט יותר
• ליצור קשר עם התמיכה לקבלת משוב

צוות Coali`
            })
          });
          console.log('✅ Rejection WhatsApp sent');
        }
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
      }

      toast.success('הבקשה נדחתה');
      loadRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('שגיאה בדחייה');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          ממתין לאישור
        </span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          אושר
        </span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          נדחה
        </span>;
      default:
        return null;
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-muted rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">בקשות ערוצים</h1>
            <p className="text-sm text-muted-foreground">
              {area === 'production' ? 'ייצור' : 'דמו'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              ממתינות לאישור ({pendingRequests.length})
            </h2>
            <div className="space-y-4">
              {pendingRequests.map(request => (
                <div key={request.id} className="bg-card border rounded-lg p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        {request.channel_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.description}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span>מבקש: User ID {request.user_id.slice(0, 8)}...</span>
                    <span>•</span>
                    <span>{new Date(request.created_at).toLocaleDateString('he-IL')}</span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(request)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      אשר ערוץ
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

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4">היסטוריה</h2>
            <div className="space-y-3">
              {processedRequests.map(request => (
                <div key={request.id} className="bg-card border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{request.channel_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        User {request.user_id.slice(0, 8)}...
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {requests.length === 0 && !loading && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">אין בקשות ערוצים</p>
          </div>
        )}
      </div>

      <Navigation zoozBalance={999} />
    </div>
  );
}
