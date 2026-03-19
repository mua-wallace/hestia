import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import BottomTabBar from '../components/navigation/BottomTabBar';
import LostAndFoundHeader from '../components/lostAndFound/LostAndFoundHeader';
import LostAndFoundTabs from '../components/lostAndFound/LostAndFoundTabs';
import LostAndFoundItemCard from '../components/lostAndFound/LostAndFoundItemCard';
import RegisterLostAndFoundModal from '../components/lostAndFound/RegisterLostAndFoundModal';
import ItemRegisteredSuccessModal from '../components/lostAndFound/ItemRegisteredSuccessModal';
import { useAIChatOverlay } from '../contexts/AIChatOverlayContext';
import { useChatStore } from '../store/useChatStore';
import { LostAndFoundTab, LostAndFoundItem } from '../types/lostAndFound.types';
import {
  LOST_AND_FOUND_SPACING,
  LOST_AND_FOUND_COLORS,
  LOST_AND_FOUND_DIVIDER,
  scaleX,
} from '../constants/lostAndFoundStyles';
import type { ReturnToTab } from '../navigation/types';
import { LoadingOverlay } from '../components/shared/LoadingOverlay';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  const route = useRoute();
  const { open: openAIChatOverlay } = useAIChatOverlay();
  const params = route.params as { openRegisterModal?: boolean } | undefined;
  const [activeTab, setActiveTab] = useState('LostAndFound');
  const [selectedTab, setSelectedTab] = useState<LostAndFoundTab>('created');
  const [items, setItems] = useState<LostAndFoundItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{
    trackingNumber: string;
    itemImage?: string;
    itemData: any;
  } | null>(null);

  // Load items from Supabase lost_and_found_items table
  const loadItems = React.useCallback(async () => {
    if (!isSupabaseConfigured) {
      setItems([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('lost_and_found_items')
        .select('id, item_name, description, status, storage_location, room_id, found_location, tracking_number, image_url')
        .order('found_at', { ascending: false });
      if (error || !data) {
        console.warn('[LostAndFoundScreen] Failed to load items', error);
        setItems([]);
        return;
      }
      const mapped: LostAndFoundItem[] = (data as any[]).map((row) => ({
        id: row.id,
        itemName: row.item_name,
        // Use tracking_number (e.g. FH31390); fall back to id if missing
        itemId: row.tracking_number ?? row.id,
        location: row.found_location ?? 'Room',
        storedLocation: row.storage_location ?? '',
        registeredBy: {
          name: 'Staff',
          avatar: undefined,
          timestamp: '',
        },
        // Use Supabase image_url (first uploaded image) if present
        image: row.image_url ? { uri: row.image_url } : undefined,
        status: (row.status as LostAndFoundItem['status']) ?? 'stored',
        createdAt: '',
      }));
      setItems(mapped);
    } catch (e) {
      console.warn('[LostAndFoundScreen] Unexpected error loading items', e);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Open register modal if param is set
  useEffect(() => {
    if (params?.openRegisterModal) {
      setShowRegisterModal(true);
      // Clear the param to prevent reopening on subsequent renders
      navigation.setParams({ openRegisterModal: false } as any);
    }
  }, [params?.openRegisterModal, navigation]);

  // Sync activeTab with current route
  useFocusEffect(
    React.useCallback(() => {
      const routeName = route.name as string;
      if (routeName === 'Home' || routeName === 'Rooms' || routeName === 'Chat' || routeName === 'Tickets') {
        setActiveTab(routeName);
      }
      // Reload Lost & Found items when screen gains focus
      loadItems();
    }, [route.name, loadItems])
  );

  // Calculate total unread chat messages for badge
  const { chats } = useChatStore();
  const chatBadgeCount = React.useMemo(
    () => chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0),
    [chats]
  );

  const handleTabPress = (tab: string) => {
    if (tab === 'AIHome') {
      openAIChatOverlay();
      return;
    }
    setActiveTab(tab); // Update immediately
    const returnToTab = (route.name as string) as 'Home' | 'Rooms' | 'Chat' | 'Tickets' | 'LostAndFound' | 'Staff' | 'Settings';
    if (tab === 'Home') {
      navigation.navigate('Home' as any);
    } else if (tab === 'Rooms') {
      navigation.navigate('Rooms' as any);
    } else if (tab === 'Chat') {
      navigation.navigate('Chat' as any);
    } else if (tab === 'Tickets') {
      navigation.navigate('Tickets' as any);
    } else if (tab === 'LostAndFound') {
      (navigation as any).navigate('LostAndFound', { returnToTab });
    } else if (tab === 'Staff') {
      (navigation as any).navigate('Staff', { returnToTab });
    } else if (tab === 'Settings') {
      (navigation as any).navigate('Settings', { returnToTab });
    }
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      const returnToTab = (route.params as { returnToTab?: ReturnToTab } | undefined)?.returnToTab ?? 'Home';
      navigation.navigate(returnToTab as keyof MainTabsParamList);
    }
  };

  const handleRegisterPress = () => {
    setShowRegisterModal(true);
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
  };

  const handleRegisterNext = async (data: {
    trackingNumber?: string;
    itemImage?: string;
    itemData: any;
  }) => {
    let trackingNumberFromDb: string = data.trackingNumber ?? '';
    const firstImageUri: string | undefined = data.itemImage;

    // Close the register modal first; then show success.
    // iOS can drop a second Modal if it’s shown while another Modal is dismissing.
    setSuccessData({
      trackingNumber: trackingNumberFromDb,
      itemImage: data.itemImage,
      itemData: data.itemData,
    });
    setShowRegisterModal(false);
    setTimeout(() => setShowSuccessModal(true), 250);

    try {
      if (isSupabaseConfigured) {
        const itemData = data.itemData ?? {};
        const title: string = itemData.title ?? '';
        const notes: string = itemData.notes ?? '';
        const status: string = itemData.status ?? 'stored';
        const storedLocation: string | null = itemData.storedLocation ?? null;
        const selectedLocation: 'room' | 'publicArea' = itemData.selectedLocation ?? 'room';
        const selectedRoom = itemData.selectedRoom as { number?: string } | undefined;
        const selectedPublicArea = itemData.selectedPublicArea as string | null | undefined;
        const selectedDate: Date = itemData.selectedDate ?? new Date();
        const selectedHour: number = itemData.selectedHour ?? selectedDate.getHours();
        const selectedMinute: number = itemData.selectedMinute ?? selectedDate.getMinutes();

        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id ?? null;

        // Build found_at timestamp
        const foundAt = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          selectedHour,
          selectedMinute,
          0,
          0
        ).toISOString();

        const foundLocation =
          selectedLocation === 'room' && selectedRoom?.number
            ? `Room ${selectedRoom.number}`
            : selectedPublicArea
              ? selectedPublicArea
              : 'Public Area';

        // Use Title when provided; fallback to deriving from notes
        const itemName =
          title.trim() ||
          (notes || '')
            .split(/[.!]/)[0]
            .trim()
            .split(' ')
            .slice(0, 4)
            .join(' ') ||
          'Lost item';

        // Upload first image to Supabase storage (lost-and-found bucket), if present.
        // Fallback: if upload/storage fails, still use the local URI so the card shows an image.
        let imageUrl: string | null = null;
        if (firstImageUri) {
          try {
            const response = await fetch(firstImageUri);
            const blob = await response.blob();
            const extMatch = firstImageUri.split('.').pop();
            const fileExt = (extMatch || 'jpg').split('?')[0];
            const fileName = `items/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('lost-and-found')
              .upload(fileName, blob, {
                contentType: blob.type || 'image/jpeg',
                upsert: false,
              });

            if (!uploadError && uploadData?.path) {
              const { data: publicUrlData } = supabase.storage
                .from('lost-and-found')
                .getPublicUrl(uploadData.path);
              imageUrl = publicUrlData.publicUrl ?? null;
            } else if (uploadError) {
              console.warn('[LostAndFoundScreen] Failed to upload lost-and-found image', uploadError);
              // Fallback to local URI so UI still shows the image on the card
              imageUrl = firstImageUri;
            }
          } catch (uploadException) {
            console.warn('[LostAndFoundScreen] Unexpected error uploading image', uploadException);
            // Fallback to local URI so UI still shows the image on the card
            imageUrl = firstImageUri;
          }
        }

        if (userId) {
          const { data: inserted, error } = await supabase
            .from('lost_and_found_items')
            .insert({
              item_name: itemName,
              description: notes.trim() || null,
              status,
              storage_location: storedLocation,
              found_at: foundAt,
              found_by_id: userId,
              found_location: foundLocation,
              image_url: imageUrl,
            })
            .select('id, tracking_number, image_url')
            .single();
          if (!error && inserted?.tracking_number) {
            trackingNumberFromDb = inserted.tracking_number;
          }
          await loadItems();
          // Ensure the newly created item shows image and (for rooms) guest name on the Created tab
          if (inserted?.id) {
            const finalImageUri =
              inserted.image_url ?? imageUrl ?? (firstImageUri || undefined);
            const guestNameForCard =
              selectedLocation === 'room' && (selectedRoom as any)?.guestName
                ? `Mr ${(selectedRoom as any).guestName}`
                : undefined;

            setItems((prev) =>
              prev.map((item) =>
                item.id === inserted.id
                  ? {
                      ...item,
                      image: finalImageUri ? { uri: finalImageUri } : item.image,
                      guestName: guestNameForCard ?? item.guestName,
                    }
                  : item
              )
            );
          }
        } else {
          console.warn('[LostAndFoundScreen] No authenticated user – lost & found item not persisted.');
        }
      }
    } catch (e) {
      console.warn('[LostAndFoundScreen] Failed to persist lost & found item', e);
    }

    // Update the success screen with the final tracking number, if we got one.
    setSuccessData((prev) => ({
      ...(prev ?? { itemData: data.itemData, itemImage: data.itemImage, trackingNumber: '' }),
      trackingNumber: trackingNumberFromDb,
    }));
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
    loadItems().finally(() => setRefreshing(false));
  }, [loadItems]);

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
      {refreshing && <LoadingOverlay fullScreen message="Refreshing…" />}
      <View style={styles.scrollContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
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
        chatBadgeCount={chatBadgeCount}
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
