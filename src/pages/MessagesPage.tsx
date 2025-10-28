import { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { DemoModeBanner } from '@/components/DemoModeBanner';
import { ConversationList } from '@/components/ConversationList';
import { ConversationThread } from '@/components/ConversationThread';
import { useMessages } from '@/hooks/useMessages';
import { useIsDemoMode } from '@/hooks/useIsDemoMode';
import { useWalletData } from '@/hooks/useWalletData';
import type { Conversation } from '@/hooks/useMessages';

const MessagesPage = () => {
  const { getDemoUserId } = useIsDemoMode();
  const currentUserId = getDemoUserId();
  const { zoozBalance } = useWalletData();
  const { conversations, loading, sendMessage, markAsRead } = useMessages(currentUserId || undefined);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    markAsRead(conversation.id);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return false;
    return await sendMessage(selectedConversation.other_user_id, content);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <DemoModeBanner />
      
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">טוען שיחות...</p>
          </div>
        ) : (
          <div className="h-full md:grid md:grid-cols-[350px_1fr]">
            {/* Conversations List - Hidden on mobile when conversation selected */}
            <div className={`
              h-full border-l
              ${selectedConversation ? 'hidden md:block' : 'block'}
            `}>
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversation?.id}
                onSelectConversation={handleSelectConversation}
              />
            </div>

            {/* Conversation Thread - Hidden on mobile when no conversation selected */}
            <div className={`
              h-full
              ${selectedConversation ? 'block' : 'hidden md:flex md:items-center md:justify-center'}
            `}>
              {selectedConversation ? (
                <ConversationThread
                  conversationId={selectedConversation.id}
                  otherUserName={selectedConversation.other_user_name}
                  otherUserAvatar={selectedConversation.other_user_avatar}
                  onBack={handleBack}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>בחר שיחה להתחיל</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Navigation zoozBalance={zoozBalance} />
    </div>
  );
};

export default MessagesPage;