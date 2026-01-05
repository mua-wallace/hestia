import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RETURN_LATER_MODAL, scaleX } from '../../constants/returnLaterModalStyles';
import TimeSuggestionButton from './TimeSuggestionButton';

interface TimeSuggestionsContainerProps {
  suggestions: string[];
  selectedSuggestion: string | null;
  onSuggestionSelect: (suggestion: string) => void;
}

export default function TimeSuggestionsContainer({
  suggestions,
  selectedSuggestion,
  onSuggestionSelect,
}: TimeSuggestionsContainerProps) {
  return (
    <View style={styles.container}>
      {suggestions.map((suggestion) => (
        <TimeSuggestionButton
          key={suggestion}
          label={suggestion}
          isSelected={selectedSuggestion === suggestion}
          onPress={() => onSuggestionSelect(suggestion)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: RETURN_LATER_MODAL.suggestions.gap * scaleX,
  },
});

