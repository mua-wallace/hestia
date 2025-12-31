import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, NOTES_SECTION } from '../../constants/roomDetailStyles';
import type { Note } from '../../types/roomDetail.types';

interface NoteItemProps {
  note: Note;
  absoluteTop: number; // Absolute position from top of screen
  contentAreaTop: number; // Content area start position
}

export default function NoteItem({ note, absoluteTop, contentAreaTop }: NoteItemProps) {
  const containerTop = absoluteTop - contentAreaTop;
  
  // Determine if this is the first or second note based on absoluteTop position
  const isFirstNote = absoluteTop === NOTES_SECTION.note.text.top;
  const profileTop = isFirstNote 
    ? (NOTES_SECTION.note.profilePicture.top - absoluteTop)
    : (NOTES_SECTION.note.note2.profileTop - absoluteTop);
  const staffNameTop = isFirstNote
    ? (NOTES_SECTION.note.staffName.top - absoluteTop)
    : (NOTES_SECTION.note.note2.staffNameTop - absoluteTop);

  return (
    <View style={[styles.container, { top: containerTop * scaleX }]}>
      {/* Note Text */}
      <Text style={styles.noteText}>{note.text}</Text>

      {/* Profile Picture */}
      <Image
        source={note.staff.avatar || require('../../../assets/icons/profile-avatar.png')}
        style={[styles.profilePicture, { top: profileTop * scaleX }]}
        resizeMode="cover"
      />

      {/* Staff Name */}
      <Text style={[styles.staffName, { top: staffNameTop * scaleX }]}>{note.staff.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  noteText: {
    position: 'absolute',
    left: NOTES_SECTION.note.text.left * scaleX,
    top: 0,
    fontSize: NOTES_SECTION.note.text.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: NOTES_SECTION.note.text.color,
    width: NOTES_SECTION.note.text.width * scaleX,
    lineHeight: 18 * scaleX,
  },
  profilePicture: {
    position: 'absolute',
    left: NOTES_SECTION.note.profilePicture.left * scaleX,
    width: NOTES_SECTION.note.profilePicture.width * scaleX,
    height: NOTES_SECTION.note.profilePicture.height * scaleX,
    borderRadius: (NOTES_SECTION.note.profilePicture.width / 2) * scaleX,
  },
  staffName: {
    position: 'absolute',
    left: NOTES_SECTION.note.staffName.left * scaleX,
    fontSize: NOTES_SECTION.note.staffName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: NOTES_SECTION.note.staffName.color,
  },
});

