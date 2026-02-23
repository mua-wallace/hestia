/**
 * Full-screen or inline loading overlay with ActivityIndicator
 */
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors, typography } from '../../theme';

interface LoadingOverlayProps {
  /** If true, overlay covers the whole screen (absolute). Otherwise inline. */
  fullScreen?: boolean;
  message?: string;
}

export function LoadingOverlay({ fullScreen = false, message }: LoadingOverlayProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.primary.main} />
      {message != null && message !== '' ? (
        <Text style={styles.message}>{typeof message === 'string' ? message : String(message)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background.overlay ?? 'rgba(255,255,255,0.85)',
    zIndex: 1000,
  },
  message: {
    marginTop: 12,
    fontSize: 12,
    color: colors.text.secondary,
  },
});
