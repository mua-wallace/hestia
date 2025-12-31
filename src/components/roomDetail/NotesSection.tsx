import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, NOTES_SECTION } from '../../constants/roomDetailStyles';
import NoteItem from './NoteItem';
import type { Note } from '../../types/roomDetail.types';

interface NotesSectionProps {
  notes: Note[];
  onAddPress?: () => void;
}

export default function NotesSection({ notes, onAddPress }: NotesSectionProps) {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/icons/notes.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{notes.length}</Text>
        </View>
        <Text style={[styles.title, { marginLeft: 30 * scaleX }]}>Notes</Text>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddPress}
        activeOpacity={0.7}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      {/* Notes List */}
      {notes.map((note, index) => {
        const noteAbsoluteTop = index === 0 
          ? NOTES_SECTION.note.text.top 
          : NOTES_SECTION.note.note2.textTop;
        return (
          <NoteItem
            key={note.id}
            note={note}
            absoluteTop={noteAbsoluteTop}
            contentAreaTop={646} // Notes section starts at 646px
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    minHeight: (879 - 646 + 50) * scaleX, // From Notes start (646) to last staff name (879) + padding = 233px + 50px
    marginTop: (646 - 625) * scaleX, // Space from previous divider (625) to Notes section (646) = 21px
  },
  header: {
    position: 'absolute',
    left: NOTES_SECTION.title.left * scaleX,
    top: (NOTES_SECTION.title.top - 646) * scaleX, // Relative to container start (646px)
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: (NOTES_SECTION.icon.left - NOTES_SECTION.title.left) * scaleX, // Relative to header: 25 - 52 = -27px
    top: (NOTES_SECTION.icon.top - NOTES_SECTION.title.top) * scaleX, // Relative to header: 647 - 652 = -5px
    width: NOTES_SECTION.icon.width * scaleX,
    height: NOTES_SECTION.icon.height * scaleX,
  },
  badge: {
    position: 'absolute',
    left: (NOTES_SECTION.badge.left - NOTES_SECTION.title.left) * scaleX, // Relative to header
    top: (NOTES_SECTION.badge.top - NOTES_SECTION.title.top) * scaleX, // Relative to header
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
  },
  title: {
    fontSize: NOTES_SECTION.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: NOTES_SECTION.title.color,
  },
  addButton: {
    position: 'absolute',
    left: NOTES_SECTION.addButton.left * scaleX,
    top: (NOTES_SECTION.addButton.top - 646) * scaleX, // Relative to container start (646px)
    width: NOTES_SECTION.addButton.width * scaleX,
    height: NOTES_SECTION.addButton.height * scaleX,
    borderRadius: NOTES_SECTION.addButton.borderRadius * scaleX,
    borderWidth: NOTES_SECTION.addButton.borderWidth,
    borderColor: NOTES_SECTION.addButton.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: NOTES_SECTION.addButton.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: NOTES_SECTION.addButton.color,
  },
});

