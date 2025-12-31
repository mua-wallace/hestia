import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, DETAIL_TABS } from '../../constants/roomDetailStyles';
import type { DetailTab } from '../../types/roomDetail.types';

interface DetailTabNavigationProps {
  activeTab: DetailTab;
  onTabPress: (tab: DetailTab) => void;
}

export default function DetailTabNavigation({
  activeTab,
  onTabPress,
}: DetailTabNavigationProps) {
  const tabs: DetailTab[] = ['Overview', 'Tickets', 'Checklist', 'History'];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        let left: number;
        switch (tab) {
          case 'Overview':
            left = DETAIL_TABS.overview.left;
            break;
          case 'Tickets':
            left = DETAIL_TABS.tickets.left;
            break;
          case 'Checklist':
            left = DETAIL_TABS.checklist.left;
            break;
          case 'History':
            left = DETAIL_TABS.history.left;
            break;
        }

        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, { left: left * scaleX }]}
            onPress={() => onTabPress(tab)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                isActive && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* Active Tab Underline - Only show for Overview tab for now */}
      {activeTab === 'Overview' && (
        <View
          style={[
            styles.underline,
            {
              left: DETAIL_TABS.underline.left * scaleX,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: DETAIL_TABS.container.top * scaleX, // 252px from top
    left: 0,
    right: 0,
    height: DETAIL_TABS.container.height * scaleX,
    zIndex: 10, // Above background
  },
  tab: {
    position: 'absolute',
    top: 0, // Tabs are at top of container (container is already at 252px)
  },
  tabText: {
    fontSize: DETAIL_TABS.tabs.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: DETAIL_TABS.tabs.color,
  },
  activeTabText: {
    fontWeight: typography.fontWeights.bold as any,
  },
  underline: {
    position: 'absolute',
    top: (DETAIL_TABS.underline.top - DETAIL_TABS.container.top) * scaleX, // 281 - 252 = 29px relative to container
    height: DETAIL_TABS.underline.height * scaleX,
    width: DETAIL_TABS.underline.width * scaleX,
    backgroundColor: DETAIL_TABS.underline.backgroundColor,
  },
});

