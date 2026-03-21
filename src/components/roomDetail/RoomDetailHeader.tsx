import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, ROOM_DETAIL_HEADER } from '../../constants/roomDetailStyles';
import { STATUS_CONFIGS } from '../../types/allRooms.types';
import type { RoomStatus } from '../../types/allRooms.types';

interface RoomDetailHeaderProps {
  roomNumber: string;
  roomCode: string;
  status: RoomStatus;
  onBackPress: () => void;
  onStatusPress?: () => void;
  statusButtonRef?: React.RefObject<any>;
  customStatusText?: string; // Custom status text to display (e.g., "Return Later", "Promise Time", "Refuse Service")
  pausedAt?: string; // Time when room was paused (e.g., "11:22")
  returnLaterAt?: string; // Deprecated: use returnLaterAtTimestamp for time + remaining
  returnLaterAtTimestamp?: number; // Epoch ms when user will return; header shows time only + countdown
  promiseTimeAtTimestamp?: number; // Epoch ms when room will be ready; header shows time + countdown
  refuseServiceReason?: string; // Selected reason or custom reason when Refuse Service is confirmed
  isPriority?: boolean; // Reserved for future priority UI
  flagged?: boolean; // When true, show red flag in circular white badge after room number (flag room)
  frontOfficeLabel?: string; // Front office status e.g. "Stayover" - shown below room code for Stayover rooms
  showWithLinenBadge?: boolean; // When true, show "with Linen" badge next to Stayover label
}

export default function RoomDetailHeader({
  roomNumber,
  roomCode,
  status,
  onBackPress,
  onStatusPress,
  statusButtonRef,
  customStatusText,
  pausedAt,
  returnLaterAt,
  returnLaterAtTimestamp,
  promiseTimeAtTimestamp,
  refuseServiceReason,
  isPriority = false,
  flagged = false,
  frontOfficeLabel,
  showWithLinenBadge = false,
}: RoomDetailHeaderProps) {
  const statusConfig = STATUS_CONFIGS[status] ?? STATUS_CONFIGS.Dirty;
  const isReturnLater = customStatusText === 'Return Later';
  const isPromiseTime = customStatusText === 'Promise Time' || customStatusText === 'Promised Time';
  const isRefuseService = customStatusText === 'Refuse Service' && refuseServiceReason != null;
  const hasReturnLaterTime = isReturnLater && (returnLaterAtTimestamp != null || returnLaterAt);
  const hasPromiseTimeTime = isPromiseTime && promiseTimeAtTimestamp != null;

  // Remaining countdown "X mins Y s" for Return Later, updates every second
  const [returnLaterRemaining, setReturnLaterRemaining] = useState<string>('');
  useEffect(() => {
    if (!hasReturnLaterTime || returnLaterAtTimestamp == null) {
      setReturnLaterRemaining('');
      return;
    }
    const tick = () => {
      const now = Date.now();
      const diff = returnLaterAtTimestamp - now;
      if (diff <= 0) {
        setReturnLaterRemaining('0h 0 min 0s');
        return;
      }
      const totalMins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (totalMins >= 60) {
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        setReturnLaterRemaining(`${hours}h ${mins} min ${secs}s`);
      } else {
        setReturnLaterRemaining(`${totalMins} mins ${secs}s`);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hasReturnLaterTime, returnLaterAtTimestamp]);

  // Use custom status text if provided; when pausedAt is set show "Paused"
  const displayStatusText = pausedAt ? 'Paused' : (customStatusText || statusConfig.label);

  // Paused / Return Later / Promise Time / Refuse Service (with reason): light #FCF1CF
  const isPaused = !!(customStatusText === 'Pause' || pausedAt);
  const headerBackgroundColor = isPaused
      ? ROOM_DETAIL_HEADER.paused.headerBackground
      : isReturnLater
        ? ROOM_DETAIL_HEADER.returnLater.headerBackground
        : isPromiseTime
          ? ROOM_DETAIL_HEADER.returnLater.headerBackground
          : isRefuseService
            ? ROOM_DETAIL_HEADER.returnLater.headerBackground
            : statusConfig.color;

  // Promise Time countdown (same format as Return Later: "2:30 PM · 30 mins 2s" or "1h 30 min 2s")
  const [promiseTimeRemaining, setPromiseTimeRemaining] = useState<string>('');
  useEffect(() => {
    if (!hasPromiseTimeTime || promiseTimeAtTimestamp == null) {
      setPromiseTimeRemaining('');
      return;
    }
    const tick = () => {
      const now = Date.now();
      const diff = promiseTimeAtTimestamp - now;
      if (diff <= 0) {
        setPromiseTimeRemaining('0h 0 min 0s');
        return;
      }
      const totalMins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (totalMins >= 60) {
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        setPromiseTimeRemaining(`${hours}h ${mins} min ${secs}s`);
      } else {
        setPromiseTimeRemaining(`${totalMins} mins ${secs}s`);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hasPromiseTimeTime, promiseTimeAtTimestamp]);

  const isLightHeader = isPaused || isReturnLater || isPromiseTime || isRefuseService;
  const returnTimeOnly = returnLaterAtTimestamp != null
    ? new Date(returnLaterAtTimestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '';
  const promiseTimeOnly = promiseTimeAtTimestamp != null
    ? new Date(promiseTimeAtTimestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '';

  // Determine which icon to use based on customStatusText, pausedAt, or status
  const getStatusIcon = () => {
    if (customStatusText === 'Pause' || pausedAt) {
      return require('../../../assets/icons/pause.png');
    }
    if (customStatusText === 'Refuse Service') {
      return require('../../../assets/icons/refuse-service.png');
    }
    if (customStatusText === 'Return Later') {
      return require('../../../assets/icons/return-later.png');
    }
    if (customStatusText === 'Promise Time' || customStatusText === 'Promised Time') {
      return require('../../../assets/icons/promised-time-status.png');
    }
    // Default to status-based icons
    if (status === 'InProgress') {
      return require('../../../assets/icons/in-progress-icon.png');
    }
    if (status === 'Dirty') {
      return require('../../../assets/icons/dirty-icon.png');
    }
    if (status === 'Cleaned') {
      return require('../../../assets/icons/cleaned-icon.png');
    }
    if (status === 'Inspected') {
      return require('../../../assets/icons/inspected-status-icon.png');
    }
    return statusConfig.icon;
  };

  const statusIconSource = getStatusIcon();
  
  // These icons have colored backgrounds, so don't apply tintColor
  const iconsWithColor = ['Pause', 'Refuse Service', 'Return Later', 'Promise Time', 'Promised Time'];
  const shouldTintIcon = !customStatusText || !iconsWithColor.includes(customStatusText);

  return (
    <View style={[styles.headerContainer, { backgroundColor: headerBackgroundColor }]}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image
          source={require('../../../assets/icons/back-arrow.png')}
          style={styles.backArrow}
          tintColor={
            isPaused
                ? ROOM_DETAIL_HEADER.paused.backArrowTint
                : (isReturnLater || isPromiseTime || isRefuseService)
                  ? ROOM_DETAIL_HEADER.returnLater.backArrowTint
                  : '#FFFFFF'
          }
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Room Number + optional flag badge (when room is flagged) */}
      <View style={styles.roomNumberRow}>
        <Text
          style={[
          styles.roomNumber,
          isPaused && { color: ROOM_DETAIL_HEADER.paused.roomNumberColor },
            (isReturnLater || isPromiseTime || isRefuseService) && { color: ROOM_DETAIL_HEADER.returnLater.roomNumberColor },
          ]}
        >
          Room {roomNumber}
        </Text>
        {flagged && (
          <View style={styles.priorityBadge}>
            <Image
              source={require('../../../assets/icons/flag.png')}
              style={styles.priorityBadgeIcon}
              resizeMode="contain"
              tintColor="#f92424"
            />
          </View>
        )}
      </View>

      {/* Room Code */}
      <Text
        style={[
          styles.roomCode,
          isPaused && { color: ROOM_DETAIL_HEADER.paused.roomCodeColor },
          (isReturnLater || isPromiseTime || isRefuseService) && { color: ROOM_DETAIL_HEADER.returnLater.roomCodeColor },
        ]}
      >
        {roomCode}
      </Text>

      {/* Front Office Label (e.g. Stayover) + with Linen badge when applicable */}
      {frontOfficeLabel && (
        <View style={styles.frontOfficeLabelRow}>
          <Text
            style={[
              styles.frontOfficeLabel,
              isPaused && { color: ROOM_DETAIL_HEADER.paused.roomCodeColor },
              (isReturnLater || isPromiseTime || isRefuseService) && { color: ROOM_DETAIL_HEADER.returnLater.roomCodeColor },
            ]}
          >
            {frontOfficeLabel}
          </Text>
          {showWithLinenBadge && (
            <View style={styles.withLinenBadge}>
              <Text style={styles.withLinenBadgeText}>
                with Linen
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Status Indicator - always shows houseKeepingStatus (Dirty, In Progress, Cleaned, Inspected) */}
      <TouchableOpacity
        ref={statusButtonRef}
        style={styles.statusIndicator}
        onPress={onStatusPress}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <>
            <Image
              source={statusIconSource}
              style={styles.statusIcon}
              resizeMode="contain"
              tintColor={
                isPaused
                  ? ROOM_DETAIL_HEADER.paused.statusTextAndIconColor
                  : (isReturnLater || isPromiseTime || isRefuseService)
                    ? ROOM_DETAIL_HEADER.returnLater.statusTextAndIconColor
                    : shouldTintIcon
                      ? '#FFFFFF'
                      : undefined
              }
            />
            <Text
              style={[
                styles.statusText,
                isPaused && { color: ROOM_DETAIL_HEADER.paused.statusTextAndIconColor },
                (isReturnLater || isPromiseTime || isRefuseService) && { color: ROOM_DETAIL_HEADER.returnLater.statusTextAndIconColor },
              ]}
            >
              {displayStatusText}
            </Text>
            <Image
              source={require('../../../assets/icons/dropdown-arrow.png')}
              style={[
                styles.dropdownArrow,
                isPaused && { tintColor: ROOM_DETAIL_HEADER.paused.statusTextAndIconColor },
                (isReturnLater || isPromiseTime || isRefuseService) && { tintColor: ROOM_DETAIL_HEADER.returnLater.statusTextAndIconColor },
              ]}
              resizeMode="contain"
            />
        </>
      </TouchableOpacity>

      {/* Paused Time - show when paused (Figma 2333-132) */}
      {pausedAt && (
        <Text
          style={[
            styles.pausedTime,
            isPaused && { color: ROOM_DETAIL_HEADER.paused.pausedTimeColor },
          ]}
        >
          Paused at {pausedAt}
        </Text>
      )}

      {/* Return Later: time only (no date) + remaining e.g. "2:30 PM · 30 mins 2s" */}
      {hasReturnLaterTime && (returnLaterAtTimestamp != null ? (
        <Text style={[styles.returnLaterAt, { color: ROOM_DETAIL_HEADER.returnLater.returnTimeColor }]}>
          {returnTimeOnly}{returnLaterRemaining ? ` · ${returnLaterRemaining}` : ''}
        </Text>
      ) : returnLaterAt ? (
        <Text style={[styles.returnLaterAt, { color: ROOM_DETAIL_HEADER.returnLater.returnTimeColor }]}>
          Return at {returnLaterAt}
        </Text>
      ) : null)}

      {/* Promise Time: time only + remaining e.g. "2:30 PM · 30 mins 2s" */}
      {hasPromiseTimeTime && (
        <Text style={[styles.returnLaterAt, { color: ROOM_DETAIL_HEADER.returnLater.returnTimeColor }]}>
          {promiseTimeOnly}{promiseTimeRemaining ? ` · ${promiseTimeRemaining}` : ''}
        </Text>
      )}

      {/* Refuse Service: selected reason or custom reason (like Return Later / Promise Time) */}
      {isRefuseService && refuseServiceReason && (
        <Text style={[styles.returnLaterAt, { color: ROOM_DETAIL_HEADER.returnLater.returnTimeColor }]}>
          {refuseServiceReason}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ROOM_DETAIL_HEADER.height * scaleX,
    // backgroundColor is set dynamically based on status
    zIndex: 100, // Above all other content
    elevation: 100, // For Android
  },
  backButton: {
    position: 'absolute',
    left: ROOM_DETAIL_HEADER.backButton.left * scaleX,
    top: ROOM_DETAIL_HEADER.backButton.top * scaleX,
    width: ROOM_DETAIL_HEADER.backButton.width * scaleX,
    height: ROOM_DETAIL_HEADER.backButton.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20, // Ensure it's above other elements
  },
  backArrow: {
    width: ROOM_DETAIL_HEADER.backButton.width * scaleX,
    height: ROOM_DETAIL_HEADER.backButton.height * scaleX,
    // No transform - use icon directly as is
  },
  roomNumberRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: ROOM_DETAIL_HEADER.roomNumber.top * scaleX,
    gap: 10 * scaleX,
  },
  roomNumber: {
    fontSize: ROOM_DETAIL_HEADER.roomNumber.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: ROOM_DETAIL_HEADER.roomNumber.color,
  },
  priorityBadge: {
    width: 28 * scaleX,
    height: 28 * scaleX,
    borderRadius: 14 * scaleX,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityBadgeIcon: {
    width: 12 * scaleX,
    height: 12 * scaleX,
  },
  roomCode: {
    position: 'absolute',
    fontSize: ROOM_DETAIL_HEADER.roomCode.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: ROOM_DETAIL_HEADER.roomCode.color,
    top: ROOM_DETAIL_HEADER.roomCode.top * scaleX,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  frontOfficeLabelRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: 130 * scaleX,
    gap: 6 * scaleX,
  },
  frontOfficeLabel: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: ROOM_DETAIL_HEADER.roomCode.color,
  },
  withLinenBadge: {
    paddingHorizontal: 8 * scaleX,
    paddingVertical: 2 * scaleX,
    borderRadius: 6 * scaleX,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(123, 31, 162, 0.7)',
  },
  withLinenBadgeFlagged: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(123, 31, 162, 0.8)',
  },
  withLinenBadgeText: {
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#334866',
  },
  withLinenBadgeTextFlagged: {
    color: '#334866',
  },
  statusIndicator: {
    position: 'absolute',
    left: ROOM_DETAIL_HEADER.statusIndicator.left * scaleX,
    top: ROOM_DETAIL_HEADER.statusIndicator.top * scaleX,
    width: ROOM_DETAIL_HEADER.statusIndicator.width * scaleX,
    height: ROOM_DETAIL_HEADER.statusIndicator.height * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flaggedFlagIcon: {
    width: ROOM_DETAIL_HEADER.flagged.pill.flagIcon.width * scaleX,
    height: ROOM_DETAIL_HEADER.flagged.pill.flagIcon.height * scaleX,
    marginRight: 8 * scaleX,
  },
  flaggedPillText: {
    fontSize: 19 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '300' as any,
    color: ROOM_DETAIL_HEADER.flagged.pill.textAndIconTint,
  },
  flaggedDropdownArrow: {
    width: ROOM_DETAIL_HEADER.flagged.pill.dropdownArrow.width * scaleX,
    height: ROOM_DETAIL_HEADER.flagged.pill.dropdownArrow.height * scaleX,
    marginLeft: 8 * scaleX,
  },
  statusIcon: {
    width: 24.367 * scaleX,
    height: 25.434 * scaleX,
    marginRight: 8 * scaleX,
  },
  statusText: {
    fontSize: 19 * scaleX,
    fontFamily: 'Helvetica',
    fontStyle: 'normal',
    fontWeight: '300' as any,
    lineHeight: undefined,
    color: '#FFF',
  },
  dropdownArrow: {
    width: 24.367 * scaleX,
    height: 25.434 * scaleX,
    marginLeft: 8 * scaleX,
    tintColor: '#ffffff',
    // No rotation - use icon directly as is
  },
  pausedTime: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (ROOM_DETAIL_HEADER.statusIndicator.top + ROOM_DETAIL_HEADER.statusIndicator.height + 8) * scaleX, // Below status indicator with 8px spacing
    fontSize: 14 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'light' as any,
    color: '#ffffff',
    textAlign: 'center',
  },
  returnLaterAt: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (ROOM_DETAIL_HEADER.statusIndicator.top + ROOM_DETAIL_HEADER.statusIndicator.height + 8) * scaleX,
    fontSize: 14 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'light' as any,
    color: '#ffffff',
    textAlign: 'center',
  },
});

