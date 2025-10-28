import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import type { Conversation } from '@/hooks/useMessages';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">הודעות</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>אין שיחות</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`
                flex items-center gap-3 p-4 border-b cursor-pointer
                transition-colors hover:bg-accent/50
                ${selectedConversationId === conversation.id ? 'bg-accent' : ''}
              `}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={conversation.other_user_avatar} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {conversation.other_user_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold truncate">
                    {conversation.other_user_name}
                  </h3>
                  <span className="text-xs text-muted-foreground mr-2">
                    {formatDistanceToNow(new Date(conversation.last_message_time), {
                      addSuffix: true,
                      locale: he,
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message}
                  </p>
                  {conversation.unread_count > 0 && (
                    <Badge variant="default" className="mr-2 h-5 min-w-[20px] px-1">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
