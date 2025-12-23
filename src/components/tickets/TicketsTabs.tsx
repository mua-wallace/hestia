import React from 'react';
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

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabPress(tab.id)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === tab.id && styles.tabTextActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
      
      {/* Active Indicator */}
      <View
        style={[
          styles.indicator,
          {
            left: (TICKETS_TABS.tabs[selectedTab].left - TICKETS_TABS.tabs.myTickets.left) * scaleX,
            width: selectedTab === 'myTickets' 
              ? TICKETS_TABS.indicator.width * scaleX 
              : selectedTab === 'all'
              ? 18 * scaleX // "All" text width
              : selectedTab === 'open'
              ? 41 * scaleX // "Open" text width
              : 51 * scaleX, // "Closed" text width
          },
        ]}
      />
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: TICKETS_TABS.tabs.myTickets.left * scaleX,
  },
  tab: {
    marginRight: TICKETS_TABS.tab.spacing * scaleX,
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
  },
  indicator: {
    position: 'absolute',
    top: (TICKETS_TABS.indicator.top - TICKETS_TABS.container.top) * scaleX, // Relative to container top
    left: (TICKETS_TABS.indicator.left - TICKETS_TABS.tabs.myTickets.left) * scaleX, // Relative to container left
    height: TICKETS_TABS.indicator.height * scaleX,
    backgroundColor: TICKETS_TABS.indicator.backgroundColor,
    borderRadius: TICKETS_TABS.indicator.borderRadius * scaleX,
  },
});

