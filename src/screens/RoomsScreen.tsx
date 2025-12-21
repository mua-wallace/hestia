import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, typography } from '../theme';
import BottomTabBar from '../components/navigation/BottomTabBar';
import { mockHomeData } from '../data/mockHomeData';

type MainTabsParamList = {
  Home: undefined;
  Rooms: undefined;
  Chat: undefined;
  Tickets: undefined;
  More: undefined;
};

type RoomsScreenNavigationProp = BottomTabNavigationProp<MainTabsParamList, 'Rooms'>;

export default function RoomsScreen() {
  const navigation = useNavigation<RoomsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState('Rooms');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'Home') {
      navigation.navigate('Home');
    } else if (tab === 'Rooms') {
      navigation.navigate('Rooms');
    } else if (tab === 'Chat') {
      navigation.navigate('Chat');
    } else if (tab === 'Tickets') {
      navigation.navigate('Tickets');
    } else if (tab === 'More') {
      navigation.navigate('More');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rooms Screen</Text>
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        chatBadgeCount={mockHomeData.notifications.chat}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingBottom: 152, // Space for bottom tab bar
  },
  text: {
    fontSize: parseInt(typography.fontSizes['4xl']),
    color: colors.text.primary,
  },
});

