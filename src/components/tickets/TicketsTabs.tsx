import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import {
  TICKETS_TABS,
  TICKETS_COLORS,
  TICKETS_TYPOGRAPHY,
  scaleX,
} from '../../constants/ticketsStyles';
import { TicketTab } from '../../types/tickets.types';

interface TicketsTabsProps {
  selectedTab: TicketTab;
  onTabPress: (tab: TicketTab) => void;
}

export default function TicketsTabs({ selectedTab, onTabPress }: TicketsTabsProps) {
  const tabs = [
    { id: 'myTickets' as TicketTab, label: 'My Tickets' },
    { id: 'all' as TicketTab, label: 'All' },
    { id: 'open' as TicketTab, label: 'Open' },
    { id: 'closed' as TicketTab, label: 'Closed' },
  ];

  const [textWidths, setTextWidths] = useState<Record<TicketTab, number>>({
    myTickets: 0,
    all: 0,
    open: 0,
    closed: 0,
  });

  // Calculate indicator position to center it under the selected tab text
  const getIndicatorPosition = () => {
    const selectedTabConfig = TICKETS_TABS.tabs[selectedTab];
    const myTicketsLeft = TICKETS_TABS.tabs.myTickets.left;
    
    // Tab position relative to container (after padding): selectedTabConfig.left - myTicketsLeft
    const tabLeftRelativeToContainer = (selectedTabConfig.left - myTicketsLeft) * scaleX;
    
    // Use measured text width if available, otherwise use Figma width
    const textWidth = textWidths[selectedTab] || (selectedTabConfig.width * scaleX);
    
    // Calculate text center relative to container
    const textCenter = tabLeftRelativeToContainer + (textWidth / 2);
    
    // Indicator width from Figma (may be wider than text for "My Tickets")
    const indicatorWidth = (selectedTabConfig.indicatorWidth || selectedTabConfig.width) * scaleX;
    
    // Center the indicator: indicator center = text center
    // So: indicator left = text center - (indicator width / 2)
    const indicatorLeft = textCenter - (indicatorWidth / 2);
    
    return { left: indicatorLeft, width: indicatorWidth };
  };

  const indicatorPos = getIndicatorPosition();

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        {tabs.map((tab) => {
          const tabConfig = TICKETS_TABS.tabs[tab.id];
          const myTicketsLeft = TICKETS_TABS.tabs.myTickets.left;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                {
                  position: 'absolute',
                  left: (tabConfig.left - myTicketsLeft) * scaleX,
                  top: 0,
                },
              ]}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.id && styles.tabTextActive,
                ]}
                onLayout={(event) => {
                  const { width } = event.nativeEvent.layout;
                  if (textWidths[tab.id] !== width) {
                    setTextWidths((prev) => ({
                      ...prev,
                      [tab.id]: width,
                    }));
                  }
                }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: TICKETS_TABS.container.top * scaleX,
    left: 0,
    right: 0,
    height: TICKETS_TABS.container.height * scaleX,
  },
  tabsWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    paddingHorizontal: TICKETS_TABS.tabs.myTickets.left * scaleX,
  },
  tab: {
    paddingTop: 0,
  },
  tabText: {
    fontSize: TICKETS_TYPOGRAPHY.tab.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: TICKETS_TYPOGRAPHY.tab.fontWeight as any,
    color: TICKETS_TYPOGRAPHY.tab.color,
  },
  tabTextActive: {
    fontWeight: TICKETS_TYPOGRAPHY.tab.activeFontWeight as any,
    color: TICKETS_TYPOGRAPHY.tab.activeColor,
  },
  indicator: {
    position: 'absolute',
    top: (TICKETS_TABS.indicator.top - TICKETS_TABS.container.top) * scaleX, // Relative to container top: 189 - 158 = 31px
    height: TICKETS_TABS.indicator.height * scaleX,
    backgroundColor: TICKETS_TABS.indicator.backgroundColor,
    borderRadius: TICKETS_TABS.indicator.borderRadius * scaleX,
  },
});

