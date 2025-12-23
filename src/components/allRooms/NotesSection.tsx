import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { colors, typography } from '../../theme';
import { NotesInfo } from '../../types/allRooms.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface NotesSectionProps {
  notes: NotesInfo;
}

export default function NotesSection({ notes }: NotesSectionProps) {
  return (
    <View style={styles.container}>
      {/* Notes Icon */}
      <Image
        source={require('../../../assets/icons/rooms/notes-icon.png')}
        style={styles.notesIcon}
        resizeMode="contain"
      />
      
      {notes.hasRushed && (
        <Image
          source={require('../../../assets/icons/rooms/rushed-icon.png')}
          style={styles.rushedIcon}
          resizeMode="contain"
        />
      )}

      {/* Count Badge */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{notes.count}</Text>
        </View>
      </View>

      {/* Text */}
      <Text style={styles.notesText}>
        {notes.hasRushed ? 'Rushed and notes' : `${notes.count} notes`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 12 * scaleX,
    left: 19 * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: 10 * scaleX,
    paddingVertical: 8 * scaleX,
    paddingHorizontal: 12 * scaleX,
    height: 54 * scaleX,
  },
  notesIcon: {
    width: 31.974 * scaleX,
    height: 31.974 * scaleX,
    marginRight: 8 * scaleX,
  },
  rushedIcon: {
    width: 31.974 * scaleX,
    height: 31.974 * scaleX,
    marginRight: 8 * scaleX,
  },
  badgeContainer: {
    position: 'absolute',
    left: 50 * scaleX,
    top: 12 * scaleX,
  },
  badge: {
    width: 20.455 * scaleX,
    height: 20.455 * scaleX,
    borderRadius: 10.2275 * scaleX,
    backgroundColor: '#f92424',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 15 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: colors.text.white,
  },
  notesText: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.primary.main,
    marginLeft: 12 * scaleX,
  },
});

