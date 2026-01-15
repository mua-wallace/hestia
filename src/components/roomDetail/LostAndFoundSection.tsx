import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, LOST_AND_FOUND, CONTENT_AREA } from '../../constants/roomDetailStyles';

interface LostAndFoundSectionProps {
  onAddPhotosPress?: () => void;
  onTitlePress?: () => void;
}

export default function LostAndFoundSection({
  onAddPhotosPress,
  onTitlePress,
}: LostAndFoundSectionProps) {
  return (
    <View style={styles.container}>
      {/* Section Title - "Lost & Found" */}
      <TouchableOpacity
        onPress={onTitlePress}
        activeOpacity={0.7}
        disabled={!onTitlePress}
      >
        <Text style={styles.title}>Lost & Found</Text>
      </TouchableOpacity>

      {/* Add Photos Box */}
      <TouchableOpacity
        style={styles.box}
        onPress={onAddPhotosPress}
        activeOpacity={0.7}
      >
        {/* Left: Icon with plus sign overlay */}
        <View style={styles.iconContainer}>
          <Image
            source={require('../../../assets/icons/add-photo-basket.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.plusIcon}>+</Text>
        </View>
        
        {/* Right: Text */}
        <Text style={styles.addPhotosText}>Add Lost & Found</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    marginTop: 26 * scaleX, // Space between card (ends at 880.09px) and title (906px) = 26px
    minHeight: ((LOST_AND_FOUND.box.top - LOST_AND_FOUND.title.top) + LOST_AND_FOUND.box.height + 20) * scaleX, // Full height needed
    overflow: 'visible',
  },
  title: {
    position: 'absolute',
    left: LOST_AND_FOUND.title.left * scaleX,
    top: 0, // Title at top of container (absolute 906px achieved via marginTop on container)
    fontSize: LOST_AND_FOUND.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: LOST_AND_FOUND.title.color,
    lineHeight: LOST_AND_FOUND.title.fontSize * scaleX,
    zIndex: 10, // Ensure visibility
  },
  box: {
    position: 'absolute',
    left: LOST_AND_FOUND.box.left * scaleX,
    top: (LOST_AND_FOUND.box.top - LOST_AND_FOUND.title.top) * scaleX, // 34px below title (940 - 906)
    width: LOST_AND_FOUND.box.width * scaleX,
    height: LOST_AND_FOUND.box.height * scaleX,
    borderRadius: LOST_AND_FOUND.box.borderRadius * scaleX,
    borderWidth: LOST_AND_FOUND.box.borderWidth,
    borderColor: LOST_AND_FOUND.box.borderColor,
    borderStyle: LOST_AND_FOUND.box.borderStyle,
    backgroundColor: LOST_AND_FOUND.box.backgroundColor,
    // Horizontal flex layout: icon on left, text on right
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around', // Space around items, not between
    paddingHorizontal: 16 * scaleX,
  },
  iconContainer: {
    position: 'relative',
    width: LOST_AND_FOUND.icon.width * scaleX,
    height: LOST_AND_FOUND.icon.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: LOST_AND_FOUND.icon.width * scaleX,
    height: LOST_AND_FOUND.icon.height * scaleX,
  },
  plusIcon: {
    position: 'absolute',
    // Plus icon positioned at top-right of the icon
    // From constants: plusIcon left: 213, top: 23 (relative to box)
    // Icon is at left: 160, so plus offset from icon left: 213 - 160 = 53px
    // Icon top is at 31.02px, plus top is at 23px, so plus offset: 23 - 31.02 = -8.02px
    left: (LOST_AND_FOUND.plusIcon.left - LOST_AND_FOUND.icon.left) * scaleX, // 213 - 160 = 53px from icon left
    top: (LOST_AND_FOUND.plusIcon.top - LOST_AND_FOUND.icon.top) * scaleX, // 23 - 31.02 = -8.02px from icon top
    fontSize: LOST_AND_FOUND.plusIcon.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: LOST_AND_FOUND.plusIcon.color,
  },
  addPhotosText: {
    fontSize: LOST_AND_FOUND.addPhotosText.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: LOST_AND_FOUND.addPhotosText.color,
    // Text on the right side of the flex container
    textAlign: 'right',
  },
});

