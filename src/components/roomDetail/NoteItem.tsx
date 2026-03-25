import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet, LayoutChangeEvent } from 'react-native';
import { scaleX, NOTES_SECTION } from '../../constants/roomDetailStyles';
import type { Note } from '../../types/roomDetail.types';

interface NoteItemProps {
  note: Note;
  onHeightMeasured?: (height: number) => void;
}

export default function NoteItem({ note, onHeightMeasured }: NoteItemProps) {
  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      onHeightMeasured?.(e.nativeEvent.layout.height);
    },
    [onHeightMeasured]
  );

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      <Text style={styles.noteText}>{note.text}</Text>
      <View style={styles.footerRow}>
        <Image
          source={
            typeof note.staff.avatar === 'string'
              ? { uri: note.staff.avatar }
              : note.staff.avatar || require('../../../assets/icons/profile-avatar.png')
          }
          style={styles.profilePicture}
          resizeMode="cover"
        />
        <Text style={styles.staffName}>{note.staff.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: 20 * scaleX,
  },
  noteText: {
    fontFamily: NOTES_SECTION.note.text.fontFamily,
    fontSize: NOTES_SECTION.note.text.fontSize * scaleX,
    fontStyle: NOTES_SECTION.note.text.fontStyle,
    fontWeight: NOTES_SECTION.note.text.fontWeight as '300',
    color: NOTES_SECTION.note.text.color,
    lineHeight: 20 * scaleX,
    marginBottom: 10 * scaleX,
    paddingHorizontal: 4 * scaleX,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: NOTES_SECTION.note.profilePicture.width * scaleX,
    height: NOTES_SECTION.note.profilePicture.height * scaleX,
    borderRadius: (NOTES_SECTION.note.profilePicture.width / 2) * scaleX,
    marginRight: 8 * scaleX,
  },
  staffName: {
    fontFamily: NOTES_SECTION.note.staffName.fontFamily,
    fontSize: NOTES_SECTION.note.staffName.fontSize * scaleX,
    fontStyle: NOTES_SECTION.note.staffName.fontStyle,
    fontWeight: NOTES_SECTION.note.staffName.fontWeight as '700',
    color: NOTES_SECTION.note.staffName.color,
  },
});
