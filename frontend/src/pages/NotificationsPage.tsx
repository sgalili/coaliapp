import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, Heart, MessageSquare, Gift, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications] = useState([
    {
      id: 1,
      type: 'trust',
      user: 'ירון זליכה',
      avatar: 'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
      message: 'נתן לך אמון',
      time: 'לפני 5 דקות',
      read: false
    },
    {
      id: 2,
      type: 'zooz',
      user: 'בנימין נתניהו',
      avatar: 'https://trust.coali.app/assets/netanyahu-profile-C6yQFuUl.jpg',
      message: 'שלח לך 50 ZOOZ',
      time: 'לפני 2 שעות',
      read: false
    },
    {
      id: 3,
      type: 'comment',
      user: 'ד״ר מאיה רוזמן',
      avatar: 'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg',
      message: 'הגיבה על הפוסט שלך',
      time: 'אתמול',
      read: true
    }
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">התראות</h1>
          <button className="text-sm text-primary font-medium">
            סמן הכל כנקרא
          </button>
        </div>

        {/* Notifications List */}
        <div>
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 border-b flex items-start gap-3 ${
                !notif.read ? 'bg-primary/5' : ''
              }`}
            >
              <img
                src={notif.avatar}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 text-right">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-sm">{notif.user}</p>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <p className="text-sm text-foreground mb-1">{notif.message}</p>
                <p className="text-xs text-muted-foreground">{notif.time}</p>
              </div>
              <div className="text-2xl">
                {notif.type === 'trust' && '🤝'}
                {notif.type === 'zooz' && '💰'}
                {notif.type === 'comment' && '💬'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Navigation zoozBalance={999} />
    </div>
  );
}
