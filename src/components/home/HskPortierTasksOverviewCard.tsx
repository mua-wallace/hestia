import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { typography } from '../../theme';
import { useDesignScale } from '../../hooks/useDesignScale';

export default function HskPortierTasksOverviewCard({
  total,
  dirty,
  inProgress,
  cleaned,
  inspected,
  priority,
  progressText,
  latestPill,
}: {
  total: number;
  dirty: number;
  inProgress: number;
  cleaned: number;
  inspected: number;
  priority: number;
  progressText: string; // e.g. "2/8"
  latestPill?: {
    type: 'paused' | 'returnLater' | 'refused';
    roomLabel: string;
    timeIso?: string;
    subText?: string;
  };
}) {
  const { scaleX } = useDesignScale();
  const styles = useMemo(() => buildStyles(scaleX), [scaleX]);

  const [timerText, setTimerText] = useState<string>('');
  useEffect(() => {
    if (!latestPill?.timeIso || (latestPill.type !== 'paused' && latestPill.type !== 'returnLater')) {
      setTimerText('');
      return;
    }
    const baseMs = new Date(latestPill.timeIso).getTime();
    if (!Number.isFinite(baseMs)) {
      setTimerText('');
      return;
    }
    const tick = () => {
      const diff =
        latestPill.type === 'paused'
          ? Math.max(0, Date.now() - baseMs)
          : Math.max(0, baseMs - Date.now());
      const totalSeconds = Math.floor(diff / 1000);
      const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const ss = String(totalSeconds % 60).padStart(2, '0');
      setTimerText(`${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [latestPill?.type, latestPill?.timeIso]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          <Text style={styles.titleCount}>{total} </Text>
          <Text style={styles.titleLabel}>Tasks</Text>
        </Text>

        <View style={styles.priorityWrap}>
          <View style={styles.priorityCircle}>
            <Image
              source={require('../../../assets/icons/priority-status.png')}
              style={styles.priorityIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityBadgeText}>{priority}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statusRow}>
        <StatusBubble
          label="Dirty"
          count={dirty}
          bg="#f92424"
          icon={require('../../../assets/icons/dirty-status.png')}
          iconStyle={styles.iconDirty}
        />
        <StatusBubble
          label="In Progress"
          count={inProgress}
          bg="#f0be1b"
          icon={require('../../../assets/icons/in-progress-icon.png')}
          iconStyle={styles.iconDefault}
        />
        <StatusBubble
          label="Cleaned"
          count={cleaned}
          bg="#4a91fc"
          icon={require('../../../assets/icons/cleaned-icon.png')}
          iconStyle={styles.iconDefault}
        />
        <StatusBubble
          label="Inspected"
          count={inspected}
          bg="#41d541"
          icon={require('../../../assets/icons/inspected-icon.png')}
          iconStyle={styles.iconDefault}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View style={styles.progressLeft} />
          <View style={styles.progressMid} />
          <View style={styles.progressRight} />
        </View>
        <Text style={styles.progressText}>{progressText}</Text>
      </View>

      {!!latestPill?.roomLabel && (
        <View style={styles.pausedPill}>
          <View style={styles.pausedIconCircle}>
            <Image
              source={require('../../../assets/icons/in-progress-icon.png')}
              style={styles.pausedIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.pausedTextCol}>
            <Text style={styles.pausedRoom}>{latestPill.roomLabel}</Text>
            <Text style={styles.pausedTimer}>
              {latestPill.type === 'refused' ? (latestPill.subText ?? '') : timerText}
            </Text>
          </View>
          <View style={styles.pausedRight}>
            <Image source={require('../../../assets/icons/pause.png')} style={styles.pausedRightIcon} resizeMode="contain" />
            <Text style={styles.pausedRightText}>
              {latestPill.type === 'paused' ? 'Paused' : latestPill.type === 'returnLater' ? 'Return Later' : 'Refused'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

function StatusBubble({
  label,
  count,
  bg,
  icon,
  iconStyle,
}: {
  label: string;
  count: number;
  bg: string;
  icon: any;
  iconStyle: any;
}) {
  const { scaleX } = useDesignScale();
  const styles = useMemo(() => buildStyles(scaleX), [scaleX]);
  return (
    <View style={styles.statusItem}>
      <View style={[styles.statusCircle, { backgroundColor: bg }]}>
        <Image source={icon} style={iconStyle} resizeMode="contain" />
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>{count}</Text>
        </View>
      </View>
      <Text style={styles.statusLabel}>{label}</Text>
    </View>
  );
}

function buildStyles(scaleX: number) {
  return StyleSheet.create({
    card: {
      width: 422 * scaleX,
      borderRadius: 12 * scaleX,
      backgroundColor: '#f9fafc',
      borderWidth: 1,
      borderColor: 'rgba(90,117,157,0.23)',
      alignSelf: 'center',
      overflow: 'hidden',
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20 * scaleX,
      paddingTop: 18 * scaleX,
      paddingBottom: 12 * scaleX,
    },
    title: {
      fontSize: 20 * scaleX,
      fontFamily: typography.fontFamily.primary,
      fontWeight: typography.fontWeights.bold as any,
      color: '#1e1e1e',
    },
    titleCount: { color: '#1e1e1e' },
    titleLabel: { color: 'rgba(30,30,30,0.7)' },
    priorityWrap: {
      width: 58 * scaleX,
      height: 47 * scaleX,
      position: 'relative',
    },
    priorityCircle: {
      width: 58 * scaleX,
      height: 47 * scaleX,
      borderRadius: 54 * scaleX,
      backgroundColor: '#ffebeb',
      alignItems: 'center',
      justifyContent: 'center',
    },
    priorityIcon: {
      width: 26 * scaleX,
      height: 26 * scaleX,
    },
    priorityBadge: {
      position: 'absolute',
      right: -2 * scaleX,
      top: -2 * scaleX,
      width: 24 * scaleX,
      height: 24 * scaleX,
      borderRadius: 12 * scaleX,
      backgroundColor: '#f92424',
      alignItems: 'center',
      justifyContent: 'center',
    },
    priorityBadgeText: {
      fontSize: 15 * scaleX,
      fontFamily: typography.fontFamily.primary,
      fontWeight: typography.fontWeights.bold as any,
      color: '#ffffff',
      includeFontPadding: false,
    },
    divider: {
      height: 1,
      backgroundColor: '#e3e3e3',
    },
    statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 22 * scaleX,
      paddingVertical: 22 * scaleX,
    },
    statusItem: {
      alignItems: 'center',
      width: 80 * scaleX,
    },
    statusCircle: {
      width: 50.017 * scaleX,
      height: 50.017 * scaleX,
      borderRadius: 37 * scaleX,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
    },
    statusBadge: {
      position: 'absolute',
      width: 34 * scaleX,
      height: 34 * scaleX,
      borderRadius: 17 * scaleX,
      backgroundColor: '#ffffff',
      right: -10 * scaleX,
      bottom: -6 * scaleX,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      elevation: 10,
    },
    statusBadgeText: {
      fontSize: 20 * scaleX,
      fontFamily: typography.fontFamily.primary,
      fontWeight: typography.fontWeights.bold as any,
      color: '#000000',
      includeFontPadding: false,
    },
    statusLabel: {
      marginTop: 12 * scaleX,
      fontSize: 14 * scaleX,
      fontFamily: typography.fontFamily.primary,
      fontWeight: typography.fontWeights.light as any,
      color: '#000000',
    },
    iconDefault: {
      width: 26 * scaleX,
      height: 26 * scaleX,
      tintColor: '#ffffff',
    },
    iconDirty: {
      width: 36 * scaleX,
      height: 36 * scaleX,
      // Use the asset directly (no tint) to match the Figma glyph.
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24 * scaleX,
      paddingVertical: 14 * scaleX,
    },
    progressTrack: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 18 * scaleX,
      borderRadius: 27 * scaleX,
      overflow: 'hidden',
      flex: 1,
      marginRight: 12 * scaleX,
    },
    progressLeft: {
      width: 42 * scaleX,
      height: '100%',
      backgroundColor: '#ff4dd8',
      borderTopLeftRadius: 27 * scaleX,
      borderBottomLeftRadius: 27 * scaleX,
    },
    progressMid: {
      width: 53 * scaleX,
      height: '100%',
      backgroundColor: '#ff4dd8',
    },
    progressRight: {
      flex: 1,
      height: '100%',
      backgroundColor: '#cdd3dd',
      borderTopRightRadius: 27 * scaleX,
      borderBottomRightRadius: 27 * scaleX,
    },
    progressText: {
      fontSize: 16 * scaleX,
      fontFamily: typography.fontFamily.primary,
      fontWeight: typography.fontWeights.bold as any,
      color: '#000000',
    },
    pausedPill: {
      marginHorizontal: 23 * scaleX,
      marginBottom: 16 * scaleX,
      marginTop: 4 * scaleX,
      height: 61 * scaleX,
      borderRadius: 108 * scaleX,
      backgroundColor: 'rgba(255,235,170,0.46)',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12 * scaleX,
    },
    pausedIconCircle: {
      width: 44 * scaleX,
      height: 44 * scaleX,
      borderRadius: 22 * scaleX,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12 * scaleX,
    },
    pausedIcon: {
      width: 18 * scaleX,
      height: 18 * scaleX,
      tintColor: '#5a759d',
    },
    pausedTextCol: { flex: 1, minWidth: 0 },
    pausedRoom: {
      fontSize: 13 * scaleX,
      fontFamily: typography.fontFamily.primary,
      fontWeight: typography.fontWeights.bold as any,
      color: '#f0be1b',
      includeFontPadding: false,
    },
    pausedTimer: {
      marginTop: 2 * scaleX,
      fontSize: 13 * scaleX,
      fontFamily: typography.fontFamily.primary,
      fontWeight: typography.fontWeights.regular as any,
      color: '#1e1e1e',
      includeFontPadding: false,
    },
    pausedRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6 * scaleX,
    },
    pausedRightIcon: {
      width: 14 * scaleX,
      height: 14 * scaleX,
      tintColor: '#5a759d',
    },
    pausedRightText: {
      fontSize: 11 * scaleX,
      fontFamily: typography.fontFamily.primary,
      fontWeight: typography.fontWeights.bold as any,
      color: '#5a759d',
      includeFontPadding: false,
    },
  });
}

