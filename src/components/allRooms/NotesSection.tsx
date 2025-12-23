import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';
import { NotesInfo } from '../../types/allRooms.types';
import { scaleX, NOTES_SECTION } from '../../constants/allRoomsStyles';

interface NotesSectionProps {
  notes: NotesInfo;
  isArrivalDeparture?: boolean;
}

export default function NotesSection({ notes, isArrivalDeparture = false }: NotesSectionProps) {
  const position = isArrivalDeparture 
    ? NOTES_SECTION.positions.arrivalDeparture 
    : NOTES_SECTION.positions.withNotes;
  const iconPos = isArrivalDeparture 
    ? NOTES_SECTION.icon.positions.arrivalDeparture 
    : NOTES_SECTION.icon.positions.withNotes;
  const badgePos = isArrivalDeparture 
    ? NOTES_SECTION.badge.positions.arrivalDeparture 
    : NOTES_SECTION.badge.positions.withNotes;
  const textPos = isArrivalDeparture 
    ? NOTES_SECTION.text.positions.arrivalDeparture 
    : NOTES_SECTION.text.positions.withNotes;

  return (
    <View style={[styles.container, { left: position.left * scaleX, top: position.top * scaleX }]}>
      {/* Notes Icon */}
      <Image
        source={require('../../../assets/icons/rooms/notes-icon.png')}
        style={[styles.notesIcon, { left: iconPos.left * scaleX, top: iconPos.top * scaleX }]}
        resizeMode="contain"
      />
      
      {notes.hasRushed && (
        <Image
          source={require('../../../assets/icons/rooms/rushed-icon.png')}
          style={[styles.rushedIcon, { left: NOTES_SECTION.rushedIcon.left * scaleX, top: NOTES_SECTION.rushedIcon.top * scaleX }]}
          resizeMode="contain"
        />
      )}

      {/* Count Badge */}
      <View style={[styles.badgeContainer, { left: badgePos.left * scaleX, top: badgePos.top * scaleX }]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{notes.count}</Text>
        </View>
      </View>

      {/* Text */}
      <Text style={[styles.notesText, { left: textPos.left * scaleX, top: textPos.top * scaleX }]}>
        {notes.hasRushed ? 'Rushed and notes' : `${notes.count} notes`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NOTES_SECTION.background,
    borderRadius: NOTES_SECTION.borderRadius * scaleX,
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: NOTES_SECTION.height * scaleX,
    width: NOTES_SECTION.width * scaleX,
  },
  notesIcon: {
    position: 'absolute',
    width: NOTES_SECTION.icon.width * scaleX,
    height: NOTES_SECTION.icon.height * scaleX,
  },
  rushedIcon: {
    position: 'absolute',
    width: NOTES_SECTION.rushedIcon.width * scaleX,
    height: NOTES_SECTION.rushedIcon.height * scaleX,
  },
  badgeContainer: {
    position: 'absolute',
  },
  badge: {
    width: NOTES_SECTION.badge.width * scaleX,
    height: NOTES_SECTION.badge.height * scaleX,
    borderRadius: NOTES_SECTION.badge.borderRadius * scaleX,
    backgroundColor: NOTES_SECTION.badge.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: NOTES_SECTION.badge.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: NOTES_SECTION.badge.color,
    lineHeight: NOTES_SECTION.badge.lineHeight * scaleX,
  },
  notesText: {
    position: 'absolute',
    fontSize: NOTES_SECTION.text.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: NOTES_SECTION.text.color,
    lineHeight: NOTES_SECTION.text.lineHeight * scaleX,
  },
});

