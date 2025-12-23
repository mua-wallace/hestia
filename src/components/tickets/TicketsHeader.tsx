import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import {
  TICKETS_HEADER,
  TICKETS_COLORS,
  TICKETS_TYPOGRAPHY,
  scaleX,
} from '../../constants/ticketsStyles';

interface TicketsHeaderProps {
  onBackPress?: () => void;
  onCreatePress?: () => void;
}

export default function TicketsHeader({
  onBackPress,
  onCreatePress,
}: TicketsHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Blue background */}
      <View style={styles.headerBackground} />

      {/* Top section with back button, title, and create button */}
      <View style={styles.topSection}>
        {/* Back arrow */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress || (() => {})}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/icons/navigation/back-arrow.png')}
            style={styles.backArrow}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Tickets</Text>

        {/* Create Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={onCreatePress || (() => {})}
          activeOpacity={0.7}
        >
          <Text style={styles.createButtonText}>
            <Text style={styles.plusSymbol}>+ </Text>
            <Text style={styles.createText}>Create</Text>
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
    height: TICKETS_HEADER.height * scaleX,
    zIndex: 10,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TICKETS_HEADER.background.height * scaleX,
    backgroundColor: TICKETS_COLORS.headerBackground,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: TICKETS_HEADER.backButton.left * scaleX,
    paddingTop: TICKETS_HEADER.backButton.top * scaleX,
    height: TICKETS_HEADER.background.height * scaleX,
  },
  backButton: {
    position: 'absolute',
    left: TICKETS_HEADER.backButton.left * scaleX,
    top: TICKETS_HEADER.backButton.top * scaleX,
    width: TICKETS_HEADER.backButton.width * scaleX,
    height: TICKETS_HEADER.backButton.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: TICKETS_HEADER.backButton.width * scaleX,
    height: TICKETS_HEADER.backButton.height * scaleX,
    transform: [{ rotate: '270deg' }],
  },
  title: {
    fontSize: TICKETS_TYPOGRAPHY.headerTitle.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: TICKETS_TYPOGRAPHY.headerTitle.fontWeight as any,
    color: TICKETS_TYPOGRAPHY.headerTitle.color,
    position: 'absolute',
    left: TICKETS_HEADER.title.left * scaleX,
    top: TICKETS_HEADER.title.top * scaleX,
  },
  createButton: {
    position: 'absolute',
    right: TICKETS_HEADER.createButton.right * scaleX,
    top: TICKETS_HEADER.createButton.top * scaleX,
  },
  createButtonText: {
    fontSize: TICKETS_TYPOGRAPHY.createButton.plusFontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: TICKETS_TYPOGRAPHY.createButton.plusFontWeight as any,
    color: TICKETS_TYPOGRAPHY.createButton.color,
  },
  plusSymbol: {
    fontSize: TICKETS_TYPOGRAPHY.createButton.plusFontSize * scaleX,
    fontWeight: TICKETS_TYPOGRAPHY.createButton.plusFontWeight as any,
  },
  createText: {
    fontSize: TICKETS_TYPOGRAPHY.createButton.textFontSize * scaleX,
    fontWeight: TICKETS_TYPOGRAPHY.createButton.textFontWeight as any,
  },
});

