import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX } from '../../constants/lostAndFoundStyles';
import {
  LOST_AND_FOUND_TABS,
  LOST_AND_FOUND_COLORS,
  LOST_AND_FOUND_TYPOGRAPHY,
} from '../../constants/lostAndFoundStyles';
import type { LostAndFoundTab } from '../../types/lostAndFound.types';

interface LostAndFoundTabsProps {
  selectedTab: LostAndFoundTab;
  onTabPress: (tab: LostAndFoundTab) => void;
  onSearchPress?: () => void;
}

export default function LostAndFoundTabs({ selectedTab, onTabPress, onSearchPress }: LostAndFoundTabsProps) {
  const tabs = [
    { id: 'created' as LostAndFoundTab, label: 'Created' },
    { id: 'stored' as LostAndFoundTab, label: 'Stored' },
    { id: 'returned' as LostAndFoundTab, label: 'Returned' },
    { id: 'discarded' as LostAndFoundTab, label: 'Discarded' },
  ];

  // Calculate indicator position based on Figma design
  const getIndicatorPosition = () => {
    const selectedTabConfig = LOST_AND_FOUND_TABS.tabs[selectedTab];
    
    // Use exact left position from Figma design
    const indicatorLeft = selectedTabConfig.indicatorLeft * scaleX;
    const indicatorWidth = selectedTabConfig.indicatorWidth * scaleX;
    
    return { left: indicatorLeft, width: indicatorWidth };
  };

  const indicatorPos = getIndicatorPosition();

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        {tabs.map((tab) => {
          const tabConfig = LOST_AND_FOUND_TABS.tabs[tab.id];
          const isActive = selectedTab === tab.id;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                {
                  left: tabConfig.left * scaleX,
                },
              ]}
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

      {/* Search Icon */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={onSearchPress || (() => {})}
        activeOpacity={0.7}
      >
        <Image
          source={require('../../../assets/icons/search-icon.png')}
          style={styles.searchIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: LOST_AND_FOUND_TABS.container.top * scaleX,
    left: 0,
    right: 0,
    height: LOST_AND_FOUND_TABS.container.height * scaleX,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  tabsWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  tab: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  tabText: {
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.tab.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    color: LOST_AND_FOUND_COLORS.tabActive,
    lineHeight: LOST_AND_FOUND_TYPOGRAPHY.tab.fontSize * scaleX,
    includeFontPadding: false,
    textAlignVertical: 'top',
  },
  tabTextActive: {
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.tab.activeFontWeight as any,
    color: LOST_AND_FOUND_COLORS.tabActive,
  },
  tabTextInactive: {
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.tab.fontWeight as any,
    color: LOST_AND_FOUND_COLORS.tabInactive,
  },
  indicator: {
    position: 'absolute',
    top: (LOST_AND_FOUND_TABS.indicator.top - LOST_AND_FOUND_TABS.container.top) * scaleX,
    height: LOST_AND_FOUND_TABS.indicator.height * scaleX,
    backgroundColor: LOST_AND_FOUND_TABS.indicator.backgroundColor,
    borderRadius: LOST_AND_FOUND_TABS.indicator.borderRadius * scaleX,
  },
  searchButton: {
    position: 'absolute',
    right: LOST_AND_FOUND_TABS.searchIcon.right * scaleX,
    top: 0, // Aligned with tab text at top of container
    width: LOST_AND_FOUND_TABS.searchIcon.width * scaleX,
    height: LOST_AND_FOUND_TABS.searchIcon.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: LOST_AND_FOUND_TABS.searchIcon.width * scaleX,
    height: LOST_AND_FOUND_TABS.searchIcon.height * scaleX,
    tintColor: LOST_AND_FOUND_COLORS.tabActive,
  },
});

