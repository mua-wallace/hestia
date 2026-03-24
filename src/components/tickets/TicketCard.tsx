import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import {
  TICKET_CARD,
  TICKET_CONTENT,
  TICKET_LOCATION,
  TICKET_CREATOR,
  TICKET_STATUS,
  TICKET_DIVIDER,
  TICKETS_COLORS,
  TICKETS_TYPOGRAPHY,
  scaleX,
} from '../../constants/ticketsStyles';
import { TicketData } from '../../types/tickets.types';

interface TicketCardProps {
  ticket: TicketData;
  onPress?: () => void;
  onStatusPress?: () => void;
}

export default function TicketCard({ ticket, onPress, onStatusPress }: TicketCardProps) {
  const statusConfig = ticket.status === 'done' 
    ? TICKET_STATUS.done 
    : TICKET_STATUS.unsolved;

  const getInitials = (name: string) => {
    const parts = (name || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
  };

  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    if (ticket.status !== 'unsolved' || !ticket.createdAt) return;
    const t = setInterval(() => setNowMs(Date.now()), 60000); // update each minute
    return () => clearInterval(t);
  }, [ticket.status, ticket.createdAt]);

  const dueTimeText = useMemo(() => {
    if (ticket.status !== 'unsolved') return undefined;
    if (ticket.createdAt) {
      const createdAtMs = new Date(ticket.createdAt).getTime();
      if (!Number.isFinite(createdAtMs)) return undefined;
      const elapsedMinutes = (nowMs - createdAtMs) / 60000;
      const totalMins = Math.max(0, Math.floor(elapsedMinutes));
      const hours = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      if (hours <= 0) return mins === 1 ? '1 min' : `${mins} mins`;
      return `${hours} hrs ${mins} mins`;
    }
    // No createdAt from Supabase: hide the badge instead of using any mock/fallback values.
    return undefined;
  }, [ticket.status, ticket.createdAt, nowMs]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>
        {ticket.title}
      </Text>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {ticket.description}
      </Text>

      {/* Location Icon */}
      <View style={styles.locationIconContainer}>
        <Image
          source={require('../../../assets/icons/location.png')}
          style={styles.locationPinIcon}
          resizeMode="contain"
        />
      </View>

      {/* Location Label */}
      <Text style={styles.locationLabel}>Location</Text>

      {/* Room Number */}
      <Text style={styles.locationRoom} numberOfLines={1} ellipsizeMode="tail">
        {ticket.locationText ?? `Room ${ticket.roomNumber}`}
      </Text>

      {/* Due + Department row (same row, centered vertically) */}
      {(dueTimeText || (ticket.category && ticket.categoryIcon)) && (
        <View style={styles.locationMetaRow}>
          <View style={styles.metaLeft}>
            {dueTimeText && (
              <View style={[styles.dueDateBadge, styles.dueDateBadgeInline]}>
                <Text style={styles.dueDateText} numberOfLines={1}>
                  Due in: {dueTimeText}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.metaRight}>
            {ticket.category && ticket.categoryIcon && (
              <View style={styles.departmentInline}>
                <Image
                  source={ticket.categoryIcon}
                  style={[styles.departmentInlineIcon, { tintColor: '#f92424' }]}
                  resizeMode="contain"
                />
                <Text style={styles.departmentInlineText}>
                  {ticket.category}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Creator Avatar */}
      {ticket.createdBy.avatar ? (
        <Image
          // Supabase may return `avatar_url` as a string URL, while mock data uses `require()`.
          source={typeof ticket.createdBy.avatar === 'string'
            ? { uri: ticket.createdBy.avatar }
            : ticket.createdBy.avatar}
          style={styles.creatorAvatar}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.creatorAvatarPlaceholder}>
          <Text style={styles.creatorInitial}>
            {getInitials(ticket.createdBy.name)}
          </Text>
        </View>
      )}

      {/* Creator Label */}
      <Text style={styles.creatorLabel}>created by</Text>

      {/* Creator Name */}
      <Text style={styles.creatorName}>{ticket.createdBy.name}</Text>

      {/* Horizontal Divider */}
      <View style={styles.divider} />

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
        {statusConfig.iconWidth && (
          <Image
            source={
              ticket.status === 'done'
                ? require('../../../assets/icons/done.png')
                : require('../../../assets/icons/unsolved.png')
            }
            style={[
              styles.statusIcon,
              {
                position: 'absolute',
                left: (statusConfig.iconLeft - statusConfig.left) * scaleX,
                top: (statusConfig.iconTop - statusConfig.top) * scaleX,
                width: statusConfig.iconWidth * scaleX,
                height: statusConfig.iconHeight * scaleX,
                tintColor: ticket.status === 'done' ? '#ffffff' : '#f92424',
                transform: 'iconRotate' in statusConfig && statusConfig.iconRotate != null
                  ? [{ rotate: `${(statusConfig as { iconRotate: number }).iconRotate}deg` }]
                  : [],
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
              left: statusConfig.textLeft
                ? (statusConfig.textLeft - statusConfig.left) * scaleX
                : undefined,
              top: statusConfig.textTop
                ? (statusConfig.textTop - statusConfig.top) * scaleX
                : undefined,
            },
          ]}
        >
          {ticket.status === 'done' ? 'Done' : 'Unsolved'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: TICKET_CARD.width * scaleX,
    height: TICKET_CARD.height * scaleX,
    backgroundColor: TICKET_CARD.backgroundColor,
    borderWidth: TICKET_CARD.borderWidth,
    borderColor: TICKET_CARD.borderColor,
    borderRadius: TICKET_CARD.borderRadius * scaleX,
    marginHorizontal: TICKET_CARD.marginHorizontal * scaleX,
    marginBottom: TICKET_CARD.marginBottom * scaleX,
    position: 'relative',
  },
  dueDateBadge: {
    position: 'absolute',
    backgroundColor: TICKET_CONTENT.dueDateBadge.backgroundColor,
    borderRadius: TICKET_CONTENT.dueDateBadge.borderRadius * scaleX,
    paddingLeft: TICKET_CONTENT.dueDateBadge.paddingHorizontal * scaleX,
    paddingRight: TICKET_CONTENT.dueDateBadge.paddingHorizontal * scaleX,
    paddingTop: TICKET_CONTENT.dueDateBadge.paddingVertical * scaleX,
    paddingBottom: TICKET_CONTENT.dueDateBadge.paddingVertical * scaleX,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  dueDateText: {
    fontSize: TICKETS_TYPOGRAPHY.dueDate.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: TICKETS_TYPOGRAPHY.dueDate.fontWeight as any,
    color: TICKETS_TYPOGRAPHY.dueDate.color,
    textAlign: 'left',
    includeFontPadding: false,
    padding: 0,
    margin: 0,
    lineHeight: TICKETS_TYPOGRAPHY.dueDate.fontSize * 1.2 * scaleX,
  },
  title: {
    position: 'absolute',
    left: TICKET_CONTENT.title.left * scaleX,
    top: TICKET_CONTENT.title.top * scaleX,
    fontSize: TICKETS_TYPOGRAPHY.ticketTitle.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: TICKETS_TYPOGRAPHY.ticketTitle.fontWeight as any,
    color: TICKETS_TYPOGRAPHY.ticketTitle.color,
  },
  description: {
    position: 'absolute',
    left: TICKET_CONTENT.description.left * scaleX,
    top: TICKET_CONTENT.description.top * scaleX,
    fontSize: TICKETS_TYPOGRAPHY.ticketDescription.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: TICKETS_TYPOGRAPHY.ticketDescription.fontWeight as any,
    color: TICKETS_TYPOGRAPHY.ticketDescription.color,
    lineHeight: TICKETS_TYPOGRAPHY.ticketDescription.lineHeight * scaleX,
    maxWidth: TICKET_CONTENT.description.maxWidth * scaleX,
  },
  locationMetaRow: {
    position: 'absolute',
    left: 18 * scaleX,
    top: 84 * scaleX,
    width: 373 * scaleX,
    minHeight: 22 * scaleX,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  metaRight: {
    position: 'absolute',
    // Align department icon column with location icon column above.
    left: (TICKET_LOCATION.icon.left + (TICKET_LOCATION.icon.size - 16) / 2 - 18) * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    maxWidth: (391 - (TICKET_LOCATION.icon.left + (TICKET_LOCATION.icon.size - 16) / 2)) * scaleX,
  },
  departmentInline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minWidth: 0,
    flexShrink: 1,
  },
  departmentInlineIcon: {
    width: 16 * scaleX,
    height: 16 * scaleX,
    marginRight: 6 * scaleX,
  },
  departmentInlineText: {
    fontSize: 13 * scaleX,
    lineHeight: 15 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '400',
    color: '#a0a0a0',
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: 120 * scaleX,
  },
  dueDateBadgeInline: {
    position: 'relative',
    left: 0,
    top: 0,
    alignSelf: 'center',
  },
  locationIconContainer: {
    position: 'absolute',
    left: TICKET_LOCATION.icon.left * scaleX,
    top: TICKET_LOCATION.icon.top * scaleX,
    width: TICKET_LOCATION.icon.size * scaleX,
    height: TICKET_LOCATION.icon.size * scaleX,
    borderRadius: (TICKET_LOCATION.icon.size / 2) * scaleX,
    backgroundColor: TICKETS_COLORS.locationPin,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationPinIcon: {
    width: TICKET_LOCATION.pinIcon.width * scaleX,
    height: TICKET_LOCATION.pinIcon.height * scaleX,
    tintColor: '#ffffff',
  },
  locationLabel: {
    position: 'absolute',
    left: TICKET_LOCATION.label.left * scaleX,
    top: TICKET_LOCATION.label.top * scaleX,
    fontSize: TICKETS_TYPOGRAPHY.locationLabel.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: TICKETS_TYPOGRAPHY.locationLabel.fontWeight as any,
    color: TICKETS_TYPOGRAPHY.locationLabel.color,
  },
  locationRoom: {
    position: 'absolute',
    left: TICKET_LOCATION.roomNumber.left * scaleX,
    top: TICKET_LOCATION.roomNumber.top * scaleX,
    fontSize: TICKETS_TYPOGRAPHY.locationRoom.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: TICKETS_TYPOGRAPHY.locationRoom.fontWeight as any,
    color: TICKETS_TYPOGRAPHY.locationRoom.color,
    maxWidth: 92 * scaleX,
  },
  creatorAvatar: {
    position: 'absolute',
    left: TICKET_CREATOR.avatar.left * scaleX,
    top: TICKET_CREATOR.avatar.top * scaleX,
    width: TICKET_CREATOR.avatar.size * scaleX,
    height: TICKET_CREATOR.avatar.size * scaleX,
    borderRadius: (TICKET_CREATOR.avatar.size / 2) * scaleX,
  },
  creatorAvatarPlaceholder: {
    position: 'absolute',
    left: TICKET_CREATOR.avatar.left * scaleX,
    top: TICKET_CREATOR.avatar.top * scaleX,
    width: TICKET_CREATOR.avatar.size * scaleX,
    height: TICKET_CREATOR.avatar.size * scaleX,
    borderRadius: (TICKET_CREATOR.avatar.size / 2) * scaleX,
    backgroundColor: TICKETS_COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorInitial: {
    fontSize: 12 * scaleX,
    fontWeight: 'bold' as any,
    color: TICKETS_COLORS.textSecondary,
  },
  creatorLabel: {
    position: 'absolute',
    left: TICKET_CREATOR.label.left * scaleX,
    top: TICKET_CREATOR.label.top * scaleX,
    fontSize: TICKETS_TYPOGRAPHY.creatorLabel.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: TICKETS_TYPOGRAPHY.creatorLabel.fontWeight as any,
    color: TICKETS_TYPOGRAPHY.creatorLabel.color,
  },
  creatorName: {
    position: 'absolute',
    left: TICKET_CREATOR.name.left * scaleX,
    top: TICKET_CREATOR.name.top * scaleX,
    fontSize: TICKETS_TYPOGRAPHY.creatorName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: TICKETS_TYPOGRAPHY.creatorName.fontWeight as any,
    color: TICKETS_TYPOGRAPHY.creatorName.color,
  },
  divider: {
    position: 'absolute',
    left: TICKET_DIVIDER.left * scaleX,
    top: TICKET_DIVIDER.top * scaleX,
    width: TICKET_DIVIDER.width * scaleX,
    height: TICKET_DIVIDER.height,
    backgroundColor: TICKET_DIVIDER.color,
  },
  statusButton: {
    position: 'absolute',
    height: TICKET_STATUS.button.height * scaleX,
    borderRadius: TICKET_STATUS.button.borderRadius * scaleX,
  },
  statusIcon: {
    // Icon tint color will be handled per status if needed
  },
  statusText: {
    fontSize: TICKETS_TYPOGRAPHY.statusButton.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: TICKETS_TYPOGRAPHY.statusButton.fontWeight as any,
  },
});

