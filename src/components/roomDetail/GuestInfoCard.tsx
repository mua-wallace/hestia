import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { GUEST_INFO as ROOM_DETAIL_GUEST_INFO } from '../../constants/roomDetailStyles';
import { GUEST_INFO } from '../../constants/allRoomsStyles';
import { normalizedScaleX } from '../../utils/responsive';
import { formatGuestCount, formatDatesOfStay } from '../../utils/formatting';
import GuestInfoDisplay from '../shared/GuestInfoDisplay';
import GuestProfileImageModal, { type GuestImageAnchorLayout } from '../shared/GuestProfileImageModal';
import type { GuestInfo } from '../../types/allRooms.types';

interface GuestInfoCardProps {
  guest: GuestInfo;
  isArrival: boolean;
  numberBadge?: string;
  specialInstructions?: string;
  absoluteTop: number; // Absolute position from top of screen
  contentAreaTop: number; // Content area start position
  isSecondGuest?: boolean; // Whether this is the second guest (for smaller badge size)
  specialInstructionsTitleTop?: number; // Absolute position for special instructions title
  specialInstructionsTextTop?: number; // Absolute position for special instructions text
  roomCategory?: string; // Room category (Arrival, Departure, Stayover, Turndown) for proper styling
}

export default function GuestInfoCard({
  guest,
  isArrival,
  numberBadge,
  specialInstructions,
  absoluteTop,
  contentAreaTop,
  isSecondGuest = false,
  specialInstructionsTitleTop,
  specialInstructionsTextTop,
  roomCategory,
}: GuestInfoCardProps) {
  // State for image modal - opens to the right of guest image
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [imageModalAnchorLayout, setImageModalAnchorLayout] = useState<GuestImageAnchorLayout | null>(null);
  const guestImageWrapRef = useRef<View>(null);

  const openGuestImageModal = () => {
    guestImageWrapRef.current?.measureInWindow((x, y, width, height) => {
      setImageModalAnchorLayout({ x, y, width, height });
      setIsImageModalVisible(true);
    });
  };

  // Calculate relative position from content area start
  const containerTop = absoluteTop - contentAreaTop;

  // Determine category for proper styling
  // Use roomCategory if provided, otherwise fallback to isArrival logic
  const category = roomCategory || (isArrival ? 'Arrival' : 'Departure');
  
  // Use room detail positions, but convert to relative positions within container
  // Container is positioned at containerTop relative to contentArea
  // All positions in room detail are absolute from screen top
  // To convert to relative: absolutePosition - (contentAreaTop + containerTop)
  // Since containerTop = absoluteTop - contentAreaTop:
  // relative = absolutePosition - (contentAreaTop + absoluteTop - contentAreaTop) = absolutePosition - absoluteTop
  
  // Select config based on roomCategory if provided, otherwise use isArrival
  // For Stayover/Turndown, use Arrival config since they have ETA and similar layout
  // For Departure, use Departure config
  const configKey = roomCategory === 'Departure' ? 'departure' : 'arrival';
  const config = ROOM_DETAIL_GUEST_INFO[configKey];
  
  // Convert room detail absolute positions to relative positions within container
  // Container is at containerTop relative to contentArea, which equals absoluteTop absolute
  // So relative positions = absolute - absoluteTop
  
  // IMPORTANT: The config constants are from the Arrival/Departure combined screen (node-id: 1-1506)
  // where Arrival guest is at 349px and Departure guest is at 542px.
  // But for single room type screens, the guest is always at the FIRST position (e.g., 369px for Departure-only).
  // So we need to use RELATIVE offsets, not absolute positions.
  
  // Vertical spacing: use rowGap from constants for consistent spacing between name and date row
  const rowGap = 8; // Default spacing between name and date row
  const nameLineHeight = 21; // From guestName style lineHeight
  // Category badge on first row, name on second row
  // Category badge is now text-only (no background), so height is just font size + line height
  const categoryBadgeHeight = config.categoryBadge.fontSize * 1.2; // Approximate text height (fontSize * line-height ratio)
  const categoryBadgeGap = 4; // Gap between badge and name (matches Figma spacing)
  const categoryBadgeTopRelative = 0; // First row
  const nameTopRelative = categoryBadgeHeight + categoryBadgeGap; // Second row: badge height + gap
  // Date/time/count row: same baseline, with consistent spacing below name (28 + rowGap)
  const dateRowOffset = nameTopRelative + nameLineHeight + rowGap; // Below name row
  const dateTopRelative = dateRowOffset;
  const timeTopRelative = dateRowOffset;
  const countTopRelative = dateRowOffset;
  
  // Calculate Special Instructions spacing from date row to match Figma
  // From Figma: dates top = 377px, Special Instructions title top = 417px
  // Gap = 417 - 377 = 40px
  // Date row height (lineHeight) = ~17px, so spacing after date row = 40 - 17 = 23px
  const dateRowHeight = GUEST_INFO.dateRange.lineHeight || 17; // Use dateRange lineHeight
  const specialInstructionsGap = 23; // Spacing between date row bottom and Special Instructions title (matches Figma)
  const specialInstructionsTitleTopRelative = dateTopRelative + dateRowHeight + specialInstructionsGap;
  // Calculate text position only if specialInstructions config exists
  const specialInstructionsTextGap = 8; // Gap between title and text (from Figma: 442 - 417 - titleHeight ≈ 8px)
  const specialInstructionsTitleHeight = 'specialInstructions' in config && config.specialInstructions?.title?.fontSize
    ? config.specialInstructions.title.fontSize * 1.2
    : 13 * 1.2; // Default to fontSize 13 if not available
  const specialInstructionsTextTopRelative = specialInstructionsTitleTopRelative + specialInstructionsTitleHeight + specialInstructionsTextGap;
  
  const containerLeft = 0;
  const hasGuestImage = !!guest.imageUrl;
  // Room detail screen: image size 73.019×73.019 (different from All Rooms cards)
  const guestImageWidthDetail = 73.019;
  const guestImageHeightDetail = 73.019;
  const iconLeftRelative = config.icon.left; // 21px from Figma
  
  // Calculate gap to match Figma design exactly
  // Original design: icon at 21px, width 28.371px, name at 77px
  // Gap = 77 - 21 - 28.371 = 27.629px
  // With larger image (73.019px), maintain the same visual spacing from Figma
  // Use the original gap value to match Figma spacing
  const guestImageGap = 27.629;
  
  // When guest image: name/info starts after image + gap
  const infoColumnLeft = hasGuestImage ? iconLeftRelative + guestImageWidthDetail + guestImageGap : config.name.left;
  
  // Vertical alignment: align image top with category badge top (not centered)
  // This matches Figma where image aligns with the top of the text column
  const totalContentHeight = categoryBadgeHeight + categoryBadgeGap + nameLineHeight;
  const contentCenter = totalContentHeight / 2;
  const iconHeight = config.icon.height; // 29.919px
  const iconTopRelative = hasGuestImage
    ? categoryBadgeTopRelative // Align image top with category badge top
    : contentCenter - iconHeight / 2; // Center icon with content when no image
  
  const nameLeftRelative = infoColumnLeft;
  // Badge position from Figma: exact left position (189 for arrival, 157 for departure)
  const badgeLeftRelative = config.numberBadge.left; // Exact Figma position
  const badgeTopRelative = nameTopRelative; // Same row as name
  // Date/time/count row: align with name (same left as name) when hasGuestImage
  const dateLeftRelative = hasGuestImage ? infoColumnLeft : config.dates.left;
  // Time and count positions: inline within the date row, so they flow naturally
  // We don't need separate left positions - they're in a flex row
  const timeLeftRelative = configKey === 'departure'
    ? ('edt' in config ? config.edt.left : 0)
    : ('eta' in config ? config.eta.left : 0); // Not used when hasGuestImage
  const countIconLeftRelative = config.occupancy.iconLeft; // Not used when hasGuestImage
  const countTextLeftRelative = config.occupancy.textLeft; // Not used when hasGuestImage
  
  // Category badge position: first row, aligned with info column
  const categoryBadgeLeftRelative = infoColumnLeft;
  
  return (
    <View style={[styles.container, { top: containerTop * normalizedScaleX }]}>
      {/* Guest Image or Icon */}
      {iconLeftRelative !== undefined && (
        hasGuestImage ? (
          <View
            ref={guestImageWrapRef}
            collapsable={false}
            style={{
              position: 'absolute',
              left: iconLeftRelative * normalizedScaleX,
              top: iconTopRelative * normalizedScaleX,
              width: guestImageWidthDetail * normalizedScaleX,
              height: guestImageHeightDetail * normalizedScaleX,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={openGuestImageModal}
            >
              <Image
                source={{ uri: guest.imageUrl }}
                style={[
                  styles.guestImage,
                  {
                    width: guestImageWidthDetail * normalizedScaleX,
                    height: guestImageHeightDetail * normalizedScaleX,
                    borderRadius: GUEST_INFO.guestImage.borderRadius * normalizedScaleX,
                  },
                ]}
                resizeMode="cover"
              />
            </TouchableOpacity>
            {/* Category Badge at bottom right */}
            {(category === 'Arrival' || category === 'Departure' || category === 'Stayover' || category === 'Turndown' || category === 'ArrivalDeparture') && (
              <View
                style={[
                  styles.imageBadge,
                  {
                    backgroundColor: (category === 'Arrival' || (category === 'ArrivalDeparture' && guest.timeLabel === 'ETA'))
                      ? '#41D541' // Green for Arrival
                      : (category === 'Departure' || (category === 'ArrivalDeparture' && guest.timeLabel === 'EDT'))
                      ? '#f92424' // Red for Departure
                      : category === 'Stayover'
                      ? '#3BC1F6' // Light blue for Stayover
                      : '#9b51e0', // Purple for Turndown
                  },
                ]}
              >
                <Image
                  source={
                    (category === 'Arrival' || (category === 'ArrivalDeparture' && guest.timeLabel === 'ETA'))
                      ? require('../../../assets/icons/arrow-forward.png')
                      : (category === 'Departure' || (category === 'ArrivalDeparture' && guest.timeLabel === 'EDT'))
                      ? require('../../../assets/icons/departure-spear.png')
                      : category === 'Stayover'
                      ? require('../../../assets/icons/stayover-guest_icon.png')
                      : require('../../../assets/icons/moon.png')
                  }
                  style={category === 'Turndown' ? styles.imageBadgeIconNoTint : styles.imageBadgeIcon}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        ) : (
          <Image
            source={
              category === 'Departure'
                ? require('../../../assets/icons/guest-departure-icon.png')
                : category === 'Stayover'
                ? require('../../../assets/icons/stayover-guest_icon.png')
                : category === 'Turndown'
                ? require('../../../assets/icons/moon.png')
                : require('../../../assets/icons/guest-arrival-icon.png')
            }
            style={[
              styles.guestIcon,
              category === 'Turndown' ? styles.guestIconNoTint : null,
              {
                left: iconLeftRelative * normalizedScaleX,
                top: iconTopRelative * normalizedScaleX,
              },
            ]}
            resizeMode="contain"
          />
        )
      )}

      {/* Category Badge Row - First row above name */}
      {(category === 'Arrival' || category === 'Departure' || category === 'Stayover' || category === 'Turndown') && (
        <View
          style={[
            styles.categoryBadgeRow,
            {
              left: categoryBadgeLeftRelative * normalizedScaleX,
              top: categoryBadgeTopRelative * normalizedScaleX,
            },
          ]}
        >
          <Text
            style={[
              styles.categoryBadgeText,
              {
                fontSize: config.categoryBadge.fontSize * normalizedScaleX,
                color: category === 'Arrival' 
                  ? '#41d541' // Green for Arrival
                  : category === 'Departure'
                  ? '#f92424' // Red for Departure
                  : category === 'Stayover'
                  ? '#3BC1F6' // Light blue for Stayover
                  : '#9b51e0', // Purple for Turndown
              },
            ]}
          >
            {category}
          </Text>
        </View>
      )}

      {/* Guest Info Container - Name, Dates, GuestCount, ETA/EDT all in same container */}
      <View
        style={[
          styles.guestInfoContainer,
          {
            left: nameLeftRelative * normalizedScaleX,
            top: nameTopRelative * normalizedScaleX,
            paddingLeft: 0,
            marginLeft: 0,
            paddingStart: 0,
            marginStart: 0,
          },
        ]}
      >
        {/* Name and Number Badge Row */}
        <View style={styles.nameAndBadgeRow}>
          <Text style={[styles.guestName, { paddingLeft: 0, marginLeft: 0, paddingStart: 0, marginStart: 0 }]} numberOfLines={2}>
            {guest.name}
          </Text>
          
          {/* Number Badge (if provided) */}
          {numberBadge && (
            <Text style={styles.numberBadge}>{numberBadge}</Text>
          )}
        </View>

        {/* Date, GuestCount, ETA/EDT Row - aligned with name */}
        <View style={styles.detailsRowContainer}>
          {/* Dates of Stay */}
          {guest.datesOfStay && (
            <Text style={[styles.dateRange, { marginRight: 12 * normalizedScaleX, paddingLeft: 0, marginLeft: 0, paddingStart: 0, marginStart: 0, textAlign: 'left' }]}>
              {formatDatesOfStay(guest.datesOfStay)}
            </Text>
          )}
          
          {/* Guest Count - inline if available */}
          {guest.guestCount && guest.guestCount.adults !== undefined && (
            <>
              <Image
                source={require('../../../assets/icons/people-icon.png')}
                style={[styles.countIconInline, { marginLeft: 0, marginRight: 4 * normalizedScaleX }]}
                resizeMode="contain"
              />
              <Text style={[styles.countTextInline, { marginRight: 12 * normalizedScaleX }]}>
                {formatGuestCount(guest.guestCount)}
              </Text>
            </>
          )}
          
          {/* Time (ETA/EDT) - only when value is present and not N/A */}
          {guest.timeLabel && guest.time && guest.timeLabel !== 'N/A' && guest.time !== 'N/A' && (
            <Text style={styles.timeInline}>
              {`${guest.timeLabel}: ${guest.time}`}
            </Text>
          )}
        </View>
      </View>

      {/* Special Instructions - show for all guests if available */}
      {specialInstructions && 'specialInstructions' in config && config.specialInstructions?.title && config.specialInstructions?.text && (
        <>
          <Text
            style={[
              styles.specialInstructionsTitle,
              {
                left: config.specialInstructions!.title.left * normalizedScaleX,
                top: specialInstructionsTitleTop !== undefined 
                  ? (specialInstructionsTitleTop - absoluteTop) * normalizedScaleX
                  : (containerTop + specialInstructionsTitleTopRelative) * normalizedScaleX,
              },
            ]}
          >
            Special Instructions
          </Text>
          <Text
            style={[
              styles.specialInstructionsText,
              {
                left: config.specialInstructions!.text.left * normalizedScaleX,
                top: specialInstructionsTextTop !== undefined
                  ? (specialInstructionsTextTop - absoluteTop) * normalizedScaleX
                  : (containerTop + specialInstructionsTextTopRelative) * normalizedScaleX,
                width: config.specialInstructions!.text.width * normalizedScaleX,
              },
            ]}
          >
            {specialInstructions}
          </Text>
        </>
      )}

      {/* Guest profile image modal - opens to the right of guest image, 296×296, 5px radius */}
      <GuestProfileImageModal
        visible={isImageModalVisible}
        onClose={() => { setIsImageModalVisible(false); setImageModalAnchorLayout(null); }}
        guest={guest.imageUrl ? { imageUrl: guest.imageUrl, name: guest.name } : null}
        anchorLayout={imageModalAnchorLayout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1, // Ensure guest info is above dividers
  },
  guestIcon: {
    position: 'absolute',
    width: 28.371 * normalizedScaleX,
    height: 29.919 * normalizedScaleX,
  },
  guestIconNoTint: {
    tintColor: '#FFEA80',
  },
  guestImage: {
    position: 'absolute',
  },
  imageBadge: {
    position: 'absolute',
    bottom: -2 * normalizedScaleX,
    right: -2 * normalizedScaleX,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  imageBadgeIcon: {
    width: 12 * normalizedScaleX,
    height: 12 * normalizedScaleX,
    tintColor: '#ffffff',
  },
  imageBadgeIconNoTint: {
    width: 12 * normalizedScaleX,
    height: 12 * normalizedScaleX,
    tintColor: '#FFEA80',
  },
  categoryBadgeRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 30,
  },
  guestInfoContainer: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'flex-start',
    zIndex: 30,
    paddingLeft: 0,
    marginLeft: 0,
    paddingStart: 0,
    marginStart: 0,
  },
  nameAndBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * normalizedScaleX, // Spacing between name and number badge
    paddingLeft: 0,
    marginLeft: 0,
    paddingStart: 0,
    marginStart: 0,
    marginBottom: 8 * normalizedScaleX, // Spacing between name and date row (rowGap)
  },
  detailsRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: 0,
    marginLeft: 0,
    paddingStart: 0,
    marginStart: 0,
  },
  dateRange: {
    fontSize: ROOM_DETAIL_GUEST_INFO.arrival.dates.fontSize * normalizedScaleX, // 14px from Figma
    fontFamily: 'Helvetica',
    fontWeight: ROOM_DETAIL_GUEST_INFO.arrival.dates.fontWeight as any, // 'light' from Figma
    color: ROOM_DETAIL_GUEST_INFO.arrival.dates.color,
    lineHeight: 17 * normalizedScaleX,
    includeFontPadding: false,
    paddingLeft: 0,
    marginLeft: 0,
    paddingStart: 0,
    marginStart: 0,
  },
  countIconInline: {
    width: GUEST_INFO.guestCount.icon.width * normalizedScaleX,
    height: GUEST_INFO.guestCount.icon.height * normalizedScaleX,
    tintColor: '#334866',
  },
  countTextInline: {
    fontSize: ROOM_DETAIL_GUEST_INFO.arrival.occupancy.fontSize * normalizedScaleX, // 14px from Figma
    fontFamily: 'Helvetica',
    fontWeight: ROOM_DETAIL_GUEST_INFO.arrival.occupancy.fontWeight as any, // 'light' from Figma
    color: ROOM_DETAIL_GUEST_INFO.arrival.occupancy.color,
    lineHeight: 17 * normalizedScaleX,
  },
  timeInline: {
    fontSize: ROOM_DETAIL_GUEST_INFO.arrival.eta.fontSize * normalizedScaleX, // 14px from Figma
    fontFamily: 'Helvetica',
    fontWeight: ROOM_DETAIL_GUEST_INFO.arrival.eta.fontWeight as any, // 'regular' from Figma
    color: ROOM_DETAIL_GUEST_INFO.arrival.eta.color,
    lineHeight: 17 * normalizedScaleX,
  },
  guestName: {
    fontSize: ROOM_DETAIL_GUEST_INFO.arrival.name.fontSize * normalizedScaleX, // 14px from Figma
    fontFamily: 'Helvetica',
    fontWeight: ROOM_DETAIL_GUEST_INFO.arrival.name.fontWeight as any, // 'bold' from Figma
    color: ROOM_DETAIL_GUEST_INFO.arrival.name.color,
    lineHeight: 21 * normalizedScaleX,
    flexShrink: 0,
    paddingLeft: 0,
    marginLeft: 0,
    paddingStart: 0,
    marginStart: 0,
    includeFontPadding: false, // Remove extra font padding
  },
  numberBadge: {
    fontSize: ROOM_DETAIL_GUEST_INFO.arrival.numberBadge.fontSize * normalizedScaleX, // 12px from Figma
    fontFamily: 'Helvetica',
    fontWeight: ROOM_DETAIL_GUEST_INFO.arrival.numberBadge.fontWeight as any, // 'light' from Figma
    color: ROOM_DETAIL_GUEST_INFO.arrival.numberBadge.color,
    flexShrink: 0,
  },
  categoryBadgeText: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold' as any,
  },
  specialInstructionsTitle: {
    position: 'absolute',
    fontSize: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.title.fontSize * normalizedScaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'bold' as any,
    color: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.title.color,
    zIndex: 2, // Above divider
  },
  specialInstructionsText: {
    position: 'absolute',
    fontSize: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.text.fontSize * normalizedScaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'light' as any,
    color: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.text.color,
    lineHeight: 18 * normalizedScaleX,
    zIndex: 2, // Above divider
  },
});

