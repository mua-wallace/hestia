import React, { useState, useCallback } from 'react';
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
  const NOTES_SECTION_START = 1105; // From Figma: Notes icon/section starts at 1105px absolute
  const FIRST_NOTE_TOP = 1169; // From Figma: First note text at 1169px absolute
  const [noteHeights, setNoteHeights] = useState<{ [key: string]: number }>({});
  
  // Relative spacing: 10-15% of the previous note's height, with a minimum of 8px
  const getSpacingBetweenNotes = (previousNoteHeight: number): number => {
    const relativeSpacing = previousNoteHeight * 0.12; // 12% of previous note height
    const minSpacing = 8 * scaleX; // Minimum 8px scaled
    return Math.max(relativeSpacing, minSpacing);
  };
  
  // Handle height measurement from NoteItem
  const handleNoteHeightMeasured = useCallback((noteId: string, height: number) => {
    setNoteHeights(prev => {
      if (prev[noteId] !== height) {
        return { ...prev, [noteId]: height };
      }
      return prev;
    });
  }, []);
  
  // Calculate positions for each note dynamically based on actual measured heights
  const calculateNotePositions = (): number[] => {
    const positions: number[] = [];
    let currentTop = FIRST_NOTE_TOP;
    
    notes.forEach((note, index) => {
      if (index === 0) {
        positions.push(currentTop);
      } else {
        // Get previous note's actual measured height, or use estimated if not yet measured
        const previousNote = notes[index - 1];
        const previousNoteHeight = noteHeights[previousNote.id] || estimateNoteHeight(previousNote.text);
        
        // Calculate relative spacing based on previous note's height
        const spacing = getSpacingBetweenNotes(previousNoteHeight);
        
        // Next note starts after previous note's bottom + relative spacing
        currentTop = positions[index - 1] + previousNoteHeight + spacing;
        positions.push(currentTop);
      }
    });
    
    return positions;
  };
  
  // Fallback estimation for initial render before heights are measured
  const estimateNoteHeight = (text: string): number => {
    const charsPerLine = 50;
    const lineHeight = 18 * scaleX;
    const estimatedLines = Math.ceil(text.length / charsPerLine);
    const textHeight = estimatedLines * lineHeight;
    // Add profile + name section height (scaled)
    const profileNameSectionHeight = (10 + 25 + 5 + 11) * scaleX; // spacing + profile + offset + name
    return textHeight + profileNameSectionHeight;
  };
  
  const notePositions = calculateNotePositions();
  
  // Calculate dynamic container height based on last note
  const calculateContainerHeight = () => {
    if (notes.length === 0) {
      return 100 * scaleX; // Default height when no notes
    }
    const lastNote = notes[notes.length - 1];
    const lastNoteTop = notePositions[notePositions.length - 1];
    const lastNoteHeight = noteHeights[lastNote.id] || estimateNoteHeight(lastNote.text);
    const lastNoteBottom = lastNoteTop + lastNoteHeight;
    return (lastNoteBottom - NOTES_SECTION_START + 50) * scaleX; // Add padding relative to section start
  };

  return (
    <View style={[styles.container, { minHeight: calculateContainerHeight() }]}>
      {/* Section Header - Icon */}
      <Image
        source={require('../../../assets/icons/notes-icon.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      
      {/* Section Header - Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{notes.length}</Text>
      </View>
      
      {/* Section Header - Title */}
      <Text style={styles.title}>Notes</Text>

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
        return (
          <NoteItem
            key={note.id}
            note={note}
            absoluteTop={notePositions[index]}
            contentAreaTop={NOTES_SECTION_START} // Notes section starts at 1110px from Figma
            onHeightMeasured={(height) => handleNoteHeightMeasured(note.id, height)}
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
    // From Figma: Notes section header starts at ~1105px (icon top)
    // Lost & Found box ends at 940 + 97 = 1037px
    // Gap: 1105 - 1037 = 68px (matches Figma spacing to icon)
    marginTop: 68 * scaleX, // 68px gap from Lost & Found box end to Notes icon start
    minHeight: 200 * scaleX, // Default height, will be overridden dynamically
  },
  icon: {
    position: 'absolute',
    left: NOTES_SECTION.icon.left * scaleX,
    top: (NOTES_SECTION.icon.top - 1105) * scaleX, // Relative to container start at 1105px: 1105 - 1105 = 0px
    width: NOTES_SECTION.icon.width * scaleX,
    height: NOTES_SECTION.icon.height * scaleX,
  },
  badge: {
    position: 'absolute',
    left: NOTES_SECTION.badge.left * scaleX,
    top: (NOTES_SECTION.badge.top - 1105) * scaleX, // Relative to container start at 1105px: 1109 - 1105 = 4px
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
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  title: {
    position: 'absolute',
    left: NOTES_SECTION.title.left * scaleX,
    top: (NOTES_SECTION.title.top - 1105) * scaleX, // Relative to container start at 1105px: 1110 - 1105 = 5px
    fontSize: NOTES_SECTION.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: NOTES_SECTION.title.color,
  },
  addButton: {
    position: 'absolute',
    left: NOTES_SECTION.addButton.left * scaleX,
    top: (NOTES_SECTION.addButton.top - 1105) * scaleX, // Relative to container start at 1105px: 1098 - 1105 = -7px
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

