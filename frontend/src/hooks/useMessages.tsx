import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  recipient_profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  user_id: string;
  last_message: Message;
  unread_count: number;
  user_profile: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchConversations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Get all conversations for the current user
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey(
            first_name,
            last_name,
            avatar_url
          ),
          recipient_profile:profiles!messages_recipient_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();

      messages?.forEach(message => {
        const isFromCurrentUser = message.sender_id === user.id;
        const partnerId = isFromCurrentUser ? message.recipient_id : message.sender_id;
        const partnerProfile = isFromCurrentUser ? message.recipient_profile : message.sender_profile;

        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            user_id: partnerId,
            last_message: message,
            unread_count: 0,
            user_profile: partnerProfile
          });
        } else {
          const existingConv = conversationMap.get(partnerId)!;
          if (new Date(message.created_at) > new Date(existingConv.last_message.created_at)) {
            existingConv.last_message = message;
          }
        }

        // Count unread messages
        if (!message.is_read && !isFromCurrentUser) {
          const conv = conversationMap.get(partnerId)!;
          conv.unread_count++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (partnerId: string) => {
    if (!user?.id) return;

    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey(
            first_name,
            last_name,
            avatar_url
          ),
          recipient_profile:profiles!messages_recipient_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setCurrentConversation(messages || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', partnerId)
        .eq('recipient_id', user.id)
        .eq('is_read', false);

    } catch (err: any) {
      console.error('Error fetching conversation:', err);
      setError(err.message);
    }
  };

  const sendMessage = async (recipientId: string, content: string) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content,
          is_read: false
        })
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey(
            first_name,
            last_name,
            avatar_url
          ),
          recipient_profile:profiles!messages_recipient_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Add to current conversation if it's the active one
      setCurrentConversation(prev => [...prev, data]);

      // Refresh conversations list
      await fetchConversations();

      return data;
    } catch (err: any) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
    } catch (err: any) {
      console.error('Error marking message as read:', err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchConversations();

      // Set up realtime subscription for new messages
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `recipient_id=eq.${user.id}`
          },
          () => {
            fetchConversations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id]);

  return {
    conversations,
    currentConversation,
    loading,
    error,
    fetchConversations,
    fetchConversation,
    sendMessage,
    markAsRead
  };
};