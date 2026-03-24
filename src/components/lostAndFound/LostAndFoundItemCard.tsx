import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useToast } from '../../contexts/ToastContext';
import { typography } from '../../theme';
import {
  LOST_AND_FOUND_CARD,
  LOST_AND_FOUND_CONTENT,
  LOST_AND_FOUND_STORED_LOCATION,
  LOST_AND_FOUND_REGISTERED_BY,
  LOST_AND_FOUND_IMAGE,
  LOST_AND_FOUND_STATUS,
  LOST_AND_FOUND_DIVIDER,
  LOST_AND_FOUND_COLORS,
  LOST_AND_FOUND_TYPOGRAPHY,
  scaleX,
} from '../../constants/lostAndFoundStyles';
import { LostAndFoundItem } from '../../types/lostAndFound.types';

interface LostAndFoundItemCardProps {
  item: LostAndFoundItem;
  onPress?: () => void;
  onStatusPress?: () => void;
}

export default function LostAndFoundItemCard({ item, onPress, onStatusPress }: LostAndFoundItemCardProps) {
  const toast = useToast();
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const imagePulse = useRef(new Animated.Value(0.35)).current;
  const isPublicAreaItem =
    item.publicArea != null ||
    (typeof item.location === 'string' && !item.location.toLowerCase().startsWith('room'));
  const statusConfig =
    item.status === 'shipped' || item.status === 'returned'
      ? LOST_AND_FOUND_STATUS.shipped
      : item.status === 'discarded'
        ? LOST_AND_FOUND_STATUS.discarded
        : LOST_AND_FOUND_STATUS.stored;

  // Always show "Stored by" and the person who stored the item
  const registeredByLabel = 'Stored by';

  useEffect(() => {
    setIsImageLoading(false);
    imagePulse.setValue(0.35);
  }, [item.image, imagePulse]);

  useEffect(() => {
    if (!isImageLoading) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(imagePulse, {
          toValue: 0.8,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(imagePulse, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [isImageLoading, imagePulse]);

  const handleCopyId = async () => {
    try {
      await Clipboard.setStringAsync(item.itemId);
      toast.show(`Item ID "${item.itemId}" copied to clipboard`, { type: 'success', title: 'Copied' });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.show('Failed to copy item ID', { type: 'error', title: 'Error' });
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Item Title (can wrap) */}
      <Text style={styles.itemName} numberOfLines={2}>
        {item.itemName}
      </Text>

      {/* Tracking Number + copy icon (fixed position, as in Figma) */}
      <View style={styles.itemIdContainer}>
        <Text style={styles.itemId} numberOfLines={1}>
          {item.itemId}
        </Text>
        <TouchableOpacity
          style={styles.copyIconButton}
          onPress={handleCopyId}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/icons/clip-board.png')}
            style={styles.copyIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Found In */}
      <Text style={styles.foundInLabel}>Found in</Text>
      <View style={styles.foundInCard}>
        <View style={styles.foundInCardContent}>
          {/* Left: primary location text (Room / Public Area location name) */}
          <View style={styles.foundInLocationSection}>
            <Text style={styles.foundInLocationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>

          {/* Right: room guest details (room items) or public-area chip */}
          {!isPublicAreaItem && (item.guestName || item.guestDates || item.guestImage) ? (
            <>
              <View style={styles.foundInGuestSection}>
                {/* Guest thumbnail */}
                {item.guestImage && (
                  <View style={styles.foundInImageThumbContainer}>
                    <Image source={item.guestImage} style={styles.foundInImageThumb} resizeMode="cover" />
                  </View>
                )}

                <View style={styles.foundInGuestTextContainer}>
                  {item.guestName && (
                    <Text style={styles.foundInGuestName} numberOfLines={1} ellipsizeMode="tail">
                      {item.guestName}
                    </Text>
                  )}
                  {!!item.guestDates && (
                    <Text style={styles.foundInGuestDates} numberOfLines={1} ellipsizeMode="tail">
                      {item.guestDates}
                    </Text>
                  )}
                </View>
              </View>
            </>
          ) : isPublicAreaItem ? (
            <View style={styles.publicAreaTag}>
              <Text style={styles.publicAreaTagText}>
                {item.publicArea ?? 'Public Area'}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Stored Location Section */}
      <View style={styles.storedLocationContainer}>
        <View style={styles.storedLocationIconContainer}>
          <Image
            source={require('../../../assets/icons/location-pin-icon.png')}
            style={styles.locationPinIcon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.storedLocationTextContainer}>
          <Text style={styles.storedLocationLabel}>Stored Location</Text>
          <Text style={styles.storedLocationName} numberOfLines={1}>
            {item.storedLocation}
          </Text>
        </View>
      </View>

      {/* Item Image */}
      {item.image && (
        <View style={styles.itemImageContainer}>
          {isImageLoading && (
            <Animated.View
              pointerEvents="none"
              style={[styles.imageLoadingPlaceholder, { opacity: imagePulse }]}
            />
          )}
          <Image
            source={item.image}
            style={[styles.itemImage, isImageLoading && styles.itemImageHidden]}
            resizeMode="cover"
            onLoadStart={() => setIsImageLoading(true)}
            onLoad={() => setIsImageLoading(false)}
            onLoadEnd={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
        </View>
      )}

      {/* Horizontal Divider */}
      <View style={styles.divider} />

      {/* Registered/Stored By Label */}
      <Text style={styles.registeredByLabel}>{registeredByLabel}</Text>

      {/* Registered/Stored By Section */}
      {item.registeredBy.avatar ? (
        <Image
          source={
            typeof item.registeredBy.avatar === 'string'
              ? { uri: item.registeredBy.avatar }
              : item.registeredBy.avatar
          }
          style={styles.avatar}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitial}>
            {item.registeredBy.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text style={styles.staffName} numberOfLines={1}>
        {item.registeredBy.name}
      </Text>
      <Text style={styles.timestamp} numberOfLines={1}>
        {item.registeredBy.timestamp}
      </Text>

      {/* Status Button */}
      <TouchableOpacity
        style={[
          styles.statusButton,
          {
            backgroundColor: statusConfig.backgroundColor,
            width: statusConfig.width * scaleX,
            left: statusConfig.left * scaleX,
            top: statusConfig.top * scaleX,
          },
        ]}
        onPress={onStatusPress}
        activeOpacity={0.7}
      >
        {/* Status Icon */}
        {(item.status === 'shipped' || item.status === 'returned') ? (
          <Image
            source={require('../../../assets/icons/tick.png')}
            style={[
              styles.statusIcon,
              {
                position: 'absolute',
                left: (statusConfig.iconLeft - statusConfig.left) * scaleX,
                top: (statusConfig.iconTop - statusConfig.top) * scaleX,
                width: statusConfig.iconWidth * scaleX,
                height: statusConfig.iconHeight * scaleX,
                tintColor: '#ffffff',
              },
            ]}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require('../../../assets/icons/down-arrow.png')}
            style={[
              styles.statusIcon,
              {
                position: 'absolute',
                left: (statusConfig.iconLeft - statusConfig.left) * scaleX,
                top: (statusConfig.iconTop - statusConfig.top) * scaleX,
                width: statusConfig.iconWidth * scaleX,
                height: statusConfig.iconHeight * scaleX,
                tintColor: '#ffffff',
              },
            ]}
            resizeMode="contain"
          />
        )}
        <Text
          style={[
            styles.statusText,
            {
              color: statusConfig.textColor,
              position: 'absolute',
              left: (statusConfig.textLeft - statusConfig.left) * scaleX,
              top: (statusConfig.textTop - statusConfig.top) * scaleX,
            },
          ]}
        >
          {item.status === 'shipped' || item.status === 'returned'
            ? 'Returned'
            : item.status === 'discarded'
              ? 'Discarded'
              : 'Stored'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: LOST_AND_FOUND_CARD.width * scaleX,
    height: LOST_AND_FOUND_CARD.height * scaleX,
    backgroundColor: LOST_AND_FOUND_CARD.backgroundColor,
    borderWidth: LOST_AND_FOUND_CARD.borderWidth,
    borderColor: LOST_AND_FOUND_CARD.borderColor,
    borderRadius: LOST_AND_FOUND_CARD.borderRadius * scaleX,
    marginHorizontal: LOST_AND_FOUND_CARD.marginHorizontal * scaleX,
    marginBottom: LOST_AND_FOUND_CARD.marginBottom * scaleX,
    position: 'relative',
    overflow: 'hidden',
  },
  itemName: {
    position: 'absolute',
    left: LOST_AND_FOUND_CONTENT.itemName.left * scaleX,
    top: LOST_AND_FOUND_CONTENT.itemName.top * scaleX,
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.itemName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.itemName.fontWeight as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.itemName.color,
    maxWidth:
      (LOST_AND_FOUND_CONTENT.itemId.left -
        LOST_AND_FOUND_CONTENT.itemName.left -
        8) *
      scaleX,
  },
  itemIdContainer: {
    position: 'absolute',
    left: LOST_AND_FOUND_CONTENT.itemId.left * scaleX,
    top: LOST_AND_FOUND_CONTENT.itemId.top * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemId: {
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.itemId.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.itemId.fontWeight as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.itemId.color,
    marginRight: 4 * scaleX, // Space between ID and copy icon
  },
  copyIconButton: {
    width: LOST_AND_FOUND_CONTENT.copyIcon.width * scaleX,
    height: LOST_AND_FOUND_CONTENT.copyIcon.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyIcon: {
    width: LOST_AND_FOUND_CONTENT.copyIcon.width * scaleX,
    height: LOST_AND_FOUND_CONTENT.copyIcon.height * scaleX,
    tintColor: LOST_AND_FOUND_COLORS.textPrimary,
    opacity: 0.6,
  },
  foundInLabel: {
    position: 'absolute',
    left: LOST_AND_FOUND_CONTENT.location.left * scaleX,
    top: LOST_AND_FOUND_CONTENT.location.top * scaleX,
    fontSize: LOST_AND_FOUND_CONTENT.location.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '300' as any,
    color: LOST_AND_FOUND_CONTENT.location.color,
  },
  foundInCard: {
    position: 'absolute',
    left: LOST_AND_FOUND_CONTENT.guestName.left * scaleX,
    top: LOST_AND_FOUND_CONTENT.guestName.top * scaleX,
    width: (LOST_AND_FOUND_IMAGE.left - LOST_AND_FOUND_CONTENT.guestName.left - 10) * scaleX,
    borderRadius: 6 * scaleX,
    backgroundColor: 'rgba(100,131,176,0.07)',
    paddingHorizontal: 12 * scaleX,
    paddingVertical: 8 * scaleX,
    overflow: 'hidden',
  },
  foundInCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 42 * scaleX,
  },
  foundInLocationSection: {
    minWidth: 82 * scaleX,
    maxWidth: 96 * scaleX,
  },
  foundInLocationText: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '300' as any,
    color: LOST_AND_FOUND_COLORS.tabActive,
  },
  foundInGuestSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    paddingRight: 0,
    minHeight: 30 * scaleX,
    marginLeft: 8 * scaleX,
  },
  foundInImageThumbContainer: {
    width: 30 * scaleX,
    height: 30 * scaleX,
    borderRadius: 4 * scaleX,
    overflow: 'hidden',
    marginRight: 6 * scaleX,
    backgroundColor: '#e5e7eb',
  },
  foundInImageThumb: {
    width: '100%',
    height: '100%',
  },
  foundInGuestTextContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: 0,
    justifyContent: 'center',
    paddingLeft: 0,
  },
  foundInGuestName: {
    fontSize: 14 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '700' as any,
    color: '#000000',
    marginRight: 4 * scaleX,
    marginBottom: 1 * scaleX,
    flexShrink: 1,
    minWidth: 0,
    width: 90 * scaleX,
    lineHeight: 14 * scaleX,
    includeFontPadding: false,
  },
  foundInGuestDates: {
    fontSize: 11 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '300' as any,
    color: '#000000',
    flexShrink: 1,
    minWidth: 0,
  },
  publicAreaTag: {
    marginLeft: 12 * scaleX,
    backgroundColor: 'rgba(59,193,246,0.25)',
    borderRadius: 7 * scaleX,
    paddingHorizontal: 12 * scaleX,
    paddingVertical: 8 * scaleX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publicAreaTagText: {
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '300' as any,
    color: '#000000',
  },
  storedLocationContainer: {
    position: 'absolute',
    left: LOST_AND_FOUND_STORED_LOCATION.icon.left * scaleX,
    // Keep a safe lane below "Found in" content to prevent overlap.
    top: (LOST_AND_FOUND_STORED_LOCATION.icon.top + 19) * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 240 * scaleX,
  },
  storedLocationIconContainer: {
    width: LOST_AND_FOUND_STORED_LOCATION.icon.size * scaleX,
    height: LOST_AND_FOUND_STORED_LOCATION.icon.size * scaleX,
    borderRadius: (LOST_AND_FOUND_STORED_LOCATION.icon.size / 2) * scaleX,
    backgroundColor: LOST_AND_FOUND_STORED_LOCATION.icon.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationPinIcon: {
    width: LOST_AND_FOUND_STORED_LOCATION.pinIcon.width * scaleX,
    height: LOST_AND_FOUND_STORED_LOCATION.pinIcon.height * scaleX,
    tintColor: '#ffffff',
  },
  storedLocationTextContainer: {
    marginLeft: 8 * scaleX,
    flex: 1,
    minWidth: 0,
  },
  storedLocationLabel: {
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.storedLocationLabel.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '300' as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.storedLocationLabel.color,
  },
  storedLocationName: {
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.storedLocationName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.storedLocationName.fontWeight as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.storedLocationName.color,
    maxWidth: 200 * scaleX,
  },
  itemImageContainer: {
    position: 'absolute',
    left: (LOST_AND_FOUND_IMAGE.left + 8) * scaleX,
    top: LOST_AND_FOUND_IMAGE.top * scaleX,
    width: (LOST_AND_FOUND_IMAGE.width - 8) * scaleX,
    height: LOST_AND_FOUND_IMAGE.height * scaleX,
    borderRadius: LOST_AND_FOUND_IMAGE.borderRadius * scaleX,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  imageLoadingPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#cbd5e1',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: LOST_AND_FOUND_IMAGE.borderRadius * scaleX,
  },
  itemImageHidden: {
    opacity: 0,
  },
  divider: {
    position: 'absolute',
    left: LOST_AND_FOUND_DIVIDER.left * scaleX,
    top: LOST_AND_FOUND_DIVIDER.top * scaleX,
    width: (LOST_AND_FOUND_CARD.width - 2 * LOST_AND_FOUND_DIVIDER.left) * scaleX,
    height: LOST_AND_FOUND_DIVIDER.height,
    backgroundColor: LOST_AND_FOUND_DIVIDER.color,
  },
  registeredByLabel: {
    position: 'absolute',
    left: LOST_AND_FOUND_REGISTERED_BY.label.left * scaleX,
    top: LOST_AND_FOUND_REGISTERED_BY.label.top * scaleX,
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.registeredByLabel.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.registeredByLabel.fontWeight as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.registeredByLabel.color,
  },
  avatar: {
    position: 'absolute',
    left: LOST_AND_FOUND_REGISTERED_BY.avatar.left * scaleX,
    top: LOST_AND_FOUND_REGISTERED_BY.avatar.top * scaleX,
    width: LOST_AND_FOUND_REGISTERED_BY.avatar.size * scaleX,
    height: LOST_AND_FOUND_REGISTERED_BY.avatar.size * scaleX,
    borderRadius: (LOST_AND_FOUND_REGISTERED_BY.avatar.size / 2) * scaleX,
  },
  avatarPlaceholder: {
    position: 'absolute',
    left: LOST_AND_FOUND_REGISTERED_BY.avatar.left * scaleX,
    top: LOST_AND_FOUND_REGISTERED_BY.avatar.top * scaleX,
    width: LOST_AND_FOUND_REGISTERED_BY.avatar.size * scaleX,
    height: LOST_AND_FOUND_REGISTERED_BY.avatar.size * scaleX,
    borderRadius: (LOST_AND_FOUND_REGISTERED_BY.avatar.size / 2) * scaleX,
    backgroundColor: LOST_AND_FOUND_COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 12 * scaleX,
    fontWeight: 'bold' as any,
    color: LOST_AND_FOUND_COLORS.textSecondary,
  },
  staffName: {
    position: 'absolute',
    left: LOST_AND_FOUND_REGISTERED_BY.name.left * scaleX,
    top: LOST_AND_FOUND_REGISTERED_BY.name.top * scaleX,
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.staffName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.staffName.fontWeight as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.staffName.color,
    maxWidth: 150 * scaleX,
  },
  timestamp: {
    position: 'absolute',
    left: LOST_AND_FOUND_REGISTERED_BY.timestamp.left * scaleX,
    top: LOST_AND_FOUND_REGISTERED_BY.timestamp.top * scaleX,
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.timestamp.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.timestamp.fontWeight as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.timestamp.color,
    maxWidth: 150 * scaleX,
  },
  statusButton: {
    position: 'absolute',
    height: LOST_AND_FOUND_STATUS.button.height * scaleX,
    borderRadius: LOST_AND_FOUND_STATUS.button.borderRadius * scaleX,
  },
  statusIcon: {
    // Icon styles are set inline
  },
  statusText: {
    fontSize: LOST_AND_FOUND_STATUS.text.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_STATUS.text.fontWeight as any,
    lineHeight: LOST_AND_FOUND_STATUS.text.lineHeight * scaleX,
    includeFontPadding: false,
  },
});

