import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { typography } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface PriorityBadgeProps {
  count: number;
}

export default function PriorityBadge({ count }: PriorityBadgeProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/icons/priority-icon.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.label}>Priority</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebeb',
    height: 33 * scaleX,
    paddingHorizontal: 16 * scaleX,
    borderRadius: 31 * scaleX,
  },
  icon: {
    width: 22 * scaleX,
    height: 22 * scaleX,
    tintColor: '#f92424',
    marginRight: 8 * scaleX,
  },
  label: {
    fontSize: 13 * scaleX,
    fontFamily: 'Inter',
    fontWeight: '600' as any,
    color: '#f92424',
    marginRight: 8 * scaleX,
  },
  count: {
    fontSize: 20 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#f92424',
  },
});

