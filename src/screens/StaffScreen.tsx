import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { colors, typography } from '../theme';
import BottomTabBar from '../components/navigation/BottomTabBar';
import { mockHomeData } from '../data/mockHomeData';
import { useChatStore } from '../store/useChatStore';
import StaffHeader from '../components/staff/StaffHeader';
import StaffTabs from '../components/staff/StaffTabs';
import StaffCard from '../components/staff/StaffCard';
import { StaffTab, StaffMember } from '../types/staff.types';
import { scaleX, STAFF_DATE } from '../constants/staffStyles';
import type { ReturnToTab } from '../navigation/types';

const DESIGN_WIDTH = 440;

type MainTabsParamList = {
  Home: undefined;
  Rooms: undefined;
  Chat: undefined;
  Tickets: undefined;
  LostAndFound: undefined;
  Staff: undefined;
  Settings: undefined;
};

type StaffScreenNavigationProp = NativeStackNavigationProp<MainTabsParamList, 'Staff'>;

// Mock data - replace with actual API call
const mockStaffData: StaffMember[] = [
  {
    id: '1',
    name: 'Anna Sube',
    initials: 'A',
    avatarColor: '#cdd3dd',
    progressRatio: { completed: 3, total: 7 },
    taskStats: { inProgress: 1, cleaned: 3, dirty: 3 },
    currentTask: {
      roomNumber: '301',
      timer: '00:30:23',
      isActive: true,
    },
  },
  {
    id: '2',
    name: 'Vasilis Baoss',
    initials: 'V',
    avatarColor: '#5a759d',
    progressRatio: { completed: 3, total: 7 },
    taskStats: { inProgress: 0, cleaned: 1, dirty: 6 },
  },
  {
    id: '3',
    name: 'Yenchai Manis',
    avatar: require('../../assets/icons/staff-icon.png'),
    progressRatio: { completed: 2, total: 7 },
    taskStats: { inProgress: 1, cleaned: 2, dirty: 4 },
    currentTask: {
      roomNumber: '301',
      timer: '00:50:23',
      isActive: true,
    },
  },
  {
    id: '4',
    name: 'Poali Bason',
    avatar: require('../../assets/icons/staff-icon.png'),
    progressRatio: { completed: 4, total: 7 },
    taskStats: { inProgress: 1, cleaned: 4, dirty: 2 },
    currentTask: {
      roomNumber: '301',
      timer: '00:00:23',
      isActive: false,
    },
  },
];

export default function StaffScreen() {
  const navigation = useNavigation<StaffScreenNavigationProp>();
  const route = useRoute();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;
  
  const [activeTab, setActiveTab] = useState('Staff');
  const [selectedTab, setSelectedTab] = useState<StaffTab>('onShift');
  const [staffMembers] = useState<StaffMember[]>(mockStaffData);

  // Format current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

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
  const { chats } = useChatStore();
  const chatBadgeCount = React.useMemo(
    () => chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0),
    [chats]
  );

  const handleTabPress = (tab: string) => {
    setActiveTab(tab); // Update immediately
    const returnToTab = (route.name as string) as 'Home' | 'Rooms' | 'Chat' | 'Tickets' | 'LostAndFound' | 'Staff' | 'Settings';
    if (tab === 'Home' || tab === 'Rooms' || tab === 'Chat' || tab === 'Tickets' || tab === 'LostAndFound' || tab === 'Staff' || tab === 'Settings') {
      navigation.navigate(tab as keyof MainTabsParamList);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      const returnToTab = (route.params as { returnToTab?: ReturnToTab } | undefined)?.returnToTab ?? 'Home';
      navigation.navigate(returnToTab as keyof MainTabsParamList);
    }
  };

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Search pressed');
  };

  const handleStaffTabPress = (tab: StaffTab) => {
    setSelectedTab(tab);
    // TODO: Filter staff members based on selected tab
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    content: {
      flex: 1,
    },
    contentBlurOverlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1,
    },
    blurOverlayDarkener: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(200, 200, 200, 0.6)',
    },
    dateText: {
      position: 'absolute',
      top: STAFF_DATE.top * scaleX,
      left: STAFF_DATE.left * scaleX,
      fontSize: STAFF_DATE.fontSize * scaleX,
      fontFamily: typography.fontFamily.secondary, // Inter font as per design
      fontWeight: typography.fontWeights.semibold as any,
      color: STAFF_DATE.color,
      zIndex: 1,
    },
    staffList: {
      marginTop: (STAFF_DATE.top + 25) * scaleX, // Start after date with some spacing
      paddingBottom: 152 * scaleX, // Space for bottom tab bar
    },
    staffListContent: {
      paddingBottom: 152 * scaleX, // Space for bottom tab bar
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header - Absolutely positioned at top */}
        <StaffHeader
          onBackPress={handleBack}
          onSearchPress={handleSearch}
        />

        {/* Tabs - Absolutely positioned below header */}
        <StaffTabs
          selectedTab={selectedTab}
          onTabPress={handleStaffTabPress}
        />

        {/* Date - Absolutely positioned */}
        <Text style={styles.dateText}>{formattedDate}</Text>

        {/* Staff List - Scrollable content starting after date */}
        <ScrollView
          style={styles.staffList}
          contentContainerStyle={styles.staffListContent}
          showsVerticalScrollIndicator={false}
        >
          {staffMembers.map((staff) => (
            <StaffCard key={staff.id} staff={staff} />
          ))}
        </ScrollView>

      </View>

      <BottomTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        chatBadgeCount={chatBadgeCount}
      />
    </View>
  );
}
