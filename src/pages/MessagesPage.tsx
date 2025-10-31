import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { MessageSquarePlus, Search, CheckCircle, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Demo conversations
const demoConversations = [
  {
    id: 'conv-1',
    user: {
      id: 'user-1',
      name: 'נועה רותם',
      avatar: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg',
      verified: true,
    },
    lastMessage: 'תודה על הפוסט! מאוד מעניין',
    timestamp: 'לפני 2 שעות',
    unreadCount: 2,
    isOwn: false,
  },
  {
    id: 'conv-2',
    user: {
      id: 'user-2',
      name: 'דוד לוי',
      avatar: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
      verified: true,
    },
    lastMessage: 'You: בהצלחה עם הפרויקט!',
    timestamp: 'אתמול',
    unreadCount: 0,
    isOwn: true,
  },
  {
    id: 'conv-3',
    user: {
      id: 'user-3',
      name: 'רחל כהן',
      avatar: 'https://trust.coali.app/assets/rachel-profile-w3gZXC9S.jpg',
      verified: true,
    },
    lastMessage: 'מה המלצה על ספר טוב בנושא?',
    timestamp: 'לפני 3 ימים',
    unreadCount: 0,
    isOwn: false,
  },
  {
    id: 'conv-4',
    user: {
      id: 'user-4',
      name: 'אמית ברק',
      avatar: 'https://trust.coali.app/assets/amit-profile-CprpaaC6.jpg',
      verified: false,
    },
    lastMessage: 'You: תודה על העזרה!',
    timestamp: 'לפני שבוע',
    unreadCount: 0,
    isOwn: true,
  },
  {
    id: 'conv-5',
    user: {
      id: 'user-5',
      name: 'מיכל שמיר',
      avatar: 'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg',
      verified: true,
    },
    lastMessage: 'נתראה מחר בפגישה',
    timestamp: '15/3',
    unreadCount: 1,
    isOwn: false,
  },
];

const MessagesPage = () => {
  const navigate = useNavigate();
  const [conversations] = useState(demoConversations);
  const [showNewMessage, setShowNewMessage] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">הודעות</h1>
          <button
            onClick={() => setShowNewMessage(true)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <MessageSquarePlus className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>

      {/* Conversation List */}
      {conversations.length > 0 ? (
        <div className="max-w-2xl mx-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => navigate(`/messages/${conv.user.id}`)}
              className="w-full flex items-center gap-3 p-4 border-b border-border hover:bg-muted/30 transition-colors"
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={conv.user.avatar}
                  alt={conv.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conv.unreadCount > 0 && (
                  <div className="absolute -top-1 -left-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {conv.unreadCount}
                  </div>
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-center gap-1 justify-end mb-1">
                  <span className={cn(
                    "font-medium text-sm truncate",
                    conv.unreadCount > 0 && "font-bold"
                  )}>
                    {conv.user.name}
                  </span>
                  {conv.user.verified && <CheckCircle className="w-4 h-4 text-trust flex-shrink-0" />}
                </div>
                <p className={cn(
                  "text-sm truncate",
                  conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {conv.lastMessage}
                </p>
              </div>

              {/* Timestamp */}
              <div className="text-xs text-muted-foreground flex-shrink-0">
                {conv.timestamp}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-foreground mb-2">אין הודעות</h3>
          <p className="text-sm text-muted-foreground mb-6">התחל שיחה חדשה</p>
          <button
            onClick={() => setShowNewMessage(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
          >
            הודעה חדשה
          </button>
        </div>
      )}

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-background w-full md:max-w-lg md:rounded-lg overflow-hidden max-h-[80vh]">
            <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">הודעה חדשה</h3>
              <button
                onClick={() => setShowNewMessage(false)}
                className="p-1 hover:bg-muted rounded-full"
              >
                ×
              </button>
            </div>

            <div className="p-4">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="חפש משתמש..."
                  className="w-full pr-10 pl-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Recent */}
              <div className="mb-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">אחרונים:</p>
                <div className="space-y-2">
                  {conversations.slice(0, 3).map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        navigate(`/messages/${conv.user.id}`);
                        setShowNewMessage(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-muted/30"
                    >
                      <img
                        src={conv.user.avatar}
                        alt={conv.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <span className="font-medium text-sm">{conv.user.name}</span>
                          {conv.user.verified && <CheckCircle className="w-4 h-4 text-trust" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navigation zoozBalance={999} />
    </div>
  );
};

export default MessagesPage;
