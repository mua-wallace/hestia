import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
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
  const statusConfig = item.status === 'shipped'
    ? LOST_AND_FOUND_STATUS.shipped
    : LOST_AND_FOUND_STATUS.stored;

  // Determine if we should show "Stored by" or "Registered by"
  const registeredByLabel = item.status === 'stored' ? 'Stored by' : 'Registered by';

  const handleCopyId = async () => {
    try {
      await Clipboard.setStringAsync(item.itemId);
      Alert.alert('Copied', `Item ID "${item.itemId}" copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      Alert.alert('Error', 'Failed to copy item ID');
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Item Name and ID Container */}
      <View style={styles.itemNameIdContainer}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.itemName}
        </Text>
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
      </View>

      {/* Location */}
      <Text style={styles.location} numberOfLines={1}>
        {item.location}
      </Text>

      {/* Guest Name or Public Area with Badge */}
      <View style={styles.guestNameContainer}>
        {item.guestName && (
          <Text style={styles.guestName} numberOfLines={1}>
            {item.guestName}
          </Text>
        )}
        {item.publicArea && (
          <Text style={styles.guestName} numberOfLines={1}>
            {item.publicArea}
          </Text>
        )}
        {item.roomNumber && (
          <View style={styles.roomBadge}>
            <Text style={styles.roomBadgeText}>{item.roomNumber}</Text>
          </View>
        )}
      </View>

      {/* Stored Location Section */}
      <View style={styles.storedLocationIconContainer}>
        <Image
          source={require('../../../assets/icons/location-pin-icon.png')}
          style={styles.locationPinIcon}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.storedLocationLabel}>Stored Location</Text>
      <Text style={styles.storedLocationName} numberOfLines={1}>
        {item.storedLocation}
      </Text>

      {/* Item Image */}
      {item.image && (
        <Image
          source={item.image}
          style={styles.itemImage}
          resizeMode="cover"
        />
      )}

      {/* Horizontal Divider */}
      <View style={styles.divider} />

      {/* Registered/Stored By Label */}
      <Text style={styles.registeredByLabel}>{registeredByLabel}</Text>

      {/* Registered/Stored By Section */}
      {item.registeredBy.avatar ? (
        <Image
          source={item.registeredBy.avatar}
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
        {item.status === 'shipped' ? (
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
          {item.status === 'shipped' ? 'Shipped' : 'Stored'}
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
  },
  itemNameIdContainer: {
    position: 'absolute',
    left: LOST_AND_FOUND_CONTENT.itemName.left * scaleX,
    top: LOST_AND_FOUND_CONTENT.itemName.top * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  itemName: {
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.itemName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.itemName.fontWeight as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.itemName.color,
    marginRight: 8 * scaleX, // Space between item name and ID
  },
  itemIdContainer: {
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
  location: {
    position: 'absolute',
    left: LOST_AND_FOUND_CONTENT.location.left * scaleX,
    top: LOST_AND_FOUND_CONTENT.location.top * scaleX,
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.location.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.location.fontWeight as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.location.color,
    maxWidth: 200 * scaleX,
  },
  guestNameContainer: {
    position: 'absolute',
    left: LOST_AND_FOUND_CONTENT.guestName.left * scaleX,
    top: LOST_AND_FOUND_CONTENT.guestName.top * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  guestName: {
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.guestName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.guestName.fontWeight as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.guestName.color,
    marginRight: 8 * scaleX, // Space between guest name and badge
  },
  roomBadge: {
    width: LOST_AND_FOUND_CONTENT.roomBadge.width * scaleX,
    height: LOST_AND_FOUND_CONTENT.roomBadge.height * scaleX,
    borderRadius: LOST_AND_FOUND_CONTENT.roomBadge.borderRadius * scaleX,
    backgroundColor: LOST_AND_FOUND_CONTENT.roomBadge.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomBadgeText: {
    fontSize: LOST_AND_FOUND_CONTENT.roomBadgeText.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_CONTENT.roomBadgeText.fontWeight as any,
    color: LOST_AND_FOUND_CONTENT.roomBadgeText.color,
  },
  storedLocationIconContainer: {
    position: 'absolute',
    left: LOST_AND_FOUND_STORED_LOCATION.icon.left * scaleX,
    top: LOST_AND_FOUND_STORED_LOCATION.icon.top * scaleX,
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
  storedLocationLabel: {
    position: 'absolute',
    left: LOST_AND_FOUND_STORED_LOCATION.label.left * scaleX,
    top: LOST_AND_FOUND_STORED_LOCATION.label.top * scaleX,
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.storedLocationLabel.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.storedLocationLabel.fontWeight as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.storedLocationLabel.color,
  },
  storedLocationName: {
    position: 'absolute',
    left: LOST_AND_FOUND_STORED_LOCATION.name.left * scaleX,
    top: LOST_AND_FOUND_STORED_LOCATION.name.top * scaleX,
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.storedLocationName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.storedLocationName.fontWeight as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.storedLocationName.color,
    maxWidth: 150 * scaleX,
  },
  itemImage: {
    position: 'absolute',
    left: LOST_AND_FOUND_IMAGE.left * scaleX,
    top: LOST_AND_FOUND_IMAGE.top * scaleX,
    width: LOST_AND_FOUND_IMAGE.width * scaleX,
    height: LOST_AND_FOUND_IMAGE.height * scaleX,
    borderRadius: LOST_AND_FOUND_IMAGE.borderRadius * scaleX,
  },
  divider: {
    position: 'absolute',
    left: LOST_AND_FOUND_DIVIDER.left * scaleX,
    top: LOST_AND_FOUND_DIVIDER.top * scaleX,
    width: LOST_AND_FOUND_DIVIDER.width * scaleX,
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

