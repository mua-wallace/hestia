import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useChatStore } from '../store/useChatStore';
import { subscribeNotificationBadgeInvalidate } from '../services/inAppNotifications';

/**
 * Tab bar badges: Chat uses the higher of unread thread counts vs unread in-app
 * `chat_message` notifications (avoids double-counting when both match). Tickets
 * uses unread `ticket_tag` notifications for the logged-in user (RLS).
 */
export function useBottomTabBadges() {
  const { session } = useAuth();
  const { chats } = useChatStore();
  const chatUnreadSum = useMemo(
    () => chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0),
    [chats]
  );

  const [chatMessageUnread, setChatMessageUnread] = useState(0);
  const [ticketTagUnread, setTicketTagUnread] = useState(0);

  const fetchNotificationCounts = useCallback(async () => {
    if (!isSupabaseConfigured || !session?.user?.id) {
      setChatMessageUnread(0);
      setTicketTagUnread(0);
      return;
    }

    const [chatRes, ticketRes] = await Promise.all([
      supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .is('read_at', null)
        .eq('type', 'chat_message'),
      supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .is('read_at', null)
        .eq('type', 'ticket_tag'),
    ]);

    if (chatRes.error) {
      console.warn('[useBottomTabBadges] chat_message count', chatRes.error.message);
    }
    if (ticketRes.error) {
      console.warn('[useBottomTabBadges] ticket_tag count', ticketRes.error.message);
    }

    setChatMessageUnread(chatRes.count ?? 0);
    setTicketTagUnread(ticketRes.count ?? 0);
  }, [session?.user?.id]);

  useEffect(() => {
    fetchNotificationCounts();
  }, [fetchNotificationCounts]);

  useEffect(() => {
    return subscribeNotificationBadgeInvalidate(fetchNotificationCounts);
  }, [fetchNotificationCounts]);

  useFocusEffect(
    useCallback(() => {
      fetchNotificationCounts();
    }, [fetchNotificationCounts])
  );

  const chatBadgeCount = Math.max(chatUnreadSum, chatMessageUnread);
  const ticketsBadgeCount = ticketTagUnread;

  return { chatBadgeCount, ticketsBadgeCount };
}
