import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, LayoutChangeEvent } from 'react-native';
import { typography } from '../../theme';
import { scaleX, NOTES_SECTION } from '../../constants/roomDetailStyles';
import type { Note } from '../../types/roomDetail.types';

interface NoteItemProps {
  note: Note;
  absoluteTop: number; // Absolute position from top of screen
  contentAreaTop: number; // Content area start position
  onHeightMeasured?: (height: number) => void; // Callback to report measured height
}

export default function NoteItem({ note, absoluteTop, contentAreaTop, onHeightMeasured }: NoteItemProps) {
  const containerTop = absoluteTop - contentAreaTop;
  const [textHeight, setTextHeight] = useState<number>(0);
  const containerRef = useRef<View>(null);
  
  // Spacing from text bottom to profile picture and staff name
  // Based on static notes: profile is 61px from text top (767 - 706 = 61px)
  // For single line text (18px line height), spacing from bottom = 61 - 18 = 43px
  // We'll use a consistent spacing that works for all text sizes
  // Profile picture and staff name should be aligned vertically (staff name slightly below profile center)
  const SPACING_FROM_TEXT_BOTTOM = 10 * scaleX; // Spacing between text bottom and profile picture
  const PROFILE_HEIGHT = NOTES_SECTION.note.profilePicture.height * scaleX; // 25px scaled
  const STAFF_NAME_OFFSET_FROM_PROFILE = (NOTES_SECTION.note.staffName.top - NOTES_SECTION.note.profilePicture.top) * scaleX; // 772 - 767 = 5px scaled
  const STAFF_NAME_HEIGHT = 11 * scaleX; // Approximate staff name height
  
  // Calculate positions relative to the text bottom
  const profileTop = textHeight + SPACING_FROM_TEXT_BOTTOM;
  // Staff name should be aligned with profile picture (5px below profile top, which centers it with the profile)
  const staffNameTop = profileTop + STAFF_NAME_OFFSET_FROM_PROFILE;
  
  // Calculate total note height (text + spacing + profile + name)
  const totalNoteHeight = textHeight + SPACING_FROM_TEXT_BOTTOM + PROFILE_HEIGHT + STAFF_NAME_OFFSET_FROM_PROFILE + STAFF_NAME_HEIGHT;

  const handleTextLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setTextHeight(height);
  };

  // Report total height when text height changes
  useEffect(() => {
    if (textHeight > 0 && onHeightMeasured) {
      onHeightMeasured(totalNoteHeight);
    }
  }, [textHeight, totalNoteHeight, onHeightMeasured]);

  return (
    <View 
      ref={containerRef}
      style={[styles.container, { top: containerTop * scaleX }]}
    >
      {/* Note Text */}
      <Text 
        style={styles.noteText}
        onLayout={handleTextLayout}
      >
        {note.text}
      </Text>

      {/* Profile Picture - positioned relative to text bottom */}
      {textHeight > 0 && (
        <>
          <Image
            source={note.staff.avatar || require('../../../assets/icons/profile-avatar.png')}
            style={[styles.profilePicture, { top: profileTop }]}
            resizeMode="cover"
          />

          {/* Staff Name - positioned relative to profile picture */}
          <Text style={[styles.staffName, { top: staffNameTop }]}>{note.staff.name}</Text>
        </>
      )}
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

