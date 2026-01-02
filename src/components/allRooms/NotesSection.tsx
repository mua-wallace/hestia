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

  const rushedIconPos = isArrivalDeparture
    ? NOTES_SECTION.rushedIcon.positions.arrivalDeparture
    : NOTES_SECTION.rushedIcon.positions.withNotes;

  const containerBackground = isArrivalDeparture 
    ? NOTES_SECTION.background 
    : NOTES_SECTION.backgroundWithNotes;

  return (
    <View style={[
      styles.container, 
      { 
        left: position.left * scaleX, 
        top: position.top * scaleX,
        backgroundColor: containerBackground,
      }
    ]}>
      {/* Rushed Icon (leftmost) */}
      {notes.hasRushed && (
        <Image
          source={require('../../../assets/icons/priority-icon.png')}
          style={[styles.rushedIcon, { left: rushedIconPos.left * scaleX, top: rushedIconPos.top * scaleX }]}
          resizeMode="contain"
        />
      )}
      
      {/* Notes Icon (right of rushed icon) */}
      <Image
        source={require('../../../assets/icons/notes-icon.png')}
        style={[styles.notesIcon, { left: iconPos.left * scaleX, top: iconPos.top * scaleX }]}
        resizeMode="contain"
      />

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
    paddingVertical: NOTES_SECTION.paddingVertical * scaleX,
    paddingHorizontal: NOTES_SECTION.paddingHorizontal * scaleX,
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
    width: NOTES_SECTION.icon.width * scaleX, // Same size as notes icon
    height: NOTES_SECTION.icon.height * scaleX, // Same size as notes icon
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

