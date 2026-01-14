import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, LOST_AND_FOUND } from '../../constants/roomDetailStyles';

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
      {/* Section Title */}
      <TouchableOpacity
        onPress={onTitlePress}
        activeOpacity={0.7}
        disabled={!onTitlePress}
      >
        <Text style={styles.title}>Lost and Found</Text>
      </TouchableOpacity>

      {/* Add Photos Box */}
      <TouchableOpacity
        style={styles.box}
        onPress={onAddPhotosPress}
        activeOpacity={0.7}
      >
        <Image
          source={require('../../../assets/icons/add-photo-basket.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.plusIcon}>+</Text>
        <Text style={styles.addPhotosText}>Add Lost & Found</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    minHeight: (1075.09 - 856.09 + 50) * scaleX, // From Lost and Found start (856.09) to box end (1075.09) + padding = 219px + 50px
    // Spacer handles the card space, Lost & Found starts immediately after card (0px margin)
    marginTop: (856.09 - 856.09) * scaleX, // 0px spacing after card ends
  },
  title: {
    position: 'absolute',
    left: LOST_AND_FOUND.title.left * scaleX,
    top: 0, // At top of container (container has marginTop to position it correctly)
    fontSize: LOST_AND_FOUND.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: LOST_AND_FOUND.title.color,
  },
  box: {
    position: 'absolute',
    left: LOST_AND_FOUND.box.left * scaleX,
    top: (LOST_AND_FOUND.box.top - LOST_AND_FOUND.title.top) * scaleX, // Relative to title (39px below title)
    width: LOST_AND_FOUND.box.width * scaleX,
    height: LOST_AND_FOUND.box.height * scaleX,
    borderRadius: LOST_AND_FOUND.box.borderRadius * scaleX,
    borderWidth: LOST_AND_FOUND.box.borderWidth,
    borderColor: LOST_AND_FOUND.box.borderColor,
    borderStyle: LOST_AND_FOUND.box.borderStyle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: LOST_AND_FOUND.icon.left * scaleX, // Relative to box (160px from box left)
    top: LOST_AND_FOUND.icon.top * scaleX, // Relative to box (31.02px from box top)
    width: LOST_AND_FOUND.icon.width * scaleX,
    height: LOST_AND_FOUND.icon.height * scaleX,
    zIndex: 1, // Ensure icon is visible
  },
  plusIcon: {
    position: 'absolute',
    left: LOST_AND_FOUND.plusIcon.left * scaleX, // Relative to box (213px from box left)
    top: LOST_AND_FOUND.plusIcon.top * scaleX, // Relative to box (23px from box top)
    fontSize: LOST_AND_FOUND.plusIcon.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: LOST_AND_FOUND.plusIcon.color,
  },
  addPhotosText: {
    position: 'absolute',
    left: LOST_AND_FOUND.addPhotosText.left * scaleX, // Relative to box (160px from box left, centered)
    top: LOST_AND_FOUND.addPhotosText.top * scaleX, // Relative to box (99px from box top)
    fontSize: LOST_AND_FOUND.addPhotosText.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: LOST_AND_FOUND.addPhotosText.color,
  },
});

