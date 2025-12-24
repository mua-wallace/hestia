import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, getStatusColor, getStatusBackgroundColor } from '../theme';
import type { RoomStatus } from '../types';

interface StatusBadgeProps {
  status: RoomStatus;
  count?: number;
  size?: number;
  showCount?: boolean;
  style?: ViewStyle;
}

export default function StatusBadge({
  status,
  count,
  size = 50,
  showCount = false,
  style,
}: StatusBadgeProps) {
  const statusColor = getStatusColor(status);
  const backgroundColor = getStatusBackgroundColor(status);

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.badge,
          {
            width: size,
            height: size,
            borderRadius: parseInt(borderRadius['4xl']),
            backgroundColor: statusColor,
          },
        ]}
      >
        {showCount && count !== undefined && (
          <View style={styles.countContainer}>
            <Text style={styles.count}>{count}</Text>
          </View>
        )}
      </View>
      {showCount && (
        <Text style={styles.label}>
          {status === 'inProgress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  count: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    fontFamily: 'Helvetica',
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: colors.text.primary,
    fontFamily: 'Inter',
    fontWeight: '300',
  },
});

