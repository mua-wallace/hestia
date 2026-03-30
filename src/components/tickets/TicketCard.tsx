import React, { useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import {
  scaleX,
} from '../../constants/ticketsStyles';
import { TicketData } from '../../types/tickets.types';

export type TicketStatusAnchorLayout = { x: number; y: number; width: number; height: number };

interface TicketCardProps {
  ticket: TicketData;
  onPress?: () => void;
  onStatusPress?: (anchor?: TicketStatusAnchorLayout) => void;
}

export default function TicketCard({ ticket, onPress, onStatusPress }: TicketCardProps) {
  const getInitials = (name: string) => {
    const parts = (name || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
  };

  const createdAtText = useMemo(() => {
    if (!ticket.createdAt) return undefined;
    const dt = new Date(ticket.createdAt);
    if (!Number.isFinite(dt.getTime())) return undefined;

    const pad2 = (n: number) => String(n).padStart(2, '0');
    const hh = pad2(dt.getHours());
    const mm = pad2(dt.getMinutes());
    const dd = pad2(dt.getDate());
    const mo = pad2(dt.getMonth() + 1);
    const yyyy = dt.getFullYear();
    return `${hh}:${mm}, ${dd}/${mo}/${yyyy}`;
  }, [ticket.createdAt]);

  const statusPillRef = useRef<View>(null);

  const handleStatusPress = () => {
    if (!onStatusPress) return;
    statusPillRef.current?.measureInWindow?.((x, y, width, height) => {
      onStatusPress({ x, y, width, height });
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.topRow}>
        <View style={styles.topRowLeft}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {ticket.title}
            </Text>
            {!!ticket.roomNumber && (
              <View style={styles.roomPill}>
                <Text style={styles.roomPillText} numberOfLines={1}>
                  {ticket.roomNumber}
                </Text>
              </View>
            )}
          </View>

          {!!ticket.guest?.name && (
            <View style={styles.guestRow}>
              {ticket.guest.imageUrl ? (
                <Image source={{ uri: ticket.guest.imageUrl }} style={styles.guestThumb} resizeMode="cover" />
              ) : (
                <View style={styles.guestThumbPlaceholder}>
                  <Text style={styles.guestThumbInitial}>{getInitials(ticket.guest.name)}</Text>
                </View>
              )}
              <View style={styles.guestTextCol}>
                <Text style={styles.guestName} numberOfLines={1} ellipsizeMode="tail">
                  {ticket.guest.name}
                </Text>
                {!!ticket.guest.stayRange && (
                  <Text style={styles.guestDates} numberOfLines={1} ellipsizeMode="tail">
                    {ticket.guest.stayRange}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          ref={statusPillRef}
          collapsable={false}
          style={styles.statusPill}
          onPress={handleStatusPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Change ticket status"
        >
          <Image
            source={
              ticket.status === 'done'
                ? require('../../../assets/icons/done.png')
                : require('../../../assets/icons/unsolved.png')
            }
            style={[
              styles.statusIcon,
              ticket.status === 'done' ? styles.statusIconDone : styles.statusIconUnsolved,
            ]}
            resizeMode="contain"
          />
          <Image
            source={require('../../../assets/icons/dropdown-arrow.png')}
            style={styles.statusChevron}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {!!ticket.images?.length && (
        <View style={styles.imagesRow}>
          {ticket.images.slice(0, 3).map((uri, idx) => (
            <View key={`${uri}-${idx}`} style={styles.imageThumbWrap}>
              <Image source={{ uri }} style={styles.imageThumb} resizeMode="cover" />
            </View>
          ))}
        </View>
      )}

      <View style={styles.footerRow}>
        <View style={styles.footerPerson}>
          {ticket.createdBy.avatar ? (
            <Image
              source={typeof ticket.createdBy.avatar === 'string' ? { uri: ticket.createdBy.avatar } : ticket.createdBy.avatar}
              style={styles.footerAvatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.footerAvatarPlaceholder}>
              <Text style={styles.footerAvatarInitial}>{getInitials(ticket.createdBy.name)}</Text>
            </View>
          )}
          <View style={styles.footerMeta}>
            <Text style={styles.footerName} numberOfLines={1}>
              {ticket.createdBy.name}
            </Text>
            <Text style={styles.footerSub} numberOfLines={1}>
              {ticket.createdBy.departmentName ?? '—'}
            </Text>
          </View>
        </View>

        <Image
          source={require('../../../assets/icons/arrow-forward.png')}
          style={[styles.footerArrow, styles.footerArrowReversed]}
          resizeMode="contain"
        />

        <View style={styles.footerPerson}>
          {ticket.assignedTo?.avatar ? (
            <Image
              source={typeof ticket.assignedTo.avatar === 'string' ? { uri: ticket.assignedTo.avatar } : ticket.assignedTo.avatar}
              style={styles.footerAvatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.footerAvatarPlaceholder}>
              <Text style={styles.footerAvatarInitial}>
                {ticket.assignedTo?.name ? getInitials(ticket.assignedTo.name) : '—'}
              </Text>
            </View>
          )}
          <View style={styles.footerMeta}>
            <Text style={styles.footerName} numberOfLines={1}>
              {ticket.assignedTo?.name ?? 'Tag staff'}
            </Text>
            <Text style={styles.footerSub} numberOfLines={1}>
              {ticket.assignedTo?.departmentName ?? (ticket.assignedTo?.name ? '—' : 'Select staff')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 409 * scaleX,
    minHeight: 216 * scaleX,
    backgroundColor: '#f9fafc',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 9 * scaleX,
    marginHorizontal: 16 * scaleX,
    marginBottom: 16 * scaleX,
    position: 'relative',
    paddingHorizontal: 22 * scaleX,
    paddingTop: 18 * scaleX,
    paddingBottom: 14 * scaleX,
  },
  divider: {
    height: 1,
    backgroundColor: '#e3e3e3',
    marginTop: 16 * scaleX,
    marginBottom: 12 * scaleX,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12 * scaleX,
  },
  topRowLeft: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 10 * scaleX,
  },
  title: {
    flexShrink: 1,
    fontSize: 27 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700',
    color: '#f92424',
    includeFontPadding: false,
  },
  roomPill: {
    backgroundColor: '#f92424',
    borderRadius: 7 * scaleX,
    paddingHorizontal: 14 * scaleX,
    paddingVertical: 8 * scaleX,
    flexShrink: 0,
  },
  roomPillText: {
    fontSize: 24 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700',
    color: '#fff',
    includeFontPadding: false,
  },
  guestRow: {
    marginTop: 10 * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10 * scaleX,
  },
  guestThumb: {
    width: 34.6 * scaleX,
    height: 34.6 * scaleX,
    borderRadius: 5 * scaleX,
  },
  guestThumbPlaceholder: {
    width: 34.6 * scaleX,
    height: 34.6 * scaleX,
    borderRadius: 5 * scaleX,
    backgroundColor: '#e4eefe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestThumbInitial: {
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700',
    color: '#5a759d',
  },
  guestTextCol: {
    flex: 1,
    minWidth: 0,
  },
  guestName: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700',
    color: '#1e1e1e',
  },
  guestDates: {
    marginTop: 2 * scaleX,
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '300',
    color: '#1e1e1e',
  },
  statusPill: {
    width: 67 * scaleX,
    height: 44 * scaleX,
    borderRadius: 75 * scaleX,
    backgroundColor: '#f9edef',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6 * scaleX,
    paddingHorizontal: 12 * scaleX,
  },
  statusIcon: {
    width: 17 * scaleX,
    height: 17 * scaleX,
  },
  statusIconUnsolved: {
    tintColor: '#f92424',
    transform: [{ rotate: '180deg' }],
  },
  statusIconDone: {
    tintColor: '#41d541',
  },
  statusChevron: {
    width: 10 * scaleX,
    height: 10 * scaleX,
    tintColor: '#f92424',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10 * scaleX,
  },
  imagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10 * scaleX,
    marginTop: 10 * scaleX,
    marginBottom: 8 * scaleX,
  },
  imageThumbWrap: {
    width: 78 * scaleX,
    height: 78 * scaleX,
    borderRadius: 5 * scaleX,
    overflow: 'hidden',
    backgroundColor: '#e6e6e6',
  },
  imageThumb: {
    width: '100%',
    height: '100%',
  },
  footerPerson: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    gap: 8 * scaleX,
  },
  footerAvatar: {
    width: 28 * scaleX,
    height: 28 * scaleX,
    borderRadius: 14 * scaleX,
  },
  footerAvatarPlaceholder: {
    width: 28 * scaleX,
    height: 28 * scaleX,
    borderRadius: 14 * scaleX,
    backgroundColor: '#e4eefe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerAvatarInitial: {
    fontSize: 11 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700',
    color: '#5a759d',
  },
  footerMeta: {
    flex: 1,
    minWidth: 0,
  },
  footerName: {
    fontSize: 13 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700',
    color: '#1e1e1e',
  },
  footerSub: {
    marginTop: 2 * scaleX,
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '300',
    color: '#000',
  },
  footerArrow: {
    width: 18 * scaleX,
    height: 18 * scaleX,
    tintColor: '#1e1e1e',
  },
  footerArrowReversed: {
    transform: [{ rotate: '180deg' }],
  },
});

