import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Modal, TouchableOpacity, TouchableWithoutFeedback, Text } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, MainTabsParamList as MainTabsParamListFromApp } from '../navigation/types';
import BottomTabBar from '../components/navigation/BottomTabBar';
import { LoadingOverlay } from '../components/shared/LoadingOverlay';
import TicketsHeader from '../components/tickets/TicketsHeader';
import TicketsTabs from '../components/tickets/TicketsTabs';
import TicketCard from '../components/tickets/TicketCard';
import EmptyTicketsState from '../components/tickets/EmptyTicketsState';
import { useAIChatOverlay } from '../contexts/AIChatOverlayContext';
import { useChatStore } from '../store/useChatStore';
import { TicketTab, TicketData, TicketsScreenData, TicketStatus } from '../types/tickets.types';
import {
  TICKETS_HEADER,
  TICKETS_TABS,
  TICKETS_SPACING,
  TICKETS_COLORS,
  TICKET_DIVIDER,
  scaleX,
} from '../constants/ticketsStyles';
import { dashboardService } from '../services/dashboard';
import { updateTicketStatus } from '../services/tickets';
import { useAuth } from '../contexts/AuthContext';
import { typography } from '../theme';

type MainTabsParamList = MainTabsParamListFromApp & {
  Tickets: { initialTab?: TicketTab } | undefined;
};

type TicketsScreenNavigationProp = BottomTabNavigationProp<MainTabsParamList, 'Tickets'>;
type StackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TicketsScreen() {
  const navigation = useNavigation<TicketsScreenNavigationProp>();
  const stackNavigation = useNavigation<StackNavigationProp>();
  const route = useRoute();
  const { open: openAIChatOverlay } = useAIChatOverlay();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('Tickets');
  const [selectedTab, setSelectedTab] = useState<TicketTab>('myTickets');
  const [ticketsData, setTicketsData] = useState<TicketsScreenData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMenuTicket, setStatusMenuTicket] = useState<TicketData | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const loadTickets = useCallback(async (overrideInitialTab?: TicketTab) => {
    try {
      setLoading(true);
      const data = await dashboardService.getTicketsData();
      setTicketsData(data);
      // If we came here with an explicit initial tab (e.g. after creating a ticket),
      // prefer that over the stored/dashboard selection.
      if (overrideInitialTab) {
        setSelectedTab(overrideInitialTab);
      } else if (data.selectedTab) {
        setSelectedTab(data.selectedTab);
      }
    } catch (e) {
      console.warn('[TicketsScreen] Failed to load tickets', e);
      const fallbackTab = overrideInitialTab ?? 'myTickets';
      setTicketsData({ selectedTab: fallbackTab, tickets: [] });
      setSelectedTab(fallbackTab);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Sync activeTab with current route
  useFocusEffect(
    React.useCallback(() => {
      const routeName = route.name as string;
      if (routeName === 'Home' || routeName === 'Rooms' || routeName === 'Chat' || routeName === 'Tickets') {
        setActiveTab(routeName);
      }

      // When navigated with an explicit initialTab (e.g. after creating a ticket),
      // prefer that over the stored selection.
      const params = (route as any).params as { initialTab?: TicketTab } | undefined;
      const overrideInitialTab = params?.initialTab;

      // Refresh tickets whenever Tickets screen gains focus
      loadTickets(overrideInitialTab);
    }, [route, loadTickets])
  );

  // Calculate total unread chat messages for badge
  const { chats } = useChatStore();
  const chatBadgeCount = React.useMemo(
    () => chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0),
    [chats]
  );

  const handleTabPress = (tab: string) => {
    if (tab === 'AIHome') {
      openAIChatOverlay();
      return;
    }
    setActiveTab(tab); // Update immediately
    const returnToTab = (route.name as string) as 'Home' | 'Rooms' | 'Chat' | 'Tickets' | 'LostAndFound' | 'Staff' | 'Settings';
    if (tab === 'Home') {
      navigation.navigate('Home' as any);
    } else if (tab === 'Rooms') {
      navigation.navigate('Rooms' as any);
    } else if (tab === 'Chat') {
      navigation.navigate('Chat' as any);
    } else if (tab === 'Tickets') {
      navigation.navigate('Tickets' as any);
    } else if (tab === 'LostAndFound') {
      (navigation as any).navigate('LostAndFound', { returnToTab });
    } else if (tab === 'Staff') {
      (navigation as any).navigate('Staff', { returnToTab });
    } else if (tab === 'Settings') {
      (navigation as any).navigate('Settings', { returnToTab });
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCreatePress = () => {
    stackNavigation.navigate('CreateTicket');
  };

  const handleTabChange = (tab: TicketTab) => {
    setSelectedTab(tab);
    // TODO: Filter tickets based on selected tab
  };

  const handleTicketPress = (ticket: TicketData) => {
    // TODO: Navigate to ticket detail screen
    console.log('Ticket pressed:', ticket.id);
    // navigation.navigate('TicketDetail', { ticketId: ticket.id });
  };

  const handleStatusPress = (ticket: TicketData) => {
    setStatusMenuTicket(ticket);
  };

  const handleStatusSelect = async (nextStatus: TicketStatus) => {
    if (!statusMenuTicket) return;
    setStatusUpdating(true);
    try {
      await updateTicketStatus(statusMenuTicket.id, nextStatus);
      setStatusMenuTicket(null);
      // Refresh while keeping the current selected tab.
      await loadTickets(selectedTab);
    } catch (e) {
      console.warn('[TicketsScreen] Failed to update ticket status', e);
    } finally {
      setStatusUpdating(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadTickets().finally(() => setRefreshing(false));
  }, []);

  const tickets: TicketData[] = ticketsData?.tickets ?? [];
  const currentUserId = session?.user?.id;

  // Filter tickets based on selected tab
  const filteredTickets = tickets.filter((ticket) => {
    if (selectedTab === 'myTickets') {
      if (!currentUserId) return false;
      return ticket.assignedToId === currentUserId;
    } else if (selectedTab === 'open') {
      return ticket.status === 'unsolved';
    } else if (selectedTab === 'closed') {
      return ticket.status === 'done';
    }
    return true; // 'all' shows all tickets
  });

  return (
    <View style={styles.container}>
      {(loading || refreshing) && <LoadingOverlay fullScreen message={loading ? 'Loading tickets…' : 'Refreshing…'} />}
      <View style={styles.scrollContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Ticket Cards or Empty State */}
          {filteredTickets.length === 0 ? (
            <EmptyTicketsState selectedTab={selectedTab} />
          ) : (
            filteredTickets.map((ticket, index) => (
              <React.Fragment key={ticket.id}>
                <TicketCard
                  ticket={ticket}
                  onPress={() => handleTicketPress(ticket)}
                  onStatusPress={() => handleStatusPress(ticket)}
                />
                {/* Divider */}
                {index < filteredTickets.length - 1 && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))
          )}
        </ScrollView>

        {/* Blur Overlay for content only */}
      </View>

      {/* Status dropdown */}
      <Modal
        visible={!!statusMenuTicket}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusMenuTicket(null)}
      >
        <TouchableWithoutFeedback onPress={() => (statusUpdating ? null : setStatusMenuTicket(null))}>
          <View style={styles.statusModalOverlay}>
            <View style={styles.statusDropdown}>
              <TouchableOpacity
                style={styles.statusOption}
                onPress={() => handleStatusSelect('done')}
                disabled={statusUpdating}
              >
                <Text style={[styles.statusOptionText, styles.statusOptionDone]}>Done</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statusOption}
                onPress={() => handleStatusSelect('unsolved')}
                disabled={statusUpdating}
              >
                <Text style={[styles.statusOptionText, styles.statusOptionUnsolved]}>Unsolved</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Header - Fixed at top */}
      <TicketsHeader
        onBackPress={handleBackPress}
        onCreatePress={handleCreatePress}
      />

      {/* Tabs - Fixed below header */}
      <TicketsTabs selectedTab={selectedTab} onTabPress={handleTabChange} />

      {/* Bottom Navigation */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        chatBadgeCount={chatBadgeCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TICKETS_COLORS.background,
  },
  scrollContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: TICKETS_SPACING.contentPaddingTop * scaleX,
    paddingBottom: TICKETS_SPACING.contentPaddingBottom * scaleX,
    minHeight: '100%',
  },
  divider: {
    height: TICKET_DIVIDER.height,
    backgroundColor: TICKET_DIVIDER.color,
    marginHorizontal: 16 * scaleX,
    marginVertical: 8 * scaleX,
  },
  contentBlurOverlay: {
    position: 'absolute',
    top: (TICKETS_HEADER.height + TICKETS_TABS.container.height) * scaleX, // Start below header and tabs
    left: 0,
    right: 0,
    bottom: 152 * scaleX, // Stop above bottom nav
    zIndex: 1,
  },
  blurOverlayDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
  },
  statusModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDropdown: {
    width: 220 * scaleX,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 10 * scaleX,
    paddingVertical: 8 * scaleX,
  },
  statusOption: {
    paddingVertical: 12 * scaleX,
    paddingHorizontal: 16 * scaleX,
  },
  statusOptionText: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  statusOptionDone: {
    color: '#41d541',
  },
  statusOptionUnsolved: {
    color: '#f92424',
  },
});

