import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import BottomTabBar from '../components/navigation/BottomTabBar';
import MorePopup from '../components/more/MorePopup';
import LostAndFoundHeader from '../components/lostAndFound/LostAndFoundHeader';
import LostAndFoundTabs from '../components/lostAndFound/LostAndFoundTabs';
import LostAndFoundItemCard from '../components/lostAndFound/LostAndFoundItemCard';
import RegisterLostAndFoundModal from '../components/lostAndFound/RegisterLostAndFoundModal';
import ItemRegisteredSuccessModal from '../components/lostAndFound/ItemRegisteredSuccessModal';
import { mockHomeData } from '../data/mockHomeData';
import { mockLostAndFoundData } from '../data/mockLostAndFoundData';
import { MoreMenuItemId } from '../types/more.types';
import { LostAndFoundTab, LostAndFoundItem } from '../types/lostAndFound.types';
import {
  LOST_AND_FOUND_SPACING,
  LOST_AND_FOUND_COLORS,
  LOST_AND_FOUND_DIVIDER,
  scaleX,
} from '../constants/lostAndFoundStyles';

type MainTabsParamList = {
  Home: undefined;
  Rooms: undefined;
  Chat: undefined;
  Tickets: undefined;
  LostAndFound: undefined;
  Staff: undefined;
  Settings: undefined;
};

type LostAndFoundScreenNavigationProp = BottomTabNavigationProp<MainTabsParamList, 'LostAndFound'>;

export default function LostAndFoundScreen() {
  const navigation = useNavigation<LostAndFoundScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState('LostAndFound');
  const [showMorePopup, setShowMorePopup] = useState(false);
  const [selectedTab, setSelectedTab] = useState<LostAndFoundTab>('created');
  const [items] = useState<LostAndFoundItem[]>(mockLostAndFoundData);
  const [refreshing, setRefreshing] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{
    trackingNumber: string;
    itemImage?: string;
    itemData: any;
  } | null>(null);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    setShowMorePopup(false);
    if (tab === 'Home') {
      navigation.navigate('Home');
    } else if (tab === 'Rooms') {
      navigation.navigate('Rooms');
    } else if (tab === 'Chat') {
      navigation.navigate('Chat');
    } else if (tab === 'Tickets') {
      navigation.navigate('Tickets');
    }
  };

  const handleMorePress = () => {
    setShowMorePopup(true);
  };

  const handleMenuItemPress = (menuItem: MoreMenuItemId) => {
    setShowMorePopup(false);
    switch (menuItem) {
      case 'lostAndFound':
        navigation.navigate('LostAndFound');
        break;
      case 'staff':
        navigation.navigate('Staff');
        break;
      case 'settings':
        navigation.navigate('Settings');
        break;
      default:
        break;
    }
  };

  const handleClosePopup = () => {
    setShowMorePopup(false);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleRegisterPress = () => {
    setShowRegisterModal(true);
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
  };

  const handleRegisterNext = (data: {
    trackingNumber: string;
    itemImage?: string;
    itemData: any;
  }) => {
    setSuccessData(data);
    setShowRegisterModal(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
  };

  const handleTabChange = (tab: LostAndFoundTab) => {
    setSelectedTab(tab);
  };

  const handleItemPress = (item: LostAndFoundItem) => {
    // TODO: Navigate to item detail screen when implemented
    console.log('Item pressed:', item.id);
  };

  const handleStatusPress = (item: LostAndFoundItem) => {
    // TODO: Handle status change modal when implemented
    console.log('Status pressed for item:', item.id);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Filter items based on selected tab
  const filteredItems = items.filter((item) => {
    switch (selectedTab) {
      case 'created':
        return true; // Show all cards
      case 'stored':
        return item.status === 'stored';
      case 'returned':
        return item.status === 'shipped'; // Returned tab shows items with "shipped" status
      case 'discarded':
        return item.status === 'discarded';
      default:
        return false;
    }
  });

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <View style={styles.scrollContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!showMorePopup}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Item Cards */}
          {filteredItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <LostAndFoundItemCard
                item={item}
                onPress={() => handleItemPress(item)}
                onStatusPress={() => handleStatusPress(item)}
              />
              {/* Divider */}
              {index < filteredItems.length - 1 && (
                <View style={styles.divider} />
              )}
            </React.Fragment>
          ))}
        </ScrollView>

        {/* Blur Overlay for content only */}
        {showMorePopup && (
          <BlurView intensity={80} style={styles.contentBlurOverlay} tint="light">
            <View style={styles.blurOverlayDarkener} />
          </BlurView>
        )}
      </View>

      {/* Header - Fixed at top */}
      <LostAndFoundHeader
        onBackPress={handleBackPress}
        onRegisterPress={handleRegisterPress}
      />

      {/* Tabs - Fixed below header */}
      <LostAndFoundTabs selectedTab={selectedTab} onTabPress={handleTabChange} />

      {/* Bottom Navigation */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onMorePress={handleMorePress}
        chatBadgeCount={mockHomeData.notifications.chat}
      />

      {/* More Popup */}
      <MorePopup
        visible={showMorePopup}
        onClose={handleClosePopup}
        onMenuItemPress={handleMenuItemPress}
      />

      {/* Register Modal */}
      <RegisterLostAndFoundModal
        visible={showRegisterModal}
        onClose={handleCloseRegisterModal}
        onNext={handleRegisterNext}
      />

      {/* Success Modal */}
      <ItemRegisteredSuccessModal
        visible={showSuccessModal}
        onClose={handleCloseSuccessModal}
        trackingNumber={successData?.trackingNumber || ''}
        itemImage={successData?.itemImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LOST_AND_FOUND_COLORS.background,
  },
  scrollContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: LOST_AND_FOUND_SPACING.contentPaddingTop * scaleX,
    paddingBottom: LOST_AND_FOUND_SPACING.contentPaddingBottom * scaleX,
    minHeight: '100%',
  },
  divider: {
    height: LOST_AND_FOUND_DIVIDER.height,
    backgroundColor: LOST_AND_FOUND_DIVIDER.color,
    marginHorizontal: 16 * scaleX,
    marginVertical: 8 * scaleX,
  },
  contentBlurOverlay: {
    position: 'absolute',
    top: (133 + 39) * scaleX, // Start below header and tabs
    left: 0,
    right: 0,
    bottom: 152 * scaleX, // Stop above bottom nav
    zIndex: 1,
  },
  blurOverlayDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
  },
});
