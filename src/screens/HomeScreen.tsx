import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';
import { ShiftType } from '../types/home.types';
import { mockHomeData } from '../data/mockHomeData';
import HomeHeader from '../components/home/HomeHeader';
import CategoryCard from '../components/home/CategoryCard';
import BottomTabBar from '../components/navigation/BottomTabBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

type MainTabsParamList = {
  Home: undefined;
  Rooms: undefined;
  Chat: undefined;
  Tickets: undefined;
  More: undefined;
};

type HomeScreenNavigationProp = BottomTabNavigationProp<MainTabsParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [homeData, setHomeData] = useState(mockHomeData);
  const [activeTab, setActiveTab] = useState('Home');
  const [refreshing, setRefreshing] = useState(false);

  const handleShiftToggle = (shift: ShiftType) => {
    setHomeData(prev => ({ ...prev, selectedShift: shift }));
  };

  const handleSearch = (text: string) => {
    // TODO: Implement search logic
    console.log('Search:', text);
  };

  const handleMenuPress = () => {
    // TODO: Implement menu logic
    console.log('Menu pressed');
  };

  const handleBellPress = () => {
    // TODO: Implement notifications
    console.log('Bell pressed');
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    // Navigate to the respective screen
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch fresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {homeData.categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </ScrollView>

      {/* Header - Fixed at top */}
      <HomeHeader
        user={homeData.user}
        selectedShift={homeData.selectedShift}
        date={homeData.date}
        onShiftToggle={handleShiftToggle}
        onSearch={handleSearch}
        onMenuPress={handleMenuPress}
        onBellPress={handleBellPress}
      />

      {/* Bottom Navigation */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        chatBadgeCount={homeData.notifications.chat}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 334 * scaleX, // Header height (includes search bar)
    paddingBottom: 152 * scaleX + 20 * scaleX, // Bottom nav height + extra padding
  },
});

