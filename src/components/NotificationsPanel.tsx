import { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  type: 'trust' | 'comment' | 'reply' | 'mention' | 'zooz' | 'watch';
  fromUser: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  content?: string;
  preview?: string;
  amount?: number;
  timestamp: string;
  read: boolean;
}

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

// Demo notifications
const demoNotifications: Notification[] = [
  {
    id: '1',
    type: 'trust',
    fromUser: { name: 'נועה רותם', avatar: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg', verified: true },
    timestamp: 'לפני 2 שעות',
    read: false,
  },
  {
    id: '2',
    type: 'comment',
    fromUser: { name: 'דוד לוי', avatar: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg', verified: true },
    preview: 'ניתוח מעניין מאוד! תודה',
    timestamp: 'לפני 5 שעות',
    read: false,
  },
  {
    id: '3',
    type: 'zooz',
    fromUser: { name: 'רחל כהן', avatar: 'https://trust.coali.app/assets/rachel-profile-w3gZXC9S.jpg', verified: true },
    amount: 500,
    preview: 'תודה על הפוסט!',
    timestamp: 'לפני 30 דקות',
    read: false,
  },
  {
    id: '4',
    type: 'watch',
    fromUser: { name: 'אמית ברק', avatar: 'https://trust.coali.app/assets/amit-profile-CprpaaC6.jpg', verified: false },
    timestamp: 'אתמול',
    read: true,
  },
  {
    id: '5',
    type: 'reply',
    fromUser: { name: 'מיכל שמיר', avatar: 'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg', verified: true },
    preview: '@ירון אני מסכימה איתך',
    timestamp: 'לפני יום',
    read: true,
  },
];

export const NotificationsPanel = ({ isOpen, onClose }: NotificationsProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(demoNotifications);

  const getNotificationText = (notif: Notification) => {
    switch (notif.type) {
      case 'trust':
        return 'נתן לך אמון';
      case 'comment':
        return 'הגיב על הפוסט שלך:';
      case 'reply':
        return 'השיב לתגובה שלך:';
      case 'mention':
        return 'ציין אותך בפוסט';
      case 'zooz':
        return `שלח לך ${notif.amount} Zooz`;
      case 'watch':
        return 'התחיל לעקוב אחריך';
      default:
        return '';
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-end">
      <div className="bg-background w-full rounded-t-2xl max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary hover:underline"
          >
            סמן הכל כנקרא
          </button>
          <h3 className="text-lg font-semibold">התראות</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            <div>
              {notifications.map(notif => (
                <button
                  key={notif.id}
                  onClick={() => {
                    markAsRead(notif.id);
                    // Navigate based on type
                    if (notif.type === 'trust' || notif.type === 'watch') {
                      navigate(`/user/${notif.id}`);
                    }
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 p-4 border-b border-border transition-colors text-right",
                    notif.read ? "bg-muted/30" : "bg-background hover:bg-muted/20"
                  )}
                >
                  <img
                    src={notif.fromUser.avatar}
                    alt={notif.fromUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <span className={cn("text-sm", !notif.read && "font-semibold")}>
                        {notif.fromUser.name}
                      </span>
                      {notif.fromUser.verified && <CheckCircle className="w-4 h-4 text-trust" />}
                    </div>
                    <p className={cn("text-sm mb-1", notif.read ? "text-muted-foreground" : "text-foreground font-medium")}>
                      {getNotificationText(notif)}
                    </p>
                    {notif.preview && (
                      <p className="text-xs text-muted-foreground mb-1 truncate">
                        "{notif.preview}"
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">{notif.timestamp}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-lg text-foreground mb-2">אין התראות חדשות</p>
              <p className="text-sm text-muted-foreground">נעדכן אותך כשיהיה משהו חדש</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const useUnreadNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = demoNotifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, []);

  return unreadCount;
};
