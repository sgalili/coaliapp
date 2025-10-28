import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIsDemoMode } from './useIsDemoMode';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  conversation_id: string;
}

export interface Conversation {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export const useMessages = (currentUserId?: string) => {
  const { isDemoMode, getDemoUserId } = useIsDemoMode();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = isDemoMode ? getDemoUserId() : currentUserId;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchConversations();
  }, [userId, isDemoMode]);

  const fetchConversations = async () => {
    if (!userId) return;

    try {
      let messages: any[] | null = null;

      if (isDemoMode) {
        const { data } = await supabase
          .from('demo_messages')
          .select('*')
          .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
          .order('created_at', { ascending: false });
        messages = data;
      } else {
        const { data } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
          .order('created_at', { ascending: false });
        messages = data;
      }

      // Group by conversation
      const conversationMap = new Map<string, any>();
      
      for (const msg of messages || []) {
        const otherUserId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
        const conversationId = [userId, otherUserId].sort().join('-');
        
        if (!conversationMap.has(conversationId)) {
          // Fetch other user profile
          let profile: any = null;
          if (isDemoMode) {
            const { data } = await supabase
              .from('demo_profiles')
              .select('*')
              .eq('user_id', otherUserId)
              .single();
            profile = data;
          } else {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', otherUserId)
              .single();
            profile = data;
          }

          conversationMap.set(conversationId, {
            id: conversationId,
            other_user_id: otherUserId,
            other_user_name: profile ? `${profile.first_name} ${profile.last_name}` : 'משתמש',
            other_user_avatar: profile?.avatar_url,
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: 0,
            messages: [],
          });
        }

        const conv = conversationMap.get(conversationId);
        
        // Count unread messages (received and not read)
        if (msg.recipient_id === userId && !msg.is_read) {
          conv.unread_count++;
        }
      }

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (recipientId: string, content: string) => {
    if (!userId || !content.trim()) return false;

    const conversationId = [userId, recipientId].sort().join('-');

    try {
      if (isDemoMode) {
        const { error } = await supabase
          .from('demo_messages')
          .insert({
            sender_id: userId,
            recipient_id: recipientId,
            content: content.trim(),
            conversation_id: conversationId,
            is_read: false,
          });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('messages')
          .insert({
            sender_id: userId,
            recipient_id: recipientId,
            content: content.trim(),
            is_read: false,
          });
        if (error) throw error;
      }

      // Refresh conversations
      await fetchConversations();
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!userId) return;

    try {
      if (isDemoMode) {
        await supabase
          .from('demo_messages')
          .update({ is_read: true })
          .eq('conversation_id', conversationId)
          .eq('recipient_id', userId)
          .eq('is_read', false);
      } else {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('recipient_id', userId)
          .eq('is_read', false);
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return {
    conversations,
    loading,
    sendMessage,
    markAsRead,
    refetch: fetchConversations,
  };
};

export const useConversationMessages = (conversationId: string, currentUserId?: string) => {
  const { isDemoMode, getDemoUserId } = useIsDemoMode();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = isDemoMode ? getDemoUserId() : currentUserId;

  useEffect(() => {
    if (!conversationId || !userId) {
      setLoading(false);
      return;
    }

    fetchMessages();

    // Set up realtime subscription
    const tableName = isDemoMode ? 'demo_messages' : 'messages';
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tableName,
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId, isDemoMode]);

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      let data: any[] | null = null;
      
      if (isDemoMode) {
        const result = await supabase
          .from('demo_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
        data = result.data;
      } else {
        const result = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
          .order('created_at', { ascending: true });
        data = result.data;
      }

      setMessages((data || []) as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, refetch: fetchMessages };
};
