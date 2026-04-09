import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Image,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography } from '../theme';
import BottomTabBar from '../components/navigation/BottomTabBar';
import { useAIChatOverlay } from '../contexts/AIChatOverlayContext';
import StaffHeader from '../components/staff/StaffHeader';
import StaffTabs from '../components/staff/StaffTabs';
import { STAFF_DEPARTMENTS_LIST } from '../components/staff/StaffDepartmentList';
import StaffListRow from '../components/staff/StaffListRow';
import { StaffTab, StaffMember } from '../types/staff.types';
import { STAFF_TABS } from '../constants/staffStyles';
import type { MainTabsParamList, ReturnToTab } from '../app/navigation/types';
import { mockStaffData } from '../data/mockStaffData';

const DESIGN_WIDTH = 440;

type StaffScreenNavigationProp = NativeStackNavigationProp<MainTabsParamList, 'Staff'>;

export default function StaffScreen() {
  const navigation = useNavigation<StaffScreenNavigationProp>();
  const route = useRoute();
  const { open: openAIChatOverlay } = useAIChatOverlay();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;
  
  const [activeTab, setActiveTab] = useState('Staff');
  const [selectedTab, setSelectedTab] = useState<StaffTab>('shifts');
  const [staffMembers] = useState<StaffMember[]>(mockStaffData);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDepartmentId, setActiveDepartmentId] = useState<'hsk' | 'engineering' | 'inRoomDining' | 'laundry' | 'concierge' | 'reception'>('hsk');
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);

  const toggleStaffExpand = (id: string) => {
    setExpandedStaffId((prev) => (prev === id ? null : id));
  };

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
  };

  const handleSearchPress = () => {
    setExpandedStaffId(null);
    setSearchExpanded(true);
  };
  const handleSearchClose = () => {
    setSearchExpanded(false);
    setSearchQuery('');
  };

  const filteredStaffForSearch = React.useMemo(() => {
    if (!searchQuery.trim()) return staffMembers;
    const q = searchQuery.trim().toLowerCase();
    return staffMembers.filter((s) => s.name.toLowerCase().includes(q));
  }, [staffMembers, searchQuery]);

  const filteredStaffForTab = React.useMemo(() => {
    if (selectedTab === 'am') return staffMembers.filter((s) => (s.shift ?? '').toUpperCase() === 'AM');
    if (selectedTab === 'pm') return staffMembers.filter((s) => (s.shift ?? '').toUpperCase() === 'PM');
    return staffMembers.filter((s) => s.onShift !== false);
  }, [selectedTab, staffMembers]);

  const filteredStaffForDepartment = React.useMemo(() => {
    if (activeDepartmentId === 'hsk') return filteredStaffForTab.filter((s) => (s.department ?? '').toUpperCase() === 'HSK');
    if (activeDepartmentId === 'engineering') return filteredStaffForTab.filter((s) => (s.department ?? '').toLowerCase().includes('engineering'));
    if (activeDepartmentId === 'inRoomDining') return filteredStaffForTab.filter((s) => (s.department ?? '').toLowerCase().includes('dining'));
    if (activeDepartmentId === 'laundry') return filteredStaffForTab.filter((s) => (s.department ?? '').toLowerCase().includes('laundry'));
    if (activeDepartmentId === 'concierge') return filteredStaffForTab.filter((s) => (s.department ?? '').toLowerCase().includes('concierge'));
    if (activeDepartmentId === 'reception') return filteredStaffForTab.filter((s) => (s.department ?? '').toLowerCase().includes('reception'));
    return filteredStaffForTab;
  }, [activeDepartmentId, filteredStaffForTab]);

  const sectionTitle = React.useMemo(() => {
    const map: Record<string, string> = {
      hsk: 'HSK',
      engineering: 'Engineering',
      inRoomDining: 'In Room Dining',
      laundry: 'Laundry',
      concierge: 'Concierge',
      reception: 'Reception',
    };
    return `${map[activeDepartmentId] ?? 'HSK'} Staff and Shifts`;
  }, [activeDepartmentId]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    content: {
      flex: 1,
    },
    staffList: {
      marginTop: (STAFF_TABS.container.top + STAFF_TABS.container.height + 1) * scaleX,
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
    deptScrollerWrap: {
      paddingTop: 16 * scaleX,
      paddingBottom: 12 * scaleX,
    },
    deptScroller: {
      paddingHorizontal: 12 * scaleX,
      gap: 14 * scaleX,
      alignItems: 'flex-start',
    },
    deptItem: {
      width: 92 * scaleX,
      alignItems: 'center',
    },
    deptIconWrap: {
      width: 55.482 * scaleX,
      height: 55.482 * scaleX,
      borderRadius: 37 * scaleX,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8 * scaleX,
    },
    deptIcon: {
      width: 28 * scaleX,
      height: 28 * scaleX,
    },
    deptLabel: {
      fontSize: 14 * scaleX,
      fontFamily: typography.fontFamily.secondary,
      fontWeight: typography.fontWeights.light as any,
      color: '#000000',
      textAlign: 'center',
    },
    sectionHeader: {
      paddingHorizontal: 21 * scaleX,
      paddingTop: 16 * scaleX,
      paddingBottom: 10 * scaleX,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      fontSize: 17 * scaleX,
      fontFamily: typography.fontFamily.secondary,
      fontWeight: typography.fontWeights.semibold as any,
      color: '#607aa1',
    },
    sectionCount: {
      fontSize: 16 * scaleX,
      fontFamily: typography.fontFamily.primary,
      fontWeight: typography.fontWeights.bold as any,
      color: '#5a759d',
    },
    listDivider: {
      height: 1,
      backgroundColor: '#e3e3e3',
      marginHorizontal: 0,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header - Absolutely positioned at top */}
        <StaffHeader
          onBackPress={handleBack}
          onAddPress={() => {
            // TODO: Wire to "add staff" / invite flow when available
          }}
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

        {/* Staff List, Departments, or Search results - Scrollable content starting after date */}
        <ScrollView
          style={styles.staffList}
          contentContainerStyle={styles.staffListContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {searchExpanded ? (
            <>
              {filteredStaffForSearch.length === 0 ? (
                <Text style={styles.searchEmptyText}>
                  {searchQuery.trim() ? 'No staff match your search' : 'Type to search staff'}
                </Text>
              ) : null}
              {filteredStaffForSearch.length > 0 ? (
                <View style={styles.searchSection}>
                  <Text style={styles.searchSectionTitle}>Staff</Text>
                  {filteredStaffForSearch.map((staff) => {
                    const dept = staff.department ?? 'HSK';
                    return (
                      <View key={staff.id}>
                        <StaffListRow
                          staffId={staff.id}
                          name={staff.name}
                          departmentLabel={dept}
                          avatar={staff.avatar}
                          initials={staff.initials}
                          isOnline={!!staff.onShift}
                          expanded={expandedStaffId === staff.id}
                          onToggleExpand={() => toggleStaffExpand(staff.id)}
                          scaleX={scaleX}
                        />
                        <View style={styles.listDivider} />
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </>
          ) : (
            <>
              <View style={styles.deptScrollerWrap}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.deptScroller}
                >
                  {[
                    {
                      id: 'hsk' as const,
                      name: 'HSK',
                      icon: require('../../assets/icons/in-progress-icon.png'),
                      bg: '#5a759d',
                      tint: '#ffffff',
                      noTint: false,
                    },
                    ...STAFF_DEPARTMENTS_LIST.filter((d) =>
                      ['engineering', 'inRoomDining', 'laundry', 'concierge', 'reception'].includes(d.id)
                    ).map((d) => ({
                      id: d.id as 'engineering' | 'inRoomDining' | 'laundry' | 'concierge' | 'reception',
                      name: d.name,
                      icon: d.icon,
                      bg: d.id === 'concierge' || d.id === 'reception' ? '#ffebeb' : '#e4eefe',
                      tint: d.id === 'inRoomDining' ? undefined : '#5a759d',
                      noTint: d.id === 'inRoomDining',
                    })),
                  ].map((dept) => (
                    <TouchableOpacity
                      key={dept.id}
                      style={styles.deptItem}
                      activeOpacity={0.7}
                      onPress={() => setActiveDepartmentId(dept.id)}
                    >
                      <View style={[styles.deptIconWrap, { backgroundColor: dept.bg }]}>
                        <Image
                          source={dept.icon}
                          style={[
                            styles.deptIcon,
                            dept.tint ? { tintColor: dept.tint } : null,
                          ]}
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.deptLabel} numberOfLines={2}>
                        {dept.name === 'HSK Portier' ? 'HSK' : dept.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{sectionTitle}</Text>
                <Text style={styles.sectionCount}>{filteredStaffForDepartment.length}</Text>
              </View>
              <View style={styles.listDivider} />

              {filteredStaffForDepartment.map((staff) => {
                const dept = staff.department ?? 'HSK';
                return (
                  <View key={staff.id}>
                    <StaffListRow
                      staffId={staff.id}
                      name={staff.name}
                      departmentLabel={dept}
                      avatar={staff.avatar}
                      initials={staff.initials}
                      isOnline={!!staff.onShift}
                      expanded={expandedStaffId === staff.id}
                      onToggleExpand={() => toggleStaffExpand(staff.id)}
                      scaleX={scaleX}
                    />
                    <View style={styles.listDivider} />
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>

      </View>

      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}
