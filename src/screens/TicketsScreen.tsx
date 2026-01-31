import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BlurView } from 'expo-blur';
import BottomTabBar from '../components/navigation/BottomTabBar';
import MorePopup from '../components/more/MorePopup';
import TicketsHeader from '../components/tickets/TicketsHeader';
import TicketsTabs from '../components/tickets/TicketsTabs';
import TicketCard from '../components/tickets/TicketCard';
import { mockHomeData } from '../data/mockHomeData';
import { mockTicketsData } from '../data/mockTicketsData';
import { mockChatData } from '../data/mockChatData';
import { MoreMenuItemId } from '../types/more.types';
import { TicketTab, TicketData } from '../types/tickets.types';
import {
  TICKETS_HEADER,
  TICKETS_TABS,
  TICKETS_SPACING,
  TICKETS_COLORS,
  TICKET_DIVIDER,
  scaleX,
} from '../constants/ticketsStyles';

type MainTabsParamList = {
  Home: undefined;
  Rooms: undefined;
  Chat: undefined;
  Tickets: undefined;
  LostAndFound: undefined;
  Staff: undefined;
  Settings: undefined;
};

type TicketsScreenNavigationProp = BottomTabNavigationProp<MainTabsParamList, 'Tickets'>;
type StackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TicketsScreen() {
  const navigation = useNavigation<TicketsScreenNavigationProp>();
  const stackNavigation = useNavigation<StackNavigationProp>();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('Tickets');
  const [showMorePopup, setShowMorePopup] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TicketTab>('myTickets');
  const [tickets] = useState<TicketData[]>(mockTicketsData.tickets);
  const [refreshing, setRefreshing] = useState(false);

  // Sync activeTab with current route
  useFocusEffect(
    React.useCallback(() => {
      const routeName = route.name as string;
      if (routeName === 'Home' || routeName === 'Rooms' || routeName === 'Chat' || routeName === 'Tickets') {
        setActiveTab(routeName);
      }
    }, [route.name])
  );

  // Calculate total unread chat messages for badge
  const chatBadgeCount = React.useMemo(() => {
    return mockChatData.reduce((total, chat) => total + (chat.unreadCount || 0), 0);
  }, []);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab); // Update immediately
    setShowMorePopup(false);
    if (tab === 'Home') {
      navigation.navigate('Home' as any);
    } else if (tab === 'Rooms') {
      navigation.navigate('Rooms' as any);
    } else if (tab === 'Chat') {
      navigation.navigate('Chat' as any);
    } else if (tab === 'Tickets') {
      navigation.navigate('Tickets' as any);
    }
  };

  const handleMorePress = () => {
    setShowMorePopup(true);
  };

  const handleMenuItemPress = (menuItem: MoreMenuItemId) => {
    setShowMorePopup(false);
    switch (menuItem) {
      case 'lostAndFound':
        navigation.navigate('LostAndFound');
        break;
      case 'staff':
        navigation.navigate('Staff');
        break;
      case 'settings':
        navigation.navigate('Settings');
        break;
      default:
        break;
    }
  };

  const handleClosePopup = () => {
    setShowMorePopup(false);
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
    // TODO: Handle status change
    console.log('Status pressed for ticket:', ticket.id);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Filter tickets based on selected tab
  const filteredTickets = tickets.filter((ticket) => {
    if (selectedTab === 'myTickets') {
      // TODO: Filter by current user's tickets
      return true;
    } else if (selectedTab === 'open') {
      return ticket.status === 'unsolved';
    } else if (selectedTab === 'closed') {
      return ticket.status === 'done';
    }
    return true; // 'all' shows all tickets
  });

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <View style={styles.scrollContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!showMorePopup}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Ticket Cards */}
          {filteredTickets.map((ticket, index) => (
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
          ))}
        </ScrollView>

        {/* Blur Overlay for content only */}
        {showMorePopup && (
          <BlurView intensity={80} style={styles.contentBlurOverlay} tint="light">
            <View style={styles.blurOverlayDarkener} />
          </BlurView>
        )}
      </View>

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
        onMorePress={handleMorePress}
        chatBadgeCount={chatBadgeCount}
      />

      {/* More Popup */}
      <MorePopup
        visible={showMorePopup}
        onClose={handleClosePopup}
        onMenuItemPress={handleMenuItemPress}
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
});

