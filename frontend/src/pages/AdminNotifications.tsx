import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, Send, Bell, Users, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'channel' | 'user'>('all');
  const [targetChannel, setTargetChannel] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [sendMethod, setSendMethod] = useState<'push' | 'whatsapp'>('push');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);

  const templates = [
    { id: 1, title: 'פוסט חדש', body: 'יש לך פוסט חדש מ-{username}' },
    { id: 2, title: 'החלטה חדשה', body: 'החלטה חדשה ב-{channel}: {title}' },
    { id: 3, title: 'ZOOZ התקבל', body: 'קיבלת {amount} ZOOZ מ-{username}!' },
    { id: 4, title: 'אמון חדש', body: '{username} נתן לך אמון!' },
  ];

  const sendNotification = async () => {
    if (!notifTitle || !notifBody) {
      toast.error('נא למלא כותרת ותוכן');
      return;
    }

    if (sendMethod === 'whatsapp' && !phoneNumber) {
      toast.error('נא להזין מספר טלפון');
      return;
    }

    setIsSending(true);

    try {
      if (sendMethod === 'whatsapp') {
        // Send WhatsApp message
        const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_BACKEND_URL || 'https://trust-network-ui.preview.emergentagent.com';
        
        console.log('📤 Sending WhatsApp to:', BACKEND_URL);
        
        const response = await fetch(`${BACKEND_URL}/api/whatsapp/send-message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone_number: phoneNumber,
            message: `*${notifTitle}*\n\n${notifBody}`
          })
        });
        
        if (!response.ok) throw new Error('WhatsApp send failed');
        
        const result = await response.json();
        console.log('WhatsApp sent:', result);
        toast.success('הודעת WhatsApp נשלחה!');
      } else {
        // Send push notification (demo)
        console.log('📤 Sending push notification:', {
          title: notifTitle,
          body: notifBody,
          target: targetType
        });
        toast.success('ההתראה נשלחה!');
      }
      
      // Clear form
      setNotifTitle('');
      setNotifBody('');
      setPhoneNumber('');
    } catch (error) {
      console.error('Send failed:', error);
      toast.error('שליחה נכשלה');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-muted rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">ניהול התראות</h1>
          <div className="w-10" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Notification */}
          <div className="bg-card border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">יצירת התראה</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">אמצעי שליחה</label>
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => setSendMethod('push')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                      sendMethod === 'push' 
                        ? 'bg-primary text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    📱 Push
                  </button>
                  <button
                    onClick={() => setSendMethod('whatsapp')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                      sendMethod === 'whatsapp' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    💬 WhatsApp
                  </button>
                </div>
              </div>

              {sendMethod === 'whatsapp' && (
                <div>
                  <label className="block text-sm font-medium mb-2">מספר טלפון</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="972501234567"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    פורמט: 972 + מספר ללא מקף
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">כותרת</label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="כותרת ההתראה..."
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">תוכן</label>
                <textarea
                  value={notifBody}
                  onChange={(e) => setNotifBody(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={4}
                  placeholder="תוכן ההתראה..."
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">שלח ל</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="all">כל המשתמשים</option>
                  <option value="channel">ערוץ ספציפי</option>
                  <option value="user">משתמש ספציפי</option>
                </select>
              </div>

              {targetType === 'channel' && (
                <div>
                  <label className="block text-sm font-medium mb-2">ערוץ</label>
                  <select
                    value={targetChannel}
                    onChange={(e) => setTargetChannel(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">בחר ערוץ</option>
                    <option value="channel-10-economy">ערוץ 10</option>
                    <option value="channel-achva">אחווה</option>
                    <option value="channel-maccabi">מכבי</option>
                  </select>
                </div>
              )}

              <button
                onClick={sendNotification}
                disabled={isSending}
                className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSending ? (
                  <>טוען...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {sendMethod === 'whatsapp' ? 'שלח WhatsApp' : 'שלח התראה'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Templates */}
          <div className="bg-card border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">תבניות</h2>
            
            <div className="space-y-3">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => {
                    setNotifTitle(template.title);
                    setNotifBody(template.body);
                  }}
                  className="w-full p-4 bg-muted hover:bg-muted/80 rounded-lg text-right transition-colors"
                >
                  <p className="font-medium mb-1">{template.title}</p>
                  <p className="text-sm text-muted-foreground">{template.body}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">משתנים זמינים:</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>{"  username - שם משתמש"}</p>
                <p>{"  channel - שם ערוץ"}</p>
                <p>{"  title - כותרת"}</p>
                <p>{"  amount - כמות"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navigation zoozBalance={999} />
    </div>
  );
}
