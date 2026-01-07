import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import {
  LOST_AND_FOUND_HEADER,
  LOST_AND_FOUND_COLORS,
  LOST_AND_FOUND_TYPOGRAPHY,
  scaleX,
} from '../../constants/lostAndFoundStyles';

interface LostAndFoundHeaderProps {
  onBackPress?: () => void;
  onRegisterPress?: () => void;
}

export default function LostAndFoundHeader({
  onBackPress,
  onRegisterPress,
}: LostAndFoundHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Blue background */}
      <View style={styles.headerBackground} />

      {/* Top section with back button, title, and register button */}
      <View style={styles.topSection}>
        {/* Back arrow */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress || (() => {})}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/icons/back-arrow.png')}
            style={styles.backArrow}
            resizeMode="contain"
            tintColor="#607AA1"
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Lost & Found</Text>

        {/* Register Button */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={onRegisterPress || (() => {})}
          activeOpacity={0.7}
        >
          <Text style={styles.registerButtonText}>
            <Text style={styles.plusSymbol}>+ </Text>
            <Text style={styles.registerText}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: LOST_AND_FOUND_HEADER.height * scaleX,
    zIndex: 10,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: LOST_AND_FOUND_HEADER.background.height * scaleX,
    backgroundColor: LOST_AND_FOUND_COLORS.headerBackground,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LOST_AND_FOUND_HEADER.backButton.left * scaleX,
    paddingTop: LOST_AND_FOUND_HEADER.backButton.top * scaleX,
    height: LOST_AND_FOUND_HEADER.background.height * scaleX,
  },
  backButton: {
    position: 'absolute',
    left: LOST_AND_FOUND_HEADER.backButton.left * scaleX,
    top: LOST_AND_FOUND_HEADER.backButton.top * scaleX,
    width: LOST_AND_FOUND_HEADER.backButton.width * scaleX,
    height: LOST_AND_FOUND_HEADER.backButton.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: LOST_AND_FOUND_HEADER.backButton.width * scaleX,
    height: LOST_AND_FOUND_HEADER.backButton.height * scaleX,
  },
  title: {
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.headerTitle.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.headerTitle.fontWeight as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.headerTitle.color,
    position: 'absolute',
    left: LOST_AND_FOUND_HEADER.title.left * scaleX,
    top: LOST_AND_FOUND_HEADER.title.top * scaleX,
  },
  registerButton: {
    position: 'absolute',
    right: LOST_AND_FOUND_HEADER.registerButton.right * scaleX,
    top: LOST_AND_FOUND_HEADER.registerButton.top * scaleX,
  },
  registerButtonText: {
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.registerButton.plusFontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.registerButton.plusFontWeight as any,
    color: LOST_AND_FOUND_TYPOGRAPHY.registerButton.color,
  },
  plusSymbol: {
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.registerButton.plusFontSize * scaleX,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.registerButton.plusFontWeight as any,
  },
  registerText: {
    fontSize: LOST_AND_FOUND_TYPOGRAPHY.registerButton.textFontSize * scaleX,
    fontWeight: LOST_AND_FOUND_TYPOGRAPHY.registerButton.textFontWeight as any,
  },
});

