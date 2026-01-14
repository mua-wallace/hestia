import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, TASK_SECTION } from '../../constants/roomDetailStyles';

interface TaskSectionProps {
  onAddPress?: () => void;
}

export default function TaskSection({ onAddPress }: TaskSectionProps) {
  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={styles.title}>Task</Text>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddPress}
        activeOpacity={0.7}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    minHeight: 50 * scaleX, // Minimum height for the section within card
  },
  title: {
    position: 'absolute',
    left: TASK_SECTION.title.left * scaleX,
    top: TASK_SECTION.title.top * scaleX, // Relative to card content area
    fontSize: TASK_SECTION.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: TASK_SECTION.title.color,
  },
  addButton: {
    position: 'absolute',
    left: TASK_SECTION.addButton.left * scaleX,
    top: TASK_SECTION.addButton.top * scaleX, // Relative to card content area
    width: TASK_SECTION.addButton.width * scaleX,
    height: TASK_SECTION.addButton.height * scaleX,
    borderRadius: TASK_SECTION.addButton.borderRadius * scaleX,
    borderWidth: TASK_SECTION.addButton.borderWidth,
    borderColor: TASK_SECTION.addButton.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: TASK_SECTION.addButton.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: TASK_SECTION.addButton.color,
  },
});
