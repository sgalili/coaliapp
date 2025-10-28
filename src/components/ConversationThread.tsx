import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { Send, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useConversationMessages } from '@/hooks/useMessages';
import { useIsDemoMode } from '@/hooks/useIsDemoMode';

interface ConversationThreadProps {
  conversationId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  onBack: () => void;
  onSendMessage: (content: string) => Promise<boolean>;
}

export const ConversationThread = ({
  conversationId,
  otherUserName,
  otherUserAvatar,
  onBack,
  onSendMessage,
}: ConversationThreadProps) => {
  const { getDemoUserId } = useIsDemoMode();
  const currentUserId = getDemoUserId();
  const { messages, loading } = useConversationMessages(conversationId, currentUserId || undefined);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const success = await onSendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="md:hidden"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10">
          <AvatarImage src={otherUserAvatar} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {otherUserName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <h2 className="font-bold">{otherUserName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">טוען הודעות...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">אין הודעות בשיחה</p>
          </div>
        ) : (
          messages.map((message) => {
            const isSent = message.sender_id === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}
              >
                {!isSent && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={otherUserAvatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {otherUserName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`
                    max-w-[70%] rounded-2xl px-4 py-2
                    ${isSent 
                      ? 'bg-primary text-primary-foreground rounded-br-sm' 
                      : 'bg-accent text-accent-foreground rounded-bl-sm'
                    }
                  `}
                >
                  <p className="break-words">{message.content}</p>
                  <div className={`
                    text-xs mt-1 flex items-center gap-1
                    ${isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'}
                  `}>
                    <span>
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                        locale: he,
                      })}
                    </span>
                    {isSent && (
                      <span>{message.is_read ? '✓✓' : '✓'}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="כתוב הודעה..."
            className="flex-1"
            disabled={sending}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
