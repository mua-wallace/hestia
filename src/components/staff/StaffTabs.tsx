import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, STAFF_TABS } from '../../constants/staffStyles';
import { StaffTab } from '../../types/staff.types';

interface StaffTabsProps {
  selectedTab: StaffTab;
  onTabPress: (tab: StaffTab) => void;
}

export default function StaffTabs({ selectedTab, onTabPress }: StaffTabsProps) {
  const tabs: { id: StaffTab; label: string }[] = [
    { id: 'onShift', label: 'On Shift' },
    { id: 'am', label: 'AM' },
    { id: 'pm', label: 'PM' },
    { id: 'departments', label: 'Departments' },
  ];

  const getIndicatorPosition = () => {
    const selectedTabConfig = STAFF_TABS.tabs[selectedTab];
    return {
      left: selectedTabConfig.indicatorLeft * scaleX,
      width: selectedTabConfig.indicatorWidth * scaleX,
    };
  };

  const indicatorPos = getIndicatorPosition();

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        {tabs.map((tab) => {
          const tabConfig = STAFF_TABS.tabs[tab.id];
          const isActive = selectedTab === tab.id;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, { left: tabConfig.left * scaleX }]}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive ? styles.tabTextActive : styles.tabTextInactive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        
        {/* Active Indicator */}
        <View
          style={[
            styles.indicator,
            {
              left: indicatorPos.left,
              width: indicatorPos.width,
            },
          ]}
        />
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: STAFF_TABS.container.top * scaleX,
    left: 0,
    right: 0,
    height: STAFF_TABS.container.height * scaleX,
    zIndex: 5,
  },
  tabsWrapper: {
    position: 'relative',
    height: STAFF_TABS.container.height * scaleX,
  },
  tab: {
    position: 'absolute',
    top: 0,
  },
  tabText: {
    fontSize: STAFF_TABS.tab.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: STAFF_TABS.tab.color,
  },
  tabTextActive: {
    fontWeight: typography.fontWeights.bold as any,
    color: STAFF_TABS.tab.color,
  },
  tabTextInactive: {
    color: STAFF_TABS.tab.inactiveColor,
  },
  indicator: {
    position: 'absolute',
    // Position at bottom of tabs container: container height (39) - indicator height (4) = 35px from container top
    // But Figma shows it at 192px from screen top, which is 192 - 158 = 34px from container top
    top: (STAFF_TABS.indicator.top - STAFF_TABS.container.top) * scaleX,
    height: STAFF_TABS.indicator.height * scaleX,
    backgroundColor: STAFF_TABS.indicator.backgroundColor,
    borderRadius: STAFF_TABS.indicator.borderRadius * scaleX,
  },
  divider: {
    position: 'absolute',
    top: STAFF_TABS.container.height * scaleX, // Position at bottom of container
    left: 0,
    right: 0,
    height: STAFF_TABS.divider.height * scaleX,
    backgroundColor: STAFF_TABS.divider.color,
  },
});


