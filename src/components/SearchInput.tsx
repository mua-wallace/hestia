import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { typography, colors } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface SearchInputProps {
  placeholder: string | { bold: string; normal: string }; // Support both simple string and bold/normal parts
  onSearch: (text: string) => void;
  value?: string; // Optional controlled value
  onChangeText?: (text: string) => void; // Optional controlled onChange
  inputStyle?: object; // Style for the TextInput
  placeholderStyle?: object; // Style for placeholder text
  placeholderBoldStyle?: object; // Style for bold part of placeholder
  placeholderNormalStyle?: object; // Style for normal part of placeholder
  inputWrapperStyle?: object; // Style for input wrapper
}

export default function SearchInput({
  placeholder,
  onSearch,
  value: controlledValue,
  onChangeText: controlledOnChangeText,
  inputStyle,
  placeholderStyle,
  placeholderBoldStyle,
  placeholderNormalStyle,
  inputWrapperStyle,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState('');
  
  // Use controlled value if provided, otherwise use internal state
  const searchText = controlledValue !== undefined ? controlledValue : internalValue;
  const isControlled = controlledValue !== undefined;

  const handleSearchChange = (text: string) => {
    if (isControlled && controlledOnChangeText) {
      controlledOnChangeText(text);
    } else {
      setInternalValue(text);
    }
    onSearch(text);
  };

  // Determine if placeholder has bold/normal parts
  const hasBoldParts = typeof placeholder === 'object' && 'bold' in placeholder && 'normal' in placeholder;

  return (
    <View style={[styles.searchInputContainer, inputWrapperStyle]}>
      <TextInput
        style={[styles.searchInput, inputStyle]}
        value={searchText}
        onChangeText={handleSearchChange}
        placeholder=""
        placeholderTextColor="transparent"
      />
      
      {/* Custom placeholder */}
      {searchText === '' && (
        <View style={styles.placeholderContainer} pointerEvents="none">
          {hasBoldParts ? (
            <Text style={[styles.placeholderText, placeholderStyle]}>
              <Text style={[styles.placeholderBold, placeholderBoldStyle]}>
                {placeholder.bold}
              </Text>
              <Text style={[styles.placeholderNormal, placeholderNormalStyle]}>
                {placeholder.normal}
              </Text>
            </Text>
          ) : (
            <Text style={[styles.placeholderText, styles.placeholderBold, placeholderStyle]}>
              {placeholder}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchInputContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 13 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: colors.text.primary,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
    height: 59 * scaleX,
  },
  placeholderContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  placeholderText: {
    fontSize: 13 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#b1afaf',
    opacity: 0.36,
  },
  placeholderBold: {
    fontWeight: typography.fontWeights.semiBold as any,
  },
  placeholderNormal: {
    fontWeight: typography.fontWeights.light as any,
  },
});

