import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Modal, TouchableOpacity, Pressable, Text, Image, Switch, useWindowDimensions } from 'react-native';
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
import type { TicketStatusAnchorLayout } from '../components/tickets/TicketCard';
import { useAIChatOverlay } from '../contexts/AIChatOverlayContext';
import { useChatStore } from '../store/useChatStore';
import { TicketTab, TicketData, TicketsScreenData, TicketStatus } from '../types/tickets.types';
import {
  TICKETS_HEADER,
  TICKETS_TABS,
  TICKETS_SPACING,
  TICKETS_COLORS,
  TICKET_DIVIDER,
  TICKET_STATUS_POPOVER,
  scaleX,
} from '../constants/ticketsStyles';
import { dashboardService } from '../services/dashboard';
import { updateTicketStatus } from '../services/tickets';
import { useAuth } from '../contexts/AuthContext';
import { typography } from '../theme';

/** Change Status popover — height estimate for vertical clamping; width/left from `TICKET_STATUS_POPOVER` (Figma). */
const STATUS_POPOVER_HEIGHT_EST = 268 * scaleX;
const STATUS_POPOVER_NOTCH_SIZE = 12 * scaleX;

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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('Tickets');
  const [selectedTab, setSelectedTab] = useState<TicketTab>('myTickets');
  const [ticketsData, setTicketsData] = useState<TicketsScreenData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMenuTicket, setStatusMenuTicket] = useState<TicketData | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [dueTimeEnabled, setDueTimeEnabled] = useState(false);
  const [statusAnchor, setStatusAnchor] = useState<TicketStatusAnchorLayout | null>(null);

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

  const handleStatusPress = (ticket: TicketData, anchor?: TicketStatusAnchorLayout) => {
    setStatusMenuTicket(ticket);
    setDueTimeEnabled(false);
    setStatusAnchor(anchor ?? null);
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

  const statusPopoverPosition = React.useMemo(() => {
    if (!statusAnchor) return null;
    const left = TICKET_STATUS_POPOVER.left * scaleX;
    const popoverW = TICKET_STATUS_POPOVER.width * scaleX;
    const popoverH = STATUS_POPOVER_HEIGHT_EST;

    const desiredTop = statusAnchor.y + statusAnchor.height + 8 * scaleX;
    const top = Math.max(left, Math.min(windowHeight - popoverH - left, desiredTop));

    const notchSize = STATUS_POPOVER_NOTCH_SIZE;
    const anchorCenterX = statusAnchor.x + statusAnchor.width / 2;
    const notchCenterX = anchorCenterX - left;
    const notchLeft = Math.max(14 * scaleX, Math.min(popoverW - 14 * scaleX - notchSize, notchCenterX - notchSize / 2));

    return { left, top, notchLeft, width: popoverW };
  }, [statusAnchor, windowWidth, windowHeight]);

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
                  onStatusPress={(anchor) => handleStatusPress(ticket, anchor)}
                />
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
        <View style={styles.statusModalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {
              if (!statusUpdating) setStatusMenuTicket(null);
            }}
            accessibilityRole="button"
            accessibilityLabel="Dismiss status menu"
          />
          <View
            style={[
              styles.statusPopover,
              statusPopoverPosition
                ? {
                    position: 'absolute',
                    left: statusPopoverPosition.left,
                    top: statusPopoverPosition.top,
                    width: statusPopoverPosition.width,
                  }
                : null,
            ]}
          >
            <View
              style={[
                styles.statusPopoverNotch,
                statusPopoverPosition ? { left: statusPopoverPosition.notchLeft } : null,
              ]}
            />

            <Text style={styles.statusSectionTitle}>Change Status</Text>

            <View style={styles.statusGrid}>
              <TouchableOpacity
                style={styles.statusGridItem}
                activeOpacity={0.8}
                disabled={statusUpdating}
                onPress={() => {
                  // Ticket priority is not yet wired from this UI in backend.
                  // Keep UI parity with Figma without mutating server state.
                }}
              >
                <View style={[styles.statusCircle, styles.statusCirclePriority]}>
                  <Image
                    source={require('../../assets/icons/priority-status.png')}
                    style={styles.statusCircleIconRush}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.statusGridLabel}>Priority</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statusGridItem}
                activeOpacity={0.8}
                disabled={statusUpdating}
                onPress={() => handleStatusSelect('unsolved')}
              >
                <View style={[styles.statusCircle, styles.statusCircleUnsolved]}>
                  <Image
                    source={require('../../assets/icons/thumbs-down-icon.png')}
                    style={styles.statusCircleIconOnDark}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.statusGridLabel}>Unsolved</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statusGridItem}
                activeOpacity={0.8}
                disabled={statusUpdating}
                onPress={() => handleStatusSelect('done')}
              >
                <View style={[styles.statusCircle, styles.statusCircleSolved]}>
                  <Image
                    source={require('../../assets/icons/done.png')}
                    style={styles.statusCircleIconSolved}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.statusGridLabel}>Solved</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statusGridItem}
                activeOpacity={0.8}
                disabled={statusUpdating}
                onPress={() => {
                  // OFO not represented in tickets table yet.
                }}
              >
                <View style={styles.statusCircleOfoOuter}>
                  <View style={styles.statusCircleOfoInner} />
                </View>
                <Text style={styles.statusGridLabel}>OFO</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statusDivider} />

            <View style={styles.dueTimeRow}>
              <Text style={styles.statusSectionTitle}>Due time</Text>
              <Switch
                value={dueTimeEnabled}
                onValueChange={setDueTimeEnabled}
                disabled={statusUpdating}
                trackColor={{ false: '#eef2f7', true: '#eef2f7' }}
                thumbColor="#ffffff"
                style={styles.dueTimeSwitch}
              />
            </View>
          </View>
        </View>
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  statusPopover: {
    zIndex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 10 * scaleX,
    paddingHorizontal: 16 * scaleX,
    paddingTop: 16 * scaleX,
    paddingBottom: 14 * scaleX,
    shadowColor: '#6483B0',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  statusPopoverNotch: {
    position: 'absolute',
    top: -6 * scaleX,
    width: STATUS_POPOVER_NOTCH_SIZE,
    height: STATUS_POPOVER_NOTCH_SIZE,
    backgroundColor: '#ffffff',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e3e3e3',
    transform: [{ rotate: '45deg' }],
  },
  statusSectionTitle: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700',
    color: '#5b769e',
  },
  statusGrid: {
    marginTop: 14 * scaleX,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusGridItem: {
    width: 64 * scaleX,
    alignItems: 'center',
  },
  statusCircle: {
    width: 44 * scaleX,
    height: 44 * scaleX,
    borderRadius: 22 * scaleX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCirclePriority: {
    backgroundColor: '#ffebeb',
  },
  statusCircleUnsolved: {
    backgroundColor: '#f92424',
  },
  statusCircleSolved: {
    backgroundColor: '#41d541',
  },
  /** Thick grey ring + white center (Figma OFO), not a thin outline. */
  statusCircleOfoOuter: {
    width: 44 * scaleX,
    height: 44 * scaleX,
    borderRadius: 22 * scaleX,
    backgroundColor: '#c6c5c5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCircleOfoInner: {
    width: 20 * scaleX,
    height: 20 * scaleX,
    borderRadius: 10 * scaleX,
    backgroundColor: '#ffffff',
  },
  statusCircleIcon: {
    width: 24 * scaleX,
    height: 24 * scaleX,
    tintColor: '#f92424',
  },
  /** Priority / rush — full-color asset from Figma; do not tint. */
  statusCircleIconRush: {
    width: 26 * scaleX,
    height: 26 * scaleX,
  },
  statusCircleIconOnDark: {
    width: 24 * scaleX,
    height: 24 * scaleX,
    tintColor: '#ffffff',
  },
  /** Same glyph as ticket “done” state, white on green circle. */
  statusCircleIconSolved: {
    width: 24 * scaleX,
    height: 24 * scaleX,
    tintColor: '#ffffff',
  },
  statusGridLabel: {
    marginTop: 8 * scaleX,
    fontSize: 13 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '300',
    color: '#000000',
    textAlign: 'center',
  },
  statusDivider: {
    height: 1,
    backgroundColor: '#e3e3e3',
    marginTop: 14 * scaleX,
    marginBottom: 10 * scaleX,
  },
  dueTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueTimeSwitch: {
    transform: [{ scaleX: 0.88 }, { scaleY: 0.88 }],
  },
});

