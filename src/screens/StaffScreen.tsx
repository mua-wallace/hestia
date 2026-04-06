import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { colors, typography } from '../theme';
import BottomTabBar from '../components/navigation/BottomTabBar';
import { mockHomeData } from '../data/mockHomeData';
import { useAIChatOverlay } from '../contexts/AIChatOverlayContext';
import StaffHeader from '../components/staff/StaffHeader';
import StaffTabs from '../components/staff/StaffTabs';
import StaffCard from '../components/staff/StaffCard';
import StaffDepartmentList from '../components/staff/StaffDepartmentList';
import StaffDepartmentStaffPanel, { type DepartmentRowPosition } from '../components/staff/StaffDepartmentStaffPanel';
import type { StaffDepartmentId } from '../components/staff/StaffDepartmentList';
import { STAFF_DEPARTMENTS_LIST } from '../components/staff/StaffDepartmentList';
import { StaffTab, StaffMember } from '../types/staff.types';
import { scaleX, STAFF_DATE, STAFF_TABS } from '../constants/staffStyles';
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
  const insets = useSafeAreaInsets();
  const { open: openAIChatOverlay } = useAIChatOverlay();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;
  
  const [activeTab, setActiveTab] = useState('Staff');
  const [selectedTab, setSelectedTab] = useState<StaffTab>('onShift');
  const [staffMembers] = useState<StaffMember[]>(mockStaffData);
  const [departmentPanel, setDepartmentPanel] = useState<{
    departmentId: StaffDepartmentId;
    departmentName: string;
    rowPosition: DepartmentRowPosition | null;
  } | null>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleTabPress = (tab: string, options?: { fromRoomsAssignmentBadge?: boolean }) => {
    if (tab === 'AIHome') {
      openAIChatOverlay();
      return;
    }
    setActiveTab(tab); // Update immediately
    if (tab === 'Rooms') {
      navigation.navigate('Rooms', {
        prioritizeMyAssignedRooms: !!options?.fromRoomsAssignmentBadge,
      });
      return;
    }
    if (tab === 'Home' || tab === 'Chat' || tab === 'Tickets' || tab === 'LostAndFound' || tab === 'Staff' || tab === 'Settings') {
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

  const handleDepartmentPress = (department: { id: StaffDepartmentId; name: string }, rowPosition: DepartmentRowPosition) => {
    setDepartmentPanel({
      departmentId: department.id,
      departmentName: department.name,
      rowPosition,
    });
  };

  const handleSearchPress = () => setSearchExpanded(true);
  const handleSearchClose = () => {
    setSearchExpanded(false);
    setSearchQuery('');
  };

  const filteredStaffForSearch = React.useMemo(() => {
    if (!searchQuery.trim()) return staffMembers;
    const q = searchQuery.trim().toLowerCase();
    return staffMembers.filter((s) => s.name.toLowerCase().includes(q));
  }, [staffMembers, searchQuery]);

  const filteredDepartmentsForSearch = React.useMemo(() => {
    if (!searchQuery.trim()) return STAFF_DEPARTMENTS_LIST;
    const q = searchQuery.trim().toLowerCase();
    return STAFF_DEPARTMENTS_LIST.filter((d) => d.name.toLowerCase().includes(q));
  }, [searchQuery]);

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
    searchEmptyText: {
      paddingHorizontal: 24 * scaleX,
      paddingTop: 24 * scaleX,
      fontSize: 14 * scaleX,
      color: STAFF_TABS.tab.inactiveColor,
    },
    searchSection: {
      marginTop: 16 * scaleX,
    },
    searchSectionTitle: {
      fontSize: 12 * scaleX,
      fontFamily: typography.fontFamily.primary,
      fontWeight: '700',
      color: STAFF_TABS.tab.inactiveColor,
      marginBottom: 12 * scaleX,
      paddingHorizontal: 17 * scaleX,
    },
    searchDepartmentRow: {
      paddingVertical: 14 * scaleX,
      paddingHorizontal: 24 * scaleX,
      borderBottomWidth: 1,
      borderBottomColor: '#e3e3e3',
    },
    searchDepartmentName: {
      fontSize: 16 * scaleX,
      fontFamily: typography.fontFamily.primary,
      fontWeight: '700',
      color: '#1e1e1e',
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

        {/* Tabs - Absolutely positioned below header (or search input when search open) */}
        <StaffTabs
          selectedTab={selectedTab}
          onTabPress={handleStaffTabPress}
          searchExpanded={searchExpanded}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearchPress={handleSearchPress}
          onSearchClose={handleSearchClose}
        />

        {/* Date - Absolutely positioned */}
        <Text style={styles.dateText}>{formattedDate}</Text>

        {/* Staff List, Departments, or Search results - Scrollable content starting after date */}
        <ScrollView
          style={styles.staffList}
          contentContainerStyle={styles.staffListContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {searchExpanded ? (
            <>
              {filteredStaffForSearch.length === 0 && filteredDepartmentsForSearch.length === 0 ? (
                <Text style={styles.searchEmptyText}>
                  {searchQuery.trim() ? 'No staff or departments match your search' : 'Type to search staff and departments'}
                </Text>
              ) : null}
              {filteredStaffForSearch.length > 0 ? (
                <View style={styles.searchSection}>
                  <Text style={styles.searchSectionTitle}>Staff</Text>
                  {filteredStaffForSearch.map((staff) => (
                    <StaffCard key={staff.id} staff={staff} />
                  ))}
                </View>
              ) : null}
              {filteredDepartmentsForSearch.length > 0 ? (
                <View style={styles.searchSection}>
                  <Text style={styles.searchSectionTitle}>Departments</Text>
                  {filteredDepartmentsForSearch.map((dept) => (
                    <TouchableOpacity
                      key={dept.id}
                      style={styles.searchDepartmentRow}
                      activeOpacity={0.7}
                      onPress={() => setDepartmentPanel({
                        departmentId: dept.id,
                        departmentName: dept.name,
                        rowPosition: null,
                      })}
                    >
                      <Text style={styles.searchDepartmentName}>{dept.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </>
          ) : selectedTab === 'departments' ? (
            <StaffDepartmentList
              activeDepartmentId={departmentPanel?.departmentId ?? null}
              onDepartmentPress={handleDepartmentPress}
            />
          ) : (
            staffMembers.map((staff) => (
              <StaffCard key={staff.id} staff={staff} />
            ))
          )}
        </ScrollView>

      </View>

      <StaffDepartmentStaffPanel
        visible={departmentPanel != null}
        onClose={() => setDepartmentPanel(null)}
        departmentId={departmentPanel?.departmentId ?? null}
        departmentName={departmentPanel?.departmentName ?? ''}
        rowPosition={departmentPanel?.rowPosition ?? null}
        topOffset={insets.top + (STAFF_TABS.container.top + STAFF_TABS.container.height + 1) * scaleX}
      />

      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}
