/**
 * Lost & Found Item Display Component
 * Displays a single lost and found item for Stayover/Turndown rooms
 * Based on Figma designs: node-id=1772:406 (Stayover) and node-id=1772:601 (Turndown)
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX } from '../../constants/roomDetailStyles';
import type { LostAndFoundItem } from '../../types/lostAndFound.types';

interface LostAndFoundItemDisplayProps {
  item: LostAndFoundItem;
  onPress?: () => void;
}

export default function LostAndFoundItemDisplay({ item, onPress }: LostAndFoundItemDisplayProps) {
  // Get status badge color based on status
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'stored':
        return '#41d541'; // Green
      case 'returned':
        return '#5a759d'; // Blue
      case 'shipped':
        return '#f0be1b'; // Yellow
      case 'discarded':
        return '#f92424'; // Red
      default:
        return '#5a759d'; // Default blue
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Item Image */}
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      {/* Item Details */}
      <View style={styles.detailsContainer}>
        {/* Item Name */}
        <Text style={styles.itemName} numberOfLines={1}>
          {item.itemName}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {item.location}
        </Text>

        {/* Status and Location Row */}
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Text style={styles.locationText} numberOfLines={1}>
            {item.storedLocation}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFC',
    borderRadius: 12 * scaleX,
    borderWidth: 1,
    borderColor: 'rgba(90, 117, 157, 0.23)',
    padding: 12 * scaleX,
    minHeight: 100 * scaleX,
  },
  imageContainer: {
    marginRight: 12 * scaleX,
  },
  image: {
    width: 76 * scaleX,
    height: 80 * scaleX,
    borderRadius: 10 * scaleX,
  },
  placeholderImage: {
    backgroundColor: '#e3e3e3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#5a759d',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 19 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#5a759d',
    marginBottom: 4 * scaleX,
  },
  description: {
    fontSize: 11 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#000000',
    marginBottom: 8 * scaleX,
    lineHeight: 14 * scaleX,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * scaleX,
  },
  statusBadge: {
    paddingHorizontal: 10 * scaleX,
    paddingVertical: 4 * scaleX,
    borderRadius: 6 * scaleX,
  },
  statusText: {
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#ffffff',
  },
  locationText: {
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: '#000000',
    flex: 1,
  },
});
